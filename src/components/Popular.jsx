import React, { useState, useEffect } from "react";
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
    <div>
      <h1 className="p-5 text-2xl font-bold gradient-text">Popular</h1>
      <div
        className="flex gap-5 overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="">
            <img
              className="w-48 rounded-md  cursor-pointer hover:scale-110 transition duration-300"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="w-48">
              <h2 className="mt-3 text-white backdrop-blur-sm">
                {movie.title}
              </h2>
              <p className="text-white backdrop-blur-sm">
                {movie.release_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Popular;
