import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!resendApiKey) {
      return NextResponse.json(
        { success: false, error: "RESEND_API_KEY manquante" },
        { status: 500 }
      );
    }

    if (!emailFrom) {
      return NextResponse.json(
        { success: false, error: "EMAIL_FROM manquante" },
        { status: 500 }
      );
    }

    if (!adminEmail) {
      return NextResponse.json(
        { success: false, error: "ADMIN_EMAIL manquante" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const result = await resend.emails.send({
      from: emailFrom,
      to: adminEmail,
      subject: "Test Resend - The Wine Watchers",
      text: "Ceci est un test d’envoi email depuis The Wine Watchers via Resend.",
    });

    return NextResponse.json({
      success: true,
      message: "Email de test envoyé",
      result,
    });
  } catch (error) {
    console.error("Erreur test Resend :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du test Resend",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}