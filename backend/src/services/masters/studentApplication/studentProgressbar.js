const ProgressStep = require("../../../../model/masters/studentApplication/studentProgressbar");

const { buildCountryRegex } = require("../../../../helpers/countryNameMapping");
const Paginate = require("../../../../utils/pagination");

const progressStepServices = {
  createOrUpdateSteps: async (data, userId, userName) => {
    const { country, steps } = data;
    const countryName = country.trim().toLowerCase();

    const existingSteps = await ProgressStep.findOne({ country: countryName });
    if (existingSteps) {
      existingSteps.steps = steps;
      existingSteps.updated_by = userId;
      existingSteps.updatedByName = userName;
      await existingSteps.save();
      return existingSteps;
    } else {
      const newProgressStep = new ProgressStep({ country: countryName, steps , created_by: userId, createdByName: userName});
      await newProgressStep.save();
      return newProgressStep;   
    }
  },
  getAll: async (page, limit, searchText = "", country = "") => {
    const query = {};
    if (country) {
      const regex = buildCountryRegex(country);
      query.country = {$regex : regex};
    }

    const searchOptions = { searchText, searchFields: ["country"] };
    const getAll = await Paginate(
      ProgressStep,
      query,
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    return getAll;
  },
  delete: async (id) => {
    const deleteRecord = await ProgressStep.findByIdAndDelete(id);

    if(!deleteRecord){
      throw {status: false, message: "Progressbar steps not found"};
    }

    return "Progressbar steps deleted successfully"
  }
};

module.exports = progressStepServices;
