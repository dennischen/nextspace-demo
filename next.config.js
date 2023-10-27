/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    async redirects() {
        return [
            {
                source: '/',
                destination: '/demo',
                permanent: false,
            },
        ]
    },
}

module.exports = nextConfig
