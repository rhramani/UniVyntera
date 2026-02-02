const mongoose = require("mongoose");

const studentInvoiceSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  b2b: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "b2bAdmin",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentApplication",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  currencyCode: {
    type: String,
    required: true,
  },
  rate: {
    type: String,
    required: true,
  },
  payable: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankingDetails",
    default: null,
  },
  status: {
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
},{
  timestamps: true
});

module.exports = mongoose.model("StudentInvoice", studentInvoiceSchema);
