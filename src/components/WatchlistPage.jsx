import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBookmark, FaCheck, FaEye, FaClock, FaTrash } from "react-icons/fa";
import { useWatchlist } from "../context/WatchlistContext";
import "./WatchlistPage.css";

function WatchlistPage() {
  const {
    watchlist,
    removeFromWatchlist,
    markAsWatched,
    unmarkAsWatched,
    loading,
  } = useWatchlist();

  const [activeTab, setActiveTab] = useState("toWatch");

  const toWatch = watchlist.filter((w) => !w.watched);
  const watched = watchlist.filter((w) => w.watched);
  const activeList = activeTab === "toWatch" ? toWatch : watched;

  if (loading) {
    return (
      <div className="watchlist-page">
        <div className="watchlist-loading">
          <div className="loading-spinner"></div>
          <p>Loading watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1 className="watchlist-title gradient-text">
          <FaBookmark className="watchlist-title-icon" /> My Watchlist
        </h1>
        <div className="watchlist-stats">
          <span className="stat-pill">
            <FaClock /> {toWatch.length} to watch
          </span>
          <span className="stat-pill watched">
            <FaEye /> {watched.length} watched
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="watchlist-tabs">
        <button
          onClick={() => setActiveTab("toWatch")}
          className={`watchlist-tab ${activeTab === "toWatch" ? "active" : ""}`}
        >
          <FaClock /> Want to Watch ({toWatch.length})
        </button>
        <button
          onClick={() => setActiveTab("watched")}
          className={`watchlist-tab ${activeTab === "watched" ? "active" : ""}`}
        >
          <FaCheck /> Watched ({watched.length})
        </button>
      </div>

      {/* Movie List */}
      {activeList.length === 0 ? (
        <div className="watchlist-empty">
          <div className="empty-icon">
            {activeTab === "toWatch" ? "📋" : "✅"}
          </div>
          <h2>
            {activeTab === "toWatch"
              ? "No movies in your watchlist"
              : "No watched movies yet"}
          </h2>
          <p>
            {activeTab === "toWatch"
              ? "Add movies to your watchlist from any movie page!"
              : "Mark movies as watched when you've seen them!"}
          </p>
          <Link to="/genres" className="browse-link">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {activeList.map((item) => {
            const movie = item.movie_data;
            if (!movie) return null;
            return (
              <div key={item.movie_id} className="watchlist-card">
                <Link to={`/movie/${movie.id}`} className="watchlist-card-link">
                  <div className="watchlist-poster-wrapper">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="watchlist-poster"
                      loading="lazy"
                    />
                    {item.watched && (
                      <div className="watched-badge">
                        <FaCheck /> Watched
                      </div>
                    )}
                  </div>
                </Link>
                <div className="watchlist-card-info">
                  <h3 className="watchlist-movie-title">{movie.title}</h3>
                  <p className="watchlist-movie-year">
                    {movie.release_date?.split("-")[0] || ""}
                  </p>
                </div>
                <div className="watchlist-card-actions">
                  {item.watched ? (
                    <button
                      onClick={() => unmarkAsWatched(item.movie_id)}
                      className="watchlist-action-btn unwatch-btn"
                      title="Mark as unwatched"
                    >
                      <FaClock /> Unwatch
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsWatched(item.movie_id)}
                      className="watchlist-action-btn watch-btn"
                      title="Mark as watched"
                    >
                      <FaEye /> Watched
                    </button>
                  )}
                  <button
                    onClick={() => removeFromWatchlist(item.movie_id)}
                    className="watchlist-action-btn remove-btn"
                    title="Remove from watchlist"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WatchlistPage;
