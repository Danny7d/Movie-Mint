import { useState } from "react";
import { Link } from "react-router-dom";

function AuthButtons() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
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
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isMenuOpen && (
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

      <div className="hidden sm:flex top-4 left-4 gap-4 z-[100]">
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
      </div>
    </>
  );
}

export default AuthButtons;
