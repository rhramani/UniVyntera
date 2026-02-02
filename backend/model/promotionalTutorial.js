const mongoose = require("mongoose");

const promotionalTutorialSchema = new mongoose.Schema({
  country: { type: String, required: true },

 videos: [
    {
      name: { type: String, required: true },
      urls: [
          {
            link: {
              type: String,
              required: true,
            },
          },
        ],
    }
  ],

  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdByName: { type: String },

  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  updatedByName: { type: String, default: null },
}, {
  timestamps: true,
});

module.exports = mongoose.model("PromotionalTutorial", promotionalTutorialSchema);
