import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingExcludes: {'/*':['./data/**/*','./.env*','./local-access.txt','./tests/**/*','./node_modules/.cache/mongodb-memory-server/**/*']},
  async headers() { return [{ source: '/:path*', headers: [{key:'X-Content-Type-Options',value:'nosniff'}, {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'}, {key:'X-Frame-Options',value:'DENY'}] }]; }
};
export default config;
