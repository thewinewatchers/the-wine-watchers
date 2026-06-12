import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/checkout/",
          "/panier/",
          "/connexion/",
          "/inscription/",
          "/mon-compte/",
        ],
      },
    ],
    sitemap: "https://www.thewinewatchers.com/sitemap.xml",
  };
}