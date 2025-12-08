import React, { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "../App.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Searchbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function searchMovies() {
    if (!query) return;

    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: { api_key: API_KEY, query: query },
        }
      );
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="relative flex justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-96 p-2 pr-10 border-2 border-transparent focus:border-blue-600 focus:outline-none rounded-md gradient-text bg-transparent"
        />
        <button
          className="absolute right-2 top-2 p-1 text-blue-300 hover:text-blue-600"
          onClick={searchMovies}
        >
          <FaSearch />
        </button>
      </div>

      {results.length > 0 && (
        <div className="p-5">
          <h1 className="gradient-text text-2xl mb-4">Search Results</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {results.map((movie) => (
              <div key={movie.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  className="w-48 rounded hover:scale-110 transition duration-300"
                />
                <h2 className="text-white mt-2 text-center">{movie.title}</h2>
                <p className="text-white text-center">{movie.release_date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Searchbar;
