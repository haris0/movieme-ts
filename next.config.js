/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'],
  },
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    scrollRestoration: true,
  },
};
