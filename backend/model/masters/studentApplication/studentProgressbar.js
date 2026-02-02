const mongoose = require("mongoose");

const progressStepSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  steps: {
    type: [String],
    default: ["Enrollment", "Counselling", "Application", "Admission", "Visa"],
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
});

module.exports = mongoose.model("studentProgressbar", progressStepSchema);
