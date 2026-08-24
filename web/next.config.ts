import type { NextConfig } from "next";

const fastapi = (process.env.FASTAPI_INTERNAL_URL || "http://localhost:8000").replace(
  /\/$/,
  "",
);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      { source: "/static/:path*", destination: `${fastapi}/static/:path*` },
      { source: "/api/:path*", destination: `${fastapi}/api/:path*` },
      { source: "/auth/:path*", destination: `${fastapi}/auth/:path*` },
      { source: "/compensation/:path*", destination: `${fastapi}/compensation/:path*` },
      { source: "/analysis/:path*", destination: `${fastapi}/analysis/:path*` },
      { source: "/lawyers/:path*", destination: `${fastapi}/lawyers/:path*` },
      { source: "/admin/:path*", destination: `${fastapi}/admin/:path*` },
      { source: "/health", destination: `${fastapi}/health` },
    ];
  },
};

export default nextConfig;
