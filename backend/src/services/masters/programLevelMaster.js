const ProgramLevel = require("../../../model/masters/programLevel");

const paginate = require("../../../utils/pagination");

const programLevelServices = {
  createProgramLevel: async (data, userId, userName) => {
    const { name } = data;
    const checkExist = await ProgramLevel.findOne({ name });
    if (checkExist) {
      throw { status: false, message: "Program Level already exist" };
    }

    const newProgramLevel = await ProgramLevel.create({
      name,
      created_by: userId,
      createdByName: userName
    });
    return newProgramLevel;
  },
  updateProgramLevel: async (updateId, updateData, userId, userName) => {
    const { name } = updateData;

    const checkExist = await ProgramLevel.findOne({
      name,
      _id: { $ne: updateId }, // Exclude the current record
    });

    if (checkExist) {
      throw { status: false, message: "Program Level already exist" };
    }

    const updateLevel = await ProgramLevel.findByIdAndUpdate(
      updateId,
      { ...updateData,
        updated_by: userId,
        updatedByName: userName
       },
      { new: true }
    );

    return updateLevel;
  },
  getAll: async (page, limit, searchText = "") => {
    const populateFields = [
      { path: "created_by" , select: "name"}
    ];
  
    const searchOptions = { searchText, searchFields: ["name"] };
    const result = await paginate(
      ProgramLevel,
      {},
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!result) {
      throw { status: false, message: "No program level found" };
    }

    return result;
  },
  deleteProgramLevelById: async (deleteId) => {
    const deleteProgramLevel = await ProgramLevel.findByIdAndDelete(deleteId);

    if (!deleteProgramLevel) {
      throw { status: false, message: "Program level not found" };
    }
    return "Program level deleted successfully";
  },
};

module.exports = programLevelServices;
