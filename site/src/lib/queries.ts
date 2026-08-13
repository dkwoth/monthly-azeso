// 쿼리 문자열 태그 (편집기 GROQ 하이라이팅용, 런타임은 단순 문자열)
const groq = String.raw

const categoryProjection = `"id": slug.current, label, color`

/** 후기 카드 공통 필드 (목록/멤버 페이지) */
const postCardProjection = `
  "slug": slug.current,
  title,
  date,
  "mainImage": coalesce(gallery[_key == ^.mainImageKey][0], gallery[0]),
  excerpt,
  rating,
  location,
  "categories": categories[]->{${categoryProjection}},
  "memberNames": members[]->name
`

/** 후기 목록 (최신순) — 홈/후기 페이지 카드용 */
export const allPostsQuery = groq`
  *[_type == "post"] | order(date desc) {${postCardProjection}}
`

/** 전체 카테고리 */
export const allCategoriesQuery = groq`
  *[_type == "category"] | order(label asc) {${categoryProjection}}
`

/** 단일 후기 상세 */
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    date,
    excerpt,
    rating,
    location,
    mapUrl,
    gallery,
    body,
    "categories": categories[]->{${categoryProjection}},
    "members": members[]->{name},
    author->{
      name,
      bio,
      image,
      "favoriteCategories": favoriteCategories[]->{${categoryProjection}}
    }
  }
`

/** 정적 경로 생성용 슬러그 목록 */
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`

/** 멤버 목록 (방문 횟수 포함) */
export const membersQuery = groq`
  *[_type == "member"] {
    "slug": slug.current,
    name,
    bio,
    image,
    "favoriteCategories": favoriteCategories[]->{${categoryProjection}},
    "visitCount": count(*[_type == "post" && references(^._id)])
  }
`

/** 정적 경로 생성용 멤버 슬러그 목록 */
export const memberSlugsQuery = groq`
  *[_type == "member" && defined(slug.current)].slug.current
`

/** 단일 멤버 + 그 멤버가 작성한 후기 (최신순) */
export const memberBySlugQuery = groq`{
  "member": *[_type == "member" && slug.current == $slug][0] {
    "slug": slug.current,
    name,
    bio,
    image,
    "favoriteCategories": favoriteCategories[]->{${categoryProjection}}
  },
  "posts": *[_type == "post" && author->slug.current == $slug] | order(date desc) {${postCardProjection}}
}`

/** 통계 (어바웃 페이지) */
export const statsQuery = groq`{
  "postCount": count(*[_type == "post"]),
  "memberCount": count(*[_type == "member"])
}`
