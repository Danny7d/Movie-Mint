import { createContext, useContext, useState } from "react";
import { supabase } from "../supabaseClient";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const getMovieReviews = async (movieId) => {
    try {
      const { data, error } = await supabase
        .from("movie_reviews")
        .select("*")
        .eq("movie_id", movieId.toString())
        .order("created_at", { ascending: false });

      if (error) return { success: false, error };

      // Fetch vote counts for each review
      const reviewsWithVotes = await Promise.all(
        (data || []).map(async (review) => {
          const { data: votes } = await supabase
            .from("review_votes")
            .select("vote_type")
            .eq("review_id", review.id);

          const likes = votes?.filter((v) => v.vote_type === "like").length || 0;
          const dislikes = votes?.filter((v) => v.vote_type === "dislike").length || 0;

          // Get username from user metadata
          let username = "Anonymous";
          try {
            const { data: profile } = await supabase
              .from("user_profiles")
              .select("username")
              .eq("user_id", review.user_id)
              .maybeSingle();
            if (profile) username = profile.username;
          } catch (e) {
            // ignore
          }

          return { ...review, likes, dislikes, username };
        })
      );

      return { success: true, data: reviewsWithVotes };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const submitReview = async (movieId, rating, reviewText, userId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("movie_reviews")
        .upsert(
          {
            user_id: userId,
            movie_id: movieId.toString(),
            rating,
            review_text: reviewText,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,movie_id" }
        )
        .select()
        .single();

      setLoading(false);
      if (error) return { success: false, error };
      return { success: true, data };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err };
    }
  };

  const deleteReview = async (reviewId, userId) => {
    try {
      const { error } = await supabase
        .from("movie_reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", userId);

      if (error) return { success: false, error };
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const voteOnReview = async (reviewId, userId, voteType) => {
    try {
      // Check existing vote
      const { data: existing } = await supabase
        .from("review_votes")
        .select("*")
        .eq("review_id", reviewId)
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        if (existing.vote_type === voteType) {
          // Remove vote (toggle off)
          await supabase.from("review_votes").delete().eq("id", existing.id);
        } else {
          // Change vote
          await supabase
            .from("review_votes")
            .update({ vote_type: voteType })
            .eq("id", existing.id);
        }
      } else {
        // New vote
        await supabase.from("review_votes").insert({
          review_id: reviewId,
          user_id: userId,
          vote_type: voteType,
        });
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const getUserReviewForMovie = async (movieId, userId) => {
    try {
      const { data, error } = await supabase
        .from("movie_reviews")
        .select("*")
        .eq("movie_id", movieId.toString())
        .eq("user_id", userId)
        .maybeSingle();

      if (error) return { success: false, error };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const getAverageRating = async (movieId) => {
    try {
      const { data, error } = await supabase
        .from("movie_reviews")
        .select("rating")
        .eq("movie_id", movieId.toString());

      if (error || !data || data.length === 0) return null;

      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      return { average: avg, count: data.length };
    } catch (err) {
      return null;
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        getMovieReviews,
        submitReview,
        deleteReview,
        voteOnReview,
        getUserReviewForMovie,
        getAverageRating,
        loading,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
