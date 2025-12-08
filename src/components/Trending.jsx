import React, { useState, useEffect } from "react";
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
    <div className="">
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
            <img
              className="w-48 rounded-md cursor-pointer hover:scale-110 transition duration-300 rounded-t-md"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="w-48 mt-9">
              <h2 className="text-white">{movie.title}</h2>
              <p className="text-white">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
