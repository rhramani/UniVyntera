const PromotionalTutorialServices = require("../services/promotionalTutorial");

const PromotionalTutorialController = {
  create: async (req, res) => {
    try {
      const newStatus = await PromotionalTutorialServices.create(req.body.country, req.user?.userId, req.user?.userName);
      res.status(201).json({ status: true, message: "Promotional tutorial created successfully", data: newStatus });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },
  addVideo : async (req, res) => {
  try {
    const { id } = req.params;
    const { name, urls } = req.body;

    if (!name) throw new Error("Video name is required");
    if (!Array.isArray(urls) || urls.length === 0) {
      throw new Error("At least one video URL is required");
    }

    const result = await PromotionalTutorialServices.addVideo(
      id,
      { name, urls },
      req.user?.userId,
      req.user?.userName
    );

    res.status(200).json({
      status: true,
      message: "Videos added successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
},


  update: async (req, res) => {
    try {
      const result = await PromotionalTutorialServices.update(req.params.id, req.params.videoId, req.body, req.user?.userId, req.user?.userName, req.params.fileId);
      res.status(200).json({ status: true, message: "Promotional tutorial updated successfully", data: result });

    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });

    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const { search } = req.query;
      const result = await PromotionalTutorialServices.getOne(id, search);
      return res.status(200).json({
        status: true,
        code: 200,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Something went wrong",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const { page, limit, search = "" } = req.query;
      const statuses = await PromotionalTutorialServices.getAll(page, limit, search);
      res.status(200).json({ status: true, data: statuses });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message || "Something went wrong" });
    }
  },

  deleteData: async (req, res) => {
    try {
      const {id, videoId, fileId} = req.params;
      const deleted = await PromotionalTutorialServices.delete(id, videoId, fileId );
      res.status(200).json({ status: true, message: deleted });
    } catch (error) {
      res.status(404).json({ status: false, message: error.message || "Something went wrong" });
    }
  }
};

module.exports = PromotionalTutorialController;
