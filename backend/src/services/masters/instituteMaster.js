const mongoose = require("mongoose");
const {
  Country: CountryData,
  State: PkgState,
  City: CityPkg,
} = require("country-state-city");

const Institute = require("../../../model/masters/institute");
const Course = require("../../../model/masters/course");
const ProgramLevel = require("../../../model/masters/programLevel");
const paginate = require("../../../utils/pagination");
const { buildCountryRegex } = require("../../../helpers/countryNameMapping");

const instituteServices = {
  createInstitute: async (data) => {
  

    const { instituteName, country, state, city } = data;

    const matchQuery = {
      instituteName: { $regex: new RegExp(`^${instituteName.trim()}$`, "i") },
      country,
    };

    if (state) {
      matchQuery.state = state;
    }

    if (city) {
      matchQuery.city = city;
    }

    const existingInstitute = await Institute.findOne(matchQuery);

    if (existingInstitute) {
      let location = `in ${country}`;
      if (state) location += `, ${state}`;
      if (city) location += `, ${city}`;

      throw {
        status: false,
        message: `Institute with the same name already exists ${location}.`,
      };
    }

    const newInstitute = await Institute.create(data);
    return newInstitute;
  },

  updateInstitute: async (updateId, updateData, userId, userName) => {
    const institute = await Institute.findById(updateId);
    if (!institute) throw { status: false, message: "Institute not found" };


    // Use existing values if not provided in updateData
    const countryToCheck = updateData.country || institute.country;
    const stateToCheck = updateData.state || institute.state;
    const cityToCheck = updateData.city || institute.city;
    const nameToCheck =
      updateData.instituteName?.trim() || institute.instituteName;
    const campusToCheck = updateData.campusName?.trim() || institute.campusName;

    // Duplicate check
    const matchQuery = {
      _id: { $ne: updateId },
      instituteName: { $regex: new RegExp(`^${nameToCheck}$`, "i") },
      country: countryToCheck,
    };

    if (stateToCheck) {
      matchQuery.state = stateToCheck;
    }

    if (cityToCheck) {
      matchQuery.city = cityToCheck;
    }

    // ✅ Ensure same campusName also
    matchQuery.campusName = { $regex: new RegExp(`^${campusToCheck}$`, "i") };

    const duplicate = await Institute.findOne(matchQuery);

    if (duplicate) {
      let location = `in ${countryToCheck}`;
      if (stateToCheck) location += `, ${stateToCheck}`;
      if (cityToCheck) location += `, ${cityToCheck}`;
      if (campusToCheck) location += ` (Campus: ${campusToCheck})`;

      throw {
        status: false,
        message: `Another institute with the same name already exists ${location}.`,
      };
    }

    const updatedInstitute = await Institute.findByIdAndUpdate(
      updateId,
      {
        ...updateData,
        updated_by: userId,
        userName: userName,
      },
      {
        new: true,
      }
    );

    return updatedInstitute;
  },

  getInstituteById: async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { status: false, message: "Invalid Institute ID" };
    }

    const populateFields = [{ path: "campus", select: "campus" }];

    const institute = await Institute.findById(id).populate(populateFields);

    if (!institute) throw { status: false, message: "Institute not found" };
    return institute;
  },

  getAllInstitutes: async (
    page,
    limit,
    searchText = "",
    country = "",
    state = ""
  ) => {
    const populateFields = [
      { path: "campus", select: "campus" },
      { path: "programLevelCommissions.programLevel", select: "name" },
      { path: "created_by", select: "name" },
    ];

    let query = {};

    if (state) {
      const states = state
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      query.state = { $in: states.map((s) => new RegExp(`^${s}$`, "i")) };
    }
    if (country) {
      const countries = country
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const regexList = countries.map((c) => buildCountryRegex(c));
      query.country = { $in: regexList.map((r) => new RegExp(r)) };
    }

    

    const searchOptions = {
      searchText,
      searchFields: ["instituteName", "country"],
    };

    const getAll = await paginate(
      Institute,
      query,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!getAll || getAll.totalRecords === 0) {
      throw { status: false, message: "No Institute found" };
    }

    return getAll;
  },

  deleteInstitute: async (id) => {
    const deleted = await Institute.findByIdAndDelete(id);
    if (!deleted) throw { status: false, message: "Institute not found" };
    return "Institute deleted successfully";
  },

  getAllCountriesFromPackage: async () => {
    const countries = CountryData.getAllCountries();
    return countries.map((c) => ({ name: c.name, isoCode: c.isoCode }));
  },

  getAllStateFromPackage: async (countryName) => {
    const country = CountryData.getAllCountries().find(
      (c) => c.isoCode === countryName
    );

    if (!country) {
      throw { status: false, message: "Country not found" };
    }

    const states = PkgState.getStatesOfCountry(country.isoCode);
    return states.map((s) => ({ name: s.name, isoCode: s.isoCode }));
  },

  getAllCityFromPackage: async (countryName, stateName) => {
    const country = CountryData.getAllCountries().find(
      (c) => c.isoCode === countryName
    );

    if (!country) {
      throw { status: false, message: "Country not found" };
    }

    const states = PkgState.getStatesOfCountry(country.isoCode);

    const state = states.find((s) => s.isoCode === stateName);

    if (!state) {
      throw { status: false, message: "State not found in selected country" };
    }

    const cities = CityPkg.getCitiesOfState(country.isoCode, state.isoCode);
    return cities.map((c) => c.name);
  },

  getInstituteNamesAndCountries: async () => {
    const institutes = await Institute.find(
      {},
      { instituteName: 1, country: 1, campus: 1 }
    ).populate({ path: "campus", select: "campus" });

    const uniqueSet = new Set();
    const result = [];

    institutes.forEach((inst) => {
      const campusName = inst.campus?.campus?.trim() || "";
      const key = `${inst.instituteName
        .trim()
        .toLowerCase()}__${campusName.toLowerCase()}__${inst.country
        .trim()
        .toLowerCase()}`;

      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        result.push({
          _id: inst._id,
          name: `${inst.instituteName} (${campusName}-${inst.country})`,
        });
      }
    });

    return result;
  },
  countriesOfInstitute: async (instituteName) => {
    if (!instituteName) {
      throw { status: false, message: "Institute name is required" };
    }

    const countries = await Institute.distinct("country", {
      instituteName: instituteName,
    });

    return countries;
  },
  campusOfInstitute: async (instituteName, country) => {
    const query = { instituteName };
    if (country) {
      query.country = country;
    }
    const institutes = await Institute.find(query)
      .populate({ path: "campus", select: "campus country" })
      .lean();

    if (!institutes || institutes.length === 0) {
      throw { status: false, message: "Institute not found" };
    }

    // Extract all campuses (handling duplicates if multiple institutes point to the same campus)
    const campusSet = new Map(); // To avoid duplicates

    institutes.forEach((inst) => {
      const c = inst.campus;
      if (c && c._id) {
        if (!country || (c.country && c.country === country)) {
          campusSet.set(String(c._id), { _id: c._id, campus: c.campus });
        }
      }
    });

    const campusList = Array.from(campusSet.values());

    return campusList;
  },
  programLevelsOfInstitute: async (instituteName, country) => {
    // 1️⃣ Find all institutes by name and (optional) country
    const instituteQuery = { instituteName };
    if (country) instituteQuery.country = country;

    const institutes = await Institute.find(instituteQuery).lean();

    if (!institutes || institutes.length === 0) {
      throw { status: false, message: "Institute not found" };
    }

    // 2️⃣ Get their ObjectIds
    const instituteIds = institutes.map((inst) => inst._id);

    // 3️⃣ Find all courses for those institutes and project studyLevel only
    const courses = await Course.find(
      { university: { $in: instituteIds } },
      { studyLevel: 1 }
    ).lean();

    if (!courses || courses.length === 0) {
      return [];
    }

    // 4️⃣ Flatten and deduplicate all studyLevel ObjectIds
    const allLevels = courses.flatMap((c) => c.studyLevel || []);
    const uniqueLevelIds = [...new Set(allLevels.map((id) => id.toString()))];

    // 5️⃣ Populate the program level names
    const programLevels = await ProgramLevel.find(
      { _id: { $in: uniqueLevelIds } },
      { name: 1 }
    ).lean();

    // 6️⃣ Return clean list
    return programLevels.map((lvl) => ({
      _id: lvl._id,
      name: lvl.name,
    }));
  },

  getInstituteByCountry: async (country) => {
    if (!country) {
      throw { status: false, message: "Country name is required" };
    }

    const institutes = await Institute.find({ country: country.trim() });

    if (!institutes.length) {
      throw { status: false, message: "No institutes found for this country" };
    }

    return institutes;
  },
};

module.exports = instituteServices;
