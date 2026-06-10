import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "21495103.hs-sites.com",
      },
    ],
  },
};

export default nextConfig;
