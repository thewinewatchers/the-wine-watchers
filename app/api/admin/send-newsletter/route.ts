import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type NewsletterMode = "test" | "campaign";

type NewsletterRequest = {
  mode?: unknown;
  testEmail?: unknown;
  subject?: unknown;
  preheader?: unknown;
  title?: unknown;
  message?: unknown;
  imageUrl?: unknown;
  imageUrls?: unknown;
  images?: unknown;
  additionalImages?: unknown;
  buttonLabel?: unknown;
  buttonUrl?: unknown;
  footerMessage?: unknown;
};

type NewsletterContent = {
  subject: string;
  preheader: string;
  title: string;
  message: string;
  imageUrls: string[];
  buttonLabel: string;
  buttonUrl: string;
  footerMessage: string;
};

type Subscriber = {
  id?: string;
  email: string;
};

type SendResult = {
  email: string;
  success: boolean;
  error?: string;
  resendId?: string;
};

const SITE_URL = "https://www.thewinewatchers.com";

const LOGO_URL = `${SITE_URL}/images/logo-tww.jpg`;
const DEFAULT_FOOTER =
  "Vous recevez cet e-mail car vous êtes inscrit à la newsletter The Wine Watchers.";

function getServerConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const resendApiKey = process.env.RESEND_API_KEY || "";

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    !supabaseServiceKey
  ) {
    throw new Error("Configuration Supabase manquante.");
  }

  if (!resendApiKey) {
    throw new Error("La clé RESEND_API_KEY est manquante.");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
    resendApiKey,
  };
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePublicUrl(value: unknown) {
  const url = normalizeText(value);

  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  if (url.startsWith("/")) {
    return `${SITE_URL}${url}`;
  }

  if (/^(images|uploads)\//i.test(url)) {
    return `${SITE_URL}/${url}`;
  }

  return `https://${url}`;
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => normalizeStringArray(item))
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const text = value.trim();

  if (!text) {
    return [];
  }

  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      const parsed = JSON.parse(text);
      return normalizeStringArray(parsed);
    } catch {
      // Continue avec la valeur texte.
    }
  }

  return text
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeImageUrls(body: NewsletterRequest) {
  const rawImages = [
    body.imageUrl,
    ...normalizeStringArray(body.imageUrls),
    ...normalizeStringArray(body.images),
    ...normalizeStringArray(body.additionalImages),
  ];

  return Array.from(
    new Set(
      rawImages
        .map((value) => normalizePublicUrl(value))
        .filter(Boolean)
    )
  );
}

function isValidPublicUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function escapeHtml(value: unknown) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value: unknown) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function getBearerToken(request: Request) {
  const authorization =
    request.headers.get("authorization") || "";

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return "";
  }

  return authorization.slice(7).trim();
}

async function requireAdmin(request: Request) {
  const {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
  } = getServerConfig();

  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return {
      error: NextResponse.json(
        { error: "Connexion administrateur requise." },
        { status: 401 }
      ),
    };
  }

  const supabaseAuth = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser(accessToken);

  if (userError || !user) {
    return {
      error: NextResponse.json(
        {
          error:
            "Session administrateur invalide ou expirée.",
        },
        { status: 401 }
      ),
    };
  }

  const allowedEmails = String(
    process.env.ADMIN_EMAILS || ""
  )
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = String(user.email || "")
    .trim()
    .toLowerCase();

  const metadataRole = String(
    user.app_metadata?.role ||
      user.user_metadata?.role ||
      ""
  )
    .trim()
    .toLowerCase();

  const metadataAdmin =
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.is_admin === true ||
    metadataRole === "admin";

  const emailAllowed =
    allowedEmails.length === 0 ||
    allowedEmails.includes(userEmail);

  if (!metadataAdmin && !emailAllowed) {
    return {
      error: NextResponse.json(
        { error: "Accès administrateur refusé." },
        { status: 403 }
      ),
    };
  }

  const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  return {
    user,
    supabaseAdmin,
  };
}

