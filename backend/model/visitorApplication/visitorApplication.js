const mongoose = require("mongoose");

const educationDetailSchema = new mongoose.Schema(
  {
    degree: { type: String },
    stream: { type: String },
    score: String,
    scoreOutOf: String,
    passingYear: String,
    boardOrUniversity: { type: String },
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
    timestamps: true,
  }
);

const languageEntranceExamSchema = new mongoose.Schema(
  {
    testName: { type: String },
    testDate: String,
    expireDate: String,
    readScore: String,
    writeScore: String,
    speakScore: String,
    listenScore: String,
    OverallScore: String,
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
    timestamps: true,
  }
);

const aptitudeExamSchema = new mongoose.Schema(
  {
    testName: { type: String },
    testDate: String,
    expireDate: String,
    verbalReasoningScore: String,
    quantitiveReasoningScore: String,
    analyticalWritingScore: String,
    overallScore: String,
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
    timestamps: true,
  }
);

const workExperienceSchema = new mongoose.Schema(
  {
    company: { type: String },
    companyAddress: { type: String },
    designation: { type: String },
    jobType: { type: String },
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
    timestamps: true,
  }
);

const uploadedDocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CountryDocument",
    },
    documentName: {
      type: mongoose.Schema.Types.Mixed,
    },
    customDocumentName: {
      type: String,
      default: null,
    },
    ref_module: {
      type: mongoose.Schema.Types.ObjectId,
    },
    filePath: {
      type: String,
      // required: true
    },
    remarks: {
      type: String,
      default: null,
    },
    status: {
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
  {
    timestamps: true,
  }
);

const userAllocationSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
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
});

const visaApplicationSchema = new mongoose.Schema({
  status: {
    type: String,
    default: null,
  },
  paymentDetails: String,
  feeStatus: {
    type: String,
  },
  biometricsUploaded: Boolean,
  VFSAppointmentDateTime: Date,
  visaFileHandover: {
    date: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdByName: {
      type: String,
      default: null,
    },
  },
  d_visa_apply: {
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    apply: {
      type: String,
    },
  },
  visaFileSubmission: {
    finalChecklistConfirmed: {
      type: Boolean,
      default: false,
    },
    fileSubmission: {
      isSubmitted: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: String,
        default: null,
      },
      link: {
        type: String,
        default: null,
      },
    },

    submissionDateRecorded: {
      type: Boolean,
      default: false,
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
  visaOnlineSubmission: {
    date: {
      type: String,
    },
  },
  visaOutcomeStatus: {
    type: String,
  },
  visaOutcomeDate: {
    type: Date,
  },
  RP_decisionDate: {
    issueDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    remarks: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdByName: {
      type: String,
      default: null,
    },
  },
  remarks: {
    text: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdByName: {
      type: String,
      default: null,
    },
  },
  rejectionReason: {
    type: String,
  },
  appealOption: {
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
});

const followUpSchema = new mongoose.Schema({
  nextFollowUpDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    default: "Pending",
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
});

const visitorApplicationSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
    },
    name: {
      type: String,
    },
    contact: {
      type: String,
    },
    alternateContact: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    age: {
      type: Number,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    passportNumber: {
      type: String,
    },
    preferredCountry: {
      type: String,
    },
    categoryDetails: [
      {
        type: { type: String },
        country: { type: String },
        document: { type: String },
        date: { type: Date },
        remarks: { type: String },
      },
    ],
    educationDetails: {
      type: [educationDetailSchema],
      default: [],
    },
    entranceExamDetails: {
      type: [languageEntranceExamSchema],
      default: [],
    },
    aptitudeExamDetails: {
      type: [aptitudeExamSchema],
      default: [],
    },
    workExperience: {
      type: [workExperienceSchema],
      default: [],
    },
    uploadedDocumentDetails: {
      type: [uploadedDocumentSchema],
      default: [],
    },

    userAllocationDetails: {
      type: [userAllocationSchema],
      default: [],
    },
    visaAllocationDetails: {
      type: [userAllocationSchema],
      default: [],
    },
    visaApplicationDetails: {
      type: visaApplicationSchema,
      default: {},
    },

    // universityApplicationDetails: {
    //   type: [universityApplicationSchema],
    //   default: []
    // },
    personalDetailStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "visitorApplicationStatus",
    },
    documentDetailStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "visitorApplicationStatus",
    },
    lastUpdatedStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "visitorApplicationStatus",
    },
    mainStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "visitorStatus",
    },
    personalDetailsSubmitted: {
      type: Boolean,
    },
    submittedTabs: {
      type: [String],
    },
    followUps: {
      personalDetails: { type: followUpSchema, default: () => ({}) },
      documentDetails: { type: followUpSchema, default: () => ({}) },
      //   interestedCourse: { type: followUpSchema, default: () => ({}) },
      visaApplication: { type: followUpSchema, default: () => ({}) },
    },
    isSubmit: {
      type: Boolean,
      // default:false
    },
    visaByRG: {
      type: Boolean,
      default: true,
    },
    clone_by: {
      type: mongoose.Schema.Types.ObjectId,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdByName: {
      type: String,
    },
    created_by_type: {
      type: String,
    },
    b2bCompany: {
      type: String,
    },
    branch: {
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
    updated_by_type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("visitorApplication", visitorApplicationSchema);
