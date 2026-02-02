const Requirements = require("../../../model/masters/requirements");

const paginate = require("../../../utils/pagination");

const requirementServices = {
  createRequirement: async (data, userId, userName) => {
    const { name } = data;
    const checkExist = await Requirements.findOne({ name });
    if (checkExist) {
      throw { status: false, message: "Requirement already exist" };
    }

    const newRequirements = await Requirements.create({
      name,
      created_by: userId,
      createdByName: userName
    });
    return newRequirements;
  },

  updateRequirement: async (updateId, updateData, userId, userName) => {
    const { name } = updateData;

    const checkExist = await Requirements.findOne({
      name,
      _id: { $ne: updateId },
    });

    if (checkExist) {
      throw { status: false, message: "Requirements already exist" };
    }

    const update = await Requirements.findByIdAndUpdate(
      updateId,
      { ...updateData,
        updated_by: userId,
        updatedByName: userName
       },
      { new: true }
    );

    return update;
  },
  getAllRequirements: async (page, limit, searchText = "") => {
    const populateFields = [
      { path: "created_by" , select: "name"}
     
    ];
  
    const searchOptions = { searchText, searchFields: ["name"] };
    const getAll = await paginate(
      Requirements,
      {},
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );
    if (!getAll) {
      throw { status: false, message: "No requirements found" };
    }
    return getAll;
  },
  deleteRequirementById: async (deleteId) => {
    const deleteRequirement = await Requirements.findByIdAndDelete(deleteId);

    if (!deleteRequirement) {
      throw { status: false, message: "Program level not found" };
    }
    return "Requirement deleted successfully";
  },
};

module.exports = requirementServices;