function parseNewsletterContent(
  body: NewsletterRequest
): NewsletterContent {
  return {
    subject: normalizeText(body.subject),
    preheader: normalizeText(body.preheader),
    title: normalizeText(body.title),
    message: normalizeText(body.message),
    imageUrls: normalizeImageUrls(body),
    buttonLabel: normalizeText(body.buttonLabel),
    buttonUrl: normalizePublicUrl(body.buttonUrl),
    footerMessage:
      normalizeText(body.footerMessage) || DEFAULT_FOOTER,
  };
}

function validateNewsletter(
  content: NewsletterContent
) {
  if (!content.subject) {
    return "Le sujet de la newsletter est obligatoire.";
  }

  if (!content.title) {
    return "Le titre principal est obligatoire.";
  }

  if (!content.message) {
    return "Le contenu de la newsletter est obligatoire.";
  }

  const invalidImageUrl = content.imageUrls.find(
    (imageUrl) => !isValidPublicUrl(imageUrl)
  );

  if (invalidImageUrl) {
    return "L’adresse d’une image de la newsletter est invalide.";
  }

  if (
    content.buttonLabel &&
    !content.buttonUrl
  ) {
    return "Le lien associé au bouton est obligatoire.";
  }

  if (
    content.buttonUrl &&
    !content.buttonLabel
  ) {
    return "Le texte du bouton est obligatoire.";
  }

  if (
    content.buttonUrl &&
    !isValidPublicUrl(content.buttonUrl)
  ) {
    return "Le lien du bouton est invalide.";
  }

  if (content.subject.length > 180) {
    return "Le sujet de la newsletter est trop long.";
  }

  if (content.preheader.length > 250) {
    return "Le texte d’aperçu est trop long.";
  }

  return "";
}

function getUnsubscribeSecret() {
  return (
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ""
  );
}

function createUnsubscribeToken(email: string) {
  const secret = getUnsubscribeSecret();

  if (!secret) {
    throw new Error(
      "La clé de désinscription est manquante."
    );
  }

  return createHmac("sha256", secret)
    .update(email.toLowerCase())
    .digest("hex");
}

function createUnsubscribeUrl(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const token = createUnsubscribeToken(normalizedEmail);

  const params = new URLSearchParams({
    email: normalizedEmail,
    token,
  });

  return `${SITE_URL}/desinscription-newsletter?${params.toString()}`;
}

function messageToHtml(message: string) {
  const paragraphs = message
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs
    .map((paragraph) => {
      const lines = escapeHtml(paragraph).replace(
        /\n/g,
        "<br />"
      );

      return `
        <p style="
          margin:0 0 22px 0;
          color:#3b2a25;
          font-family:Arial,Helvetica,sans-serif;
          font-size:16px;
          line-height:1.85;
        ">
          ${lines}
        </p>
      `;
    })
    .join("");
}

