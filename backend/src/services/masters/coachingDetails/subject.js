const Subject = require("../../../../model/masters/coachingDetails/subject");
const paginate = require("../../../../utils/pagination");

const subjectServices = {
  create: async (data, userId, userName) => {
    const { name } = data;
    const nameExist = await Subject.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Subject already exists",
      };
    }

    const newData = await Subject.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },
  update: async (id, data, userId, userName) => {
    const { name } = data;

    const findData = await Subject.findById(id);
    if (!findData) {
      throw { status: false, message: "Subject not found" };
    }

    if (name) {
      const nameExist = await Subject.findOne({
        name,
        _id: { $ne: id },
      });

      if (nameExist) {
        throw {
          status: false,
          message: "Subject with this name already exist",
        };
      }
    }

    const updateData = await Subject.findByIdAndUpdate(
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
      Subject,
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
    const result = await Subject.findByIdAndDelete(id);

    if(!result){
      throw {
        status: false,
        message: "Subject not found or already deleted"
      }
    }
    return "Subject deleted successfully";
  }
};

module.exports = subjectServices;
