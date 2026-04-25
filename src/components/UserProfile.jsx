import { useState } from "react";
import {
  FaHeart,
  FaCalendar,
  FaFilm,
  FaUser,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { supabase } from "../supabaseClient";
import "./UserProfile.css";

function UserProfile() {
  const { session, signOut } = UserAuth();
  const { favorites, isLoggedIn } = useFavorites();
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

  // Get user metadata - only use real username, no email fallback
  const userName = user.user_metadata?.username || "Username not set";
  const userEmail = user.email;
  const createdAt = new Date(user.created_at).toLocaleDateString();

  // Debug: Log user metadata to console
  console.log("User metadata:", user.user_metadata);
  console.log("Username from metadata:", userName);

  // Username validation regex (same as Register component)
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
    console.log("Attempting to save username:", newUsername);

    if (!USER_REGEX.test(newUsername)) {
      setUsernameError(
        "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores allowed.",
      );
      return;
    }

    setIsUpdating(true);

    try {
      console.log(
        "Calling supabase.auth.updateUser with username:",
        newUsername,
      );
      console.log("Current user session:", session);

      const { data, error } = await supabase.auth.updateUser({
        data: { username: newUsername },
      });

      console.log("Update response:", { data, error });

      if (error) {
        console.error("Full error object:", error);
        setUsernameError(`Error: ${error.message || "Unknown error occurred"}`);
      } else {
        console.log("Username update successful!");
        console.log("Updated user data:", data);
        setIsEditingUsername(false);
        setUsernameError("");
        setNewUsername("");
        // Force a session refresh to get updated metadata
        window.location.reload();
      }
    } catch (error) {
      console.error("Unexpected error updating username:", error);
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
          <span className="user-email">{userEmail}</span>
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
              <p className="login-info"> Login uses email, not username</p>
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
                <FaCalendar />
              </div>
              <div className="stat-info">
                <div className="stat-number">
                  {Math.ceil(
                    (Date.now() - new Date(user.created_at)) /
                      (1000 * 60 * 60 * 24),
                  )}
                </div>
                <div className="stat-label">Days Active</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <FaFilm />
              </div>
              <div className="stat-info">
                <div className="stat-number">
                  {Math.max(1, Math.floor(favoriteCount * 1.5))}
                </div>
                <div className="stat-label">Movies Viewed</div>
              </div>
            </div>
          </div>

          <div className="user-actions">
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
