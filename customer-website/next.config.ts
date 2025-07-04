import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Image optimization for your logo and backgrounds
  images: {
    domains: ['192.168.0.41', 'localhost', 'epg.kevbot.app'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.0.41',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'epg.kevbot.app',
        pathname: '/uploads/**',
      },
    ],
  },

  // Remove webpack configuration when using Turbopack
  // Turbopack handles file watching automatically in Docker
};

export default nextConfig;
