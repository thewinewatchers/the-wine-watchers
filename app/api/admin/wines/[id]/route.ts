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

  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const cleaned = raw.replace(/[€\s]/g, "").replace(",", ".");
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
  const cleanVintage =
    vintage === null || vintage === undefined ? "" : String(vintage).trim();

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

  const { data, error } = await supabaseAdmin
    .from("wines")
    .select("slug")
    .or(`slug.eq.${baseSlug},slug.like.${baseSlug}-%`);

  if (error) {
    throw new Error(error.message);
  }

  const existingSlugs = new Set(
    (data || [])
      .map((item) => item.slug)
      .filter((slug): slug is string => Boolean(slug))
  );

  let counter = 2;
  let candidate = `${baseSlug}-${counter}`;

  while (existingSlugs.has(candidate)) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

function normalizePatchPayload(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = { ...body };

  if ("price" in body) payload.price = parseFrenchNumber(body.price);
  if ("compare_at_price" in body) {
    payload.compare_at_price = parseFrenchNumber(body.compare_at_price);
  }
  if ("rating" in body) payload.rating = parseFrenchNumber(body.rating);
  if ("weight_kg" in body) payload.weight_kg = parseFrenchNumber(body.weight_kg);
  if ("stock" in body) payload.stock = parseFrenchStock(body.stock);
  if ("quantity" in body) payload.quantity = parseFrenchStock(body.quantity);

  if ("seo_title" in body) {
    payload.seo_title =
      body.seo_title === null || body.seo_title === undefined
        ? null
        : String(body.seo_title).trim() || null;
  }

  if ("seo_description" in body) {
    payload.seo_description =
      body.seo_description === null || body.seo_description === undefined
        ? null
        : String(body.seo_description).trim() || null;
  }

  return payload;
}

function cleanReferenceValue(value: unknown) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).trim();
  return cleaned || null;
}

async function syncProducerReference(payload: Record<string, unknown>) {
  const name = cleanReferenceValue(payload.producer);
  if (!name) return;

  const reference: Record<string, unknown> = { name, active: true };
  const region = cleanReferenceValue(payload.region);
  const category = cleanReferenceValue(payload.category);

  if (region) reference.region = region;
  if (category) reference.category = category;

  const { error } = await supabaseAdmin
    .from("producers")
    .upsert(reference, { onConflict: "name" });

  if (error) {
    throw new Error(
      `Impossible d’enregistrer le producteur "${name}" : ${error.message}`
    );
  }
}

async function syncAppellationReference(payload: Record<string, unknown>) {
  const name = cleanReferenceValue(payload.appellation);
  if (!name) return;

  const reference: Record<string, unknown> = { name, active: true };
  const region = cleanReferenceValue(payload.region);
  const category = cleanReferenceValue(payload.category);

  if (region) reference.region = region;
  if (category) reference.category = category;

  const { error } = await supabaseAdmin
    .from("appellations")
    .upsert(reference, { onConflict: "name" });

  if (error) {
    throw new Error(
      `Impossible d’enregistrer l’appellation "${name}" : ${error.message}`
    );
  }
}

