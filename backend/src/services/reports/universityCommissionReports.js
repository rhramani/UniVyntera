const StudentApplication = require("../../../model/masters/studentApplication/studentApplication");
const B2BMember = require("../../../model/masters/b2b/b2bMember");
const User = require("../../../model/user");
const paginate = require("../../../utils/pagination");
const mongoose = require("mongoose");

const universityCommissionReportsServices = {
  universityCommission: async (
    page,
    limit,
    searchText = "",
    type,
    status,
    startDate,
    endDate,
    b2bId,
    branchId,
    reportType,
    intakeMonth,
    intakeYear,
    showAll
  ) => {
    let query = {};
    if (reportType === "pendingInvoice") {
      query = {
        "universitySideConfirmation.status": true,
        "universitytInvoiceGenerated.status": false,
      };
    } else if (reportType === "paidCommission") {
      query = {
        "universitySideConfirmation.status": true,
        "universityPaymentReceived.status": true,
      };
    } else {
      query = {
        "universitySideConfirmation.status": true,
        "universityPaymentReceived.status": false,
      };
    }

    const populateFields = [
      {
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
          { path: "course", select: "programName" },
        ],
      },
      {
        path: "uploadedDocumentDetails.created_by",
        select: "name",
      },
      { path: "mainStatus", select: "name color" },
      {
        path: "created_by",
        select: "name userType",
      },
    ];

    if (type === "b2b") {
      query.created_by_type = { $in: ["B2B Admin", "B2B Member"] };
    } else if (type === "branch") {
      query.created_by_type = { $in: ["Branch", "Branch User"] };
    }

    if (status) {
      query["accountantStatus"] = status;
    }

    if (startDate || endDate) {
      const dateFilter = {};

      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include full day
        dateFilter.$lte = end;
      }

      query["visaApplicationDetails.visaOutcomeDate"] = dateFilter;
    }

    if (b2bId && mongoose.Types.ObjectId.isValid(b2bId)) {
      const b2bMembers = await B2BMember.find({ b2bAdmin: b2bId }).select(
        "_id"
      );
      const memberIds = b2bMembers.map((m) => m._id.toString());

      query.created_by = {
        $in: [b2bId, ...memberIds],
      };
    }
    const isValidObjectId = (id) =>
      id &&
      typeof id === "string" &&
      id.trim() !== "" &&
      mongoose.Types.ObjectId.isValid(id);

    if (showAll === "true") {
    } else if (String(showAll) !== "true" && branchId) {
      if (isValidObjectId(branchId)) {
        const branchUsers = await User.find({ branchId }).select("_id");
        const branchUserIds = branchUsers.map((u) => u._id.toString());

        query.created_by = { $in: [branchId, ...branchUserIds] };
      }
      // else: showAll is false, but branchId not provided — don't filter by branch
    } else {
      query.created_by_type = "user";
    }

    if (intakeMonth || intakeYear) {
      const monthAliasMap = {
        jan: ["Jan", "January"],
        feb: ["Feb", "February"],
        mar: ["Mar", "March"],
        apr: ["Apr", "April"],
        may: ["May"],
        jun: ["Jun", "June"],
        jul: ["Jul", "July"],
        aug: ["Aug", "August"],
        sep: ["Sep", "Sept", "September"],
        oct: ["Oct", "October"],
        nov: ["Nov", "November"],
        dec: ["Dec", "December"],
      };

      const elemMatchQuery = {
        "instituteFeePayment.feeStatus": "paid",
      };
      if (intakeMonth) {
        const normalizedKey = intakeMonth.toLowerCase().slice(0, 3);
        const monthVariants = monthAliasMap[normalizedKey] || [intakeMonth];
        elemMatchQuery.intakeMonth = { $in: monthVariants };
      }

      if (intakeYear) {
        elemMatchQuery.intakeYear = intakeYear;
      }

      query.interestedCourseDetails = { $elemMatch: elemMatchQuery };
    }

    const searchOptions = {
      searchText,
      searchFields: ["studentId", "name", "email"],
    };
    const getAll = await paginate(
      StudentApplication,
      query,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    return getAll;
  },
};

module.exports = universityCommissionReportsServices;
