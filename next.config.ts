/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export
  trailingSlash: true, // এটি গুরুত্বপূর্ণ
  images: {
    unoptimized: true,
  },
  // Netlify এর জন্য basePath সেট করুন
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig