const Settings = require("../../model/settings");
const fs = require("fs");
const path = require("path");

const settingServices = {
  create: async (data) => {
    return await Settings.create(data);
  },
  update: async (updateId, updateData) => {
    return await Settings.findByIdAndUpdate(updateId, updateData, {
      new: true,
    });
  },
  getAll: async () => {
    return await Settings.find();
  },
  delete: async (deleteId) => {
    const setting = await Settings.findById(deleteId);

    if (!setting) {
      throw { status: false, message: "Setting not found" };
    }

    // Fields you want to delete from public folder
    const imageFields = ["logo", "loginPageLogo"];

    imageFields.forEach((field) => {
      if (setting[field]) {
        const imagePath = path.join(__dirname, "../../public", setting[field]);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    await Settings.findByIdAndDelete(deleteId);
    return "Data deleted successfully";
  },
};

module.exports = settingServices;
