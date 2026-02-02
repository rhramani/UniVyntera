const mongoose = require("mongoose");
const LeadStatus = require("../../model/leadStatus")
const LeadSubStatus = require("../../model/leadSubStatus");

const paginate = require("../../utils/pagination");

const leadSubStatusServices = {
  create: async (data, userId, userName) => {
  const { mainTab, name, color } = data;

  if (!mainTab || !name) {
    throw {
      status: false,
      message: "Main tab and status name are required.",
    };
  }

  const trimmedName = name.trim();
  const trimmedColor = color ? color.trim() : null;

  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(mainTab)) {
    throw { status: false, message: "Invalid mainTab ID" };
  }

  // ✅ Check duplicate name under same main tab
  const existingNameInTab = await LeadSubStatus.findOne({
    mainTab,
    name: trimmedName,
  });

  if (existingNameInTab) {
    throw {
      status: false,
      message: "A status with this name already exists under this main tab.",
    };
  }

  // ✅ Check for duplicate color
  if (trimmedColor) {
    const existingColor = await LeadSubStatus.findOne({ color: trimmedColor });
    if (existingColor) {
      throw {
        status: false,
        message: "This color is already assigned to another status.",
      };
    }
  }

  // ✅ Create new sub-status
  const newStatus = await LeadSubStatus.create({
    mainTab,
    name: trimmedName,
    color: trimmedColor,
    created_by: userId,
    createdByName: userName,
  });

  // ✅ Populate mainTab name when returning
  return await newStatus.populate("mainTab", "name");
},

  update: async (id, updateData, userId, userName) => {
  const { name, mainTab, color } = updateData;

  const existing = await LeadSubStatus.findById(id);
  if (!existing) {
    throw { status: false, message: "Lead sub status not found" };
  }

  const newMainTab = mainTab || existing.mainTab;
  const newName = name?.trim() || existing.name;
  const newColor = color?.trim() || existing.color;

  if (!mongoose.Types.ObjectId.isValid(newMainTab)) {
    throw { status: false, message: "Invalid mainTab ID" };
  }

  // ✅ Duplicate checks
  const existingNameInTab = await LeadSubStatus.findOne({
    _id: { $ne: id },
    mainTab: newMainTab,
    name: newName,
  });

  if (existingNameInTab) {
    throw {
      status: false,
      message: "A status with this name already exists under this main tab.",
    };
  }

  if (newColor) {
    const existingColor = await LeadSubStatus.findOne({
      _id: { $ne: id },
      color: newColor,
    });

    if (existingColor) {
      throw {
        status: false,
        message: "This color is already assigned to another status.",
      };
    }
  }

  const updatedStatus = await LeadSubStatus.findByIdAndUpdate(
    id,
    {
      mainTab: newMainTab,
      name: newName,
      color: newColor,
      updated_by: userId,
      updatedByName: userName,
    },
    { new: true }
  ).populate("mainTab", "name");

  return {
    status: true,
    message: "Lead sub status updated successfully",
    data: updatedStatus,
  };
},

// getOne: async (mainTabId) => {
//   if (!mainTabId) {
//     throw { status: false, message: "mainTab ID is required" };
//   }

//   if (!mongoose.Types.ObjectId.isValid(mainTabId)) {
//     throw { status: false, message: "Invalid mainTab ID" };
//   }

//   const statuses = await LeadSubStatus.find(
//     { mainTab: mainTabId },
//     { _id: 1, name: 1, color: 1 }
//   ).populate("mainTab", "name");

//   if (!statuses || statuses.length === 0) {
//     throw { status: false, message: "Lead sub statuses not found" };
//   }

//   return statuses;
// },
  getOne: async (mainTab) => {
  if (!mainTab) {
    throw { status: false, message: "mainTab is required" };
  }

  // Check if mainTab is a valid ObjectId
  let mainTabId = mainTab.trim();
  if (!mongoose.Types.ObjectId.isValid(mainTabId)) {
    // If not valid ObjectId, find LeadStatus by name
    const leadStatus = await LeadStatus.findOne({ name: mainTab.trim() });
    if (!leadStatus) {
      throw { status: false, message: "Lead Status not found" };
    }
    mainTabId = leadStatus._id;
  }

  const statuses = await LeadSubStatus.find(
    { mainTab: mainTabId },
    { _id: 1, name: 1 }
  );

  if (!statuses || statuses.length === 0) {
    throw { status: false, message: "Lead SubStatus not found" };
  }

  return statuses;
}
,

  getAll: async (page, limit, searchText = "") => {
    const searchOptions = { searchText, searchFields: ["name", "mainTab"] };

    const getAll = await paginate(
      LeadSubStatus,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    )

    if (!getAll) {
      throw { status: false, message: "Application status not found" }
    }

    return getAll;
  },
  delete: async (id) => {
    const deleteRecord = await LeadSubStatus.findByIdAndDelete(id);
    if (!deleteRecord) {
      throw { status: false, message: "Application status not found" }
    }

    return "Application status deleted successfully";
  }
}

module.exports = leadSubStatusServices;