/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://chat-app-api-bp8q.onrender.com/:path*', 
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;