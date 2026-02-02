const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    download: { type: Boolean, default: false },
    upload: { type: Boolean, default: false },
  },
  { _id: false }
);

const tabSchema = new mongoose.Schema(
  {
    tabName: { type: String, required: true },
    permissions: permissionSchema,
    show: { type: Boolean, default: false },
    children: [this], // Recursive for nested tabs
    sections: [
      {
        tabName: { type: String, required: true },
        show: { type: Boolean, default: true },
        permissions: permissionSchema,
        subsections: [
          {
            tabName: { type: String, required: true },
            show: { type: Boolean, default: false },
            permissions: permissionSchema,
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          },
        ], // New field for subsections (e.g., document types)
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      },
    ],
  },
  { _id: true }
);

tabSchema.add({ children: [tabSchema] });

const rolePermissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    branchId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      required: false
    },
    tabs: [tabSchema],
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedByName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RolePermission", rolePermissionSchema);