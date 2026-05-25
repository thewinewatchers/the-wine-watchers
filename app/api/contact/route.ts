import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      nom,
      email,
      telephone,
      vinRecherche,
      quantite,
      message,
    } = body;

    if (!nom || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont obligatoires." },
        { status: 400 }
      );
    }

    if (!process.env.CONTACT_TO_EMAIL) {
      return NextResponse.json(
        { error: "CONTACT_TO_EMAIL n’est pas configuré." },
        { status: 500 }
      );
    }

    if (!process.env.CONTACT_FROM_EMAIL) {
      return NextResponse.json(
        { error: "CONTACT_FROM_EMAIL n’est pas configuré." },
        { status: 500 }
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #24110d;">
        <h1 style="color: #8a1f1f;">Nouvelle demande client</h1>

        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${telephone || "Non renseigné"}</p>
        <p><strong>Vin recherché :</strong> ${
          vinRecherche || "Non renseigné"
        }</p>
        <p><strong>Quantité souhaitée :</strong> ${
          quantite || "Non renseignée"
        }</p>

        <h2 style="color: #8a1f1f;">Message</h2>
        <p>${String(message).replace(/\n/g, "<br />")}</p>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eadfce;" />

        <p style="font-size: 13px; color: #6d5b50;">
          Demande envoyée depuis le formulaire de contact du site The Wine Watchers.
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `Demande client - ${nom}`,
      html,
    });

    if (error) {
      return NextResponse.json(
        { error: "Erreur lors de l’envoi de l’email.", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur lors de l’envoi du formulaire." },
      { status: 500 }
    );
  }
}