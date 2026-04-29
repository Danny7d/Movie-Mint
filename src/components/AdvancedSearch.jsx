import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaSlidersH, FaTimes, FaStar } from "react-icons/fa";
import FavoriteIcon from "./FavoriteIcon";
import "./AdvancedSearch.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Revenue" },
];

const currentYear = new Date().getFullYear();

function AdvancedSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [ratingMin, setRatingMin] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");

  // Fetch genres on mount
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list",
          { params: { api_key: API_KEY } }
        );
        setGenres(res.data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    }
    fetchGenres();
  }, []);

  // Auto-search on mount if query param exists
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q, 1);
    }
  }, []);

  const performSearch = async (searchQuery, pageNum, append = false) => {
    setLoading(true);
    try {
      let res;
      if (searchQuery && searchQuery.trim()) {
        // Text search
        res = await axios.get("https://api.themoviedb.org/3/search/movie", {
          params: {
            api_key: API_KEY,
            query: searchQuery,
            page: pageNum,
          },
        });
      } else {
        // Discover with filters
        const params = {
          api_key: API_KEY,
          sort_by: sortBy,
          page: pageNum,
          "vote_count.gte": 50,
        };

        if (selectedGenres.length > 0) {
          params.with_genres = selectedGenres.join(",");
        }
        if (yearFrom) {
          params["primary_release_date.gte"] = `${yearFrom}-01-01`;
        }
        if (yearTo) {
          params["primary_release_date.lte"] = `${yearTo}-12-31`;
        }
        if (ratingMin > 0) {
          params["vote_average.gte"] = ratingMin;
        }

        res = await axios.get("https://api.themoviedb.org/3/discover/movie", {
          params,
        });
      }

      if (append) {
        setResults((prev) => [...prev, ...res.data.results]);
      } else {
        setResults(res.data.results);
      }
      setTotalPages(res.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    setSearchParams(query ? { q: query } : {});
    performSearch(query, 1);
  };

  const handleFilterSearch = () => {
    setQuery("");
    setSearchParams({});
    performSearch("", 1);
  };

  const loadMore = () => {
    performSearch(query, page + 1, true);
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setYearFrom("");
    setYearTo("");
    setRatingMin(0);
    setSortBy("popularity.desc");
  };

  const activeFilterCount =
    selectedGenres.length +
    (yearFrom ? 1 : 0) +
    (yearTo ? 1 : 0) +
    (ratingMin > 0 ? 1 : 0) +
    (sortBy !== "popularity.desc" ? 1 : 0);

  const genreMap = {};
  genres.forEach((g) => (genreMap[g.id] = g.name));

  return (
    <div className="advanced-search-page">
      <div className="search-header">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <h1 className="search-title gradient-text">Advanced Search</h1>
      </div>

      {/* Search Bar */}
      <form className="search-bar-container" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <FaSearch className="search-input-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies by title..."
            className="search-input-field"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="search-clear-btn"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button type="submit" className="search-submit-btn">
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-toggle-btn ${activeFilterCount > 0 ? "has-filters" : ""}`}
        >
          <FaSlidersH />
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
        </button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All
            </button>
          </div>

          {/* Genre Filter */}
          <div className="filter-section">
            <h4>Genres</h4>
            <div className="genre-chips">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`genre-chip ${selectedGenres.includes(genre.id) ? "active" : ""}`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div className="filter-section">
            <h4>Release Year</h4>
            <div className="year-range">
              <input
                type="number"
                min="1900"
                max={currentYear}
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="From"
                className="year-input"
              />
              <span className="year-separator">to</span>
              <input
                type="number"
                min="1900"
                max={currentYear + 2}
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="To"
                className="year-input"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <h4>Minimum Rating: {ratingMin > 0 ? `${ratingMin}+` : "Any"}</h4>
            <div className="rating-slider">
              <input
                type="range"
                min="0"
                max="9"
                step="1"
                value={ratingMin}
                onChange={(e) => setRatingMin(Number(e.target.value))}
                className="slider-input"
              />
              <div className="slider-labels">
                <span>Any</span>
                <span>9+</span>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-section">
            <h4>Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleFilterSearch} className="apply-filters-btn">
            Apply Filters
          </button>
        </div>
      )}

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="active-filters">
          {selectedGenres.map((gId) => (
            <span key={gId} className="filter-tag">
              {genreMap[gId]}
              <button onClick={() => toggleGenre(gId)}>
                <FaTimes />
              </button>
            </span>
          ))}
          {ratingMin > 0 && (
            <span className="filter-tag">
              {ratingMin}+ ★
              <button onClick={() => setRatingMin(0)}>
                <FaTimes />
              </button>
            </span>
          )}
          {yearFrom && (
            <span className="filter-tag">
              From {yearFrom}
              <button onClick={() => setYearFrom("")}>
                <FaTimes />
              </button>
            </span>
          )}
          {yearTo && (
            <span className="filter-tag">
              To {yearTo}
              <button onClick={() => setYearTo("")}>
                <FaTimes />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {loading && results.length === 0 ? (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Searching movies...</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="search-results-grid">
            {results
              .filter((m) => m.poster_path)
              .map((movie) => (
                <div key={movie.id} className="search-result-card">
                  <Link to={`/movie/${movie.id}`} className="result-card-link">
                    <div className="result-poster-wrapper">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="result-poster"
                        loading="lazy"
                      />
                      <div className="result-overlay">
                        <div className="result-rating">
                          <FaStar className="star-icon" />
                          <span>{movie.vote_average?.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="result-info">
                      <h3 className="result-title">{movie.title}</h3>
                      <p className="result-year">
                        {movie.release_date?.split("-")[0] || "N/A"}
                      </p>
                      <p className="result-genres">
                        {movie.genre_ids
                          ?.map((id) => genreMap[id])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join(", ") || ""}
                      </p>
                    </div>
                  </Link>
                  <FavoriteIcon movieId={movie.id} movie={movie} />
                </div>
              ))}
          </div>
          {page < totalPages && (
            <div className="load-more-container">
              <button
                onClick={loadMore}
                disabled={loading}
                className="load-more-btn"
              >
                {loading ? "Loading..." : "Load More Movies"}
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="search-empty">
            <div className="empty-icon">🎬</div>
            <h2>Discover Movies</h2>
            <p>
              Search by title or use filters to find your next favorite movie
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default AdvancedSearch;
