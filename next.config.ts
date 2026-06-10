import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@supabase/supabase-js",
    "resend",
    "stripe",
    "pdfkit",
    "@react-email/components",
    "@react-email/render",
  ],

  outputFileTracingIncludes: {},
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@react-email/**/*",
      "node_modules/@swc/**/*",
      "node_modules/typescript/**/*",
      "node_modules/.cache/**/*",
    ],
  },
};

export default nextConfig;