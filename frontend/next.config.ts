import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Image optimization for your logo and backgrounds
  images: {
    domains: ['192.168.0.41', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.0.41',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },

  // Development configuration for Docker hot reloading
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  }),
};

export default nextConfig;
