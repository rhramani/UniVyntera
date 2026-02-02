const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      default: null,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dueDate: {
      type: Date,
    },
    dueTime: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskCategory",
      default: null,
    },
    priority: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskPriority",
      default: null,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskType",
      default: null,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskStatus",
      default: null,
    },
    document: {
      type: String
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

module.exports = mongoose.model("task", taskSchema);
