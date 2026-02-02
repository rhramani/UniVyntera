const mongoose = require("mongoose");

const b2bMemberSchema = new mongoose.Schema(
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
    b2bAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "b2bAdmin",
      default:null,
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

module.exports = new mongoose.model("b2bMember", b2bMemberSchema);
