import { notFound, permanentRedirect } from "next/navigation";
import WinePageClient from "./WinePageClient";

type Props = {
  params: Promise<{ id: string }>;
};

const SITE_URL = "https://www.thewinewatchers.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const legacySlugRedirects: Record<string, string> = {
  "for-de-pingus-2021-magnum": "flor-de-pingus-2021-magnum",
  "for-de-pingus-2023": "flor-de-pingus-2023",
  "chateau-belair-monange-2025-primeur-copie": "chateau-belair-monange-2025",
  "chateau-lafleur-2025-primeur-copie-2": "chateau-lafleur-2025-cbo-3",
  cbo3: "chateau-lafleur-2025-cbo-3",
  "chateau-lafleur-2025-primeur-copie": "chateau-lafleur-2025-cbo-3",
  "chateau-canon-2023-2023-copie": "chateau-canon-2023",
};

function normalizeLegacySlug(slug: string) {
  if (legacySlugRedirects[slug]) {
    return legacySlugRedirects[slug];
  }

  return slug
    .replace(
      /-(2010|2015|2018|2019|2020|2021|2022|2023|2024|2025)-\1(-2)?$/,
      "-$1"
    )
    .replace(/-(2025)-primeur-2025$/, "-$1")
    .replace(/-copie$/, "");
}

function parsePrice(price?: string | number) {
  if (price === undefined || price === null || price === "") return 0;

  if (typeof price === "number") {
    return price;
  }

  const cleaned = price
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function getImageUrl(image?: string) {
  if (!image) {
    return `${SITE_URL}/logo.png`;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

function slugify(value?: string | null) {
  if (!value) return "";

  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoryToSlug(value?: string | null) {
  if (!value) return "";

  const normalized = slugify(value);

  if (normalized.includes("champagne")) return "champagne";

  if (
    normalized.includes("etats-unis") ||
    normalized.includes("etats-unis-d-amerique") ||
    normalized.includes("usa") ||
    normalized.includes("united-states") ||
    normalized.includes("californie") ||
    normalized.includes("napa")
  ) {
    return "usa";
  }

  if (normalized.includes("italie")) return "italie";
  if (normalized.includes("bourgogne")) return "bourgogne";
  if (normalized.includes("bordeaux")) return "bordeaux";
  if (normalized.includes("rhone")) return "rhone";
  if (normalized.includes("espagne")) return "espagne";
  if (normalized.includes("primeur")) return "primeurs-2025";

  return normalized;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function getWine(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) return null;

  async function fetchWine(column: "id" | "slug", value: string) {
    const url =
      `${supabaseUrl}/rest/v1/wines?${column}=eq.${encodeURIComponent(value)}` +
      `&hidden_from_site=neq.true` +
      `&select=*&limit=1`;

    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.[0] || null;
  }

  if (isUuid(id)) return (await fetchWine("id", id)) || null;
  return (await fetchWine("slug", id)) || null;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const normalizedId = normalizeLegacySlug(id);
  const wine = await getWine(normalizedId);

  if (!wine) {
    return {
      title: "Vin introuvable – The Wine Watchers",
      description: "Fiche vin introuvable sur The Wine Watchers.",
      robots: { index: false, follow: false },
    };
  }

  const slug = wine.slug || wine.id;
  const canonicalUrl = `${SITE_URL}/boutique/vin/${slug}`;
  const title = wine.seo_title || `${wine.name || "Grand vin"} – The Wine Watchers`;
  const description =
    wine.seo_description ||
    wine.description ||
    `${wine.name || "Grand vin"} disponible chez The Wine Watchers.`;
  const imageUrl = getImageUrl(wine.image);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "The Wine Watchers",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: wine.name || "Grand vin sélectionné par The Wine Watchers",
        },
      ],
    },
  };
}

export default async function WinePage({ params }: Props) {
  const { id } = await params;
  const normalizedId = normalizeLegacySlug(id);

  if (normalizedId !== id) {
    const normalizedWine = await getWine(normalizedId);

    if (normalizedWine) {
      permanentRedirect(`/boutique/vin/${normalizedWine.slug || normalizedWine.id}`);
    }
  }

  const wine = await getWine(id);
  if (!wine) notFound();

  const slug = wine.slug || wine.id;
  if (id !== slug) permanentRedirect(`/boutique/vin/${slug}`);

  const price = parsePrice(wine.price);
  const imageUrl = getImageUrl(wine.image);
  const canonicalUrl = `${SITE_URL}/boutique/vin/${slug}`;
  const regionName = wine.region || wine.category || "";
  const regionSlug = categoryToSlug(regionName);
  const appellationSlug = slugify(wine.appellation);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: wine.name,
    url: canonicalUrl,
    image: [imageUrl],
    description:
      wine.seo_description ||
      wine.description ||
      `${wine.name} disponible chez The Wine Watchers.`,
    brand: {
      "@type": "Brand",
      name: wine.producer || "The Wine Watchers",
    },
    category: wine.category || "Vin",
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "EUR",
      ...(price > 0 ? { price: price.toFixed(2) } : {}),
      availability:
        Number(wine.stock || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Boutique",
      item: `${SITE_URL}/boutique`,
    },
  ];

  if (regionSlug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: breadcrumbItems.length + 1,
      name: regionName || "Région",
      item: `${SITE_URL}/boutique/${regionSlug}`,
    });
  }

  if (wine.appellation && appellationSlug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: breadcrumbItems.length + 1,
      name: wine.appellation,
      item: `${SITE_URL}/appellation/${appellationSlug}`,
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    position: breadcrumbItems.length + 1,
    name: wine.name || "Fiche vin",
    item: canonicalUrl,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <WinePageClient initialWine={wine} />
    </>
  );
}