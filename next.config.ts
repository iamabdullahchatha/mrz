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
      // Services that are no longer offered — send old links to the services index.
      { source: "/services/accounting-bookkeeping", destination: "/services", permanent: true },
      { source: "/services/documents-clearing", destination: "/services", permanent: true },
      // The Documentation & Compliance sector was built around documents clearing — send it to the industries index.
      { source: "/industries/documentation-compliance", destination: "/industries", permanent: true },
    ];
  },
};

export default nextConfig;
