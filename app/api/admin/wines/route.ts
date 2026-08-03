import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

function cleanReferenceValue(value: unknown) {
  if (value === null || value === undefined) return null;

  const cleaned = String(value).trim();
  return cleaned || null;
}

async function syncProducerReference(payload: Record<string, unknown>) {
  const name = cleanReferenceValue(payload.producer);

  if (!name) return;

  const reference: Record<string, unknown> = {
    name,
    active: true,
  };

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

  const reference: Record<string, unknown> = {
    name,
    active: true,
  };

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = normalizeWinePayload(body);

    await syncCatalogueReferences(payload);

    const { data, error } = await supabaseAdmin
      .from("wines")
      .insert(payload)
      .select("id, slug, price, compare_at_price, stock")
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