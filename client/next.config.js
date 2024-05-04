/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // env: {
  //   NEXT_PUBLIC_HOST:"http://localhost:3005",
  // },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
