/** @type {import('next').NextConfig} */
const nextConfig = {
  // firebase-admin එක Vercel serverless build එකේදී නිවැරදිව load වීමට
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;