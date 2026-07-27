import type { MetadataRoute } from "next";
import { blogPosts } from "@/app/blog/blogPosts";

const siteUrl = "https://www.thewinewatchers.com";

type SitemapWine = {
  slug: string | null;
  producer: string | null;
  vintage: string | number | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeVintage(value: string | number | null) {
  if (value === null || value === undefined) return null;

  const year = String(value).trim();

  if (!/^\d{4}$/.test(year)) return null;

  return year;
}

async function getSitemapWines(): Promise<SitemapWine[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/wines?hidden_from_site=neq.true&slug=not.is.null&select=slug,producer,vintage&order=name.asc`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    console.error(
      "Erreur lors du chargement des vins pour le sitemap :",
      response.status,
      response.statusText
    );

    return [];
  }

  return response.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const wines = await getSitemapWines();

  const pagesPrincipales: MetadataRoute.Sitemap = [
    "",
    "/boutique",
    "/boutique/bordeaux",
    "/boutique/bourgogne",
    "/boutique/rhone",
    "/boutique/italie",
    "/boutique/espagne",
    "/boutique/usa",
    "/boutique/champagne",
    "/boutique/primeurs-2025",
    "/millesimes",
    "/blog",
    "/a-propos",
    "/livraison",
    "/contact",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/politique-cookies",
    "/conditions-generales-de-vente",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : path === "/millesimes" ? 0.9 : 0.8,
  }));

  const appellations = [
    "pauillac",
    "margaux",
    "saint-julien",
    "saint-estephe",
    "pomerol",
    "saint-emilion",
    "pessac-leognan",
    "sauternes",
    "cote-de-nuits",
    "cote-de-beaune",
    "chablis",
    "meursault",
    "puligny-montrachet",
    "gevrey-chambertin",
    "vosne-romanee",
    "chambolle-musigny",
    "cote-rotie",
    "hermitage",
    "cornas",
    "saint-joseph",
    "chateauneuf-du-pape",
    "gigondas",
    "toscane",
    "piemont",
    "barolo",
    "barbaresco",
    "brunello-di-montalcino",
    "bolgheri",
    "super-toscans",
    "ribera-del-duero",
    "rioja",
    "priorat",
    "toro",
    "rias-baixas",
    "napa-valley",
    "sonoma",
    "oakville",
    "rutherford",
    "stags-leap-district",
    "montagne-de-reims",
    "vallee-de-la-marne",
    "cote-des-blancs",
    "cote-des-bar",
    "champagne",
  ];

  const pagesAppellations: MetadataRoute.Sitemap = appellations.map((slug) => ({
    url: `${siteUrl}/appellation/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const pagesVins: MetadataRoute.Sitemap = wines
    .filter(
      (wine): wine is SitemapWine & { slug: string } =>
        typeof wine.slug === "string" && wine.slug.trim().length > 0
    )
    .map((wine) => ({
      url: `${siteUrl}/boutique/vin/${wine.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    }));

  const producers = Array.from(
    new Set(
      wines
        .map((wine) => wine.producer)
        .filter(
          (producer): producer is string =>
            typeof producer === "string" && producer.trim().length > 0
        )
        .map((producer) => slugify(producer))
        .filter(Boolean)
    )
  );

  const pagesProducteurs: MetadataRoute.Sitemap = producers.map((slug) => ({
    url: `${siteUrl}/producteur/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const vintages = Array.from(
    new Set(
      wines
        .map((wine) => normalizeVintage(wine.vintage))
        .filter((vintage): vintage is string => Boolean(vintage))
    )
  ).sort((a, b) => Number(b) - Number(a));

  const pagesMillesimes: MetadataRoute.Sitemap = vintages.map((year) => ({
    url: `${siteUrl}/millesime/${year}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const pagesBlog: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...pagesPrincipales,
    ...pagesAppellations,
    ...pagesProducteurs,
    ...pagesMillesimes,
    ...pagesVins,
    ...pagesBlog,
  ];
}