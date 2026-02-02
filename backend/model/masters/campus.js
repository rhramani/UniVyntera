const mongoose = require("mongoose");

const campusSchema = new mongoose.Schema(
  {
    country: {
      type: String
    },
    campus: {
      type: String
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: {
      type: String
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default : null
    },
    updatedByName: {
      type: String,
      default : null
    },  
  },
  { timestamps: true }
);

campusSchema.index({ campus: 1, country: 1 }, { unique: true });

module.exports = mongoose.model("Campus", campusSchema);
