import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "firebase-admin",
    "google-auth-library",
    "gaxios",
  ],
  outputFileTracingIncludes: {
    "/api/**/*": [
      "./node_modules/firebase-admin/**/*",
      "./node_modules/google-auth-library/**/*",
      "./node_modules/gaxios/**/*",
    ],
  },
};

export default nextConfig;