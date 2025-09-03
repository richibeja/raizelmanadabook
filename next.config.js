/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel-optimized config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
  
  // TypeScript/ESLint settings for Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Vercel-specific
  poweredByHeader: false,
  reactStrictMode: false,
};

module.exports = nextConfig;