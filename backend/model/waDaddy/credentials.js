const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    facebookAppId : { type: String },
    registerdPhoneNumber : { type: String },
    phoneNumberId : { type: String } , 
    wbaId: { type: String },
    accessToken: {type: String},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedByName: { type: String }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("wadaddycredentials", credentialSchema);
