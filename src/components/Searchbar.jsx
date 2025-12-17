import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "../App.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Searchbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function searchMovies() {
    if (!query || query.length === 0) return;

    setHasSearched(true);

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

  function clearSearch() {
    setResults([]);
    setQuery("");
    setHasSearched(false);
  }

  return (
    <div>
      <div className="relative flex justify-center mb-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchMovies();
            }
          }}
          placeholder="Search"
          className="w-96 p-2 pr-10 border-2 border-gray-500 focus:border-blue-600 focus:outline-none rounded-md bg-transparent text-white"
        />
        <button
          className="relative right-9 top-1/2 p-1 text-blue-300 hover:text-blue-700"
          onClick={searchMovies}
        >
          <FaSearch />
        </button>
      </div>

      {hasSearched && results.length > 0 ? (
        <div className="p-5">
          <h1 className="gradient-text text-2xl mb-4">Search Results</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {results.map((movie) => (
              <div key={movie.id}>
                <Link to={`/movie/${movie.id}`} onClick={clearSearch}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    className="w-48 rounded hover:scale-110 transition duration-300"
                  />
                </Link>
                <div className="w-48">
                  <h2 className="text-white mt-4 text-center">{movie.title}</h2>
                  <p className="text-white text-center">{movie.release_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : hasSearched && query.length > 2 ? (
        <div className="p-5 text-center">
          <h1 className="gradient-text text-2xl mb-4">No results found</h1>
          <p className="text-white mb-2">
            Try checking the spelling or search for a different movie title
          </p>
          <p className="text-gray-400 text-sm">
            Tip: Try partial titles like "aveng" for "Avengers"
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default Searchbar;
