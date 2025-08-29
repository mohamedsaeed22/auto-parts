import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "brave.iseek.name",
      },
    ],
  },
};

export default nextConfig;
