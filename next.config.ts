import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "./public/images/**/*",
      "./public/uploads/**/*",
    ],
  },

  async redirects() {
    return [
      {
        source: "/vin/:slug*",
        destination: "/boutique/bordeaux",
        permanent: true,
      },
      {
        source: "/vins/:slug*",
        destination: "/boutique/bordeaux",
        permanent: true,
      },
      {
        source: "/primeurs",
        destination: "/boutique/primeurs-2025",
        permanent: true,
      },
      {
        source: "/primeurs-2025",
        destination: "/boutique/primeurs-2025",
        permanent: true,
      },
      {
        source: "/bordeaux-primeurs",
        destination: "/boutique/primeurs-2025",
        permanent: true,
      },
      {
        source: "/boutique/bordeaux-primeurs",
        destination: "/boutique/primeurs-2025",
        permanent: true,
      },
      {
        source: "/boutique/vin/chablis-grand-cru-valmur-2023",
        destination:
          "/boutique/vin/chablis-grand-cru-valmur-2023-raveneau",
        permanent: true,
      },
      {
        source:
          "/stemilion-chateau-cheval-blanc-xsl-253_259_310.html",
        destination: "/producteur/chateau-cheval-blanc",
        permanent: true,
      },
      {
        source: "/boutique/vin/leoville-poyferre-2025",
        destination: "/boutique/vin/chateau-leoville-poyferre-2025",
        permanent: true,
      },
      {
        source: "/producteur/pavillon-blanc",
        destination: "/producteur/chateau-margaux",
        permanent: true,
      },
      {
        source: "/boutique/vin/chateau-la-mission-haut-brion-2025",
        destination:
          "/boutique/vin/chateau-la-mission-haut-brion-rouge-2025",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;