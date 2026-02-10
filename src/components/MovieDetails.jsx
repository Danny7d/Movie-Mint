import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY; // Add this to your .env

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [ratings, setRatings] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        // TMDB Movie
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          { params: { api_key: API_KEY } },
        );

        // TMDB Credits
        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits`,
          { params: { api_key: API_KEY } },
        );

        // TMDB Videos
        const videosRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos`,
          { params: { api_key: API_KEY } },
        );

        const trailer = videosRes.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube",
        );

        if (trailer) setTrailerKey(trailer.key);

        setMovie(res.data);
        setCast(creditsRes.data.cast);

        // ✅ Fetch ratings directly from OMDb
        if (res.data.imdb_id) {
          try {
            const omdbRes = await axios.get("https://www.omdbapi.com/", {
              params: {
                i: res.data.imdb_id,
                apikey: OMDB_KEY,
              },
            });

            // Extract only IMDb, Rotten Tomatoes, Metacritic
            const imdb = omdbRes.data.imdbRating
              ? `${omdbRes.data.imdbRating}/10`
              : null;

            const rotten = omdbRes.data.Ratings?.find(
              (r) => r.Source === "Rotten Tomatoes",
            )?.Value;

            const meta = omdbRes.data.Ratings?.find(
              (r) => r.Source === "Metacritic",
            )?.Value;

            setRatings({ imdb, rotten, meta });
          } catch (error) {
            console.error("Error fetching ratings:", error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchMovie();
  }, [id]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") setShowTrailer(false);
    }

    if (showTrailer) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [showTrailer]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 animate-pulse flex items-end">
        <div className="p-10">
          <div className="h-10 w-64 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-96 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-80 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div
        className="relative h-[42rem] rounded-md bg-center bg-cover flex items-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 p-10 max-w-4xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg opacity-90 mb-4">{movie.overview}</p>
          <p className="text-blue-400 mb-2">
            {movie.genres && movie.genres.length > 0
              ? movie.genres.map((genre) => genre.name).join(", ")
              : "No genre info"}
          </p>
          <p className="text-sm opacity-70">
            Release date: {movie.release_date}
          </p>
        </div>
      </div>

      {ratings && (
        <div className="px-10 max-w-4xl">
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">Ratings</h3>
            <div className="flex gap-6 flex-wrap">
              {ratings.imdb && (
                <div className="text-white">
                  <span className="text-gray-400 text-sm">IMDb:</span>
                  <span className="ml-2 font-medium">{ratings.imdb}</span>
                </div>
              )}
              {ratings.rotten && (
                <div className="text-white">
                  <span className="text-gray-400 text-sm">
                    Rotten Tomatoes:
                  </span>
                  <span className="ml-2 font-medium">{ratings.rotten}</span>
                </div>
              )}
              {ratings.meta && (
                <div className="text-white">
                  <span className="text-gray-400 text-sm">Metacritic:</span>
                  <span className="ml-2 font-medium">{ratings.meta}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {trailerKey && (
        <div className="flex justify-center">
          <button
            className="mt-6 px-4 py-2 md:px-6 md:py-3 bg-red-600 hover:bg-red-700 rounded text-white font-semibold text-sm md:text-base justify-center"
            onClick={() => setShowTrailer(true)}
          >
            ▶ Watch Trailer
          </button>
        </div>
      )}

      <div className="p-10 max-w-6xl mx-auto text-white justify-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Cast</h2>
        <div
          className="flex gap-4 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cast.slice(0, 10).map((actor) => (
            <div key={actor.id} className="w-56 flex-shrink-0 text-center">
              <img
                className="w-56 h-72 object-cover rounded-md mb-2"
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                    : "/placeholder.jpg"
                }
                alt={actor.name}
              />
              <p className="text-sm font-semibold">{actor.name}</p>
              <p className="text-xs opacity-70">{actor.character}</p>
            </div>
          ))}

          {showTrailer && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="relative w-full max-w-3xl aspect-video">
                <iframe
                  className="w-full h-full rounded"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Movie Trailer"
                  allowFullScreen
                ></iframe>

                <button
                  className="absolute -top-10 right-0 text-white text-xl"
                  onClick={() => setShowTrailer(false)}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
