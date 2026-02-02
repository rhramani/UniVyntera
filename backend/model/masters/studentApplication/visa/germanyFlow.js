const mongoose = require("mongoose");

const germanyVisaFlowSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: null,
    },
    admissionLetter: {
      received: { type: Boolean, default: false },
      letterUpload: { type: String },
    },
    blockedAccount: {
      bankName: { type: String },
      accountOpeningDate: { type: Date },
      blockedAmount: { type: Number },
      confirmationUpload: { type: String },
      remittanceUpload: { type: String },
    },
    healthInsurance: {
      providerName: { type: String },
      insuranceType: { type: String },
      policyNumber: { type: String },
      validity: {
        from: { type: Date },
        to: { type: Date },
      },
      certificateUpload: { type: String },
    },
    visaApplicationForm: {
      completed: { type: Boolean, default: false },
      applicationDate: { type: Date },
      formUpload: { type: String },
    },
    appointmentBooking: {
      bookingDate: { type: Date },
      appointmentDateTime: { type: Date },
      location: { type: String },
      confirmationUpload: { type: String },
    },
    visaFeePayment: {
      amount: { type: Number },
      currency: { type: String },
      mode: { type: String },
      paymentDate: { type: Date },
      receiptUpload: { type: String },
    },
    biometricsInterview: {
      interviewDateTime: { type: Date },
      consulateLocation: { type: String },
      acknowledgementUpload: { type: String },
      submittedDocsUpload: { type: String },
    },
    visaDecision: {
      status: {
        type: String,
        // enum: ["Approved", "Refused", "Pending"]
      },
      visaNumber: { type: String },
      issueDate: { type: Date },
      expiryDate: { type: Date },
      visaDocUpload: { type: String },
    },
    travelResidencePermit: {
      flightTicketUpload: { type: String },
      arrivalDate: { type: Date },
      rpApplicationDate: { type: Date },
      validity: {
        from: { type: Date },
        to: { type: Date },
      },
      residencePermitUpload: { type: String },
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: { type: String },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedByName: { type: String },
  },
  { _id: false }
);

module.exports = germanyVisaFlowSchema;