async function syncCatalogueReferences(payload: Record<string, unknown>) {
  await Promise.all([
    syncProducerReference(payload),
    syncAppellationReference(payload),
  ]);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const payload = normalizePatchPayload(body);

  try {
    await syncCatalogueReferences(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur mise à jour des référentiels.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("wines")
    .update(payload)
    .eq("id", id)
    .select("*")
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

  return NextResponse.json({ success: true, deletedWineId: id });
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

  if (loadError) {
    return NextResponse.json(
      {
        error: "Erreur recherche du vin à dupliquer.",
        details: loadError.message,
      },
      { status: 500 }
    );
  }

  if (!original) {
    return NextResponse.json(
      { error: "Vin à dupliquer introuvable." },
      { status: 404 }
    );
  }

  let duplicateSlug: string;

  try {
    duplicateSlug = await createUniqueDuplicateSlug(
      original.name ?? "vin",
      original.vintage ?? ""
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur création du slug de duplication.",
        details:
          error instanceof Error
            ? error.message
            : "Erreur inconnue lors de la création du slug.",
      },
      { status: 500 }
    );
  }

  const duplicatedWine: Record<string, unknown> = {
    slug: duplicateSlug,
    name: original.name ?? "Vin dupliqué",
    producer: original.producer ?? null,
    region: original.region ?? null,
    appellation: original.appellation ?? null,
    country: original.country ?? null,
    color: original.color ?? null,
    vintage: original.vintage ?? null,
    price: parseFrenchNumber(original.price),
    compare_at_price: parseFrenchNumber(original.compare_at_price),
    stock: parseFrenchStock(original.stock),
    bottle_size: original.bottle_size ?? null,
    packaging: original.packaging ?? null,
    weight_kg: parseFrenchNumber(original.weight_kg),
    image: original.image ?? null,
    category: original.category ?? null,
    rating: parseFrenchNumber(original.rating),
    seo_title:
      original.seo_title === null || original.seo_title === undefined
        ? null
        : String(original.seo_title).trim() || null,
    seo_description:
      original.seo_description === null ||
      original.seo_description === undefined
        ? null
        : String(original.seo_description).trim() || null,
    keywords: original.keywords ?? [],
    grape_varieties: original.grape_varieties ?? [],
    classification: original.classification ?? null,
    soil: original.soil ?? null,
    style: original.style ?? null,
    description: original.description ?? null,
    story: original.story ?? null,
    tasting_notes: original.tasting_notes ?? [],
    nose: original.nose ?? null,
    palate: original.palate ?? null,
    pairing: original.pairing ?? null,
    serving_temperature: original.serving_temperature ?? null,
    aging_potential: original.aging_potential ?? null,
    meta_content: original.meta_content ?? null,
    external_links: original.external_links ?? null,
    hidden_from_site: true,
  };

  if ("quantity" in original) {
    duplicatedWine.quantity = parseFrenchStock(original.quantity);
  }

  try {
    await syncCatalogueReferences(duplicatedWine);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur mise à jour des référentiels.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }

  const { data: insertedWine, error: insertError } = await supabaseAdmin
    .from("wines")
    .insert(duplicatedWine)
    .select("*")
    .single();

  if (insertError || !insertedWine) {
    return NextResponse.json(
      {
        error: "Erreur duplication vin.",
        details: insertError?.message || "La fiche dupliquée n'a pas été créée.",
      },
      { status: 500 }
    );
  }

  const sourcePrice = parseFrenchNumber(original.price);
  const sourceStock = parseFrenchStock(original.stock);
  const sourceSeoTitle =
    original.seo_title === null || original.seo_title === undefined
      ? null
      : String(original.seo_title).trim() || null;
  const sourceSeoDescription =
    original.seo_description === null ||
    original.seo_description === undefined
      ? null
      : String(original.seo_description).trim() || null;

  const copiedPrice = parseFrenchNumber(insertedWine.price);
  const copiedStock = parseFrenchStock(insertedWine.stock);
  const copiedSeoTitle =
    insertedWine.seo_title === null || insertedWine.seo_title === undefined
      ? null
      : String(insertedWine.seo_title).trim() || null;
  const copiedSeoDescription =
    insertedWine.seo_description === null ||
    insertedWine.seo_description === undefined
      ? null
      : String(insertedWine.seo_description).trim() || null;

  if (
    copiedPrice !== sourcePrice ||
    copiedStock !== sourceStock ||
    copiedSeoTitle !== sourceSeoTitle ||
    copiedSeoDescription !== sourceSeoDescription
  ) {
    await supabaseAdmin.from("wines").delete().eq("id", insertedWine.id);

    return NextResponse.json(
      {
        error: "La duplication a été annulée.",
        details:
          "Le prix, le stock, le titre SEO ou la meta description n'ont pas été recopiés correctement.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    wine: insertedWine,
  });
}