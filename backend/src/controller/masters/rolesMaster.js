const rolesServices = require("../../services/masters/rolesMaster");

const createRole = async (req, res) => {
  try {
    const result = await rolesServices.createRole(
      req.body,
      req.query.branchId,
      req.user?.userId,
      req.user?.userName
    );

    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    if (error.code === 11000) {
      return {
        status: false,
        code: 400,
        message: "Role with the same name already exists in this branch",
      };
    }

    // Handle ObjectId cast errors (e.g., malformed roleId)
    if (error.name === "CastError") {
      return {
        status: false,
        code: 400,
        message: "Invalid role ID or branch ID",
      };
    }
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const result = await rolesServices.updateRole(
      req.params.id,
      req.query.branchId,
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
    if (error.code === 11000) {
      res.status(500).json({
        status: false,
        code: 400,
        message: "Role with the same name already exists in this branch",
      });
    }

    // Handle ObjectId cast errors (e.g., malformed roleId)
    if (error.name === "CastError") {
      res.status(500).json({
        status: false,
        code: 400,
        message: "Invalid role",
      });
    }
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const result = await rolesServices.getRoleById(req.params.id);

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

const getAllRoles = async (req, res) => {
  try {
    const { page, limit, search = "", branchId , showAll} = req.query;
    const result = await rolesServices.getAllRoles(
      page,
      limit,  
      search,
      branchId,
      showAll
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

const getAllRolesWithoutPagination = async (req, res) => {
  try {
    const { branchId , showAll } = req.query;
    const result = await rolesServices.getAllRolesWithoutPagination(branchId , showAll);

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

const deleteRoles = async (req, res) => {
  try {
    const result = await rolesServices.deleteRole(req.params.id);
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
  createRole,
  updateRole,
  getRoleById,
  getAllRoles,
  deleteRoles,
  getAllRolesWithoutPagination,
};
