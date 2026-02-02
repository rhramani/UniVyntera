const rolePermissionServices = require("../services/rolesPermission");

const create = async (req, res) => {
  try {
    let data = req.body;
    const { userId, userName } = req.user;

    data.assigned_by = userId;
    data.assignedByName = userName;
    const result = await rolePermissionServices.create(data);
    res
      .status(201)
      .json({
        status: true,
        message: "Role Permission created successfully",
        data: result,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: error.message || "Something went wrong",
      });
  }
};

const update = async (req, res) => {
  try {
    // const { role, tabs , branchId } = req.body;
    const result = await rolePermissionServices.update(req.params.id, req.body);
    res
      .status(200)
      .json({
        status: true,
        message: "Role Permission created successfully",
        data: result,
      });
  } catch (error) {
    console.log("errorr" , error);
    res
      .status(500)
      .json({
        status: false,
        message: error.message || "Something went wrong",
      });
  }
};

const getOne = async (req,res) => {
    try {
        const result = await rolePermissionServices.getOne(req.params.roleId , req.query.branchId);
        res
      .status(200)
      .json({
        status: true,
        message: "Get role permission successfully",
        data: result,
      });

    } catch (error) {
        res
      .status(500)
      .json({
        status: false,
        message: error.message || "Something went wrong",
      });
    }
}

const getAll = async (req,res) => {
    try {
        const result = await rolePermissionServices.getAll(req.query.branchId);
        res.status(200).json({
            status: true,
            message: "Get all role permissions sucessfully",
            data: result
        })
    } catch (error) {
        res
      .status(500)
      .json({
        status: false,
        message: error.message || "Something went wrong",
      });
    }
}

module.exports = {
  create,
  update,
  getOne,
  getAll
};
