const allReportservices = require("../../services/reports/allReports");

const overAllReport = async (req, res) => {
  try {
    const { startDate, endDate, search, page, limit } = req.query;
    const result = await allReportservices.overAll(
      page,
      limit,
      search,
      startDate,
      endDate
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

const leadFromReport = async (req, res) => {
  try {
    const { startDate, endDate, search, page, limit } = req.query;
    const result = await allReportservices.leadFrom(
      startDate,
      endDate,
      search,
      page,
      limit,
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

const visaNumberCounselorReport = async (req, res) => {
  try {
    const { startDate, endDate, search, page, limit } = req.query;
    const result = await allReportservices.visaNumbercounselor(
      startDate,
      endDate,
      search,
      page,
      limit
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

const counselorPerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate, search, page, limit } = req.query;
    const result = await allReportservices.counselorPerformance(
      startDate,
      endDate,
      search,
      page,
      limit
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

const branchWiseAdmissionsReport = async (req, res) => {
  try {
    const { startDate, endDate, search, page, limit } = req.query;
    const result = await allReportservices.branchWiseAdmissions(
      startDate,
      endDate,
      search,
      page,
      limit
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

const branchPerformanceReport = async (req, res) => {
  try {
    const { startDate, endDate, search, page, limit } = req.query;
    const result = await allReportservices.getBranchPerformance(
      startDate,
      endDate,
      search,
      page,
      limit
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
const getAdmissionReport = async (req, res) => {
  try {
    const { startDate, endDate, search, page, limit } = req.query;
    const result = await allReportservices.getAdmission(
      startDate,
      endDate,
      search,
      page,
      limit
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

const visaCollectionReport = async (req, res) => {
  try {
    const { startDate, endDate, search, page, limit } = req.query;
    const result = await allReportservices.visaCollection(
      startDate,
      endDate,
      search,
      page,
      limit
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

const branchTotalApplicationReport = async (req, res) => {
  try {
    const result = await allReportservices.branchTotalApplication();

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

const visitorVisaReport = async (req, res) => {
  try {
    const { page, limit, search, startDate, endDate } = req.query;
    const result = await allReportservices.visitorVisaReport(
      page,
      limit,
      search,
      startDate,
      endDate
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

const coachingReport = async (req, res) => {
  try {
    const { page, limit, search, startDate, endDate } = req.query;
    const result = await allReportservices.coachingReport(
      page,
      limit,
      search,
      startDate,
      endDate
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

module.exports = {
  overAllReport,
  leadFromReport,
  visaNumberCounselorReport,
  counselorPerformanceReport,
  branchWiseAdmissionsReport,
  branchPerformanceReport,
  getAdmissionReport,
  visaCollectionReport,
  branchTotalApplicationReport,
  visitorVisaReport,
  coachingReport
};
