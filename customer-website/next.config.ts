import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Image optimization for your logo and backgrounds
  images: {
    domains: ['127.0.0.1', '192.168.0.41', 'epg.kevbot.app'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },

  // Remove webpack configuration when using Turbopack
  // Turbopack handles file watching automatically in Docker
};

export default nextConfig;
