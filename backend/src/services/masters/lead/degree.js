const Degree = require("../../../../model/masters/lead/degree");

const paginate = require("../../../../utils/pagination");

const degreeServices = {
  createDegree: async (data, userId, userName) => {
    const { name } = data;

    const checkDegree = await Degree.findOne({ name });
    if (checkDegree) {
      return { status: false, message: "Degree already exist" };
    }

    const newDegree = await Degree.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newDegree;
  },

  updateDegree: async (degreeId, updateData, userId, userName) => {
    const { name } = updateData;

    const existingDegree = await Degree.findById(degreeId);
    if (!existingDegree) {
      return { status: false, message: "Degree not found" };
    }

    if (name && name.trim() !== existingDegree.name) {
      const duplicate = await Degree.findOne({
        name: name.trim(),
        _id: { $ne: degreeId },
      });
      if (duplicate) {
        return { status: false, message: "Degree already exists" };
      }
    }

    const updatedDegree = await Degree.findByIdAndUpdate(
        degreeId,
      {
        name,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return {
      status: true,
      message: "Degree updated successfully",
      data: updatedDegree,
    };
  },


  getAllDegree: async (page, limit, searchText = "") => {
  
    const searchOptions = { searchText, searchFields: ["name"] };

    const getAll = await paginate(
      Degree,
      {},
      page,
      limit,
      { createdAt: -1 },
      [], 
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No degree found" };
    }

    return getAll;
  },

 
  deleteDegree: async (degreeId) => {
    const degree = await Degree.findByIdAndDelete(degreeId);

    if (!degree) {
      return { status: false, message: "Degree not found" };
    }

    return "Degree deleted successfully";
  },
};

module.exports = degreeServices;
