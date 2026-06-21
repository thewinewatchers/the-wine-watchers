import type { MetadataRoute } from "next";
import { getWines } from "@/lib/wines";
import { blogPosts } from "@/app/blog/blogPosts";

const siteUrl = "https://www.thewinewatchers.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const wines = await getWines();

  const pagesPrincipales: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/boutique`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/boutique/bordeaux`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/boutique/primeurs-2025`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/boutique/bourgogne`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/boutique/italie`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/boutique/espagne`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/livraison`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const pagesAppellations: MetadataRoute.Sitemap = [
    "pauillac",
    "margaux",
    "pomerol",
    "saint-emilion",
    "saint-julien",
    "saint-estephe",
    "sauternes",
    "meursault",
    "vosne-romanee",
    "gevrey-chambertin",
    "chambolle-musigny",
  ].map((slug) => ({
    url: `${siteUrl}/appellation/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const pagesVins: MetadataRoute.Sitemap = wines.map((wine) => ({
    url: `${siteUrl}/boutique/vin/${wine.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const pagesBlog: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(),
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