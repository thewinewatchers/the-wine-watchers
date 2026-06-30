import { notFound, redirect } from "next/navigation";
import WinePageClient from "./WinePageClient";

type Props = {
  params: Promise<{ id: string }>;
};

const SITE_URL = "https://www.thewinewatchers.com";

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

async function getWine(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) return null;

  async function fetchWine(column: "id" | "slug") {
    const url =
      `${supabaseUrl}/rest/v1/wines?${column}=eq.${encodeURIComponent(id)}` +
      `&hidden_from_site=neq.true` +
      `&select=*&limit=1`;

    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.[0] || null;
  }

  return (await fetchWine("id")) || (await fetchWine("slug"));
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <WinePageClient />
    </>
  );
}