function buildNewsletterHtml(
  content: NewsletterContent,
  unsubscribeUrl: string
) {
  const logoUrl = escapeAttribute(LOGO_URL);
  const subject = escapeHtml(content.subject);
  const preheader = escapeHtml(content.preheader);
  const title = escapeHtml(content.title);
  const buttonLabel = escapeHtml(content.buttonLabel);
  const buttonUrl = escapeAttribute(content.buttonUrl);
  const footerMessage = escapeHtml(
    content.footerMessage
  );
  const safeUnsubscribeUrl =
    escapeAttribute(unsubscribeUrl);

  const imageBlocks = content.imageUrls
    .map((url, index) => {
      const safeImageUrl = escapeAttribute(url);
      const imageAlt =
        index === 0
          ? title
          : `${title} — image ${index + 1}`;

      return `
        <tr>
          <td
            align="center"
            style="
              padding:${index === 0 ? "0" : "18px 36px 0 36px"};
              background:#ffffff;
            "
          >
            <img
              src="${safeImageUrl}"
              alt="${escapeAttribute(imageAlt)}"
              width="680"
              style="
                display:block;
                width:100%;
                max-width:${index === 0 ? "680px" : "608px"};
                height:auto;
                margin:0 auto;
                border:0;
                border-radius:${index === 0 ? "0" : "16px"};
                object-fit:contain;
              "
            />
          </td>
        </tr>
      `;
    })
    .join("");

  const buttonBlock =
    content.buttonLabel && content.buttonUrl
      ? `
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="margin-top:12px;"
        >
          <tr>
            <td align="center">
              <a
                href="${buttonUrl}"
                target="_blank"
                style="
                  display:inline-block;
                  padding:15px 28px;
                  border-radius:999px;
                  background:#8a1f1f;
                  color:#ffffff;
                  font-family:Arial,Helvetica,sans-serif;
                  font-size:14px;
                  font-weight:700;
                  letter-spacing:1.4px;
                  line-height:1.2;
                  text-decoration:none;
                  text-transform:uppercase;
                "
              >
                ${buttonLabel}
              </a>
            </td>
          </tr>
        </table>
      `
      : "";

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${subject}</title>
  </head>

  <body
    style="
      margin:0;
      padding:0;
      background:#f8f4ee;
      color:#24110d;
    "
  >
    ${
      preheader
        ? `
      <div
        style="
          display:none;
          max-height:0;
          max-width:0;
          overflow:hidden;
          opacity:0;
          color:transparent;
          mso-hide:all;
        "
      >
        ${preheader}
      </div>
    `
        : ""
    }

    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="width:100%;background:#f8f4ee;"
    >
      <tr>
        <td align="center" style="padding:30px 12px;">
          <table
            role="presentation"
            width="680"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width:100%;
              max-width:680px;
              overflow:hidden;
              border:1px solid #e1d1bd;
              border-radius:22px;
              background:#ffffff;
            "
          >
            <tr>
              <td
                align="center"
                style="padding:28px 36px 28px 36px;"
              >
                <a
                  href="${SITE_URL}"
                  target="_blank"
                  style="display:inline-block;text-decoration:none;"
                >
                  <img
                    src="${logoUrl}"
                    alt="The Wine Watchers"
                    width="88"
                    height="88"
                    style="
                      display:block;
                      width:88px;
                      height:88px;
                      margin:0 auto;
                      border:0;
                      object-fit:contain;
                    "
                  />
                </a>

                <p
                  style="
                    margin:14px 0 0 0;
                    color:#8a6a2f;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:12px;
                    font-weight:700;
                    letter-spacing:3px;
                    text-transform:uppercase;
                  "
                >
                  The Wine Watchers
                </p>

                <h1
                  style="
                    margin:18px 0 0 0;
                    color:#24110d;
                    font-family:Georgia,'Times New Roman',serif;
                    font-size:38px;
                    font-weight:400;
                    line-height:1.16;
                  "
                >
                  ${title}
                </h1>
              </td>
            </tr>

            ${imageBlocks}

            <tr>
              <td style="padding:34px 36px 36px 36px;">
                ${messageToHtml(content.message)}

                ${buttonBlock}

                <div
                  style="
                    height:1px;
                    margin:34px 0 25px 0;
                    background:#e1d1bd;
                  "
                ></div>

                <p
                  style="
                    margin:0;
                    color:#6d5b50;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:12px;
                    line-height:1.7;
                  "
                >
                  ${footerMessage}
                </p>

                <p
                  style="
                    margin:15px 0 0 0;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:12px;
                    line-height:1.7;
                  "
                >
                  <a
                    href="${safeUnsubscribeUrl}"
                    style="
                      color:#8a1f1f;
                      font-weight:700;
                      text-decoration:underline;
                    "
                  >
                    Se désinscrire de la newsletter
                  </a>
                </p>

                <p
                  style="
                    margin:18px 0 0 0;
                    color:#9a816a;
                    font-family:Arial,Helvetica,sans-serif;
                    font-size:11px;
                    line-height:1.6;
                  "
                >
                  The Wine Watchers SL<br />
                  <a
                    href="${SITE_URL}"
                    style="color:#8a6a2f;text-decoration:none;"
                  >
                    www.thewinewatchers.com
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
function buildNewsletterText(
  content: NewsletterContent,
  unsubscribeUrl: string
) {
  const sections = [
    content.title,
    "",
    content.message,
  ];

  if (content.imageUrls.length > 0) {
    sections.push(
      "",
      ...content.imageUrls.map(
        (imageUrl, index) =>
          `Image ${index + 1} : ${imageUrl}`
      )
    );
  }

  if (content.buttonLabel && content.buttonUrl) {
    sections.push(
      "",
      `${content.buttonLabel} : ${content.buttonUrl}`
    );
  }

  sections.push(
    "",
    content.footerMessage,
    "",
    `Se désinscrire : ${unsubscribeUrl}`,
    "",
    "The Wine Watchers SL",
    SITE_URL
  );

  return sections.join("\n");
}

function getSenderAddress() {
  return (
    process.env.NEWSLETTER_FROM_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    process.env.CONTACT_FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    "The Wine Watchers <onboarding@resend.dev>"
  ).trim();
}

function getReplyToAddress() {
  return (
    process.env.NEWSLETTER_REPLY_TO ||
    process.env.RESEND_REPLY_TO ||
    process.env.CONTACT_TO_EMAIL ||
    ""
  ).trim();
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(
      (error as { message?: unknown }).message || ""
    );
  }

  return "Erreur inconnue lors de l’envoi.";
}

