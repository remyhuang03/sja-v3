import type { NextConfig } from "next";

const backend = process.env.API_INTERNAL_URL || "http://127.0.0.1:8080";
const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
  },
};
export default nextConfig;
