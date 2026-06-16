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
    ];
  },
};

export default nextConfig;