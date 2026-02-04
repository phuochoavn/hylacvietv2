import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hylacviet.vn',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.hylacviet.vn',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
