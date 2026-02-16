const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const GenerateInvoice = require("../../model/generateInvoice");
const user = require("../../model/user");
const Lead = require("../../model/lead");
const AiCallLead = require("../../model/aiCallLead");
const leadTracking = require("../../model/LeadTracking");
const ProcessHistory = require("../../model/studentProcessHistory.js");
const StudentApplication = require("../../model/masters/studentApplication/studentApplication");
const VisitorApplication = require("../../model/visitorApplication/visitorApplication");
const B2BAdmin = require("../../model/masters/b2b/b2bAdmin");
const B2BMember = require("../../model/masters/b2b/b2bMember");
const Branch = require("../../model/branch/branches");
const BranchMember = require("../../model/branch/branchMember");
const MainPlan = require("../../model/masters/generateInvoice/mainPlan.js");
const SubPlan = require("../../model/masters/generateInvoice/subPlan.js");

const WpTemplate = require("../../model/masters/wptemplate");
const { getLeadNextSequence } = require("../../helpers/nextIdSequence");
const sendEODReport = require("../../utils/eodReport");
const trackLeadEvents = require("../../helpers/leadProcessHistory.js");

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
const { sendSingleMessage } = require("./chatbox/campaign");
const followUpType = require("../../model/masters/lead/followUpType.js");
const checkEmailUniqueness = require("../../helpers/uniqueEmail");

