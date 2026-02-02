const mongoose = require("mongoose");

const b2bLeadStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    color: {
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

module.exports = mongoose.model("b2bLeadStatus", b2bLeadStatusSchema);
