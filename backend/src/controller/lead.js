const leadServices = require("../services/lead");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const user = require("../../model/user");
const branch = require("../../model/branch/branches");
const Role = require("../../model/masters/roles");
const studentProcessHistory = require("../../model/studentProcessHistory.js");
const inquiry = require("../../model/masters/lead/inquiry");
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../../middleware/cloudinary");
const { getLeadNextSequence } = require("../../helpers/nextIdSequence");
const Lead = require("../../model/lead");

// 1. Get all active lead forms for a page
const getActiveLeadForms = async (pageId, pageAccessToken) => {
  const url = `https://graph.facebook.com/v19.0/${pageId}/leadgen_forms?access_token=${pageAccessToken}`;
  const response = await axios.get(url);

  return response.data.data.filter((form) => form.status === "ACTIVE");
};

// 2. Get recent leads (within 30 min) from a form
const getLeadsFromForm = async (formId, pageAccessToken) => {
  const url = `https://graph.facebook.com/v19.0/${formId}/leads?access_token=${pageAccessToken}`;
  const response = await axios.get(url);

  const leads = response.data.data;

  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60000);

  const filteredLeads = leads.filter((lead) => {
    const leadTime = new Date(lead.created_time);
    return leadTime >= thirtyMinutesAgo;
  });
  return filteredLeads;
};

// 3. Extract name, phone, city from field_data
const extractLeadData = (fieldData) => {
  const lead = {
    name: "",
    phone: "",
    city: "",
    email: "",
  };

  fieldData.forEach((field) => {
    if (field.name === "full_name") {
      lead.name = field.values[0];
    }
    if (field.name === "phone_number") {
      lead.phone = field.values[0];
    }
    if (field.name === "city") {
      lead.city = field.values[0];
    }
    if (field.name === "email") {
      lead.email = field.values[0];
    }
  });

  return lead;
};

const fetchAndSubmitFacebookLeads = async (pageId, pageAccessToken) => {
  const forms = await getActiveLeadForms(pageId, pageAccessToken);

  for (const form of forms) {
    const leads = await getLeadsFromForm(form.id, pageAccessToken);

    for (const lead of leads) {
      const parsedLead = extractLeadData(lead.field_data);
      parsedLead.lead_form = form.name;

      if (parsedLead.name && parsedLead.phone) {
        // 👇 Check if the lead already exists (same phone + same form)
        const existing = await leadServices.findLeadByPhoneAndForm(
          parsedLead.phone,
          parsedLead.lead_form,
        );

        if (!existing) {
          await leadServices.createLead(parsedLead);
        } else {
          console.log(
            `Duplicate lead skipped: ${parsedLead.phone} (${parsedLead.lead_form})`,
          );
        }
      }
    }
  }
};

