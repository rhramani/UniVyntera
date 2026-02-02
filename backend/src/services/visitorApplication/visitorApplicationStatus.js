const ApplicationStatus = require("../../../model/visitorApplication/visitorApplicationStatus");

const paginate = require("../../../utils/pagination");

const applicationStatusServices = {
  create: async (data, userId, userName) => {
    const { mainTab, name, color } = data;

    if (!mainTab || !name) {
      throw {
        status: false,
        message: "Main tab and status name are required.",
      };
    }

    const trimmedMainTab = mainTab.trim();
    const trimmedName = name.trim();
    const trimmedColor = color ? color.trim() : null;

    // Check for existing record with same mainTab and name (regardless of color)
    const existingNameInTab = await ApplicationStatus.findOne({
      mainTab: trimmedMainTab,
      name: trimmedName,
    });

    if (existingNameInTab) {
      throw {
        status: false,
        message: "A status with this name already exists under this main tab.",
      };
    }

    // Check for existing color (if color is provided)
    if (trimmedColor) {
      const existingColor = await ApplicationStatus.findOne({
        color: trimmedColor,
      });

      if (existingColor) {
        throw {
          status: false,
          message: "This color is already assigned to another status.",
        };
      }
    }

    // Create new application status
    const newStatus = await ApplicationStatus.create({
      mainTab: trimmedMainTab,
      name: trimmedName,
      color: trimmedColor,
      created_by: userId,
      createdByName: userName,
    });

    return newStatus;
  },
  update: async (id, updateData, userId, userName) => {
    const { name, mainTab, color } = updateData;

    const existing = await ApplicationStatus.findById(id);
    if (!existing) {
      throw { status: false, message: "Application status not found" };
    }

    const newMainTab = mainTab?.trim() || existing.mainTab;
    const newName = name?.trim() || existing.name;
    const newColor = color?.trim() || existing.color;

    const isDuplicateCheckNeeded =
      newMainTab !== existing.mainTab ||
      newName !== existing.name ||
      newColor !== existing.color;

    if (isDuplicateCheckNeeded) {
      // Check if mainTab + name combination already exists (excluding current record)
      const existingNameInTab = await ApplicationStatus.findOne({
        _id: { $ne: id },
        mainTab: newMainTab,
        name: newName,
      });

      if (existingNameInTab) {
        throw {
          status: false,
          message:
            "A status with this name already exists under this main tab.",
        };
      }

      // Check if color is already used by another record (if color is provided)
      if (newColor) {
        const existingColor = await ApplicationStatus.findOne({
          _id: { $ne: id },
          color: newColor,
        });

        if (existingColor) {
          throw {
            status: false,
            message: "This color is already assigned to another status.",
          };
        }
      }
    }

    const updatedStatus = await ApplicationStatus.findByIdAndUpdate(
      id,
      {
        mainTab: newMainTab,
        name: newName,
        color: newColor,
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return {
      status: true,
      message: "Application status updated successfully",
      data: updatedStatus,
    };
  },
  getOne: async (mainTab) => {
    if (!mainTab) {
      throw { status: false, message: "mainTab is required" };
    }

    const statuses = await ApplicationStatus.find(
      { mainTab: mainTab.trim() },
      { _id: 1, name: 1 }
    );

    if (!statuses || statuses.length === 0) {
      throw { status: false, message: "Application statuses not found" };
    }

    return statuses;
  },
  getAll: async (page, limit, searchText = "") => {
    const searchOptions = { searchText, searchFields: ["name", "mainTab"] };

    const getAll = await paginate(
      ApplicationStatus,
      {},
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    if (!getAll) {
      throw { status: false, message: "Application status not found" };
    }

    return getAll;
  },
  delete: async (id) => {
    const deleteRecord = await ApplicationStatus.findByIdAndDelete(id);
    if (!deleteRecord) {
      throw { status: false, message: "Application status not found" };
    }

    return "Application status deleted successfully";
  },
};

module.exports = applicationStatusServices;
