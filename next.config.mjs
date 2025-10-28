/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
    serverActions: true,
    turbo: {
      resolveAlias: {},
      rules: {},
    },
  },
  compiler: {
    reactRemoveProperties: true,
    removeConsole: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
