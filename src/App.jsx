import { Link, Routes, Route } from "react-router-dom";
import Searchbar from "./components/Searchbar";
import SuggestionSection from "./components/SuggestionSection";
import Trending from "./components/Trending";
import Popular from "./components/Popular";
import Background from "./Background";
import MovieDetails from "./components/MovieDetails";
import Footer from "./components/Footer";
import "./App.css";

function Home() {
  return (
    <>
      <Background />
      <Trending />
      <Popular />
      <div className="bg-blue-800">
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <div className="bg-black min-h-screen">
      {/* Logo */}
      <div className="absolute top-4 left-4 right-4 flex justify-center md:justify-start z-50">
        <Link to="/" className="text-3xl font-bold gradient-text md:text-4xl">
          MovieMint
        </Link>
      </div>

      {/* Search */}
      <div className="flex justify-center pt-4 z-50 relative">
        <Searchbar />
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  );
}

export default App;
