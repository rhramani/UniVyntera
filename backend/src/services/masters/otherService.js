const Other = require("../../../model/masters/otherService");
const paginate = require("../../../utils/pagination");


const other = {
  createOther: async (data, userId, userName) => {
    const { name } = data;

    const checkOther = await Other.findOne({ name });
    if (checkOther) {
      return { status: false, message: "Other already exist" };
    }

    const newOther = await Other.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newOther;
  },

  updateOther: async (otherId, updateData, userId, userName) => {
    const { name } = updateData;

    const existingExam = await Other.findById(otherId);
    if (!existingExam) {
      return { status: false, message: "Other not found" };
    }

    if (name && name.trim() !== existingExam.name) {
      const duplicate = await Other.findOne({
        name: name.trim(),
        _id: { $ne: otherId },
      });
      if (duplicate) {
        return { status: false, message: "Other already exists" };
      }
    }

    const updatedOther = await Other.findByIdAndUpdate(
        otherId,
      {
        name,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return {
      status: true,
      message: "other updated successfully",
      data: updatedOther,
    };
  },


  getAllOther: async (page, limit, searchText = "") => {
  
    const searchOptions = { searchText, searchFields: ["name"] };

    const getAll = await paginate(
      Other,
      {},
      page,
      limit,
      { createdAt: -1 },
      [], 
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No Other found" };
    }

    return getAll;
  },

 
  deleteOther: async (otherId) => {
    const other = await Other.findByIdAndDelete(otherId);

    if (!other) {
      return { status: false, message: "Other not found" };
    }

    return "Other deleted successfully";
  },
};

module.exports = other;