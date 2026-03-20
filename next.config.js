/** @type {import('next').NextConfig} */
if (process.env.NODE_ENV === 'development') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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
