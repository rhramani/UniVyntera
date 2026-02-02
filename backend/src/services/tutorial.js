const Tutorial = require("../../model/tutorial");
const paginate = require("../../utils/pagination");
const tutorialServices = {
  create: async (data, userId, userName) => {
    const { name } = data;
    const checkExist = await Tutorial.findOne({ name: name });
    if (checkExist) {
      throw { status: false, message: "Tutorial name already exist" };
    }
    const newTutorial = await Tutorial.create({
      ...data,
      created_by: userId,
      createdByName: userName,
    });

    return newTutorial;
  },
  update: async (id, data, userId, userName) => {
    const { name } = data;
    if (name) {
      const checkExist = await Tutorial.findOne({
        name: name,
        _id: { $ne: id },
      });

      if (checkExist) {
        throw { status: false, message: "Tutorial name already exist" };
      }
    }

    const updatedTutorial = await Tutorial.findByIdAndUpdate(
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

    if (!updatedTutorial) {
      throw { status: false, message: "Tutorial not found" };
    }

    return updatedTutorial;
  },

  getAll: async (page, limit, searchText = "") => {
     const searchOptions = {
      searchText,
      searchFields: ["name"],
    };
    const get = await paginate(
      Tutorial,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );
    return get;
  },

  delete: async (id) => {
    const deleted = await Tutorial.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Tutorial not found or already deleted",
      };
    }
    return "Tutorial deleted successfully";
  },
};

module.exports = tutorialServices;
