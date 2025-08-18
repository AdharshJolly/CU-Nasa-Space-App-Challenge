import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@firebase/firestore",
      "@firebase/auth",
    ],
  },
  // Enable gzip compression
  compress: true,
  // Power-saving and performance optimizations
  poweredByHeader: false,
  // Optimize bundle size
  swcMinify: true,
};

export default nextConfig;
