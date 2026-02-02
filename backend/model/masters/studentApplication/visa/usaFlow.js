const mongoose = require("mongoose");

const usaVisaFlowSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: null,
    },
    i20Application: {
      applied: { type: Boolean, default: false },
      depositFeeAmount: Number,
      depositCurrencyCode: String,
      depositFeePaymentDate: Date,
      fundShowDocuments: [String],
    },
    i20Received: {
      received: { type: Boolean, default: false },
      receivedDate: Date,
      documents: [String],
    },
    ds160Registration: {
      started: { type: Boolean, default: false },
      registrationDate: Date,
    },
    ds160Confirmation: {
      confirmed: { type: Boolean, default: false },
      confirmationDate: Date,
      documents: [String],
    },
    visaFeePayment: {
      mode: String,
      amount: Number,
      currencyCode: String,
      paymentDate: Date,
      refNo: String,
      receipt: String,
    },
    appointmentBooking: {
      confirmed: { type: Boolean, default: false },
      confirmationUpload: String,
      vac: {
        dateTime: Date,
        location: String,
      },
      interview: {
        dateTime: Date,
        location: String,
      },
    },
    sevisPayment: {
      usdAmount: Number,
      inrAmount: Number,
      paymentDate: Date,
      sevisId: String,
      receipt: String,
    },
    fundsShow: {
      balanceSource: String,
      remark: String,
      requiredAmount: Number,
      shownAmount: Number,
    },
    decision: {
      decision: { type: String },
      visaNumber: String,
      visaSticker: String,
      validity: {
        from: Date,
        to: Date,
      },
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
    _id: false,
  }
);

module.exports = usaVisaFlowSchema;
