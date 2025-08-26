import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    productId: { type: String, required: true, ref: "product" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    userName: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure one review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Review = mongoose.models.review || mongoose.model("review", reviewSchema);

export default Review;
