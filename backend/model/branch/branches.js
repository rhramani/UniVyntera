const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: String,
    contactPerson: String,
    designation: String,
    address: String,
    city: String,
    state: String,
    country: String,
    phone: String,
    email: String,
    password: String,
    otp: {
      type: String,
    },
    otpExpires: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    otp: {
      type: String,
    },
    otpExpires: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdByName: {
      type: String,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedByName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("branch", branchSchema);
