/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://api.raidhelper.local:8086',
    WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://ws.raidhelper.local:8086',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://api.raidhelper.local:8086'}/:path*`,
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
