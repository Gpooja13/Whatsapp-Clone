/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 581296753,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "ea42d2a104a27b81eab96d2b0737cdf8",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
