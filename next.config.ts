import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(process.cwd(), "src"),
    };
    return config;
  },
  async rewrites() {
    const configuredOrigin = process.env.API_PROXY_ORIGIN?.trim();
    if (!configuredOrigin) return [];

    const apiOrigin = new URL(configuredOrigin);
    if (
      (apiOrigin.protocol !== "https:" &&
        apiOrigin.hostname !== "localhost" &&
        apiOrigin.hostname !== "127.0.0.1") ||
      apiOrigin.pathname !== "/" ||
      apiOrigin.search ||
      apiOrigin.hash
    ) {
      throw new Error("API_PROXY_ORIGIN must be an HTTPS origin (HTTP is allowed only for localhost).");
    }

    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${apiOrigin.origin}/api/:path*`,
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.zyrosite.com",
      },
      {
        protocol: "https",
        hostname: "assets.zyrosite.com",
      },
    ],
  },
};

export default nextConfig;
