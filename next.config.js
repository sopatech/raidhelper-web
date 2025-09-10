/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
    WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/:path*`,
      },
    ];
  },
  // Build optimizations to prevent retry issues
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Disable telemetry during build
  telemetry: false,
};

module.exports = nextConfig;
