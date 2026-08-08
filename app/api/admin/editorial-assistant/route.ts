import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  calculateEditorialScore,
  renderEditorialStars,
  type EditorialWineInput,
} from "@/lib/editorialScore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

type WineRow = Record<string, unknown> & {
  id?: string;
  slug?: string | null;
  name?: string | null;
  producer?: string | null;
  appellation?: string | null;
  region?: string | null;
  country?: string | null;
  hidden_from_site?: boolean | null;
};

function firstDefined(
  source: Record<string, unknown>,
  keys: string[]
): unknown {
  for (const key of keys) {
    const value = source[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function toStringValue(value: unknown) {
  if (value === null || value === undefined) return null;

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }

  const stringValue = String(value).trim();
  return stringValue || null;
}


function toNumberOrString(value: unknown): number | string | null {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const stringValue = String(value).trim();
  return stringValue || null;
}

function toStringArray(value: unknown): string[] | null {
  if (value === null || value === undefined || value === "") return null;

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  const raw = String(value).trim();

  if (!raw) return null;

  return raw
    .split(/[,;|\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  return ["true", "1", "yes", "oui"].includes(normalized);
}

function buildEditorialInput(wine: WineRow): EditorialWineInput {
  const slug = toStringValue(firstDefined(wine, ["slug"]));
  const producer = toStringValue(
    firstDefined(wine, ["producer", "domain", "domaine"])
  );
  const appellation = toStringValue(
    firstDefined(wine, ["appellation", "aoc"])
  );
  const region = toStringValue(firstDefined(wine, ["region"]));

  return {
    slug,
    name: toStringValue(firstDefined(wine, ["name", "title"])),
    producer,
    appellation,
    region,
    country: toStringValue(firstDefined(wine, ["country", "pays"])),

    seo_title: toStringValue(
      firstDefined(wine, ["seo_title", "meta_title"])
    ),
    seo_description: toStringValue(
      firstDefined(wine, [
        "seo_description",
        "meta_description",
        "seo_meta_description",
      ])
    ),
    canonical_url:
      toStringValue(
        firstDefined(wine, ["canonical_url", "canonical"])
      ) || (slug ? `/boutique/vin/${slug}` : null),

    description: toStringValue(
      firstDefined(wine, ["description", "product_description"])
    ),
    story: toStringValue(
      firstDefined(wine, [
        "story",
        "history",
        "wine_history",
        "histoire",
        "histoire_du_vin",
      ])
    ),
    tasting_notes:
      toStringArray(
        firstDefined(wine, [
          "tasting_notes",
          "tasting_note",
          "notes_degustation",
          "degustation",
        ])
      ) ||
      toStringValue(
        firstDefined(wine, [
          "tasting_notes",
          "tasting_note",
          "notes_degustation",
          "degustation",
        ])
      ),
    nose: toStringValue(
      firstDefined(wine, ["nose", "nez"])
    ),
    palate: toStringValue(
      firstDefined(wine, ["palate", "bouche"])
    ),
    food_pairings:
      toStringArray(
        firstDefined(wine, [
          "pairing",
          "food_pairings",
          "food_pairing",
          "pairings",
          "accords",
          "accords_mets_vins",
        ])
      ) ||
      toStringValue(
        firstDefined(wine, [
          "pairing",
          "food_pairings",
          "food_pairing",
          "pairings",
          "accords",
          "accords_mets_vins",
        ])
      ),
    additional_information: null,
    tww_opinion: toStringValue(
      firstDefined(wine, [
        "meta_content",
        "tww_opinion",
        "wine_watchers_opinion",
        "opinion",
        "avis",
        "avis_tww",
      ])
    ),

    grapes:
      toStringArray(
        firstDefined(wine, ["grapes", "grape_varieties", "cepages"])
      ) ||
      toStringValue(
        firstDefined(wine, ["grapes", "grape_varieties", "cepages"])
      ),
    serving_temperature: toStringValue(
      firstDefined(wine, [
        "serving_temperature",
        "temperature_service",
        "temperature",
      ])
    ),
    aging_potential: toStringValue(
      firstDefined(wine, [
        "aging_potential",
        "cellaring_potential",
        "potentiel_garde",
      ])
    ),
    format: toStringValue(
      firstDefined(wine, ["bottle_size", "format", "bottle_format", "size"])
    ),
    price: toNumberOrString(firstDefined(wine, ["price"])),
    stock: toNumberOrString(firstDefined(wine, ["stock"])),

    image: toStringValue(
      firstDefined(wine, ["image", "image_url", "main_image"])
    ),
    case_image: toStringValue(
      firstDefined(wine, [
        "case_image",
        "wooden_case_image",
        "caisse_image",
      ])
    ),
    gallery: toStringArray(
      firstDefined(wine, [
        "gallery",
        "images",
        "additional_images",
      ])
    ),
    image_alt:
      toStringValue(
        firstDefined(wine, ["image_alt", "alt_text"])
      ) ||
      toStringValue(firstDefined(wine, ["name", "title"])),

    producer_link: producer
      ? `/producteur/${producer}`
      : null,
    appellation_link: appellation
      ? `/appellation/${appellation}`
      : null,
    region_link: region ? `/boutique/${region}` : null,
    boutique_link: slug ? `/boutique/vin/${slug}` : null,

    has_product_schema: toBoolean(
      firstDefined(wine, [
        "has_product_schema",
        "product_schema",
      ]) ?? true
    ),
    has_breadcrumb_schema: toBoolean(
      firstDefined(wine, [
        "has_breadcrumb_schema",
        "breadcrumb_schema",
      ]) ?? true
    ),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("includeHidden") === "true";

    const { data, error } = await supabaseAdmin
      .from("wines")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json(
        {
          error: "Impossible de charger les fiches du catalogue.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    const wines = ((data || []) as WineRow[]).filter(
      (wine) => includeHidden || !wine.hidden_from_site
    );

    const analyses = wines
      .map((wine) => {
        const editorialInput = buildEditorialInput(wine);
        const result = calculateEditorialScore(editorialInput);

        return {
          id: String(wine.id || ""),
          slug: toStringValue(wine.slug),
          name:
            toStringValue(firstDefined(wine, ["name", "title"])) ||
            "Vin sans nom",
          producer: toStringValue(
            firstDefined(wine, ["producer", "domain", "domaine"])
          ),
          appellation: toStringValue(
            firstDefined(wine, ["appellation", "aoc"])
          ),
          region: toStringValue(firstDefined(wine, ["region"])),
          hiddenFromSite: Boolean(wine.hidden_from_site),

          score: result.score,
          certification: result.certification,
          stars: result.stars,
          starsLabel: renderEditorialStars(result.stars),

          categories: {
            metadata: result.metadata,
            editorial: result.editorial,
            technical: result.technical,
            images: result.images,
            internalLinks: result.internalLinks,
            structuredData: result.structuredData,
          },

          warnings: result.warnings,
          actions: result.actions,
          estimatedMinutes: result.estimatedMinutes,
          potentialGain: result.potentialGain,
        };
      })
      .sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        return b.potentialGain - a.potentialGain;
      });

    const averageScore =
      analyses.length > 0
        ? Math.round(
            analyses.reduce((sum, item) => sum + item.score, 0) /
              analyses.length
          )
        : 0;

    const certificationCounts = analyses.reduce(
      (counts, analysis) => {
        counts[analysis.certification] =
          (counts[analysis.certification] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      success: true,
      summary: {
        total: analyses.length,
        averageScore,
        certifications: certificationCounts,
        priorityCount: analyses.filter((item) => item.score < 70).length,
        improvementCount: analyses.filter(
          (item) => item.score >= 70 && item.score < 90
        ).length,
        certifiedCount: analyses.filter((item) => item.score >= 90).length,
      },
      analyses,
    });
  } catch (error) {
    console.error("Erreur Assistant éditorial :", error);

    return NextResponse.json(
      {
        error: "Impossible d’analyser les fiches du catalogue.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}