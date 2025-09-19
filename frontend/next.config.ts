import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    domains: ["randomuser.me"], // allow this external host
  },
};

export default nextConfig;
