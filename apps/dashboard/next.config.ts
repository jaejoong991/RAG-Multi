import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["192.168.99.17", "localhost:3001"],
  },
};

export default nextConfig;