const addLead = async (req, res) => {
  try {
    const {
      userId = null,
      userName: userNameFromUser = null,
      userType: userTypeFromUser = null,
      b2bName = null,
      branch = null,
      role = null,
    } = req.user || {};

    // Prefer values from req.body, else fallback to req.user
    const userName = req.body.userName || userNameFromUser;
    const userType = req.body.userType || userTypeFromUser;

    const result = await leadServices.createLead(
      req.body,
      userId,
      userName,
      userType,
      b2bName,
      branch,
      role,
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

const bulkAddLeads = async (req, res) => {
  try {
    const filePath = req.files?.excelFile?.[0].path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    let rows = xlsx.utils.sheet_to_json(sheet);
    const seenEmail = new Set();
    const seenPhone = new Set();

    rows = rows.filter((item) => {
      if (seenEmail.has(item.email) || seenPhone.has(item.phone)) {
        return false;
      }
      seenEmail.add(item.email);
      seenPhone.add(item.phone);
      return true;
    });

    const inquiryNames = [
      ...new Set(rows.map((r) => r.inquiry_for).filter(Boolean)),
    ];

    const currentUser = req.user;

    // Collect all names for lookups
    const userNames = [
      ...new Set(rows.map((r) => r.lead_assign).filter(Boolean)),
    ];
    const branchNames = [
      ...new Set(rows.map((r) => r.branch_lead_assign).filter(Boolean)),
    ];
    const roleNames = [
      ...new Set(rows.map((r) => r.lead_assign_role).filter(Boolean)),
    ];

    // Fetch users and branches first
    const [users, branches] = await Promise.all([
      user.find({ name: { $in: userNames } }).select("_id name"),
      branch.find({ name: { $in: branchNames } }).select("_id name"),
    ]);

    const userMap = Object.fromEntries(
      users.map((u) => [u.name.toLowerCase(), u._id]),
    );
    const branchMap = Object.fromEntries(
      branches.map((b) => [b.name.toLowerCase(), b._id]),
    );

    // Check Lead in Db
    const filteredRows = [];
    for (const row of rows) {
      const exists = await Lead.exists({
        $or: [{ email: row.email }, { phone: row.phone }],
      });
      if (!exists) {
        filteredRows.push(row);
      } // keep only non-existing
    }
    rows = filteredRows;

    const inquiryTypes = await inquiry
      .find({
        name: { $in: inquiryNames },
      })
      .select("_id name");

    const inquiryMap = Object.fromEntries(
      inquiryTypes.map((i) => [i.name.toLowerCase(), i._id]),
    );

    const formattedLeads = [];

    for (const row of rows) {
      const branchName = row.branch_lead_assign?.trim()?.toLowerCase() || "";
      const roleName = row.lead_assign_role?.trim() || "";

      let branchId = null;
      let roleId = null;

      // 1️⃣ Resolve branch and role
      if (branchName && branchName !== "head office") {
        branchId = branchMap[branchName] || null;

        const role = await Role.findOne({
          name: roleName,
          branchId: branchId,
        }).select("_id");

        roleId = role ? role._id : null;
      } else if (branchName === "head office") {
        const role = await Role.findOne({
          name: roleName,
          $or: [{ branchId: null }, { branchId: { $exists: false } }],
        }).select("_id");

        roleId = role ? role._id : null;
      }

      if(row["lead_assign_role"] && row["lead_assign_role"] == null){
        roleId = req.user.role._id
      } else if(row && row["lead_assign_role"]) {
        const findRole = await Role.findOne({
          name: row["lead_assign_role"],
        }).select("_id");
        roleId = findRole._id
      }

      if(row && row.lead_assign){
        // row["lead_assign"] = req.user.userId
        // roleId = req.user.role._id

        if(row["lead_assign"] == ""){
          row["lead_assign"] = req.user.userId
          roleId = req.user.role._id
        } else {
          const findAssign = await user.findOne({
            name: row["lead_assign"],
          }).select("_id role");
          row["lead_assign"] = findAssign._id
          roleId = findAssign.role
        }

      } else {
        row["lead_assign"] = req.user.userId
        roleId = req.user.role._id
      }

      // 2️⃣ Generate unique lead sequence
      const leadId = await getLeadNextSequence("lead", "LE", 5);

      const educationDetails = [];

      if (
        row.degree ||
        row.stream ||
        row.moi ||
        row.year ||
        row.score ||
        row.institution
      ) {
        educationDetails.push({
          degree: row.degree || "",
          stream: row.stream || "",
          moi: row.moi || "",
          year: row.year ? Number(row.year) : null,
          score: row.score ? Number(row.score) : null,
          imstitution: row.institution || "",
          backlogs: row.backlogs ? Number(row.backlogs) : 0,
        });
      }

      let inquiryForId = null;
      let inquiryForOther = "";

      if (row.inquiry_for) {
        const inquiryText = row.inquiry_for.trim().toLowerCase();

        if (inquiryMap[inquiryText]) {
          inquiryForId = inquiryMap[inquiryText];
        } else {
          inquiryForOther = row.inquiry_for.trim();
        }
      }

      // 3️⃣ Construct lead object
      formattedLeads.push({
        leadId,
        name: row.name || "",
        email: row.email || "",
        phone: row.phone || "",
        city: row.city || "",
        lead_status: row.lead_status || "New",
        lead_form: row.lead_form || "Excel",
        country_interested: Array.isArray(row.prefferedCountry)
          ? row.prefferedCountry
          : typeof row.prefferedCountry === "string"
          ? row.prefferedCountry
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
        lead_assign: row["lead_assign"],
        // lead_assign: userMap[row.lead_assign?.toLowerCase()] || null,
        lead_assign_Branch: branchName === "head office" ? null : branchId,
        lead_role: roleId,
        education_details: educationDetails,
        inquiry_for: inquiryForId,
        inquiry_for_other: inquiryForOther,
        created_by: currentUser.userId,
        createdByName: currentUser.userName,
        created_by_type: currentUser.userType,
      });
    }

    // 4️⃣ Insert all leads
    const insertedLeads = await leadServices.insertManyLeads(formattedLeads);

    const historyEntries = insertedLeads.map((lead) => ({
      leadId: lead._id,
      history: [
        {
          event: "lead_created",
          value: lead.name,
          updatedBy: currentUser.userId,
          updatedByName: currentUser.userName,
        },
      ],
    }));

    await studentProcessHistory.insertMany(historyEntries);

    // 5️⃣ Clean up
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Leads uploaded successfully",
      data: insertedLeads,
    });
  } catch (error) {
    console.error("Bulk Add Error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// const bulkAddLeads = async (req, res) => {
//   try {
//     const filePath = req.files?.excelFile?.[0].path;
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = xlsx.utils.sheet_to_json(sheet);

//     const currentUser = req.user;

//     if (!rows.length) {
//       return res.status(400).json({ message: "Excel file is empty" });
//     }

//     // Collect all names for lookup
//     const userNames = [...new Set(rows.map(r => r.lead_assign).filter(Boolean))];
//     const branchNames = [...new Set(rows.map(r => r.branch_lead_assign).filter(Boolean))];
//     const roleNames = [...new Set(rows.map(r => r.lead_assign_role).filter(Boolean))];

//     // Fetch users and branches
//     const [users, branches] = await Promise.all([
//       user.find({ name: { $in: userNames } }).select("_id name"),
//       branch.find({ name: { $in: branchNames } }).select("_id name"),
//     ]);

//     const userMap = Object.fromEntries(users.map(u => [u.name.toLowerCase(), u._id]));
//     const branchMap = Object.fromEntries(branches.map(b => [b.name.toLowerCase(), b._id]));

//     // ✅ Step 1: Collect all phone and email values from Excel
//     const phones = rows
//       .map(r => (r.phone ? String(r.phone).trim() : ""))
//       .filter(Boolean);
//     const emails = rows
//       .map(r => (r.email ? String(r.email).trim().toLowerCase() : ""))
//       .filter(Boolean);

//     // ✅ Step 2: Fetch existing leads with matching phone or email
//     const existingLeads = await Lead.find({
//       $or: [
//         { phone: { $in: phones } },
//         { email: { $in: emails } },
//       ],
//     }).select("phone email");

//     const existingPhones = new Set(
//       existingLeads.map(l => (l.phone ? String(l.phone).trim() : ""))
//     );
//     const existingEmails = new Set(
//       existingLeads.map(l => (l.email ? String(l.email).trim().toLowerCase() : ""))
//     );

//     const formattedLeads = [];

//     // ✅ Step 3: Skip rows with phone/email already in DB
//     for (const row of rows) {
//       const phone = row.phone ? String(row.phone).trim() : "";
//       const email = row.email ? String(row.email).trim().toLowerCase() : "";

//       if ((phone && existingPhones.has(phone)) || (email && existingEmails.has(email))) {
//         continue; // skip duplicate found in DB
//       }

//       const branchName = row.branch_lead_assign?.trim()?.toLowerCase() || "";
//       const roleName = row.lead_assign_role?.trim() || "";

//       let branchId = null;
//       let roleId = null;

//       // Find role by branch
//       if (branchName && branchName !== "head office") {
//         branchId = branchMap[branchName] || null;
//         const role = await Role.findOne({
//           name: roleName,
//           branchId: branchId,
//         }).select("_id");
//         roleId = role ? role._id : null;
//       } else if (branchName === "head office") {
//         const role = await Role.findOne({
//           name: roleName,
//           $or: [{ branchId: null }, { branchId: { $exists: false } }],
//         }).select("_id");
//         roleId = role ? role._id : null;
//       }

//       formattedLeads.push({
//         name: row.name || "",
//         email,
//         phone,
//         city: row.city || "",
//         lead_status: row.lead_status || "New",
//         lead_form: row.lead_form || "Excel",
//         country_interested: Array.isArray(row.prefferedCountry)
//           ? row.prefferedCountry
//           : typeof row.prefferedCountry === "string"
//             ? row.prefferedCountry.split(",").map(c => c.trim()).filter(Boolean)
//             : [],
//         lead_assign: userMap[row.lead_assign?.toLowerCase()] || null,
//         lead_assign_Branch: branchName === "head office" ? null : branchId,
//         lead_role: roleId,
//         created_by: currentUser.userId,
//         createdByName: currentUser.userName,
//         created_by_type: currentUser.userType,
//       });
//     }

//     if (!formattedLeads.length) {
//       fs.unlinkSync(filePath);
//       return res.status(200).json({
//         message: "No new leads to insert (all exist in database)",
//       });
//     }

//     // ✅ Step 4: Insert only new leads
//     const insertedLeads = await leadServices.insertManyLeads(formattedLeads);

//     fs.unlinkSync(filePath);

//     res.status(200).json({
//       message: `Leads uploaded successfully. ${insertedLeads.length} new leads added.`,
//       data: insertedLeads,
//     });
//   } catch (error) {
//     console.error("Bulk Add Error:", error);
//     res.status(500).json({ message: "Something went wrong", error });
//   }
// };

const getLead = async (req, res) => {
  try {
    const result = await leadServices.getLeadById(req.params.id);

    return res.status(200).json({ status: true, code: 200, data: result });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, message: error.message });
  }
};

const getAllLead = async (req, res) => {
  try {
    const {
      page,
      limit,
      status,
      subStatus,
      startDate,
      endDate,
      searchOnField,
      search,
      assignId,
      assignRole,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country,
      updatedOn,
      otherService,
    } = req.query;

    const result = await leadServices.getAllLead(
      page,
      limit,
      searchOnField,
      search,
      status,
      subStatus,
      startDate,
      endDate,
      req.user,
      assignId,
      assignRole,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country,
      updatedOn,
      otherService,
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

const getB2BLead = async (req, res) => {
  try {
    const {
      page,
      limit,
      status,
      subStatus,
      startDate,
      endDate,
      searchOnField,
      search,
      assignId,
      lead_from,
      b2bId,
      leadActivity,
      followUpType,
      country,
      branchId,
      assignRole,
      showAll,
      updatedOn,
    } = req.query;
    const result = await leadServices.getB2BLead(
      page,
      limit,
      searchOnField,
      search,
      startDate,
      endDate,
      status,
      subStatus,
      country,
      assignId,
      lead_from,
      b2bId,
      leadActivity,
      followUpType,
      branchId,
      assignRole,
      showAll,
      updatedOn,
      req.user,
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

const LeadsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      page,
      limit,
      status,
      subStatus,
      startDate,
      endDate,
      searchOnField,
      search,
      assignId,
      assignRole,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country,
      updatedOn,
    } = req.query;

    const result = await leadServices.LeadsByUserId(
      userId,
      page,
      limit,
      searchOnField,
      search,
      status,
      subStatus,
      startDate,
      endDate,
      lead_from,
      leadActivity,
      followUpType,
      country,
      assignId,
      assignRole,
      branchId,
      showAll,
      updatedOn,
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
      req.user?.role,
    );
    if (!result)
      return res
        .status(404)
        .json({ status: false, code: 404, message: "Lead not found" });

    return res.status(200).json({ status: true, code: 200, data: result });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: false, code: 500, message: error.message });
  }
};

const bulkLeadAssign = async (req, res) => {
  try {
    const { leadIds, lead_assign_Branch, lead_role, lead_assign } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Lead IDs array is required",
      });
    }

    if (!lead_assign_Branch && lead_assign_Branch !== null) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Branch Lead Assign is required",
      });
    }

    const result = await leadServices.bulkUpdateLeadAssign(
      leadIds,
      {
        lead_assign_Branch,
        lead_role: lead_role || null,
        lead_assign: lead_assign || null,
      },
      req.user?.userId,
      req.user?.userName,
      req.user?.role,
    );

    return res.status(200).json({
      status: true,
      code: 200,
      message: `${result.updatedCount} leads assigned successfully`,
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

const getLeadHistory = async (req, res) => {
  try {
    const result = await leadServices.getLeadHistory(req.params.id);
    if (!result)
      return res
        .status(404)
        .json({ status: false, code: 404, message: "Lead history not found" });

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

const bulkDeleteLeads = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "IDs array is required" });
    }

    const result = await leadServices.deleteManyLeads(ids);

    return res.status(200).json({
      status: true,
      code: 200,
      message: `${result.deletedCount} leads deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ status: false, code: 500, message: error.message });
  }
};

const filterLeadsByDate = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await leadServices.filterLeadsByDate(
      startDate,
      endDate,
      page,
      limit,
      status,
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

// const downloadLeads = async (req, res) => {
//   try {
//     // Get leadIds from query and split into array
//     const leadIdsParam = req.query.leadIds;

//     if (!leadIdsParam) {
//       return res.status(400).json({
//         status: false,
//         message: "No lead IDs provided.",
//       });
//     }

//     // Split comma-separated string into array
//     const leadIds = leadIdsParam.split(",").map((id) => id.trim());

//     if (!Array.isArray(leadIds) || leadIds.length === 0) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid lead ID list.",
//       });
//     }

//     const result = await leadServices.downloadLeadsByIdsService(leadIds);

//     if (!result.success) {
//       return res.status(404).json({
//         status: false,
//         message: result.message,
//       });
//     }

//     const fileName = path.basename(result.filePath);
//     const fileUrl = `/public/${fileName}`;

//     return res.status(200).json({
//       status: true,
//       code: 200,
//       fileUrl,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

const downloadAllLeads = async (req, res) => {
  try {
    const {
      search,
      status,
      subStatus,
      startDate,
      endDate,
      assignId,
      assignRole,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country,
    } = req.query;

    const currentUser = req.user;
    const result = await leadServices.downloadLeadsByFilter({
      search,
      status,
      subStatus,
      startDate,
      endDate,
      currentUser,
      assignId,
      assignRole,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country,
    });

    if (!result.success) {
      return res.status(404).json({
        status: false,
        message: result.message,
      });
    }

    const fileName = path.basename(result.filePath);
    const fileUrl = `/public/${fileName}`;

    res.status(200).json({
      status: true,
      fileUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getFollowUpLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      searchOnField,
      search = "",
      leadActivity,
      status,
      subStatus,
      lead_from,
      followUpType,
      country,
      branchId,
      showAll,
      assignId,
      assignRole,
      startDate,
      endDate,
      updatedOn,
    } = req.query;
    const currentUser = req.user;

    const role =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    const result = await leadServices.getAllFollowUpLeads(
      parseInt(page),
      parseInt(limit),
      searchOnField,
      search,
      currentUser.userId,
      role,
      leadActivity,
      status,
      subStatus,
      lead_from,
      followUpType,
      country,
      branchId,
      showAll,
      assignId,
      assignRole,
      startDate,
      endDate,
      updatedOn,
    );

    res.status(200).json({ status: true, code: 200, data: result });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};
const getFollowUpLeadsByDate = async (req, res) => {
  try {
    const {
      page,
      limit,
      date,
      searchOnField,
      search,
      leadActivity,
      status,
      subStatus,
      lead_from,
      followUpType,
      country,
      branchId,
      showAll,
      assignId,
      assignRole,
      updatedOn,
    } = req.query;
    const currentUser = req.user;

    const role =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    const data = await leadServices.getFollowUpLeadsByDate(
      page,
      limit,
      date,
      searchOnField,
      search,
      currentUser.userId,
      role,
      leadActivity,
      status,
      subStatus,
      lead_from,
      followUpType,
      country,
      branchId,
      showAll,
      assignId,
      assignRole,
      updatedOn,
    );

    return res.status(200).json({
      success: true,
      message: "Follow-up leads fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getLeadsByAssignedUser = async (req, res) => {
  try {
    const { page, limit, search = "" } = req.query;
    const userId = req.params.id;

    const result = await leadServices.getLeadsByAssignedUser(
      page,
      limit,
      search,
      userId,
    );

    return res.status(200).json({
      status: true,
      message: "Leads fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const birthday = async (req, res) => {
  try {
    const { page, limit, search = "", date } = req.query;
    const result = await leadServices.birthday(page, limit, search, date);
    return res.status(200).json({
      status: true,
      message: "Leads fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const convertLeadToApplication = async (req, res) => {
  try {
    const { userId, userName, userType, b2bName, branch } = req.user;

    let {
      categoryDetails,
      preferredCountry,
      admissionProcess,
      visitorApplication,
      admissionData,
      visitorInvoice,
      email,
    } = req.body;

    let coachingDetails = req.body.coachingData;

    // ✅ Parse if strings
    if (typeof coachingDetails === "string") {
      coachingDetails = JSON.parse(coachingDetails);
    }
    if (typeof categoryDetails === "string") {
      categoryDetails = JSON.parse(categoryDetails);
    }

    // ✅ Handle Coaching Docs (array)
    if (req.files && req.files.coachingDoc) {
      const files = Array.isArray(req.files.coachingDoc)
        ? req.files.coachingDoc
        : [req.files.coachingDoc];

      if (
        coachingDetails.examDetails &&
        Array.isArray(coachingDetails.examDetails)
      ) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          const uploadRes = await uploadToCloudinary(
            file.buffer,
            file.mimetype,
            "coachingDoc",
          );

          if (coachingDetails.examDetails[i]) {
            coachingDetails.examDetails[i].document = uploadRes.secure_url;
          }
        }
      }
    }
    // ✅ Handle Category Docs (array)
    if (req.files && req.files.categoryDoc) {
      const files = Array.isArray(req.files.categoryDoc)
        ? req.files.categoryDoc
        : [req.files.categoryDoc];

      if (Array.isArray(categoryDetails)) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          const uploadRes = await uploadToCloudinary(
            file.buffer,
            file.mimetype,
            "categoryDoc",
          );

          if (categoryDetails[i]) {
            categoryDetails[i].document = uploadRes.secure_url;
          }
        }
      }
    }

    req.body.coachingDetails = coachingDetails;
    req.body.categoryDetails = categoryDetails;

    // ✅ Call service
    const result = await leadServices.convertLeadToStudentApplication(
      req.params.id,
      userId,
      userName,
      userType,
      b2bName,
      branch,
      preferredCountry,
      admissionProcess,
      coachingDetails,
      visitorApplication,
      categoryDetails,
      admissionData,
      visitorInvoice,
      email,
    );

    res.status(200).json({
      status: true,
      message: "Lead converted successfully",
      data: result,
    });
  } catch (error) {
    console.log("error in convertLeadToApplication", error);
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const AssignedLead = async (req, res) => {
  try {
    const result = await leadServices.getAssignedUsers(
      req.user,
      req.query.fromB2B,
    );
    return res.status(200).json({
      status: true,
      message: "Lead assigned get successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const allNewLead = async (req, res) => {
  try {
    const result = await leadServices.allNewLead();

    return res.status(200).json({
      success: true,
      message: `Fetched all leads with status 'New'.`,
      totalLeads: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const LeadFroms = async (req, res) => {
  try {
    const result = await leadServices.getLeadFrom();
    return res.status(200).json({
      status: true,
      message: "Lead froms get successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const sendWPMessage = async (req, res) => {
  try {
    const result = await leadServices.sendWPMessage(req.body);
    res.status(200).json({
      status: true,
      message: "Lead converted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const countryList = async (req, res) => {
  try {
    const result = await leadServices.countryList(req.query.fromB2B);
    res.status(200).json({
      status: true,
      message: "Country list get successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const eodReport = async (req, res) => {
  try {
    const result = await leadServices.eodReport();

    res.status(200).json({
      status: true,
      message: "Fetched EOD Report",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message | "Something went wrong",
    });
  }
};

const applicationProcess = async (req, res) => {
  try {
    const result = await leadServices.applicationProcess(req.params.id);
    res.status(200).json({
      status: true,
      message: "Fetched EOD Report",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message | "Something went wrong",
    });
  }
};

const getPendingFollowUps = async (req, res) => {
  try {
    const {
      page,
      limit,
      status,
      subStatus,
      searchOnField,
      search,
      assignId,
      assignRole,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country,
      updatedOn,
    } = req.query;

    const result = await leadServices.getPendingFollowUps(
      page,
      limit,
      searchOnField,
      search,
      status,
      subStatus,
      req.user,
      assignId,
      assignRole,
      lead_from,
      branchId,
      showAll,
      leadActivity,
      followUpType,
      country,
      updatedOn,
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

module.exports = {
  addLead,
  bulkAddLeads,
  getLead,
  updateLead,
  bulkLeadAssign,
  getLeadHistory,
  deleteLead,
  getAllLead,
  getB2BLead,
  LeadsByUserId,
  filterLeadsByDate,
  // downloadLeads,
  downloadAllLeads,
  bulkDeleteLeads,
  fetchAndSubmitFacebookLeads,
  getFollowUpLeads,
  getFollowUpLeadsByDate,
  getLeadsByAssignedUser,
  convertLeadToApplication,
  AssignedLead,
  LeadFroms,
  sendWPMessage,
  countryList,
  eodReport,
  birthday,
  allNewLead,
  applicationProcess,
  getPendingFollowUps,
};
