import { useState, useEffect, useCallback } from 'react';

interface CategoryData {
  id: string;
  label: string;
  color?: string;
}

interface SliderPost {
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
  posts: SliderPost[];
  intervalMs?: number;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      className={filled ? 'text-[#c0392b]' : 'text-gray-300'}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

export default function PostSlider({ posts, intervalMs = 4000 }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % posts.length);
  }, [posts.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + posts.length) % posts.length);
  }, [posts.length]);

  useEffect(() => {
    if (paused || posts.length <= 1) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [paused, next, intervalMs, posts.length]);

  if (posts.length === 0) return null;

  const post = posts[current];
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="relative border-2 border-black overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <a href={`/posts/${post.slug}`} className="block group">
        {/* Image */}
        <div className="relative h-80 md:h-[480px] bg-gray-100 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-white/60 text-white"
                >
                  {cat.label}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-4xl font-black leading-tight mb-2">{post.title}</h2>
            <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
              <span className="flex gap-0.5">
                {Array.from({ length: 3 }, (_, i) => (
                  <StarIcon key={i} filled={i < post.rating} />
                ))}
              </span>
              <span>{formattedDate}</span>
              <span className="truncate max-w-xs">{post.location}</span>
            </div>
          </div>
        </div>
      </a>

      {/* Navigation */}
      {posts.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors duration-200"
            aria-label="이전"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors duration-200"
            aria-label="다음"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`슬라이드 ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
