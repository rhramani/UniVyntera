const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
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

// const internalChatMessageSchema = new mongoose.Schema(
//   {
//     revicerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     messages: [messageSchema],
//   },
//   {
//     timestamps: true,
//   }
// );

const internalChatMessageSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [messageSchema],  
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "internal_chat_message",
  internalChatMessageSchema,
);
