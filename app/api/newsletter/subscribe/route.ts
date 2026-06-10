import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({
        email: cleanEmail,
        source: source || "site",
      });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Cette adresse est déjà inscrite à notre newsletter." },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const emailResult = await resend.emails.send({
      from:
        process.env.NEWSLETTER_FROM_EMAIL ||
        "The Wine Watchers <onboarding@resend.dev>",
      to: cleanEmail,
      subject: "Bienvenue chez The Wine Watchers",
      html: `
        <div style="background:#f8f4ee;padding:40px 20px;font-family:Georgia,serif;color:#24110d;">
          <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;padding:36px;border:1px solid #e1d1bd;">
            <p style="text-transform:uppercase;letter-spacing:3px;color:#8a6a2f;font-size:12px;margin:0 0 16px;">
              The Wine Watchers
            </p>

            <h1 style="font-size:32px;line-height:1.2;margin:0 0 24px;color:#24110d;">
              Bienvenue chez The Wine Watchers
            </h1>

            <p style="font-size:16px;line-height:1.8;color:#3b2a25;">
              Merci pour votre inscription à notre newsletter.
            </p>

            <p style="font-size:16px;line-height:1.8;color:#3b2a25;">
              Vous recevrez nos offres exclusives, allocations rares, grands crus de Bordeaux et Bourgogne ainsi que nos informations sur les Primeurs Bordeaux 2025.
            </p>

            <div style="margin:32px 0;">
              <a href="https://www.thewinewatchers.com/boutique/bordeaux"
                 style="display:inline-block;background:#8a1f1f;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:999px;font-size:14px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
                Découvrir la boutique
              </a>
            </div>

            <hr style="border:none;border-top:1px solid #e1d1bd;margin:32px 0;" />

            <p style="font-size:13px;line-height:1.7;color:#6d5b50;">
              The Wine Watchers SL<br />
              Sélection de grands vins, allocations rares et Primeurs.
              <br /><br />

              <a
                href="https://www.thewinewatchers.com/desinscription-newsletter"
                style="color:#8a1f1f;text-decoration:underline;"
              >
                Se désinscrire de la newsletter
              </a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Résultat email bienvenue :", emailResult);

    if (emailResult.error) {
      return NextResponse.json(
        { error: emailResult.error.message || "Erreur Resend." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Erreur inscription newsletter :", error);

    return NextResponse.json(
      { error: "Erreur lors de l’inscription newsletter." },
      { status: 500 }
    );
  }
}