import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["brave.iseek.name"],
    // Or if using Next.js 12.3+, you can use remotePatterns:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'iseek.name',
    //   },
    // ],
  },
};

export default nextConfig;
