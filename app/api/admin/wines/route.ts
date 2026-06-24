import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("wines")
      .insert(body)
      .select("id, slug")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Erreur création vin.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      wine: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur serveur création vin.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}