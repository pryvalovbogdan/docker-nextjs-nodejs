import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_OFFICE_EMAIL: process.env.NEXT_PUBLIC_OFFICE_EMAIL,
    NEXT_PUBLIC_OFFICE_PHONE: process.env.NEXT_PUBLIC_OFFICE_PHONE,
    NEXT_PUBLIC_OFFICE_PHONE_SECOND: process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
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
