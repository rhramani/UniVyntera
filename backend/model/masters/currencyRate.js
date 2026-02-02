const mongoose = require("mongoose");

const currencyRateSchema = new mongoose.Schema(
    {
        country: {
            type: String
        },
        currencyName: {
            type: String
        },
        currencyCode: {
            type: String
        },
        INRvalue: {
            type: Number
        },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdByName: {
            type: String
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        updatedByName: {
            type: String,
            default: null
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("currencyRate", currencyRateSchema);
