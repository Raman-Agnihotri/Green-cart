import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", authUser, addReview);
reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.put("/update/:reviewId", authUser, updateReview);
reviewRouter.delete("/delete/:reviewId", authUser, deleteReview);

export default reviewRouter;
