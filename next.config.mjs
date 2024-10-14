/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    POCKETBASE_URL: process.env.POCKETBASE_URL,
  },
};

export default nextConfig;
