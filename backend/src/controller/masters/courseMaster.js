const courseServices = require("../../services/masters/courseMaster");
const Role = require("../../../model/masters/roles");

const createCourse = async (req, res) => {
  try {
    const result = await courseServices.createCourse(
      req.body,
      req.user?.userId,
      req.user?.userName
    );

    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const bulkUploadCourse = async (req, res) => {
  try {
    const file = req.files?.excelFile?.[0].path;

    if (!file) {
      return res
        .status(400)
        .json({ status: false, message: "Excel file is required." });
    }
    const result = await courseServices.bulkUploadCourse(file, req.user.userId);

    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    console.log("errorr", error);
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const result = await courseServices.updateCourse(
      req.params.id,
      req.body,
      req.user?.userId,
      req.user?.userName
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
      message: error.message,
    });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const { page, limit, search = "" } = req.query;

    const result = await courseServices.getAllCourse(page, limit, search);

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const getOneCourse = async (req, res) => {
  try {
    const result = await courseServices.getOneCourse(req.params.id);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const deleteAllCourse = async (req, res) => {
  try {
    const result = await courseServices.deleteCourse(req.params.id);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const courseFilter = async (req, res) => {
  try {
    const { page, limit, ...filters } = req.query;
    const currentUser = req.user;

    let roleId = null;
    let isPublic = false;

    // 🔹 PUBLIC USER (no token / no user)
    if (!currentUser) {
      isPublic = true;
    } else {
      // 🔹 AUTHENTICATED USER
      if (currentUser.role && typeof currentUser.role === "object") {
        roleId = currentUser.role._id;
      }

      if (!roleId && currentUser.userRole?._id) {
        roleId = currentUser.userRole._id;
      }

      if (!roleId && typeof currentUser.role === "string") {
        const roleDoc = await Role.findOne({ name: currentUser.role }).select("_id");
        if (roleDoc) roleId = roleDoc._id;
      }
    }

    const isSuperAdmin =
      !isPublic &&
      (
        currentUser?.role?.name === "Super Admin" ||
        currentUser?.role === "Super Admin"
      );

    const result = await courseServices.courseFilter(
      page,
      limit,
      filters,
      roleId,
      isSuperAdmin,
      isPublic // 👈 NEW FLAG
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};


const exportDataToExcel = async (req, res) => {
  try {
    const ids = req.query.ids?.split(",") || [];
    const currentUser = req.user;

    const result = await courseServices.exportDataToExcel(ids, currentUser);

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const getCurrenctCode = async (req, res) => {
  try {
    const result = await courseServices.getCurrenctCode();

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const getCountriesFromCourses = async (req, res) => {
  try {
    const result = await courseServices.getAllCountriesFromCourses();
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const getStatesFromCourses = async (req, res) => {
  try {
    const result = await courseServices.getAllStatesFromCourses(
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
      message: error.message,
    });
  }
};

const getDurationFromCourses = async (req, res) => {
  try {
    const result = await courseServices.getAllDurationFromCourses();
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message,
    });
  }
};

const getDependentCourseFilters = async (req, res) => {
  try {
    const { country, studyArea } = req.query;

    const result = await courseServices.getDependentCourseFilters(
      country,
      studyArea
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
      message: error.message,
    });
  }
};

const getStudyAreasByCountry = async (req, res) => {
  try {
    const result = await courseServices.getStudyAreasByCountry(
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
      message: error.message,
    });
  }
};

module.exports = {
  createCourse,
  bulkUploadCourse,
  updateCourse,
  getAllCourse,
  getOneCourse,
  deleteAllCourse,
  courseFilter,
  exportDataToExcel,
  getCurrenctCode,
  getCountriesFromCourses,
  getDurationFromCourses,
  getDependentCourseFilters,
  getStatesFromCourses,
  getStudyAreasByCountry,
};
