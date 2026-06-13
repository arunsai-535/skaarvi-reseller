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
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
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
