const TaskPriority = require("../../../model/taskManagement/taskPriority");

const paginate = require("../../../utils/pagination");

const taskPriorityServices = {
  create: async (data, userId, userName) => {
    const { name } = data;

    const checkExist = await TaskPriority.findOne({ name });
    if (checkExist) {
      throw { status: false, message: "Task priority already exist" };
    }

    const newData = await TaskPriority.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },
  update: async (id, updateData, userId, userName) => {
    const { name } = updateData;

    const checkExist = await TaskPriority.findById(id);
    if (!checkExist) {
      throw { status: false, message: "Task priority not found" };
    }

    const trimmedName = name?.trim();

    if (trimmedName && trimmedName !== checkExist.name) {
      const query = {
        name: trimmedName,
        _id: { $ne: id },
      };

      const duplicate = await TaskPriority.findOne(query);
      if (duplicate) {
        throw { status: false, message: "Task priority already exists" };
      }
    }

    const updatedData = await TaskPriority.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return updatedData;
  },

  getAll: async (page, limit, searchText = "") => {
    const searchOptions = { searchText, searchFields: ["name"] };
    const getAll = await paginate(
      TaskPriority,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No task priority found" };
    }

    return getAll;
  },

  deletePriority: async (id) => {
    const deleteData = await TaskPriority.findByIdAndDelete(id);

    if (!deleteData) {
      throw { status: false, message: "Task priority not found" };
    }

    return "Task priority deleted successfully";
  },
};

module.exports = taskPriorityServices;
