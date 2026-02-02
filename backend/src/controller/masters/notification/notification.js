const Notification = require("../../../../model/masters/notification/notification");

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming userId is set by auth middleware
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ timestamp: -1 })
    return res.status(200).json({
      status: true,
      code: 200,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Something went wrong',
    });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    await Notification.updateMany(
      { recipientId: userId, read: false },
      { $set: { read: true } }
    );
    return res.status(200).json({
      status: true,
      code: 200,
      message: 'Notifications marked as read',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Something went wrong',
    });
  }
};

// Optional: Delete notifications instead of marking as read
const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    await Notification.deleteMany({ recipientId: userId, read: false });
    return res.status(200).json({
      status: true,
      code: 200,
      message: 'Notifications deleted',
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || 'Something went wrong',
    });
  }
};

module.exports = { getUserNotifications, markNotificationsAsRead, deleteNotifications };