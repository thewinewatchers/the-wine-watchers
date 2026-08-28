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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      {
        error: "Identifiant du lien manquant.",
      },
      { status: 400 }
    );
  }

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
    position: Number(body.position || 0),
    is_active: body.is_active !== false,
    show_when_logged_out:
      body.show_when_logged_out !== false,
    show_when_logged_in:
      body.show_when_logged_in !== false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("site_navigation")
    .update(payload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: "Impossible de modifier ce lien.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        error: "Lien introuvable.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    item: data,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      {
        error: "Identifiant du lien manquant.",
      },
      { status: 400 }
    );
  }

  const { data: existingItem, error: loadError } =
    await supabaseAdmin
      .from("site_navigation")
      .select("id, label")
      .eq("id", id)
      .maybeSingle();

  if (loadError) {
    return NextResponse.json(
      {
        error: "Impossible de rechercher ce lien.",
        details: loadError.message,
      },
      { status: 500 }
    );
  }

  if (!existingItem) {
    return NextResponse.json(
      {
        error: "Lien introuvable ou déjà supprimé.",
      },
      { status: 404 }
    );
  }

  const { error: deleteError } = await supabaseAdmin
    .from("site_navigation")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json(
      {
        error: "Impossible de supprimer ce lien.",
        details: deleteError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    deletedItemId: id,
  });
}