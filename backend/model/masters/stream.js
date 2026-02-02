const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema({
    qualification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Qualification",
        required: true 
    },
    stream : {
        type: String,
        required: true
    },
    created_by : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Stream" , streamSchema);