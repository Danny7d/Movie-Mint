import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BackgroundPic = [];

function Background() {
  const [pic, setPic] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          { params: { api_key: API_KEY } }
        );

        const validMovies = response.data.results.filter(
          (movie) => movie.backdrop_path && movie.vote_average >= 7
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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pic.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [pic]);

  if (loading || pic.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-900">
        <div className="bg-black opacity-50 w-full h-full"></div>
      </div>
    );
  }

  const currentMovie = pic[currentIndex];

  return (
    <div>
      <div
        className="relative h-[80vh] w-full flex items-end mt-10 text-white overflow-hidden"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${currentMovie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px",
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">
            Title: {currentMovie.title}
          </h1>
          <p
            className="text-lg font-semibold text-white w-96 mt-2"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)",
            }}
          >
            Overview: {currentMovie.overview}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Background;
