import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow local LAN origin in development to avoid HMR / dev resource blocking
  allowedDevOrigins: ['192.168.1.7', '192.168.1.7:3000', 'localhost', 'localhost:3000'],

  // Disable the floating development indicator ("N" logo badge)
  devIndicators: false,

  // Mongoose, bcryptjs use native Node.js modules — exclude from Edge/client bundles
  serverExternalPackages: ['mongoose', 'bcryptjs'],

  images: {
    remotePatterns: [
      // Allow Supabase Storage images
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
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
};

export default nextConfig;
