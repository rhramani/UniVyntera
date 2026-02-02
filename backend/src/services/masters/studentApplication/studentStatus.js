const studentStatus = require("../../../../model/masters/studentApplication/studentStatus");

const studentStatusService = {
  create: async (data, userId, userName) => {
    const { name, color } = data;

    // Check if name already exists
    const nameExist = await studentStatus.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Status with this name already exists",
      };
    }

    // Check if color already assigned
    const colorExist = await studentStatus.findOne({ color });
    if (colorExist) {
      throw {
        status: false,
        message: "This color is already assigned to another Status",
      };
    }

    const newStatus = await studentStatus.create({
      name,
      color,
      created_by: userId,
      createdByName: userName
    });

    return newStatus;
  },


  getAll: async (searchText = "") => {
    const query = {};

    if (searchText) {
      query.name = { $regex: searchText, $options: "i" }; // case-insensitive partial match
    }

    const allStatus = await studentStatus.find(query)
      .populate({ path: "created_by", select: "name" })
      .sort({ createdAt: -1 });

    return allStatus;
  },


  getById: async (id) => {
    const status = await studentStatus.findById(id);
    if (!status) {
      throw { status: false, message: "Status not found" };
    }
    return status;
  },

  update: async (id, data, userId, userName) => {
    const { name, color } = data;

    const Status = await studentStatus.findById(id);
    if (!Status) {
      throw { status: false, message: "Status not found" };
    }

    if (name) {
      const nameExist = await studentStatus.findOne({
        name,
        _id: { $ne: id }
      });
      if (nameExist) {
        throw { status: false, message: "Status with this name already exists" };
      }
    }

    if (color) {
      const colorExist = await studentStatus.findOne({
        color,
        _id: { $ne: id }
      });
      if (colorExist) {
        throw { status: false, message: "This color is already assigned to another Status" };
      }
    }

    const updatedStatus = await studentStatus.findByIdAndUpdate(
      id,
      {
        ...data,
        updated_by: userId,
        updatedByName: userName
      },
      { new: true }
    );

    return updatedStatus;
  },

  delete: async (id) => {
    const deleted = await studentStatus.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Status not found or already deleted",
      };
    }
    return "Status deleted successfully";
  },
};

module.exports = studentStatusService;
