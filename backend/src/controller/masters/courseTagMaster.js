const courseTagServices = require("../../services/masters/courseTagMaster");

const create = async (req, res) => {
  try {
    const result = await courseTagServices.create(req.body.name);
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await courseTagServices.update(id, name);

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

const getAll = async (req, res) => {
  try {
    const result = await courseTagServices.getAll(req.query.search);

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

const deleteTag = async (req, res) => {
  try {
    const result = await courseTagServices.deleteTag(req.params.id);
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
  create,
  update,
  getAll,
  deleteTag,
};
