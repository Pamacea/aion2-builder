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
};

export default nextConfig;