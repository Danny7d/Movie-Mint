import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import FavoriteIcon from "./FavoriteIcon";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Recommendations() {
  const { favorites, isLoggedIn } = useFavorites();
  const [recommendations, setRecommendations] = useState([]);
  const [basedOn, setBasedOn] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false);
      return;
    }
    fetchRecommendations();
  }, [favorites]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Pick up to 3 random favorites as basis
      const shuffled = [...favorites].sort(() => 0.5 - Math.random());
      const basis = shuffled.slice(0, 3);
      setBasedOn(basis);

      const allRecs = [];
      const seenIds = new Set(favorites.map((f) => f.id));

      await Promise.all(
        basis.map(async (movie) => {
          try {
            const res = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}/recommendations`,
              { params: { api_key: API_KEY } }
            );
            res.data.results.forEach((rec) => {
              if (!seenIds.has(rec.id) && rec.poster_path) {
                seenIds.add(rec.id);
                allRecs.push({ ...rec, basedOnTitle: movie.title });
              }
            });
          } catch (e) {
            // ignore individual failures
          }
        })
      );

      // Group by basedOnTitle, take top 10 from each
      const grouped = {};
      allRecs.forEach((rec) => {
        if (!grouped[rec.basedOnTitle]) {
          grouped[rec.basedOnTitle] = [];
        }
        if (grouped[rec.basedOnTitle].length < 10) {
          grouped[rec.basedOnTitle].push(rec);
        }
      });

      setRecommendations(grouped);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
    setLoading(false);
  };

  if (!isLoggedIn || favorites.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-12 px-6">
        <h2 className="text-2xl font-bold gradient-text text-center mb-6">
          Recommended For You
        </h2>
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-36 sm:w-48 flex-shrink-0">
              <div className="w-36 sm:w-48 h-56 sm:h-72 bg-gray-800 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const groups = Object.entries(recommendations);
  if (groups.length === 0) return null;

  return (
    <div className="mt-12 mb-8 sm:ml-6 sm:mr-6">
      <h2 className="p-5 text-3xl font-bold gradient-text text-center">
        Recommended For You
      </h2>

      {groups.map(([title, movies]) => (
        <div key={title} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 px-4 sm:px-8 mb-4">
            Because you liked{" "}
            <span className="text-purple-400 font-bold">{title}</span>
          </h3>
          <div
            className="flex gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="relative flex-shrink-0">
                <Link to={`/movie/${movie.id}`} className="relative block">
                  <img
                    className="w-24 sm:w-48 rounded-md cursor-pointer hover:scale-110 transition duration-300"
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                  />
                </Link>
                <div className="w-24 sm:w-48 mt-2 sm:mt-3">
                  <h4 className="text-white text-center text-sm">
                    {movie.title}
                  </h4>
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
      ))}
    </div>
  );
}

export default Recommendations;
