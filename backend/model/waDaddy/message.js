const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: String, // WhatsApp number
  to: String, // WhatsApp number
  messageId: String,
  text: String,
  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "document","template","single_template","button"],
    default: "text",
  },
  mediaUrl: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  direction: {
    type: String,
    enum: ["inbound", "outbound"],
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read", "failed"],
    default: "sent",
  },
  wabaId: String,
  phoneNumberId: String,
  // admin_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "user",
  //   required: true,
  // },
  createdByName: {
    type: String
  },
  buttonPayload: String, // Optional: for quick reply button responses
});

// Optional: indexes for performance
messageSchema.index({ from: 1, to: 1, timestamp: 1 });

module.exports = mongoose.model("Message", messageSchema);
