import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "promotion", "system", "review"],
      default: "system",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // Optional link to navigate to
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);

export default Notification;
