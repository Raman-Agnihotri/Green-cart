import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    productId: { type: String, required: true, ref: "product" },
  },
  { timestamps: true }
);

// Ensure one wishlist entry per user per product
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Wishlist =
  mongoose.models.wishlist || mongoose.model("wishlist", wishlistSchema);

export default Wishlist;
