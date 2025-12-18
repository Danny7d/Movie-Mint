import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "../App.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Popular() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function GetPopular() {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
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
      GetPopular();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center mt-12">
      <h1 className="p-5 text-3xl font-bold gradient-text text-center">
        Popular
      </h1>
      <div
        className="flex gap-5 overflow-x-auto justify-center"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="">
            <Link to={`/movie/${movie.id}`}>
              <img
                className="m-4 w-48 rounded-md  cursor-pointer hover:scale-110 transition duration-300"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            </Link>
            <div className="w-48 sm">
              <h2 className="mt-3 text-white backdrop-blur-sm text-center">
                {movie.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Popular;
