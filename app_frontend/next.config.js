/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'], // Add your image domains here
    unoptimized: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Don't run ESLint during production builds
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig 