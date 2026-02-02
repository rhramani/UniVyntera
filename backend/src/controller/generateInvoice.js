const GeneratedInvoiceServices = require("../services/generateInvoice");
const path = require("path");
const create = async (req, res) => {
  try {
    const result = await GeneratedInvoiceServices.create(
      req.body,
      req.user.userId,
      req.user.userName
    );

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
    const result = await GeneratedInvoiceServices.update(
      req.params.id,
      req.body,
      req.user.userId,
      req.user.userName
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
    const {
      page,
      limit,
      search,
      paymentType,
      mainPlan,
      subPlan,
      startDate,
      endDate,
      status,
      branchId,
      showAll,
    } = req.query;
    const result = await GeneratedInvoiceServices.getAll(
      page,
      limit,
      search, 
      paymentType,
      mainPlan,
      subPlan,
      startDate,
      endDate,
      status,
      branchId,
      showAll,
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
      message: error.message || "Something went wrong",
    });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await GeneratedInvoiceServices.delete(req.params.id);
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

const getUniqueStudent = async (req, res) => {
  try {
    const result = await GeneratedInvoiceServices.getNamesFromLeadAndStudents(
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
      message: error.message || "Something went wrong",
    });
  }
};

const exportDataToExcel = async (req, res) => {
  try {
    const ids = req.query.ids?.split(",") || [];
    const result = await GeneratedInvoiceServices.exportDataToExcel(ids);

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

const getInvoiceWithTotals = async (req, res) => {
  try {
    const result = await GeneratedInvoiceServices.getInvoiceWithTotals(
      req.query.id,
      req.query.mainPlan
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
      message: error.message,
    });
  }
};

const getInvoiceHistory = async (req, res) => {
  try {
    const { id, mainPlan, subPlan } = req.query;
    const result = await GeneratedInvoiceServices.getInvoiceHistory(
      id,
      mainPlan,
      subPlan
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
      message: error.message,
    });
  }
};

const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.query;
    const result = await GeneratedInvoiceServices.getFinancialSummary(
      startDate,
      endDate,
      branchId
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    console.log("errorrr" , error);
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
  deleteData,
  getUniqueStudent,
  exportDataToExcel,
  getInvoiceWithTotals,
  getInvoiceHistory,
  getFinancialSummary,
};
