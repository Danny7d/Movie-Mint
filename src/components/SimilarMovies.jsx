import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import FavoriteIcon from "./FavoriteIcon";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function SimilarMovies({ movieId }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/similar`,
          { params: { api_key: API_KEY } }
        );
        setMovies(res.data.results.filter((m) => m.poster_path).slice(0, 12));
      } catch (err) {
        console.error("Error fetching similar movies:", err);
      }
      setLoading(false);
    }
    if (movieId) fetchSimilar();
  }, [movieId]);

  if (loading || movies.length === 0) return null;

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Similar Movies
      </h2>
      <div
        className="flex gap-4 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="relative flex-shrink-0">
            <Link to={`/movie/${movie.id}`} className="block">
              <img
                className="w-28 sm:w-44 rounded-lg hover:scale-105 transition duration-300"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
              />
            </Link>
            <div className="w-28 sm:w-44 mt-2">
              <h3 className="text-white text-sm text-center font-medium truncate">
                {movie.title}
              </h3>
              <p className="text-center text-xs text-yellow-500 flex items-center justify-center gap-1 mt-1">
                <FaStar className="text-xs" />
                {movie.vote_average?.toFixed(1)}
              </p>
            </div>
            <FavoriteIcon movieId={movie.id} movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarMovies;
