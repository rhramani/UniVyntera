const mongoose = require("mongoose");

const loanInquirySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
    },
    country: {
      type: String,
    },
    requiredLoan: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
    },
    parentName: {
      type: String,
    },
    occupation: {
      type: String,
    },
    income: {
      type: String,
    },
    parentContact: {
      type: String,
    },
    approvedBank: {
      type: String,
    },
    approvedAmount: {
      type: String,
    },
    interestAmount: {
      type: String,
    },
    loanType: {
      type: String,
    },
    loanStartDate: {
      type: Date,
    },
    loanEndDate: {
      type: Date,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "loanStatus",
    },
    remarks: {
      type: String,
    },
    followup:{
      type: Date
    },
    followupRemarks: {
      type: String
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdByName: {
      type: String,
      default: null,
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
  { timestamps: true }
);

module.exports = mongoose.model("LoanInquiry", loanInquirySchema);
