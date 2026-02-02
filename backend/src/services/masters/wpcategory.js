const WpCategory = require("../../../model/masters/wpcategory");

const paginate = require("../../../utils/pagination");

const wpCategoryServices = {
  create: async (data, userId, userName) => {
    const { name } = data;

    const checkExist = await WpCategory.findOne({ name });
    if (checkExist) {
      throw { status: false, message: "Category already exist" };
    }

    const newData = await WpCategory.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },

  update: async (id, updateData, userId, userName) => {
    const { name } = updateData;

    const existing = await WpCategory.findById(id);
    if (!existing) {
      return { status: false, message: "Category not found" };
    }

    if (name && name.trim() !== existing.name) {
      const duplicate = await WpCategory.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });
      if (duplicate) {
        return { status: false, message: "Category already exists" };
      }
    }

    const updatedData = await WpCategory.findByIdAndUpdate(
      id,
      {
        name,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return {
      status: true,
      message: "Category updated successfully",
      data: updatedData,
    };
  },

  getById: async (categoryId) => {
    const getone = await WpCategory.findById(categoryId);

    if (!getone) {
      throw { status: false, message: "Category not found" };
    }

    return getone;
  },

  getAll: async (page, limit, searchText = "") => {
  
    const searchOptions = { searchText, searchFields: ["name"] };
    const getAll = await paginate(
      WpCategory,
      {},
      page,
      limit,
      { createdAt: -1 },
      [], 
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No Category found" };
    }

    return getAll;
  },
  deleteOne: async (id) => {
    const deleteId = await WpCategory.findByIdAndDelete(id);

    if(!deleteId){
        throw { status: false , message: "Category not found"}
    }
    return "Category deleted successfully";
  }
}

module.exports = wpCategoryServices;