function wait(milliseconds: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds)
  );
}

async function sendOneEmail({
  resend,
  content,
  subscriber,
  from,
  replyTo,
}: {
  resend: Resend;
  content: NewsletterContent;
  subscriber: Subscriber;
  from: string;
  replyTo: string;
}): Promise<SendResult> {
  const email = normalizeEmail(subscriber.email);

  try {
    const unsubscribeUrl =
      createUnsubscribeUrl(email);

    const html = buildNewsletterHtml(
      content,
      unsubscribeUrl
    );

    const text = buildNewsletterText(
      content,
      unsubscribeUrl
    );

    const { data, error } =
      await resend.emails.send({
        from,
        to: [email],
        subject: content.subject,
        html,
        text,
        ...(replyTo
          ? {
              replyTo,
            }
          : {}),
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post":
            "List-Unsubscribe=One-Click",
          "X-Entity-Ref-ID": `${Date.now()}-${subscriber.id || email}`,
        },
        tags: [
          {
            name: "type",
            value: "newsletter",
          },
          {
            name: "mode",
            value: "campaign",
          },
        ],
      });

    if (error) {
      return {
        email,
        success: false,
        error: getErrorMessage(error),
      };
    }

    return {
      email,
      success: true,
      resendId: data?.id || "",
    };
  } catch (error) {
    return {
      email,
      success: false,
      error: getErrorMessage(error),
    };
  }
}

async function sendCampaignInGroups({
  resend,
  content,
  subscribers,
  from,
  replyTo,
}: {
  resend: Resend;
  content: NewsletterContent;
  subscribers: Subscriber[];
  from: string;
  replyTo: string;
}) {
  const results: SendResult[] = [];
  const concurrency = 5;

  for (
    let index = 0;
    index < subscribers.length;
    index += concurrency
  ) {
    const group = subscribers.slice(
      index,
      index + concurrency
    );

    const groupResults = await Promise.all(
      group.map((subscriber) =>
        sendOneEmail({
          resend,
          content,
          subscriber,
          from,
          replyTo,
        })
      )
    );

    results.push(...groupResults);

    if (index + concurrency < subscribers.length) {
      await wait(500);
    }
  }

  return results;
}

