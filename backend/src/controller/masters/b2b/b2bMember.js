const b2bMemberServices = require("../../../services/masters/b2b/b2bMember");

const createB2BMember = async (req, res) => {
  try {
    const data = req.body;
    const { userId , userName} = req.user;
    const result = await b2bMemberServices.create(data, userId, userName);

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

const updateB2BMember = async (req, res) => {
  try {
    const result = await b2bMemberServices.update(req.params.id, req.body, req.user?.userId , req.user?.userName);

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

const getB2BMemberById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await b2bMemberServices.getById(id);
    res.status(200).json({
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

const getAllB2BMembers = async (req, res) => {
  try {
    const {page , limit , search = ""} = req.query;
    const result = await b2bMemberServices.getAll(page , limit , search);
    res.status(200).json({
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

const deleteB2BMembers = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await b2bMemberServices.delete(id);
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

const getMemberByAdmin = async (req,res) => {
  try {
    const {page, limit, search = "", roleId } = req.query;
    const b2bAdminId = req.params.id;
    const result = await b2bMemberServices.getMemberByAdmin(page, limit, search, b2bAdminId, roleId);

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
}

module.exports = {
  createB2BMember,
  updateB2BMember,
  getB2BMemberById,
  getAllB2BMembers,
  deleteB2BMembers,
  getMemberByAdmin
};
