const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markNotificationsAsRead,
  deleteNotifications,
} = require("../../../controller/masters/notification/notification");
const { verifyToken } = require("../../../../middleware/jwt");

router.get("/", verifyToken, getUserNotifications);
router.put("/mark-read", verifyToken, markNotificationsAsRead);
router.delete("/delete", verifyToken, deleteNotifications);

module.exports = router;
