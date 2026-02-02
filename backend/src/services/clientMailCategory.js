const ClientMailCategory = require("../../model/clientMailCategory");

const paginate = require("../../utils/pagination");

const ClientMailCategoryServices = {
  create: async (data, userId, userName) => {
    const { name } = data;
    const checkExist = await ClientMailCategory.findOne({ name });
    if (checkExist) {
      throw { status: false, message: "Client mail category already exist" };
    }

    const newClientMailCategory = await ClientMailCategory.create({
      name,
      created_by: userId,
      createdByName: userName
    });
    return newClientMailCategory;
  },
  update: async (updateId, updateData, userId, userName) => {
    const { name } = updateData;

    const checkExist = await ClientMailCategory.findOne({
      name,
      _id: { $ne: updateId }, // Exclude the current record
    });

    if (checkExist) {
      throw { status: false, message: "Client mail category already exist" };
    }

    const updateRecord = await ClientMailCategory.findByIdAndUpdate(
      updateId,
      { ...updateData,
        updated_by: userId,
        updatedByName: userName
       },
      { new: true }
    );

    return updateRecord;
  },
  getAll: async (page, limit, searchText = "") => {

    const searchOptions = { searchText, searchFields: ["name"] };
    const result = await paginate(
      ClientMailCategory,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    if (!result) {
      throw { status: false, message: "No client mail category found" };
    }

    return result;
  },
  deleteData: async (deleteId) => {
    const deleteClientMailCategory = await ClientMailCategory.findByIdAndDelete(deleteId);

    if (!deleteClientMailCategory) {
      throw { status: false, message: "Client mail category not found" };
    }
    return "Client mail category deleted successfully";
  },
};

module.exports = ClientMailCategoryServices;
