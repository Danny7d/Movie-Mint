import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function FavMovies() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavs);
  }, []);

  const removeFavMovie = (id) => {
    const updated = favorites.filter((movie) => movie.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-xl lg:text-4xl font-bold gradient-text inline-block mt-4">
            Favorites
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              ></svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500">
              Start adding movies to your favorites to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((movie) => (
              <div key={movie.id} className="group relative">
                <Link to={`/movie/${movie.id}`} className="block">
                  <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="w-48 h-auto object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-white font-medium text-base line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {movie.title}
                    </h3>
                  </div>
                </Link>
                <button
                  onClick={() => removeFavMovie(movie.id)}
                  className="absolute top-2 right-12 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                  title="Remove from favorites"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293 4.293a1 1 0 001.414 1.414L11.414 10l4.293 4.293a1 1 0 001.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavMovies;
