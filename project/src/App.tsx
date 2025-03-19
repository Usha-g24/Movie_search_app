import React, { useState, useEffect } from 'react';
import { Search, Heart, Star, Film, X, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot?: string;
  Genre?: string;
  Director?: string;
  imdbRating?: string;
}

function App() {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'YOUR_OMDB_API_KEY'; // Replace with your OMDB API key

  const searchMovies = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`https://www.omdbapi.com/?s=${search}&apikey=${API_KEY}`);
      
      if (response.data.Response === 'True') {
        setMovies(response.data.Search);
      } else {
        setError('No movies found. Please try a different search.');
        setMovies([]);
      }
    } catch (err) {
      setError('An error occurred while searching for movies.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getMovieDetails = async (imdbID: string) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
      setSelectedMovie(response.data);
    } catch (err) {
      setError('Error fetching movie details.');
    }
  };

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isMovieFavorite = (movie: Movie) => {
    return favorites.some(fav => fav.imdbID === movie.imdbID);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 mt-8">
          Movie Search App
        </h1>

        <form onSubmit={searchMovies} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-6 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pl-12 bg-gray-700 text-white"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {movies.map(movie => (
            <div key={movie.imdbID} className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
              <div className="relative h-[400px]">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={movie.Title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleFavorite(movie)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
                >
                  <Heart
                    className={`${isMovieFavorite(movie) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    size={20}
                  />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{movie.Title}</h3>
                <p className="text-gray-400">{movie.Year}</p>
                <button
                  onClick={() => getMovieDetails(movie.imdbID)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Film size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full relative">
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={selectedMovie.Title}
                  className="w-full md:w-[200px] h-[300px] object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedMovie.Title}</h2>
                  <p className="text-gray-300 mb-4">{selectedMovie.Plot}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Genre</p>
                      <p className="text-white">{selectedMovie.Genre}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Director</p>
                      <p className="text-white">{selectedMovie.Director}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400" size={16} />
                      <p className="text-white">{selectedMovie.imdbRating}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(movie => (
                <div key={movie.imdbID} className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  <div className="relative h-[400px]">
                    <img
                      src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                      alt={movie.Title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(movie)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
                    >
                      <Heart className="fill-red-500 text-red-500" size={20} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{movie.Title}</h3>
                    <p className="text-gray-400">{movie.Year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;