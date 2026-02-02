const coachingFacultyServices = require("../../../services/masters/coachingDetails/coachingFaculty");

const facultyRegistration = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    const result = await coachingFacultyServices.create(
      req.body,
      userId,
      userName
    );
    return res.status(201).json({
      message: "User registered successfully",
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

const updateFaculty = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const { userId, userName } = req.user;

    const result = await coachingFacultyServices.update(
      id,
      updateData,
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

const getOne = async (req, res) => {
  try {
    const result = await coachingFacultyServices.getOneUser(req.params.id);

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

const getAll = async (req, res) => {
  try {
    const { page, limit, search , batchStatus, type , branchId , showAll} = req.query;
    const result = await coachingFacultyServices.getAll(page, limit, search, batchStatus, type , req.user , branchId , showAll);
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

const deleteData = async (req, res) => {
  try {
    const result = await coachingFacultyServices.deleteData(req.params.id);
    return res.status(200).json({
      status: true,
      code: 200,
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getBatchTimes = async (req, res) => {
  try {
    const {id, status} = req.query;
    const result = await coachingFacultyServices.getBatchTimes(id, status);
    return res.status(200).json({
      status: true,
      code: 200,
      message: result,
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
  facultyRegistration,
  updateFaculty,
  getOne,
  getAll,
  deleteData,
  getBatchTimes
};
