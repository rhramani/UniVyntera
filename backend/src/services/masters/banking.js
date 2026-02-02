
const paginate = require("../../../utils/pagination");
const Banking = require("../../../model/masters/banking");

const bankingServices = {
  create: async (data, userId, userName) => {
    const {
      bankName,
      accountType,
      accountNumber,
      bankAddress,
      ifscCode,
      swiftCode,
    } = data;
    const existing = await Banking.findOne({ bankName, accountNumber });

    if (existing) {
      throw "Banking details already exist with this bank name and account number";
    }

    const newBanking = await Banking.create({
      bankName,
      accountType,
      accountNumber,
      bankAddress,
      ifscCode,
      swiftCode,
      created_by: userId,
      createdByName: userName,
    });

    return newBanking;
  },
  update: async (updateId, updateData, userId, userName) => {
    const { bankName, accountNumber } = updateData;
    const existingBanking = await Banking.findById(updateId);

    if (!existingBanking) {
      throw "Banking details not found";
    }

    if (
      (bankName && bankName.trim() !== existingBanking.bankName) ||
      (accountNumber && accountNumber.trim() !== existingBanking.accountNumber)
    ) {
      const duplicate = await Banking.findOne({
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        _id: { $ne: updateId },
      });
      if (duplicate) {
        throw { status: false, message: "Banking details already exist with this bank name and account number" };
      }
    }

    const updatedData = {
      ...updateData,
      updated_by: userId,
      updatedByName: userName,
    };

    const updatedBanking = await Banking.findByIdAndUpdate(
      updateId,
      updatedData,
      { new: true }
    );

    return updatedBanking;
  },

  getAll: async (page, limit, searchText = "") => {
    const searchOptions = { searchText, searchFields: ["bankName", "accountType"] };

    const getAll = await paginate(
      Banking,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    if (!getAll) {
      throw { status: false, message: "No Banking details found" };
    }

    return getAll;
  },
  delete: async (deleteId) => {
    const doc = await Banking.findByIdAndDelete(deleteId);

    if (!doc) {
      throw { status: false, message: "Banking details not found" };
    }

    return "Banking details deleted successfully";
  },
};

module.exports = bankingServices;
