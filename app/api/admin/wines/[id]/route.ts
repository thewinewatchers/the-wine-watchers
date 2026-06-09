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
async function createUniqueDuplicateSlug(
  name: string,
  vintage?: string | number | null
) {
  const cleanName = name || "vin";
  const cleanVintage = vintage ? String(vintage).trim() : "";

  const nameAlreadyContainsVintage =
    cleanVintage && cleanName.includes(cleanVintage);

  const baseSlug = nameAlreadyContainsVintage
    ? createSlug(cleanName)
    : createSlug(`${cleanName}-${cleanVintage}`);

  const copyBaseSlug = `${baseSlug}-copie`;

  const { data } = await supabaseAdmin
    .from("wines")
    .select("slug")
    .or(`slug.eq.${copyBaseSlug},slug.like.${copyBaseSlug}-%`);

  const existingSlugs = new Set((data || []).map((item) => item.slug));

  if (!existingSlugs.has(copyBaseSlug)) {
    return copyBaseSlug;
  }

  let counter = 2;

  while (existingSlugs.has(`${copyBaseSlug}-${counter}`)) {
    counter++;
  }

  return `${copyBaseSlug}-${counter}`;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("wines")
    .update(body)
    .eq("id", id)
    .select("id, stock")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Erreur modification vin.", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, wine: data });
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
    stock: original.stock || 0,
    bottle_size: original.bottle_size || null,
    packaging: original.packaging || null,
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