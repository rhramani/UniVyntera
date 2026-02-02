const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
  {
    country: { type: String, required: true },
    state: { type: String },
    city: { type: String },
    instituteName: { type: String, required: true },
    instituteRanking: { type: String },
    campus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
    },
    offerLetterEmail: { type: String },
    offerLetterEmailCC: { type: String },
    refundEmail: { type: String },
    refundEmailCC: { type: String },
    ttEmail: { type: String },
    ttEmailCC: { type: String },
    contact1: { type: String },
    contact2: { type: String },
    contactPerson: [
      {
        name: { type: String },
        designation: { type: String },
        email: { type: String },
        phone: { type: String },
      },
    ],
    recruitmentTerritoryRights: { type: String },
    agreementStartDate: { type: Date },
    agreementEndDate: { type: Date },
    agreementStatus: { type: String },
    typeOfAssociation: { type: String },
    agreementDoc: { type: String },
    admissionType: { type: String },
    portal: { type: String }, 
    webAddress: { type: String },
    postalAddress: { type: String },
    fax: { type: String },
    // commissionPeriod: { type: String }, // Per semester / Year / quarter
    // commissionPercentage: { type: Number, min: 0, max: 100 },
    programLevelCommissions: [
      {
        programLevel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProgramLevel",
          required: true,
        },
        commissionPeriod: { type: String, required: true },
        commissionPercentage: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
      },
    ],
    olTATPeriod: {
      value: { type: Number },
      unit: { type: String },
    },
    profile: { type: String },
    brochure: { type: String },
    backlog: { type: String },
    youtubeLink: { type: String },
    galleryLink: { type: String },
    otherInfo: { type: String },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

instituteSchema.index({ country: 1 });
instituteSchema.index({ state: 1 });
instituteSchema.index({ campus: 1 });

module.exports = mongoose.model("Institute", instituteSchema);
