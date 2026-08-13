import type {PortableTextBlock} from '@portabletext/react'

export interface Image {
  _type: 'image'
  asset: {_ref: string; _type: 'reference'}
  hotspot?: unknown
  crop?: unknown
}

export interface Category {
  id: string
  label: string
  color?: string
}

/** 후기 목록/카드용 (이미지는 URL 문자열로 변환된 형태) */
export interface PostCardData {
  slug: string
  title: string
  date: string
  image: string
  excerpt: string
  rating: number
  location: string
  categories: Category[]
  memberNames: string[]
}

/** Sanity raw 후기 (목록 쿼리 결과) */
export interface PostListItem {
  slug: string
  title: string
  date: string
  mainImage: Image
  excerpt: string
  rating: number
  location: string
  categories: Category[]
  memberNames: string[]
}

export interface AuthorData {
  name: string
  bio?: string
  image?: Image
  favoriteCategories?: Category[]
}

/** 단일 후기 상세 쿼리 결과 */
export interface PostDetail {
  slug: string
  title: string
  date: string
  excerpt: string
  rating: number
  location: string
  mapUrl?: string
  gallery: Image[]
  body?: PortableTextBlock[]
  categories: Category[]
  members: {name: string}[]
  author: AuthorData | null
}

/** 멤버 기본 정보 (멤버 상세 페이지 헤더용) */
export interface MemberProfile {
  slug: string
  name: string
  bio?: string
  image?: Image
  favoriteCategories: Category[]
}

/** 멤버 목록용 (방문 횟수 포함) */
export interface MemberData extends MemberProfile {
  visitCount: number
}

/** 멤버 상세: 프로필 + 그 멤버가 작성한 후기 */
export interface MemberDetail {
  member: MemberProfile
  posts: PostCardData[]
}
