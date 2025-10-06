/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
};

module.exports = nextConfig;
