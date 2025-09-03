/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    // Ensure assets are bundled/available at runtime in serverless
    outputFileTracingIncludes: {
      '/app/api/ise/formulas-csv/route': ['./assets/**'],
      '/app/api/ise/compute/route': ['./assets/**'],
      '/app/api/ise/batch-calculate/route': ['./assets/**'],
      '/app/api/ise/debug-cells/route': ['./assets/**'],
      '/app/api/ise/debug-constants/route': ['./assets/**'],
      '/app/api/ise/debug-formula/route': ['./assets/**'],
    },
  },
}

module.exports = nextConfig
