const mongoose = require("mongoose");

const applicationTrackingSchema = new mongoose.Schema({
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    refType: {
        type: String,
        enum: ["Lead", "StudentApplication"],
        required: true
    },
    action: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    changes: mongoose.Schema.Types.Mixed,
    tabName: {
        type: String,
        default: null
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    }
})

module.exports = mongoose.model("ApplicationTracking", applicationTrackingSchema);