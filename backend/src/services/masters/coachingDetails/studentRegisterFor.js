const studentRegisterFor = require("../../../../model/masters/coachingDetails/studentRegisterFor");
const paginate = require("../../../../utils/pagination");

const studentRegisterForServices = {
  create: async (data, userId, userName) => {
    const { name } = data;
    const nameExist = await studentRegisterFor.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Student register for already exists",
      };
    }

    const newData = await studentRegisterFor.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },
  update: async (id, data, userId, userName) => {
    const { name } = data;

    const findData = await studentRegisterFor.findById(id);
    if (!findData) {
      throw { status: false, message: "Student register for not found" };
    }

    if (name) {
      const nameExist = await studentRegisterFor.findOne({
        name,
        _id: { $ne: id },
      });

      if (nameExist) {
        throw {
          status: false,
          message: "Student register for with this name already exist",
        };
      }
    }

    const updateData = await studentRegisterFor.findByIdAndUpdate(
      id,
      {
        ...data,
        updated_by: userId,
        updatedByName: userName,
      },
      {
        new: true,
      }
    );

    return updateData;
  },
  getAll: async (page, limit, searchText = "") => {
    const searchOptions = { searchText, searchFields: ["name"] };

    const result = await paginate(
      studentRegisterFor,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );
    return result;
  },
  deleteData: async (id) => {
    const result = await studentRegisterFor.findByIdAndDelete(id);

    if(!result){
      throw {
        status: false,
        message: "Student register for not found or already deleted"
      }
    }
    return "Student register for deleted successfully";
  }
};

module.exports = studentRegisterForServices;
