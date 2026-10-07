import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/brand/**", search: "" },
    ],
  },
  async redirects() {
    return [
      // Accounting & Bookkeeping is no longer offered — send old links to the services index.
      { source: "/services/accounting-bookkeeping", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
