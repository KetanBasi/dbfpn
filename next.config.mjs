/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from any external domain since users can submit poster/banner URLs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      // Rewrite /dashboard routes to /dashboard/user (cleaner URLs)
      {
        source: '/dashboard',
        destination: '/dashboard/user',
      },
      {
        source: '/dashboard/watchlist',
        destination: '/dashboard/user/watchlist',
      },
      {
        source: '/dashboard/submissions',
        destination: '/dashboard/user/submissions',
      },
      {
        source: '/dashboard/settings',
        destination: '/dashboard/user/settings',
      },
    ]
  },
}

export default nextConfig
