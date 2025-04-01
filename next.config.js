/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: "/fr/acheter-des-kamas",
        destination: "/acheter-des-kamas/dofus-kamas",
        permanent: true,
      },
      {
        source: "/en/acheter-des-kamas",
        destination: "/acheter-des-kamas/dofus-kamas",
        permanent: true,
      },
      {
        source: "/es/acheter-des-kamas",
        destination: "/acheter-des-kamas/dofus-kamas",
        permanent: true,
      },
      {
        source: "/ar/acheter-des-kamas",
        destination: "/acheter-des-kamas/dofus-kamas",
        permanent: true,
      },
    ];
  },
  poweredByHeader: false,
};

export default nextConfig;