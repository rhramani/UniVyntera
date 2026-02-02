const mongoose = require("mongoose");

const touristDocumentSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    documents: [
      {
        _id: false,
        type: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "visitorDocumentType",
        },
        documentList: [
          {
            document: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "visitorDocument"
            },
            required: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],

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

module.exports = mongoose.model("touristDocument", touristDocumentSchema);
