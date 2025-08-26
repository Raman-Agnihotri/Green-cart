import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const ReviewSection = ({ productId }) => {
    const { user, axios } = useAppContext();
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [userReview, setUserReview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/review/product/${productId}`);
            if (data.success) {
                setReviews(data.reviews);
                setAverageRating(data.averageRating);
                setTotalReviews(data.totalReviews);
                
                // Check if user has already reviewed
                if (user) {
                    const userReview = data.reviews.find(review => review.userId === user._id);
                    setUserReview(userReview);
                }
            }
        } catch (error) {
            console.log('Error fetching reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to add a review');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/review/add', {
                productId,
                rating,
                comment: comment.trim()
            });

            if (data.success) {
                toast.success('Review added successfully');
                setComment('');
                setRating(5);
                setShowReviewForm(false);
                fetchReviews();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding review');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.put(`/api/review/update/${userReview._id}`, {
                rating,
                comment: comment.trim()
            });

            if (data.success) {
                toast.success('Review updated successfully');
                setComment('');
                setRating(5);
                setShowReviewForm(false);
                fetchReviews();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating review');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!confirm('Are you sure you want to delete your review?')) return;

        try {
            const { data } = await axios.delete(`/api/review/delete/${userReview._id}`);
            if (data.success) {
                toast.success('Review deleted successfully');
                setUserReview(null);
                fetchReviews();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting review');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <img
                key={index}
                src={index < rating ? assets.star_icon : assets.star_dull_icon}
                alt="star"
                className="w-4 h-4"
            />
        ));
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                            {renderStars(Math.round(averageRating))}
                        </div>
                        <span className="text-sm text-gray-600">
                            {averageRating.toFixed(1)} ({totalReviews} reviews)
                        </span>
                    </div>
                </div>
                
                {user && !userReview && (
                    <button
                        onClick={() => setShowReviewForm(true)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold mb-4">
                        {userReview ? 'Update Your Review' : 'Write a Review'}
                    </h4>
                    <form onSubmit={userReview ? handleUpdateReview : handleSubmitReview}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <img
                                            src={star <= rating ? assets.star_icon : assets.star_dull_icon}
                                            alt="star"
                                            className="w-6 h-6"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                rows="4"
                                placeholder="Share your experience with this product..."
                                maxLength="500"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                {comment.length}/500 characters
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setComment('');
                                    setRating(5);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* User's Review */}
            {userReview && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Your Review</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowReviewForm(true);
                                    setRating(userReview.rating);
                                    setComment(userReview.comment);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteReview}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div className="flex mb-2">
                        {renderStars(userReview.rating)}
                    </div>
                    <p className="text-gray-700">{userReview.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {new Date(userReview.createdAt).toLocaleDateString()}
                    </p>
                </div>
            )}

            {/* All Reviews */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{review.userName}</span>
                                    <div className="flex">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
