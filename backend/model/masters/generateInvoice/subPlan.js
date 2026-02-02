const mongoose = require("mongoose");

const subPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mainPlan:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainPlan"
    },
    country: {
      type: String
    },
    totalAmount:{
        type: String
    },
    maxDiscount:{
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
      default : null
    },
    updatedByName: {
      type: String,
      default : null
    },
  },
  { timestamps: true }
);

subPlanSchema.index({ name: 1, mainPlan: 1, country: 1 }, { unique: true });
module.exports = mongoose.model("SubPlan", subPlanSchema);



