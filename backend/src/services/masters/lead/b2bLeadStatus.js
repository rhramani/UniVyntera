const LeadStatus = require("../../../../model/masters/lead/b2bLeadStatus");

const leadStatusService = {
  create: async (data, userId, userName) => {
    const { name, color } = data;

    // Check if name already exists
    const nameExist = await LeadStatus.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "Lead Status with this name already exists",
      };
    }

    // Check if color already assigned
    const colorExist = await LeadStatus.findOne({ color });
    if (colorExist) {
      throw {
        status: false,
        message: "This color is already assigned to another Lead Status",
      };
    }

    const newLeadStatus = await LeadStatus.create({
      name,
      color,
      created_by: userId,
      createdByName: userName
    });

    return newLeadStatus;
  },

  getAll: async (searchText = "") => {
    const query = {};

    if (searchText) {
      query.name = { $regex: searchText, $options: "i" }; // case-insensitive partial match
    }

    const leadStatuses = await LeadStatus.find(query)
      .populate({ path: "created_by", select: "name" })
      .sort({ createdAt: -1 });

    return leadStatuses;
  },


  getById: async (id) => {
    const leadStatus = await LeadStatus.findById(id);
    if (!leadStatus) {
      throw { status: false, message: "Lead Status not found" };
    }
    return leadStatus;
  },

  update: async (id, data, userId, userName) => {
    const { name, color } = data;

    // Check if LeadStatus with provided ID exists
    const leadStatus = await LeadStatus.findById(id);
    if (!leadStatus) {
      throw { status: false, message: "Lead Status not found" };
    }

    // Check if name is already taken by another LeadStatus
    if (name) {
      const nameExist = await LeadStatus.findOne({
        name,
        _id: { $ne: id } // Exclude the current document
      });
      if (nameExist) {
        throw { status: false, message: "Lead Status with this name already exists" };
      }
    }

    // Check if color is already taken by another LeadStatus
    if (color) {
      const colorExist = await LeadStatus.findOne({
        color,
        _id: { $ne: id } // Exclude the current document
      });
      if (colorExist) {
        throw { status: false, message: "This color is already assigned to another Lead Status" };
      }
    }

    const updatedLeadStatus = await LeadStatus.findByIdAndUpdate(
      id,
      {
        ...data,
        updated_by: userId,
        updatedByName: userName
      },
      { new: true }
    );

    return updatedLeadStatus;
  },


  delete: async (id) => {
    const deleted = await LeadStatus.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Lead Status not found or already deleted",
      };
    }
    return "Lead Status deleted successfully";
  },
};

module.exports = leadStatusService;
