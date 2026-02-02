const mongoose = require("mongoose");

const franceVisaFlowSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: null,
    },
    admissionLetter: {
      received: { type: Boolean, default: false },
      institutionName: { type: String },
      letterUpload: { type: String },
    },
    campusFranceRegistration: {
      accountCreated: { type: Boolean, default: false },
      applicationNo: { type: String },
      submissionDate: { type: Date },
      approvalLetterUpload: { type: String },
    },
    tuitionFeePayment: {
      paymentDate: { type: Date },
      academicYear: { type: String },
      amount: { type: Number },
      currency: { type: String },
      receiptUpload: { type: String },
    },
    proofOfFunds: {
      method: { type: String },
      bankName: { type: String },
      fundAmount: { type: Number },
      proofUpload: {
        type: String,
      },
    },
    medicalInsurance: {
      providerName: { type: String },
      policyNumber: { type: String },
      validity: {
        from: { type: Date },
        to: { type: Date },
      },
      certificateUpload: { type: String },
    },
    franceVisasForm: {
      started: { type: Boolean, default: false },
      refernceNumber: { type: String },
      submissionDate: { type: Date },
      formUpload: { type: String },
    },
    visaFeePayment: {
      amount: { type: Number },
      currency: { type: String },
      mode: { type: String },
      paymentDate: { type: Date },
      receiptUpload: { type: String },
    },
    appointmentBooking: {
      confirmed: { type: Boolean, default: false },
      appointmentDateTime: { type: Date },
      location: { type: String },
      confirmationUpload: { type: String },
    },
    biometricsSubmission: {
      dateTime: { type: Date },
      location: { type: String },
      slipUpload: { type: String },
    },
    visaDecision: {
      status: { type: String, enum: ["Approved", "Refused", "Pending"] },
      visaNumber: { type: String },
      grantDate: { type: Date },
      validity: {
        from: { type: Date },
        to: { type: Date },
      },
      visaDocUpload: { type: String },
    },
    postArrivalFormalities: {
      arrivalDate: { type: Date },
      ofiiRegistrationDate: { type: Date },
      ofiiDocUpload: { type: String },
    },
    // Metadata
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: { type: String },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedByName: { type: String },
  },
  { _id: false }
);

module.exports = franceVisaFlowSchema;
