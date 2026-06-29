import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import RatingIcon from '@/components/RatingIcon'
import CategoryBadge from '@/components/CategoryBadge'
import PostCard from '@/components/PostCard'
import AuthorCard from '@/components/AuthorCard'
import PostImageGallery from '@/components/PostImageGallery'
import PortableTextBody from '@/components/PortableTextBody'
import {getAllPostCards, getPostBySlug, getPostSlugs} from '@/lib/data'
import {urlFor} from '@/lib/image'
import {formatDate} from '@/lib/format'

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {title: post.title, description: post.excerpt}
}

export default async function PostPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const formattedDate = formatDate(post.date)
  const memberNames = (post.members ?? []).map((m) => m.name)

  const galleryUrls =
    post.gallery && post.gallery.length > 0
      ? post.gallery.map((img) => urlFor(img).width(1600).auto('format').url())
      : []

  // 관련 후기 (같은 카테고리, 최대 3개)
  const allPosts = await getAllPostCards()
  const currentCatIds = post.categories.map((c) => c.id)
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.categories.some((c) => currentCatIds.includes(c.id)))
    .slice(0, 3)

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto py-10">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat) => (
              <CategoryBadge key={cat.id} label={cat.label} color={cat.color} />
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">{post.title}</h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 italic leading-relaxed border-l-4 border-black pl-4 mb-8">
            {post.excerpt}
          </p>

          {/* Image */}
          {galleryUrls.length > 0 ? (
            <PostImageGallery images={galleryUrls} alt={post.title} />
          ) : (
            <div className="overflow-hidden h-52 sm:h-80 md:h-[512px] bg-gray-100 mb-8 border-2 border-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlFor(post.mainImage).width(1600).height(1024).fit('crop').auto('format').url()}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-5 bg-gray-50 border border-gray-200">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">날짜</p>
              <p className="text-sm font-semibold">{formattedDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">평점</p>
              <RatingIcon rating={post.rating} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">작성자</p>
              <p className="text-sm font-semibold">{post.author?.name ?? '익명'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">참여 멤버</p>
              <p className="text-sm font-semibold">
                <span className="flex flex-wrap gap-x-1">
                  {memberNames.map((name, i) => (
                    <span key={i} className="whitespace-nowrap">
                      {name}
                      {i < memberNames.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </span>
              </p>
            </div>
            <div className="col-span-2 md:col-span-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">위치</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{post.location}</p>
                {post.mapUrl && (
                  <a
                    href={post.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-black text-white hover:bg-accent transition-colors duration-200"
                  >
                    지도 보기 →
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          {post.body && post.body.length > 0 && <PortableTextBody value={post.body} />}

          {/* Author */}
          {post.author && (
            <div className="mt-12">
              <AuthorCard
                name={post.author.name}
                bio={post.author.bio}
                image={
                  post.author.image
                    ? urlFor(post.author.image).width(200).height(200).fit('crop').auto('format').url()
                    : undefined
                }
                favoriteCategories={post.author.favoriteCategories ?? []}
              />
            </div>
          )}

          {/* Back */}
          <div className="mt-10 pt-8 border-t-2 border-black">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              모든 후기로
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16 py-10">
            <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-8">
              관련 후기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <PostCard key={p.slug} {...p} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
