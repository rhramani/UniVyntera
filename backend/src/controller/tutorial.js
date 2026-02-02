const tutorialServices = require("../services/tutorial");

const tutorialController = {
  create: async (req, res) => {
    try {
      const newStatus = await tutorialServices.create(req.body, req.user?.userId , req.user?.userName);
      res.status(201).json({ status: true, message: "Tutorial created successfully", data: newStatus });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },
  update: async (req,res) => {
    try {
      const result = await tutorialServices.update(req.params.id, req.body, req.user?.userId , req.user?.userName);
      res.status(200).json({ status: true, message: "Tutorial updated successfully", data: result });
      
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
      
    }
  },

  getAll: async (req, res) => {
    try {
    const {page, limit, search = ""} = req.query;
      const statuses = await tutorialServices.getAll(page, limit, search);
      res.status(200).json({ status: true, data: statuses });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  deleteData: async (req, res) => {
    try {
      const deleted = await tutorialServices.delete(req.params.id);
      res.status(200).json({ status: true, message: deleted });
    } catch (error) {
      res.status(404).json({ status: false, message: error.message || "Something went wrong" });
    }
  }
};

module.exports = tutorialController;
