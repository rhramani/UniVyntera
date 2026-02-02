const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
    profileImage: {
      type: String,
    },
    otp: {
      type: String,
    },
    googleId: {
      type: String,
    },
    otpExpires: {
      type: String,
    },
    logo: {
      type: String,
    },
    profile: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    userRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    country: {
      type: [String],
    },
    b2bCountry: {
      type: [String],
    },
    b2bState: {
      type: [String],
    },
    birthdayDate: {
      type: String,
    },
    joiningDate: {
      type: String,
    },
    viewSpecificB2B: {
      type: Boolean,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    viewB2BStudentApplication: { type: Boolean, default: false },
    whichB2BStudentApplication: {
      type: String,
      enum: ["all", "countrywise"],
      default: "countrywise",
    },
    assignedB2B: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "b2bAdmin", 
      },
    ],
    restrictByIp: { type: Boolean, default: false },
    originalRestrictByIp: { type: Boolean, default: false },
    allowedIps: [{ type: String }],
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
    tokens: [
      {
        token: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
