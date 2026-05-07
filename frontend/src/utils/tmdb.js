import axios from 'axios';

const TMDB_API_KEY = '588906ae08c25f81bb1acbf378862f5c';
const BASE_URL = 'https://api.themoviedb.org/3';

// Simple in-memory cache to optimize API requests
const movieCache = new Map();

/**
 * Fetches movie details from TMDB API with caching.
 * @param {number|string} movieId 
 * @returns {Promise<Object>} Movie details including poster, rating, and date
 */
export const fetchMovieDetails = async (movieId) => {
  if (movieCache.has(movieId)) {
    return movieCache.get(movieId);
  }

  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`);
    
    // Extract relevant data
    const data = {
      poster_path: response.data.poster_path,
      rating: response.data.vote_average ? response.data.vote_average.toFixed(1) : 'N/A',
      release_date: response.data.release_date || '',
      year: response.data.release_date ? response.data.release_date.split('-')[0] : 'Unknown'
    };
    
    movieCache.set(movieId, data);
    return data;
  } catch (error) {
    console.error(`Error fetching TMDB details for movie ${movieId}:`, error);
    // Return graceful fallback data
    return {
      poster_path: null,
      rating: 'N/A',
      release_date: '',
      year: 'Unknown'
    };
  }
};

/**
 * Fetches current trending movies from TMDB.
 */
export const fetchTrendingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};
