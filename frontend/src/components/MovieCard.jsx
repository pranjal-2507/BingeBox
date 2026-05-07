import { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import MovieDetailsModal from './MovieDetailsModal';

const MovieCard = ({ movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, poster_path, real_year, year, real_rating, match } = movie;
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isFavorite } = useUserContext();
  
  const displayYear = real_year || year;
  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null;
  const finalImageUrl = imageUrl || `https://placehold.co/400x600/2a2a2a/ffffff?text=${encodeURIComponent(title)}`;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="relative group min-w-[200px] md:min-w-[240px] rounded-md overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:z-20 bg-gray-800 border border-gray-700 shadow-lg"
      >
      <img
        src={finalImageUrl}
        alt={title}
        className="w-full h-[300px] md:h-[360px] object-cover transition-opacity duration-300 group-hover:opacity-75"
      />
      
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <button 
          onClick={handleFavoriteClick}
          className="bg-black/60 p-2 rounded-full hover:bg-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite(movie.id) ? "#E50914" : "none"} stroke={isFavorite(movie.id) ? "#E50914" : "currentColor"} className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
        <button 
          onClick={handleWatchlistClick}
          className="bg-black/60 p-2 rounded-full hover:bg-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isInWatchlist(movie.id) ? "white" : "none"} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
        <h3 className="text-white font-bold text-lg mb-1 truncate">{title}</h3>
        <div className="flex flex-col gap-1 text-sm">
          {match && (
            <span className="text-green-400 font-semibold">{match}% AI Match</span>
          )}
          <div className="flex items-center gap-2 text-gray-300">
            {real_rating && real_rating !== 'N/A' && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                {real_rating}
              </span>
            )}
            <span>{displayYear}</span>
          </div>
        </div>
      </div>
      </div>
      {isModalOpen && <MovieDetailsModal movie={movie} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default MovieCard;
