const applicationType = require("../../../../model/masters/studentApplication/applicationType");

const paginate = require("../../../../utils/pagination");

const inquiryServices = {
  create: async (data, userId, userName) => {
    const { name } = data;

    const checkApplicationType = await applicationType.findOne({ name });
    if (checkApplicationType) {
      return { status: false, message: "applicationType already exist" };
    }

    const newData = await applicationType.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },

  update: async (id, updateData, userId, userName) => {
    const { name } = updateData;

    const existingType = await applicationType.findById(id);
    if (!existingType) {
      return { status: false, message: "applicationType not found" };
    }

    if (name && name.trim() !== existingType.name) {
      const duplicate = await applicationType.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });
      if (duplicate) {
        return { status: false, message: "applicationType already exists" };
      }
    }

    const updatedInquiry = await applicationType.findByIdAndUpdate(
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
      message: "applicationType updated successfully",
      data: updatedInquiry,
    };
  },


  getAll: async (page, limit, searchText = "") => {
  
    const searchOptions = { searchText, searchFields: ["name"] };

    const getAll = await paginate(
      applicationType,
      {},
      page,
      limit,
      { createdAt: -1 },
      [], 
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No applicationType found" };
    }

    return getAll;
  },

 
  deleted: async (inquiryId) => {
    const inquiry = await applicationType.findByIdAndDelete(inquiryId);

    if (!inquiry) {
      return { status: false, message: "applicationType not found" };
    }

    return "applicationType deleted successfully";
  },
};

module.exports = inquiryServices;
