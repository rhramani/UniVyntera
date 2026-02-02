const Configuration = require("../../model/configuration");

const configurationServices = {
  create: async (data) => {
    const newData = await Configuration.create({
      ...data,
    });

    return newData;
  },
  update: async (updateId, updateData, userId, userName) => {
    const updateFields = {};

    if (updateData.cloudinary) {
      for (const key in updateData.cloudinary) {
        updateFields[`cloudinary.${key}`] = updateData.cloudinary[key];
      }
    }

    if (updateData.nodemailer) {
      for (const key in updateData.nodemailer) {
        updateFields[`nodemailer.${key}`] = updateData.nodemailer[key];
      }
    }

    if (updateData.uniCommissionInvoice) {
      const uniInvoice = updateData.uniCommissionInvoice;
      for (const key in uniInvoice) {
        if (key === "bankDetails" && uniInvoice.bankDetails) {
          for (const bankKey in uniInvoice.bankDetails) {
            updateFields[`uniCommissionInvoice.bankDetails.${bankKey}`] =
              uniInvoice.bankDetails[bankKey];
          }
        } else {
          updateFields[`uniCommissionInvoice.${key}`] = uniInvoice[key];
        }
      }
    }

    if (updateData.b2bInvoice) {
      for (const key in updateData.b2bInvoice) {
        updateFields[`b2binvoice.${key}`] = updateData.b2bInvoice[key];
      }
    }

    if (updateData.applicationFeeInvoice) {
      const appInvoice = updateData.applicationFeeInvoice;
      for (const key in appInvoice) {
        if (key === "bankDetails" && appInvoice.bankDetails) {
          for (const bankKey in appInvoice.bankDetails) {
            updateFields[`applicationFeeInvoice.bankDetails.${bankKey}`] =
              appInvoice.bankDetails[bankKey];
          }
        } else {
          updateFields[`applicationFeeInvoice.${key}`] = appInvoice[key];
        }
      }
    }

    for (const key in updateData) {
      if (
        key !== "cloudinary" &&
        key !== "nodemailer" &&
        key !== "uniCommissionInvoice" &&
        key !== "b2bInvoice" &&
        key !== "applicationFeeInvoice"
      ) {
        updateFields[key] = updateData[key];
      }
    }

    updateFields.updated_by = userId;
    updateFields.updatedByName = userName;

    const newData = await Configuration.findByIdAndUpdate(
      updateId,
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return newData;

  },
  getAll: async () => {
    const result = await Configuration.find();
    return result;
  },
  getVoiceAIConfig: async () => {
    const config = await Configuration.findOne().sort({ createdAt: -1 });
    if (
      !config ||
      !config.voiceAIDetails?.OMNIDIM_API_KEY ||
      !config.voiceAIDetails?.OMNIDIM_BASE_URL
    ) {
      throw new Error("VoiceAI configuration not found in DB");
    }

    return config.voiceAIDetails;
  },
  CTCCredentials: async () => {
    const config = await Configuration.findOne().sort({ createdAt: -1 });

    if(!config || !config.CTCCredentials?.CTC_USERNAME || !config.CTCCredentials?.CTC_PASSWORD)  {
      throw new Error("CTC configuration not found in DB")
    }

    return config.CTCCredentials;
  }
};

module.exports = configurationServices;
