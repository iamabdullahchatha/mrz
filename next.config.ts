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
};

export default nextConfig;
