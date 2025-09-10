import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "brave.iseek.name",
      },
      {
        protocol: "https",
        hostname: "brave.iseek.name",
      },
    ],
  },
};

export default nextConfig;
