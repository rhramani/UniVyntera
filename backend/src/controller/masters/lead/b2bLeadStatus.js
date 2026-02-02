const leadStatusService = require("../../../services/masters/lead/b2bLeadStatus");

const leadStatusController = {
  create: async (req, res) => {
    try {
      const newStatus = await leadStatusService.create(req.body, req.user?.userId , req.user?.userName);
      res.status(201).json({ status: true, message: "Lead Status created successfully", data: newStatus });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  getAll: async (req, res) => {
    try {
      const statuses = await leadStatusService.getAll(req.query.search);
      res.status(200).json({ status: true, data: statuses });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  getById: async (req, res) => {
    try {
      const status = await leadStatusService.getById(req.params.id);
      res.status(200).json({ status: true, data: status });
    } catch (error) {
      res.status(404).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await leadStatusService.update(req.params.id, req.body, req.user?.userId, req.user?.userName);
      res.status(200).json({ status: true, message: "Lead Status updated successfully", data: updated });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  deleteLS: async (req, res) => {
    try {
      const deleted = await leadStatusService.delete(req.params.id);
      res.status(200).json({ status: true, message: deleted });
    } catch (error) {
      res.status(404).json({ status: false, message: error.message || "Something went wrong" });
    }
  }
};

module.exports = leadStatusController;
