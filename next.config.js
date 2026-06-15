/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      's3.amazonaws.com',
      'skaarvi-marketplace.s3.amazonaws.com',
      'skaarvi-marketplace.s3.ap-south-1.amazonaws.com'
    ],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Proxy /uploads requests to backend server
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/uploads/:path*`,
      },
    ];
  },
  // Webpack configuration for handling node modules in API routes
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'mysql2', 'sequelize'];
    }
    return config;
  },
}

module.exports = nextConfig
