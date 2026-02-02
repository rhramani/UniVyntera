const CrmSettings = require("../../model/crmSettings");
const fs = require("fs");
const path = require("path");

const crmSettingServices = {
  create: async (data) => {
    return await CrmSettings.create(data);
  },
  update: async (updateData) => {
    return await CrmSettings.updateOne(
    {},                 // Match any (since only one settings doc exists)
    { $set: updateData },     // Set/overwrite the fields from data
    { upsert: true, new: true } // Create if not exists
  );
  },
  getAll: async () => {
    return await CrmSettings.find();
  },
  delete: async (deleteId) => {
    const setting = await CrmSettings.findById(deleteId);

    if (!setting) {
      throw { status: false, message: "Setting not found" };
    }

    await CrmSettings.findByIdAndDelete(deleteId);
    return "Data deleted successfully";
  },
};

module.exports = crmSettingServices;
