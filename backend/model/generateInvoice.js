const mongoose = require("mongoose");

const generateInvoiceSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.ObjectId,
    },
    contactNo: {
      type: String,
    },
    mainPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainPlan",
      default: null,
    },
    subPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubPlan",
      default: null,
    },
    amount: {
      type: String,
    },
    discount: {
      type: String,
    },
    discountAmount: {
      type: String,
    },
    payableAmount: {
      type: String,
    },
    paidAmount: [
      {
        amount: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        paymentMode: {
          type: String,
        },
        bank: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BankingDetails",
          default: null,
        },
      },
    ],
    dueAmount: {
      type: String,
    },
    paymentType: {
      type: String,
    },
    remarks: {
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
  { timestamps: true }
);

module.exports = mongoose.model("GenerateInvoice", generateInvoiceSchema);
