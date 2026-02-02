const mongoose = require("mongoose");

const StudentApplication = require("../../../model/masters/studentApplication/studentApplication");
const User = require("../../../model/user");
const Branch = require("../../../model/branch/branches");
const Lead = require("../../../model/lead");
const mainStatus = require("../../../model/masters/studentApplication/studentStatus");
const VisitorApplication = require("../../../model/visitorApplication/visitorApplication");
const CoachingFaculty = require("../../../model/masters/coachingDetails/coachingFaculty");

const StudentApplicationServices = {
  overAll: async (page, limit, search, startDate, endDate) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ 1. Build date filter if provided
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // ✅ 2. Fetch status IDs for comparison
    const statuses = await mainStatus
      .find({
        name: {
          $in: [
            "Application Submitted",
            "Admission Confirmed",
            "Visa Approved",
            "Visa Rejected",
            "TT Copy Received",
          ],
        },
      })
      .select("_id name");

    const statusMap = {};
    statuses.forEach((s) => {
      statusMap[s.name] = s._id.toString();
    });

    // ✅ 3. Branch filter (search by branch name)
    const branchQuery = {};
    if (search) {
      branchQuery.name = { $regex: search, $options: "i" };
    }

    // ✅ 4. Get all branches with pagination
    const totalBranches = await Branch.countDocuments(branchQuery);
    const branches = await Branch.find(branchQuery)
      .skip(skip)
      .limit(Number(limit))
      .select("_id name");

    const result = [];

    for (const branch of branches) {
      // ✅ 5. Get all users under branch
      const branchUsers = await User.find({ branchId: branch._id }).select(
        "_id"
      );
      const branchUserIds = branchUsers.map((u) => u._id.toString());

      // ✅ 6. Possible creators: branch admin itself OR branch users
      const allCreators = [branch._id.toString(), ...branchUserIds];

      // ✅ 7. Build base filter (with date)
      const studentFilter = { created_by: { $in: allCreators }, ...dateFilter };
      const leadFilter = { created_by: { $in: allCreators }, ...dateFilter };

      // ✅ 8. Counts
      const totalStudents = await StudentApplication.countDocuments(
        studentFilter
      );
      const totalLeads = await Lead.countDocuments(leadFilter);

      const admissionApplied = await StudentApplication.countDocuments({
        ...studentFilter,
        mainStatus: statusMap["Application Submitted"],
      });

      const admissionConfirmed = await StudentApplication.countDocuments({
        ...studentFilter,
        mainStatus: statusMap["Admission Confirmed"],
      });

      const visaApproved = await StudentApplication.countDocuments({
        ...studentFilter,
        mainStatus: statusMap["Visa Approved"],
      });

      const visaRejected = await StudentApplication.countDocuments({
        ...studentFilter,
        mainStatus: statusMap["Visa Rejected"],
      });

      const ttCopyReceived = await StudentApplication.countDocuments({
        ...studentFilter,
        mainStatus: statusMap["TT Copy Received"],
      });

      // ✅ 9. Push branch result
      result.push({
        branchId: branch._id,
        branchName: branch.name,
        totalStudents,
        totalLeads,
        admissionApplied,
        admissionConfirmed,
        visaApproved,
        visaRejected,
        ttCopyReceived,
      });
    }

    // ✅ 10. Add head office (not paginated, always included)
    const headOfficeUsers = await User.find({
      $or: [{ branchId: { $exists: false } }, { branchId: null }],
    }).select("_id");

    const headOfficeUserIds = headOfficeUsers.map((u) => u._id.toString());

    const headOfficeFilter = {
      created_by: { $in: headOfficeUserIds },
      ...dateFilter,
    };

    const headOfficeStudents = await StudentApplication.countDocuments(
      headOfficeFilter
    );
    const headOfficeLeads = await Lead.countDocuments(headOfficeFilter);

    const headOfficeApplied = await StudentApplication.countDocuments({
      ...headOfficeFilter,
      mainStatus: statusMap["Application Submitted"],
    });

    const headOfficeConfirmed = await StudentApplication.countDocuments({
      ...headOfficeFilter,
      mainStatus: statusMap["Admission Confirmed"],
    });

    const headOfficeVisaApproved = await StudentApplication.countDocuments({
      ...headOfficeFilter,
      mainStatus: statusMap["Visa Approved"],
    });

    const headOfficeVisaRejected = await StudentApplication.countDocuments({
      ...headOfficeFilter,
      mainStatus: statusMap["Visa Rejected"],
    });

    const headOfficeTTReceived = await StudentApplication.countDocuments({
      ...headOfficeFilter,
      mainStatus: statusMap["TT Copy Received"],
    });

    result.push({
      branchId: "head_office",
      branchName: "Head Office",
      totalStudents: headOfficeStudents,
      totalLeads: headOfficeLeads,
      admissionApplied: headOfficeApplied,
      admissionConfirmed: headOfficeConfirmed,
      visaApproved: headOfficeVisaApproved,
      visaRejected: headOfficeVisaRejected,
      ttCopyReceived: headOfficeTTReceived,
    });

    return {
      totalBranches,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBranches / limit),
      pageSize: Number(limit),
      branches: result,
    };
  },

  leadFrom: async (
    startDate,
    endDate,
    searchText = "",
    page = 1,
    limit = 10,
    currentUser
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const matchQuery = {
      lead_form: { $exists: true, $ne: null, $nin: ["", " "] },
    };

    // ✅ Date filter
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      matchQuery.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      matchQuery.createdAt = { $lte: new Date(endDate) };
    }

    // ✅ Search filter on lead_form
    if (searchText && searchText.trim() !== "") {
      matchQuery.lead_form = { $regex: searchText, $options: "i" };
    }

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName === "Branch") {
      // Get branch members
      const branchMembers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");

      // Convert IDs to ObjectId
      const branchMembersIds = branchMembers.map(
        (m) => new mongoose.Types.ObjectId(m._id)
      );

      const allIds = [
        new mongoose.Types.ObjectId(currentUser.userId),
        ...branchMembersIds,
      ];

      matchQuery.created_by = { $in: allIds };

      console.log("✅ Final matchQuery:", JSON.stringify(matchQuery, null, 2));
    }
    const skip = (page - 1) * limit;

    const result = await Lead.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            leadForm: "$lead_form",
            status: { $toLower: "$lead_status" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.leadForm",
          totalLeads: { $sum: "$count" },
          statuses: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          leadFrom: "$_id",
          _id: 0,
          totalLeads: 1,
          statuses: 1,
        },
      },
      { $sort: { leadFrom: 1 } },
      {
        $facet: {
          metadata: [
            { $count: "totalRecords" },
            {
              $addFields: {
                currentPage: page,
                pageSize: limit,
                totalPages: {
                  $ceil: { $divide: ["$totalRecords", limit] },
                },
              },
            },
          ],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
      {
        $project: {
          totalRecords: {
            $ifNull: [{ $arrayElemAt: ["$metadata.totalRecords", 0] }, 0],
          },
          currentPage: {
            $ifNull: [{ $arrayElemAt: ["$metadata.currentPage", 0] }, page],
          },
          totalPages: {
            $ifNull: [{ $arrayElemAt: ["$metadata.totalPages", 0] }, 0],
          },
          pageSize: {
            $ifNull: [{ $arrayElemAt: ["$metadata.pageSize", 0] }, limit],
          },
          data: 1,
        },
      },
    ]);

    return {
      status: true,
      code: 200,
      message: result[0] || {
        totalRecords: 0,
        currentPage: page,
        totalPages: 0,
        pageSize: limit,
        data: [],
      },
    };
  },
  visaNumbercounselor: async (
    startDate,
    endDate,
    search = "",
    page = 1,
    limit = 10
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const matchStage = {
      "visaApplicationDetails.visaOutcomeStatus": {
        $in: ["Approved", "Rejected", "Under Process"],
      },
    };

    // Apply date filter if provided
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const pipeline = [
      { $match: matchStage },

      { $unwind: "$visaAllocationDetails" },

      {
        $group: {
          _id: "$visaAllocationDetails.user",
          approvedCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$visaApplicationDetails.visaOutcomeStatus",
                    "Approved",
                  ],
                },
                1,
                0,
              ],
            },
          },
          rejectedCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$visaApplicationDetails.visaOutcomeStatus",
                    "Rejected",
                  ],
                },
                1,
                0,
              ],
            },
          },
          processingCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$visaApplicationDetails.visaOutcomeStatus",
                    "Under Process",
                  ],
                },
                1,
                0,
              ],
            },
          },
          total: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "counselor",
        },
      },
      { $unwind: "$counselor" },

      {
        $project: {
          _id: 0,
          counselorId: "$_id",
          counselorName: "$counselor.name",
          approvedCount: 1,
          rejectedCount: 1,
          processingCount: 1,
          total: 1,
        },
      },
    ];

    // Apply search filter
    if (search) {
      pipeline.push({
        $match: {
          counselorName: { $regex: search, $options: "i" },
        },
      });
    }

    // Sort by approvedCount desc
    pipeline.push({ $sort: { approvedCount: -1 } });

    // Pagination
    const skip = (page - 1) * limit;

    pipeline.push({
      $facet: {
        metadata: [{ $count: "totalRecords" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });

    const result = await StudentApplication.aggregate(pipeline);

    return {
      status: true,
      code: 200,
      message: {
        totalRecords: result[0]?.metadata[0]?.totalRecords || 0,
        currentPage: page,
        totalPages: Math.ceil(
          (result[0]?.metadata[0]?.totalRecords || 0) / limit
        ),
        pageSize: limit,
        data: result[0]?.data || [],
      },
    };
  },
  counselorPerformance: async (
    startDate,
    endDate,
    search,
    page = 1,
    limit = 10
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    // 1️⃣ Date filter
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // 2️⃣ Visa Approved aggregation
    const visaPipeline = [
      {
        $match: {
          ...matchStage,
          "visaApplicationDetails.visaOutcomeStatus": "Approved",
        },
      },
      { $unwind: "$visaAllocationDetails" },
      {
        $group: {
          _id: "$visaAllocationDetails.user",
          visaApprovedCount: { $sum: 1 },
        },
      },
    ];

    // 3️⃣ Admission Paid aggregation
    const admissionPipeline = [
      {
        $match: {
          ...matchStage,
          interestedCourseDetails: {
            $elemMatch: { "instituteFeePayment.feeStatus": "paid" },
          },
        },
      },
      { $unwind: "$userAllocationDetails" },
      {
        $group: {
          _id: "$userAllocationDetails.user",
          admissionCount: { $sum: 1 },
        },
      },
    ];

    // 4️⃣ Coaching Students aggregation
    const coachingPipeline = [
      {
        $match: {
          ...matchStage,
          "coachingDetails.coachingRequired": true,
        },
      },
      {
        $group: {
          _id: "$created_by",
          coachingCount: { $sum: 1 },
        },
      },
    ];

    const visaResults = await StudentApplication.aggregate(visaPipeline);
    const admissionResults = await StudentApplication.aggregate(
      admissionPipeline
    );
    const coachingResults = await StudentApplication.aggregate(
      coachingPipeline
    );
    // 5️⃣ Merge results
    const statsMap = new Map();

    visaResults.forEach((item) => {
      statsMap.set(item._id.toString(), {
        counselorId: item._id,
        visaApprovedCount: item.visaApprovedCount,
        admissionCount: 0,
        coachingCount: 0,
      });
    });

    admissionResults.forEach((item) => {
      if (!statsMap.has(item._id.toString())) {
        statsMap.set(item._id.toString(), {
          counselorId: item._id,
          visaApprovedCount: 0,
          admissionCount: item.admissionCount,
          coachingCount: 0,
        });
      } else {
        statsMap.get(item._id.toString()).admissionCount = item.admissionCount;
      }
    });

    coachingResults.forEach((item) => {
      if (!statsMap.has(item._id.toString())) {
        statsMap.set(item._id.toString(), {
          counselorId: item._id,
          visaApprovedCount: 0,
          admissionCount: 0,
          coachingCount: item.coachingCount,
        });
      } else {
        statsMap.get(item._id.toString()).coachingCount = item.coachingCount;
      }
    });

    // 6️⃣ Add totals
    let finalData = Array.from(statsMap.values()).map((c) => ({
      ...c,
      total: c.visaApprovedCount + c.admissionCount + c.coachingCount,
    }));

    // 7️⃣ Populate counselor info
    finalData = await User.populate(finalData, {
      path: "counselorId",
      select: "name email",
    });

    // 8️⃣ Apply search
    if (search) {
      const regex = new RegExp(search, "i");
      finalData = finalData.filter(
        (item) =>
          regex.test(item.counselorId?.name || "") ||
          regex.test(item.counselorId?.email || "")
      );
    }

    // 9️⃣ Pagination
    const totalRecords = finalData.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const paginatedData = finalData.slice((page - 1) * limit, page * limit);

    return {
      message: {
        totalRecords,
        currentPage: Number(page),
        totalPages,
        pageSize: Number(limit),
        data: paginatedData,
      },
    };
  },
  branchWiseAdmissions: async (
    startDate,
    endDate,
    search = "",
    page = 1,
    limit = 10
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Get status IDs dynamically
    const [applicationSubmitted, confirmationReceived] = await Promise.all([
      mainStatus.findOne({ name: "Application Submitted" }).lean(),
      mainStatus.findOne({ name: "Confirmation of Enrolment Received" }).lean(),
    ]);

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: "$interestedCourseDetails" },

      // Lookup creator as User
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "creatorUser",
        },
      },

      // Lookup creator as Branch (if created_by is branch)
      {
        $lookup: {
          from: "branches",
          localField: "created_by",
          foreignField: "_id",
          as: "creatorBranch",
        },
      },

      // Determine branchId
      {
        $addFields: {
          branchId: {
            $cond: [
              { $gt: [{ $size: "$creatorUser" }, 0] },
              { $arrayElemAt: ["$creatorUser.branchId", 0] },
              { $arrayElemAt: ["$creatorBranch._id", 0] },
            ],
          },
        },
      },

      // Convert branchId to string for safe lookup
      {
        $addFields: {
          branchIdString: { $toString: "$branchId" },
        },
      },

      // Group by branch + institute
      {
        $group: {
          _id: {
            branch: "$branchIdString",
            institute: "$interestedCourseDetails.institute",
          },
          applied: {
            $sum: {
              $cond: [
                { $eq: ["$mainStatus", applicationSubmitted?._id] },
                1,
                0,
              ],
            },
          },
          confirmed: {
            $sum: {
              $cond: [
                { $eq: ["$mainStatus", confirmationReceived?._id] },
                1,
                0,
              ],
            },
          },
          feePaid: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$interestedCourseDetails.instituteFeePayment.feeStatus",
                    "paid",
                  ],
                },
                1,
                0,
              ],
            },
          },
          visaApproved: {
            $sum: {
              $cond: [{ $eq: ["$visaDetails.status", "approved"] }, 1, 0],
            },
          },
        },
      },

      // Lookup Institute details
      {
        $lookup: {
          from: "institutes",
          localField: "_id.institute",
          foreignField: "_id",
          as: "instituteDetails",
        },
      },
      {
        $unwind: {
          path: "$instituteDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup Branch details with type-safe string match
      {
        $lookup: {
          from: "branches",
          let: { branchIdStr: "$_id.branch" },
          pipeline: [
            { $addFields: { _idStr: { $toString: "$_id" } } },
            { $match: { $expr: { $eq: ["$_idStr", "$$branchIdStr"] } } },
          ],
          as: "branchDetails",
        },
      },
      { $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true } },

      // Group by branch for final structure
      {
        $group: {
          _id: "$_id.branch",
          branchId: { $first: "$_id.branch" },
          branchName: { $first: "$branchDetails.name" },
          institutes: {
            $push: {
              instituteId: "$_id.institute",
              instituteName: "$instituteDetails.instituteName",
              applied: "$applied",
              confirmed: "$confirmed",
              feePaid: "$feePaid",
              visaApproved: "$visaApproved",
            },
          },
        },
      },
    ];

    // Add search on branch name
    if (search) {
      pipeline.push({
        $match: { branchName: { $regex: search, $options: "i" } },
      });
    }

    // Count total for pagination
    const totalCountPipeline = [...pipeline, { $count: "total" }];
    const totalCountResult = await StudentApplication.aggregate(
      totalCountPipeline
    );
    const totalRecords =
      totalCountResult.length > 0 ? totalCountResult[0].total : 0;

    // Pagination
    pipeline.push({ $sort: { branchName: 1 } });
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    const results = await StudentApplication.aggregate(pipeline);

    return {
      message: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        pageSize: limit,
        data: results,
      },
    };
  },
  getBranchPerformance: async (
    startDate,
    endDate,
    search = "",
    page = 1,
    limit = 10
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // fetch the ids for Application Submitted & Confirmation of Enrolment Received
    const [submittedStatus, confirmedStatus] = await Promise.all([
      mainStatus.findOne({ name: "Application Submitted" }).select("_id"),
      mainStatus
        .findOne({ name: "Confirmation of Enrolment Received" })
        .select("_id"),
    ]);

    const submittedStatusId = submittedStatus?._id;
    const confirmedStatusId = confirmedStatus?._id;

    // branch search
    const branches = await Branch.find(
      search ? { name: { $regex: search, $options: "i" } } : {}
    ).select("_id name");

    const result = [];

    for (const branch of branches) {
      // get branch users
      const branchUsers = await User.find({ branchId: branch._id }).select(
        "_id"
      );
      const branchUserIds = branchUsers.map((u) => u._id.toString());

      const allCreators = [branch._id.toString(), ...branchUserIds];

      // date filter
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // coaching students
      const coachingStudents = await StudentApplication.countDocuments({
        created_by: { $in: allCreators },
        "coachingDetails.coachingRequired": true,
        ...dateFilter,
      });

      // admissions applied
      const admissionApplied = submittedStatusId
        ? await StudentApplication.countDocuments({
            created_by: { $in: allCreators },
            mainStatus: submittedStatusId,
            ...dateFilter,
          })
        : 0;

      // admissions confirmed
      const admissionConfirmed = confirmedStatusId
        ? await StudentApplication.countDocuments({
            created_by: { $in: allCreators },
            mainStatus: confirmedStatusId,
            ...dateFilter,
          })
        : 0;

      // visa approved
      const visaApproved = await StudentApplication.countDocuments({
        created_by: { $in: allCreators },
        "visaDetails.status": "Approved",
        ...dateFilter,
      });

      result.push({
        branchId: branch._id,
        branchName: branch.name,
        coachingStudents,
        admissionApplied,
        admissionConfirmed,
        visaApproved,
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(
      startIndex,
      startIndex + parseInt(limit)
    );

    return {
      message: {
        totalRecords: result.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.length / limit),
        pageSize: parseInt(limit),
        data: paginatedData,
      },
    };
  },
  getAdmission: async (
    startDate,
    endDate,
    search = "",
    page = 1,
    limit = 10
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 1) Fetch the status ObjectIds (keep as ObjectId!)
    const wantedStatusNames = [
      "Application Submitted",
      "Confirmation of Enrolment Received",
      "Application Rejected",
      "Documents Pending",
      "TT Copy Received",
    ];

    const statusDocs = await mainStatus
      .find({ name: { $in: wantedStatusNames } })
      .select("_id name")
      .lean();

    // Map: name -> ObjectId
    const statusIdByName = {};
    statusDocs.forEach((s) => (statusIdByName[s.name] = s._id));

    const statusIds = statusDocs.map((s) => s._id); // ObjectIds array

    // 2) Date filter (inclusive end-of-day)
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = {
        ...(dateFilter.createdAt || {}),
        $gte: new Date(startDate),
      };
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.createdAt = { ...(dateFilter.createdAt || {}), $lte: end };
    }

    // 3) Search filter (use fields that actually exist in StudentApplication)
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, // common field in your app
            { email: { $regex: search, $options: "i" } },
            { contactNo: { $regex: search, $options: "i" } }, // if you store contact no
            { phone: { $regex: search, $options: "i" } }, // if you store phone instead
          ],
        }
      : {};

    // 4) Only count the statuses we care about (ObjectIds!)
    const baseMatch = {
      ...dateFilter,
      ...searchFilter,
      ...(statusIds.length ? { mainStatus: { $in: statusIds } } : {}),
    };

    // 5) Aggregate counts
    const grouped = await StudentApplication.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$mainStatus", total: { $sum: 1 } } },
    ]);

    const getCount = (name) => {
      const id = statusIdByName[name];
      if (!id) return 0;
      const hit = grouped.find(
        (g) => g._id && g._id.toString() === id.toString()
      );
      return hit ? hit.total : 0;
    };

    const appliedCount = getCount("Application Submitted");
    const confirmedCount = getCount("Confirmation of Enrolment Received");
    const rejectedCount = getCount("Application Rejected");
    const pendingCount = getCount("Documents Pending");
    const ttCopyCount = getCount("TT Copy Received");

    // 6) Paginated list (OPTIONAL: same filters)
    const totalRecords = await StudentApplication.countDocuments(baseMatch);

    // const students = await StudentApplication.find(baseMatch)
    //   .populate("mainStatus", "name")
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(limit)
    //   .lean();

    return {
      status: true,
      message: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        pageSize: limit,
        counts: {
          admissionApplied: appliedCount,
          admissionConfirmed: confirmedCount,
          applicationRejected: rejectedCount,
          documentsPending: pendingCount,
          ttCopyReceived: ttCopyCount,
        },
        // data: students,
      },
    };
  },
  visaCollection: async (
    startDate,
    endDate,
    search = "",
    page = 1,
    limit = 10
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 1) Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = {
        ...(dateFilter.createdAt || {}),
        $gte: new Date(startDate),
      };
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.createdAt = {
        ...(dateFilter.createdAt || {}),
        $lte: end,
      };
    }

    // 2) Search filter
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { contactNo: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // 3) Final match → only Visa Approved
    const baseMatch = {
      "visaApplicationDetails.visaOutcomeStatus": "Approved",
      ...dateFilter,
      ...searchFilter,
    };

    // 4) Populate fields configuration
    const populateFields = [
      { path: "purposeDetails.inquiryFor", select: "name" },
      {
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
          { path: "course", select: "programName" },
          { path: "campus", select: "campus" },
          { path: "created_by", select: "name" },
        ],
      },
      {
        path: "userAllocationDetails",
        populate: [
          { path: "role", select: "name" },
          { path: "user", select: "name" },
          { path: "created_by", select: "name" },
        ],
      },
      {
        path: "visaAllocationDetails",
        populate: [
          { path: "role", select: "name" },
          { path: "user", select: "name" },
          { path: "created_by", select: "name" },
        ],
      },
      { path: "uploadedDocumentDetails.created_by", select: "name" },
      { path: "educationDetails.created_by", select: "name" },
      { path: "entranceExamDetails.created_by", select: "name" },
      { path: "aptitudeExamDetails.created_by", select: "name" },
      { path: "workExperience.created_by", select: "name" },
      { path: "purposeDetails.created_by", select: "name" },
      { path: "created_by", select: "name" },
      { path: "personalDetailStatus", select: "name" },
      { path: "documentDetailStatus", select: "name" },
      { path: "counsellingDetailStatus", select: "name" },
      { path: "lastUpdatedStatus", select: "name" },
      { path: "mainStatus", select: "name color" },
      { path: "branch", select: "name" },
    ];

    // 5) Count & Pagination with populate
    const totalRecords = await StudentApplication.countDocuments(baseMatch);

    const students = await StudentApplication.find(baseMatch)
      .populate(populateFields)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      message: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        pageSize: limit,
        data: students,
      },
    };
  },
  branchTotalApplication: async () => {
    const branches = await Branch.find().lean();

    const report = await Promise.all(
      branches.map(async (branch) => {
        // 1. Get all users under this branch
        const branchMembers = await User.find({ branchId: branch._id }).select(
          "_id"
        );
        const branchMemberIds = branchMembers.map((m) => m._id.toString());

        // 2. Build list of creators: members + branch itself
        const createdByIds = [...branchMemberIds, branch._id.toString()];

        // 3. Student applications (admission process required)
        const studentCount = await StudentApplication.countDocuments({
          created_by: { $in: createdByIds },
          admissionProcessRequired: true,
        });

        // 4. Coaching applications (coaching required)
        const coachingCount = await StudentApplication.countDocuments({
          created_by: { $in: createdByIds },
          "coachingDetails.coachingRequired": true,
        });

        // 5. Visitor applications (all)
        const visitorCount = await VisitorApplication.countDocuments({
          created_by: { $in: createdByIds },
        });

        return {
          branchId: branch._id,
          branch: branch.name,
          studentApplications: studentCount,
          visitorApplications: visitorCount,
          coachingApplications: coachingCount,
          totalApplications: studentCount + coachingCount + visitorCount,
        };
      })
    );

    // ✅ Head Office (users without branchId)
    const headOfficeUsers = await User.find({
      $or: [{ branchId: { $exists: false } }, { branchId: null }],
    }).select("_id");

    const headOfficeUserIds = headOfficeUsers.map((u) => u._id.toString());

    const headOfficeStudentCount = await StudentApplication.countDocuments({
      created_by: { $in: headOfficeUserIds },
      admissionProcessRequired: true,
    });

    const headOfficeCoachingCount = await StudentApplication.countDocuments({
      created_by: { $in: headOfficeUserIds },
      "coachingDetails.coachingRequired": true,
    });

    const headOfficeVisitorCount = await VisitorApplication.countDocuments({
      created_by: { $in: headOfficeUserIds },
    });

    report.push({
      branchId: "head_office",
      branch: "Head Office",
      studentApplications: headOfficeStudentCount,
      visitorApplications: headOfficeVisitorCount,
      coachingApplications: headOfficeCoachingCount,
      totalApplications:
        headOfficeStudentCount +
        headOfficeCoachingCount +
        headOfficeVisitorCount,
    });

    return {
      status: true,
      message: "Branch-wise application report",
      data: report,
    };
  },
  visitorVisaReport: async (
    page = 1,
    limit = 10,
    search = "",
    startDate = null,
    endDate = null
  ) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // 📌 Date filter (applied to VisitorApplication)
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      dateFilter.createdAt = { $lte: new Date(endDate) };
    }

    // 📌 Search filter (on branch name)
    const branchQuery = {};
    if (search) {
      branchQuery.name = { $regex: search, $options: "i" };
    }

    // 1. Get paginated branches
    const totalBranches = await Branch.countDocuments(branchQuery);
    const branches = await Branch.find(branchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const report = await Promise.all(
      branches.map(async (branch) => {
        // Get all users under this branch
        const branchMembers = await User.find({ branchId: branch._id }).select(
          "_id"
        );
        const branchMemberIds = branchMembers.map((m) => m._id.toString());

        const createdByIds = [...branchMemberIds, branch._id.toString()];

        // Pending Visa
        const pendingVisa = await VisitorApplication.countDocuments({
          created_by: { $in: createdByIds },
          ...dateFilter,
          $or: [
            { "visaApplicationDetails.visaOutcomeStatus": { $exists: false } },
            { "visaApplicationDetails.visaOutcomeStatus": { $ne: "Approved" } },
          ],
        });

        // Visa Archived
        const visaArchived = await VisitorApplication.countDocuments({
          created_by: { $in: createdByIds },
          ...dateFilter,
          "visaApplicationDetails.visaOutcomeStatus": "Approved",
        });

        return {
          branchId: branch._id,
          branch: branch.name,
          pendingVisa,
          visaArchived,
          totalApplications: pendingVisa + visaArchived,
        };
      })
    );

    // ✅ Head Office
    const headOfficeUsers = await User.find({
      $or: [{ branchId: { $exists: false } }, { branchId: null }],
    }).select("_id");

    const headOfficeUserIds = headOfficeUsers.map((u) => u._id.toString());

    const headOfficePendingVisa = await VisitorApplication.countDocuments({
      created_by: { $in: headOfficeUserIds },
      ...dateFilter,
      $or: [
        { "visaApplicationDetails.visaOutcomeStatus": { $exists: false } },
        { "visaApplicationDetails.visaOutcomeStatus": { $ne: "Approved" } },
      ],
    });

    const headOfficeVisaArchived = await VisitorApplication.countDocuments({
      created_by: { $in: headOfficeUserIds },
      ...dateFilter,
      "visaApplicationDetails.visaOutcomeStatus": "Approved",
    });

    report.push({
      branchId: "head_office",
      branch: "Head Office",
      pendingVisa: headOfficePendingVisa,
      visaArchived: headOfficeVisaArchived,
      totalApplications: headOfficePendingVisa + headOfficeVisaArchived,
    });

    return {
      status: true,
      message: "Visitor Visa Report (Branch-wise)",
      data: {
        totalRecords: totalBranches,
        currentPage: page,
        totalPages: Math.ceil(totalBranches / limit),
        pageSize: limit,
        data: report,
      },
    };
  },
  coachingReport: async (
    page = 1,
    limit = 10,
    searchText = "",
    startDate = null,
    endDate = null
  ) => {
    const matchDate = {};
    if (startDate && endDate) {
      matchDate.$gte = new Date(startDate);
      matchDate.$lte = new Date(endDate);
    }

    // Step 1: Get all branches
    const branches = await Branch.find(
      searchText ? { name: { $regex: searchText, $options: "i" } } : {}
    ).select("_id name");

    let report = [];

    // ===================== BRANCH WISE =====================
    for (const branch of branches) {
      // Get all users under this branch

      // 1️⃣ Branch members
const branchMembers = await User.find(
  { branchId: branch._id },
  { _id: 1 }
);

const branchMemberIds = branchMembers.map((m) => m._id);

// 2️⃣ Branch + members
const createdByIds = [branch._id, ...branchMemberIds];

// 3️⃣ Coaching faculty created by branch OR branch members
const coachingFaculty = await CoachingFaculty.find(
  { created_by: { $in: createdByIds } },
  { _id: 1 }
);

const coachingFacultyIds = coachingFaculty.map((f) => f._id);

// 4️⃣ FINAL match stage
const matchStage = {
  created_by: { $in: [...createdByIds, ...coachingFacultyIds] },
  "coachingDetails.coachingRequired": true,
};

      if (startDate && endDate) {
        matchStage.createdAt = matchDate;
      }

      // Aggregate counts
      const coachingApps = await StudentApplication.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            notArchived: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$coachingDetails.targetAchieved.scores", null] },
                      {
                        $eq: [
                          "$coachingDetails.targetAchieved.scores.total",
                          null,
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            archived: {
              $sum: {
                $cond: [
                  {
                    $ne: ["$coachingDetails.targetAchieved.scores.total", null],
                  },
                  1,
                  0,
                ],
              },
            },
            total: { $sum: 1 },
          },
        },
      ]);

      report.push({
        branch: branch.name,
        notArchivedScore: coachingApps[0]?.notArchived || 0,
        archivedScore: coachingApps[0]?.archived || 0,
        totalApplication: coachingApps[0]?.total || 0,
      });
    }

    // ===================== HEAD OFFICE =====================
    const headOfficeUsers = await User.find({
      branchId: { $exists: false },
    }).select("_id");
    const headOfficeUserIds = headOfficeUsers.map((u) => u._id);

    const hoMatchStage = {
      created_by: { $in: headOfficeUserIds },
      "coachingDetails.coachingRequired": true,
    };
    if (startDate && endDate) {
      hoMatchStage.createdAt = matchDate;
    }

    const hoCoachingApps = await StudentApplication.aggregate([
      { $match: hoMatchStage },
      {
        $group: {
          _id: null,
          notArchived: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$coachingDetails.targetAchieved.scores", null] },
                    {
                      $eq: [
                        "$coachingDetails.targetAchieved.scores.total",
                        null,
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          archived: {
            $sum: {
              $cond: [
                { $ne: ["$coachingDetails.targetAchieved.scores.total", null] },
                1,
                0,
              ],
            },
          },
          total: { $sum: 1 },
        },
      },
    ]);

    report.push({
      branch: "Head Office",
      notArchivedScore: hoCoachingApps[0]?.notArchived || 0,
      archivedScore: hoCoachingApps[0]?.archived || 0,
      totalApplication: hoCoachingApps[0]?.total || 0,
    });

    // ===================== PAGINATION =====================
    const startIndex = (page - 1) * limit;
    const paginatedReport = report.slice(
      startIndex,
      startIndex + parseInt(limit)
    );

    return {
      data: {
        totalRecords: report.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(report.length / limit),
        pageSize: parseInt(limit),
        records: paginatedReport,
      },
    };
  },
};

module.exports = StudentApplicationServices;
