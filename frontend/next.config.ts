import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    domains: ["randomuser.me"], // allow this external host
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_ROUTE || "http://localhost:5000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
