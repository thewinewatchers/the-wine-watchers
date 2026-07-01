import type { MetadataRoute } from "next";
import { blogPosts } from "@/app/blog/blogPosts";

const siteUrl = "https://www.thewinewatchers.com";

type SitemapWine = {
  slug: string | null;
  producer: string | null;
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

async function getSitemapWines(): Promise<SitemapWine[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/wines?hidden_from_site=neq.true&slug=not.is.null&select=slug,producer&order=name.asc`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
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
    "/boutique/primeurs-2025",
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
    priority: path === "" ? 1 : 0.8,
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
    "gevrey-chambertin",
    "vosne-romanee",
    "chambolle-musigny",
    "meursault",
    "puligny-montrachet",
    "cote-de-nuits",
    "cote-de-beaune",
    "chablis",
  ];

  const pagesAppellations: MetadataRoute.Sitemap = appellations.map((slug) => ({
    url: `${siteUrl}/appellation/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const pagesVins: MetadataRoute.Sitemap = wines.map((wine) => ({
    url: `${siteUrl}/boutique/vin/${wine.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const producers = Array.from(
    new Set(
      wines
        .map((wine) => wine.producer)
        .filter((producer): producer is string => Boolean(producer))
        .map((producer) => slugify(producer))
    )
  );

  const pagesProducteurs: MetadataRoute.Sitemap = producers.map((slug) => ({
    url: `${siteUrl}/producteur/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
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
    ...pagesVins,
    ...pagesBlog,
  ];
}