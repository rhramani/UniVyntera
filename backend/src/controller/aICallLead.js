const leadServices = require("../services/aiCallLead");

const addLead = async (req, res) => {
  try {
    const {
      userId = null,
      userName = null,
      userType = null,
      b2bName = null,
      branch = null,
      role = null,
    } = req.user || {};

    const result = await leadServices.createLead(
      req.body,
      userId,
      userName,
      userType,
      b2bName,
      branch,
      role
    );

    return res.status(201).json({ status: true, code: 201, data: result });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getAllLead = async (req, res) => {
  try {
    const {
      page,
      limit,
      status,
      startDate,
      endDate,
      search,
      assignId,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country,
    } = req.query;
    const result = await leadServices.getAllLead(
      page,
      limit,
      search,
      status,
      startDate,
      endDate,
      req.user,
      assignId,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result.leads,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalLeads: result.totalLeads,
    });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const result = await leadServices.updateLead(
      req.params.id,
      req.body,
      req.user?.userId,
      req.user?.userName,
      req.user?.role
    );
    if (!result)
      return res
        .status(404)
        .json({ status: false, code: 404, message: "Lead not found" });

    return res.status(200).json({ status: true, code: 200, data: result });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const result = await leadServices.deleteLead(req.params.id);
    if (!result)
      return res
        .status(404)
        .json({ status: false, code: 404, message: "Lead not found" });

    return res
      .status(200)
      .json({ status: true, code: 200, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, message: error.message });
  }
};

const getLead = async (req, res) => {
  try {
    const result = await leadServices.getLeadById(req.params.id);

    return res.status(200).json({ status: true, code: 200, data: result });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, message: error.message });
  }
};

module.exports = {
  addLead,
  updateLead,
  deleteLead,
  getAllLead,
  getLead
};
