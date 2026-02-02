const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  message: { type: String, required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notificationType: { type: String },
});

module.exports = mongoose.model("Notification", notificationSchema);
