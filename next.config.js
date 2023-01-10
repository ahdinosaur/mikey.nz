const { readFile } = require('fs/promises')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return (await readFile('./redirects.txt', 'utf8'))
      .trim().split('\n')
      .map(redirect => redirect.split(' '))
      .map(([source, destination]) => ({
        source: `${source}/:path*`,
        destination: `${destination}/:path*`,
        permanent: false,
      }))
  }
}

module.exports = nextConfig
