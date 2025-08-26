import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  checkWishlist,
} from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.post("/remove", authUser, removeFromWishlist);
wishlistRouter.get("/get", authUser, getUserWishlist);
wishlistRouter.get("/check/:productId", authUser, checkWishlist);

export default wishlistRouter;
