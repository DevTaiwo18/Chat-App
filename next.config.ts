/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://chat-app-api-4srj.onrender.com/:path*', 
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;