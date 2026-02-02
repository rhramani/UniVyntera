const SubPlan = require("../../../../model/masters/generateInvoice/subPlan");
const Paginate = require("../../../../utils/pagination");

const subPlanServices = {
  create: async (data, userId, userName) => {
    const { name, mainPlan, country } = data;

    const existing = await SubPlan.findOne({
      name: name.trim(),
      mainPlan,
      country,
    });
    if (existing) {
      throw {
        status: false,
        message:
          "SubPlan with this name already exists under the same MainPlan",
      };
    }

    const subPlan = await SubPlan.create({
      ...data,
      name: name.trim(),
      created_by: userId,
      createdByName: userName,
    });

    return subPlan;
  },
  update: async (id, data, userId, userName) => {
    const current = await SubPlan.findById(id);
    if (!current) throw new Error("SubPlan not found");

    // Use incoming values if provided, otherwise fallback to current
    const newName = data.name ? data.name.trim() : current.name;
    const newMainPlan = data.mainPlan ? data.mainPlan : current.mainPlan;
    const newCountry = data.country ? data.country : current.country;

    // Check if the combination of newName + newMainPlan already exists in another document
    const duplicate = await SubPlan.findOne({
      _id: { $ne: id },
      name: newName,
      mainPlan: newMainPlan,
      country: newCountry,
    });

    if (duplicate) {
      throw new Error(
        "Another SubPlan with the same name already exists under the same MainPlan."
      );
    }

    // Proceed to update
    const updated = await SubPlan.findByIdAndUpdate(
      id,
      {
        ...data,
        name: newName, // Ensure trimmed name is used
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return updated;
  },
  getById: async (id) => {
    const subPlan = await SubPlan.findById(id).populate("mainPlan", "name");
    if (!subPlan) throw new Error("SubPlan not found");
    return subPlan;
  },
  getAll: async (page, limit, searchText = "", mainPlan = "", country = "") => {
    const searchOptions = {
      searchText,
      searchFields: ["name"],
    };

    const populateFields = [{ path: "mainPlan", select: "name" }];

    let filter = {};

    if (mainPlan && country) {
      filter.mainPlan = mainPlan;
      filter.country = country;
    } else if (mainPlan) {
      filter.mainPlan = mainPlan;
    } else if (country) {
      filter.country = country;
    }

    let result = await Paginate(
      SubPlan,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );
    
    // If no data found and country filter was applied, remove country filter and retry
    if (result.totalRecords === 0 && country) {
      const relaxedFilter = { ...filter };
      delete relaxedFilter.country;

      result = await Paginate(
        SubPlan,
        relaxedFilter,
        page,
        limit,
        { createdAt: -1 },
        populateFields,
        searchOptions
      );
    }

    return result;
  },
  delete: async (id) => {
    const deleted = await SubPlan.findByIdAndDelete(id);
    if (!deleted)
      throw { status: false, message: "SubPlan not found or already deleted" };
    return "SubPlan deleted successfully";
  },
};

module.exports = subPlanServices;
