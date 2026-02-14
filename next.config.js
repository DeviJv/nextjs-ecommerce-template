/** @type {import('next').NextConfig} */
const nextConfig = {
      
      images: {
            unoptimized: true,
            remotePatterns: [
            {
                        protocol: "https",
                        hostname: "e-commerce.test",
            },
            {     
                        protocol: "http",
                        hostname: "localhost",
             },
    ],
  },
};

module.exports = nextConfig;
