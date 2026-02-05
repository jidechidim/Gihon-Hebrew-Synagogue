/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opekmaxzucoswrbntpli.supabase.co",
        pathname: "/storage/v1/object/public/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
