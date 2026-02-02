const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentApplication",
      required: true,
    },
    date: { type: Date, required: true },
    status: { type: Boolean },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId
    },
    remarks: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendence" , attendanceSchema);