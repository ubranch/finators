/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    POCKETBASE_URL: process.env.POCKETBASE_URL,
  },
};

export default nextConfig;
