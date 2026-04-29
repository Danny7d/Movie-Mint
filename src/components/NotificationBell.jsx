import { useState, useRef, useEffect } from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import { useNotifications } from "../context/NotificationsContext";
import "./NotificationBell.css";

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case "new_follower":
        return "👤";
      case "review_liked":
        return "👍";
      case "new_recommendation":
        return "🎬";
      case "movie_release":
        return "🆕";
      default:
        return "🔔";
    }
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="notification-bell" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bell-button"
        title="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notif-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-btn">
                <FaCheck /> Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <span className="notif-empty-icon">🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item ${!notif.read ? "unread" : ""}`}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif.id);
                  }}
                >
                  <span className="notif-icon">{getNotifIcon(notif.type)}</span>
                  <div className="notif-content">
                    <p className="notif-title">{notif.title}</p>
                    {notif.message && (
                      <p className="notif-message">{notif.message}</p>
                    )}
                    <span className="notif-time">
                      {formatTime(notif.created_at)}
                    </span>
                  </div>
                  {!notif.read && <span className="notif-dot"></span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
