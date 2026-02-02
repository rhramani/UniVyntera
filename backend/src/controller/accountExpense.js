const accountExpenseServices = require("../services/accountExpense");
const { uploadToCloudinary } = require("../../middleware/cloudinary");
const path = require("path");

const createExpense = async (req, res) => {
  try {
    let data = req.body;
    const { userId, userName } = req.user;
    // if (req.files?.expenseProof?.[0]) {
    //     const cloudinaryRes = await uploadToCloudinary(req.files.expenseProof[0].buffer, req.files.expenseProof[0].mimetype, "expenseProof");
    //     data.proof = cloudinaryRes.secure_url;
    // }

    if (data.bank === "null" || data.bank === "" || data.bank === undefined) {
      data.bank = null;
    }
    if (
      req.files &&
      req.files?.expenseProof &&
      req.files?.expenseProof?.length > 0
    ) {
      const fullPath = req.files.expenseProof[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.proof =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }
    data.created_by = userId;
    data.createdByName = userName;
    const result = await accountExpenseServices.create(data);
    return res.status(201).json({
      status: true,
      code: 201,
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something Went Wrong",
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    let data = req.body;
    const id = req.params.id;
    const { userId, userName } = req.user;
    // if (req.files?.expenseProof?.[0]) {
    //     const cloudinaryRes = await uploadToCloudinary(req.files.expenseProof[0].buffer, req.files.expenseProof[0].mimetype, "expenseProof");
    //     data.proof = cloudinaryRes.secure_url;
    // }

    if (
      req.files &&
      req.files?.expenseProof &&
      req.files?.expenseProof?.length > 0
    ) {
      const fullPath = req.files.expenseProof[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.proof =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }
    data.updated_by = userId;
    data.updatedByName = userName;
    console.log("datadatadata", data);
    const result = await accountExpenseServices.update(id, data);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something Went Wrong",
    });
  }
};

const getAllExpense = async (req, res) => {
  try {
    const { page, limit, search, startDate, endDate, center, expenseType } =
      req.query;
    const result = await accountExpenseServices.getAll(
      page,
      limit,
      search,
      startDate,
      endDate,
      center,
      expenseType,
      req.user      
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
      message: error.message || "Something Went Wrong",
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const result = await accountExpenseServices.delete(req.params.id);
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something Went Wrong",
    });
  }
};

const exportDataToExcel = async (req, res) => {
  try {
    const ids = req.query.ids?.split(",") || [];
    const result = await accountExpenseServices.exportDataToExcel(ids);

    if (!result.success) {
      return res.status(404).json({
        status: false,
        message: result.message,
      });
    }
    const fileName = path.basename(result.filePath);
    const fileUrl = `/public/${fileName}`;

    return res.status(200).json({
      status: true,
      code: 200,
      fileUrl,
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
  createExpense,
  updateExpense,
  getAllExpense,
  deleteExpense,
  exportDataToExcel,
};
