const branchMemberServices = require("../../services/branch/branchMember");

const createBranchMember = async (req, res) => {
  try {
    const data = req.body;
    const { userId , userName} = req.user;
  
    const result = await branchMemberServices.create(data, userId, userName);

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

const updateBranchMember = async (req, res) => {
  try {
    const result = await branchMemberServices.update(req.params.id, req.body, req.user?.userId , req.user?.userName);

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

const getBranchMemberById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await branchMemberServices.getById(id);
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

const getAllBranchMembers = async (req, res) => {
  try {
    const {page , limit , search = ""} = req.query;
    const result = await branchMemberServices.getAll(page , limit , search);
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

const deleteBranchMember = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await branchMemberServices.delete(id);
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

const getMemberByBranch = async (req,res) => {
  try {
    const {page, limit, search = "" } = req.query;
    const branchId = req.params.id;
    const result = await branchMemberServices.getMemberByBranch(page, limit, search, branchId);

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
  createBranchMember,
  updateBranchMember,
  getBranchMemberById,
  getAllBranchMembers,
  deleteBranchMember,
  getMemberByBranch
};
