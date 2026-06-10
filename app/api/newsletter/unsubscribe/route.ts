import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .delete()
      .eq("email", cleanEmail);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la désinscription." },
      { status: 500 }
    );
  }
}