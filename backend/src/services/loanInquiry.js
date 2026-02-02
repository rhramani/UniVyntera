const mongoose = require("mongoose");
const LoanInquiry = require("../../model/loanInquiry");

const paginate = require("../../utils/pagination");

const loanInquiryService = {
  create: async (data) => {
    const { studentName, email } = data;

    //  Check for duplicate by name + email
    const existing = await LoanInquiry.findOne({
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
    });

    if (existing) {
      throw new Error(
        "Loan inquiry with this student name and email already exists."
      );
    }

    const newInquiry = await LoanInquiry.create(data);
    return newInquiry;
  },

  update: async (id, data, userId, userName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Loan Inquiry ID");
    }

    const existing = await LoanInquiry.findById(id);
    if (!existing) {
      throw new Error("Loan inquiry not found");
    }

    // Check for duplicate studentName + studentEmail in OTHER documents
    if (data.studentName && data.email) {
      const duplicate = await LoanInquiry.findOne({
        _id: { $ne: id },
        studentName: data.studentName.trim(),
        email: data.email.trim().toLowerCase(),
      });

      if (duplicate) {
        throw new Error(
          "Another loan inquiry with this student name and email already exists."
        );
      }
    }

    const updatePayload = {
      ...data,
      updated_by: userId,
      updatedByName: userName,
    };

    // Perform update
    const updated = await LoanInquiry.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return updated;
  },

  getAll: async (page, limit, searchText = "",  startDate, endDate) => {
    const searchOptions = {
      searchText,
      searchFields: ["studentName", "country"],
    };

    let filter  = {};
    if(startDate && endDate){
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setUTCHours(0,0,0,0);
      end.setHours(23, 59, 59, 999);

      filter.followup = {
        $gte: start,
        $lte: end
      }
    }


    const getAll = await paginate(
      LoanInquiry,
      filter,
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    if (!getAll || getAll.totalRecords === 0) {
      throw { status: false, message: "No loan inquiry found" };
    }

    return getAll;
  },

  getById: async (id) => {
    const status = await LoanInquiry.findById(id);
    if (!status) {
      throw { status: false, message: "loan inquiry not found" };
    }
    return status;
  },

  delete: async (id) => {
    const deleted = await LoanInquiry.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Loan inquiry not found or already deleted",
      };
    }
    return "Loan inquiry deleted successfully";
  },
};

module.exports = loanInquiryService;
