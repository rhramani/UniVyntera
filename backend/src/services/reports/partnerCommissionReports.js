const mongoose = require("mongoose");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");
const path = require("path");

const StudentApplication = require("../../../model/masters/studentApplication/studentApplication");
const B2BAdmin = require("../../../model/masters/b2b/b2bAdmin");
const B2BMember = require("../../../model/masters/b2b/b2bMember");
const Branch = require("../../../model/branch/branches");
const User = require("../../../model/user");
const paginate = require("../../../utils/pagination");

const studentApplicationServices = {
  partnerCommissionSummary: async (
    page,
    limit,
    searchText = "",
    institute,
    country,
    type,
    status,
    startDate,
    endDate,
    b2bId,
    branchId,
    paymentProcess,
    currentUser
  ) => {
    const searchOptions = {
      searchText,
      searchFields: ["studentId", "name", "email", "contact"],
    };
    const filter = {
      "universityPaymentReceived.status": true,
      created_by_type: { $ne: "user" },
      // Ensure at least one b2bCommission field is present and meaningful
      $and: [
        {
          "universityPaymentReceived.b2bCommission.commissionPercentage": {
            $ne: null,
            $ne: "",
          },
        },
        {
          "universityPaymentReceived.b2bCommission.commissionAmount": {
            $ne: null,
            $ne: "",
          },
        },
        {
          "universityPaymentReceived.b2bCommission.commissionType": {
            $ne: null,
            $ne: "",
          },
        },
        {
          "universityPaymentReceived.b2bCommission.paymentProcess": {
            $ne: null,
            $ne: "",
          },
        },
      ],
    };

    if (paymentProcess) {
      filter["universityPaymentReceived.b2bCommission.paymentProcess"] =
        paymentProcess;
    }

    filter.interestedCourseDetails = {
      $elemMatch: {
        "instituteFeePayment.feeStatus": "paid",
        ...(institute && { institute }), // conditionally add institute match
      },
    };

    if (country) {
      filter["purposeDetails.preferredCountry"] = { $in: [country] };
    }
    if (status) {
      filter["accountantStatus"] = status;
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

      filter["visaApplicationDetails.visaOutcomeDate"] = dateFilter;
    }
    if (type === "b2b") {
      filter.created_by_type = { $in: ["B2B Admin", "B2B Member"] };
    } else if (type === "branch") {
      filter.created_by_type = { $in: ["Branch", "Branch User"] };
    }

    if (b2bId && mongoose.Types.ObjectId.isValid(b2bId)) {
      const b2bMembers = await B2BMember.find({ b2bAdmin: b2bId }).select(
        "_id"
      );
      const memberIds = b2bMembers.map((m) => m._id.toString());

      filter.created_by = {
        $in: [b2bId, ...memberIds],
      };
    }

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName === "Branch") {
      const branchMembers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");
      const branchMembersIds = branchMembers.map((m) => m._id.toString());
      filter.created_by = { $in: [currentUser.userId, ...branchMembersIds] };
    } else if (roleName === "Branch Member") {
      filter.created_by = currentUser.userId;
    }

    // if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
    //   const branchMembers = await User.find({
    //     branchId: branchId,
    //   }).select("_id");
    //   const branchMemberIds = branchMembers.map((m) => m._id.toString());
    //   filter.created_by = { $in: [branchId, ...branchMemberIds] };
    // }

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
      {
        path: "created_by",
        select: "name userType",
      },
    ];

    const getAll = await paginate(
      StudentApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    return getAll;
  },
  uniqueB2BAndBranchList: async () => {
    const filter = {
      "universityPaymentReceived.status": true,
      created_by_type: { $ne: "user" },
      $and: [
        {
          "universityPaymentReceived.b2bCommission.commissionPercentage": {
            $ne: null,
            $ne: "",
          },
        },
        {
          "universityPaymentReceived.b2bCommission.commissionAmount": {
            $ne: null,
            $ne: "",
          },
        },
        {
          "universityPaymentReceived.b2bCommission.commissionType": {
            $ne: null,
            $ne: "",
          },
        },
        {
          "universityPaymentReceived.b2bCommission.paymentProcess": {
            $ne: null,
            $ne: "",
          },
        },
      ],
      interestedCourseDetails: {
        $elemMatch: {
          "instituteFeePayment.feeStatus": "paid",
        },
      },
    };

    // Step 1: Get students
    const students = await StudentApplication.find(filter).select(
      "created_by created_by_type"
    );

    const b2bCreatedIds = [];
    const branchUserIds = [];

    students.forEach((student) => {
      const creatorId = student.created_by?.toString();
      if (!creatorId) return;

      if (
        student.created_by_type === "B2B Admin" ||
        student.created_by_type === "B2B Member"
      ) {
        b2bCreatedIds.push(creatorId);
      } else if (
        student.created_by_type === "Branch" ||
        student.created_by_type === "Branch User"
      ) {
        branchUserIds.push(creatorId);
      }
    });

    // Step 2: B2B Members => Admins
    const b2bMembers = await B2BMember.find({
      _id: { $in: b2bCreatedIds },
    }).select("_id b2bAdmin");

    const memberToAdminMap = new Map();
    b2bMembers.forEach((m) => {
      memberToAdminMap.set(m._id.toString(), m.b2bAdmin.toString());
    });

    const finalB2BAdminIds = new Set();
    b2bCreatedIds.forEach((id) => {
      if (memberToAdminMap.has(id)) {
        finalB2BAdminIds.add(memberToAdminMap.get(id));
      } else {
        finalB2BAdminIds.add(id);
      }
    });

    const b2bAdmins = await B2BAdmin.find({
      _id: { $in: Array.from(finalB2BAdminIds) },
    }).select("name email companyName");

    // Step 3: Get Branch Users and then fetch their branches
    const branchUsers = await User.find({
      _id: { $in: branchUserIds },
    }).select("branchId");

    const branchIds = branchUsers
      .map((user) => user.branchId?.toString())
      .filter((id) => id);

    const branches = await Branch.find({
      _id: { $in: branchIds },
    }).select("name email");

    return {
      b2bAdmins,
      branches,
    };
  },
  pendingB2BInvoice: async (
    page,
    limit,
    searchText = "",
    startDate,
    endDate,
    country,
    type,
    b2bId,
    branchId,
    showAll
  ) => {
    const filter = {
      created_by_type: {
        $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
      },
      "universityPaymentReceived.status": true,
      "universityPaymentReceived.b2bCommission.paymentProcess": "Pending",
      //   $and: [
      //     {
      //       "universityPaymentReceived.b2bCommission.commissionPercentage": {
      //         $ne: null,
      //         $ne: "",
      //       },
      //     },
      //     {
      //       "universityPaymentReceived.b2bCommission.commissionAmount": {
      //         $ne: null,
      //         $ne: "",
      //       },
      //     },
      //     {
      //       "universityPaymentReceived.b2bCommission.commissionType": {
      //         $ne: null,
      //         $ne: "",
      //       },
      //     },
      //     {
      //       "universityPaymentReceived.b2bCommission.paymentProcess": {
      //         $ne: null,
      //         $ne: "",
      //       },
      //     },
      //     {
      //       $or: [
      //         { b2bInvoice: { $exists: false } },
      //         { "b2bInvoice.date": { $in: [null, ""] } },
      //         { "b2bInvoice.number": { $in: [null, ""] } },
      //       ],
      //     },
      //   ],
    };

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

      filter["universitytInvoiceGenerated.date"] = dateFilter;
    }

    if (type === "b2b") {
      filter.created_by_type = { $in: ["B2B Admin", "B2B Member"] };
    } else if (type === "branch") {
      filter.created_by_type = { $in: ["Branch", "Branch User"] };
    }

    if (country) {
      filter["purposeDetails.preferredCountry.0"] = country;
    }

    if (b2bId && mongoose.Types.ObjectId.isValid(b2bId)) {
      const b2bMembers = await B2BMember.find({ b2bAdmin: b2bId }).select(
        "_id"
      );
      const memberIds = b2bMembers.map((m) => m._id.toString());

      filter.created_by = {
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

        filter.created_by = { $in: [branchId, ...branchUserIds] };
      }
      // else: showAll is false, but branchId not provided — don't filter by branch
    }
    // else {
    //     filter.created_by_type = "user";
    // }

    const searchOptions = {
      searchText,
      searchFields: ["studentId", "name", "email", "contact"],
    };
    const getAll = await paginate(
      StudentApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    return getAll;
  },
  partnerConversionReport: async (
    type,
    page = 1,
    limit = 10,
    searchText = ""
  ) => {
    const typesToFetch = !type ? ["b2b", "branch"] : [type];

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    let allGroupEntities = [];

    for (const currentType of typesToFetch) {
      if (!["b2b", "branch"].includes(currentType)) {
        throw new Error(
          "Invalid type. Must be 'b2b', 'branch' or empty for both"
        );
      }

      if (currentType === "b2b") {
        const b2bMembers = await B2BMember.find({}, "b2bAdmin _id");
        const b2bGroups = {};

        b2bMembers.forEach((member) => {
          const adminId = String(member.b2bAdmin);
          if (!b2bGroups[adminId]) {
            b2bGroups[adminId] = new Set();
          }
          b2bGroups[adminId].add(String(member._id));
        });

        const query = searchText
          ? {
              _id: { $in: Object.keys(b2bGroups) },
              companyName: new RegExp(searchText, "i"),
            }
          : { _id: { $in: Object.keys(b2bGroups) } };

        const b2bAdmins = await B2BAdmin.find(query, "_id companyName");

        const b2bGroupEntities = b2bAdmins.map((admin) => {
          const memberIds = [...(b2bGroups[String(admin._id)] || [])];
          return {
            id: admin._id,
            name: admin.companyName,
            createdByList: [String(admin._id), ...memberIds],
            type: "b2b",
          };
        });

        allGroupEntities = [...allGroupEntities, ...b2bGroupEntities];
      }

      if (currentType === "branch") {
        const branchUsers = await User.find(
          { branchId: { $exists: true, $ne: null } },
          "_id branchId name"
        );
        const branchGroups = {};
        branchUsers.forEach((user) => {
          const branchId = String(user.branchId);

          if (!branchGroups[branchId]) {
            branchGroups[branchId] = new Set();
          }
          branchGroups[branchId].add(String(user._id));
        });

        const query = searchText
          ? {
              _id: { $in: Object.keys(branchGroups) },
              name: new RegExp(searchText, "i"),
            }
          : { _id: { $in: Object.keys(branchGroups) } };
        const branches = await Branch.find(query, "_id name");

        const branchGroupEntities = branches.map((branch) => {
          const users = [...(branchGroups[String(branch._id)] || [])];
          return {
            id: branch._id,
            name: branch.name,
            createdByList: [String(branch._id), ...users],
            type: "branch",
          };
        });

        allGroupEntities = [...allGroupEntities, ...branchGroupEntities];
      }
    }

    // Pagination logic
    const totalRecords = allGroupEntities.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const paginatedData = allGroupEntities.slice(skip, skip + limit);

    // Resolve counts for paginated data
    const data = await Promise.all(
      paginatedData.map(async (entity) => {
        const createdByObjectIds = entity.createdByList.map(
          (id) => new mongoose.Types.ObjectId(id)
        );

        const totalStudents = await StudentApplication.countDocuments({
          created_by: { $in: createdByObjectIds },
        });

        const enrolledStudents = await StudentApplication.countDocuments({
          created_by: { $in: createdByObjectIds },
          interestedCourseDetails: {
            $elemMatch: { "instituteFeePayment.feeStatus": "paid" },
          },
        });

        return {
          type: entity.type,
          name: entity.name,
          totalStudents,
          enrolledStudents,
        };
      })
    );

    return {
      totalRecords,
      currentPage: page,
      totalPages,
      pageSize: limit,
      data,
    };
  },
  exportPartnerConversionReport: async (type) => {
    const typesToFetch = !type ? ["b2b", "branch"] : [type];

    let allGroupEntities = [];

    for (const currentType of typesToFetch) {
      if (!["b2b", "branch"].includes(currentType)) {
        throw new Error(
          "Invalid type. Must be 'b2b', 'branch' or empty for both"
        );
      }

      if (currentType === "b2b") {
        const b2bMembers = await B2BMember.find({}, "b2bAdmin _id");
        const b2bGroups = {};

        b2bMembers.forEach((member) => {
          const adminId = String(member.b2bAdmin);
          if (!b2bGroups[adminId]) {
            b2bGroups[adminId] = new Set();
          }
          b2bGroups[adminId].add(String(member._id));
        });

        const query = { _id: { $in: Object.keys(b2bGroups) } };

        const b2bAdmins = await B2BAdmin.find(query, "_id companyName");

        const b2bGroupEntities = b2bAdmins.map((admin) => {
          const memberIds = [...(b2bGroups[String(admin._id)] || [])];
          return {
            id: admin._id,
            name: admin.companyName,
            createdByList: [String(admin._id), ...memberIds],
            type: "b2b",
          };
        });

        allGroupEntities = [...allGroupEntities, ...b2bGroupEntities];
      }

      if (currentType === "branch") {
        const branchUsers = await User.find(
          { branchId: { $exists: true, $ne: null } },
          "_id branchId name"
        );

        const branchGroups = {};
        branchUsers.forEach((user) => {
          const branchId = String(user.branchId);
          if (!branchGroups[branchId]) {
            branchGroups[branchId] = new Set();
          }
          branchGroups[branchId].add(String(user._id));
        });

        const query = { _id: { $in: Object.keys(branchGroups) } };
        const branches = await Branch.find(query, "_id name");

        const branchGroupEntities = branches.map((branch) => {
          const users = [...(branchGroups[String(branch._id)] || [])];
          return {
            id: branch._id,
            name: branch.name,
            createdByList: [String(branch._id), ...users],
            type: "branch",
          };
        });

        allGroupEntities = [...allGroupEntities, ...branchGroupEntities];
      }
    }

    const data = await Promise.all(
      allGroupEntities.map(async (entity) => {
        const createdByObjectIds = entity.createdByList.map(
          (id) => new mongoose.Types.ObjectId(id)
        );

        const totalStudents = await StudentApplication.countDocuments({
          created_by: { $in: createdByObjectIds },
        });

        const enrolledStudents = await StudentApplication.countDocuments({
          created_by: { $in: createdByObjectIds },
          interestedCourseDetails: {
            $elemMatch: { "instituteFeePayment.feeStatus": "paid" },
          },
        });

        return {
          type: entity.type,
          name: entity.name,
          totalStudents,
          enrolledStudents,
        };
      })
    );

    // CSV Export
    const downloadDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    const filePath = path.join(downloadDir, "partnerConversion.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "type", title: "Type" },
        { id: "name", title: "Name" },
        { id: "totalStudents", title: "Total Students" },
        { id: "enrolledStudents", title: "Enrolled Students" },
      ],
    });

    await csvWriter.writeRecords(data);

    return { success: true, filePath };
  },

  pendingB2BCountry: async () => {
    const countries = await StudentApplication.aggregate([
      {
        $match: {
          created_by_type: { $in: ["B2B Admin", "B2B Member"] },
          "universityPaymentReceived.status": true,
          $and: [
            {
              "universityPaymentReceived.b2bCommission.commissionPercentage": {
                $ne: null,
                $ne: "",
              },
            },
            {
              "universityPaymentReceived.b2bCommission.commissionAmount": {
                $ne: null,
                $ne: "",
              },
            },
            {
              "universityPaymentReceived.b2bCommission.commissionType": {
                $ne: null,
                $ne: "",
              },
            },
            {
              "universityPaymentReceived.b2bCommission.paymentProcess": {
                $ne: null,
                $ne: "",
              },
            },
            {
              $or: [
                { b2bInvoice: { $exists: false } },
                { "b2bInvoice.date": { $in: [null, ""] } },
                { "b2bInvoice.number": { $in: [null, ""] } },
              ],
            },
          ],
        },
      },
      {
        $project: {
          preferredCountries: "$purposeDetails.preferredCountry",
        },
      },
      {
        $unwind: "$preferredCountries",
      },
      {
        $group: {
          _id: null,
          countries: { $addToSet: "$preferredCountries" },
        },
      },
      {
        $project: {
          _id: 0,
          countries: 1,
        },
      },
    ]);

    return countries[0]?.countries || [];
  },
  downloadPendingB2BInvoice: async (
    searchText = "",
    startDate,
    endDate,
    country,
    type,
    b2bId,
    branchId,
    showAll
  ) => {
    const filter = {
      created_by_type: {
        $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
      },
      "universityPaymentReceived.status": true,
      "universityPaymentReceived.b2bCommission.paymentProcess": "Pending",
    };

    // 🗓 Date filter
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      filter["universitytInvoiceGenerated.date"] = dateFilter;
    }

    if (type === "b2b") {
      filter.created_by_type = { $in: ["B2B Admin", "B2B Member"] };
    } else if (type === "branch") {
      filter.created_by_type = { $in: ["Branch", "Branch User"] };
    }

    // 🌍 Country
    if (country) {
      filter["purposeDetails.preferredCountry.0"] = country;
    }
    if (b2bId && mongoose.Types.ObjectId.isValid(b2bId)) {
      const members = await B2BMember.find({ b2bAdmin: b2bId }).select("_id");
      const memberIds = members.map((m) => m._id.toString());
      filter.created_by = { $in: [b2bId, ...memberIds] };
    }

    // 🏢 Branch
    const isValidObjectId = (id) =>
      id &&
      typeof id === "string" &&
      id.trim() !== "" &&
      mongoose.Types.ObjectId.isValid(id);

    if (String(showAll) !== "true" && isValidObjectId(branchId)) {
      const branchUsers = await User.find({ branchId }).select("_id");
      const branchUserIds = branchUsers.map((u) => u._id.toString());
      filter.created_by = { $in: [branchId, ...branchUserIds] };
    }

    // if (searchText) {
    //   const regex = { $regex: searchText, $options: "i" };
    //   filter.$or = [
    //     { studentId: regex },
    //     { name: regex },
    //     // { email: regex },
    //     // { contact: regex },
    //   ];
    // }

    if (searchText) {
          const regex = { $regex: search, $options: "i" };
          filter.$or = [
            { companyName: regex },
            { email: regex },
            { contactPerson: regex },
            { city: regex },
            { state: regex },
          ];
        }

    const records = await StudentApplication.find(filter)
      .populate([
        {
          path: "interestedCourseDetails",
          populate: [
            { path: "institute", select: "instituteName" },
            { path: "course", select: "programName" },
          ],
        },
        { path: "created_by", select: "name userType" },
      ])
      .sort({ createdAt: -1 })
      .lean();

    if (!records.length) {
      return { success: false, message: "No pending B2B invoices found" };
    }

    const downloadsDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const fileName = `pending_b2b_invoice_${Date.now()}.csv`;
    const filePath = path.join(downloadsDir, fileName);

    // 🧾 CSV writer
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "studentId", title: "Student ID" },
        { id: "name", title: "Student Name" },
        { id: "email", title: "Email" },
        { id: "createdBy", title: "Created By" },
        { id: "createdByType", title: "Created By Type" },
        { id: "country", title: "Country" },
        { id: "institute", title: "Institute" },
        { id: "course", title: "Course" },
        { id: "commissionType", title: "Commission Type" },
        { id: "commissionPercentage", title: "Commission %" },
        { id: "commissionAmount", title: "Commission Amount" },
        { id: "paymentProcess", title: "Payment Status" },
      ],
    });

    const csvData = records.map((r) => ({
      studentId: r.studentId || "",
      name: r.name || "",
      email: r.email || "",
      createdBy: r.created_by?.name || "",
      createdByType: r.created_by_type || "",
      country: r.purposeDetails?.preferredCountry?.[0] || "",
      institute: r.interestedCourseDetails?.[0]?.institute?.instituteName || "",
      course: r.interestedCourseDetails?.[0]?.course?.programName || "",
      commissionType:
        r.universityPaymentReceived?.b2bCommission?.commissionType || "",
      commissionPercentage:
        r.universityPaymentReceived?.b2bCommission?.commissionPercentage || "",
      commissionAmount:
        r.universityPaymentReceived?.b2bCommission?.commissionAmount || "",
      paymentProcess:
        r.universityPaymentReceived?.b2bCommission?.paymentProcess || "",
    }));

    await csvWriter.writeRecords(csvData);

    return {
      success: true,
      fileName,
      filePath,
    };
  },
};

module.exports = studentApplicationServices;
