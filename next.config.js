/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        preferRelative: true,
    }
};

module.exports = nextConfig;
