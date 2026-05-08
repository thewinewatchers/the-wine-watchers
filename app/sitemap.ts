import type { MetadataRoute } from "next";
import { getWines } from "@/lib/wines";

const siteUrl = "https://the-wine-watchers.vercel.app";

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

  const pagesVins: MetadataRoute.Sitemap = wines.map((wine) => ({
    url: `${siteUrl}/boutique/${wine.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...pagesPrincipales, ...pagesVins];
}