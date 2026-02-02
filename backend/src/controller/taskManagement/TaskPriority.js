const taskPriorityServices = require("../../services/taskManagement/taskPriority");

const create = async (req, res) => {
  try {
    const { userId, userName } = req.user;
    const result = await taskPriorityServices.create(req.body, userId, userName);

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

const update = async (req, res) => {
  try {
    const result = await taskPriorityServices.update(
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
      message: error.message || "Something went wrong",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { page, limit, search = "" } = req.query;
    const result = await taskPriorityServices.getAll(page, limit, search);

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

const deletePriority = async (req, res) => {
  try {
    const result = await taskPriorityServices.deletePriority(req.params.id);
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
  create,
  update,
  getAll,
  deletePriority,
};
