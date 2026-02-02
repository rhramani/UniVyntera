const subjectServices = require("../../../services/masters/coachingDetails/subject");

const create = async (req, res) => {
  try {
    const result = await subjectServices.create(
      req.body,
      req.user?.userId,
      req.user?.userName
    );

    res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const update = async (req, res) => {
  try {
    const updated = await subjectServices.update(
      req.params.id,
      req.body,
      req.user?.userId,
      req.user?.userName
    );
    res.status(200).json({
      status: true,
      code: 200,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { page, limit, searchText } = req.query;
    const result = await subjectServices.getAll(
      page,
      limit,
      searchText
    );
    res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteData = async (req, res) => {
  try {
    await subjectServices.deleteData(req.params.id);

    res.status(200).json({
      status: true,
      code: 200,
      data: "Record deleted successfully",
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
  deleteData
};
