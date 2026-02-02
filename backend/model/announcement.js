const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    type: {
      type: [String]
    },
    subject: {
      type: String
    },
    message: {
      type: String
    },
    fileUrl: {
      type: String, 
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    sentByName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
