const loanProviderService = require("../../../services/masters/studentApplication/loanProvider");

const studentStatusController = {
  create: async (req, res) => {
    try {
      const newStatus = await loanProviderService.create(req.body, req.user?.userId , req.user?.userName);
      res.status(201).json({ status: true, message: "Status created successfully", data: newStatus });
    } catch (error) {
      if (error.code === 11000) {
        throw {
          status: false,
          message:
            "Status with this same name and color alredy exist.",
        };
      }
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  getAll: async (req, res) => {
    try {
    const { page , limit, search } = req.query;
      const result = await loanProviderService.getAll(page , limit, search);
      res.status(200).json({ status: true, data: result });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  getById: async (req, res) => { 
    try {
      const result = await loanProviderService.getById(req.params.id);
      res.status(200).json({ status: true, data: result });
    } catch (error) {
      res.status(404).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await loanProviderService.update(req.params.id, req.body, req.user?.userId, req.user?.userName);
      res.status(200).json({ status: true, message: "Status updated successfully", data: updated });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  deleteData: async (req, res) => {
    try {
      const deleted = await loanProviderService.deleteData(req.params.id);
      res.status(200).json({ status: true, message: deleted });
    } catch (error) {
      res.status(404).json({ status: false, message: error.message || "Something went wrong" });
    }
  }
};

module.exports = studentStatusController;
