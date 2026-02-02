const mongoose = require("mongoose");

const coachingFacultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      set: (v) => (v ? v.toLowerCase() : v),
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: String,
    },
    types: [{ type: String }],
    batchDetails: [
      {
        status: { type: String, required: true },
        times: [{ type: String }],
      },
    ],
    userRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      default: null,
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("coachingFaculty", coachingFacultySchema);
