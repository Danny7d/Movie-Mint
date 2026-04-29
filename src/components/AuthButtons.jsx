import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import UserProfile from "./UserProfile";
import NotificationBell from "./NotificationBell";

function AuthButtons() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { session, signOut } = UserAuth();
  const { theme, toggleTheme } = useTheme();

  const confirmLogout = () => {
    signOut();
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      {/* Mobile menu toggle - only show for logged out users */}
      {!session && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden fixed top-4 right-4 p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* UserProfile for logged-in users - mobile */}
      {session && (
        <div className="sm:hidden fixed top-4 right-4 z-50 flex items-center gap-2">
          <NotificationBell />
          <UserProfile />
        </div>
      )}

      {/* Mobile menu - only show for logged out users */}
      {isMenuOpen && !session && (
        <div className="sm:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-[110] flex flex-col items-center justify-center">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-4xl font-bold mb-12 text-white hover:opacity-80 transition-opacity cursor-pointer inline-block relative"
            style={{
              textDecoration: "none",
              background: "linear-gradient(90deg, #7c3aed, #ec4899, #f43f5e)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            MovieMint
          </Link>

          <div className="flex flex-col gap-4 w-full px-8">
            <Link
              to="/genres"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg transition-all duration-200 font-medium text-center flex items-center justify-center gap-2"
            >
              🎬 Browse Genres
            </Link>
            <Link
              to="/search"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 font-medium text-center flex items-center justify-center gap-2"
            >
              🔍 Advanced Search
            </Link>
            <Link
              to="/favs"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-6 py-3 text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-lg transition-all duration-200 font-medium text-center flex items-center justify-center gap-2 mb-12"
            >
              ❤️ Favorites
            </Link>
            <Link
              to="/Login"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200 font-medium text-center"
            >
              Login
            </Link>
            <Link
              to="/Register"
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-6 py-3 text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors duration-200 font-medium text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      <div className="hidden sm:flex top-4 left-4 gap-3 z-[100] mt-2 items-center">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 text-yellow-400 transition-all duration-300 border border-gray-700"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        {session ? (
          <>
            <NotificationBell />
            <UserProfile />
          </>
        ) : (
          <>
            <Link
              to="/Login"
              className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              to="/Register"
              className="px-4 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthButtons;
