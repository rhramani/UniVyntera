const loanProvider = require("../../../../model/masters/studentApplication/loanProvider");
const paginate = require("../../../../utils/pagination");

const loanProviderService = {
  create: async (data, userId, userName) => {
    const { name, contact } = data;

    // Check if name already exists
    const nameExist = await loanProvider.findOne({ name });
    if (nameExist) {
      throw {
        status: false,
        message: "loan provider with this name already exists",
      };
    }

    const contactExist = await loanProvider.findOne({ contact });
    if (contactExist) {
      throw {
        status: false,
        message: "This contact is already assigned to another provider",
      };
    }

    const newStatus = await loanProvider.create({
      name,
      contact,
      created_by: userId,
      createdByName: userName
    });

    return newStatus;
  },


  getAll: async (page, limit,searchText = "") => {

    const populatedFields = [
        { path: "created_by", select: "name" }
    ];

    const searchOptions = {
        searchText,
        searchFields: ["name", "contact"]
    };

    const result = await paginate(
        loanProvider,
        {},
        page,
        limit,
        { createdAt: -1 },
        populatedFields,
        searchOptions
    );

    return result;

  },


  getById: async (id) => {
    const status = await loanProvider.findById(id);
    if (!status) {
      throw { status: false, message: "loan provider not found" };
    }
    return status;
  },

  update: async (id, data, userId, userName) => {
    const { name, contact } = data;

    const Status = await loanProvider.findById(id);
    if (!Status) {
      throw { status: false, message: "loan provider not found" };
    }

    if (name) {
      const nameExist = await loanProvider.findOne({
        name,
        _id: { $ne: id }
      });
      if (nameExist) {
        throw { status: false, message: "loan provider with this name already exists" };
      }
    }

    if (contact) {
      const contactExist = await loanProvider.findOne({
        contact,
        _id: { $ne: id }
      });
      if (contactExist) {
        throw { status: false, message: "This contact is already assigned to another provider" };
      }
    }

    const updatedStatus = await loanProvider.findByIdAndUpdate(
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

  deleteData: async (id) => {
    const deleted = await loanProvider.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "loan provider not found or already deleted",
      };
    }
    return "loan provider deleted successfully";
  },
};

module.exports = loanProviderService;
