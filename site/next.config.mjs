/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 정적 배포 (out/ 생성)
  output: 'export',
  images: {
    // next/image 최적화는 정적 export에서 동작하지 않음. Sanity CDN URL을 직접 사용.
    unoptimized: true,
  },
}

export default nextConfig
