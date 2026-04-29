import { useState, useEffect } from "react";
import { FaStar, FaThumbsUp, FaThumbsDown, FaTrash, FaUser } from "react-icons/fa";
import { useReviews } from "../context/ReviewsContext";
import { UserAuth } from "../context/AuthContext";
import "./MovieReviews.css";

function MovieReviews({ movieId }) {
  const { session } = UserAuth();
  const {
    getMovieReviews,
    submitReview,
    deleteReview,
    voteOnReview,
    getUserReviewForMovie,
    loading,
  } = useReviews();

  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hasUserReview, setHasUserReview] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    loadReviews();
    if (session?.user) {
      loadUserReview();
    }
  }, [movieId, session]);

  const loadReviews = async () => {
    setLoadingReviews(true);
    const result = await getMovieReviews(movieId);
    if (result.success) {
      setReviews(result.data);
    }
    setLoadingReviews(false);
  };

  const loadUserReview = async () => {
    const result = await getUserReviewForMovie(movieId, session.user.id);
    if (result.success && result.data) {
      setUserRating(result.data.rating);
      setReviewText(result.data.review_text || "");
      setHasUserReview(true);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!session) {
      setSubmitError("Please log in to submit a review");
      return;
    }
    if (userRating === 0) {
      setSubmitError("Please select a rating");
      return;
    }

    const result = await submitReview(movieId, userRating, reviewText, session.user.id);
    if (result.success) {
      setHasUserReview(true);
      loadReviews();
    } else {
      setSubmitError(result.error?.message || "Failed to submit review");
    }
  };

  const handleDeleteReview = async () => {
    if (!session) return;
    const result = await deleteReview(
      reviews.find((r) => r.user_id === session.user.id)?.id,
      session.user.id
    );
    if (result.success) {
      setUserRating(0);
      setReviewText("");
      setHasUserReview(false);
      loadReviews();
    }
  };

  const handleVote = async (reviewId, voteType) => {
    if (!session) return;
    await voteOnReview(reviewId, session.user.id, voteType);
    loadReviews();
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "most_liked":
        return b.likes - a.likes;
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="movie-reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">
          <FaStar className="reviews-title-icon" />
          User Reviews
        </h2>
        {averageRating && (
          <div className="average-rating-badge">
            <FaStar className="avg-star" />
            <span className="avg-number">{averageRating}</span>
            <span className="avg-count">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="review-form-container">
        <h3 className="form-title">
          {hasUserReview ? "Update Your Review" : "Write a Review"}
        </h3>

        {!session && (
          <p className="login-prompt">Please log in to write a review</p>
        )}

        {session && (
          <form onSubmit={handleSubmitReview} className="review-form">
            {/* Star Rating */}
            <div className="star-rating-input">
              <span className="rating-label">Your Rating:</span>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`star-btn ${
                      star <= (hoverRating || userRating) ? "active" : ""
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <span className="rating-text">{userRating}/5</span>
              )}
            </div>

            {/* Review Text */}
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this movie... (optional)"
              className="review-textarea"
              rows={4}
              maxLength={1000}
            />
            <div className="review-form-actions">
              <span className="char-count">{reviewText.length}/1000</span>
              <div className="form-buttons">
                {hasUserReview && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    className="delete-review-btn"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || userRating === 0}
                  className="submit-review-btn"
                >
                  {loading
                    ? "Submitting..."
                    : hasUserReview
                      ? "Update Review"
                      : "Submit Review"}
                </button>
              </div>
            </div>
            {submitError && <p className="review-error">{submitError}</p>}
          </form>
        )}
      </div>

      {/* Sort Controls */}
      {reviews.length > 0 && (
        <div className="reviews-sort">
          <span className="sort-label">Sort by:</span>
          <div className="sort-buttons">
            {[
              { value: "newest", label: "Newest" },
              { value: "highest", label: "Highest" },
              { value: "lowest", label: "Lowest" },
              { value: "most_liked", label: "Most Liked" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`sort-btn ${sortBy === opt.value ? "active" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loadingReviews ? (
        <div className="reviews-loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this movie!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className={`review-card ${
                session?.user?.id === review.user_id ? "own-review" : ""
              }`}
            >
              <div className="review-card-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <FaUser />
                  </div>
                  <div>
                    <span className="reviewer-name">{review.username}</span>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`review-star ${
                        star <= review.rating ? "filled" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {review.review_text && (
                <p className="review-text">{review.review_text}</p>
              )}

              <div className="review-actions">
                <button
                  onClick={() => handleVote(review.id, "like")}
                  className="vote-btn like-btn"
                  disabled={!session}
                >
                  <FaThumbsUp /> <span>{review.likes}</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, "dislike")}
                  className="vote-btn dislike-btn"
                  disabled={!session}
                >
                  <FaThumbsDown /> <span>{review.dislikes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieReviews;
