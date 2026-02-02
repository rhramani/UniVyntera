const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema(
  {
    leadFacebookToken: {
      type: String,
    },
    leadFacebookPageId: {
      type: String,
    },
    cloudinary: {
      cloudName: String,
      apiKey: String,
      apiSecret: String,
    },
    nodemailer: {
      email: String,
      password: String,
    },
    gmail: {
      topLogo: String,
      bottomLogo: String,
    },
    invoiceLogo: {
      type: String,
    },
    voiceAIDetails:{
      OMNIDIM_API_KEY: String,
      OMNIDIM_DEFAULT_PHONE_NUMBER_ID: String,
      OMNIDIM_BASE_URL: String
    },
    uniCommissionInvoice: {
      name: String,
      address: String,
      taxRegistrationNo: String,
      phoneNo: String,
      bankDetails: {
        accountOwnerName: String,
        accountOwnerAddress: String,
        bankName: String,
        accountNumber: String,
        SWIFTCode: String,
        IBAN: String,
      },
    },
    b2bInvoice: {
      name: String,
      address: String,
    },
    applicationFeeInvoice: {
      name: String,
      application: String,
      address: String,
      phoneNo: String,
      notes: String,
      bankDetails: {
        bankName: String,
        accountName: String,
        accountNumber: String,
        bankAddress: String,
        IFSCCode: String,
        SwiftCode: String,
      },
    },
    CTCCredentials: {
      CTC_USERNAME: String,
      CTC_PASSWORD: String,
      CTC_BASE_URL: String,
      CLINumber: String,
      CTC_RECORDING_FLAG: Number,
      CTC_DTMF_FLAG: Number,
      CTC_PINGBACK_URL: String,
      CTC_PINGBACK_SECRET: String
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: { type: String },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedByName: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("configuration", configurationSchema);
