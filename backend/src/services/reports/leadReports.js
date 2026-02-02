const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

const LeadReports = require("../../../model/lead");
const B2BMember = require("../../../model/masters/b2b/b2bMember");
const user = require("../../../model/user");
const leadStatus = require("../../../model/leadStatus");

const Paginate = require("../../../utils/pagination");

const leadReportServices = {
  getAllUniqueSources: async () => {
    const sources = await LeadReports.distinct("source_of_reference", {
      source_of_reference: { $ne: "" },
    });
    return sources;
  },
  leadSourceReport: async (
    page,
    limit,
    searchOnField,
    searchText = "",
    source = "",
    status = "",
    subStatus,
    assignId = "",
    assignRole = "",
    currentUser,
    branchId,
    showAll = false,
    startDate = "",
    endDate = "",
    leadActivity,
    country,
    followUpType,
    lead_from
  ) => {
    const query = {
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

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    if (leadActivity === "Active") {
      query.$and.push({
        $or: [{ deadLead: false }, { deadLead: { $exists: false } }],
      });
    } else if (leadActivity === "Inactive") {
      query.$and.push({ deadLead: true });
    }

    if (source) {
      query.source_of_reference = source;
    }

    if (followUpType && mongoose.Types.ObjectId.isValid(followUpType)) {
      query.follow_up_type = followUpType;
    }

    if (country) {
      let countries = [];

      // country comes as array → ["", ""]
      if (Array.isArray(country)) {
        countries = country.filter(
          (c) => typeof c === "string" && c.trim() !== ""
        );
      }
      // country comes as string → "India,Canada"
      else if (typeof country === "string") {
        countries = country
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
      }

      if (countries.length > 0) {
        query.$and.push({
          country_interested: {
            $in: countries.map((c) => new RegExp(`^${c}$`, "i")),
          },
        });
      }
    }

    if (lead_from) {
      query.lead_form = lead_from;
    }

    if (status) {
      query.lead_status = status;
    }

    if (subStatus) {
      query.lead_sub_status = subStatus;
    }

    if (assignId && mongoose.Types.ObjectId.isValid(assignId)) {
      query.lead_assign = assignId;
    }
    if (assignRole) {
      if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
        query.$and = query.$and || [];
        query.$and.push({
          $and: [{ lead_role: assignRole }, { lead_assign_Branch: branchId }],
        });
      } else {
        query.lead_role = assignRole;
      }
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
      const memberIds = b2bMembers.map((m) => m._id.toString());
      query.created_by = { $in: [currentUser.userId, ...memberIds] };
    } else if (roleName === "B2B Member") {
      query.created_by = currentUser.userId;
    } else if (roleName === "Branch") {
      const branchMembers = await user
        .find({ branchId: currentUser.userId })
        .select("_id");
      const memberIds = branchMembers.map((m) => m._id.toString());
      query.$or = [
        { created_by: { $in: [currentUser.userId, ...memberIds] } },
        { lead_assign_Branch: currentUser.userId },
      ];
    } else if (userRole === "Branch User") {
      query.created_by = currentUser.userId;
    } else if (roleName === "Super Admin") {
      if (String(showAll) === "true") {
        // no filter
      } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
        const branchUsers = await user.find({ branchId }).select("_id");
        const userIds = branchUsers.map((u) => u._id.toString());
        // query.created_by = { $in: [...userIds, branchId] };
        query.$or = [
          { created_by: { $in: [...userIds, branchId] } },
          { lead_assign_Branch: branchId },
        ];
      } else {
        const noBranchUsers = await user
          .find({ branchId: { $in: [null, undefined] } })
          .select("_id");
        const noBranchUserIds = noBranchUsers.map((u) => u._id.toString());
        query.created_by = { $in: noBranchUserIds };

        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { lead_assign_Branch: null },
            { lead_assign_Branch: { $exists: false } },
          ],
        });
      }
    } else {
      query.created_by_type = {
        $nin: [
          "Branch",
          "Branch Member",
          "B2B Admin",
          "B2B Member",
          "Branch User",
        ],
      };
    }

    if (searchText) {
      const regex = { $regex: searchText, $options: "i" };

      if (searchOnField) {
        query.$and.push({ [searchOnField]: regex });
      } else {
        query.$and.push({
          $or: [
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
          ],
        });
      }
    }

    const populateFields = [{ path: "lead_assign", select: "name" }];

    // query.deadLead = { $ne: true };

    const result = await Paginate(
      LeadReports,
      query,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      {}
    );

    // Fetch all lead statuses once
    const leadStatuses = await leadStatus
      .find({}, { name: 1, color: 1 })
      .lean();

    // Add color to each item in result.docs
    result.data = result.data.map((doc) => {
      const matchedStatus = leadStatuses.find(
        (status) => status.name === doc.lead_status
      );
      return {
        ...doc,
        leadStatusColor: matchedStatus?.color || null,
      };
    });

    return result;
  },
  exportDataToExcel: async (ids) => {
    const dataList = await LeadReports.find({ _id: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate({ path: "lead_assign", populate: "name" });
    if (!dataList.length) {
      throw { success: false, message: "No Students found." };
    }

    const downloadsDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, "leadReports.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "date", title: "Date" },
        { id: "name", title: "name" },
        { id: "phone", title: "Phone Number" },
        { id: "leadStatus", title: "status" },
        { id: "leadFrom", title: "lead from" },
        { id: "leadSource", title: "lead source" },
        { id: "city", title: "city" },
        { id: "remark", title: "remark" },
      ],
    });

    const records = dataList.map((item) => ({
      date: item.createdAt?.toISOString().split("T")[0] || "",
      name: item.name || "",
      phone: item.phone ? `'${item.phone}` : "",
      leadStatus: item.lead_status || "",
      leadFrom: item.lead_form || "",
      leadSource: item.source_of_reference || "",
      city: item.city || "",
      remark: item.remarks || "",
    }));

    await csvWriter.writeRecords(records);
    return { success: true, filePath };
  },
};

module.exports = leadReportServices;
