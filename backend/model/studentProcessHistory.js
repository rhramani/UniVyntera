const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  event: { type: String, required: true },     // e.g. "lead_status"
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  date: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedByName: { type: String }
});

const leadProcessHistorySchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead"
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentApplication",
    default: null
  },
  history: { type: [eventSchema], default: [] }
});

module.exports = mongoose.model("ApplicationProcessHistory", leadProcessHistorySchema);
  