const mongoose = require("mongoose");

const applicationStatusSchema = new mongoose.Schema(
  {
    mainTab: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
    },
    color: {
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
  {
    timestamps: true,
  }
);

applicationStatusSchema.index({ mainTab: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("applicationStatus", applicationStatusSchema);
