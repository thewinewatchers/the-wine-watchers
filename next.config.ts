import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/**/*",
      "node_modules/typescript/**/*",
      "node_modules/.cache/**/*",
      "node_modules/@react-email/**/*",
      "node_modules/react-email/**/*",
    ],
  },
};

export default nextConfig;