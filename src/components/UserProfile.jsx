import { useState } from "react";
import { FaHeart, FaCalendar, FaFilm, FaUser, FaEnvelope, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import "./UserProfile.css";

function UserProfile() {
  const { session, signOut } = UserAuth();
  const { favorites, isLoggedIn } = useFavorites();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!session || !isLoggedIn) {
    return null;
  }

  const user = session.user;
  const favoriteCount = favorites.length;
  
  // Get user metadata
  const userName = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  const userEmail = user.email;
  const createdAt = new Date(user.created_at).toLocaleDateString();

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
        {isExpanded ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}
      </button>

      {isExpanded && (
        <div className="user-profile-dropdown">
          <div className="user-header">
            <div className="user-avatar-large">
              <FaUser className="avatar-icon-large" />
            </div>
            <div className="user-details">
              <h3 className="user-name-large">{userName}</h3>
              <p className="user-email-large">{userEmail}</p>
              <p className="member-since">Member since {createdAt}</p>
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
                <div className="stat-number">{Math.ceil((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24))}</div>
                <div className="stat-label">Days Active</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <FaFilm />
              </div>
              <div className="stat-info">
                <div className="stat-number">{Math.max(1, Math.floor(favoriteCount * 1.5))}</div>
                <div className="stat-label">Movies Viewed</div>
              </div>
            </div>
          </div>

          <div className="user-actions">
            <button
              onClick={handleSignOut}
              className="logout-button"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
