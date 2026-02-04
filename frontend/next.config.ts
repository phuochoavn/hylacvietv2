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
      {
        protocol: 'http',
        hostname: '72.62.249.214',
        pathname: '/uploads/**',
      },
    ],
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
    // Responsive device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    // Disable image optimization only if needed
    unoptimized: false,
  },
  // Compression
  compress: true,
  // Allow dev origins for hot reload
  allowedDevOrigins: ['http://72.62.249.214:3001', 'http://72.62.249.214', '72.62.249.214'],
  // Rewrites for API proxy in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://hylacviet.vn/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://hylacviet.vn/uploads/:path*',
      },
    ];
  },
  // Headers for caching
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
