const mongoose = require("mongoose");

const fundTransferSchema = new mongoose.Schema({
    fromType: {
        type: String,
        enum: ["CashToBank" , "BankToCash"],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankingDetails",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    proof: {
        type: String,
        default: null
    },
    remark: {
        type: String,
        default: ""
    },
      created_by: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
       },
       createdByName: {
         type: String
       },
       updated_by: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         default: null,
       },
       updatedByName: {
         type: String,
         default: null
       },
},{
    timestamps: true
});

module.exports = mongoose.model("fundTransfer" , fundTransferSchema);