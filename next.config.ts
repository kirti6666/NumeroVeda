import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  async rewrites() { return [{ source: '/api/:path*', destination: `${process.env.API_URL || 'http://127.0.0.1:4000'}/api/:path*` }]; },
  async headers() { return [{ source: '/:path*', headers: [{key:'X-Content-Type-Options',value:'nosniff'}, {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'}, {key:'X-Frame-Options',value:'DENY'}] }]; }
};
export default config;
