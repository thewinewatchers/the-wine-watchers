import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

type SitePagePayload = {
  name?: string;
  page_title?: string;
  eyebrow?: string | null;
  intro?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  sections?: unknown[];
  is_active?: boolean;
};

function cleanText(value: unknown) {
  if (value === null || value === undefined) return null;

  const cleaned = String(value).trim();

  return cleaned || null;
}

function normalizePayload(body: SitePagePayload) {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if ("name" in body) {
    payload.name = cleanText(body.name);
  }

  if ("page_title" in body) {
    payload.page_title = cleanText(body.page_title);
  }

  if ("eyebrow" in body) {
    payload.eyebrow = cleanText(body.eyebrow);
  }

  if ("intro" in body) {
    payload.intro = cleanText(body.intro);
  }

  if ("seo_title" in body) {
    payload.seo_title = cleanText(body.seo_title);
  }

  if ("seo_description" in body) {
    payload.seo_description = cleanText(body.seo_description);
  }

  if ("sections" in body) {
    payload.sections = Array.isArray(body.sections) ? body.sections : [];
  }

  if ("is_active" in body) {
    payload.is_active = Boolean(body.is_active);
  }

  return payload;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug de page manquant." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("site_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: "Impossible de charger la page.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Page introuvable." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    page: data,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug de page manquant." },
      { status: 400 }
    );
  }

  let body: SitePagePayload;

  try {
    body = (await request.json()) as SitePagePayload;
  } catch {
    return NextResponse.json(
      { error: "Données invalides." },
      { status: 400 }
    );
  }

  const payload = normalizePayload(body);

  if (
    "name" in payload &&
    (!payload.name || typeof payload.name !== "string")
  ) {
    return NextResponse.json(
      { error: "Le nom de la page est obligatoire." },
      { status: 400 }
    );
  }

  if (
    "page_title" in payload &&
    (!payload.page_title || typeof payload.page_title !== "string")
  ) {
    return NextResponse.json(
      { error: "Le titre de la page est obligatoire." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("site_pages")
    .update(payload)
    .eq("slug", slug)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: "Erreur lors de la modification de la page.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Page introuvable." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    page: data,
  });
}