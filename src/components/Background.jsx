import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BackgroundPic = [];

function Background() {
  const [pic, setPic] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          { params: { api_key: API_KEY } },
        );

        const validMovies = response.data.results.filter(
          (movie) => movie.backdrop_path && movie.vote_average >= 5,
        );
        setPic(validMovies);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchMovie();
  }, []);

  useEffect(() => {
    if (pic.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % pic.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [pic]);

  if (loading || pic.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-900">
        <div className="bg-black opacity-50 w-full h-full"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`relative h-screen min-h-[120vh] sm:h-[80vh] sm:min-h-[80vh] lg:h-[90vh] lg:min-h-[90vh] flex items-end text-white overflow-hidden z-10`}
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${pic[currentIndex].backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 1s ease-in-out",
          margin: "8px",
          borderRadius: "20px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div
          className={`relative z-10 pb-8 px-8 transition-all duration-500 ${
            isTransitioning
              ? "opacity-0 transform translate-y-4"
              : "opacity-100 transform translate-y-0"
          }`}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-2xl">
            {pic[currentIndex].title}
          </h1>
          <p className="text-sm md:text-xl font-semibold text- mt-2 drop-shadow-2xl">
            {pic[currentIndex].overview}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Background;
