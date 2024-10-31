/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "user-images.trustpilot.com", port: "" },
      // Add more trusted image domains if needed
      { protocol: "https", hostname: "*.vercel.app", port: "" },
      { protocol: "https", hostname: "*.2ibn.com", port: "" },
    ],
    // Optimize image loading
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Typescript and ESLint settings (Keep for development speed, but consider removing for production)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Add CSP if needed
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'"
          // }
        ],
      },
    ];
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // Build optimizations
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    serverComponentsExternalPackages: [],
  },

  // Cache optimization
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Redirect configuration (example)
  async redirects() {
    return [
      // Add your redirects here if needed
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },

  // Webpack optimization (optional)
  webpack: (config, { dev, isServer }) => {
    // Add custom webpack config here if needed
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        "react/jsx-runtime.js": "preact/compat/jsx-runtime",
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }
    return config;
  },
};

export default nextConfig;
