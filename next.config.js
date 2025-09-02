/** @type {import('next').NextConfig} */
const nextConfig = {
  // ========================================
  // VERCEL OPTIMIZATION
  // ========================================
  
  // Enable experimental features for better performance
  experimental: {
    // Remove deprecated configs - Next.js 15 handles these automatically
  },

  // ========================================
  // IMAGE OPTIMIZATION
  // ========================================
  images: {
    // Configure external image sources
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
        protocol: 'https',
        hostname: 'storage.manadabook.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000', // MinIO local
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
    
    // Optimize for different screen sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Enable AVIF for better compression
    formats: ['image/avif', 'image/webp'],
    
    // Cache optimization
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  // ========================================
  // PERFORMANCE OPTIMIZATION
  // ========================================
  
  // Optimize bundle size
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Reduce bundle size
    if (config.optimization?.splitChunks?.cacheGroups) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        firebase: {
          test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
          name: 'firebase',
          chunks: 'all',
          priority: 10,
        },
        stripe: {
          test: /[\\/]node_modules[\\/](@stripe|stripe)[\\/]/,
          name: 'stripe', 
          chunks: 'all',
          priority: 10,
        }
      };
    }

    return config;
  },

  // ========================================
  // API ROUTES CONFIGURATION
  // ========================================
  
  // Configure API routes for Vercel
  async rewrites() {
    return [
      // Proxy backend APIs if needed
      {
        source: '/backend-api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },

  async headers() {
    return [
      // Security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
      // API CORS headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // ========================================
  // REDIRECTS
  // ========================================
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/market',
        destination: '/marketplace',
        permanent: true,
      },
      {
        source: '/social',
        destination: '/feed',
        permanent: true,
      },
    ];
  },

  // ========================================
  // BUILD OPTIMIZATION
  // ========================================
  
  // Environment variable validation
  env: {
    CUSTOM_BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || 'local-build',
  },

  // ========================================
  // VERCEL SPECIFIC
  // ========================================
  
  // PoweredByHeader disabled for security
  poweredByHeader: false,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // ESLint configuration for build
  eslint: {
    // Only run ESLint on specific directories during build
    dirs: ['app', 'lib', 'components'],
    
    // Don't fail build on ESLint errors in production
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },

  // TypeScript configuration  
  typescript: {
    // Don't fail build on TypeScript errors in production
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;