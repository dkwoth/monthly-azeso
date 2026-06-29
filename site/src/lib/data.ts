import {client} from './sanity.client'
import {urlFor} from './image'
import {
  allPostsQuery,
  allCategoriesQuery,
  membersQuery,
  postBySlugQuery,
  postSlugsQuery,
  statsQuery,
} from './queries'
import type {Category, MemberData, PostCardData, PostDetail, PostListItem} from './types'

/** Sanity 후기(목록) → 카드 데이터 (이미지 URL 문자열로 변환) */
function toCardData(p: PostListItem): PostCardData {
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    image: urlFor(p.mainImage).width(800).height(520).fit('crop').auto('format').url(),
    excerpt: p.excerpt,
    rating: p.rating,
    location: p.location,
    categories: (p.categories ?? []).filter(Boolean),
    memberNames: (p.memberNames ?? []).filter(Boolean),
  }
}

export async function getAllPostCards(): Promise<PostCardData[]> {
  const posts = await client.fetch<PostListItem[]>(allPostsQuery)
  return posts.map(toCardData)
}

export async function getAllCategories(): Promise<Category[]> {
  return client.fetch<Category[]>(allCategoriesQuery)
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return client.fetch<PostDetail | null>(postBySlugQuery, {slug})
}

export async function getPostSlugs(): Promise<string[]> {
  return client.fetch<string[]>(postSlugsQuery)
}

export async function getMembers(): Promise<MemberData[]> {
  const members = await client.fetch<MemberData[]>(membersQuery)
  return members.sort(
    (a, b) => b.visitCount - a.visitCount || a.name.localeCompare(b.name, 'ko'),
  )
}

export async function getStats(): Promise<{postCount: number; memberCount: number}> {
  return client.fetch(statsQuery)
}
