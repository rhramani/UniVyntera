const mongoose = require("mongoose");

const universalVisaFlowSchema = new mongoose.Schema(
  {
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
  },
  {
    _id: false,
  }
);

module.exports = universalVisaFlowSchema;
