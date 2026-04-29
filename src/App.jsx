import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Searchbar from "./components/Searchbar";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Trending from "./components/Trending";
import Popular from "./components/Popular";
import Background from "./components/Background";
import MovieDetails from "./components/MovieDetails";
import Footer from "./components/Footer";
import AuthButtons from "./components/AuthButtons";
import FavMovies from "./components/FavMovies";
import Register from "./components/Register";
import Login from "./components/Login";
import CheckEmail from "./components/CheckEmail";
import AdvancedSearch from "./components/AdvancedSearch";
import GenreBrowse from "./components/GenreBrowse";
import WatchlistPage from "./components/WatchlistPage";
import ProfilePage from "./components/ProfilePage";
import Recommendations from "./components/Recommendations";
import "./App.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-4">Please refresh the page</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Home() {
  return (
    <>
      <header className="flex justify-end items-center px-6 py-4 lg:py-0">
        <AuthButtons />
      </header>
      <span className="flex justify-center p-4 sm:p-8 mt-8 lg:p-0 lg:mt-0 lg:mb-0 relative z-0">
        <Searchbar />
      </span>
      <Background />
      <Trending />
      <Popular />
      <Recommendations />
    </>
  );
}

function App() {
  const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

  if (!tmdbKey || !supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables:", {
      tmdbKey: !!tmdbKey,
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
    });
  }

  return (
    <ErrorBoundary>
      <div className="app-container bg-black min-h-screen flex flex-col">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[100] text-center sm:left-4 sm:transform-none md:left-4 md:transform-none lg:left-4 xl:left-4 sm:text-left md:text-left pointer-events-auto mb-72 lg:mb-0">
          <Link
            to="/"
            className="text-2xl font-bold sm:text-2xl md:text-3xl lg:text-4xl hover:opacity-80 transition-opacity cursor-pointer inline-block relative z-[110] mb-10 lg:mb-0"
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
        </div>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/favs" element={<FavMovies />} />
            <Route path="/search" element={<AdvancedSearch />} />
            <Route path="/genres" element={<GenreBrowse />} />
            <Route path="/genres/:genreId" element={<GenreBrowse />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/check-email" element={<CheckEmail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
