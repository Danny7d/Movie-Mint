import { FaBookmark } from "react-icons/fa";
import { useWatchlist } from "../context/WatchlistContext";

function WatchlistIcon({ movieId, movie, className = "" }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const inWatchlist = isInWatchlist(movieId);

  const toggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWatchlist) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      className={`absolute top-0 right-0 p-2 rounded-full transition-all duration-300 z-50 ${
        inWatchlist
          ? "bg-blue-500"
          : "bg-gray-800/80 hover:bg-gray-700"
      } ${className}`}
      title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      <FaBookmark
        className={`w-4 h-4 ${inWatchlist ? "text-white" : "text-gray-400"}`}
      />
    </button>
  );
}

export default WatchlistIcon;
