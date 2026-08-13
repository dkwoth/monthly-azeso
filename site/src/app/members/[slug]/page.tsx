import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import CategoryBadge from '@/components/CategoryBadge'
import PostCard from '@/components/PostCard'
import {getMemberBySlug, getMemberSlugs} from '@/lib/data'
import {urlFor} from '@/lib/image'

export async function generateStaticParams() {
  const slugs = await getMemberSlugs()
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const data = await getMemberBySlug(slug)
  if (!data) return {}
  return {
    title: data.member.name,
    description: data.member.bio ?? `${data.member.name}님이 작성한 후기`,
  }
}

export default async function MemberPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const data = await getMemberBySlug(slug)
  if (!data) notFound()

  const {member, posts} = data
  const imageUrl = member.image
    ? urlFor(member.image).width(400).height(400).fit('crop').auto('format').url()
    : undefined

  return (
    <>
      <Header />

      {/* Profile */}
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
            <div className="shrink-0 w-28 h-28 md:w-36 md:h-36 overflow-hidden border-2 border-white bg-gray-800">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide">
                {member.name}
              </h1>
              {member.bio && <p className="mt-3 text-gray-400 text-lg">{member.bio}</p>}
              {member.favoriteCategories.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                    선호 카테고리
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.favoriteCategories.map((cat) => (
                      <CategoryBadge key={cat.id} label={cat.label} color={cat.color} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 border-b-2 border-black pb-3 mb-8">
          <h2 className="text-xl font-black uppercase tracking-widest">
            작성한 후기 ({posts.length})
          </h2>
          <Link
            href="/members"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            모든 멤버로
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-20 text-sm">
            {member.name}님이 작성한 후기가 아직 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
