const mongoose = require("mongoose");

const australiaVisaFlowSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: null,
    },
    offerLetter: {
      received: { type: Boolean, default: false },
      offerLetterUpload: { type: String },
    },
    coe: {
      received: { type: Boolean, default: false },
      issueDate: { type: Date },
      coeUpload: { type: String },
    },
    medicalExamination: {
      hospitalName: { type: String },
      appointmentDateTime: { type: String },
      location: { type: String },
      reportUpload: { type: String },
      reportIssueDate: { type: String },
    },
    tuitionFeePayment: {
      paymentDate: { type: Date },
      amount: { type: Number },
      currency: { type: String },
      academicPeriod: { type: String },
      receiptUpload: { type: String },
    },
    oshc: {
      provider: { type: String },
      policyNumber: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      certificateUpload: { type: String },
    },
    immiAccount: {
      creationDate: { type: Date },
      accountId: { type: String },
      password: { type: String },
      securityQuestion: { type: String },
      securityAnswer: { type: String },
    },
    visaApplication: {
      submitted: { type: Boolean, default: false },
      submissionDate: { type: Date },
      applicationFormUpload: { type: String },
    },
    visaFeePayment: {
      amount: { type: Number },
      currency: { type: String },
      paymentDateTime: { type: Date },
      receiptUpload: { type: String },
    },
    biometrics: {
      requestDate: { type: Date },
      appointmentDateTime: { type: Date },
      location: { type: String },
      acknowledgementUpload: { type: String },
    },
    visaOutcome: {
      decision: {
        type: String,
        //  enum: ["Granted" , "Refused" , "Pending"]
      },
      visaNumber: { type: String },
      grantDate: { type: Date },
      validity: {
        from: { type: Date },
        to: { type: Date },
      },
      grantLetterUpload: { type: String },
    },

    travelPreparation: {
      checklistUpload: { type: String },
      flightTicketUpload: { type: String },
      orientationDate: { type: Date },
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: { type: String },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedByName: { type: String },
  },
  {
    _id: false,
  }
);

module.exports = australiaVisaFlowSchema;
