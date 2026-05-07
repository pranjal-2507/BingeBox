import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import { fetchMovieDetails } from '../utils/tmdb';

const MOODS = ["Chill", "Adrenaline", "Spooky", "Romantic", "Mind-bending"];
const GENRES = ["All", "Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"];

const RecommendationSection = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState('All');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
      setTimeout(() => {
        const element = document.getElementById('recommendations');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8000/api/autocomplete?q=${encodeURIComponent(query)}&limit=5`);
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.error("Autocomplete error", err);
      }
    };
    
    const timeoutId = setTimeout(fetchAutocomplete, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setShowSuggestions(false);
    setLoading(true);
    setError('');
    
    try {
      let url = `http://localhost:8000/api/recommend?q=${encodeURIComponent(searchQuery)}&limit=15`;
      if (genre !== 'All') url += `&genre=${encodeURIComponent(genre)}`;
      
      const response = await axios.get(url);
      let results = response.data.recommendations || [];
      
      const updatedResults = await Promise.all(results.map(async (movie) => {
        const tmdbDetails = await fetchMovieDetails(movie.id);
        return { 
          ...movie, 
          poster_path: tmdbDetails.poster_path,
          real_rating: tmdbDetails.rating,
          real_year: tmdbDetails.year
        };
      }));

      setRecommendations(updatedResults);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recommendations. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="recommendations" className="py-12 px-4 md:px-12 bg-netflix-dark min-h-screen" onClick={() => setShowSuggestions(false)}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-gray-900 to-black p-8 rounded-lg border border-gray-800">
        <div className="flex-1 w-full relative">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Personalized <span className="text-netflix-red">AI Recommendations</span>
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl text-lg">
            Tell us what you're in the mood for. Our AI analyzes your preferences to find the perfect movie for your next binge session.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 relative">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setShowSuggestions(true)}
                onClick={(e) => e.stopPropagation()}
                placeholder="E.g., A mind-bending sci-fi thriller..." 
                className="w-full bg-gray-800 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-netflix-red transition-all"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-gray-800 border border-gray-700 mt-1 rounded-md shadow-xl overflow-hidden">
                  {suggestions.map((sug, idx) => (
                    <li 
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSearch(sug);
                      }}
                      className="px-4 py-3 text-white hover:bg-netflix-red cursor-pointer transition-colors"
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="relative">
              <select 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)}
                className="bg-gray-800 text-white rounded pl-4 pr-10 py-3 h-full focus:outline-none border border-transparent focus:border-netflix-red appearance-none cursor-pointer"
              >
                {GENRES.map(g => <option key={g} value={g} className="py-2 px-4 bg-gray-900">{g}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <button 
              onClick={() => handleSearch(query)}
              disabled={loading}
              className="bg-netflix-red text-white px-8 py-3 rounded font-semibold hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Find Movies'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-gray-500 text-sm py-1">Quick Moods:</span>
            {MOODS.map(mood => (
              <button 
                key={mood}
                onClick={() => handleSearch(`${mood} movies`)}
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors"
              >
                {mood}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        
        <div className="flex-1 flex justify-center hidden md:flex">
          <div className="relative w-64 h-64">
            <div className={`absolute inset-0 bg-netflix-red/20 rounded-full ${loading ? 'animate-ping' : 'animate-pulse'}`}></div>
            <div className={`absolute inset-4 bg-netflix-red/30 rounded-full ${loading ? 'animate-ping' : 'animate-pulse'} delay-75`}></div>
            <div className="absolute inset-8 bg-gray-900 rounded-full flex items-center justify-center border border-netflix-red/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-16 h-16 text-netflix-red ${loading ? 'animate-spin' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {(recommendations.length > 0 || loading) && (
        <div className="mt-16 relative group/carousel">
          <h3 className="text-2xl font-semibold text-white mb-6 border-l-4 border-netflix-red pl-3">
            Your Top AI Picks
          </h3>
          
          <div 
            id="recommendation-scroll"
            className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth"
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="snap-start shrink-0">
                  <MovieCardSkeleton />
                </div>
              ))
            ) : (
              recommendations.map((movie) => (
                <div key={movie.id} className="snap-start shrink-0">
                  <MovieCard movie={movie} />
                </div>
              ))
            )}
          </div>
          
          <button 
            onClick={() => document.getElementById('recommendation-scroll').scrollBy({ left: -300, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-r-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity z-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={() => document.getElementById('recommendation-scroll').scrollBy({ left: 300, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-l-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity z-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;
