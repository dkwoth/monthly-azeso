import type {Metadata} from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import PostSlider from '@/components/PostSlider'
import RatingIcon from '@/components/RatingIcon'
import {getAllPostCards, getStats} from '@/lib/data'

// 루트 페이지에는 layout의 title.template이 적용되지 않으므로 absolute로 직접 지정
export const metadata: Metadata = {
  title: {absolute: '홈 | MONTHLY-AZESO'},
  description: '맛집 탐방 소모임 AZESO 소개',
}

const ratings = [
  {score: 3, desc: '만나는 모두에게 자랑하고 싶은 맛.'},
  {score: 2, desc: '주변 사람과 함께 즐기고 싶은 맛.'},
  {score: 1, desc: '근처라면 다시 찾고 싶은 맛.'},
  {score: 0, desc: '나쁘진 않지만, 내 마음속에만 저장하는 맛.'},
]

const steps = [
  {step: '01', title: '장소 선정', desc: '멤버들이 가고 싶은 곳을 추천하고 함께 결정합니다.'},
  {step: '02', title: '함께 방문', desc: '약속을 잡고 함께 방문합니다.'},
  {step: '03', title: '기록 공유', desc: '방문 후 후기를 작성하고 이 사이트에 공유합니다.'},
]

export default async function HomePage() {
  const [allPosts, {postCount, memberCount}] = await Promise.all([
    getAllPostCards(), // 최신순 정렬됨
    getStats(),
  ])

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
          <section className="mb-16">
            <PostSlider posts={sliderPosts} />
            <div className="mt-3 flex justify-end">
              <Link
                href="/posts"
                className="inline-flex items-center gap-1.5 text-sm font-bold tracking-wide text-gray-600 hover:text-accent transition-colors duration-200"
              >
                모든 후기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-14">
          <section className="md:col-span-2">
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6">
              소모임 소개
            </h2>
            <p className="text-lg leading-loose text-gray-700">
              <strong className="text-accent">AZESO</strong>는 맛집을 사랑하는 사람들이 모인 탐방
              소모임입니다. 매달 한 곳 이상의 맛집을 함께 방문하고, 그 경험을 기록으로 남깁니다. 단순한
              리뷰가 아닌, 그 공간에서 나눈 대화와 분위기까지 담아냅니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6">
              현황
            </h2>
            <div className="flex gap-8">
              <div>
                <p className="text-5xl font-black">{postCount}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">방문 기록</p>
              </div>
              <div>
                <p className="text-5xl font-black">{memberCount}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">멤버</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mb-14">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6">
            운영 방식
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map(({step, title, desc}) => (
              <div
                key={step}
                className="border-2 border-black p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <p className="text-4xl font-black text-gray-400 mb-2">{step}</p>
                <h3 className="text-base font-black uppercase tracking-wide mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6">
            평가 기준
          </h2>
          <div className="flex flex-col gap-4">
            {ratings.map(({score, desc}) => (
              <div key={score} className="flex items-center gap-4">
                <div className="shrink-0 flex items-center">
                  <RatingIcon rating={score} width={16} height={17} />
                </div>
                <p className="text-base text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
