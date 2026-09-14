import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Order = {
  id: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  total_amount: number | string | null;
  currency: string | null;
  status: string | null;
  payment_status: string | null;
  payment_method: string | null;
  bank_transfer_reference: string | null;
};

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return "";
  }

  return authorization.slice(7).trim();
}

function getServerConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error("Configuration Supabase serveur incomplète.");
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
  };
}

async function requireAdmin(request: Request) {
  const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } =
    getServerConfig();

  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return {
      error: NextResponse.json(
        { error: "Connexion administrateur requise." },
        { status: 401 }
      ),
    };
  }

  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser(accessToken);

  if (userError || !user) {
    return {
      error: NextResponse.json(
        { error: "Session administrateur invalide ou expirée." },
        { status: 401 }
      ),
    };
  }

  /*
   * Compatibilité avec les deux noms :
   * ADMIN_EMAIL=contact@thewinewatchers.com
   * ou
   * ADMIN_EMAILS=contact@thewinewatchers.com,autre@exemple.com
   */
  const adminEmailsRaw =
    process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";

  const allowedEmails = adminEmailsRaw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = String(user.email || "").trim().toLowerCase();

  const metadataRole = String(
    user.app_metadata?.role || user.user_metadata?.role || ""
  )
    .trim()
    .toLowerCase();

  const metadataAdmin =
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.is_admin === true ||
    metadataRole === "admin";

  const emailAllowed = allowedEmails.includes(userEmail);

  if (!metadataAdmin && !emailAllowed) {
    return {
      error: NextResponse.json(
        { error: "Accès administrateur refusé." },
        { status: 403 }
      ),
    };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return {
    user,
    supabaseAdmin,
  };
}

function formatPrice(value: number | string | null) {
  const amount = Number(value || 0);

  return amount.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request);

    if ("error" in auth) {
      return auth.error;
    }

    const body = await request.json();
    const orderId = String(body?.orderId || "").trim();

    if (!orderId) {
      return NextResponse.json(
        { error: "Identifiant de commande manquant." },
        { status: 400 }
      );
    }

    const { data, error } = await auth.supabaseAdmin
      .from("orders")
      .select(
        "id,customer_first_name,customer_last_name,customer_email,total_amount,currency,status,payment_status,payment_method,bank_transfer_reference"
      )
      .eq("id", orderId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    const order = data as Order;

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "Cette commande est déjà marquée comme payée." },
        { status: 400 }
      );
    }

    if (order.payment_method !== "bank_transfer") {
      return NextResponse.json(
        {
          error:
            "Le rappel automatique est actuellement réservé aux paiements par virement.",
        },
        { status: 400 }
      );
    }

    const customerEmail = String(order.customer_email || "").trim();

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Cette commande ne contient aucune adresse e-mail." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser =
      process.env.SMTP_USER || "contact@thewinewatchers.com";
    const smtpPass = process.env.SMTP_PASS || "";

    if (!smtpPass) {
      return NextResponse.json(
        {
          error:
            "Le mot de passe SMTP Hostinger n’est pas configuré sur le serveur.",
        },
        { status: 500 }
      );
    }

    /*
     * Port 587 :
     * - connexion initiale non chiffrée
     * - passage obligatoire en STARTTLS
     * - certificat TLS vérifié normalement
     */
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      requireTLS: true,

      auth: {
        user: smtpUser,
        pass: smtpPass,
      },

      tls: {
        servername: smtpHost,
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },

      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    /*
     * Vérifie d'abord la connexion SMTP.
     * Cela permet d'obtenir une erreur claire avant de tenter l'envoi.
     */
    await transporter.verify();

    const firstName = String(order.customer_first_name || "").trim();
    const lastName = String(order.customer_last_name || "").trim();

    const customerName = [firstName, lastName]
      .filter(Boolean)
      .join(" ");

    const greeting = firstName
      ? `Bonjour ${firstName},`
      : "Bonjour,";

    const reference =
      order.bank_transfer_reference || order.id;

    const amount = formatPrice(order.total_amount);

    const subject =
      "Rappel – règlement de votre commande The Wine Watchers";

    const text = `${greeting}

Nous nous permettons de revenir vers vous concernant votre commande auprès de The Wine Watchers, dont le règlement par virement ne semble pas encore nous être parvenu.

Montant : ${amount}
Référence de virement : ${reference}

Il s’agit peut-être simplement d’un oubli ou d’un délai bancaire.

Nous vous remercions de bien vouloir procéder au règlement dès que possible afin que nous puissions finaliser le traitement de votre commande.

Si le paiement a été effectué entre-temps, nous vous remercions de ne pas tenir compte de ce message.

Nous restons naturellement à votre disposition pour toute information complémentaire.

Bien cordialement,

The Wine Watchers
contact@thewinewatchers.com
www.thewinewatchers.com`;

    const html = `
      <div
        style="
          font-family:Arial,Helvetica,sans-serif;
          color:#24110d;
          line-height:1.7;
          max-width:680px;
          margin:0 auto;
        "
      >
        <p>${escapeHtml(greeting)}</p>

        <p>
          Nous nous permettons de revenir vers vous concernant votre commande
          auprès de <strong>The Wine Watchers</strong>, dont le règlement par
          virement ne semble pas encore nous être parvenu.
        </p>

        <div
          style="
            background:#f8f3ea;
            border:1px solid #e6dcc8;
            border-radius:12px;
            padding:16px 18px;
            margin:22px 0;
          "
        >
          <p style="margin:0 0 6px 0;">
            <strong>Montant :</strong>
            ${escapeHtml(amount)}
          </p>

          <p style="margin:0;">
            <strong>Référence de virement :</strong>
            ${escapeHtml(reference)}
          </p>
        </div>

        <p>
          Il s’agit peut-être simplement d’un oubli ou d’un délai bancaire.
        </p>

        <p>
          Nous vous remercions de bien vouloir procéder au règlement dès que
          possible afin que nous puissions finaliser le traitement de votre
          commande.
        </p>

        <p>
          Si le paiement a été effectué entre-temps, nous vous remercions de ne
          pas tenir compte de ce message.
        </p>

        <p>
          Nous restons naturellement à votre disposition pour toute information
          complémentaire.
        </p>

        <p style="margin-top:28px;">
          Bien cordialement,<br />
          <strong>The Wine Watchers</strong><br />
          contact@thewinewatchers.com<br />
          www.thewinewatchers.com
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"The Wine Watchers" <${smtpUser}>`,

      to: customerName
        ? `"${customerName.replace(/"/g, "")}" <${customerEmail}>`
        : customerEmail,

      replyTo: smtpUser,

      subject,
      text,
      html,
    });

    return NextResponse.json({
      success: true,
      message: `Rappel envoyé à ${customerEmail}.`,
    });
  } catch (error) {
    console.error("Erreur rappel paiement :", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d’envoyer le rappel de paiement.",
      },
      { status: 500 }
    );
  }
}