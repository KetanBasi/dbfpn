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
}

export default nextConfig
