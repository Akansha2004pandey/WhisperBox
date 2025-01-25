import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
  serverComponentsExternalPackages: [
    '@react-email/components',
    '@react-email/render',
    '@react-email/tailwind'
]
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
};

export default nextConfig;
