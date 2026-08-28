import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey
);

type NavigationPayload = {
  label?: string;
  href?: string;
  position?: number;
  is_active?: boolean;
  show_when_logged_out?: boolean;
  show_when_logged_in?: boolean;
};

function cleanText(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("site_navigation")
    .select(
      `
        id,
        label,
        href,
        position,
        is_active,
        show_when_logged_out,
        show_when_logged_in
      `
    )
    .order("position", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    return NextResponse.json(
      {
        error: "Impossible de charger le menu.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    items: data || [],
  });
}

export async function POST(request: Request) {
  let body: NavigationPayload;

  try {
    body = (await request.json()) as NavigationPayload;
  } catch {
    return NextResponse.json(
      {
        error: "Données invalides.",
      },
      { status: 400 }
    );
  }

  const label = cleanText(body.label);
  const href = cleanText(body.href);
  const position = Number(body.position || 0);

  if (!label) {
    return NextResponse.json(
      {
        error: "Le libellé du menu est obligatoire.",
      },
      { status: 400 }
    );
  }

  if (!href) {
    return NextResponse.json(
      {
        error: "Le lien est obligatoire.",
      },
      { status: 400 }
    );
  }

  const payload = {
    label,
    href,
    position,
    is_active: body.is_active !== false,
    show_when_logged_out:
      body.show_when_logged_out !== false,
    show_when_logged_in:
      body.show_when_logged_in !== false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("site_navigation")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      {
        error: "Impossible d’ajouter ce lien au menu.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      item: data,
    },
    { status: 201 }
  );
}