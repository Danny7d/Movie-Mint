import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from auth context or supabase
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) {
      // User is logged out, load from localStorage
      loadLocalFavorites();
    } else if (session) {
      // User is logged in, load from database and migrate localStorage
      loadOnlineFavorites();
    }
  }, [session]);

  const loadLocalFavorites = () => {
    try {
      const localFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(localFavorites);
    } catch (error) {
      console.error("Error loading local favorites:", error);
      setFavorites([]);
    }
    setLoading(false);
  };

  const loadOnlineFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("movie_data")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error loading online favorites:", error);
        // Fallback to localStorage if database fails
        loadLocalFavorites();
        return;
      }

      const onlineFavorites = data.map(item => item.movie_data);
      setFavorites(onlineFavorites);

      // Migrate localStorage favorites to database
      await migrateLocalFavorites();
    } catch (error) {
      console.error("Error loading online favorites:", error);
      loadLocalFavorites();
    }
    setLoading(false);
  };

  const migrateLocalFavorites = async () => {
    try {
      const localFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      
      if (localFavorites.length === 0) return;

      // Get existing online favorites to avoid duplicates
      const { data: existingFavorites } = await supabase
        .from("favorites")
        .select("movie_id")
        .eq("user_id", session.user.id);

      const existingMovieIds = existingFavorites?.map(fav => fav.movie_id) || [];
      
      // Filter out favorites that already exist online
      const newFavorites = localFavorites.filter(movie => 
        !existingMovieIds.includes(movie.id.toString())
      );

      // Add new favorites to database
      if (newFavorites.length > 0) {
        const { error } = await supabase
          .from("favorites")
          .insert(
            newFavorites.map(movie => ({
              user_id: session.user.id,
              movie_id: movie.id.toString(),
              movie_data: movie
            }))
          );

        if (error) {
          console.error("Error migrating favorites:", error);
        } else {
          // Clear localStorage after successful migration
          localStorage.removeItem("favorites");
          console.log("Successfully migrated", newFavorites.length, "favorites to database");
        }
      }
    } catch (error) {
      console.error("Error migrating local favorites:", error);
    }
  };

  const addToFavorites = async (movie) => {
    const newFavorites = [...favorites, movie];
    setFavorites(newFavorites);

    if (session) {
      // Save to database
      try {
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: session.user.id,
            movie_id: movie.id.toString(),
            movie_data: movie
          });

        if (error) {
          console.error("Error adding favorite to database:", error);
          // Fallback to localStorage
          localStorage.setItem("favorites", JSON.stringify(newFavorites));
        }
      } catch (error) {
        console.error("Error adding favorite to database:", error);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
      }
    } else {
      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = async (movieId) => {
    const newFavorites = favorites.filter(movie => movie.id !== movieId);
    setFavorites(newFavorites);

    if (session) {
      // Remove from database
      try {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", session.user.id)
          .eq("movie_id", movieId.toString());

        if (error) {
          console.error("Error removing favorite from database:", error);
          // Fallback to localStorage
          localStorage.setItem("favorites", JSON.stringify(newFavorites));
        }
      } catch (error) {
        console.error("Error removing favorite from database:", error);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
      }
    } else {
      // Remove from localStorage
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading,
    isLoggedIn: !!session
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
