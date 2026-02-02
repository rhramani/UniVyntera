const InterestedCourseStatus = require("../../../../model/masters/studentApplication/interestedCourseStatus");

const interestedCourseStatusServices = {
  create: async (data, userId, userName) => {
    const { name, color } = data;

    // Check if name already exists
    const nameExist = await InterestedCourseStatus.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Status with this name already exists",
      };
    }

    // Check if color already assigned
    const colorExist = await InterestedCourseStatus.findOne({ color });
    if (colorExist) {
      throw {
        status: false,
        message: "This color is already assigned to another Status",
      };
    }

    const newStatus = await InterestedCourseStatus.create({
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
      query.name = { $regex: searchText, $options: "i" }; // case-insensitive match
    }

    const allStatus = await InterestedCourseStatus.find(query)
      .populate({ path: "created_by", select: "name" })
      .sort({ createdAt: -1 });

    return allStatus;
  },


  getById: async (id) => {
    const status = await InterestedCourseStatus.findById(id);
    if (!status) {
      throw { status: false, message: "Status not found" };
    }
    return status;
  },


  update: async (id, data, userId, userName) => {
    const { name, color } = data;

    const Status = await InterestedCourseStatus.findById(id);
    if (!Status) {
      throw { status: false, message: "Status not found" };
    }

    if (name) {
      const nameExist = await InterestedCourseStatus.findOne({
        name,
        _id: { $ne: id }
      });
      if (nameExist) {
        throw { status: false, message: "Status with this name already exists" };
      }
    }

    if (color) {
      const colorExist = await InterestedCourseStatus.findOne({
        color,
        _id: { $ne: id }
      });
      if (colorExist) {
        throw { status: false, message: "This color is already assigned to another Status" };
      }
    }

    const updatedStatus = await InterestedCourseStatus.findByIdAndUpdate(
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
    const deleted = await InterestedCourseStatus.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Status not found or already deleted",
      };
    }
    return "Status deleted successfully";
  },
};

module.exports = interestedCourseStatusServices;
