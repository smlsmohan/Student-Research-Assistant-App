import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    esmExternals: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
