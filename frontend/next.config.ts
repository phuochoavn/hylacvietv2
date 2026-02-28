import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: false,
  // Experimental optimizations
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['framer-motion', 'lenis'],
  },
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
    // Enable modern image formats (AVIF is 50%+ smaller than WebP)
    formats: ['image/avif', 'image/webp'],
    // Responsive device sizes — removed 2048 (unnecessary)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allowed quality values
    qualities: [75, 85, 90],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    // Disable image optimization only if needed
    unoptimized: false,
  },
  // Compression
  compress: true,
  // Allow dev origins for hot reload
  allowedDevOrigins: ['http://72.62.249.214:3001', 'http://72.62.249.214', '72.62.249.214'],
  // Rewrites for API proxy — point to local backend
  async rewrites() {
    const apiHost = process.env.API_HOST || 'localhost:3000';
    return [
      {
        source: '/api/:path*',
        destination: `http://${apiHost}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `http://${apiHost}/uploads/:path*`,
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
      {
        // Cache optimized images for 30 days
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache uploaded content for 7 days
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
