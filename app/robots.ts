import type { MetadataRoute } from "next";

const siteUrl = "https://the-wine-watchers.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/panier"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}