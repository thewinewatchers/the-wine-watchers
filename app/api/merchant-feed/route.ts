
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://www.thewinewatchers.com";

const VAT_RATES = {
  FR: 0.20,
  ES: 0.21,
} as const;

type CountryCode = keyof typeof VAT_RATES;

type Wine = {
  id: string | number;
  slug: string | null;
  name: string | null;
  producer: string | null;
  description: string | null;
  price: number | string | null;
  stock: number | string | null;
  weight_kg: number | string | null;
  bottle_size: string | null;
  packaging: string | null;
  image: string | null;
  hidden_from_site: boolean | null;
};

function parseNumber(value: number | string | null): number {
  if (value === null || value === undefined) return NaN;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }

  let text = value.trim().replace(/\s/g, "").replace(/€/g, "");

  if (text.includes(",") && text.includes(".")) {
    if (text.lastIndexOf(",") > text.lastIndexOf(".")) {
      text = text.replace(/\./g, "").replace(",", ".");
    } else {
      text = text.replace(/,/g, "");
    }
  } else if (text.includes(",")) {
    text = text.replace(",", ".");
  }

  const result = Number(text);
  return Number.isFinite(result) ? result : NaN;
}

function xmlEscape(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(value: string | null): string | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim(), SITE_URL);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    if (url.hostname === "localhost") return null;

    return url.toString();
  } catch {
    return null;
  }
}

function cleanText(value: string | null): string {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPrice(value: number): string {
  return `${value.toFixed(2)} EUR`;
}

function formatWeight(value: number): string {
  return `${value.toFixed(2)} kg`;
}

async function getWines(): Promise<Wine[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Configuration Supabase manquante.");
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const allWines: Wine[] = [];
  const pageSize = 500;

  for (let start = 0; ; start += pageSize) {
    const { data, error } = await supabase
      .from("wines")
      .select(
        [
          "id",
          "slug",
          "name",
          "producer",
          "description",
          "price",
          "stock",
          "weight_kg",
          "bottle_size",
          "packaging",
          "image",
          "hidden_from_site",
        ].join(",")
      )
      .order("id", { ascending: true })
      .range(start, start + pageSize - 1);

    if (error) {
      throw new Error(`Lecture Supabase impossible : ${error.message}`);
    }

    const batch = (data || []) as unknown as Wine[];
    allWines.push(...batch);

    if (batch.length < pageSize) break;
  }

  return allWines;
}

function createItem(wine: Wine, country: CountryCode): string | null {
  if (wine.hidden_from_site === true) return null;

  const priceExclVat = parseNumber(wine.price);
  const stock = parseNumber(wine.stock);
  const weight = parseNumber(wine.weight_kg);

  if (!Number.isFinite(priceExclVat) || priceExclVat <= 0) {
    return null;
  }

  if (!Number.isFinite(weight) || weight <= 0) {
    return null;
  }

  if (!wine.name?.trim() || !wine.slug?.trim()) {
    return null;
  }

  const image = absoluteUrl(wine.image);
  if (!image) return null;

  const productUrl = `${SITE_URL}/boutique/vin/${encodeURIComponent(
    wine.slug
  )}`;

  const priceInclVat =
    Math.round(
      (priceExclVat * (1 + VAT_RATES[country]) + Number.EPSILON) * 100
    ) / 100;

  const title = cleanText(wine.name);

  const description =
    cleanText(wine.description) ||
    [
      wine.name,
      wine.producer,
      wine.bottle_size,
      wine.packaging,
    ]
      .filter(Boolean)
      .join(" - ");

  const brand = cleanText(wine.producer) || "The Wine Watchers";

  const availability =
    Number.isFinite(stock) && stock > 0
      ? "in_stock"
      : "out_of_stock";

  return `
    <item>
      <g:id>${xmlEscape(wine.id)}</g:id>
      <title>${xmlEscape(title)}</title>
      <description>${xmlEscape(description.slice(0, 5000))}</description>
      <link>${xmlEscape(productUrl)}</link>
      <g:image_link>${xmlEscape(image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${formatPrice(priceInclVat)}</g:price>
      <g:condition>new</g:condition>
      <g:brand>${xmlEscape(brand)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping_weight>${formatWeight(weight)}</g:shipping_weight>
      <g:adult>yes</g:adult>
      <g:product_type>Vins</g:product_type>
    </item>`;
}

export async function GET(request: NextRequest) {
  try {
    const requestedCountry = (
      request.nextUrl.searchParams.get("country") || "FR"
    ).toUpperCase();

    if (
      requestedCountry !== "FR" &&
      requestedCountry !== "ES"
    ) {
      return NextResponse.json(
        { error: "Pays non pris en charge. Utiliser FR ou ES." },
        { status: 400 }
      );
    }

    const country = requestedCountry as CountryCode;
    const wines = await getWines();

    const items = wines
      .map((wine) => createItem(wine, country))
      .filter((item): item is string => item !== null);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>The Wine Watchers - ${country}</title>
    <link>${SITE_URL}</link>
    <description>Catalogue The Wine Watchers pour ${country}</description>
    ${items.join("\n")}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Erreur Merchant Feed :", error);

    return NextResponse.json(
      { error: "Impossible de générer le flux Merchant Center." },
      { status: 500 }
    );
  }
}
