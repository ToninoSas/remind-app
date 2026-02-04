/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Imposta il limite desiderato (es. 10MB o 50MB)
    },
  },
};

export default nextConfig;
