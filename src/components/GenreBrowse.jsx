import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import FavoriteIcon from "./FavoriteIcon";
import "./GenreBrowse.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const GENRE_COLORS = {
  28: ["#ef4444", "#dc2626"],     // Action
  12: ["#f59e0b", "#d97706"],     // Adventure
  16: ["#06b6d4", "#0891b2"],     // Animation
  35: ["#f97316", "#ea580c"],     // Comedy
  80: ["#64748b", "#475569"],     // Crime
  99: ["#6366f1", "#4f46e5"],     // Documentary
  18: ["#8b5cf6", "#7c3aed"],     // Drama
  10751: ["#ec4899", "#db2777"],  // Family
  14: ["#a855f7", "#9333ea"],     // Fantasy
  36: ["#78716c", "#57534e"],     // History
  27: ["#1e293b", "#0f172a"],     // Horror
  10402: ["#14b8a6", "#0d9488"], // Music
  9648: ["#6d28d9", "#5b21b6"],  // Mystery
  10749: ["#f43f5e", "#e11d48"], // Romance
  878: ["#3b82f6", "#2563eb"],   // Sci-Fi
  10770: ["#84cc16", "#65a30d"], // TV Movie
  53: ["#991b1b", "#7f1d1d"],    // Thriller
  10752: ["#4b5563", "#374151"], // War
  37: ["#92400e", "#78350f"],    // Western
};

const COLLECTIONS = [
  { id: "top_rated", name: "Top Rated", icon: "⭐", endpoint: "/movie/top_rated" },
  { id: "now_playing", name: "Now Playing", icon: "🎬", endpoint: "/movie/now_playing" },
  { id: "upcoming", name: "Upcoming", icon: "🔮", endpoint: "/movie/upcoming" },
];

function GenreBrowse() {
  const { genreId } = useParams();
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genreBackdrops, setGenreBackdrops] = useState({});

  // Fetch genres
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list",
          { params: { api_key: API_KEY } }
        );
        setGenres(res.data.genres);

        // Fetch backdrop images for each genre
        const backdrops = {};
        await Promise.all(
          res.data.genres.slice(0, 12).map(async (genre) => {
            try {
              const movRes = await axios.get(
                "https://api.themoviedb.org/3/discover/movie",
                {
                  params: {
                    api_key: API_KEY,
                    with_genres: genre.id,
                    sort_by: "popularity.desc",
                    page: 1,
                  },
                }
              );
              const movie = movRes.data.results.find((m) => m.backdrop_path);
              if (movie) {
                backdrops[genre.id] = movie.backdrop_path;
              }
            } catch (err) {
              // ignore
            }
          })
        );
        setGenreBackdrops(backdrops);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setLoading(false);
      }
    }
    fetchGenres();
  }, []);

  // Handle genreId from URL
  useEffect(() => {
    if (genreId && genres.length > 0) {
      const genre = genres.find((g) => g.id === parseInt(genreId));
      if (genre) {
        setSelectedGenre(genre);
        fetchMoviesByGenre(parseInt(genreId), 1);
      }
    }
  }, [genreId, genres]);

  const fetchMoviesByGenre = async (gId, pageNum, append = false) => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: API_KEY,
            with_genres: gId,
            sort_by: "popularity.desc",
            page: pageNum,
            "vote_count.gte": 50,
          },
        }
      );
      if (append) {
        setMovies((prev) => [...prev, ...res.data.results]);
      } else {
        setMovies(res.data.results);
      }
      setTotalPages(res.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const fetchCollection = async (collection, pageNum, append = false) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3${collection.endpoint}`,
        { params: { api_key: API_KEY, page: pageNum } }
      );
      if (append) {
        setMovies((prev) => [...prev, ...res.data.results]);
      } else {
        setMovies(res.data.results);
      }
      setTotalPages(res.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setSelectedCollection(null);
    fetchMoviesByGenre(genre.id, 1);
  };

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
    setSelectedGenre(null);
    fetchCollection(collection, 1);
  };

  const handleBack = () => {
    setSelectedGenre(null);
    setSelectedCollection(null);
    setMovies([]);
  };

  const loadMore = () => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre.id, page + 1, true);
    } else if (selectedCollection) {
      fetchCollection(selectedCollection, page + 1, true);
    }
  };

  // Show genre/collection movie list
  if (selectedGenre || selectedCollection) {
    const title = selectedGenre
      ? selectedGenre.name
      : selectedCollection.name;
    const colors = selectedGenre
      ? GENRE_COLORS[selectedGenre.id] || ["#7c3aed", "#ec4899"]
      : ["#7c3aed", "#ec4899"];

    return (
      <div className="genre-browse-page">
        <div className="genre-detail-header">
          <button onClick={handleBack} className="genre-back-btn">
            ← All Genres
          </button>
          <h1
            className="genre-detail-title"
            style={{
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {selectedCollection ? `${selectedCollection.icon} ` : ""}
            {title}
          </h1>
        </div>

        {loading && movies.length === 0 ? (
          <div className="genre-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <div className="genre-movies-grid">
              {movies
                .filter((m) => m.poster_path)
                .map((movie) => (
                  <div key={movie.id} className="genre-movie-card">
                    <Link
                      to={`/movie/${movie.id}`}
                      className="genre-movie-link"
                    >
                      <div className="genre-poster-wrapper">
                        <img
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          className="genre-movie-poster"
                          loading="lazy"
                        />
                        <div className="genre-movie-overlay">
                          <div className="genre-movie-rating">
                            <FaStar /> {movie.vote_average?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <h3 className="genre-movie-title">{movie.title}</h3>
                      <p className="genre-movie-year">
                        {movie.release_date?.split("-")[0]}
                      </p>
                    </Link>
                    <FavoriteIcon movieId={movie.id} movie={movie} />
                  </div>
                ))}
            </div>
            {page < totalPages && (
              <div className="load-more-container">
                <button onClick={loadMore} className="load-more-btn">
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Show genre cards grid
  return (
    <div className="genre-browse-page">
      <div className="genre-browse-header">
        <Link to="/" className="back-link">← Back</Link>
        <h1 className="genre-browse-title gradient-text">Browse by Genre</h1>
      </div>

      {/* Collections */}
      <div className="collections-section">
        <h2 className="section-subtitle">Collections</h2>
        <div className="collections-grid">
          {COLLECTIONS.map((col) => (
            <button
              key={col.id}
              onClick={() => handleCollectionClick(col)}
              className="collection-card"
            >
              <span className="collection-icon">{col.icon}</span>
              <span className="collection-name">{col.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Genre Cards */}
      <div className="genres-section">
        <h2 className="section-subtitle">Genres</h2>
        {loading ? (
          <div className="genre-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="genres-grid">
            {genres.map((genre) => {
              const colors = GENRE_COLORS[genre.id] || ["#7c3aed", "#ec4899"];
              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}
                  className="genre-card"
                  style={{
                    backgroundImage: genreBackdrops[genre.id]
                      ? `linear-gradient(135deg, ${colors[0]}cc, ${colors[1]}cc), url(https://image.tmdb.org/t/p/w500${genreBackdrops[genre.id]})`
                      : `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className="genre-card-name">{genre.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default GenreBrowse;
