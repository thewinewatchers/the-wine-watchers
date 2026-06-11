import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/api/admin/upload-images": [
      "public/images/**/*",
    ],
  },
};

export default nextConfig;