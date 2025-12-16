import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  },
};

export default nextConfig;