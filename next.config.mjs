/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['www.thesportsdb.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.thesportsdb.com',
        port: '',
        pathname: '/images/**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
