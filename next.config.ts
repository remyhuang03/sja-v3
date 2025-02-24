/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*.php', // 捕获所有 /api/*.php 的请求
        destination: '/api/:path*', // 去掉 .php 后映射到 Next.js 的 API 路由
      },
    ];
  },
};

export default nextConfig;