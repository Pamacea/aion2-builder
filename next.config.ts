import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compression
  compress: true,
  
  // Optimisation du build
  swcMinify: true,
  
  // Redirection de la route de base /build vers /build/profile
  async redirects() {
    return [
      {
        source: '/build', 
        destination: '/', 
        permanent: true, 
      },
    ];
  },
  
  // Exclude Prisma and database packages from client bundles
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
  
  // Configuration des images pour autoriser les avatars Discord
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/avatars/**',
      },
    ],
    // Optimisation des images
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Headers de sécurité et cache
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Optimisation du bundle
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-select', '@radix-ui/react-alert-dialog'],
  },
};

export default nextConfig;