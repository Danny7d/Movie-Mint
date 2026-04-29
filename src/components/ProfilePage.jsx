import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser, FaHeart, FaBookmark, FaStar, FaCalendar, FaFilm, FaEye,
} from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useWatchlist } from "../context/WatchlistContext";
import "./ProfilePage.css";

function ProfilePage() {
  const { session } = UserAuth();
  const { favorites } = useFavorites();
  const { watchlist, watchedCount } = useWatchlist();
  const [activeTab, setActiveTab] = useState("favorites");

  if (!session) {
    return (
      <div className="profile-page">
        <div className="profile-login-prompt">
          <FaUser className="prompt-icon" />
          <h2>Please log in to view your profile</h2>
          <Link to="/Login" className="prompt-link">Log In</Link>
        </div>
      </div>
    );
  }

  const user = session.user;
  const userName = user.user_metadata?.username || "User";
  const userEmail = user.email;
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const daysActive = Math.ceil(
    (Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
  );

  // Analyze favorite genres
  const genreCounts = {};
  favorites.forEach((movie) => {
    (movie.genre_ids || []).forEach((gId) => {
      genreCounts[gId] = (genreCounts[gId] || 0) + 1;
    });
  });
  const topGenreIds = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => parseInt(id));

  const GENRE_NAMES = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western",
  };

  const stats = [
    { icon: <FaHeart />, value: favorites.length, label: "Favorites", color: "#ec4899" },
    { icon: <FaBookmark />, value: watchlist.length, label: "Watchlist", color: "#3b82f6" },
    { icon: <FaEye />, value: watchedCount, label: "Watched", color: "#10b981" },
    { icon: <FaCalendar />, value: daysActive, label: "Days Active", color: "#f59e0b" },
  ];

  const toWatch = watchlist.filter((w) => !w.watched);

  return (
    <div className="profile-page">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">
          <div className="profile-avatar-large">
            <FaUser className="profile-avatar-icon" />
          </div>
          <h1 className="profile-username">{userName}</h1>
          <p className="profile-email">{userEmail}</p>
          <p className="profile-member-since">Member since {memberSince}</p>

          {/* Favorite Genres */}
          {topGenreIds.length > 0 && (
            <div className="profile-genres">
              {topGenreIds.map((gId) => (
                <span key={gId} className="profile-genre-badge">
                  {GENRE_NAMES[gId] || `Genre ${gId}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="profile-stat-card" style={{ borderColor: `${stat.color}30` }}>
            <div className="profile-stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="profile-stat-value">{stat.value}</div>
            <div className="profile-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Tabs */}
      <div className="profile-tabs">
        {[
          { id: "favorites", label: "Favorites", icon: <FaHeart /> },
          { id: "watchlist", label: "Watchlist", icon: <FaBookmark /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`profile-tab ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="profile-tab-content">
        {activeTab === "favorites" && (
          favorites.length === 0 ? (
            <div className="profile-empty-tab">
              <p>No favorite movies yet</p>
              <Link to="/genres" className="profile-browse-btn">Browse Movies</Link>
            </div>
          ) : (
            <div className="profile-movies-grid">
              {favorites.map((movie) => (
                <Link key={movie.id} to={`/movie/${movie.id}`} className="profile-movie-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="profile-movie-poster"
                    loading="lazy"
                  />
                  <p className="profile-movie-title">{movie.title}</p>
                </Link>
              ))}
            </div>
          )
        )}

        {activeTab === "watchlist" && (
          watchlist.length === 0 ? (
            <div className="profile-empty-tab">
              <p>No movies in your watchlist</p>
              <Link to="/genres" className="profile-browse-btn">Browse Movies</Link>
            </div>
          ) : (
            <div className="profile-movies-grid">
              {watchlist.map((item) => {
                const movie = item.movie_data;
                if (!movie) return null;
                return (
                  <Link key={item.movie_id} to={`/movie/${movie.id}`} className="profile-movie-card">
                    <div className="relative">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="profile-movie-poster"
                        loading="lazy"
                      />
                      {item.watched && (
                        <div className="profile-watched-badge">✓ Watched</div>
                      )}
                    </div>
                    <p className="profile-movie-title">{movie.title}</p>
                  </Link>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
