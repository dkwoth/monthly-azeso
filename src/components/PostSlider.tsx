import { useState, useEffect, useCallback, useRef } from 'react';
import SojuGlassIcon from './SojuGlassIcon';

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

function RatingIcon({ filled }: { filled: boolean }) {
  return <SojuGlassIcon filled={filled} className={filled ? 'text-[#c0392b]' : 'text-gray-300'} />;
}

export default function PostSlider({ posts, intervalMs = 4000 }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
    setPaused(false);
  };

  if (posts.length === 0) return null;

  return (
    <div
      className="relative border-2 border-black overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {posts.map((p, i) => {
          const date = new Date(p.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          return (
            <div key={p.slug} className="relative w-full shrink-0">
              <a href={`/posts/${p.slug}`} className="block group">
                <div className="relative h-52 sm:h-72 md:h-[480px] bg-gray-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {p.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-white/60 text-white"
                        >
                          {cat.label}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black leading-tight mb-2">{p.title}</h2>
                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl line-clamp-2">
                      {p.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
                      <span className="flex gap-0.5">
                        {Array.from({ length: 3 }, (_, j) => (
                          <RatingIcon key={j} filled={j < p.rating} />
                        ))}
                      </span>
                      <span>{date}</span>
                      <span className="truncate max-w-xs">{p.location}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      {posts.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black text-white hidden sm:flex items-center justify-center transition-colors duration-200"
            aria-label="이전"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black text-white hidden sm:flex items-center justify-center transition-colors duration-200"
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
