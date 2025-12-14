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
        hostname: "falparts.cloud",
      },
      {
        protocol: "https",
        hostname: "falparts.cloud",
      },
    ],
  },
};

export default nextConfig;
