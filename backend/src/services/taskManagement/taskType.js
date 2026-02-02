const TaskType = require("../../../model/taskManagement/taskType");

const paginate = require("../../../utils/pagination");

const taskTypeSerices = {
  create: async (data, userId, userName) => {
    const { name } = data;

    const checkExist = await TaskType.findOne({ name });
    if (checkExist) {
      throw { status: false, message: "Task type already exist" };
    }

    const newData = await TaskType.create({
      name,
      created_by: userId,
      createdByName: userName,
    });

    return newData;
  },
  update: async (id, updateData, userId, userName) => {
    const { name } = updateData;

    const checkExist = await TaskType.findById(id);
    if (!checkExist) {
      throw { status: false, message: "Task type not found" };
    }

    const trimmedName = name?.trim();

    if (trimmedName && trimmedName !== checkExist.name) {
      const query = {
        name: trimmedName,
        _id: { $ne: id },
      };

      const duplicate = await TaskType.findOne(query);
      if (duplicate) {
        throw { status: false, message: "Task type already exists" };
      }
    }

    const updatedData = await TaskType.findByIdAndUpdate(
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
      TaskType,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No task type found" };
    }

    return getAll;
  },

  deleteType: async (id) => {
    const expenseType = await TaskType.findByIdAndDelete(id);

    if (!expenseType) {
      throw { status: false, message: "Task type not found" };
    }

    return "Task type deleted successfully";
  },
};

module.exports = taskTypeSerices;
