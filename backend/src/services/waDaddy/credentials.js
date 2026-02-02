const credential = require("../../../model/waDaddy/credentials");

const credentialServices = {
  create: async (data, userId, userName) => {
    const newData = await credential.create({
      ...data,
      created_by: userId,
      createdByName: userName,
    });
    return newData;
  },
  update: async (updateId, updateData, userId, userName) => {
    const updateLevel = await credential.findByIdAndUpdate(
      updateId,
      { ...updateData, updatedBy: userId, updatedByName: userName },
      { new: true }
    );

    return updateLevel;
  },
  getAll: async () => {
    const result = await credential.find();
    return result;
  },
};

module.exports = credentialServices;
