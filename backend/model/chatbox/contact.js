// const mongoose = require("mongoose");

// const contactSchema = new mongoose.Schema(
//   {
//     fname: { type: String },
//     lname: { type: String },
//     email: { type: String },
//     phoneNumber: { type: String, required: true }, // Include country code
//     isSubscribed: { type: Boolean, default: true },
//     // admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     contact_create_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     lastMessageTime: { type: Date, default: null },
//     lastIncomingMessageTime: { type: Date, default: null },
//     newMessage: { type: Boolean, default: false },
//     createdByName : { type: String }
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("chatboxcontact", contactSchema);
