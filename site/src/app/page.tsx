import type {Metadata} from 'next'
import Header from '@/components/Header'
import PostSlider from '@/components/PostSlider'
import PostCard from '@/components/PostCard'
import {getAllPostCards} from '@/lib/data'

// 루트 페이지에는 layout의 title.template이 적용되지 않으므로 absolute로 직접 지정
export const metadata: Metadata = {title: {absolute: '홈 | MONTHLY-AZESO'}}

export default async function HomePage() {
  const allPosts = await getAllPostCards() // 최신순 정렬됨

  // 최근 6개월 포스트 (슬라이더)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const recentPosts = allPosts.filter((p) => new Date(p.date) >= sixMonthsAgo)
  const sliderPosts = recentPosts.length > 0 ? recentPosts : allPosts.slice(0, 5)

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {sliderPosts.length > 0 && (
          <section className="mb-14">
            <PostSlider posts={sliderPosts} />
          </section>
        )}

        <section>
          <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-8">
            모든 후기
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
