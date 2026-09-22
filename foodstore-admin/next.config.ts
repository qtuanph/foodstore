import type { NextConfig } from "next";

const backendUrl = process.env.API_PROXY_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v2";

const nextConfig: NextConfig = {
  output: "standalone",

  // React Compiler - tự memoize, bỏ useMemo/useCallback thủ công
  reactCompiler: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "rustfs" },
    ],
  },

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        source: "/api/proxy/hubs/:path*",
        destination: `${backendUrl.replace(/\/v\d+$/, "")}/hubs/:path*`,
      },
      {
        source: "/api/proxy/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
