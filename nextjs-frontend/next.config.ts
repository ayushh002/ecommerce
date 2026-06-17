import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:3000/auth/:path*',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:3000/products/:path*',
      },
      {
        source: '/api/cart/:path*',
        destination: 'http://localhost:3000/cart/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'http://localhost:3000/orders/:path*',
      },
    ];
  },
};

export default nextConfig;
