import Notification from "../models/Notification.js";

// Get User Notifications : /api/notification/get
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.body;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Mark Notification as Read : /api/notification/read/:notificationId
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Mark All Notifications as Read : /api/notification/read-all
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete Notification : /api/notification/delete/:notificationId
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      return res.json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Create Notification (Helper function for other controllers)
export const createNotification = async (
  userId,
  title,
  message,
  type = "system",
  link = null
) => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      link,
    });
  } catch (error) {
    console.log("Error creating notification:", error.message);
  }
};
