import type { MetadataRoute } from "next";

const siteUrl = "https://www.thewinewatchers.com";

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