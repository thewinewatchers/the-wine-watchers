import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, cartId } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email client manquant." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "The Wine Watchers <contact@thewinewatchers.com>",
      to: email,
      subject: "Votre sélection de vins vous attend",
      html: `
        <p>Bonjour,</p>
        <p>Nous avons remarqué que vous aviez laissé une sélection de vins dans votre panier.</p>
        <p>Si vous souhaitez finaliser votre commande, vous pouvez revenir sur notre boutique.</p>
        <p>Nous restons à votre disposition pour toute question ou conseil.</p>
        <p>Cordialement,<br/>The Wine Watchers</p>
      `,
    });

    return NextResponse.json({
      success: true,
      cartId,
    });
  } catch (error) {
    console.error("Erreur envoi panier abandonné:", error);

    return NextResponse.json(
      { error: "Impossible d’envoyer l’email." },
      { status: 500 }
    );
  }
}