const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    dashboardLogo: {
        type:String
    },
    dashboardLogoPublicId:{
      type: String
    },
    dashboardLogoResource:{
      type: String
    },
    loginPageLogo: {
        type: String
    },
    loginPageLogoPublicId:{
      type: String
    },
    loginPageLogoResource:{
      type: String
    },
    logoSize: {
      type: String
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: {
      type: String
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default : null
    },
    updatedByName: {
      type: String,
      default : null
    },
},{
    timestamps: true
});

module.exports = mongoose.model('setting' , settingsSchema);
