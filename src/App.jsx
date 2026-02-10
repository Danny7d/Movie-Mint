import { Link, Routes, Route } from "react-router-dom";
import Searchbar from "./components/Searchbar";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Trending from "./components/Trending";
import Popular from "./components/Popular";
import Background from "./components/Background";
import MovieDetails from "./components/MovieDetails";
import Footer from "./components/Footer";
import AuthButtons from "./components/AuthButtons";
import Register from "./components/Register";
import Login from "./components/Login";
import "./App.css";

function Home() {
  return (
    <>
      <AuthButtons />
      <span className="flex justify-center pt-0 z-50 relative">
        <Searchbar />
      </span>
      <Background />
      <Trending />
      <Popular />
    </>
  );
}

function App() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[100] text-center sm:left-4 sm:transform-none md:left-4 md:transform-none lg:left-4 xl:left-4 sm:text-left md:text-left pointer-events-auto">
        <Link
          to="/"
          className="text-xl font-bold md:text-4xl hover:opacity-80 transition-opacity cursor-pointer inline-block relative z-[110]"
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
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
