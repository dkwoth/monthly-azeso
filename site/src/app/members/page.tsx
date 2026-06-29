import type {Metadata} from 'next'
import Header from '@/components/Header'
import MemberCard from '@/components/MemberCard'
import {getMembers} from '@/lib/data'
import {urlFor} from '@/lib/image'

export const metadata: Metadata = {title: '멤버'}

export default async function MembersPage() {
  const members = await getMembers()

  return (
    <>
      <Header />
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-widest">MEMBERS</h1>
          <p className="mt-3 text-gray-400 text-lg">함께 탐방하는 소모임 멤버</p>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <MemberCard
              key={member.slug}
              name={member.name}
              bio={member.bio}
              image={
                member.image
                  ? urlFor(member.image).width(600).height(720).fit('crop').auto('format').url()
                  : undefined
              }
              favoriteCategories={member.favoriteCategories}
              visitCount={member.visitCount}
            />
          ))}
        </div>
      </main>
    </>
  )
}
