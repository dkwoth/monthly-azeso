import type {Category} from '@/lib/types'
import CategoryBadge from './CategoryBadge'

interface Props {
  name: string
  bio?: string
  image?: string
  favoriteCategories?: Category[]
}

export default function AuthorCard({name, bio, image, favoriteCategories = []}: Props) {
  return (
    <div className="flex items-center gap-5 border border-gray-200 bg-gray-50 p-5">
      <div className="shrink-0 w-24 h-24 overflow-hidden bg-gray-100 border border-gray-200">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="36"
              height="36"
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
      <div className="min-w-0">
        <p className="text-lg font-black">{name}</p>
        {bio && <p className="text-sm text-gray-600 mt-0.5">{bio}</p>}
        {favoriteCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {favoriteCategories.map((cat) => (
              <CategoryBadge key={cat.id} label={cat.label} color={cat.color} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
