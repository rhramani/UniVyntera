const Exam = require("../../../../model/masters/lead/exam");

const paginate = require("../../../../utils/pagination");

const examServices = {
  createExam: async (data, userId, userName) => {
    const { name } = data;

    const checkExam = await Exam.findOne({ name });
    if (checkExam) {
      throw { status: false, message: "Exam already exist" };
    }

    const newExam = await Exam.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newExam;
  },

  updateExam: async (examId, updateData, userId, userName) => {
    const { name } = updateData;

    const existingExam = await Exam.findById(examId);
    if (!existingExam) {
      throw { status: false, message: "Exam not found" };
    }

    if (name && name.trim() !== existingExam.name) {
      const duplicate = await Exam.findOne({
        name: name.trim(),
        _id: { $ne: examId },
      });
      if (duplicate) {
        throw { status: false, message: "Exam already exists" };
      }
    }

    const updatedExam = await Exam.findByIdAndUpdate(
        examId,
      {
        name,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return {
      status: true,
      message: "Exam updated successfully",
      data: updatedExam,
    };
  },


  getAllExam: async (page, limit, searchText = "") => {
  
    const searchOptions = { searchText, searchFields: ["name"] };

    const getAll = await paginate(
      Exam,
      {},
      page,
      limit,
      { createdAt: -1 },
      [], 
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No Exam found" };
    }

    return getAll;
  },

 
  deleteExam: async (examId) => {
    const exam = await Exam.findByIdAndDelete(examId);

    if (!exam) {
      return { status: false, message: "Exam not found" };
    }

    return "Exam deleted successfully";
  },
};

module.exports = examServices;
