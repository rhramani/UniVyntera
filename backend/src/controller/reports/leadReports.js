const path = require("path");
const leadReportsServices = require("../../services/reports/leadReports");

const getAllUniqueSources = async (req, res) => {
  try {
    const result = await leadReportsServices.getAllUniqueSources();
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

const leadSourceReport = async (req, res) => {
  try {
    const {
      page,
      limit,
      searchOnField,
      search,
      source,
      status,
      subStatus,
      assignId,
      assignRole,
      branchId,
      showAll,
      startDate,
      endDate,
      leadActivity,
      country,
      followUpType,
      lead_from,
    } = req.query;


    console.log("countrycountrycountry" ,country);
    const result = await leadReportsServices.leadSourceReport(
      page,
      limit,
      searchOnField,
      search,
      source,
      status,
      subStatus,
      assignId,
      assignRole,
      req.user,
      branchId,
      showAll,
      startDate,
      endDate,
      leadActivity,
      country,
      followUpType,
      lead_from
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

    const result = await leadReportsServices.exportDataToExcel(ids);

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
  getAllUniqueSources,
  leadSourceReport,
  exportDataToExcel,
};
