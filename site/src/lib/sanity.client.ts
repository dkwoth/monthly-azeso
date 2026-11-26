import {createClient} from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const apiVersion = '2024-01-01'

if (!projectId || !dataset) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET. Copy .env.example to .env.local and fill them in.',
  )
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // 정적 빌드는 항상 최신 데이터를 읽어야 하므로 API CDN(apicdn)을 쓰지 않는다.
  // 글 발행 웹훅으로 빌드가 시작될 때 CDN 캐시가 아직 갱신되지 않은 경우가 있고,
  // 쿼리마다 따로 캐시되어 한 빌드 안에서도 쿼리 간 데이터가 어긋날 수 있다.
  // (예: 목록에는 링크가 있는데 generateStaticParams 결과에서 빠져 세부 페이지가 생성되지 않음)
  useCdn: false,
})
