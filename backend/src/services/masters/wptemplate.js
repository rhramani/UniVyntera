const WpTemplate = require("../../../model/masters/wptemplate");

const paginate = require("../../../utils/pagination");

const wpTemplateService = {
create: async (data, userId, userName) => {
  const { category, type } = data;

  if (!category || !type) {
    throw { status: false, message: "Both category and type are required" };
  }

  // Check if a template with this category already exists
  const exists = await WpTemplate.findOne({ category, type: { $regex: new RegExp(`^${type}$`, "i") } });

  if (exists) {
    throw { status: false, message: "Template with this category and type already exists" };
  }

  // Proceed to create the template
  const newData = await WpTemplate.create({
    ...data,
    created_by: userId,
    createdByName: userName,
  });

  return newData;
},
update: async (id, updateData, userId, userName) => {
  const { category, type } = updateData;

  const existing = await WpTemplate.findById(id);
  if (!existing) {
    return { status: false, message: "Template not found" };
  }

  // If category or type is being changed, check for duplicates
  if (
    (category && category.toString() !== existing.category.toString()) ||
    (type && type.trim().toLowerCase() !== (existing.type || "").trim().toLowerCase())
  ) {
    const duplicate = await WpTemplate.findOne({
      _id: { $ne: id },
      category: category || existing.category,
      type: { $regex: new RegExp(`^${type || existing.type}$`, "i") },
    });

    if (duplicate) {
      return { status: false, message: "Another template with this category and type already exists" };
    }
  }

  const updatedData = await WpTemplate.findByIdAndUpdate(
    id,
    {
      ...updateData,
      updated_by: userId,
      updatedByName: userName,
    },
    { new: true }
  );

  return {
    status: true,
    message: "Template updated successfully",
    data: updatedData,
  };
}

,

  getById: async (id) => {
    const getone = await WpTemplate.findById(id);

    if (!getone) {
      throw { status: false, message: "Template not found" };
    }

    return getone;
  },

 getAll: async (page, limit, searchText = "", category = null) => {
  const filter = {};

  // If category ID is provided, add to filter
  if (category) {
    filter.category = category;
  }

  const searchOptions = { searchText, searchFields: ["type"] };
  const populateFields = [
    { path: "category", select: "name" }
  ];

  const getAll = await paginate(
    WpTemplate,
    filter,
    page,
    limit,
    { createdAt: -1 },
    populateFields,
    searchOptions
  );

  if (!getAll) {
    return { status: false, message: "No Template found" };
  }

  return getAll;
},

  deleteOne: async (id) => {
    const deleteId = await WpTemplate.findByIdAndDelete(id);

    if(!deleteId){
        throw { status: false , message: "Template not found"}
    }
    return "Template deleted successfully";
  }
}

module.exports = wpTemplateService;