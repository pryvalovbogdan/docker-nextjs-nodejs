import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/uk',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
