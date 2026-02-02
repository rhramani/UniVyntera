const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    ipRestriction: {
      type: Boolean,
    },
    crmCurrency: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

module.exports = mongoose.model("crmSettings", settingsSchema);
