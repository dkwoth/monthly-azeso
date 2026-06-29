import type {Category} from '@/lib/types'
import CategoryBadge from './CategoryBadge'

interface Props {
  name: string
  bio?: string
  image?: string
  favoriteCategories: Category[]
  visitCount: number
}

export default function MemberCard({name, bio, image, favoriteCategories, visitCount}: Props) {
  return (
    <article className="border-2 border-black group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="overflow-hidden h-60 bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300"
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
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-xs text-gray-500 font-mono">{visitCount}회 방문</span>
        </div>
        {bio && <p className="text-sm text-gray-600 mb-4">{bio}</p>}
        {favoriteCategories.length > 0 && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">선호 카테고리</p>
            <div className="flex flex-wrap gap-1.5">
              {favoriteCategories.map((cat) => (
                <CategoryBadge key={cat.id} label={cat.label} color={cat.color} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
