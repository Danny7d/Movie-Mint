import { useState } from "react";
import {
  FaHeart, FaCalendar, FaFilm, FaUser, FaBookmark, FaEye,
  FaChevronDown, FaChevronUp, FaEdit, FaCheck, FaTimes, FaStar, FaSearch,
} from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useWatchlist } from "../context/WatchlistContext";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./UserProfile.css";

function UserProfile() {
  const { session, signOut } = UserAuth();
  const { favorites, isLoggedIn } = useFavorites();
  const { watchlistCount, watchedCount } = useWatchlist();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!session || !isLoggedIn) {
    return null;
  }

  const user = session.user;
  const favoriteCount = favorites.length;
  const userName = user.user_metadata?.username || "Username not set";
  const userEmail = user.email;
  const createdAt = new Date(user.created_at).toLocaleDateString();

  const USER_REGEX = /^[A-Za-z][A-Za-z0-9_]{4,29}$/;

  const startEditingUsername = () => {
    setNewUsername(userName);
    setIsEditingUsername(true);
    setUsernameError("");
  };

  const cancelEditingUsername = () => {
    setIsEditingUsername(false);
    setNewUsername("");
    setUsernameError("");
  };

  const saveUsername = async () => {
    if (!USER_REGEX.test(newUsername)) {
      setUsernameError(
        "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores allowed.",
      );
      return;
    }

    setIsUpdating(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { username: newUsername },
      });

      if (error) {
        setUsernameError(`Error: ${error.message || "Unknown error occurred"}`);
      } else {
        // Also update user_profiles table
        await supabase
          .from("user_profiles")
          .update({ username: newUsername, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);

        setIsEditingUsername(false);
        setUsernameError("");
        setNewUsername("");
        window.location.reload();
      }
    } catch (error) {
      setUsernameError(`Unexpected error: ${error.message || "Unknown error"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setIsExpanded(false);
  };

  return (
    <div className="user-profile">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="user-profile-button"
      >
        <div className="user-avatar">
          <FaUser className="avatar-icon" />
        </div>
        <div className="user-info-compact">
          <span className="user-name">{userName}</span>
        </div>
        {isExpanded ? (
          <FaChevronUp className="dropdown-icon" />
        ) : (
          <FaChevronDown className="dropdown-icon" />
        )}
      </button>

      {isExpanded && (
        <div className="user-profile-dropdown">
          <div className="user-header">
            <div className="user-avatar-large">
              <FaUser className="avatar-icon-large" />
            </div>
            <div className="user-details">
              {isEditingUsername ? (
                <div className="username-edit-container">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="username-input"
                    placeholder="Enter new username"
                    disabled={isUpdating}
                  />
                  <div className="username-edit-buttons">
                    <button
                      onClick={saveUsername}
                      disabled={isUpdating}
                      className="username-save-button"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={cancelEditingUsername}
                      disabled={isUpdating}
                      className="username-cancel-button"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="username-display">
                  <h3 className="user-name-large">{userName}</h3>
                  <button
                    onClick={startEditingUsername}
                    className="username-edit-button"
                    title="Edit username"
                  >
                    <FaEdit />
                  </button>
                </div>
              )}
              <p className="user-email-large">{userEmail}</p>
              <p className="member-since">Member since {createdAt}</p>
              {usernameError && (
                <p className="username-error">{usernameError}</p>
              )}
            </div>
          </div>

          <div className="user-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <FaHeart />
              </div>
              <div className="stat-info">
                <div className="stat-number">{favoriteCount}</div>
                <div className="stat-label">Favorites</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <FaBookmark />
              </div>
              <div className="stat-info">
                <div className="stat-number">{watchlistCount}</div>
                <div className="stat-label">Watchlist</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <FaEye />
              </div>
              <div className="stat-info">
                <div className="stat-number">{watchedCount}</div>
                <div className="stat-label">Watched</div>
              </div>
            </div>
          </div>

          <div className="user-actions">
            <Link
              to="/profile"
              onClick={() => setIsExpanded(false)}
              className="favorites-link"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              <FaUser className="favorites-icon" />
              My Profile
            </Link>
            <Link
              to="/favs"
              onClick={() => setIsExpanded(false)}
              className="favorites-link"
            >
              <FaStar className="favorites-icon" />
              My Favorites
            </Link>
            <Link
              to="/watchlist"
              onClick={() => setIsExpanded(false)}
              className="favorites-link"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
            >
              <FaBookmark className="favorites-icon" />
              My Watchlist
            </Link>
            <Link
              to="/genres"
              onClick={() => setIsExpanded(false)}
              className="favorites-link"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
            >
              <FaFilm className="favorites-icon" />
              Browse Genres
            </Link>
            <Link
              to="/search"
              onClick={() => setIsExpanded(false)}
              className="favorites-link"
              style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}
            >
              <FaSearch className="favorites-icon" />
              Advanced Search
            </Link>
            <button onClick={handleSignOut} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
