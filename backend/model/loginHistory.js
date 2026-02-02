const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  locationName: String,
  userAgent: String,
  loginType: {
    type: String,
    enum: ["password", "otp"],
  },
  status: {
    type: String,
    enum: ["success", "failed"],
    default: "success",
  },
  role: {
    type: String,
  },
  message: String,
});

module.exports = mongoose.model("LoginHistory", loginHistorySchema);
