import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Add to Wishlist : /api/wishlist/add
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({ userId, productId });
    if (existingWishlist) {
      return res.json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    await Wishlist.create({ userId, productId });

    res.json({ success: true, message: "Added to wishlist successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Remove from Wishlist : /api/wishlist/remove
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const { userId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!wishlistItem) {
      return res.json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    res.json({ success: true, message: "Removed from wishlist successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get User Wishlist : /api/wishlist/get
export const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.body;

    const wishlistItems = await Wishlist.find({ userId }).populate("productId");

    const wishlistProducts = wishlistItems.map((item) => item.productId);

    res.json({ success: true, wishlist: wishlistProducts });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Check if product is in wishlist : /api/wishlist/check/:productId
export const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    const wishlistItem = await Wishlist.findOne({ userId, productId });

    res.json({ success: true, inWishlist: !!wishlistItem });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
