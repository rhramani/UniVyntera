const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const baseVisaSchema = require("./visa/universalFlow");
const usaVisaSchema = require("./visa/usaFlow");

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

const personalDetailsRemarkSchema = new mongoose.Schema(
  {
    remark: {
      type: String,
      trim: true,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdByName: {
      type: String,
      default: null,
    },

    updatedBy: {
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

const emergencyDetailsSchema = new mongoose.Schema(
  {
    personName: {
      type: String,
      trim: true,
      required: true,
    },
    contactNum: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
    },
    relationShip: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdByName: {
      type: String,
      default: null,
    },

    updatedBy: {
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

const purposeDetailsSchema = new mongoose.Schema(
  {
    inquiryFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inquiryType",
      default: null,
    },
    preferredCountry: [String],
    intakeYear: [String],
    intakeMonth: [String],
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
    deadline: {
      type: Date,
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
  },
  {
    timestamps: true,
  }
);

const interestedCourseSchema = new mongoose.Schema({
  applicationId: {
    type: String,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
  },
  campus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campus",
  },
  programLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProgramLevel",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  intakeMonth: {
    type: String,
  },
  intakeYear: {
    type: String,
  },
  status: {
    type: String,
    default: null,
  },
  remarks: {
    type: String,
  },
  typeOfApplication: {
    type: String,
    default: null,
  },
  applicationSubmissionForm: {
    type: String,
    default: "Pending",
  },
  applicationSubmissionRemarks: {
    type: String,
  },
  interviewScheduling: {
    type: {
      type: String,
    },
    singleInterview: {
      dateTime: String,
      mode: String,
      meetingLink: String,
      remarks: String,
    },
    multiRoundInterview: [
      {
        round: String,
        dateTime: String,
        mode: String,
        meetingLink: String,
        remarks: String,
      },
    ],
  },
  interviewResult: {
    type: String,
    default: null,
  },
  scholarshipAmount: {
    type: String,
    default: null,
  },
  offerLetterReceived: {
    type: Boolean,
    default: false,
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  offerLetterType: {
    type: String,
    default: null,
  },
  offerLetterRemarks: {
    type: String,
  },
  offerLetterAcceptedByStudent: {
    type: String,
    default: false,
  },
  offerLetterAcceptedByStudentRemarks: {
    type: String,
    default: null,
  },
  depositPayment: {
    paymentType: String,
    feeStatus: String,
    feeAmount: String,
    currencyCode: String,
    remarks: String,
  },
  instituteFeePayment: {
    paymentType: String,
    feeStatus: String,
    feeAmount: String,
    paidAmount: String,
    dueAmount: String,
    feeDeadline: Date,
    currencyCode: String,
    remarks: String,
  },
  portalDetails: {
    url: String,
    applicationType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicationType",
      default: null,
    },
    user: String,
    password: String,
    remarks: String,
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

interestedCourseSchema.pre("save", function (next) {
  if (this.portalDetails && this.portalDetails.password) {
    const key = "ek1be2tran3";

    // Only encrypt if not already encrypted (basic check)
    const isEncrypted =
      this.portalDetails.password.includes("==") &&
      this.portalDetails.password.length > 20;
    if (!isEncrypted) {
      const encrypted = CryptoJS.AES.encrypt(
        this.portalDetails.password,
        key
      ).toString();
      this.portalDetails.password = encrypted;
    }
  }
  next();
});

interestedCourseSchema.methods.toJSON = function () {
  const obj = this.toObject();
  const key = "ek1be2tran3";
  if (obj.portalDetails?.password) {
    const bytes = CryptoJS.AES.decrypt(obj.portalDetails.password, key);
    obj.portalDetails.password = bytes.toString(CryptoJS.enc.Utf8);
  }
  return obj;
};

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

const universityApplicationSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
  },
  uniAssesmentLevel: {
    type: String,
  },
  applicationFee: {
    type: String,
  },
  yearlyTutionFee: {
    type: String,
  },
  applicationDate: {
    type: String,
  },
  status: {
    type: String,
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

// const visaApplicationSchema = new mongoose.Schema({
//   status: {
//     type: String,
//     default: null,
//   },
//   paymentDetails: String,
//   feeStatus: {
//     type: String,
//   },
//   biometricsUploaded: Boolean,
//   VFSAppointmentDateTime: Date,
//   visaFileHandover: {
//     date: {
//       type: String,
//     },
//     created_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     createdByName: {
//       type: String,
//       default: null,
//     },
//   },
//   d_visa_apply: {
//     startDate: {
//       type: String,
//     },
//     endDate: {
//       type: String,
//     },
//     apply: {
//       type: String,
//     },
//   },
//   visaFileSubmission: {
//     finalChecklistConfirmed: {
//       type: Boolean,
//       default: false,
//     },
//     fileSubmission: {
//       isSubmitted: {
//         type: Boolean,
//         default: false,
//       },
//       mode: {
//         type: String,
//         default: null,
//       },
//       link: {
//         type: String,
//         default: null,
//       },
//     },

//     submissionDateRecorded: {
//       type: Boolean,
//       default: false,
//     },
//     updated_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     updatedByName: {
//       type: String,
//       default: null,
//     },
//   },
//   visaOnlineSubmission: {
//     date: {
//       type: String,
//     },
//   },
//   visaOutcomeStatus: {
//     type: String,
//   },
//   visaOutcomeDate: {
//     type: Date,
//   },
//   RP_decisionDate: {
//     issueDate: {
//       type: String,
//     },
//     endDate: {
//       type: String,
//     },
//     remarks: {
//       type: String,
//     },
//     created_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     createdByName: {
//       type: String,
//       default: null,
//     },
//   },
//   remarks: {
//     text: {
//       type: String,
//     },
//     created_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     createdByName: {
//       type: String,
//       default: null,
//     },
//   },
//   rejectionReason: {
//     type: String,
//   },
//   appealOption: {
//     type: String,
//   },
//   created_by: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   createdByName: {
//     type: String,
//   },
//   updated_by: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     default: null,
//   },
//   updatedByName: {
//     type: String,
//     default: null,
//   },
// });

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

const coachingRemarkDetailsSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const mockTestSchema = new mongoose.Schema(
  {
    testDate: {
      type: Date,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      default: null,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coachingFaculty",
      default: null,
    },
    AssmtDate: {
      type: Date,
    },
    testAssmt: {
      type: String,
    },
    reading: { type: Number, default: null },
    writing: { type: Number, default: null },
    speaking: { type: Number, default: null },
    listening: { type: Number, default: null },
    total: { type: Number, default: null },
    document: { type: String, default: null },
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

const masterSessionSchema = new mongoose.Schema(
  {
    testDate: {
      type: Date,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      default: null,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coachingFaculty",
      default: null,
    },
    AssmtDate: {
      type: Date,
    },
    testAssmt: {
      type: String,
    },
    reading: { type: Number, default: null },
    writing: { type: Number, default: null },
    speaking: { type: Number, default: null },
    listening: { type: Number, default: null },
    total: { type: Number, default: null },
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

const subjectSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
    },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "level",
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
  },
  {
    timestamps: true,
  }
);

const studentApplicationSchema = new mongoose.Schema(
  {
    studentId: {
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
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      set: (v) => (v ? v.toLowerCase() : v),
    },
    DOB: {
      type: String,
    },
    age: {
      type: String,
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
    docUploadByStudent: {
      type: Boolean,
    },
    admissionProcessRequired: {
      type: Boolean,
      default: false,
    },
    coachingDetails: {
      coachingRequired: {
        type: Boolean,
        default: false,
      },
      city: {
        type: String,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      examRegistrationDate: {
        type: Date,
      },
      registerFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentRegisterFor",
        default: null,
      },
      coachingRequirement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coachingRequirement",
        default: null,
      },
      batchStatus: {
        type: String,
        default: null,
      },
      branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
        default: null,
      },
      batchFaculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coachingFaculty",
        default: null,
      },
      batchTiming: {
        type: String,
        default: null,
      },
      targetedScore: {
        type: Number,
        default: null,
      },
      targetAchieved: {
        date: { type: Date },
        document: { type: String, default: null },
        scores: {
          reading: { type: Number, default: null },
          writing: { type: Number, default: null },
          speaking: { type: Number, default: null },
          listening: { type: Number, default: null },
          total: { type: Number, default: null },
        },
      },
      hasGivenExam: { type: Boolean, default: false },
      examDetails: [
        {
          examName: { type: String, default: null },
          document: { type: String, default: null },
          scores: {
            reading: { type: String, default: null },
            writing: { type: String, default: null },
            speaking: { type: String, default: null },
            listening: { type: String, default: null },
            total: { type: String, default: null },
          },
        },
      ],
      remarks: {
        type: String,
      },
      remarkHistory: {
        type: [coachingRemarkDetailsSchema],
      },
      mockTestDetails: {
        type: [mockTestSchema],
      },
      masterSessionDetails: {
        type: [masterSessionSchema],
      },
      subjectLevelDetails: {
        type: [subjectSchema],
      },
    },
    purposeDetails: {
      type: purposeDetailsSchema,
      default: null,
    },
    agreementByStudent:{
      type: String
    },
    agreementByAgency:{
      type: String
    },
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
    personalDetailsRemarks: {
      type: [personalDetailsRemarkSchema],
      default: [],
    },
    emergencyDetails: {
      type: [emergencyDetailsSchema],
      default: [],
    },
    uploadedDocumentDetails: {
      type: [uploadedDocumentSchema],
      default: [],
    },
    interestedCourseDetails: {
      type: [interestedCourseSchema],
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
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    loanRequired: {
      type: Boolean,
    },
    loanAmount: {
      type: String,
    },
    loanProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "loanProvider",
      default : null
    },
    // universityApplicationDetails: {
    //   type: [universityApplicationSchema],
    //   default: []
    // },
    personalDetailStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicationStatus",
    },
    documentDetailStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicationStatus",
    },
    counsellingDetailStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicationStatus",
    },
    lastUpdatedStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicationStatus",
    },
    mainStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentStatus",
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
      interestedCourse: { type: followUpSchema, default: () => ({}) },
      visaApplication: { type: followUpSchema, default: () => ({}) },
    },
    isSubmit: {
      type: Boolean,
      // default:false
    },
    accountantStatus: {
      type: String,
      // default: false
    },
    universityVerificationSent: {
      type: Boolean,
      default: false,
    },
    universityVerificationDate: {
      type: Date,
      default: null,
    },
    universitySideConfirmation: {
      status: {
        type: Boolean,
        default: false,
      },
      commissionPercentage: {
        type: String,
        default: null,
      },
      commissionAmount: {
        type: String,
        default: null,
      },
      commissionType: {
        type: String,
        default: null,
      },
      confirmedDate: {
        type: Date,
        default: null,
      },
    },
    universitytInvoiceGenerated: {
      status: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        default: null,
      },
    },
    universityPaymentReceived: {
      status: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: String,
        default: null,
      },
      date: {
        type: Date,
        default: null,
      },
      paymentMode: {
        type: String,
      },
      bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankingDetails",
        default: null,
      },
      b2bCommission: {
        commissionPercentage: {
          type: String,
          default: null,
        },
        commissionAmount: {
          type: String,
          default: null,
        },
        commissionType: {
          type: String,
          default: null,
        },
        paymentProcess: {
          type: String,
          default: null,
        },
        paymentMode: {
          type: String,
          default: null,
        },
        bank: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BankingDetails",
          default: null,
        },
      },
    },
    b2bCommissionRemarks: {
      type: String,
      default: "",
    },
    b2bInvoice: {
      number: String,
      date: Date,
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
    CTCCallRecording:{
      type: String,
      default: null
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

studentApplicationSchema.index({
  "purposeDetails.preferredCountry": 1,
});
module.exports = mongoose.model("studentApplication", studentApplicationSchema);
