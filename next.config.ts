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
        hostname: `${process.env.NEXT_PUBLIC_API_BASE_HOSTNAME}`,
      },
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_API_BASE_HOSTNAME}`,
      },
    ],
  },
};

export default nextConfig;
