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
    </>
  );
}

function App() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 text-center sm:left-4 sm:transform-none md:left-4 md:transform-none lg:left-4 xl:left-4 sm:text-left md:text-left">
        <Link
          to="/"
          className="text-xl font-bold gradient-text md:text-4xl hover:opacity-80 transition-opacity cursor-pointer"
        >
          MovieMint
        </Link>
      </div>

      <div className="flex justify-center pt-16 z-50 relative">
        <Searchbar />
      </div>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
