const mongoose = require("mongoose");

const bankingSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required : true
    },
    accountType: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    bankAddress: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    swiftCode: {
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

module.exports = mongoose.model("BankingDetails", bankingSchema);