const createLead = async (
  leadData,
  userId,
  userName,
  userType,
  b2bName,
  branch,
  role,
) => {
  //  if (leadData.phone && leadData.phone.trim() !== "") {
  //   const existingLead = await Lead.findOne({
  //     phone: leadData.phone.trim(),
  //   });

  //   if (existingLead) {
  //     throw {
  //       status: false,
  //       message: `A lead with contact number ${leadData.phone} already exists.`,
  //     };
  //   }
  // }

  // if(leadData.email && leadData.email.trim() !== ""){
  //   const existingEmail = await Lead.findOne({
  //     email: leadData.email.trim(),
  //   });

  //   if(existingEmail){
  //     throw {
  //       status: false,
  //       message: `A lead with email ${leadData.email} already exists.`,
  //     }
  //   }
  // }

  if (leadData.email && leadData.email.trim() !== "") {
    await checkEmailUniqueness(leadData.email.trim());
  }

  const leadId = await getLeadNextSequence("lead", "LE", 5);
  leadData.leadId = leadId;

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

  let hashedPassword = null;

  if (leadData.password) {
    const saltRounds = 10;
    hashedPassword = await bcrypt.hash(leadData.password, saltRounds);
  }

  let resolvedRole = typeof role === "string" ? role || role : role?.name;
  const lead = await Lead.create({
    ...leadData,
    password: hashedPassword,
  });

  await ProcessHistory.create({
    leadId: lead._id,
    history: [
      {
        event: "lead_created",
        value: lead.name,
        updatedBy: userId,
        updatedByName: userName,
      },
    ],
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
        console.warn(`⚠️ Lead ${lead._id} has no contact number`);
      }
    } catch (whatsappError) {
      console.error(
        `Failed to send WhatsApp welcome for lead ${lead._id}:`,
        whatsappError,
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
        resolvedRole,
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
          lead.lead_assign,
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

const insertManyLeads = async (leadsArray) => {
  return await Lead.insertMany(leadsArray);
};

const getLeadById = async (id) => {
  const result = await Lead.findById(id).populate([
    { path: "lead_assign_Branch", select: "name code" },
    { path: "lead_assign.role", select: "name" },
    { path: "lead_assign.user", select: "name email" },

    { path: "interestedCourseDetails.institute", select: "instituteName" },
    { path: "interestedCourseDetails.campus", select: "campus" },
    { path: "interestedCourseDetails.programLevel", select: "name" },
    {
      path: "interestedCourseDetails.course",
      select: "name duration tuitionFee",
    },
  ]);

  if (!result) return null;
  // const lead = result.toObject ? result.toObject() : result;

  // If lead_assign exists, validate and fetch user name
  // if (lead.lead_assign && mongoose.Types.ObjectId.isValid(lead.lead_assign)) {
  //   const users = await user.findById(lead.lead_assign).select("name");
  //   lead.lead_assign_name = users ? users.name : "";
  // } else {
  //   lead.lead_assign_name = "";
  // }

  return result;
};

const findLeadByPhoneAndForm = async (phone, leadForm) => {
  return await Lead.findOne({ phone, lead_form: leadForm });
};

const getAllLead = async (
  page = 1,
  limit = 10,
  searchOnField,
  search,
  status,
  subStatus,
  startDate,
  endDate,
  currentUser,
  assignedToUserId,
  assignRole,
  lead_from,
  branchId,
  showAll = false,
  leadActivity,
  followUpType,
  country,
  updatedOn,
  otherService,
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

  if (updatedOn) {
    const start = new Date(updatedOn);
    start.setHours(0, 0, 0, 0);

    const end = new Date(updatedOn);
    end.setHours(23, 59, 59, 999);

    filter.updatedAt = {
      $gte: start,
      $lte: end,
    };
  }

  if (lead_from) {
    filter.lead_form = lead_from;
  }

  // if (search) {
  //   const regex = { $regex: search, $options: "i" };
  //   filter.$or = [
  //     { name: regex },
  //     { email: regex },
  //     { phone: regex },
  //     { alternate_contact: regex },
  //     { address: regex },
  //     { country_interested: regex },
  //     { course: regex },
  //     { level: regex },
  //     { budget: regex },
  //     { english_proficiency: regex },
  //     { passport: regex }
  //   ];
  // }

  if (search) {
    const regex = { $regex: search, $options: "i" };

    if (searchOnField) {
      filter[searchOnField] = regex;
    } else {
      filter.$or = [
        { leadId: regex },
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
      ];
    }
  }
  if (status) {
    filter.lead_status = status;
  }
  if (subStatus) {
    filter.lead_sub_status = subStatus;
  }
  if (country) {
    filter.country_interested = {
      $in: [new RegExp(`^${country}$`, "i")], // 'i' makes it case-insensitive
    };
  }

  if (otherService && mongoose.Types.ObjectId.isValid(otherService)) {
    filter.other_for = { $in: [otherService] };
  }

  if (assignedToUserId && mongoose.Types.ObjectId.isValid(assignedToUserId)) {
    filter["lead_assign.user"] = assignedToUserId;
  }
  if (assignRole && mongoose.Types.ObjectId.isValid(assignRole)) {
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $and: [
          { "lead_assign.role": new mongoose.Types.ObjectId(assignRole) },
          { lead_assign_Branch: new mongoose.Types.ObjectId(branchId) },
        ],
      });
    } else {
      filter["lead_assign.role"] = new mongoose.Types.ObjectId(assignRole);
    }
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
      member._id.toString(),
    );
    filter.$or = [
      { created_by: { $in: [currentUser.userId, ...branchMemberIds] } },
      { lead_assign_Branch: currentUser.userId },
    ];
  } else if (userRole === "Branch User") {
    const branch = await Branch.findOne({ name: currentUser.branch });

    if (branch) {
      const branchMembers = await user
        .find({
          branchId: branch._id,
        })
        .select("_id");
      const branchMemberIds = branchMembers.map((member) =>
        member._id.toString(),
      );
      filter.$or = [
        { created_by: { $in: [branch._id, ...branchMemberIds] } },
        { lead_assign_Branch: branch._id },
      ];
    } else {
      // fallback: only show records created by the branch user themselves
      filter.created_by = currentUser.userId;
    }
  } else if (roleName === "Super Admin") {
    if (String(showAll) === "true") {
      // Show all leads, no branchId filtering
    } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      const branchUsers = await user.find({ branchId }).select("_id");
      const branchUserIds = branchUsers.map((user) => user._id.toString());
      // filter.created_by = { $in: [...branchUserIds, branchId] }; // users + branch
      filter.$or = [
        { created_by: { $in: [...branchUserIds, branchId] } },
        { lead_assign_Branch: branchId },
      ];
    } else {
      // No branchId provided, get users with no branch assigned
      const noBranchUsers = await user
        .find({ branchId: { $in: [null, undefined] } })
        .select("_id");
      const noBranchUserIds = noBranchUsers.map((user) => user._id.toString());
      filter.created_by = { $in: noBranchUserIds };

      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { lead_assign_Branch: null },
          { lead_assign_Branch: { $exists: false } },
        ],
      });
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

  const duplicateContacts = await Lead.aggregate([
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

  const leads = await Lead.find(filter)
    .populate([
      { path: "lead_assign_Branch", select: "name code" },
      { path: "lead_assign.role", select: "name" },
      { path: "lead_assign.user", select: "name email" },

      { path: "interestedCourseDetails.institute", select: "instituteName" },
      { path: "interestedCourseDetails.campus", select: "campus" },
      { path: "interestedCourseDetails.programLevel", select: "name" },
      {
        path: "interestedCourseDetails.course",
        select: "name duration tuitionFee",
      },
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalLeads = await Lead.countDocuments(filter);

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
        "companyName",
      ),
      B2BMember.find({ _id: { $in: groupedByType.B2BMember } }).select(
        "firstName lastName",
      ),
      Branch.find({ _id: { $in: groupedByType.Branch } }).select("name"),
      BranchMember.find({ _id: { $in: groupedByType.BranchMember } }).select(
        "firstName lastName",
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

  // Lead Assign Mapping
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

const getB2BLead = async (
  page = 1,
  limit = 10,
  searchOnField,
  search,
  startDate,
  endDate,
  status,
  subStatus,
  country,
  assignedToUserId,
  lead_from,
  b2bId,
  leadActivity,
  followUpType,
  branchId,
  assignRole,
  showAll,
  updatedOn,
  currentUser,
) => {
  const skip = (page - 1) * limit;

  // -------------------------
  // BASE QUERY - only B2B leads
  // -------------------------
  const filter = {
    $and: [{ fromB2B: { $exists: true, $eq: true } }],
  };

  // -------------------------
  // BASIC FILTERS
  // -------------------------
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }

  if (status) filter.b2b_lead_status = status;
  if (subStatus) filter.lead_sub_status = subStatus;
  if (country)
    filter.country_interested = { $in: [new RegExp(`^${country}$`, "i")] };
  if (lead_from) filter.lead_form = lead_from;

  if (leadActivity === "Active")
    filter.$or = [{ deadLead: false }, { deadLead: { $exists: false } }];
  else if (leadActivity === "Inactive") filter.deadLead = true;

  if (assignedToUserId && mongoose.Types.ObjectId.isValid(assignedToUserId)) {
    filter["lead_assign.user"] = assignedToUserId;
  }

  if (followUpType && mongoose.Types.ObjectId.isValid(followUpType))
    filter.follow_up_type = followUpType;

  if (updatedOn) {
    const start = new Date(updatedOn);
    start.setHours(0, 0, 0, 0);

    const end = new Date(updatedOn);
    end.setHours(23, 59, 59, 999);

    filter.updatedAt = {
      $gte: start,
      $lte: end,
    };
  }

  if (assignRole && mongoose.Types.ObjectId.isValid(assignRole)) {
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $and: [
          { "lead_assign.role": new mongoose.Types.ObjectId(assignRole) },
          { lead_assign_Branch: new mongoose.Types.ObjectId(branchId) },
        ],
      });
    } else {
      filter["lead_assign.role"] = new mongoose.Types.ObjectId(assignRole);
    }
  }

  if (b2bId && mongoose.Types.ObjectId.isValid(b2bId)) {
    const b2bMembers = await B2BMember.find({ b2bAdmin: b2bId }).select("_id");
    const memberIds = b2bMembers.map((m) => m._id.toString());
    filter.created_by = { $in: [b2bId, ...memberIds] };
  }

  // -------------------------
  // ROLE-BASED ACCESS CONTROL
  // -------------------------
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
    const memberIds = b2bMembers.map((m) => m._id.toString());
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
      member._id.toString(),
    );

    filter.$or = [
      { created_by: { $in: [currentUser.userId, ...branchMemberIds] } },
      { lead_assign_Branch: currentUser.userId },
    ];
  } else if (userRole === "Branch User") {
    const branch = await Branch.findOne({ name: currentUser.branch });

    if (branch) {
      const branchMembers = await user
        .find({
          branchId: branch._id,
        })
        .select("_id");
      const branchMemberIds = branchMembers.map((member) =>
        member._id.toString(),
      );
      filter.$or = [
        { created_by: { $in: [branch._id, ...branchMemberIds] } },
        { lead_assign_Branch: branch._id },
      ];
    } else {
      filter.created_by = currentUser.userId;
    }
  } else if (roleName === "Super Admin") {
    if (String(showAll) === "true") {
    } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      const branchUsers = await user.find({ branchId }).select("_id");
      const branchUserIds = branchUsers.map((user) => user._id.toString());
      // filter.created_by = { $in: [...branchUserIds, branchId] }; // users + branch
      filter.$or = [
        { created_by: { $in: [...branchUserIds, branchId] } },
        { lead_assign_Branch: branchId },
      ];
    } else {
      const noBranchUsers = await user
        .find({ branchId: { $in: [null, undefined] } })
        .select("_id");
      const noBranchUserIds = noBranchUsers.map((user) => user._id.toString());
      filter.created_by = { $in: noBranchUserIds };

      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { lead_assign_Branch: null },
          { lead_assign_Branch: { $exists: false } },
        ],
      });
    }
  }
  //  else if (
  //   currentUser.viewB2BStudentApplication &&
  //   currentUser.whichB2BStudentApplication === "countrywise"
  // ) {
  //   const userDoc = await user.findById(currentUser.userId).select("country");
  //   if (userDoc?.country)
  //     filter.country_interested = {
  //       $in: [new RegExp(`^${userDoc.country}$`, "i")],
  //     };

  // }
  else if (currentUser.viewB2BStudentApplication) {
    const accessConditions = [{ "lead_assign.user": currentUser.userId }];
    if (currentUser.assignedB2B && currentUser.assignedB2B.length > 0) {
      const adminIds = currentUser.assignedB2B.map(
        (id) => new mongoose.Types.ObjectId(id),
      );

      const b2bMembers = await B2BMember.find({
        b2bAdmin: { $in: adminIds },
      }).select("_id");

      const memberIds = b2bMembers.map((m) => m._id.toString());

      accessConditions.push({
        created_by: { $in: [...adminIds, ...memberIds] },
      });
    }
    if (currentUser.whichB2BStudentApplication === "all") {
      accessConditions.push(
        { created_by: currentUser.userId },
        {
          created_by_type: {
            $in: ["B2B Admin", "B2B Member"],
          },
        },
      );
    } else if (currentUser.whichB2BStudentApplication === "countrywise") {
      accessConditions.push({ created_by: currentUser.userId });

      const userDoc = await user.findById(currentUser.userId).select("country");
      if (userDoc?.country?.length) {
        accessConditions.push({
          $and: [
            {
              created_by_type: {
                $in: ["B2B Admin", "B2B Member"],
              },
            },
            {
              country_interested: {
                $in: userDoc.country.map((c) => new RegExp(`^${c}$`, "i")),
              },
            },
          ],
        });
      }
    } else {
      accessConditions.push(
        { created_by: currentUser.userId },
        { "lead_assign.user": currentUser.userId },
      );
    }

    filter.$or = accessConditions;
  } else if (roleName !== "Super Admin") {
    filter.$or = [
      { "lead_assign.user": currentUser.userId },
      { created_by: currentUser.userId },
    ];
  }

  // -------------------------
  // SEARCH FILTER
  // -------------------------
  if (search) {
    const regex = { $regex: search, $options: "i" };

    if (searchOnField) {
      filter[searchOnField] = regex;
    } else {
      filter.$or = [
        { leadId: regex },
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
      ];
    }
  }

  // -------------------------
  // FETCH LEADS
  // -------------------------
  const leads = await Lead.find(filter)
    .populate([
      { path: "lead_assign_Branch", select: "name code" },
      { path: "lead_assign.role", select: "name" },
      { path: "lead_assign.user", select: "name email" },

      { path: "interestedCourseDetails.institute", select: "instituteName" },
      { path: "interestedCourseDetails.campus", select: "campus" },
      { path: "interestedCourseDetails.programLevel", select: "name" },
      {
        path: "interestedCourseDetails.course",
        select: "name duration tuitionFee",
      },
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalLeads = await Lead.countDocuments(filter);

  // -------------------------
  // DUPLICATE CONTACTS
  // -------------------------
  const duplicateContacts = await Lead.aggregate([
    { $group: { _id: "$phone", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 }, _id: { $ne: null } } },
  ]);
  const duplicateContactsSet = new Set(duplicateContacts.map((d) => d._id));

  // -------------------------
  // DUE AMOUNT
  // -------------------------
  const leadIds = leads.map((lead) => lead._id);
  const invoices = await GenerateInvoice.aggregate([
    {
      $match: {
        name: { $in: leadIds },
        dueAmount: { $ne: null, $ne: "", $ne: "0" },
      },
    },
    {
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
    { $group: { _id: "$name", totalDueAmount: { $sum: "$numericDueAmount" } } },
  ]);
  const dueAmountMap = {};
  invoices.forEach((inv) => {
    dueAmountMap[inv._id.toString()] = inv.totalDueAmount;
  });

  // -------------------------
  // LEAD ASSIGN NAMES
  // -------------------------
  const userIds = leads.flatMap((lead) =>
    (lead.lead_assign || [])
      .map((la) => la.user)
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => id.toString()),
  );

  const leadAssignUsers = await user
    .find({ _id: { $in: userIds } })
    .select("name");
  const userMap = {};
  leadAssignUsers.forEach((u) => {
    userMap[u._id.toString()] = u.name;
  });

  // -------------------------
  // FORMAT LEADS
  // -------------------------
  const leadsWithFullData = leads.map((lead) => {
    const assignedUsers = (lead.lead_assign || []).map((la) => ({
      userId: la.user,
      name: userMap[la.user?.toString()] || "",
    }));

    return {
      ...lead,
      isDuplicate: duplicateContactsSet.has(lead.phone || ""),
      lead_assign_users: assignedUsers,
      dueAmount: dueAmountMap[lead._id.toString()] || 0,
    };
  });

  // -------------------------
  // FINAL RESPONSE
  // -------------------------
  return {
    status: true,
    code: 200,
    data: leadsWithFullData,
    totalPages: Math.ceil(totalLeads / limit),
    currentPage: String(page),
    totalLeads,
  };
};

