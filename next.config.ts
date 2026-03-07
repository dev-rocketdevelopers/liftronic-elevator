import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: false,
    qualities: [75, 85, 90, 95, 100], // Support custom quality values
  },
  // 301 redirects for old nested product URLs to new flat structure
  // Old URLs: /products/[rangeSlug]/[productSlug] and /products/[rangeSlug]/[productSlug]/[city]
  // New URLs: /products/[productSlug] and /products/[productSlug]/[city]
  async redirects() {
    return [
      {
        source: "/blogs",
        has: [
          {
            type: "query",
            key: "page",
            value: "1",
          },
        ],
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/blogs",
        has: [
          {
            type: "query",
            key: "page",
            value: "(?<page>[2-9][0-9]*)",
          },
        ],
        destination: "/blogs/page/:page",
        permanent: true,
      },
      {
        source: "/products/:rangeSlug/:productSlug/:city",
        destination: "/products/:productSlug/:city",
        permanent: true,
      },
      {
        source: "/products/:rangeSlug/:productSlug",
        destination: "/products/:productSlug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
