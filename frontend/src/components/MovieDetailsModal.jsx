import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import { fetchMovieDetails } from '../utils/tmdb';

const MovieDetailsModal = ({ movie, onClose }) => {
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, []);

  // Fetch similar movies from our backend
  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/recommend?q=${encodeURIComponent(movie.title)}&limit=6`);
        const results = response.data.recommendations || [];
        
        // Remove the movie itself from recommendations if it's there
        const filtered = results.filter(m => m.id !== movie.id);
        
        const updatedResults = await Promise.all(filtered.map(async (m) => {
          const tmdbDetails = await fetchMovieDetails(m.id);
          return { 
            ...m, 
            poster_path: tmdbDetails.poster_path,
            real_rating: tmdbDetails.rating,
            real_year: tmdbDetails.year
          };
        }));
        
        setSimilarMovies(updatedResults);
      } catch (err) {
        console.error("Error fetching similar movies", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSimilar();
  }, [movie]);

  if (!movie) return null;

  const displayYear = movie.real_year || movie.year;
  const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : null;
  const finalImageUrl = imageUrl || `https://placehold.co/800x1200/2a2a2a/ffffff?text=${encodeURIComponent(movie.title)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      {/* Modal Content */}
      <div 
        className="relative bg-gray-900 border border-gray-700 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/60 p-2 rounded-full hover:bg-black text-white z-20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left: Big Poster */}
        <div className="w-full md:w-2/5 md:min-h-full">
          <img src={finalImageUrl} alt={movie.title} className="w-full h-full object-cover max-h-[400px] md:max-h-full" />
        </div>

        {/* Right: Details & Similar Movies */}
        <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            {movie.match && <span className="text-green-400 font-semibold">{movie.match}% AI Match</span>}
            <span className="text-gray-400">{displayYear}</span>
            {movie.real_rating && movie.real_rating !== 'N/A' && (
              <span className="flex items-center gap-1 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                {movie.real_rating}
              </span>
            )}
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">{movie.title}</h2>
          
          {movie.explanation && (
            <div className="bg-gray-800 p-4 rounded-lg mb-8 border border-gray-700">
              <p className="text-gray-300">
                <span className="text-netflix-red font-semibold">💡 AI Insight:</span> {movie.explanation}
              </p>
            </div>
          )}

          <div className="mt-auto">
            <h3 className="text-xl font-semibold text-white mb-4">More Like This</h3>
            {loading ? (
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1/3 h-48 bg-gray-800 animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : similarMovies.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {similarMovies.map(m => (
                  <div key={m.id} className="w-1/3 shrink-0">
                    <MovieCard movie={m} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No similar movies found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
