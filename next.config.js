const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: process.env.NEXT_OUTPUT_MODE || "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../"),
    esmExternals: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  reactStrictMode: false,
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  staticPageGenerationTimeout: 1000,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Completely disable static generation
  generateStaticParams: false,
  dynamicParams: true,
};

module.exports = nextConfig;
