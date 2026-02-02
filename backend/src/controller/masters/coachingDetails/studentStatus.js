const coachingStatusServices = require("../../../services/masters/coachingDetails/studentStatus");

const coachingStatusController = {
  create: async (req, res) => {
    try {
      const newStatus = await coachingStatusServices.create(
        req.body,
        req.user?.userId,
        req.user?.userName
      );
      res
        .status(201)
        .json({
          status: true,
          message: "Status created successfully",
          data: newStatus,
        });
    } catch (error) {
      if (error.code === 11000) {
        throw {
          status: false,
          message:
            "Status with this name already exists under the same main tab.",
        };
      }
      res
        .status(400)
        .json({
          status: false,
          message: error.message || "Something went wrong",
        });
    }
  },

  getAll: async (req, res) => {
    try {
      const statuses = await coachingStatusServices.getAll(req.query.search);
      res.status(200).json({ status: true, data: statuses });
    } catch (error) {
      res
        .status(400)
        .json({
          status: false,
          message: error.message || "Something went wrong",
        });
    }
  },

  getById: async (req, res) => {
    try {
      const status = await coachingStatusServices.getById(
        req.params.id
      );
      res.status(200).json({ status: true, data: status });
    } catch (error) {
      res
        .status(404)
        .json({
          status: false,
          message: error.message || "Something went wrong",
        });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await coachingStatusServices.update(
        req.params.id,
        req.body,
        req.user?.userId,
        req.user?.userName
      );
      res
        .status(200)
        .json({
          status: true,
          message: "Status updated successfully",
          data: updated,
        });
    } catch (error) {
       if (error.code === 11000) {
        throw {
          status: false,
          message:
            "Status with this name already exists under the same main tab.",
        };
      }
      res
        .status(400)
        .json({
          status: false,
          message: error.message || "Something went wrong",
        });
    }
  },

  deleteStatus: async (req, res) => {
    try {
      const deleted = await coachingStatusServices.delete(
        req.params.id
      );
      res.status(200).json({ status: true, message: deleted });
    } catch (error) {
      res
        .status(404)
        .json({
          status: false,
          message: error.message || "Something went wrong",
        });
    }
  },
};

module.exports = coachingStatusController;
