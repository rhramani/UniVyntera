// master removed

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    programName: {
      type: String,
      required: true
    },
    concentration: {
      type: String
    },
    websiteUrl: {
      type: String,
    },
    // campus: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Campus",
    //   required: true,
    // },
    country: {
      type: String
    },
    studyLevel: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramLevel",
        required: true,
      }
    ],
    duration: {
      type: String
    },
    intakes: [
      {
        month: { type: String, required: true }, // e.g., "Fall", "Winter"
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
      }
    ],
    intakeYear: {
      type: [String],
    },
    applicationStartDate: {
      type: [String],
    },
    applicationEndDate: {
      type: [String],
    },
    entryRequirements: {
      type: String
    },
    // applicationDeadlines: {
    //   type: [String]
    // },
    currencyCode: {
      type: String
    },
    applicationFee: {
      type: String,
    },
    yearlyTuitionFee: {
      type: String
    },
    scholarshipAvailable: {
      type: String
    },
    scholarshipDetails: {
      type: String
    },
    remarks: {
      type: String
    },
    eslElpAvailable: {
      type: String
    },
    studyArea: {
      type: String
    },
    disciplineArea: {
      type: [String], 
      default: []     
    },
    eslElpDetails: {
      type: String
    },
    applicationMode: {
      type: String
    },
    englishProficiencyExamWaiver: {
      type: String
    },
    requirements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Requirements",
      },
    ],
    criteria: {
      type: String
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag"
    }],
    score: Number,
    scoreOutOf: Number,
    percentage: Number,
    career: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdByName: {
      type: String
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    updatedByName: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ programName: "text", concentration: "text" }); // for search
courseSchema.index({ intakes: 1 });
courseSchema.index({ intakeYear: 1 });
courseSchema.index({ university: 1 });
courseSchema.index({ studyLevel: 1 });
courseSchema.index({ requirements: 1 });
courseSchema.index({ scholarshipAvailable: 1 });
courseSchema.index({ eslElpAvailable: 1 });
courseSchema.index({ duration: 1 });

module.exports = mongoose.model("Course", courseSchema);
