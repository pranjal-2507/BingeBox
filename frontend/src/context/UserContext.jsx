import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedWatchlist = JSON.parse(localStorage.getItem('bingebox_watchlist')) || [];
      const savedFavorites = JSON.parse(localStorage.getItem('bingebox_favorites')) || [];
      setWatchlist(savedWatchlist);
      setFavorites(savedFavorites);
    } catch (e) {
      console.error("Error loading user data from local storage", e);
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('bingebox_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('bingebox_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleWatchlist = (movie) => {
    setWatchlist(prev => {
      if (prev.some(m => m.id === movie.id)) {
        return prev.filter(m => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      if (prev.some(m => m.id === movie.id)) {
        return prev.filter(m => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  const isInWatchlist = (movieId) => watchlist.some(m => m.id === movieId);
  const isFavorite = (movieId) => favorites.some(m => m.id === movieId);

  return (
    <UserContext.Provider value={{
      watchlist,
      favorites,
      toggleWatchlist,
      toggleFavorite,
      isInWatchlist,
      isFavorite
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
