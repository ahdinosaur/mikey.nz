const { readFile } = require('node:fs/promises')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },

  async redirects() {
    return (await readFile('./redirects.txt', 'utf8'))
      .trim()
      .split('\n')
      .map((redirect) => redirect.split(/\s+/))
      .map(([source, destination]) => ({
        source: `${source}/:path*`,
        destination: `${destination}/:path*`,
        permanent: false,
      }))
  },
}

module.exports = nextConfig
