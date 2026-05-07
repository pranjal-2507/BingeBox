import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import { fetchTrendingMovies } from '../utils/tmdb';

const TrendingSection = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      const results = await fetchTrendingMovies();
      const formatted = results.map(m => ({
        id: m.id,
        title: m.title || m.name,
        poster_path: m.poster_path,
        real_year: m.release_date ? m.release_date.split('-')[0] : 'N/A',
        real_rating: m.vote_average ? m.vote_average.toFixed(1) : 'N/A',
      }));
      setTrending(formatted);
      setLoading(false);
    };
    loadTrending();
  }, []);

  return (
    <div className="py-8 px-4 md:px-12 relative -mt-20 z-20 group/trending">
      <h2 className="text-2xl font-semibold text-white mb-4">Trending Now</h2>

      <div
        id="trending-scroll"
        className="flex gap-4 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x scroll-smooth"
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="snap-start shrink-0">
              <MovieCardSkeleton />
            </div>
          ))
        ) : (
          trending.map((movie) => (
            <div key={movie.id} className="snap-start shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => document.getElementById('trending-scroll').scrollBy({ left: -300, behavior: 'smooth' })}
        className="absolute left-0 top-[60%] -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-r-lg opacity-0 group-hover/trending:opacity-100 transition-opacity z-30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={() => document.getElementById('trending-scroll').scrollBy({ left: 300, behavior: 'smooth' })}
        className="absolute right-0 top-[60%] -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-l-lg opacity-0 group-hover/trending:opacity-100 transition-opacity z-30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default TrendingSection;
