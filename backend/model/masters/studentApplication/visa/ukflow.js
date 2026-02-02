const mongoose = require("mongoose");

const ukVisaFlowSchema = new mongoose.Schema({
  status: {
    type: String,
    default: null,
  },
  cas: {
    applied: { type: Boolean, default: false },
    issued: { type: Boolean, default: false },
    casNumber: { type: String },
    issuedDate: { type: Date },
    casLetterUpload: { type: String },
  },
  tuitionAndFunds: {
    depositPaid: { type: Boolean, default: false },
    depositAmount: { type: Number },
    depositCurrency: { type: String },
    depositPaymentDate: { type: String },
    feeReceiptUpload: { type: String },
    maintenanceProofUploads: [String],
    fundHeld28days: { type: Boolean, default: false },
    fundProofUpload: { type: String },
  },
  tbTestDetails: {
    required: { type: Boolean, default: false },
    testDate: { type: Date },
    hospitalName: { type: String },
    certificateUpload: { type: String },
  },
  visaApplicationForm: {
    started: { type: Boolean, default: false },
    submissionDate: { type: Date },
    applicationFormUpload: { type: String },
  },
  fees: {
    appointmentType: {
      type: String,
      //  enum: [ "Normal" , "Priority" , "Super Priority" ]
    },
    ihsReference: { type: String },
    ihsAmount: { type: Number },
    ihsCurrency: { type: String },
    ihsPaymentDate: { type: Date },
    ihsReceiptUpload: { type: String },

    embassyFeeAmount: { type: Number },
    embassyCurrency: { type: String },
    embassyPaymentDate: { type: Date },
    embassyFeeReceiptUpload: { type: String },

    vfsFeeAmount: { type: Number },
    vfsCurrency: { type: String },
    vfsPaymentDate: { type: Date },
    vfsFeeReceiptUpload: { type: String },
  },

  biometricAppointment: {
    booked: { type: Boolean, default: false },
    dateTime: { type: Date },
    location: { type: String },
    confirmationUplad: { type: String },
  },
  biometricCompletion: {
    completed: { type: Boolean, default: false },
    biometricDate: { type: Date },
    biometricSlipUpload: { type: String },
  },
  visaDecision: {
    decision: {
      type: String,
      //   enum: ["Approved", "Refused", "Pending"],
    },
    decisionDate: {
      type: Date,
    },
    visaNumber: {
      type: String,
    },
    visaStickerUpload: {
      type: String,
    },
    passportCollectionDate: {
      type: Date,
    },
    validity: {
      from: { type: Date },
      to: { type: Date },
    },
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdByName: { type: String },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedByName: { type: String },
});

module.exports = ukVisaFlowSchema;
