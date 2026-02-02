const clientMailService = require("../services/clientMail");

const clientMailController = {
  create: async (req, res) => {
    try {
      const mailData = await clientMailService.create(
        req.body,
        req.user?.userId,
        req.user?.userName
      );
      res.status(201).json({ status: true, code: 201, data: mailData });
    } catch (error) {
      res
        .status(500)
        .json({
          status: false,
          code: 500,
          message: error.message || "Something went wrong",
        });
    }
  },

  getAll: async (req, res) => {
    try {
      const { page, limit, search, category } = req.query;
      const mails = await clientMailService.getAll(
        page,
        limit,
        search,
        category
      );
      res.status(200).json({ status: true, code: 200, data: mails });
    } catch (error) {
      res
        .status(500)
        .json({
          status: false,
          code: 500,
          message: error.message || "Something went wrong",
        });
    }
  },

  getById: async (req, res) => {
    try {
      const mail = await clientMailService.getById(req.params.id);
      res.status(200).json({ status: true, code: 200, data: mail });
    } catch (error) {
      res
        .status(500)
        .json({
          status: false,
          code: 500,
          message: error.message || "Something went wrong",
        });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await clientMailService.update(
        req.params.id,
        req.body,
        req.user?.userId,
        req.user?.userName
      );
      res
        .status(200)
        .json({
          status: true,
          code: 200,
          message: "Client Mail updated successfully",
          data: updated,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          status: false,
          code: 500,
          message: error.message || "Something went wrong",
        });
    }
  },

  deleteCM: async (req, res) => {
    try {
      const deleted = await clientMailService.delete(req.params.id);
      res.status(200).json({ status: true, code: 200, message: deleted });
    } catch (error) {
      res
        .status(500)
        .json({
          status: false,
          code: 500,
          message: error.message || "Something went wrong",
        });
    }
  },

  bulkUploadClientMail: async (req, res) => {
    try {
      const { userId, userName } = req.user;
       const file = req.files?.excelFile?.[0].path;
      if (!file) {
        return res.status(400).json({
          status: false,
          code: 400,
          message: "Excel file is required.",
        });
      }

      const result = await clientMailService.bulkUploadClientMail(
        file,
        userId,
        userName
      );
      return res.status(201).json({
        status: true,
        code: 201,
        data: result,
      });
    } catch (error) {
      console.log("errorr" , error);
      res.status(500).json({
        status: false,
        code: 500,
        message: error.message || "Something went wrong",
      });
    }
  },
};

module.exports = clientMailController;
