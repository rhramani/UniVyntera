const taskStatus = require("../../../model/taskManagement/taskStatus");

const leadStatusService = {
  create: async (data, userId, userName) => {
    const { name, color } = data;

    // Check if name already exists
    const nameExist = await taskStatus.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Task Status with this name already exists",
      };
    }

    // Check if color already assigned
    const colorExist = await taskStatus.findOne({ color });
    if (colorExist) {
      throw {
        status: false,
        message: "This color is already assigned to another Task Status",
      };
    }

    const newData = await taskStatus.create({
      name,
      color,
      created_by: userId,
      createdByName: userName
    });

    return newData;
  },

  getAll: async (searchText = "") => {
    const query = {};

    if (searchText) {
      query.name = { $regex: searchText, $options: "i" }; 
    }

    const status = await taskStatus.find(query)
      .populate({ path: "created_by", select: "name" })
      .sort({ createdAt: -1 });

    return status;
  },


  getById: async (id) => {
    const taskStatus = await taskStatus.findById(id);
    if (!taskStatus) {
      throw { status: false, message: "Task Status not found" };
    }
    return taskStatus;
  },

  update: async (id, data, userId, userName) => {
    const { name, color } = data;

    const TaskStatus = await taskStatus.findById(id);
    if (!TaskStatus) {
      throw { status: false, message: "Task Status not found" };
    }

    if (name) {
      const nameExist = await taskStatus.findOne({
        name,
        _id: { $ne: id } 
      });
      if (nameExist) {
        throw { status: false, message: "Task Status with this name already exists" };
      }
    }

    if (color) {
      const colorExist = await taskStatus.findOne({
        color,
        _id: { $ne: id } 
      });
      if (colorExist) {
        throw { status: false, message: "This color is already assigned to another Task Status" };
      }
    }

    const updatedTaskStatus = await taskStatus.findByIdAndUpdate(
      id,
      {
        ...data,
        updated_by: userId,
        updatedByName: userName
      },
      { new: true }
    );

    return updatedTaskStatus;
  },


  delete: async (id) => {
    const deleted = await taskStatus.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Task Status not found or already deleted",
      };
    }
    return "Task Status deleted successfully";
  },
};

module.exports = leadStatusService;
