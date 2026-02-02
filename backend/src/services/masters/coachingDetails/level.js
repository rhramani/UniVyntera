const Level = require("../../../../model/masters/coachingDetails/level");
const paginate = require("../../../../utils/pagination");

const studentRegisterForServices = {
  create: async (data, userId, userName) => {
    const { name } = data;
    const nameExist = await Level.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Level already exists",
      };
    }

    const newData = await Level.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },
  update: async (id, data, userId, userName) => {
    const { name } = data;

    const findData = await Level.findById(id);
    if (!findData) {
      throw { status: false, message: "Level not found" };
    }

    if (name) {
      const nameExist = await Level.findOne({
        name,
        _id: { $ne: id },
      });

      if (nameExist) {
        throw {
          status: false,
          message: "Level with this name already exist",
        };
      }
    }

    const updateData = await Level.findByIdAndUpdate(
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
      Level,
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
    const result = await Level.findByIdAndDelete(id);

    if(!result){
      throw {
        status: false,
        message: "Level not found or already deleted"
      }
    }
    return "Level deleted successfully";
  }
};

module.exports = studentRegisterForServices;
