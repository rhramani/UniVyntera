const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const mongoose = require("mongoose");

const GenerateInvoice = require("../../model/generateInvoice");
const user = require("../../model/user");
const aiCallLead = require("../../model/aiCallLead.js");
const leadTracking = require("../../model/LeadTracking");
const StudentApplication = require("../../model/masters/studentApplication/studentApplication");
const VisitorApplication = require("../../model/visitorApplication/visitorApplication");
const B2BAdmin = require("../../model/masters/b2b/b2bAdmin");
const B2BMember = require("../../model/masters/b2b/b2bMember");
const Branch = require("../../model/branch/branches");
const BranchMember = require("../../model/branch/branchMember");

const WpTemplate = require("../../model/masters/wptemplate");

const sendEODReport = require("../../utils/eodReport");

const {
  getNextSequence,
  getVisitorNextSequence,
} = require("../../helpers/nextIdSequence");
const { uploadToCloudinary } = require("../../middleware/cloudinary");
const paginate = require("../../utils/pagination");
const trackLeadChanges = require("../../helpers/leadTracking");
const {
  sendLeadAssignEmail,
  sendStudentWelcomeEmail,
  sendCoachingWelcomeEmail,
  sendVisitorWelcomeEmail,
} = require("../../middleware/nodemailer");
const { getNotificationNamespace } = require("../../socket");
const notification = require("../../model/masters/notification/notification.js");

const { sendSingleMessage } = require("./waDaddy/campaign");
const followUpType = require("../../model/masters/lead/followUpType.js");

const createLead = async (
  leadData,
  userId,
  userName,
  userType,
  b2bName,
  branch,
  role
) => {
  leadData.created_by = userId;
  leadData.createdByName = userName;
  leadData.created_by_type = userType;
  if (!leadData.lead_role) {
    leadData.lead_role = null;
  }
  if (!leadData.lead_assign) {
    leadData.lead_assign = null;
  }

  if (b2bName) {
    leadData.b2bCompany = b2bName;
  }
  if (branch) {
    leadData.branch = branch;
  }

  let resolvedRole = typeof role === "string" ? role || role : role?.name;
  const lead = await aiCallLead.create({
    ...leadData,
  });

  (async () => {
    try {
      if (lead.phone) {
        await sendSingleMessage({
          to: lead.contact,
          templateId: null,
          templateName: "welcome_lead1",
          fromNumberId: "917359266930", // your WhatsApp number ID
          languageCode: "en",
          parameters: {
            body: [lead.name], // dynamically add lead name
          },
        });
      } else {
        console.warn(`⚠️ aiCallLead ${lead._id} has no contact number`);
      }
    } catch (whatsappError) {
      console.error(
        `Failed to send WhatsApp welcome for lead ${lead._id}:`,
        whatsappError
      );
    }
  })();

  if (sendLeadAssignEmail) {
    const assignedUser = await user.findById(lead.lead_assign);
    if (assignedUser?.email) {
      await sendLeadAssignEmail(
        assignedUser.email,
        assignedUser.name,
        lead.name,
        userName,
        resolvedRole
      );

      const newNotification = await notification.create({
        recipientId: lead.lead_assign,
        message: `A new lead "${lead.name}" has been assigned to you by ${userName}.`,
        leadId: lead._id,
        createdBy: userId,
      });

      const notificationNamespace = getNotificationNamespace();
      const notificationData = await notification.find({
        recipientId: lead.lead_assign,
      });

      if (notificationNamespace) {
        console.log(
          "📡 Emitting notification to recipientId:",
          lead.lead_assign
        );

        notificationNamespace
          .to(String(lead.lead_assign))
          .emit("receive_notification", newNotification);
      } else {
        console.warn("⚠️ No notificationNamespace found. Cannot emit.");
      }
    } else {
      console.warn("⚠️ Assigned user not found or no email:", lead.lead_assign);
    }
  }

  return lead;
};

