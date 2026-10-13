import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow local LAN origin in development to avoid HMR / dev resource blocking
  allowedDevOrigins: ['192.168.1.7', '192.168.1.7:3000', 'localhost', 'localhost:3000'],

  // Disable the floating development indicator ("N" logo badge)
  devIndicators: false,

  // Mongoose, bcryptjs use native Node.js modules — exclude from Edge/client bundles
  serverExternalPackages: ['mongoose', 'bcryptjs'],

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Allow Supabase Storage images (both raw object and transformed render endpoints)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/**',
      },
      // Allow Unsplash images for hero slideshow and media
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Allow YouTube thumbnails
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/programs/courses',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/programs/workshops',
        destination: '/workshops',
        permanent: true,
      },
      {
        source: '/programs/corporate',
        destination: '/corporate',
        permanent: true,
      },
      {
        source: '/programs/membership',
        destination: '/membership',
        permanent: true,
      },
      {
        source: '/programs/trainers',
        destination: '/trainers',
        permanent: true,
      },
      {
        source: '/founder',
        destination: '/about/founder',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
