const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  readBy: [
    {   
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  ],
  media: [
    {
      url: { type: String },
      type: { type: String },
      name: { type: String },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
  mailSent: {
    type: Boolean,
    default: false,
  },
});

const chatMessageSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
