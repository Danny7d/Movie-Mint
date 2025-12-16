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
          { params: { api_key: API_KEY } }
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
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-72">
      <h1 className="p-5 text-2xl font-bold gradient-text">Trending</h1>
      <div
        className="flex gap-5 overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="">
            <Link to={`/movie/${movie.id}`}>
              <img
                className="m-4 w-48 rounded-md cursor-pointer hover:scale-110 transition duration-300 rounded-t-md"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            </Link>
            <div className="w-48 mt-3">
              <h2 className="text-white text-center">{movie.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
