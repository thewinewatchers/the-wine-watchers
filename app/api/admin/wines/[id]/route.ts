import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrenchNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isNaN(value) ? null : value;

  const raw = String(value).trim();
  if (!raw) return null;

  const cleaned = raw
    .replace(/[€\s]/g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseFrenchStock(value: unknown) {
  const parsed = parseFrenchNumber(value);
  if (parsed === null) return 0;
  return Math.max(0, Math.floor(parsed));
}

function createBaseWineSlug(name: string, vintage?: string | number | null) {
  const cleanName = String(name || "vin").trim();
  const cleanVintage = vintage ? String(vintage).trim() : "";

  if (!cleanVintage) return createSlug(cleanName);

  const normalizedName = createSlug(cleanName);
  const normalizedVintage = createSlug(cleanVintage);

  if (
    normalizedName === normalizedVintage ||
    normalizedName.endsWith(`-${normalizedVintage}`)
  ) {
    return normalizedName;
  }

  return createSlug(`${cleanName}-${cleanVintage}`);
}

async function createUniqueDuplicateSlug(
  name: string,
  vintage?: string | number | null
) {
  const baseSlug = createBaseWineSlug(name, vintage);

  const { data } = await supabaseAdmin
    .from("wines")
    .select("slug")
    .or(`slug.eq.${baseSlug},slug.like.${baseSlug}-%`);

  const existingSlugs = new Set((data || []).map((item) => item.slug));

  let counter = 2;
  let candidate = `${baseSlug}-${counter}`;

  while (existingSlugs.has(candidate)) {
    counter++;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

function normalizeWinePayload(body: Record<string, unknown>) {
  return {
    ...body,
    price: parseFrenchNumber(body.price),
    compare_at_price: parseFrenchNumber(body.compare_at_price),
    rating: parseFrenchNumber(body.rating),
    weight_kg: parseFrenchNumber(body.weight_kg),
    stock: parseFrenchStock(body.stock),
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const payload = normalizeWinePayload(body);

  const { data, error } = await supabaseAdmin
    .from("wines")
    .update(payload)
    .eq("id", id)
    .select("id, stock, price, compare_at_price, rating, weight_kg")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Erreur modification vin.", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, wine: data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: existingWine, error: loadError } = await supabaseAdmin
    .from("wines")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json(
      { error: "Erreur recherche vin.", details: loadError.message },
      { status: 500 }
    );
  }

  if (!existingWine) {
    return NextResponse.json(
      { error: "Vin introuvable ou déjà supprimé." },
      { status: 404 }
    );
  }

  const { error: deleteError } = await supabaseAdmin
    .from("wines")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Erreur suppression vin.", details: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    deletedWineId: id,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: original, error: loadError } = await supabaseAdmin
    .from("wines")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (loadError || !original) {
    return NextResponse.json(
      { error: "Vin à dupliquer introuvable." },
      { status: 404 }
    );
  }

  const cleanDuplicateSlug = await createUniqueDuplicateSlug(
    original.name || "vin",
    original.vintage || ""
  );

  const duplicatedWine = {
    slug: cleanDuplicateSlug,
    name: original.name || "Vin dupliqué",
    producer: original.producer || null,
    region: original.region || null,
    appellation: original.appellation || null,
    country: original.country || null,
    color: original.color || null,
    vintage: original.vintage || null,
    price: original.price || null,
    compare_at_price: original.compare_at_price || null,
    stock: original.stock || 0,
    bottle_size: original.bottle_size || null,
    packaging: original.packaging || null,
    weight_kg: original.weight_kg || null,
    image: original.image || null,
    category: original.category || null,
    rating: original.rating || null,
    seo_title: original.seo_title || null,
    seo_description: original.seo_description || null,
    keywords: original.keywords || [],
    grape_varieties: original.grape_varieties || [],
    classification: original.classification || null,
    soil: original.soil || null,
    style: original.style || null,
    description: original.description || null,
    story: original.story || null,
    tasting_notes: original.tasting_notes || [],
    nose: original.nose || null,
    palate: original.palate || null,
    pairing: original.pairing || null,
    serving_temperature: original.serving_temperature || null,
    aging_potential: original.aging_potential || null,
    meta_content: original.meta_content || null,
    hidden_from_site: true,
  };

  const { data: insertedWine, error: insertError } = await supabaseAdmin
    .from("wines")
    .insert(duplicatedWine)
    .select("id, slug")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Erreur duplication vin.", details: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    wine: insertedWine,
  });
}