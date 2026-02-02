const Campus = require("../../../model/masters/campus");
const paginate = require("../../../utils/pagination");

const campusServices = {
  createCampus: async (data) => {
    const { country, campus } = data;

    const existingCampus = await Campus.findOne({
      country: country, // match country
      campus: { $regex: new RegExp(`^${campus.trim()}$`, "i") }, // case-insensitive exact match on campus
    });

    if (existingCampus) {
      throw {
        status: false,
        message: "This campus already exists in this country.",
      };
    }

    const newCampus = await Campus.create(data);
    return newCampus;
  },

  updateCampus: async (id, updateData, userId, userName) => {
    const campus = await Campus.findById(id);
    if (!campus) {
      throw { status: false, message: "Campus not found" };
    }

    const { country, campus: campusName } = updateData  ;

    const duplicate = await Campus.findOne({
      _id: { $ne: id }, // exclude current campus
      country: country || campus.country, // use new country if provided, else old one
      campus: { $regex: new RegExp(`^${campusName.trim()}$`, "i") }, // case-insensitive match
    });

    if (duplicate) {
      throw {
        status: false,
        message:
          "Another campus with the same name already exists in this country.",
      };
    }

    const updatedCampus = await Campus.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updated_by: userId,
        updatedByName: userName
       },
      {
        new: true,
      }
    );

    return updatedCampus;
  },

  getAllCampuses: async (page, limit, searchText = "") => {
    const populateFields = [{ path: "created_by", select: "name" }];

    const searchOptions = { searchText, searchFields: ["campus", "country"] };

    const getAll = await paginate(
      Campus,
      {},
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!getAll || getAll.totalRecords === 0) {
      throw { status: false, message: "No campus found" };
    }
    return getAll;
  },

  deleteCampus: async (id) => {
    const campus = await Campus.findByIdAndDelete(id);

    if (!campus) {
      throw { status: false, message: "Campus not found" };
    }

    return "Campus deleted successfully";
  },

  getCampusByCountry: async (countryName) => {
    const campuses = await Campus.find(
      { country: countryName },
      { campus: 1, _id: 1 } // ✅ Only project the 'campus' field, hide _id
    );

    if (!campuses.length) {
      throw {
        status: false,
        message: "No campuses found for the given country.",
      };
    }

    return campuses;
  },
};

module.exports = campusServices;