const allNewLead = async () => {
  const status = "Voice AI Test";
  const leads = await Lead.find({ lead_status: status })
    .select(
      "_id name email phone source_of_reference  intake country_interested course level lead_status createdAt",
    )
    .sort({ createdAt: -1 });

  return leads;
};

const LeadsByUserId = async (
  userId,
  page = 1,
  limit = 10,
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
  assignedToUserId,
  assignRole,
  branchId,
  showAll = false,
  updatedOn,
) => {
  const skip = (page - 1) * limit;

  /* ---------------- BASE FILTER ---------------- */
  const filter = {
    $or: [{ "lead_assign.user": userId }, { created_by: userId }],
  };

  /* ---------------- DATE FILTER ---------------- */
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = { $gte: start, $lte: end };
  }

  if (updatedOn) {
    const start = new Date(updatedOn);
    start.setHours(0, 0, 0, 0);

    const end = new Date(updatedOn);
    end.setHours(23, 59, 59, 999);

    filter.updatedAt = { $gte: start, $lte: end };
  }

  /* ---------------- SIMPLE FILTERS ---------------- */
  if (lead_from) filter.lead_form = lead_from;
  if (status) filter.lead_status = status;
  if (subStatus) filter.lead_sub_status = subStatus;

  if (country) {
    filter.country_interested = {
      $in: [new RegExp(`^${country}$`, "i")],
    };
  }

  if (followUpType && mongoose.Types.ObjectId.isValid(followUpType)) {
    filter.follow_up_type = followUpType;
  }

  if (assignedToUserId && mongoose.Types.ObjectId.isValid(assignedToUserId)) {
    filter["lead_assign.user"] = assignedToUserId;
  }

  /* ---------------- ROLE / BRANCH FILTER ---------------- */
  // if (assignRole) {
  //   if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
  //     filter.$and = filter.$and || [];
  //     filter.$and.push({
  //       lead_role: assignRole,
  //       lead_assign_Branch: branchId,
  //     });
  //   } else {
  //     filter.lead_role = assignRole;
  //   }
  // }

  if (assignRole && mongoose.Types.ObjectId.isValid(assignRole)) {
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $and: [
          { "lead_assign.role": new mongoose.Types.ObjectId(assignRole) },
          { lead_assign_Branch: new mongoose.Types.ObjectId(branchId) },
        ],
      });
    } else {
      filter["lead_assign.role"] = new mongoose.Types.ObjectId(assignRole);
    }
  }

  /* ---------------- BRANCH ACCESS LOGIC ---------------- */
  if (String(showAll) !== "true") {
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      const branchUsers = await user.find({ branchId }).select("_id");
      const branchUserIds = branchUsers.map((u) => u._id);

      filter.$or = [
        { created_by: { $in: branchUserIds } },
        { lead_assign_Branch: branchId },
      ];
    } else {
      const noBranchUsers = await user
        .find({ branchId: { $in: [null, undefined] } })
        .select("_id");

      filter.created_by = {
        $in: noBranchUsers.map((u) => u._id),
      };

      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { lead_assign_Branch: null },
          { lead_assign_Branch: { $exists: false } },
        ],
      });
    }
  }

  /* ---------------- SEARCH ---------------- */
  if (search) {
    const regex = { $regex: search, $options: "i" };

    if (searchOnField) {
      filter[searchOnField] = regex;
    } else {
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
      ];
    }
  }

  /* ---------------- LEAD ACTIVITY ---------------- */
  if (leadActivity === "Active") {
    filter.$or = [{ deadLead: false }, { deadLead: { $exists: false } }];
  } else if (leadActivity === "Inactive") {
    filter.deadLead = true;
  }

  /* ---------------- FETCH LEADS ---------------- */
  const leads = await Lead.find(filter)
    .populate([
      { path: "lead_assign_Branch", select: "name code" },
      { path: "lead_assign.role", select: "name" },
      { path: "lead_assign.user", select: "name email" },

      { path: "interestedCourseDetails.institute", select: "instituteName" },
      { path: "interestedCourseDetails.campus", select: "campus" },
      { path: "interestedCourseDetails.programLevel", select: "name" },
      {
        path: "interestedCourseDetails.course",
        select: "name duration tuitionFee",
      },
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalLeads = await Lead.countDocuments(filter);

  /* ---------------- DUE AMOUNT ---------------- */
  const leadIds = leads.map((l) => l._id);

  const invoices = await GenerateInvoice.aggregate([
    {
      $match: {
        name: { $in: leadIds },
        dueAmount: { $nin: [null, "", "0"] },
      },
    },
    {
      $addFields: {
        numericDueAmount: {
          $cond: [
            { $regexMatch: { input: "$dueAmount", regex: /^[0-9.]+$/ } },
            { $toDouble: "$dueAmount" },
            0,
          ],
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
  invoices.forEach((i) => {
    dueAmountMap[i._id.toString()] = i.totalDueAmount;
  });

  /* ---------------- FINAL RESPONSE ---------------- */
  const leadsWithExtras = leads.map((lead) => ({
    ...lead,
    lead_assign_names: Array.isArray(lead.lead_assign)
      ? lead.lead_assign.map((a) => a.user?.name).filter(Boolean)
      : [],
    dueAmount: dueAmountMap[lead._id.toString()] || 0,
  }));

  return {
    leads: leadsWithExtras,
    totalLeads,
    totalPages: Math.ceil(totalLeads / limit),
    currentPage: page,
  };
};

const updateLead = async (id, data, userId, userName, role) => {
  const oldLead = await Lead.findById(id);

  if (!oldLead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  if (data.password) {
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);
  } else {
    delete data.password;
  }

  if (data.email && data.email !== oldLead.email) {
    await checkEmailUniqueness(data.email, id, "lead");
  }

  if (!Array.isArray(oldLead.lead_assign)) {
    oldLead.lead_assign = [];
  }

  if (data.lead_assign) {
    oldLead.lead_assign.push({
      ...data.lead_assign,
      // created_by: userId,
      // createdByName: userName,
    });
  }
  if (data.lead_assignId && data.lead_assignUpdate) {
    const index = oldLead.lead_assign.findIndex(
      (i) => i._id.toString() === data.lead_assignId.toString(),
    );

    if (index !== -1) {
      const existingAssignment = oldLead.lead_assign[index].toObject();

      oldLead.lead_assign[index] = {
        ...existingAssignment,
        ...data.lead_assignUpdate,
        // updated_by: userId,
        // updatedByName: userName,
      };
    }
  }

  // if (!Array.isArray(oldLead.interestedCourseDetails)) {
  //   oldLead.interestedCourseDetails = [];
  // }

  //   if (
  //   data.interestedCourseDetails &&
  //   (
  //     // Case 1: it's an array and has items
  //     (Array.isArray(data.interestedCourseDetails) &&
  //       data.interestedCourseDetails.length > 0) ||

  //     // Case 2: it's a single object (not array)
  //     (!Array.isArray(data.interestedCourseDetails) &&
  //       typeof data.interestedCourseDetails === "object")
  //   )
  // ) {
  //   if (Array.isArray(data.interestedCourseDetails)) {
  //     data.interestedCourseDetails.forEach((course) => {
  //       oldLead.interestedCourseDetails.push({
  //         ...course,
  //         // created_by: userId,
  //         // createdByName: userName,
  //       });
  //     });
  //   } else {
  //     oldLead.interestedCourseDetails.push({
  //       ...data.interestedCourseDetails,
  //       // created_by: userId,
  //       // createdByName: userName,
  //     });
  //   }
  // }

  // if (data.interestedCourseId && data.interestedCourseUpdate) {
  //   const index = oldLead.interestedCourseDetails.findIndex(
  //     (i) => i._id.toString() === data.interestedCourseId.toString(),
  //   );

  //   if (index !== -1) {
  //     const existingData = oldLead.interestedCourseDetails[index].toObject();

  //     oldLead.interestedCourseDetails[index] = {
  //       ...existingData,
  //       ...data.interestedCourseUpdate,
  //     };
  //   }
  // }

  if (data.lead_assignDeleteId) {
    oldLead.lead_assign = oldLead.lead_assign.filter(
      (item) => item._id.toString() !== data.lead_assignDeleteId.toString(),
    );
  }

  if (data.courseDeleteId) {
    oldLead.interestedCourseDetails = oldLead.interestedCourseDetails.filter(
      (item) => item._id.toString() !== data.courseDeleteId.toString(),
    );
  }

  delete data.lead_assign;
  delete data.lead_assignId;
  delete data.lead_assignUpdate;
  // delete data.interestedCourseDetails;
  // delete data.interestedCourseId;
  // delete data.interestedCourseUpdate;
  delete data.lead_assignDeleteId;
  delete data.courseDeleteId;

  Object.assign(oldLead, {
    ...data,
    updated_by: userId,
    updatedByName: userName,
  });
  const updatedLead = await oldLead.save();

  // const updatedLead = await Lead.findByIdAndUpdate(
  //   id,
  //   { ...data, updated_by: userId, updatedByName: userName },
  //   { new: true }
  // );

  const rawDataForEvents = { ...data };

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
        resolvedRole,
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
      "lead_assign",
    ],
  });

  await trackLeadEvents(oldLead, rawDataForEvents, userId, userName);

  return updatedLead;
};

const bulkUpdateLeadAssign = async (
  leadIds,
  assignData,
  userId,
  userName,
  role,
) => {
  const { lead_assign_Branch, lead_role, lead_assign } = assignData;

  // Validate all lead IDs are valid ObjectIds
  const validLeadIds = leadIds.filter((id) =>
    mongoose.Types.ObjectId.isValid(id),
  );

  if (validLeadIds.length === 0) {
    throw { status: false, message: "No valid lead IDs provided" };
  }

  // Prepare update data
  const updateData = {
    lead_assign_Branch:
      lead_assign_Branch !== undefined ? lead_assign_Branch : null,
    lead_role: lead_role || null,
    lead_assign: lead_assign || null,
    updated_by: userId,
    updatedByName: userName,
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key],
  );

  // Bulk update all leads
  const updateResult = await Lead.updateMany(
    { _id: { $in: validLeadIds } },
    { $set: updateData },
  );

  // Fetch updated leads for tracking and notifications
  const updatedLeads = await Lead.find({ _id: { $in: validLeadIds } });

  let resolvedRole = typeof role === "string" ? role : role?.name;

  // Send notifications for newly assigned users (if lead_assign changed)
  if (lead_assign && mongoose.Types.ObjectId.isValid(lead_assign)) {
    const assignedUser = await user.findById(lead_assign);

    if (assignedUser?.email) {
      // Get unique lead names for notification
      const leadNames = updatedLeads.map((lead) => lead.name).join(", ");
      const leadCount = updatedLeads.length;

      try {
        await sendLeadAssignEmail(
          assignedUser.email,
          assignedUser.name,
          leadCount === 1 ? updatedLeads[0].name : `${leadCount} leads`,
          userName,
          resolvedRole,
        );

        // Create notification for each lead
        const notifications = updatedLeads.map((lead) => ({
          recipientId: lead_assign,
          message:
            leadCount === 1
              ? `A new lead "${lead.name}" has been assigned to you by ${userName}.`
              : `${leadCount} leads have been assigned to you by ${userName}.`,
          leadId: lead._id,
          createdBy: userId,
        }));

        await notification.insertMany(notifications);

        // Emit socket notification
        const notificationNamespace = getNotificationNamespace();
        if (notificationNamespace) {
          const notificationData = await notification.find({
            recipientId: lead_assign,
          });
          notificationNamespace
            .to(String(lead_assign))
            .emit("receive_notification", notificationData);
          notificationNamespace
            .to("global-notifications")
            .emit("receive_notification", notificationData);
        }
      } catch (error) {
        console.error("Error sending bulk assign notifications:", error);
        // Don't throw, continue with update
      }
    }
  }

  // Track changes for each lead
  try {
    for (const lead of updatedLeads) {
      await trackLeadChanges({
        leadId: lead._id,
        newData: lead,
        fieldsToTrack: ["lead_assign", "lead_assign_Branch", "lead_role"],
      });
    }
  } catch (error) {
    console.error("Error tracking bulk assign changes:", error);
    // Don't throw, continue
  }

  return {
    updatedCount: updateResult.modifiedCount,
    matchedCount: updateResult.matchedCount,
    leadIds: validLeadIds,
  };
};

const getLeadHistory = async (id) => {
  const history = await leadTracking
    .find({ lead: id })
    .populate("lead_assign", "name") // populate user info
    .sort({ createdAt: -1 });
  return history;
};

const deleteLead = async (id) => {
  return await Lead.findByIdAndDelete(id);
};

const deleteManyLeads = async (idsArray) => {
  return await Lead.deleteMany({ _id: { $in: idsArray } });
};

const filterLeadsByDate = async (startDate, endDate, page, limit, status) => {
  const skip = (page - 1) * limit;

  const filter = {};

  // Apply date filter only if both are present
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

  // Apply status filter only if provided
  if (status) {
    filter.lead_status = { $regex: new RegExp(`^${status}$`, "i") };
  }

  const leads = await Lead.find(filter)
    .populate([
      { path: "lead_assign", select: "name" },
      { path: "lead_role", select: "name" },
      { path: "follow_up_type", select: "name" },
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalLeads = await Lead.countDocuments(filter);

  return {
    leads,
    totalLeads,
    totalPages: Math.ceil(totalLeads / limit),
    currentPage: page,
  };
};

// const downloadLeadsByIdsService = async (leadIds) => {
//   const leads = await Lead.find({ _id: { $in: leadIds } })
//     .populate("inquiry_for", "name")
//       .populate("lead_assign", "name")   // populate with the 'name' field
//     .sort({ createdAt: -1 });

//   if (!leads.length) {
//     return { success: false, message: "No leads found." };
//   }

//   const downloadsDir = path.join(__dirname, "../../public");
//   if (!fs.existsSync(downloadsDir)) {
//     fs.mkdirSync(downloadsDir, { recursive: true });
//   }

//   const filePath = path.join(downloadsDir, "leads.csv");

//   const csvWriter = createObjectCsvWriter({
//     path: filePath,
//     header: [
//       { id: "createdAt", title: "Created At" },
//       { id: "name", title: "Name" },
//       { id: "email", title: "Email" },
//       { id: "leadId", title: "lead Id" },
//       { id: "_id", title: "ID" },
//       { id: "phone", title: "Phone" },
//       { id: "inquiry_for", title: "Inquiry For" },
//       { id: "country_interested", title: "Preferred Country" },
//       { id: "lead_followup_remark", title: "Followup" },
//       { id: "remarks" , title: "Remark" },
//       { id: "branch", title: "branch" },
//       { id: "lead_assign", title: "Lead Assigned To" },
//       { id: "lead_status", title: "Status" },
//       { id: "lead_form" , title: "Lead form" }
//     ],
//   });

//   const records = leads.map((lead) => ({
//     createdAt: lead.createdAt.toISOString(),
//     name: lead.name || "",
//     email: lead.email || "",
//     leadId: lead.leadId,
//     _id: lead._id,
//     phone: lead.phone || "",
//     inquiry_for: lead.inquiry_for?.name || "",
//     country_interested: lead.country_interested,
//     lead_followup_remark: lead.lead_followup_remark,
//     remarks: lead.remarks,
//     branch: lead.branch,
//     lead_assign: lead.lead_assign?.name || "",
//     lead_status: lead.lead_status || "",
//     lead_form: lead.lead_form || ""
//   }));

//   await csvWriter.writeRecords(records);

//   return { success: true, filePath };
// };
const downloadLeadsByFilter = async (params) => {
  const {
    search,
    status,
    subStatus,
    startDate,
    endDate,
    currentUser,
    assignedToUserId,
    assignRole,
    lead_from,
    branchId,
    showAll,
    leadActivity,
    followUpType,
    country,
  } = params;

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
    filter.createdAt = { $gte: start, $lte: end };
  }

  if (lead_from) filter.lead_form = lead_from;

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
    ];
  }

  if (status) filter.lead_status = status;
  if (subStatus) filter.lead_sub_status = subStatus;
  if (country) {
    filter.country_interested = {
      $in: [new RegExp(`^${country}$`, "i")],
    };
  }
  if (assignedToUserId && mongoose.Types.ObjectId.isValid(assignedToUserId)) {
    filter["lead_assign.user"] = assignedToUserId;
  }

  if (assignRole && mongoose.Types.ObjectId.isValid(assignRole)) {
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $and: [
          { "lead_assign.role": new mongoose.Types.ObjectId(assignRole) },
          { lead_assign_Branch: new mongoose.Types.ObjectId(branchId) },
        ],
      });
    } else {
      filter["lead_assign.role"] = new mongoose.Types.ObjectId(assignRole);
    }
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
      member._id.toString(),
    );
    filter.$or = [
      { created_by: { $in: [currentUser.userId, ...branchMemberIds] } },
      { lead_assign_Branch: currentUser.userId },
    ];
  } else if (userRole === "Branch User") {
    const branch = await Branch.findOne({ name: currentUser.branch });

    if (branch) {
      const branchMembers = await user
        .find({
          branchId: branch._id,
        })
        .select("_id");
      const branchMemberIds = branchMembers.map((member) =>
        member._id.toString(),
      );
      filter.$or = [
        { created_by: { $in: [branch._id, ...branchMemberIds] } },
        { lead_assign_Branch: branch._id },
      ];
    } else {
      // fallback: only show records created by the branch user themselves
      filter.created_by = currentUser.userId;
    }
  } else if (roleName === "Super Admin") {
    if (String(showAll) === "true") {
      // Show all leads, no branchId filtering
    } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      const branchUsers = await user.find({ branchId }).select("_id");
      const branchUserIds = branchUsers.map((user) => user._id.toString());
      // filter.created_by = { $in: [...branchUserIds, branchId] }; // users + branch
      filter.$or = [
        { created_by: { $in: [...branchUserIds, branchId] } },
        { lead_assign_Branch: branchId },
      ];
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

  const leads = await Lead.find(filter)
  .populate("inquiry_for", "name")
  .populate("lead_assign_Branch", "name")
  .populate({
    path: "lead_assign.user",
    select: "name",
  })
  .populate({
    path: "lead_assign.role",
    select: "name",
  })
  .sort({ createdAt: -1 })
  .lean();


  if (!leads.length)
    return { success: false, message: "No leads found for selected filters" };

  const downloadsDir = path.join(__dirname, "../../public");
  if (!fs.existsSync(downloadsDir))
    fs.mkdirSync(downloadsDir, { recursive: true });

  const filePath = path.join(downloadsDir, `leads_${Date.now()}.csv`);

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "createdAt", title: "Created At" },
      { id: "name", title: "Name" },
      { id: "email", title: "Email" },
      { id: "phone", title: "Phone" },
      { id: "leadId", title: "Lead Id" },
      { id: "lead_status", title: "Status" },
      { id: "lead_sub_status", title: "Sub Status" },
      { id: "country_interested", title: "Country" },
      { id: "lead_assign_Branch", title: "Assign Branch" },
      { id: "lead_role", title: "Assign Role" },
      { id: "lead_assign", title: "Assigned To" },
      { id: "lead_form", title: "Lead Form" },
      { id: "remarks", title: "remarks" },
    ],
  });

  const records = leads.map((lead) => ({
    createdAt: lead.createdAt?.toISOString() || "",
    name: lead.name || "",
    email: lead.email || "",
    phone: lead.phone || "",
    leadId: lead.leadId || "",
    lead_status: lead.lead_status || "",
    lead_sub_status: lead.lead_sub_status || "",
    country_interested: lead.country_interested || "",
    lead_assign_Branch: lead.lead_assign_Branch?.name || "",
    lead_role: lead.lead_role?.name || "",
    lead_assign: lead.lead_assign?.name || "",
    lead_form: lead.lead_form || "",
    remarks: lead.remarks,
  }));

  await csvWriter.writeRecords(records);

  return { success: true, filePath };
};

