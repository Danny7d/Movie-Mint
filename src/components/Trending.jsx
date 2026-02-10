import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Trending() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function GetTrending() {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/day",
          { params: { api_key: API_KEY } },
        );
        setMovies(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    if (API_KEY) {
      GetTrending();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex gap-5 p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-48">
            <div className="w-48 h-72 bg-gray-700 rounded-md animate-pulse"></div>
            <div className="h-4 bg-gray-600 mt-3 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-600 mt-2 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-24 ml-4 sm:ml-8 text-center">
      <h1 className="p-5 text-3xl font-bold gradient-text text-center">
        Trending
      </h1>
      <div
        className="flex gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={index === movies.length - 1 ? "mr-8" : ""}
          >
            <Link to={`/movie/${movie.id}`}>
              <img
                className="m-1.5 sm:m-4 w-24 sm:w-48 rounded-md cursor-pointer hover:scale-110 transition duration-300 rounded-t-md"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            </Link>
            <div className="w-24 sm:w-48 mt-2 sm:mt-3">
              <h2 className="text-white text-center">{movie.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
