import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin පැකේජය Vercel serverless environment එකේ නිවැරදිව ලෝඩ් වීමට:
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;