const getAllFollowUpLeads = async (
  page,
  limit,
  searchOnField,
  search,
  userId,
  isSuperAdmin,
  leadActivity,
  status,
  subStatus,
  lead_from,
  followUpType,
  country,
  branchId,
  showAll,
  assignedToUserId,
  assignRole,
  startDate,
  endDate,
  updatedOn,
) => {
  const skip = (page - 1) * limit;
  const filter = {
    next_follow_up: { $ne: null },
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

  if (updatedOn) {
    const start = new Date(updatedOn);
    start.setHours(0, 0, 0, 0);

    const end = new Date(updatedOn);
    end.setHours(23, 59, 59, 999);

    filter.updatedAt = {
      $gte: start,
      $lte: end,
    };
  }

  if (isSuperAdmin === "Super Admin") {
  } else if (isSuperAdmin === "B2B Admin") {
    filter.created_by = userId;
  } else if (isSuperAdmin === "Branch") {
    filter.$or = [{ created_by: userId }, { lead_assign_Branch: userId }];
  } else {
    filter.$or = [{ lead_assign: userId }, { created_by: userId }];
  }

  if (lead_from) {
    filter.lead_form = lead_from;
  }
  if (status) {
    filter.lead_status = status;
  }
  if (subStatus) {
    filter.lead_sub_status = subStatus;
  }
  if (country) {
    filter.country_interested = {
      $in: [new RegExp(`^${country}$`, "i")], // 'i' makes it case-insensitive
    };
  }
  if (followUpType && mongoose.Types.ObjectId.isValid(followUpType)) {
    filter.follow_up_type = followUpType;
  }

  if (search) {
    const regex = { $regex: search, $options: "i" };

    if (searchOnField) {
      filter[searchOnField] = regex;
    } else {
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }
  }
  if (leadActivity === "Active") {
    filter.$or = [{ deadLead: false }, { deadLead: { $exists: false } }];
  } else if (leadActivity === "Inactive") {
    filter.deadLead = true;
  }

  if (assignedToUserId && mongoose.Types.ObjectId.isValid(assignedToUserId)) {
    filter["lead_assign.user"] = assignedToUserId;
  }
  if (assignRole) {
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      // When branch exists → match both role and branch
      filter.$and = filter.$and || [];
      filter.$and.push({
        $and: [{ lead_role: assignRole }, { lead_assign_Branch: branchId }],
      });
    } else {
      // When no branch → only role should match
      filter.lead_role = assignRole;
    }
  }

  if (String(showAll) === "true") {
    // Show all leads, no branchId filtering
  } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
    const branchUsers = await user.find({ branchId }).select("_id");
    const branchUserIds = branchUsers.map((user) => user._id.toString());
    // filter.created_by = { $in: [...branchUserIds, branchId] }; // users + branch
    filter.$or = [
      { created_by: { $in: [...branchUserIds, branchId] } },
      { lead_assign_Branch: branchId },
    ];
  } else {
    // No branchId provided, get users with no branch assigned
    const noBranchUsers = await user
      .find({ branchId: { $in: [null, undefined] } })
      .select("_id");
    const noBranchUserIds = noBranchUsers.map((user) => user._id.toString());
    filter.created_by = { $in: noBranchUserIds };

    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { lead_assign_Branch: null },
        { lead_assign_Branch: { $exists: false } },
      ],
    });
  }

  const leads = await Lead.find(filter)
    .populate([
      { path: "lead_assign_Branch", select: "name code" },
      { path: "lead_assign.role", select: "name" },
      { path: "lead_assign.user", select: "name email" },

      { path: "interestedCourseDetails.institute", select: "instituteName" },
      { path: "interestedCourseDetails.campus", select: "campus" },
      { path: "interestedCourseDetails.programLevel", select: "name" },
      {
        path: "interestedCourseDetails.course",
        select: "name duration tuitionFee",
      },
    ])
    .sort({ next_follow_up: 1 }) // optional: sort by follow-up date
    .skip(skip)
    .limit(limit)
    .lean();
  const totalLeads = await Lead.countDocuments(filter);

  const leadIds = leads.map((lead) => lead._id);

  // Get total dueAmount from GenerateInvoice per lead
  const invoices = await GenerateInvoice.aggregate([
    {
      $match: {
        name: { $in: leadIds },
        dueAmount: { $ne: null, $ne: "", $ne: "0" },
      },
    },
    {
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

  // Extract valid lead_assign user IDs
  const userIds = leads
    .filter((lead) => mongoose.Types.ObjectId.isValid(lead.lead_assign))
    .map((lead) => lead.lead_assign.toString());

  // Fetch user names
  const users = await user.find({ _id: { $in: userIds } }).select("name");

  // Map userId => name
  const userMap = {};
  users.forEach((user) => {
    userMap[user._id.toString()] = user.name;
  });

  // Attach lead_assign_name to each lead
  const leadsWithCounsellor = leads.map((lead) => ({
    ...lead,
    lead_assign_name: mongoose.Types.ObjectId.isValid(lead.lead_assign)
      ? userMap[lead.lead_assign.toString()] || ""
      : "",
    dueAmount: dueAmountMap[lead._id.toString()] || 0,
  }));

  return {
    leads: leadsWithCounsellor,
    totalLeads,
    totalPages: Math.ceil(totalLeads / limit),
    currentPage: page,
  };
};

const getFollowUpLeadsByDate = async (
  page = 1,
  limit = 10,
  date,
  searchOnField,
  search,
  userId,
  isSuperAdmin,
  leadActivity,
  status,
  subStatus,
  lead_from,
  followUpType,
  country,
  branchId,
  showAll,
  assignedToUserId,
  assignRole,
  updatedOn,
) => {
  const skip = (page - 1) * limit;

  // Set date range
  const selectedDate = date ? new Date(date) : new Date();

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Build filter
  const filter = {
    next_follow_up: { $gte: startOfDay, $lte: endOfDay },
  };
  if (isSuperAdmin === "Super Admin") {
  } else if (isSuperAdmin === "B2B Admin") {
    filter.created_by = userId;
  } else if (isSuperAdmin === "Branch") {
    filter.$or = [{ created_by: userId }, { lead_assign_Branch: userId }];
  } else {
    filter.$or = [{ lead_assign: userId }, { created_by: userId }];
  }

  // If search keyword is provided
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (search) {
    const regex = { $regex: search, $options: "i" };

    if (searchOnField) {
      filter[searchOnField] = regex;
    } else {
      filter.$or = [
        { leadId: regex },
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
      ];
    }
  }

  if (country) {
    filter.country_interested = {
      $in: [new RegExp(`^${country}$`, "i")], // 'i' makes it case-insensitive
    };
  }

  if (leadActivity === "Active") {
    filter.$or = [{ deadLead: false }, { deadLead: { $exists: false } }];
  } else if (leadActivity === "Inactive") {
    filter.deadLead = true;
  }

  if (lead_from) {
    filter.lead_form = lead_from;
  }
  if (status) {
    filter.lead_status = status;
  }
  if (updatedOn) {
    const start = new Date(updatedOn);
    start.setHours(0, 0, 0, 0);

    const end = new Date(updatedOn);
    end.setHours(23, 59, 59, 999);

    filter.updatedAt = {
      $gte: start,
      $lte: end,
    };
  }

  if (subStatus) {
    filter.lead_sub_status = subStatus;
  }
  if (followUpType && mongoose.Types.ObjectId.isValid(followUpType)) {
    filter.follow_up_type = followUpType;
  }

  if (assignedToUserId && mongoose.Types.ObjectId.isValid(assignedToUserId)) {
    filter["lead_assign.user"] = assignedToUserId;
  }
  if (assignRole && mongoose.Types.ObjectId.isValid(assignRole)) {
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $and: [
          { "lead_assign.role": new mongoose.Types.ObjectId(assignRole) },
          { lead_assign_Branch: new mongoose.Types.ObjectId(branchId) },
        ],
      });
    } else {
      filter["lead_assign.role"] = new mongoose.Types.ObjectId(assignRole);
    }
  }

  if (String(showAll) === "true") {
    // Show all leads, no branchId filtering
  } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
    const branchUsers = await user.find({ branchId }).select("_id");
    const branchUserIds = branchUsers.map((user) => user._id.toString());
    // filter.created_by = { $in: [...branchUserIds, branchId] }; // users + branch
    filter.$or = [
      { created_by: { $in: [...branchUserIds, branchId] } },
      { lead_assign_Branch: branchId },
    ];
  } else {
    // No branchId provided, get users with no branch assigned
    const noBranchUsers = await user
      .find({ branchId: { $in: [null, undefined] } })
      .select("_id");
    const noBranchUserIds = noBranchUsers.map((user) => user._id.toString());
    filter.created_by = { $in: noBranchUserIds };

    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { lead_assign_Branch: null },
        { lead_assign_Branch: { $exists: false } },
      ],
    });
  }

  const leads = await Lead.find(filter)
    .populate([
      { path: "lead_assign_Branch", select: "name code" },
      { path: "lead_assign.role", select: "name" },
      { path: "lead_assign.user", select: "name email" },

      { path: "interestedCourseDetails.institute", select: "instituteName" },
      { path: "interestedCourseDetails.campus", select: "campus" },
      { path: "interestedCourseDetails.programLevel", select: "name" },
      {
        path: "interestedCourseDetails.course",
        select: "name duration tuitionFee",
      },
    ])
    .sort({ next_follow_up: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalLeads = await Lead.countDocuments(filter);

  const leadIds = leads.map((lead) => lead._id);

  // Fetch total dueAmount from GenerateInvoice (where dueAmount is string)
  const invoices = await GenerateInvoice.aggregate([
    {
      $match: {
        name: { $in: leadIds },
        dueAmount: { $ne: null, $ne: "", $ne: "0" },
      },
    },
    {
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

  // Get all valid user IDs from lead_assign field
  const userIds = leads
    .filter((lead) => mongoose.Types.ObjectId.isValid(lead.lead_assign))
    .map((lead) => lead.lead_assign.toString());

  // Fetch assigned user details
  const users = await user.find({ _id: { $in: userIds } }).select("name");

  // Map user ID to user name
  const userMap = {};
  users.forEach((user) => {
    userMap[user._id.toString()] = user.name;
  });

  // Attach lead_assign_name to leads
  const leadsWithCounsellor = leads.map((lead) => ({
    ...lead,
    lead_assign_name: mongoose.Types.ObjectId.isValid(lead.lead_assign)
      ? userMap[lead.lead_assign.toString()] || ""
      : "",
    dueAmount: dueAmountMap[lead._id.toString()] || 0,
  }));

  return {
    leads: leadsWithCounsellor,
    totalLeads,
    totalPages: Math.ceil(totalLeads / limit),
    currentPage: page,
  };
};

const birthday = async (page, limit, searchText = "", date) => {
  const targetDate = date ? new Date(date) : new Date();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  const query = {
    $expr: {
      $and: [
        { $eq: [{ $dayOfMonth: "$dateofbirth" }, day] },
        { $eq: [{ $month: "$dateofbirth" }, month] },
      ],
    },
  };

  const searchOptions = {
    searchText,
    searchFields: ["name", "email", "phone"],
  };

  const sort = { name: 1 };

  const populateFields = [
    { path: "lead_assign_Branch", select: "name code" },
    { path: "lead_assign.role", select: "name" },
    { path: "lead_assign.user", select: "name email" },

    { path: "interestedCourseDetails.institute", select: "instituteName" },
    { path: "interestedCourseDetails.campus", select: "campus" },
    { path: "interestedCourseDetails.programLevel", select: "name" },
    {
      path: "interestedCourseDetails.course",
      select: "name duration tuitionFee",
    },
  ];

  const result = await paginate(
    Lead,
    query,
    page,
    limit,
    sort,
    populateFields,
    searchOptions,
  );

  return result;
};

const getLeadsByAssignedUser = async (page, limit, searchText = "", userId) => {
  const searchOptions = {
    searchText,
    searchFields: ["name", "email", "phone"],
  };

  const filter = {
    lead_assign: userId,
  };

  const result = await paginate(
    Lead,
    filter,
    page,
    limit,
    { createdAt: -1 },
    [],
    searchOptions,
  );

  return result;
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
};

async function getPlanNames(mainPlanId, subPlanId) {
  const mainPlan = mainPlanId
    ? await MainPlan.findById(mainPlanId).select("name")
    : null;

  const subPlan = subPlanId
    ? await SubPlan.findById(subPlanId).select("name")
    : null;

  return {
    mainPlanName: mainPlan ? mainPlan.name : "",
    subPlanName: subPlan ? subPlan.name : "",
  };
}

const convertLeadToStudentApplication = async (
  leadId,
  userId,
  userName,
  userType,
  b2bName,
  branch,
  preferredCountry,
  admissionProcess,
  coachingData,
  visitorApplication,
  categoryDetails,
  admissionData,
  visitorInvoice,
  email,
) => {
  // Normalize branch input
  if (branch && typeof branch === "object") {
    branch = branch.name || null;
  }

  admissionProcess = parseBoolean(admissionProcess);
  visitorApplication = parseBoolean(visitorApplication);

  if (coachingData && coachingData.coachingRequired !== undefined) {
    coachingData.coachingRequired = parseBoolean(coachingData.coachingRequired);
    coachingData.hasGivenExam = parseBoolean(coachingData.hasGivenExam);
  }

  const lead = await Lead.findById(leadId);
  if (!lead) throw { status: false, message: "Lead not found" };

  if (!preferredCountry) {
    throw { status: false, message: "Preferred country is required" };
  }

  // Normalize JSON inputs upfront
  categoryDetails =
    typeof categoryDetails === "string"
      ? JSON.parse(categoryDetails)
      : categoryDetails;

  admissionData =
    typeof admissionData === "string"
      ? JSON.parse(admissionData)
      : admissionData;

  visitorInvoice =
    typeof visitorInvoice === "string"
      ? JSON.parse(visitorInvoice)
      : visitorInvoice;

  let educationDetails = (lead.education_details || []).map((ed) => ({
    degree: ed.degree || "",
    stream: ed.stream || "",
    score: ed.score ? ed.score.toString() : "",
    passingYear: ed.year ? ed.year.toString() : "",
    boardOrUniversity: ed.institution || "",
  }));

  const studentId = await getNextSequence("studentId", "ST");

  const finalEmail =
    email && email.trim() !== ""
      ? email.trim()
      : lead.email && lead.email.trim() !== ""
        ? lead.email.trim()
        : null;

  const baseData = {
    studentId,
    name: lead.name,
    contact: lead.phone,
    gender: lead.gender,
    email: finalEmail,
    DOB: lead.dateofbirth,
    age: lead.age,
    address: lead.address,
    city: lead.city,
    educationDetails,
    purposeDetails: {
      preferredCountry,
      inquiryFor: lead.inquiry_for,
    },
    entranceExamDetails: [],
    aptitudeExamDetails: [],
    workExperience: [],
    uploadedDocumentDetails: [],
    interestedCourseDetails: [],
    userAllocationDetails: [],
    created_by: userId,
    createdByName: userName,
    created_by_type: userType,
    isSubmit: true,
  };

  if (b2bName) baseData.b2bCompany = b2bName;
  if (branch) baseData.branch = branch;

  if (categoryDetails) {
    if (!Array.isArray(categoryDetails)) categoryDetails = [categoryDetails];

    baseData.categoryDetails = categoryDetails.map((cd) => ({
      type: cd?.type || "",
      country: cd?.country || "",
      document: cd?.document || null,
      date: cd?.date ? new Date(cd.date) : null,
      remarks: cd?.remarks || "",
    }));
  }

  const results = {};

  // ===========================
  // VISITOR APPLICATION SECTION
  // ===========================
  if (visitorApplication) {
    const visitorId = await getVisitorNextSequence("visitorId", "VT");
    const visitorData = {
      ...baseData,
      visitorId,
      preferredCountry,
    };
    delete visitorData.interestedCourseDetails;
    delete visitorData.purposeDetails;

    const visitor = await VisitorApplication.create(visitorData);
    results.visitor = visitor;

    (async () => {
      try {
        if (visitor.email && preferredCountry) {
          if (userType !== "B2B Admin" && userType !== "B2B Member") {
            await sendVisitorWelcomeEmail(
              visitor.email,
              visitor.name,
              preferredCountry,
            );

            await sendSingleMessage({
              to: visitor.contact,
              templateId: null,
              templateName: "visitor_visa_welcome1",
              fromNumberId: "917359266930",
              languageCode: "en",
              parameters: { body: [visitor.name, visitor.preferredCountry] },
            });
          }
        }
      } catch (err) {
        console.error("Visitor background task error:", err);
      }
    })();
  }

  if (visitorInvoice && results.visitor) {
    const paidAmount = (visitorInvoice.paidAmount || []).map((p) => ({
      amount: p.amount,
      date: p.date || Date.now(),
      bank: p.bank || null,
      paymentMode: p.paymentMode || null,
    }));

    const visitorInvoiceData = await GenerateInvoice.create({
      name: results.visitor._id,
      contactNo: results.visitor.contact,
      mainPlan: visitorInvoice.mainPlan,
      subPlan: visitorInvoice.subPlan,
      amount: visitorInvoice.amount,
      discount: visitorInvoice.discount,
      payableAmount: visitorInvoice.payableAmount,
      paidAmount,
      dueAmount: visitorInvoice.dueAmount,
      paymentType: visitorInvoice.paymentType,
      remarks: visitorInvoice.remarks,
      created_by: userId,
      createdByName: userName,
    });

    results.visitorInvoice = visitorInvoiceData;

    const { mainPlanName, subPlanName } = await getPlanNames(
      visitorInvoice.mainPlan,
      visitorInvoice.subPlan,
    );
    const feePaidAmount = paidAmount?.[0]?.amount;

    const historyEntry = {
      event: "visitor_fee_paid",
      value: `Fee Paid: MainPlan (${mainPlanName}) SubPlan (${
        subPlanName ? subPlanName : ""
      }) → ₹ ${feePaidAmount}`,
      updatedBy: userId,
      updatedByName: userName,
    };

    await ProcessHistory.updateOne(
      { leadId: lead._id },
      { $push: { history: historyEntry } },
      { upsert: true },
    );
  }

  // ===========================
  // STUDENT APPLICATION SECTION
  // ===========================
  if (admissionProcess || (coachingData && coachingData.coachingRequired)) {
    const studentData = { ...baseData };

    if (admissionProcess) studentData.admissionProcessRequired = true;

    if (coachingData?.coachingRequired) {
      studentData.coachingDetails = {
        coachingRequired: true,
        city: coachingData.city || "",
        examRegistrationDate: coachingData.examRegistrationDate || null,
        startDate: coachingData.startDate || null,
        endDate: coachingData.endDate || null,
        registerFor: coachingData.registerFor || null,
        coachingRequirement: coachingData.coachingRequirement || null,
        branch: coachingData.branch || null,
        batchStatus: coachingData.batchStatus || null,
        batchFaculty: coachingData.batchFaculty || null,
        batchTiming: coachingData.batchTiming || null,
        targetedScore: coachingData.targetedScore || null,
        hasGivenExam: coachingData.hasGivenExam || false,
        examDetails: Array.isArray(coachingData.examDetails)
          ? coachingData.examDetails.map((exam) => ({
              examName: exam.examName || null,
              scores: {
                reading: exam.scores?.reading || null,
                writing: exam.scores?.writing || null,
                speaking: exam.scores?.speaking || null,
                listening: exam.scores?.listening || null,
                total: exam.scores?.total || null,
              },
              document: exam.document || null,
            }))
          : [],
        remarks: coachingData.remarks || "",
      };
    }

    const student = await StudentApplication.create(studentData);

    results.student = student;

    const historyUpdates = [];

    let conversionType = "";

    if (admissionProcess === true && coachingData?.coachingRequired === true) {
      conversionType = "Student + Coaching Application";
    } else if (admissionProcess === true) {
      conversionType = "Student application";
    } else if (coachingData?.coachingRequired === true) {
      conversionType = "Coaching Application";
    } else {
      conversionType = "Student Application";
    }

    historyUpdates.push({
      event: "lead_converted",
      value: `Converted to ${conversionType} (Student ID: ${student.studentId})`,
      updatedBy: userId,
      updatedByName: userName,
    });

    await ProcessHistory.updateOne(
      { leadId: lead._id },
      {
        $set: {
          studentId: student._id, // 👉 store reference to StudentApplication
        },
        $push: {
          history: { $each: historyUpdates },
        },
      },
      {
        upsert: true,
      },
    );

    // Coaching invoice
    if (coachingData?.invoice && coachingData.coachingRequired === true) {
      const coachingInvoice = await GenerateInvoice.create({
        name: student._id,
        contactNo: student.contact,
        mainPlan: coachingData.invoice.mainPlan,
        subPlan: coachingData.invoice.subPlan,
        amount: coachingData.invoice.amount,
        discount: coachingData.invoice.discount,
        payableAmount: coachingData.invoice.payableAmount,
        paidAmount: (coachingData.invoice.paidAmount || []).map((p) => ({
          amount: p.amount,
          date: p.date || Date.now(),
          bank: p.bank || null,
          paymentMode: p.paymentMode || null,
        })),
        dueAmount: coachingData.invoice.dueAmount,
        paymentType: coachingData.invoice.paymentType,
        remarks: coachingData.invoice.remarks,
        created_by: userId,
        createdByName: userName,
      });

      results.coachingInvoice = coachingInvoice;

      const invoice = coachingData.invoice;

      const { mainPlanName, subPlanName } = await getPlanNames(
        invoice.mainPlan,
        invoice.subPlan,
      );

      const paidAmount = invoice?.paidAmount?.[0]?.amount;

      const historyEntry = {
        event: "coaching_fee_paid",
        value: `Fee Paid: MainPlan (${mainPlanName}) SubPlan (${
          subPlanName ? subPlanName : ""
        }) → ₹ ${paidAmount}`,
        updatedBy: userId,
        updatedByName: userName,
      };

      await ProcessHistory.updateOne(
        { leadId: lead._id },
        { $push: { history: historyEntry } },
        { upsert: true },
      );
    }

    // Admission invoice
    if (admissionData?.invoice && admissionProcess === true) {
      const admissionInvoice = await GenerateInvoice.create({
        name: student._id,
        contactNo: student.contact,
        mainPlan: admissionData.invoice.mainPlan,
        subPlan: admissionData.invoice.subPlan,
        amount: admissionData.invoice.amount,
        discount: admissionData.invoice.discount,
        discountAmount: admissionData.invoice.discountAmount,
        payableAmount: admissionData.invoice.payableAmount,
        paidAmount: (admissionData.invoice.paidAmount || []).map((p) => ({
          amount: p.amount,
          date: p.date || Date.now(),
          bank: p.bank || null,
          paymentMode: p.paymentMode || null,
        })),
        dueAmount: admissionData.invoice.dueAmount,
        paymentType: admissionData.invoice.paymentType,
        remarks: admissionData.invoice.remarks,
        created_by: userId,
        createdByName: userName,
      });

      results.admissionInvoice = admissionInvoice;

      const invoice = admissionData.invoice;

      const { mainPlanName, subPlanName } = await getPlanNames(
        invoice.mainPlan,
        invoice.subPlan,
      );

      const paidAmount = invoice?.paidAmount?.[0]?.amount;

      const historyEntry = {
        event: "admission_fee_paid",
        value: `Admission Fee Paid: MainPlan (${mainPlanName}) SubPlan (${
          subPlanName ? subPlanName : ""
        } → ₹ ${paidAmount})`,
        updatedBy: userId,
        updatedByName: userName,
      };

      await ProcessHistory.updateOne(
        { leadId: lead._id },
        { $push: { history: historyEntry } },
        { upsert: true },
      );
    }

    // Background email + WhatsApp notifications
    (async () => {
      try {
        if (admissionProcess && student.email) {
          if (userType !== "B2B Admin" && userType !== "B2B Member") {
            await sendStudentWelcomeEmail(student.email, student.name);
            await sendSingleMessage({
              to: student.contact,
              templateId: null,
              templateName: "welcome_application_start1",
              fromNumberId: "917359266930",
              languageCode: "en",
              parameters: { body: [student.name] },
            });
          }
        }

        if (coachingData?.coachingRequired && student.email) {
          if (userType !== "B2B Admin" && userType !== "B2B Member") {
            await sendCoachingWelcomeEmail(student.email, student.name);
            await sendSingleMessage({
              to: student.contact,
              templateId: null,
              templateName: "coaching_admission_welcome1",
              fromNumberId: "917359266930",
              languageCode: "en",
              parameters: { body: [student.name] },
            });
          }
        }
      } catch (bgError) {
        console.error("Student background task error:", bgError);
      }
    })();
  }

  return results;
};
const getAssignedUsers = async (currentUser, fromB2B) => {
  const leadFilter = {
    "lead_assign.user": { $ne: null },
  };

  if (typeof fromB2B !== "undefined") {
    if (fromB2B === "true" || fromB2B === true) {
      leadFilter.fromB2B = true;
    } else if (fromB2B === "false" || fromB2B === false) {
      leadFilter.$or = [{ fromB2B: false }, { fromB2B: { $exists: false } }];
    }
  }
  // ✅ Get assigned user IDs from filtered leads
  const assignedUserIds = await Lead.distinct("lead_assign.user", leadFilter);

  if (!assignedUserIds.length) return [];

  // ✅ Now filter users based on those IDs
  const userFilter = {
    _id: { $in: assignedUserIds },
  };

  // ✅ Apply user-type based filtering
  if (currentUser?.userType === "user") {
    userFilter.branchId = { $in: [null, undefined] };
  } else if (
    currentUser?.userType === "Branch" ||
    currentUser?.userType === "Branch User"
  ) {
    const branchId = currentUser?.branch?._id;
    if (!branchId) {
      throw { status: false, message: "Branch ID not found in current user" };
    }
    userFilter.branchId = branchId;
  }

  // ✅ Fetch assigned users
  const assignedUsers = await user.find(userFilter).select("_id name email");

  return assignedUsers;
};

const getLeadFrom = async () => {
  let assignedLeadFroms = await Lead.distinct("lead_form", {
    lead_form: { $ne: null },
  });

  assignedLeadFroms = assignedLeadFroms.filter(
    (item) => item && item.trim() !== "",
  );

  return assignedLeadFroms;
};

const sendWPMessage = async (data) => {
  const { phoneNumber, categoryId, customMessage } = data;

  if (!phoneNumber || (!categoryId && !customMessage)) {
    throw {
      status: false,
      message: "phoneNumber and either category or customMessage is required",
    };
  }

  let message = "";
  if (customMessage) {
    message = customMessage;
  } else {
    const template = await WpTemplate.findOne({ category: categoryId });
    if (!template) {
      throw { status: false, message: "Message template not found" };
    }
    message = template.message;
  }

  const formattedNumber = phoneNumber.replace(/[^\d]/g, "");
  const encodedMessage = encodeURIComponent(message);

  const whatsappUrl = `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`;

  return whatsappUrl;
};

const countryList = async (fromB2B) => {
  const matchStage = { country_interested: { $ne: "" } };

  if (typeof fromB2B !== "undefined") {
    if (fromB2B === "true" || fromB2B === true) {
      matchStage.fromB2B = true;
    } else if (fromB2B === "false" || fromB2B === false) {
      matchStage.$or = [{ fromB2B: false }, { fromB2B: { $exists: false } }];
    }
  }

  const result = await Lead.aggregate([
    { $match: matchStage },
    { $unwind: "$country_interested" },
    { $match: { country_interested: { $ne: "" } } },
    { $group: { _id: { $toLower: "$country_interested" } } },
    { $sort: { _id: 1 } },
  ]);

  const countries = result.map((r) => r._id);
  return countries;
};

const eodReport = async () => {
  const result = await sendEODReport();
  return result;
};

const applicationProcess = async (id) => {
  // Step 1: Try with leadId
  let historyDoc = await ProcessHistory.findOne({ leadId: id })
    .populate("history.updatedBy", "name email")
    .lean();

  // Step 2: If not found → try with studentId
  if (!historyDoc) {
    historyDoc = await ProcessHistory.findOne({ studentId: id })
      .populate("history.updatedBy", "name email")
      .lean();
  }

  // Step 3: If still not found → return no history
  if (!historyDoc) {
    return {
      status: true,
      message: "No history found for this lead or student",
      data: [],
    };
  }

  return historyDoc;
};

const getPendingFollowUps = async (
  page = 1,
  limit = 10,
  searchOnField,
  search,
  status,
  subStatus,
  currentUser,
  assignedToUserId,
  assignRole,
  lead_from,
  branchId,
  showAll = false,
  leadActivity,
  followUpType,
  country,
  updatedOn,
) => {
  const skip = (page - 1) * limit;

  // const endOfToday = new Date();
  // endOfToday.setHours(23, 59, 59, 999);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const filter = {
    next_follow_up: { $lte: endOfToday },

    $and: [
      {
        $or: [{ fromB2B: false }, { fromB2B: { $exists: false } }],
      },
    ],

    $nor: [
      {
        next_follow_up: { $gte: startOfToday, $lte: endOfToday },
      },
      {
        lead_status: "Converted",
      },
    ],
  };

  if (updatedOn) {
    const start = new Date(updatedOn);
    start.setHours(0, 0, 0, 0);

    const end = new Date(updatedOn);
    end.setHours(23, 59, 59, 999);

    filter.updatedAt = {
      $gte: start,
      $lte: end,
    };
  }

  if (lead_from) {
    filter.lead_form = lead_from;
  }

  // if (search) {
  //   const regex = { $regex: search, $options: "i" };
  //   filter.$or = [
  //     { name: regex },
  //     { email: regex },
  //     { phone: regex },
  //     { alternate_contact: regex },
  //     { address: regex },
  //     { country_interested: regex },
  //     { course: regex },
  //     { level: regex },
  //     { budget: regex },
  //     { english_proficiency: regex },
  //     { passport: regex }
  //   ];
  // }

  if (search) {
    const regex = { $regex: search, $options: "i" };

    if (searchOnField) {
      filter[searchOnField] = regex;
    } else {
      filter.$or = [
        { leadId: regex },
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
      ];
    }
  }
  if (status) {
    filter.lead_status = status;
  }
  if (subStatus) {
    filter.lead_sub_status = subStatus;
  }
  if (country) {
    filter.country_interested = {
      $in: [new RegExp(`^${country}$`, "i")], // 'i' makes it case-insensitive
    };
  }

  if (assignedToUserId && mongoose.Types.ObjectId.isValid(assignedToUserId)) {
    filter["lead_assign.user"] = assignedToUserId;
  }
  if (assignRole && mongoose.Types.ObjectId.isValid(assignRole)) {
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $and: [
          { "lead_assign.role": new mongoose.Types.ObjectId(assignRole) },
          { lead_assign_Branch: new mongoose.Types.ObjectId(branchId) },
        ],
      });
    } else {
      filter["lead_assign.role"] = new mongoose.Types.ObjectId(assignRole);
    }
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
      member._id.toString(),
    );
    filter.$or = [
      { created_by: { $in: [currentUser.userId, ...branchMemberIds] } },
      { lead_assign_Branch: currentUser.userId },
    ];
  } else if (userRole === "Branch User") {
    const branch = await Branch.findOne({ name: currentUser.branch });

    if (branch) {
      const branchMembers = await user
        .find({
          branchId: branch._id,
        })
        .select("_id");
      const branchMemberIds = branchMembers.map((member) =>
        member._id.toString(),
      );
      filter.$or = [
        { created_by: { $in: [branch._id, ...branchMemberIds] } },
        { lead_assign_Branch: branch._id },
      ];
    } else {
      // fallback: only show records created by the branch user themselves
      filter.created_by = currentUser.userId;
    }
  } else if (roleName === "Super Admin") {
    if (String(showAll) === "true") {
      // Show all leads, no branchId filtering
    } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      const branchUsers = await user.find({ branchId }).select("_id");
      const branchUserIds = branchUsers.map((user) => user._id.toString());
      // filter.created_by = { $in: [...branchUserIds, branchId] }; // users + branch
      filter.$or = [
        { created_by: { $in: [...branchUserIds, branchId] } },
        { lead_assign_Branch: branchId },
      ];
    } else {
      // No branchId provided, get users with no branch assigned
      const noBranchUsers = await user
        .find({ branchId: { $in: [null, undefined] } })
        .select("_id");
      const noBranchUserIds = noBranchUsers.map((user) => user._id.toString());
      filter.created_by = { $in: noBranchUserIds };

      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { lead_assign_Branch: null },
          { lead_assign_Branch: { $exists: false } },
        ],
      });
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

  const duplicateContacts = await Lead.aggregate([
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

  const leads = await Lead.find(filter)
    .populate([
      { path: "lead_assign_Branch", select: "name code" },
      { path: "lead_assign.role", select: "name" },
      { path: "lead_assign.user", select: "name email" },

      { path: "interestedCourseDetails.institute", select: "instituteName" },
      { path: "interestedCourseDetails.campus", select: "campus" },
      { path: "interestedCourseDetails.programLevel", select: "name" },
      {
        path: "interestedCourseDetails.course",
        select: "name duration tuitionFee",
      },
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalLeads = await Lead.countDocuments(filter);

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
        "companyName",
      ),
      B2BMember.find({ _id: { $in: groupedByType.B2BMember } }).select(
        "firstName lastName",
      ),
      Branch.find({ _id: { $in: groupedByType.Branch } }).select("name"),
      BranchMember.find({ _id: { $in: groupedByType.BranchMember } }).select(
        "firstName lastName",
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

  // Lead Assign Mapping
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

module.exports = {
  createLead,
  insertManyLeads,
  getLeadById,
  updateLead,
  bulkUpdateLeadAssign,
  getLeadHistory,
  deleteLead,
  getAllLead,
  getB2BLead,
  LeadsByUserId,
  filterLeadsByDate,
  // downloadLeadsByIdsService,
  downloadLeadsByFilter,
  deleteManyLeads,
  findLeadByPhoneAndForm,
  getAllFollowUpLeads,
  getFollowUpLeadsByDate,
  getLeadsByAssignedUser,
  convertLeadToStudentApplication,
  getAssignedUsers,
  getLeadFrom,
  sendWPMessage,
  countryList,
  eodReport,
  birthday,
  allNewLead,
  applicationProcess,
  getPendingFollowUps,
};