const getAllLead = async (
  page = 1,
  limit = 10,
  search,
  status,
  startDate,
  endDate,
  currentUser,
  assignedToUserId,
  lead_from,
  branchId,
  showAll = false,
  leadActivity,
  followUpType,
  country
) => {
  const skip = (page - 1) * limit;
  const filter = {
    $and: [
      {
        $or: [{ fromB2B: false }, { fromB2B: { $exists: false } }],
      },
    ],
  };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };
  }
  if (lead_from) {
    filter.lead_form = lead_from;
  }

  if (search) {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { alternate_contact: regex },
      { address: regex },
      { country_interested: regex },
      { course: regex },
      { level: regex },
      { budget: regex },
      { english_proficiency: regex },
      { passport: regex },

      // { work_experience: regex },
      // { work_post: regex },
      // { visited_countries: regex },
      // { visa_type: regex },
      // { refused_country: regex },
      // { refused_visa_type: regex },
      // { city: regex },
      // { pincode: regex },
      // { remarks: regex },
      // { lead_status: regex },
      // { form_type: regex },
      // { lead_text_remark: regex },
      // { lead_followup_remark: regex },
      // { createdByName: regex },
      // { updatedByName: regex },
      // { intake: regex },
      // { source_of_reference: regex },
      // { "education_details.degree": regex },
      // { "education_details.stream": regex },
      // { "education_details.institution": regex },
      // { "education_evaluation.test_name": regex },
    ];
  }

  if (status) {
    filter.lead_status = status;
  }
  if (country) {
    filter.country_interested = {
      $in: [new RegExp(`^${country}$`, "i")], // 'i' makes it case-insensitive
    };
  }

  if (assignedToUserId && mongoose.Types.ObjectId.isValid(assignedToUserId)) {
    filter.lead_assign = assignedToUserId;
  }

  if (followUpType && mongoose.Types.ObjectId.isValid(followUpType)) {
    filter.follow_up_type = followUpType;
  }
  if (leadActivity === "Active") {
    filter.$or = [{ deadLead: false }, { deadLead: { $exists: false } }];
  } else if (leadActivity === "Inactive") {
    filter.deadLead = true;
  }

  const roleName =
    typeof currentUser.role === "string"
      ? currentUser.role
      : currentUser.role?.name;

  const userRole =
    typeof currentUser.role === "string"
      ? currentUser.userRole
      : currentUser.userRole?.name;

  if (roleName === "B2B Admin") {
    const b2bMembers = await B2BMember.find({
      b2bAdmin: currentUser.userId,
    }).select("_id");
    const memberIds = b2bMembers.map((member) => member._id.toString());
    filter.created_by = { $in: [currentUser.userId, ...memberIds] };
  } else if (roleName === "B2B Member") {
    filter.created_by = currentUser.userId;
  } else if (roleName === "Branch") {
    const branchMembers = await user
      .find({
        branchId: currentUser.userId,
      })
      .select("_id");
    const branchMemberIds = branchMembers.map((member) =>
      member._id.toString()
    );
    filter.$or = [
      { created_by: { $in: [currentUser.userId, ...branchMemberIds] } },
      { lead_assign_Branch: currentUser.userId },
    ];
  } else if (userRole === "Branch User") {
    filter.created_by = currentUser.userId;
  } else if (roleName === "Super Admin") {
    if (String(showAll) === "true") {
      // Show all leads, no branchId filtering
    } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      const branchUsers = await user.find({ branchId }).select("_id");
      const branchUserIds = branchUsers.map((user) => user._id.toString());
      filter.created_by = { $in: [...branchUserIds, branchId] }; // users + branch
    } else {
      // No branchId provided, get users with no branch assigned
      const noBranchUsers = await user
        .find({ branchId: { $in: [null, undefined] } })
        .select("_id");
      const noBranchUserIds = noBranchUsers.map((user) => user._id.toString());
      filter.created_by = { $in: noBranchUserIds };
    }
  } else {
    filter.created_by_type = {
      $nin: [
        "Branch",
        "Branch User",
        "Branch Member",
        "B2B Admin",
        "B2B Member",
      ],
    };
  }

  const duplicateContacts = await aiCallLead.aggregate([
    {
      $group: {
        _id: "$phone",
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: { $gt: 1 },
        _id: { $ne: null },
      },
    },
  ]);

  const duplicateContactsSet = new Set(duplicateContacts.map((d) => d._id));

  const leads = await aiCallLead.find(filter)
    .populate({ path: "follow_up_type", select: "name" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalLeads = await aiCallLead.countDocuments(filter);

  const leadIds = leads.map((lead) => lead._id);
  const invoices = await GenerateInvoice.aggregate([
    {
      $match: {
        name: { $in: leadIds },
        dueAmount: { $ne: null, $ne: "", $ne: "0" },
      },
    },
    {
      // Only include docs where dueAmount is a valid number
      $addFields: {
        numericDueAmount: {
          $cond: {
            if: { $regexMatch: { input: "$dueAmount", regex: /^[0-9.]+$/ } },
            then: { $toDouble: "$dueAmount" },
            else: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$name",
        totalDueAmount: { $sum: "$numericDueAmount" },
      },
    },
  ]);

  const dueAmountMap = {};
  invoices.forEach((inv) => {
    dueAmountMap[inv._id.toString()] = inv.totalDueAmount;
  });
  // Group created_by by type
  const groupedByType = {
    User: [],
    B2BAdmin: [],
    B2BMember: [],
    Branch: [],
    BranchMember: [],
  };

  leads.forEach((lead) => {
    if (lead.created_by && lead.created_by_type) {
      groupedByType[lead.created_by_type]?.push(lead.created_by);
    }
  });

  const [users, b2bAdmins, b2bMembers, branches, branchMembers] =
    await Promise.all([
      user.find({ _id: { $in: groupedByType.User } }).select("name"),
      B2BAdmin.find({ _id: { $in: groupedByType.B2BAdmin } }).select(
        "companyName"
      ),
      B2BMember.find({ _id: { $in: groupedByType.B2BMember } }).select(
        "firstName lastName"
      ),
      Branch.find({ _id: { $in: groupedByType.Branch } }).select("name"),
      BranchMember.find({ _id: { $in: groupedByType.BranchMember } }).select(
        "firstName lastName"
      ),
    ]);

  const createdByMap = {};
  [
    ...users,
    ...b2bAdmins,
    ...b2bMembers,
    ...branches,
    ...branchMembers,
  ].forEach((entry) => {
    createdByMap[entry._id.toString()] = entry.name;
  });

  // aiCallLead Assign Mapping
  const userIds = leads
    .filter((lead) => mongoose.Types.ObjectId.isValid(lead.lead_assign))
    .map((lead) => lead.lead_assign.toString());

  const leadAssignUsers = await user
    .find({ _id: { $in: userIds } })
    .select("name");
  const userMap = {};
  leadAssignUsers.forEach((u) => {
    userMap[u._id.toString()] = u.name;
  });

  const leadsWithFullData = leads.map((lead) => ({
    ...lead,
    isDuplicate: duplicateContactsSet.has(lead.phone || ""),
    // createdByName: createdByMap[lead.created_by?.toString()] || "",
    lead_assign_name: mongoose.Types.ObjectId.isValid(lead.lead_assign)
      ? userMap[lead.lead_assign.toString()] || ""
      : "",
    dueAmount: dueAmountMap[lead._id.toString()] || 0,
  }));

  return {
    leads: leadsWithFullData,
    totalLeads,
    totalPages: Math.ceil(totalLeads / limit),
    currentPage: page,
  };
};

const updateLead = async (id, data, userId, userName, role) => {
  const oldLead = await aiCallLead.findById(id);

  if (!oldLead) {
    return res.status(404).json({ message: "aiCallLead not found" });
  }

  const updatedLead = await aiCallLead.findByIdAndUpdate(
    id,
    { ...data, updated_by: userId, updatedByName: userName },
    { new: true }
  );

  let resolvedRole = typeof role === "string" ? role || role : role?.name;
  if (
    data.lead_assign &&
    (!oldLead.lead_assign ||
      oldLead.lead_assign.toString() !== data.lead_assign.toString())
  ) {
    const assignedUser = await user.findById(data.lead_assign);
    if (assignedUser?.email) {
      await sendLeadAssignEmail(
        assignedUser.email,
        assignedUser.name,
        updatedLead.name,
        userName,
        resolvedRole
      );
      const newNotification = await notification.create({
        recipientId: data.lead_assign,
        message: `A new lead "${updatedLead.name}" has been assigned to you by ${userName}.`,
        leadId: updatedLead._id,
        createdBy: userId,
      });
      const notificationNamespace = getNotificationNamespace();
      const notificationData = await notification.find({
        recipientId: data.lead_assign,
      });
      if (notificationNamespace) {
        // personal
        console.log("Emitting notification to:", updatedLead);
        notificationNamespace
          .to(data.lead_assign)
          .emit("receive_notification", notificationData);
        // global (everyone in "global-notifications")
        notificationNamespace
          .to("global-notifications")
          .emit("receive_notification", notificationData);
      }
    }
  }

  await trackLeadChanges({
    leadId: id,
    newData: updatedLead,
    fieldsToTrack: [
      "name",
      "phone",
      "city",
      "lead_form",
      "lead_assign",
      "remarks",
      "lead_text_remark",
    ],
  });

  return updatedLead;
};

const deleteLead = async (id) => {
  return await aiCallLead.findByIdAndDelete(id);
};

const getLeadById = async (id) => {
  const result = await aiCallLead.findById(id);
  const lead = result.toObject ? result.toObject() : result;

  // If lead_assign exists, validate and fetch user name
  if (lead.lead_assign && mongoose.Types.ObjectId.isValid(lead.lead_assign)) {
    const users = await user.findById(lead.lead_assign).select("name");
    lead.lead_assign_name = users ? users.name : "";
  } else {
    lead.lead_assign_name = "";
  }

  return result;
};

module.exports = {
  createLead,
  getAllLead,
  updateLead,
  deleteLead,
  getLeadById
};
