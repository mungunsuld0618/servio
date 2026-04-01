/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
          remotePatterns: [
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: '**' },
                ],
    },
    experimental: {
          serverActions: true,
    },
    webpack: (config) => {
          config.resolve.alias = {
                  ...config.resolve.alias,
                  '@': process.cwd(),
          };
          return config;
    },
};

export default nextConfig;
