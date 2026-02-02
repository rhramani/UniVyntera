const mongoose = require("mongoose");

const wpTemplateChema = new mongoose.Schema(
  {
    category:{
     type: mongoose.Schema.Types.ObjectId,
     ref: "wpcategory"
    },
    type:{
      type: String
    },
    message: {
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
      default : null
    },
    updatedByName: {
      type: String,
      default : null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wptemplate", wpTemplateChema);
