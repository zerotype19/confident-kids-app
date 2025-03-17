// Next.js configuration file with updated settings for Cloudflare Pages deployment

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    unoptimized: true, // Required for Cloudflare Pages static exports
  },
  // Ensure compatibility with Cloudflare Pages
  output: 'standalone',
  // Disable unnecessary features for static export
  experimental: {
    appDir: true,
    serverActions: true,
  },
};

module.exports = nextConfig;
