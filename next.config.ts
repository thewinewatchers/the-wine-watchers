import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@supabase/supabase-js",
    "resend",
    "stripe",
    "pdfkit",
  ],
};

export default nextConfig;