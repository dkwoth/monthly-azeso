import type {Metadata} from 'next'
import Header from '@/components/Header'
import PostGrid from '@/components/PostGrid'
import {getAllCategories, getAllPostCards} from '@/lib/data'

export const metadata: Metadata = {title: '후기'}

export default async function PostsPage() {
  const [posts, allCategories] = await Promise.all([getAllPostCards(), getAllCategories()])

  return (
    <>
      <Header />
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-widest">REVIEWS</h1>
          <p className="mt-3 text-gray-400 text-lg">우리가 탐방한 모든 맛집</p>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <PostGrid posts={posts} allCategories={allCategories} />
      </main>
    </>
  )
}
