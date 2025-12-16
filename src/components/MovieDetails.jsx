import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          { params: { api_key: API_KEY } }
        );
        setMovie(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div
      className="relative min-h-screen bg-center bg-cover flex items-end"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 p-10 max-w-4xl text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

        <p className="text-lg opacity-90 mb-4">{movie.overview}</p>

        <p className="text-sm opacity-70">Release date: {movie.release_date}</p>
      </div>
    </div>
  );
}

export default MovieDetails;
