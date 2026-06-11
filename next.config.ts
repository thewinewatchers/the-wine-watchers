import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/api/admin/upload-images": [
      "public/images/**/*",
    ],
    "*": [
      "public/images/**/*",
      "node_modules/typescript/**/*",
      "node_modules/.cache/**/*",
      "node_modules/@react-email/**/*",
      "node_modules/react-email/**/*",
    ],
  },
};

export default nextConfig;