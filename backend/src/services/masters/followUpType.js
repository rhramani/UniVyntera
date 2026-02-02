const leadFollowUpType = require("../../../model/masters/lead/followUpType");

const paginate = require("../../../utils/pagination");

const leadFollowUpTypeServices = {
  create: async (data, userId, userName) => {
    const { name } = data;

    const checkType = await leadFollowUpType.findOne({ name });
    if (checkType) {
      throw { status: false, message: "Lead Follow Up Type already exist" };
    }

    const newData = await leadFollowUpType.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },
  update: async (typeId, updateData, userId, userName) => {
    const { name } = updateData;

    const existingType = await leadFollowUpType.findById(typeId);
    if (!existingType) {
      throw { status: false, message: "Lead Follow Up Type not found" };
    }

    if (name && name.trim() !== existingType.name) {
      const duplicate = await leadFollowUpType.findOne({
        name: name.trim(),
        _id: { $ne: typeId },
      });
      if (duplicate) {
        throw { status: false, message: "Lead Follow Up Type already exists" };
      }
    }

    const updatedExam = await leadFollowUpType.findByIdAndUpdate(
      typeId,
      {
        name,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return {
      status: true,
      message: "Lead Follow Up Type updated successfully",
      data: updatedExam,
    };
  },
   getAll: async (page, limit, searchText = "") => {
    
      const searchOptions = { searchText, searchFields: ["name"] };
  
      const getAll = await paginate(
        leadFollowUpType,
        {},
        page,
        limit,
        { createdAt: -1 },
        [], 
        searchOptions
      );
  
      if (!getAll) {
        return { status: false, message: "No Lead Follow Up Type found" };
      }
  
      return getAll;
    },
    deleteData: async (typeId) => {
        const exam = await leadFollowUpType.findByIdAndDelete(typeId);
    
        if (!exam) {
          return { status: false, message: "Lead Follow Up Type not found" };
        }
    
        return "Lead Follow Up Type deleted successfully";
      },
};

module.exports = leadFollowUpTypeServices;
