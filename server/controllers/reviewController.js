import Review from "../models/Review.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Add Review : /api/review/add
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const { userId } = req.body;

    if (!productId || !rating || !comment) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Get user name from database
    const user = await User.findById(userId).select("name");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      userId,
      productId,
      rating,
      comment,
      userName: user.name,
    });

    // Update product average rating
    await updateProductRating(productId);

    res.json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Product Reviews : /api/review/product/:productId
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : 0;

    res.json({
      success: true,
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update Review : /api/review/update/:reviewId
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const { userId } = req.body;

    if (!rating || !comment) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, userId },
      { rating, comment },
      { new: true }
    );

    if (!review) {
      return res.json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    // Update product average rating
    await updateProductRating(review.productId);

    res.json({ success: true, message: "Review updated successfully", review });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete Review : /api/review/delete/:reviewId
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const review = await Review.findOneAndDelete({ _id: reviewId, userId });

    if (!review) {
      return res.json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    // Update product average rating
    await updateProductRating(review.productId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Helper function to update product average rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ productId });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.log("Error updating product rating:", error.message);
  }
};
