import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const { Resend } = await import("resend");
    const { createClient } = await import("@supabase/supabase-js");

    const resendApiKey = process.env.RESEND_API_KEY || "";
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!resendApiKey || !supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Configuration serveur manquante." },
        { status: 500 }
      );
    }

    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Sujet et message obligatoires." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    const { data: subscribers, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("email");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const emails =
      subscribers?.map((subscriber) => subscriber.email).filter(Boolean) || [];

    if (emails.length === 0) {
      return NextResponse.json(
        { error: "Aucun abonné newsletter trouvé." },
        { status: 400 }
      );
    }

    const safeSubject = escapeHtml(String(subject));
    const safeMessage = escapeHtml(String(message))
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join("");

    const html = `
      <div style="background:#f8f4ee;padding:40px 20px;font-family:Georgia,serif;color:#24110d;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;padding:36px;border:1px solid #e1d1bd;">
          <p style="text-transform:uppercase;letter-spacing:3px;color:#8a6a2f;font-size:12px;margin:0 0 16px;">
            The Wine Watchers
          </p>

          <h1 style="font-size:32px;line-height:1.2;margin:0 0 24px;color:#24110d;">
            ${safeSubject}
          </h1>

          <div style="font-size:16px;line-height:1.8;color:#3b2a25;">
            ${safeMessage}
          </div>

          <hr style="border:none;border-top:1px solid #e1d1bd;margin:32px 0;" />

          <p style="font-size:13px;line-height:1.7;color:#6d5b50;">
            Vous recevez cet email car vous êtes inscrit à la newsletter The Wine Watchers.
          </p>

          <p style="font-size:13px;line-height:1.7;color:#6d5b50;">
            Pour ne plus recevoir nos emails :
            <br />
            <a href="https://www.thewinewatchers.com/desinscription-newsletter"
              style="color:#8a1f1f;text-decoration:underline;font-weight:bold;">
              Se désinscrire de la newsletter
            </a>
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from:
        process.env.NEWSLETTER_FROM_EMAIL ||
        "The Wine Watchers <onboarding@resend.dev>",
      to: emails,
      subject: safeSubject,
      html,
    });

    return NextResponse.json({
      success: true,
      sentCount: emails.length,
    });
  } catch (error) {
    console.error("Erreur newsletter :", error);

    return NextResponse.json(
      { error: "Erreur lors de l’envoi de la newsletter." },
      { status: 500 }
    );
  }
}