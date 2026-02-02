const mongoose = require("mongoose");

const aiCallLeadSchema = new mongoose.Schema(
  {
    inquiry_for: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inquiryType",
      default: null,
    },
    intake: {
      type: String,
    },

    source_of_reference: {
      type: String,
    },
    counsellor: {
      type: String,
    },
    dateofbirth: {
      type: Date,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      set: (value) => value?.toLowerCase(),
    },
    phone: {
      type: String,
    },
    alternate_contact: {
      type: String,
    },
    address: {
      type: String,
    },
    country_interested: {
      type: [String],
    },
    course: {
      type: String,
    },
    level: {
      type: String,
    },
    budget: {
      type: String,
    },
    how_much_in_bank: {
      type: String,
    },
    english_proficiency: {
      type: String,
    },
    passport: {
      type: String,
    },
    occupation_father: {
      type: String,
    },
    occupation_mother: {
      type: String,
    },
    education_evaluation: [
      {
        test_name: {
          type: String,
        },
        scores: {
          listen: { type: Number },
          read: { type: Number },
          write: { type: Number },
          speak: { type: Number },
          overall: { type: Number },
          duolingoScore: { type: Number },
        },
      },
    ],
    education_details: [
      {
        degree: {
          type: String,
        },
        stream: {
          type: String,
          default: "NOT APPLICABLE",
        },
        moi: { type: String },
        year: { type: Number },
        score: { type: Number },
        institution: { type: String },
        backlogs: { type: Number, default: 0 },
      },
    ],
    work_experience: {
      type: String,
    },
    work_post: {
      type: String,
    },
    work_year: {
      type: Number,
    },
    visited_countries: {
      type: String,
    },
    visit_count: {
      type: Number,
    },
    visa_type: {
      type: String,
    },
    visa_refused: {
      type: Boolean,
    },
    refused_country: {
      type: String,
    },
    refused_times: {
      type: Number,
    },
    refused_years: {
      type: [Number],
    },
    refused_visa_type: {
      type: String,
    },
    refer_friend: {
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
      email: {
        type: String,
        set: (value) => value?.toLowerCase(),
      },
      suggested_countries: {
        type: String,
      },
      courses: {
        type: String,
      },
      response: {
        type: String,
      },
    },
    reviews: {
      reception_greetings: {
        type: String,
      },
      counsellor_explanation: {
        type: String,
      },
      hospitality: {
        type: String,
      },
      hygiene_cleanliness: {
        type: String,
      },
      team_response: {
        type: String,
      },
    },
    comments: {
      type: String,
    },
    office_use_only: {
      type: String,
    },
    form_type: {
      type: String,
    },
    lead_status: {
      type: String,
      default: "New",
    },
    b2b_lead_status: {
      type: String,
      default: "New",
    },
    lead_form: {
      type: String,
    },
    lead_assign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lead_assign_Branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      default: null,
    },
    lead_role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    next_follow_up: {
      type: Date,
    },
    follow_up_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "leadFollowUpType",
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    nationality: {
      type: String,
    },
    pincode: {
      type: String,
    },
    lead_followup_remark: {
      type: String,
    },
    lead_text_remark: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    remarks: {
      type: String,
    },
    deadLead: {
      type: Boolean,
      default: false,
    },
    b2bCompany: {
      type: String,
    },
    branch: {
      type: String,
    },
    fromB2B: {
      type: Boolean,
      default: false,
    },
    prefferedDegree: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramLevel",
    },
    prefferedCourse: {
      type: String,
    },
    prefferedIntakeMonth: {
      type: String,
    },
    prefferedIntakeYear: {
      type: String,
    },
    voiceAICall: {
      type: Boolean,
    },
    voiceAIRecording: { type: String, default: null },
    voiceAIPdf: { type: String },
    call_in_progress: {
      type: Boolean,
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

module.exports = mongoose.model("AICallLead", aiCallLeadSchema);
