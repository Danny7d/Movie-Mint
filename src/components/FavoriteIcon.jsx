import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

function FavoriteIcon({ movieId, movie, className = "" }) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorited(favorites.some((fav) => fav.id === movieId));
  }, [movieId]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavorites;

    if (isFavorited) {
      updatedFavorites = favorites.filter((fav) => fav.id !== movieId);
    } else {
      updatedFavorites = [...favorites, movie];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorited(!isFavorited);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`absolute bottom-12 left-40 p-2 rounded-full transition-all duration-300 z-96 ${isFavorited ? "bg-red-500" : "bg-gray-800/80 hover:bg-gray-700"} ${className}`}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <FaHeart
        className={`w-5 h-5 ${isFavorited ? "text-white" : "text-gray-400"}`}
      />
    </button>
  );
}

export default FavoriteIcon;
