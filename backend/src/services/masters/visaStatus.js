const VisaStatus = require("../../../model/masters/visaStatus");

const visaStatusServices = {
  create: async (data, userId, userName) => {
    const { name, color } = data;

    const nameExist = await VisaStatus.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Status with this name already exists",
      };
    }

    const colorExist = await VisaStatus.findOne({ color });
    if (colorExist) {
      throw {
        status: false,
        message: "This color is already assigned to another status",
      };
    }

    const newStatus = await VisaStatus.create({
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

    const allStatus = await VisaStatus.find(query)
      .populate({ path: "created_by", select: "name" })
      .sort({ createdAt: -1 });

    return allStatus;
  },

  getById: async (id) => {
    const status = await VisaStatus.findById(id);
    if (!status) {
      throw { status: false, message: "Status not found" };
    }
    return status;
  },


  update: async (id, data, userId, userName) => {
    const { name, color } = data;

    const Status = await VisaStatus.findById(id);
    if (!Status) {
      throw { status: false, message: "Status not found" };
    }

    if (name) {
      const nameExist = await VisaStatus.findOne({
        name,
        _id: { $ne: id }
      });
      if (nameExist) {
        throw { status: false, message: "Status with this name already exists" };
      }
    }

    if (color) {
      const colorExist = await VisaStatus.findOne({
        color,
        _id: { $ne: id }
      });
      if (colorExist) {
        throw { status: false, message: "This color is already assigned to another Status" };
      }
    }

    const updatedStatus = await VisaStatus.findByIdAndUpdate(
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
    const deleted = await VisaStatus.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Status not found or already deleted",
      };
    }
    return "Status deleted successfully";
  },
};

module.exports = visaStatusServices;
