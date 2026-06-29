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
  mainImage: Image
  gallery?: Image[]
  body?: PortableTextBlock[]
  categories: Category[]
  members: {name: string}[]
  author: AuthorData | null
}

export interface MemberData {
  slug: string
  name: string
  bio?: string
  image?: Image
  favoriteCategories: Category[]
  visitCount: number
}
