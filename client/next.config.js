/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 1369726402,
    NEXT_PUBLIC_ZEGO_SERVER_ID: "13338a91e17fe69b02c0c8440d114d8d",
    // NEXT_PUBLIC_HOST: "http://localhost:3005",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