async function sendTestEmail({
  resend,
  content,
  testEmail,
  from,
  replyTo,
}: {
  resend: Resend;
  content: NewsletterContent;
  testEmail: string;
  from: string;
  replyTo: string;
}) {
  const unsubscribeUrl =
    `${SITE_URL}/desinscription-newsletter`;

  const html = buildNewsletterHtml(
    content,
    unsubscribeUrl
  );

  const text = buildNewsletterText(
    content,
    unsubscribeUrl
  );

  const { data, error } =
    await resend.emails.send({
      from,
      to: testEmail,
      subject: `[TEST] ${content.subject}`,
      html,
      text,
      ...(replyTo
        ? {
            replyTo,
          }
        : {}),
      tags: [
        {
          name: "type",
          value: "newsletter",
        },
        {
          name: "mode",
          value: "test",
        },
      ],
    });

  if (error) {
    throw new Error(getErrorMessage(error));
  }

  return data?.id || "";
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    let body: NewsletterRequest;

    try {
      body =
        (await request.json()) as NewsletterRequest;
    } catch {
      return NextResponse.json(
        {
          error:
            "Les données envoyées sont invalides.",
        },
        { status: 400 }
      );
    }

    const mode =
      normalizeText(body.mode) === "test"
        ? "test"
        : normalizeText(body.mode) === "campaign"
          ? "campaign"
          : "";

    if (!mode) {
      return NextResponse.json(
        {
          error:
            "Le mode d’envoi doit être « test » ou « campaign ».",
        },
        { status: 400 }
      );
    }

    const content =
      parseNewsletterContent(body);

    const validationError =
      validateNewsletter(content);

    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const {
      resendApiKey,
    } = getServerConfig();

    const resend = new Resend(resendApiKey);
    const from = getSenderAddress();
    const replyTo = getReplyToAddress();

    if (mode === "test") {
      const testEmail =
        normalizeEmail(body.testEmail);

      if (!isValidEmail(testEmail)) {
        return NextResponse.json(
          {
            error:
              "L’adresse e-mail de test est invalide.",
          },
          { status: 400 }
        );
      }

      const resendId = await sendTestEmail({
        resend,
        content,
        testEmail,
        from,
        replyTo,
      });

      return NextResponse.json({
        success: true,
        mode: "test",
        sentCount: 1,
        resendId,
        message: `Newsletter test envoyée à ${testEmail}.`,
      });
    }

    const { data, error } =
      await auth.supabaseAdmin
        .from("newsletter_subscribers")
        .select("id,email")
        .order("created_at", {
          ascending: true,
        });

    if (error) {
      return NextResponse.json(
        {
          error:
            "Impossible de charger les abonnés : " +
            error.message,
        },
        { status: 500 }
      );
    }

    const uniqueSubscribers = Array.from(
      new Map(
        ((data || []) as Subscriber[])
          .map((subscriber) => ({
            ...subscriber,
            email: normalizeEmail(
              subscriber.email
            ),
          }))
          .filter((subscriber) =>
            isValidEmail(subscriber.email)
          )
          .map((subscriber) => [
            subscriber.email,
            subscriber,
          ])
      ).values()
    );

    if (uniqueSubscribers.length === 0) {
      return NextResponse.json(
        {
          error:
            "Aucun abonné valide ne peut recevoir la newsletter.",
        },
        { status: 400 }
      );
    }

    const results =
      await sendCampaignInGroups({
        resend,
        content,
        subscribers: uniqueSubscribers,
        from,
        replyTo,
      });

    const successfulResults =
      results.filter(
        (result) => result.success
      );

    const failedResults =
      results.filter(
        (result) => !result.success
      );

    console.info(
      "Campagne newsletter terminée :",
      {
        total: results.length,
        sent: successfulResults.length,
        failed: failedResults.length,
      }
    );

    if (
      successfulResults.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "La newsletter n’a pu être envoyée à aucun abonné.",
          sentCount: 0,
          failedCount:
            failedResults.length,
          failures: failedResults.slice(
            0,
            20
          ),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success:
        failedResults.length === 0,
      partialSuccess:
        failedResults.length > 0,
      mode: "campaign",
      totalCount: results.length,
      sentCount:
        successfulResults.length,
      failedCount:
        failedResults.length,
      failures: failedResults.slice(
        0,
        20
      ),
      message:
        failedResults.length === 0
          ? `Newsletter envoyée individuellement à ${successfulResults.length} abonné(s).`
          : `Newsletter envoyée à ${successfulResults.length} abonné(s). ${failedResults.length} envoi(s) ont échoué.`,
    });
  } catch (error) {
    console.error(
      "Erreur API newsletter :",
      error
    );

    return NextResponse.json(
      {
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}