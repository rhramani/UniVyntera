const Inquiry = require("../../../../model/masters/lead/inquiry");

const paginate = require("../../../../utils/pagination");

const inquiryServices = {
  createInquiry: async (data, userId, userName) => {
    const { name } = data;

    const checkInquiry = await Inquiry.findOne({ name });
    if (checkInquiry) {
      return { status: false, message: "Inquiry already exist" };
    }

    const newInquiry = await Inquiry.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newInquiry;
  },

  updateInquiry: async (inquiryId, updateData, userId, userName) => {
    const { name } = updateData;

    const existingExam = await Inquiry.findById(inquiryId);
    if (!existingExam) {
      return { status: false, message: "Inquiry not found" };
    }

    if (name && name.trim() !== existingExam.name) {
      const duplicate = await Inquiry.findOne({
        name: name.trim(),
        _id: { $ne: inquiryId },
      });
      if (duplicate) {
        return { status: false, message: "Inquiry already exists" };
      }
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
        inquiryId,
      {
        name,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return {
      status: true,
      message: "Inquiry updated successfully",
      data: updatedInquiry,
    };
  },


  getAllInquiry: async (page, limit, searchText = "") => {
  
    const searchOptions = { searchText, searchFields: ["name"] };

    const getAll = await paginate(
      Inquiry,
      {},
      page,
      limit,
      { createdAt: -1 },
      [], 
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No Inquiry found" };
    }

    return getAll;
  },

 
  deleteInquiry: async (inquiryId) => {
    const inquiry = await Inquiry.findByIdAndDelete(inquiryId);

    if (!inquiry) {
      return { status: false, message: "Inquiry not found" };
    }

    return "Inquiry deleted successfully";
  },
};

module.exports = inquiryServices;
