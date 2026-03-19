import { useState } from 'react';
import SojuGlassIcon from './SojuGlassIcon';

interface CategoryData {
  id: string;
  label: string;
  color?: string;
}

interface GridPost {
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  rating: number;
  location: string;
  categories: CategoryData[];
  memberNames: string[];
}

interface Props {
  posts: GridPost[];
  allCategories: CategoryData[];
}

function RatingIcon({ filled }: { filled: boolean }) {
  return <SojuGlassIcon filled={filled} className={filled ? 'text-[#c0392b]' : 'text-gray-300'} />;
}

function PostCard({ post }: { post: GridPost }) {
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group border-2 border-black bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <a href={`/posts/${post.slug}`} className="block">
        <div className="overflow-hidden h-52 bg-gray-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.categories.map((cat) => (
              <span
                key={cat.id}
                className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-current"
                style={cat.color ? { color: cat.color, borderColor: cat.color } : undefined}
              >
                {cat.label}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-bold leading-snug mb-2 group-hover:text-[#c0392b] transition-colors duration-200">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex gap-0.5">
              {Array.from({ length: 3 }, (_, i) => (
                <RatingIcon key={i} filled={i < post.rating} />
              ))}
            </span>
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="truncate">{post.location}</span>
          </div>
          {post.memberNames.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              <span>{post.memberNames.join(', ')}</span>
            </div>
          )}
        </div>
      </a>
    </article>
  );
}

export default function PostGrid({ posts, allCategories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered =
    activeCategory === 'all'
      ? posts
      : posts.filter((p) => p.categories.some((c) => c.id === activeCategory));

  return (
    <div>
      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-2 text-xs font-bold tracking-widest uppercase border-2 border-black transition-colors duration-200 ${
            activeCategory === 'all' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          전체 ({posts.length})
        </button>
        {allCategories.map((cat) => {
          const count = posts.filter((p) => p.categories.some((c) => c.id === cat.id)).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase border-2 transition-colors duration-200 ${
                activeCategory === cat.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-black hover:text-white'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-sm">해당 카테고리의 후기가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
