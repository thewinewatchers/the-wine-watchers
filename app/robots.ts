import type { MetadataRoute } from "next";

const siteUrl = "https://www.thewinewatchers.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/checkout",
        "/panier",
        "/connexion",
        "/inscription",
        "/mon-compte",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}