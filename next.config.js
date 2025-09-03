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
      '/app/api/ise/trace/route': ['./assets/**'],
      '/app/api/ise/workbook-names/route': ['./assets/**'],
      '/app/api/ise/formulas/route': ['./assets/**'],
      '/app/api/ise/test-sheetjs/route': ['./assets/**'],
      '/app/api/ise/simple-test/route': ['./assets/**'],
      '/app/api/ise/test-workbook/route': ['./assets/**'],
      '/app/api/ise/diagnostics/route': ['./assets/**'],
      '/app/api/ise/batch/route': ['./assets/**'],
    },
  },
}

module.exports = nextConfig
