const mongoose = require("mongoose");

const b2bAdminSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
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
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    commissionPercentage: { type: Number, min: 0, max: 100, default: null },
    memberLimit: {
      type: Number,
      default: 5,
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    companyLogo: {
      type: String,
    },
    companyLogoPublicId: {
      type: String,
    },
    companyLogoResource: {
      type: String,
    },
    websiteUrl: {
      type: String,
    },
    agreementStartDate: {
      type: String,
    },
    agreementEndDate: {
      type: String,
    },
    b2bAssignRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    assignTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: String,
    },
    GST_VAT: {
      type: String,
    },
    bankName: {
      type: String,
    },
    branch: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    cancelChequeImage: {
      type: String,
    },
    cancelChequeImagePublicId: {
      type: String,
    },
    cancelChequeResource: {
      type: String,
    },
    logoAccess: {
      type: String,
    },
    CTCCallRecording: {
      type: String,
      default: null
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    subscription: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("b2bAdmin", b2bAdminSchema);
