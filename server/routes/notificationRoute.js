import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/get", authUser, getUserNotifications);
notificationRouter.put("/read/:notificationId", authUser, markAsRead);
notificationRouter.put("/read-all", authUser, markAllAsRead);
notificationRouter.delete(
  "/delete/:notificationId",
  authUser,
  deleteNotification
);

export default notificationRouter;
