import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@supabase/supabase-js",
    "resend",
    "stripe",
    "xlsx",
    "jspdf",
  ],

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