const mongoose = require("mongoose");

const branchMemberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default:null
    },
    userRole:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      default: null,
    },
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
      type: String
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedByName: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("branchMember", branchMemberSchema);
