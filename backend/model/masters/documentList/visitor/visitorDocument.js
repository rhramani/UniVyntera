const mongoose = require("mongoose");

const visitorDocumentSchema = new mongoose.Schema(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "visitorDocumentType"
    },
    name: {
      type: String
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

module.exports = mongoose.model("visitorDocument", visitorDocumentSchema);
