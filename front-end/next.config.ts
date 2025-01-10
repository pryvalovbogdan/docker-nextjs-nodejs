import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL,
    },
    output: 'standalone',
};

export default nextConfig;
