const mongoose = require("mongoose");

const accountExpensesSchema = new mongoose.Schema(
  {
    center: {
      type: String,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "expenseType",
    },
    mode: {
      type: String,
    },
    amount: {
      type: String,
    },
    date: {
      type: Date,
    },
    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankingDetails",
      default: null,
    },
    proof: {
      type: String,
    },
    remarks: {
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
    timestamps: true,
  }
);

module.exports = mongoose.model("AccountExpense", accountExpensesSchema);
