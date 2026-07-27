import { notFound, redirect } from "next/navigation";
import WinePageClient from "./WinePageClient";

type Props = {
  params: Promise<{ id: string }>;
};

const SITE_URL = "https://www.thewinewatchers.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeLegacySlug(slug: string) {
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
  if (typeof price === "number") return price;

  const cleaned = price
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getImageUrl(image?: string) {
  if (!image) return `${SITE_URL}/logo.png`;
  if (image.startsWith("http")) return image;
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

  if (isUuid(id)) {
    return (await fetchWine("id", id)) || null;
  }

  return (await fetchWine("slug", id)) || null;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const wine = await getWine(id);

  if (!wine) {
    return {
      title: "Vin introuvable – The Wine Watchers",
      description: "Fiche vin introuvable sur The Wine Watchers.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const slug = wine.slug || wine.id;
  const canonicalUrl = `${SITE_URL}/boutique/vin/${slug}`;

  const title =
    wine.seo_title || `${wine.name || "Grand vin"} – The Wine Watchers`;

  const description =
    wine.seo_description ||
    wine.description ||
    `${wine.name || "Grand vin"} disponible chez The Wine Watchers.`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [getImageUrl(wine.image)],
      type: "website",
    },
  };
}

export default async function WinePage({ params }: Props) {
  const { id } = await params;

  const normalizedId = normalizeLegacySlug(id);

  if (normalizedId !== id) {
    const normalizedWine = await getWine(normalizedId);

    if (normalizedWine) {
      redirect(`/boutique/vin/${normalizedWine.slug || normalizedWine.id}`);
    }
  }

  const wine = await getWine(id);

  if (!wine) {
    notFound();
  }

  const slug = wine.slug || wine.id;

  if (id !== slug) {
    redirect(`/boutique/vin/${slug}`);
  }

  const price = parsePrice(wine.price);
  const imageUrl = getImageUrl(wine.image);
  const canonicalUrl = `${SITE_URL}/boutique/vin/${slug}`;
  const regionSlug = categoryToSlug(wine.region || wine.category);
  const appellationSlug = slugify(wine.appellation);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: wine.name,
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
      price: price > 0 ? price.toFixed(2) : undefined,
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
      name: wine.region || wine.category || "Région",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <WinePageClient initialWine={wine} />
    </>
  );
}