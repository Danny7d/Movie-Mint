import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) {
      loadLocalWatchlist();
    } else if (session) {
      loadOnlineWatchlist();
    }
  }, [session]);

  const loadLocalWatchlist = () => {
    try {
      const local = JSON.parse(localStorage.getItem("watchlist")) || [];
      setWatchlist(local);
    } catch (e) {
      setWatchlist([]);
    }
    setLoading(false);
  };

  const loadOnlineWatchlist = async () => {
    try {
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", session.user.id)
        .order("added_at", { ascending: false });

      if (error) {
        loadLocalWatchlist();
        return;
      }

      setWatchlist(data || []);
    } catch (e) {
      loadLocalWatchlist();
    }
    setLoading(false);
  };

  const addToWatchlist = async (movie) => {
    const item = {
      movie_id: movie.id.toString(),
      movie_data: movie,
      watched: false,
      watched_at: null,
      added_at: new Date().toISOString(),
    };

    if (session) {
      try {
        const { data, error } = await supabase
          .from("watchlist")
          .insert({ ...item, user_id: session.user.id })
          .select()
          .single();

        if (!error && data) {
          setWatchlist((prev) => [data, ...prev]);
        }
      } catch (e) {
        console.error("Error adding to watchlist:", e);
      }
    } else {
      const newList = [item, ...watchlist];
      setWatchlist(newList);
      localStorage.setItem("watchlist", JSON.stringify(newList));
    }
  };

  const removeFromWatchlist = async (movieId) => {
    if (session) {
      try {
        await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", session.user.id)
          .eq("movie_id", movieId.toString());
      } catch (e) {
        console.error("Error removing from watchlist:", e);
      }
    } else {
      localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist.filter((w) => w.movie_id !== movieId.toString()))
      );
    }
    setWatchlist((prev) => prev.filter((w) => w.movie_id !== movieId.toString()));
  };

  const markAsWatched = async (movieId) => {
    const now = new Date().toISOString();

    if (session) {
      try {
        await supabase
          .from("watchlist")
          .update({ watched: true, watched_at: now })
          .eq("user_id", session.user.id)
          .eq("movie_id", movieId.toString());
      } catch (e) {
        console.error("Error marking as watched:", e);
      }
    }

    setWatchlist((prev) =>
      prev.map((w) =>
        w.movie_id === movieId.toString()
          ? { ...w, watched: true, watched_at: now }
          : w
      )
    );
  };

  const unmarkAsWatched = async (movieId) => {
    if (session) {
      try {
        await supabase
          .from("watchlist")
          .update({ watched: false, watched_at: null })
          .eq("user_id", session.user.id)
          .eq("movie_id", movieId.toString());
      } catch (e) {
        console.error("Error unmarking watched:", e);
      }
    }

    setWatchlist((prev) =>
      prev.map((w) =>
        w.movie_id === movieId.toString()
          ? { ...w, watched: false, watched_at: null }
          : w
      )
    );
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((w) => w.movie_id === movieId?.toString());
  };

  const isWatched = (movieId) => {
    const item = watchlist.find((w) => w.movie_id === movieId?.toString());
    return item?.watched || false;
  };

  const watchlistCount = watchlist.length;
  const watchedCount = watchlist.filter((w) => w.watched).length;

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        markAsWatched,
        unmarkAsWatched,
        isInWatchlist,
        isWatched,
        watchlistCount,
        watchedCount,
        loading,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
