const mongoose = require("mongoose");

const canadaVisaFlowSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: null,
    },
    conditionalOfferLetter: {
      received: { type: Boolean, default: false },
      documents: [String],
    }, 
    medicalProcess: {
      hospitalName: String,
      dateTime: Date,
      location: String,
      reportDocuments: [String],
      reportDate: Date,
    },
    tutuionFeePayment: {
      paymentDate: Date,
      academicYear: String,
      amount: Number,
      currencyCode: String,
      receiptDocuments: [String],
    },
    gicDetails: {
      bankName: String,
      accountOpeningDate: Date,
      accountNumber: String,
      loginId: String,
      password: String,
      amount: Number,
      documents: [String],
    },
    gckeyAccount: {
      accountOpenDate: Date,
      gckeyId: String,
      password: String,
      securityQuestion: String,
      securityAnswer: String,
    },
    applicationFormLock: {
      locked: { type: Boolean, default: false },
      lockDate: Date,
    },
    visaFeePayment: {
      amount: Number,
      currencyCode: String,
      paymentDateTime: Date,
      receiptDocuments: [String],
    },
    submissionConfirmation: {
      documents: [String],
    },
    biometricRequest: {
      applicationDate: Date,
      location: String,
      time: String,
      confirmationDocuments: [String],
    },
    bvlAndPpr: {
      bvlReceivedDate: Date,
      bvlDocuments: [String],
      pprReceivedDate: Date,
      pprDocuments: [String],
    },
    visaDecision: {
      passportSentForVisa: { type: Boolean, default: false },
      passportReceivedWithVisa: { type: Boolean, default: false },
      decision: {
        type: String,
        enum: ["Approved", "Refused", "Pending"],
        default: "Pending",
      },
      visaNumber: String,
      receivedDate: Date,
      issueFrom: Date,
      issueTo: Date,
      documents: [String],
    },
    poeLetter: {
      receivedDate: Date,
      documents: [String],
    },
    permits: {
      studyPermitFrom: Date,
      studyPermitTo: Date,
      coOpPermitFrom: Date,
      coOpPermitTo: Date,
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
  { _id: false }
);

module.exports = canadaVisaFlowSchema;
