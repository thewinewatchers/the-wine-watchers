import type { MetadataRoute } from "next";
import { getWines } from "@/lib/wines";
import { blogPosts } from "@/app/blog/blogPosts";

const siteUrl = "https://www.thewinewatchers.com";

const now = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const wines = await getWines();

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
    "/politique-confidentialite",
    "/politique-cookies",
    "/cgv",
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

  const pagesVins: MetadataRoute.Sitemap = wines
    .filter((wine) => Boolean(wine?.slug))
    .map((wine) => ({
      url: `${siteUrl}/boutique/vin/${wine.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
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
    ...pagesVins,
    ...pagesBlog,
  ];
}