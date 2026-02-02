const instituteServices = require("../../services/masters/instituteMaster");

function parseProgramLevelCommissions(body) {
  const result = [];

  Object.keys(body).forEach((key) => {
    const match = key.match(/^programLevelCommissions\[(\d+)\]\.(.+)$/);
    if(match) {
      const index = Number(match[1]);
      const field = match[2];

      if(!result[index]) result [index] = {};
      result[index][field] = body[key];

      delete body[key];
    }
  });

  if(result.length > 0) {
    body.programLevelCommissions = result;
  }

  return body;
}

const createInstitute = async (req, res) => {
  try {
    let data = req.body;
     data = parseProgramLevelCommissions(data);


    if (req.files && req.files.profile && req.files.profile.length > 0) {
      const fullPath = req.files.profile[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.profile =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }
    if (req.files && req.files.brochure && req.files.brochure.length > 0) {
      const fullPath = req.files.brochure[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.brochure =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    if (req.files?.agreementDoc?.[0]) {
      const fullPath = req.files.agreementDoc[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.agreementDoc =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }
    data.created_by = req.user?.userId;
    data.createdByName = req.user?.userName;

    const result = await instituteServices.createInstitute(data);
    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const updateInstitute = async (req, res) => {
  try {
    const id = req.params.id;
    let data = req.body;
    const { userId, userName } = req.user;
    
 data = parseProgramLevelCommissions(data);

    if (req.files && req.files.profile && req.files.profile.length > 0) {
      const fullPath = req.files.profile[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.profile =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    if (req.files && req.files.brochure && req.files.brochure.length > 0) {
      const fullPath = req.files.brochure[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.brochure =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    if (req.files?.agreementDoc?.[0]) {
      const fullPath = req.files.agreementDoc[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.agreementDoc =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    const result = await instituteServices.updateInstitute(
      id,
      data,
      userId,
      userName
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getInstituteById = async (req, res) => {
  try {
    const result = await instituteServices.getInstituteById(req.params.id);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: error.message || "Institute not found",
    });
  }
};

const getAllInstitutes = async (req, res) => {
  try {
    const { page, limit, search = "", country = "", state = "" } = req.query;

    const result = await instituteServices.getAllInstitutes(
      page,
      limit,
      search,
      country,
      state
    );
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteInstitute = async (req, res) => {
  try {
    const result = await instituteServices.deleteInstitute(req.params.id);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: error.message || "Institute not found",
    });
  }
};

const getCountryFromPackage = async (req, res) => {
  try {
    const result = await instituteServices.getAllCountriesFromPackage();
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getStateFromPackage = async (req, res) => {
  try {
    const country = req.query.country;
    const result = await instituteServices.getAllStateFromPackage(country);

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getCityfromPackage = async (req, res) => {
  try {
    const country = req.query.country;
    const state = req.query.state;
    const result = await instituteServices.getAllCityFromPackage(
      country,
      state
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getInstituteNamesAndCountries = async (req, res) => {
  try {
    const result = await instituteServices.getInstituteNamesAndCountries();
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const countriesOfInstitute = async (req, res) => {
  try {
    const result = await instituteServices.countriesOfInstitute(
      req.query?.instituteName
    );
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const campusOfInstitute = async (req, res) => {
  try {
    const { instituteName, country } = req.query;
    const result = await instituteServices.campusOfInstitute(
      instituteName,
      country
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const programLevelsOfInstitute = async (req, res) => {
  try {
    const { instituteName, country } = req.query;

    const result = await instituteServices.programLevelsOfInstitute(
      instituteName,
      country
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getInstituteByCountry = async (req, res) => {
  try {
    const result = await instituteServices.getInstituteByCountry(
      req.query.country
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  createInstitute,
  updateInstitute,
  getInstituteById,
  getAllInstitutes,
  deleteInstitute,
  getCountryFromPackage,
  getCityfromPackage,
  getStateFromPackage,
  getInstituteNamesAndCountries,
  countriesOfInstitute,
  campusOfInstitute,
  getInstituteByCountry,
  programLevelsOfInstitute,
};
