const mongoose = require("mongoose");
const StudentApplication = require("../../model/masters/studentApplication/studentApplication");
const User = require("../../model/user");
const Branch = require("../../model/branch/branches");
const visaStatus = require("../../model/masters/visaStatus");
const AccountExpense = require("../../model/accountExpense");
const Lead = require("../../model/lead");
const B2BAdmin = require("../../model/masters/b2b/b2bAdmin");
const B2BMember = require("../../model/masters/b2b/b2bMember");

const dashboardServices = {
  // getDashboard: async (startDate, endDate , branchId) => {

  //     // branchWise

  //     let createdByFilter = {};

  //     if(branchId) {
  //         const branchMembers = await User.find({ branchId }).select("_id");
  //         const branchMemberIds = branchMembers.map((m) => m._id.toString());

  //         createdByFilter.created_by = {
  //             $in: [ ...branchMemberIds, branchId ]
  //         }
  //     }

  //     let dateFilter = {};
  //     if (startDate && endDate) {
  //         dateFilter = {
  //             createdAt: {
  //                 $gte: new Date(startDate),
  //                 $lte: new Date(endDate),
  //             },
  //         };
  //     }

  //     // current month filter when no date filter provided for top 5 counselor by admission

  //     let currentMonthFilter = {};

  //     if (!startDate || !endDate) {
  //         const now = new Date();
  //         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  //         const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  //         currentMonthFilter = {
  //             createdAt: {
  //                 $gte: startOfMonth,
  //                 $lte: endOfMonth
  //             }
  //         }

  //     }

  //     // Step 1: Fetch users who are branch users (have branchId)
  //     const branchUsers = await User.find(
  //         { branchId: { $ne: null } },
  //         { _id: 1, branchId: 1 }
  //     ).lean();

  //     const userToBranchMap = new Map();
  //     branchUsers.forEach((user) => {
  //         userToBranchMap.set(user._id.toString(), user.branchId.toString());
  //     });

  //     // Step 2: Fetch all branch admins
  //     const branchAdminIds = await Branch.find({}, { admin: 1 }).lean();
  //     const adminToBranchMap = new Map();
  //     branchAdminIds.forEach((branch) => {
  //         if (branch.admin) {
  //             adminToBranchMap.set(branch.admin.toString(), branch._id.toString());
  //         }
  //     });

  //     // Step 3: Map each student to a branchId
  //     const allStudents = await StudentApplication.find(dateFilter, { created_by: 1 }).lean();
  //     const branchCountMap = new Map();

  //     for (const student of allStudents) {
  //         const creatorId = student.created_by?.toString();
  //         let branchId = null;

  //         if (userToBranchMap.has(creatorId)) {
  //             branchId = userToBranchMap.get(creatorId);
  //         } else if (adminToBranchMap.has(creatorId)) {
  //             branchId = adminToBranchMap.get(creatorId);
  //         }

  //         if (branchId) {
  //             branchCountMap.set(branchId, (branchCountMap.get(branchId) || 0) + 1);
  //         }
  //     }

  //     // Step 4: Find branch with max students
  //     let topBranchId = null;
  //     let maxCount = 0;
  //     for (const [branchId, count] of branchCountMap.entries()) {
  //         if (count > maxCount) {
  //             topBranchId = branchId;
  //             maxCount = count;
  //         }
  //     }

  //     let topBranchName = null;
  //     if (topBranchId) {
  //         const branchDoc = await Branch.findById(topBranchId, { name: 1 });
  //         topBranchName = branchDoc?.name || null;
  //     }

  //     const counselorDateFilter = (startDate && endDate) ? dateFilter : currentMonthFilter;

  //     // Step 5: Run your existing aggregation
  //     const pipeLine = [
  //         { $match: dateFilter },
  //         {
  //             $facet: {
  //                 // totalStudents: [{ $count: "count" }],
  //                 totalAdmissions: [
  //                     {
  //                         $match: {
  //                             "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
  //                         },
  //                     },
  //                     { $count: "count" },
  //                 ],
  //                 totalOfferLetter: [
  //                     {
  //                         $match: {
  //                             "interestedCourseDetails.status": "Offer Letter Received",
  //                         },
  //                     },
  //                     { $count: "count" },
  //                 ],
  //                 totalVisaApproved: [
  //                     {
  //                         $match: {
  //                             "visaApplicationDetails.visaOutcomeStatus": "Approved",
  //                         },
  //                     },
  //                     { $count: "count" },
  //                 ],
  //                 topCounselor: [
  //                     { $unwind: "$visaAllocationDetails" },
  //                     {
  //                         $group: {
  //                             _id: "$visaAllocationDetails.user",
  //                             count: { $sum: 1 },
  //                         },
  //                     },
  //                     { $sort: { count: -1 } },
  //                     { $limit: 1 },
  //                     {
  //                         $lookup: {
  //                             from: "users",
  //                             localField: "_id",
  //                             foreignField: "_id",
  //                             as: "user",
  //                         },
  //                     },
  //                     {
  //                         $unwind: {
  //                             path: "$user",
  //                             preserveNullAndEmptyArrays: true,
  //                         },
  //                     },
  //                     {
  //                         $project: {
  //                             name: "$user.name",
  //                             count: 1,
  //                         },
  //                     },
  //                 ],
  //                 totalUniversityCollection: [
  //                     {
  //                         $addFields: {
  //                             amountNumeric: {
  //                                 $cond: [
  //                                     { $and: [{ $ne: ["$universityPaymentReceived.amount", null] }, { $ne: ["$universityPaymentReceived.amount", ""] }] },
  //                                     { $toDouble: "$universityPaymentReceived.amount" },
  //                                     0
  //                                 ]
  //                             }
  //                         }
  //                     }, {
  //                         $group: {
  //                             _id: null,
  //                             total: { $sum: "$amountNumeric" }
  //                         }
  //                     }
  //                 ],
  //                 countryVisaApproval: [{

  //                     $match: {
  //                         "visaApplicationDetails.visaOutcomeStatus": "Approved",
  //                         "purposeDetails.preferredCountry": { $ne: null, $ne: "" }
  //                     }
  //                 },
  //                 {
  //                     $group: {
  //                         _id: "$purposeDetails.preferredCountry",
  //                         totalApproved: { $sum: 1 },
  //                     }
  //                 },
  //                 {
  //                     $sort: { totalApproved: -1 },
  //                 }
  //                 ],
  //             },
  //         },
  //         {
  //             $project: {
  //                 // totalStudents: { $arrayElemAt: ["$totalStudents.count", 0] },
  //                 totalAdmissions: { $arrayElemAt: ["$totalAdmissions.count", 0] },
  //                 totalOfferLetter: { $arrayElemAt: ["$totalOfferLetter.count", 0] },
  //                 totalVisaApproved: { $arrayElemAt: ["$totalVisaApproved.count", 0] },
  //                 topCounselor: { $arrayElemAt: ["$topCounselor", 0] },
  //                 totalUniversityCollection: { $arrayElemAt: ["$totalUniversityCollection.total", 0] },
  //                 countryVisaApproval: "$countryVisaApproval",

  //             },
  //         },
  //     ];

  //     const result = await StudentApplication.aggregate(pipeLine);
  //     const final = result[0];

  //     // total students
  //     const totalStudents = await StudentApplication.countDocuments({
  //         ...dateFilter,
  //         ...createdByFilter
  //     })
  //     final.totalStudents = totalStudents;

  //     // for top 5 counselor by admission

  //     const topCounselorByAdmissionPipeline = [
  //         {
  //             $match: {
  //                 ...counselorDateFilter,
  //                 "interestedCourseDetails.instituteFeePayment.feeStatus": "paid"
  //             }
  //         },
  //         {
  //             $unwind: "$userAllocationDetails"
  //         },
  //         {
  //             $group: {
  //                 _id: "$userAllocationDetails.user",
  //                 count: { $sum: 1 }
  //             }
  //         },
  //         {
  //             $sort: { count: -1 }
  //         },
  //         {
  //             $limit: 5  // Get top 5 counselors
  //         },
  //         {
  //             $lookup: {
  //                 from: "users",
  //                 localField: "_id",
  //                 foreignField: "_id",
  //                 as: "user"
  //             }
  //         },
  //         {
  //             $unwind: {
  //                 path: "$user",
  //                 preserveNullAndEmptyArrays: true
  //             }
  //         },
  //         {
  //             $project: {
  //                 name: "$user.name",
  //                 count: 1
  //             }
  //         }
  //     ];

  //     // top lead inquiry source

  //     const leadFromPercentage = await Lead.aggregate([
  //         {
  //             $match: { ...dateFilter }
  //         },
  //         {
  //             $group: {
  //                 _id: "$lead_form",
  //                 count: { $sum: 1 }
  //             }
  //         },
  //         {
  //             $group: {
  //                 _id: null,
  //                 total: { $sum: "$count" },
  //                 data: {
  //                     $push: {
  //                         lead_form: "$_id",
  //                         count: "$count"
  //                     }
  //                 }
  //             }
  //         },
  //         {
  //             $unwind: "$data"
  //         },
  //         {
  //             $project: {
  //                 _id: 0,
  //                 lead_from: "$data.lead_form",
  //                 count: "$data.count",
  //                 percentage: {
  //                     $round: [
  //                         { $multiply: [{ $divide: ["$data.count", "$total"] }, 100] },
  //                         2
  //                     ]
  //                 }
  //             }
  //         }
  //     ])

  //     // today's follow up leads

  //     const todayStart = new Date();
  //     todayStart.setHours(0, 0, 0, 0);
  //     const todayStartUTC = new Date(todayStart.toISOString());

  //     const todayEnd = new Date();
  //     todayEnd.setHours(23, 59, 59, 999);
  //     const todayEndUTC = new Date(todayEnd.toISOString());

  //     const todaysFollowUps = await Lead.countDocuments({
  //         next_follow_up: {
  //             $gte: todayStartUTC,
  //             $lte: todayEndUTC,
  //         }
  //     });

  //     final.todaysLeadFollowup = todaysFollowUps;
  //     final.topLeadInquiryFrom = leadFromPercentage;
  //     const topCounselorByAdmission = await StudentApplication.aggregate(topCounselorByAdmissionPipeline);
  //     final.topCounselorByAdmission = topCounselorByAdmission;

  //     // Add top performing branch to result
  //     final.topBranchName = topBranchName;
  //     final.topBranchStudentCount = maxCount;

  //     // total leads
  //     const totalLeads = await Lead.countDocuments({
  //         ...dateFilter,
  //         ...createdByFilter
  //     }
  //     );
  //     final.totalLeads = totalLeads;

  //     // branch wise collection vs expense
  //     // const studentsWithAmount = await StudentApplication.find(
  //     //     {
  //     //         ...dateFilter,
  //     //         "universityPaymentReceived.amount": { $ne: null, $ne: "" }
  //     //     },
  //     //     {
  //     //         universityPaymentReceived: 1,
  //     //         created_by: 1
  //     //     }
  //     // ).lean();

  //     const studentsWithAmount = await StudentApplication.find({
  //         "universityPaymentReceived.amount": { $ne: null, $ne: "" },
  //         "universityPaymentReceived.date": { $gte: startDate, $lte: endDate }, // ✅ Filter by payment date
  //     }, {
  //         universityPaymentReceived: 1,
  //         created_by: 1,
  //     }).lean();

  //     const branchCollectionMap = new Map();

  //     for (const student of studentsWithAmount) {
  //         const amount = parseFloat(student.universityPaymentReceived?.amount || "0");

  //         if (!amount) continue;

  //         const creatorId = student.created_by?.toString();

  //         let branchId = null;

  //         if (userToBranchMap.has(creatorId)) {
  //             branchId = userToBranchMap.get(creatorId);
  //         } else if (adminToBranchMap.has(creatorId)) {
  //             branchId = adminToBranchMap.get(creatorId);
  //         } else {
  //             console.log("Creator ID not found in either map");
  //         }

  //         if (branchId) {
  //             const currentAmount = branchCollectionMap.get(branchId) || 0;
  //             branchCollectionMap.set(branchId, currentAmount + amount);
  //         }
  //     }

  //     // Get expenses per branch - assuming center field contains branch name
  //     // const expenses = await AccountExpense.find(dateFilter, { center: 1, amount: 1 }).lean();
  //     const expenses = await AccountExpense.find({
  //         date: { $gte: startDate, $lte: endDate },
  //     }, {
  //         center: 1,
  //         amount: 1,
  //     }).lean();

  //     const branchExpenseMap = new Map();

  //     for (const expense of expenses) {
  //         const centerName = expense.center;
  //         const amount = parseFloat(expense.amount || "0");
  //         if (!centerName || !amount) continue;

  //         branchExpenseMap.set(centerName, (branchExpenseMap.get(centerName) || 0) + amount);
  //     }

  //     // Create branch ID to name mapping for collections
  //     const branchIdToNameMap = new Map();
  //     for (const branchId of branchCollectionMap.keys()) {
  //         const branchDoc = await Branch.findById(branchId, { name: 1 }).lean();
  //         if (branchDoc) {
  //             branchIdToNameMap.set(branchId, branchDoc.name);
  //         }
  //     }

  //     // Create branch-wise summary using branch names as the common key
  //     const branchWiseSummary = [];
  //     const processedBranches = new Set();

  //     // Process branches that have collections (convert branchId to branchName)
  //     for (const [branchId, collection] of branchCollectionMap.entries()) {
  //         const branchName = branchIdToNameMap.get(branchId);
  //         if (branchName) {
  //             branchWiseSummary.push({
  //                 branch: branchName,
  //                 collection: collection,
  //                 expense: branchExpenseMap.get(branchName) || 0
  //             });
  //             processedBranches.add(branchName);
  //         }
  //     }

  //     // Process branches that have expenses but no collections
  //     for (const [branchName, expense] of branchExpenseMap.entries()) {
  //         if (!processedBranches.has(branchName)) {
  //             branchWiseSummary.push({
  //                 branch: branchName,
  //                 collection: 0,
  //                 expense: expense
  //             });
  //         }
  //     }

  //     final.branchWiseCollectionVsExpense = branchWiseSummary;

  //     return final;
  // },

  getDashboard: async (
    startDate,
    endDate,
    branchId,
    headOffice,
    currentUser,
  ) => {
    const {
      dateFilter,
      counselorDateFilter,
      createdByFilter,
      userToBranchMap,
      adminToBranchMap,
    } = await buildFilters(
      startDate,
      endDate,
      branchId,
      headOffice,
      currentUser,
    );

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    const userType = currentUser.userType;
    const userId = currentUser.userId;
    const final = {};
    // ----------------------------------------------------------------
    // CASE 1: Super Admin (Full Access)
    // ----------------------------------------------------------------
    if (userType === "user" && roleName === "Super Admin") {
      let studentFilter;

      if (headOffice === true) {
        studentFilter = {
          admissionProcessRequired: true,
          $or: [
            { isSubmit: true },
            { created_by: currentUser.userId },
            { clone_by: currentUser.userId },
          ],
          $nor: [
            {
              created_by_type: { $in: ["Branch", "Branch User"] },
              // branch: { $ne: null },
            },
          ],
        };
      } else if (branchId) {
        studentFilter = {
          created_by: createdByFilter.created_by,
          admissionProcessRequired: true,
        };
      } else {
        studentFilter = {
          ...createdByFilter,
          admissionProcessRequired: true,
        };
      }

      final.totalStudents = await StudentApplication.countDocuments({
        ...dateFilter,
        ...studentFilter,
      });

      final.todayFollowUpLeads = await Lead.countDocuments({
        $and: [
          dateFilter,
          { $or: [{ ...createdByFilter }] },
          { next_follow_up: { $gte: startOfDay, $lte: endOfDay } },
        ],
        
      });

      // final.totalLeads = await Lead.countDocuments({
      //   ...dateFilter,
      //   ...createdByFilter,
      // });

      let leadFilter;
      if (headOffice === true) {
        // AND logic
        leadFilter = buildLeadFilter_HeadOffice(createdByFilter);
      } else if (branchId) {
        // OR logic
        leadFilter = buildLeadFilter_Branch(createdByFilter, branchId);
      } else {
        // Default = just createdByFilter
        leadFilter = createdByFilter;
      }
      leadFilter = {
        ...leadFilter,
        fromB2B: false,
      };
      final.totalLeads = await Lead.countDocuments({
        ...dateFilter,
        ...leadFilter,
      });

      final.totalPendingLeads = await Lead.countDocuments({
        ...dateFilter,
        ...createdByFilter,
        lead_status: "New",
        fromB2B: false
      });

      const aggregated = await getAggregatedData(dateFilter, createdByFilter);
      Object.assign(final, aggregated);

      final.topCounselorByAdmission = await getTopCounselorByAdmission(
        counselorDateFilter,
        createdByFilter,
      );

      final.topLeadInquiryFrom = await getLeadFromPercentage(
        dateFilter,
        createdByFilter,
      );

      final.todaysLeadFollowup = await getTodaysFollowUps(createdByFilter);

      const topBranch = await getTopBranch(
        dateFilter,
        userToBranchMap,
        adminToBranchMap,
      );
      Object.assign(final, topBranch);

      final.branchWiseCollectionVsExpense = await getBranchWiseFinancials(
        startDate,
        endDate,
        createdByFilter,
        userToBranchMap,
        adminToBranchMap,
      );

      return final;
    }

    if (userType === "user" && roleName !== "Super Admin") {
      const userObjectId = new mongoose.Types.ObjectId(currentUser.userId);

      // -------------------------------
      // 🎯 LEAD FILTER (unchanged logic)
      // -------------------------------
      const leadFilter = {
        $or: [
          { created_by: userObjectId },
          { "lead_assign.user": userObjectId },
        ],
      };

      // -------------------------------
      // 🎯 STUDENT FILTER (FIXED)
      // -------------------------------
      let studentFilter = {
        admissionProcessRequired: true,
        $or: [
          { created_by: userObjectId },
          {
            userAllocationDetails: {
              $elemMatch: { user: userObjectId },
            },
          },
          {
            visaAllocationDetails: {
              $elemMatch: { user: userObjectId },
            },
          },
        ],
      };

      // ------------------------------------------------
      // ✅ B2B STUDENT ACCESS (SAME AS STUDENT API)
      // ------------------------------------------------
      if (currentUser.viewB2BStudentApplication) {
        const accessConditions = [];

        // 1️⃣ Assigned B2B Admins + Members
        if (
          Array.isArray(currentUser.assignedB2B) &&
          currentUser.assignedB2B.length
        ) {
          const adminIds = currentUser.assignedB2B.map(
            (id) => new mongoose.Types.ObjectId(id),
          );

          const b2bMembers = await B2BMember.find({
            b2bAdmin: { $in: adminIds },
          }).select("_id");

          const memberIds = b2bMembers.map((m) => m._id);

          accessConditions.push({
            created_by: { $in: [...adminIds, ...memberIds] },
          });
        }

        // 2️⃣ Allocation Match (USER + VISA)
        const allocationMatch = {
          $or: [
            {
              userAllocationDetails: {
                $elemMatch: { user: userObjectId },
              },
            },
            {
              visaAllocationDetails: {
                $elemMatch: { user: userObjectId },
              },
            },
          ],
        };

        studentFilter.isSubmit = true;

        // 3️⃣ WHICH B2B STUDENTS USER CAN SEE
        if (currentUser.whichB2BStudentApplication === "all") {
          accessConditions.push(
            { created_by: userObjectId },
            {
              created_by_type: {
                $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
              },
            },
            allocationMatch,
          );
        } else if (currentUser.whichB2BStudentApplication === "countrywise") {
          accessConditions.push({ created_by: userObjectId });

          const userDoc = await User.findById(userObjectId).select("country");

          if (userDoc?.country?.length) {
            accessConditions.push({
              $and: [
                {
                  created_by_type: {
                    $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
                  },
                },
                {
                  "purposeDetails.preferredCountry": {
                    $in: userDoc.country.map((c) => new RegExp(`^${c}$`, "i")),
                  },
                },
              ],
            });
          }

          accessConditions.push(allocationMatch);
        } else {
          // Default
          accessConditions.push({ created_by: userObjectId }, allocationMatch);
        }

        studentFilter.$or = accessConditions;
      }

      // ------------------------------------------------
      // 🌍 viewSpecificB2B FILTER (UNCHANGED)
      // ------------------------------------------------
      const fullUser = await User.findById(userObjectId).select(
        "viewSpecificB2B b2bCountry b2bState",
      );

      if (fullUser?.viewSpecificB2B) {
        const userStates = Array.isArray(fullUser.b2bState)
          ? fullUser.b2bState.map((s) => s.toLowerCase())
          : [];
        const userCountries = Array.isArray(fullUser.b2bCountry)
          ? fullUser.b2bCountry.map((c) => c.toLowerCase())
          : [];

        const useStateFilter = userStates.length > 0;

        const b2bAdmins = await B2BAdmin.find().select(
          "companyName state country",
        );

        const allowedCompanyNames = [];

        for (const b2b of b2bAdmins) {
          const stateMatch =
            useStateFilter &&
            b2b.state &&
            userStates.includes(b2b.state.toLowerCase());

          const countryMatch =
            !useStateFilter &&
            b2b.country &&
            userCountries.includes(b2b.country.toLowerCase());

          if (stateMatch || countryMatch) {
            allowedCompanyNames.push(b2b.companyName);
          }
        }

        if (allowedCompanyNames.length) {
          if (!studentFilter.$or) studentFilter.$or = [];

          studentFilter.$or.push(
            {
              created_by_type: "B2B Admin",
              createdByName: { $in: allowedCompanyNames },
            },
            {
              created_by_type: "B2B Member",
              b2bCompany: { $in: allowedCompanyNames },
            },
          );
        }
      }

      // ------------------------------------------------
      // 📊 COUNTS (UNCHANGED)
      // ------------------------------------------------
      final.totalStudents = await StudentApplication.countDocuments({
        ...dateFilter,
        ...studentFilter,
      });

      final.todayFollowUpLeads = await Lead.countDocuments({
        $and: [
          dateFilter,
          { $or: [{ ...createdByFilter }] },
          { next_follow_up: { $gte: startOfDay, $lte: endOfDay } },
        ],
      });

      final.totalLeads = await Lead.countDocuments({
        ...dateFilter,
        ...createdByFilter,
      });

      final.allocatedLeads = await Lead.countDocuments({
        $or: [{ ...createdByFilter }, { "lead_assign.user": userObjectId }],
      });

      final.totalPendingLeads = await Lead.countDocuments({
        ...dateFilter,
        ...createdByFilter,
        lead_status: "New",
      });

      const aggregated = await getAggregatedData(dateFilter, createdByFilter);
      Object.assign(final, aggregated);

      final.topCounselorByAdmission = await getTopCounselorByAdmission(
        counselorDateFilter,
        createdByFilter,
      );

      final.topLeadInquiryFrom = await getLeadFromPercentage(
        dateFilter,
        createdByFilter,
      );

      final.todaysLeadFollowup = await getTodaysFollowUps(createdByFilter);

      const topBranch = await getTopBranch(
        dateFilter,
        userToBranchMap,
        adminToBranchMap,
      );
      Object.assign(final, topBranch);

      final.branchWiseCollectionVsExpense = await getBranchWiseFinancials(
        startDate,
        endDate,
        createdByFilter,
        userToBranchMap,
        adminToBranchMap,
      );

      return final;
    }

    if (userType === "Branch") {
      const branchUsers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");

      const branchUserIds = branchUsers.map((u) => u._id.toString());

      // 🧩 Step 2: Build createdByFilter for branch + its users
      const branchCreatedByFilter = {
        created_by: {
          $in: [currentUser.userId, ...branchUserIds],
        },
      };

      // 🧩 Step 3: STUDENT COUNT (Branch + Branch Users)
      final.totalStudents = await StudentApplication.countDocuments({
        // ...dateFilter,
        ...branchCreatedByFilter,
        admissionProcessRequired: true,
      });

      final.todayFollowUpLeads = await Lead.countDocuments({
        $and: [
          dateFilter,
          { $or: [{ ...createdByFilter }] },
          { next_follow_up: { $gte: startOfDay, $lte: endOfDay } },
        ],
      });

      final.totalLeads = await Lead.countDocuments({
        ...dateFilter,
        ...createdByFilter,
      });

      final.totalPendingLeads = await Lead.countDocuments({
        ...dateFilter,
        ...createdByFilter,
        lead_status: "New",
      });

      const aggregated = await getAggregatedData(dateFilter, createdByFilter);
      Object.assign(final, aggregated);

      final.topCounselorByAdmission = await getTopCounselorByAdmission(
        counselorDateFilter,
        createdByFilter,
      );

      final.topLeadInquiryFrom = await getLeadFromPercentage(
        dateFilter,
        createdByFilter,
      );

      final.todaysLeadFollowup = await getTodaysFollowUps(createdByFilter);

      const topBranch = await getTopBranch(
        dateFilter,
        userToBranchMap,
        adminToBranchMap,
      );
      Object.assign(final, topBranch);

      // final.branchWiseCollectionVsExpense = await getBranchWiseFinancials(
      //   startDate,
      //   endDate,
      //   createdByFilter,
      //   userToBranchMap,
      //   adminToBranchMap
      // );

      const totalAdmissions = await StudentApplication.countDocuments({
        ...dateFilter,
        ...branchCreatedByFilter,
        "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
      });

      const totalOfferLetter = await StudentApplication.countDocuments({
        ...dateFilter,
        ...branchCreatedByFilter,
        "interestedCourseDetails.offerLetterStatus": "received",
      });

      const totalVisaApproved = await StudentApplication.countDocuments({
        ...dateFilter,
        ...branchCreatedByFilter,
        $or: [
          { "visaApplicationDetails.visaOutcomeStatus": "Approved" },
          { "visaApplicationDetails.visaDecision.status": "Approved" },
          { "visaApplicationDetails.visaOutcome.decision": "Granted" },
          { "visaApplicationDetails.decision.decision": "Approved" },
          { "visaApplicationDetails.decision.decision": "Approved" },
        ],
      });

      Object.assign(final, {
        totalAdmissions,
        totalOfferLetter,
        totalVisaApproved,
      });

      return final;
    }

    if (userType === "Branch User") {
      // 🧩 Step 1: Get all branch members
      // const branchMembers = await User.find({
      //   branchId: currentUser.userId,
      // }).select("_id");
      // const branchMemberIds = branchMembers.map((m) => m._id.toString());

      // 🧩 Step 2: Build createdByFilter for branch + its users
      const branchCreatedByFilter = {
        created_by: currentUser.userId,
      };

      // 🧩 Step 3: STUDENT COUNT (Branch + Branch Users)
      final.totalStudents = await StudentApplication.countDocuments({
        ...dateFilter,
        ...branchCreatedByFilter,
      });

      final.todayFollowUpLeads = await Lead.countDocuments({
        $and: [
          dateFilter,
          { $or: [{ ...branchCreatedByFilter }] },
          { next_follow_up: { $gte: startOfDay, $lte: endOfDay } },
        ],
      });

      // count all leads

      const branch = await Branch.findOne({ name: currentUser.branch });

      let branchMemberIds = [];

      if (branch) {
        const branchMembers = await User.find({ branchId: branch._id }).select(
          "_id",
        );
        branchMemberIds = branchMembers.map((member) => member._id.toString());
      }

      final.totalLeads = await Lead.countDocuments({
        ...dateFilter,
        $or: [
          { created_by: { $in: [branch._id.toString(), ...branchMemberIds] } },
          { lead_assign_Branch: branch._id.toString() },
        ],
      });

      final.allocatedLeads = await Lead.countDocuments({
        $or: [{ ...createdByFilter }, { "lead_assign.user": userId }],
      });

      final.totalPendingLeads = await Lead.countDocuments({
        ...dateFilter,
        ...branchCreatedByFilter,
        lead_status: "New",
      });

      const aggregated = await getAggregatedData(
        dateFilter,
        branchCreatedByFilter,
      );
      Object.assign(final, aggregated);

      final.topCounselorByAdmission = await getTopCounselorByAdmission(
        counselorDateFilter,
        branchCreatedByFilter,
      );

      final.topLeadInquiryFrom = await getLeadFromPercentage(
        dateFilter,
        branchCreatedByFilter,
      );

      final.todaysLeadFollowup = await getTodaysFollowUps(
        branchCreatedByFilter,
      );

      const topBranch = await getTopBranch(
        dateFilter,
        userToBranchMap,
        adminToBranchMap,
      );
      Object.assign(final, topBranch);

      // final.branchWiseCollectionVsExpense = await getBranchWiseFinancials(
      //   startDate,
      //   endDate,
      //   createdByFilter,
      //   userToBranchMap,
      //   adminToBranchMap
      // );

      const totalAdmissions = await StudentApplication.countDocuments({
        ...dateFilter,
        ...branchCreatedByFilter,
        "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
      });

      const totalOfferLetter = await StudentApplication.countDocuments({
        ...dateFilter,
        ...branchCreatedByFilter,
        "interestedCourseDetails.offerLetterStatus": "received",
      });

      const totalVisaApproved = await StudentApplication.countDocuments({
        ...dateFilter,
        ...branchCreatedByFilter,
        $or: [
          { "visaApplicationDetails.visaOutcomeStatus": "Approved" },
          { "visaApplicationDetails.visaDecision.status": "Approved" },
          { "visaApplicationDetails.visaOutcome.decision": "Granted" },
          { "visaApplicationDetails.decision.decision": "Approved" },
          { "visaApplicationDetails.decision.decision": "Approved" },
        ],
      });

      Object.assign(final, {
        totalAdmissions,
        totalOfferLetter,
        totalVisaApproved,
      });

      return final;
    }

    if (userType === "B2B Admin") {
      const b2bMembers = await B2BMember.find({
        b2bAdmin: currentUser.userId,
      }).select("_id");
      const memberIds = b2bMembers.map((m) => m._id.toString());

      // 🧩 Step 2: Build createdByFilter for branch + its users
      const b2bCreatedByFilter = {
        created_by: { $in: [currentUser.userId, ...memberIds] },
      };

      // 🧩 Step 3: STUDENT COUNT (Branch + Branch Users)
      final.totalStudents = await StudentApplication.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
      });

      final.todayFollowUpLeads = await Lead.countDocuments({
        $and: [
          dateFilter,
          { $or: [{ ...b2bCreatedByFilter }] },
          { next_follow_up: { $gte: startOfDay, $lte: endOfDay } },
        ],
      });

      final.totalLeads = await Lead.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
      });

      final.totalPendingLeads = await Lead.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
        lead_status: "New",
      });

      const aggregated = await getAggregatedData(
        dateFilter,
        b2bCreatedByFilter,
      );
      Object.assign(final, aggregated);

      // final.topCounselorByAdmission = await getTopCounselorByAdmission(
      //   counselorDateFilter,
      //   b2bCreatedByFilter
      // );

      // final.topLeadInquiryFrom = await getLeadFromPercentage(
      //   dateFilter,
      //   b2bCreatedByFilter
      // );

      final.todaysLeadFollowup = await getTodaysFollowUps(b2bCreatedByFilter);

      // const topBranch = await getTopBranch(
      //   dateFilter,
      //   userToBranchMap,
      //   adminToBranchMap
      // );
      // Object.assign(final, topBranch);

      // final.branchWiseCollectionVsExpense = await getBranchWiseFinancials(
      //   startDate,
      //   endDate,
      //   createdByFilter,
      //   userToBranchMap,
      //   adminToBranchMap
      // );

      const totalAdmissions = await StudentApplication.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
        "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
      });

      const totalOfferLetter = await StudentApplication.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
        "interestedCourseDetails.offerLetterStatus": "received",
      });

      const totalVisaApproved = await StudentApplication.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
        $or: [
          { "visaApplicationDetails.visaOutcomeStatus": "Approved" },
          { "visaApplicationDetails.visaDecision.status": "Approved" },
          { "visaApplicationDetails.visaOutcome.decision": "Granted" },
          { "visaApplicationDetails.decision.decision": "Approved" },
          { "visaApplicationDetails.decision.decision": "Approved" },
        ],
      });

      Object.assign(final, {
        totalAdmissions,
        totalOfferLetter,
        totalVisaApproved,
      });

      return final;
    }

    if (userType === "B2B Member") {
      // 🧩 Step 2: Build createdByFilter for branch + its users
      const b2bCreatedByFilter = {
        created_by: currentUser.userId,
      };

      // 🧩 Step 3: STUDENT COUNT (Branch + Branch Users)
      final.totalStudents = await StudentApplication.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
      });

      final.todayFollowUpLeads = await Lead.countDocuments({
        $and: [
          dateFilter,
          { $or: [{ ...b2bCreatedByFilter }] },
          { next_follow_up: { $gte: startOfDay, $lte: endOfDay } },
        ],
      });

      final.totalLeads = await Lead.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
      });

      final.totalPendingLeads = await Lead.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
        lead_status: "New",
      });

      const aggregated = await getAggregatedData(
        dateFilter,
        b2bCreatedByFilter,
      );
      Object.assign(final, aggregated);

      // final.topCounselorByAdmission = await getTopCounselorByAdmission(
      //   counselorDateFilter,
      //   b2bCreatedByFilter
      // );

      // final.topLeadInquiryFrom = await getLeadFromPercentage(
      //   dateFilter,
      //   b2bCreatedByFilter
      // );

      final.todaysLeadFollowup = await getTodaysFollowUps(b2bCreatedByFilter);

      // const topBranch = await getTopBranch(
      //   dateFilter,
      //   userToBranchMap,
      //   adminToBranchMap
      // );
      // Object.assign(final, topBranch);

      // final.branchWiseCollectionVsExpense = await getBranchWiseFinancials(
      //   startDate,
      //   endDate,
      //   createdByFilter,
      //   userToBranchMap,
      //   adminToBranchMap
      // );

      const totalAdmissions = await StudentApplication.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
        "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
      });

      const totalOfferLetter = await StudentApplication.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
        "interestedCourseDetails.offerLetterStatus": "received",
      });

      const totalVisaApproved = await StudentApplication.countDocuments({
        ...dateFilter,
        ...b2bCreatedByFilter,
        $or: [
          { "visaApplicationDetails.visaOutcomeStatus": "Approved" },
          { "visaApplicationDetails.visaDecision.status": "Approved" },
          { "visaApplicationDetails.visaOutcome.decision": "Granted" },
          { "visaApplicationDetails.decision.decision": "Approved" },
          { "visaApplicationDetails.decision.decision": "Approved" },
        ],
      });

      Object.assign(final, {
        totalAdmissions,
        totalOfferLetter,
        totalVisaApproved,
      });

      return final;
    }

    // ----------------------------------------------------------------
    // CASE 2: Branch / Head Office
    // ----------------------------------------------------------------
    // if (
    //   branchId ||
    //   headOffice ||
    //   roleName === "Branch" ||
    //   roleName === "Branch Manager" ||
    //   userType === "Branch User"
    // ) {
    //   const branchFilter = branchId ? { lead_assign_Branch: branchId } : {};

    //   final.totalStudents = await StudentApplication.countDocuments({
    //     ...dateFilter,
    //     ...createdByFilter,
    //   });

    //   final.todayFollowUpLeads = await Lead.countDocuments({
    //     $and: [
    //       dateFilter,
    //       { $or: [{ ...createdByFilter }, branchFilter] },
    //       { next_follow_up: { $gte: startOfDay, $lte: endOfDay } },
    //     ],
    //   });

    //   final.totalLeads = await Lead.countDocuments({
    //     $and: [dateFilter, { $or: [{ ...createdByFilter }, branchFilter] }],
    //   });

    //   final.totalPendingLeads = await Lead.countDocuments({
    //     $and: [
    //       dateFilter,
    //       { $or: [{ ...createdByFilter }, branchFilter] },
    //       { lead_status: "New" },
    //     ],
    //   });

    //   // Same metrics as Super Admin
    //   const aggregated = await getAggregatedData(dateFilter, createdByFilter);
    //   Object.assign(final, aggregated);

    //   final.topCounselorByAdmission = await getTopCounselorByAdmission(
    //     counselorDateFilter,
    //     createdByFilter
    //   );

    //   final.topLeadInquiryFrom = await getLeadFromPercentage(
    //     dateFilter,
    //     createdByFilter
    //   );

    //   final.todaysLeadFollowup = await getTodaysFollowUps(createdByFilter);

    //   const topBranch = await getTopBranch(
    //     dateFilter,
    //     userToBranchMap,
    //     adminToBranchMap
    //   );
    //   Object.assign(final, topBranch);

    //   final.branchWiseCollectionVsExpense = await getBranchWiseFinancials(
    //     startDate,
    //     endDate,
    //     createdByFilter,
    //     userToBranchMap,
    //     adminToBranchMap
    //   );

    //   return final;
    // }
  },
};

module.exports = dashboardServices;

// HELPER FUNCTIONS

async function buildFilters(
  startDate,
  endDate,
  branchId,
  headOffice,
  currentUser,
) {
  const roleName =
    typeof currentUser.role === "string"
      ? currentUser.role
      : currentUser.role?.name;

  let createdByFilter = {};
  let userToBranchMap = new Map();
  let adminToBranchMap = new Map();

  if (branchId) {
    const branchMembers = await User.find({ branchId }).select("_id").lean();
    const branchMemberIds = branchMembers.map((m) => m._id.toString());

    createdByFilter.created_by = { $in: [...branchMemberIds, branchId] };
  } else if (headOffice === true) {
    const noBranchUsers = await User.find({
      branchId: { $in: [null, undefined] },
    }).select("_id");

    const noBranchUserIds = noBranchUsers.map((u) => u._id.toString());
    createdByFilter.created_by = { $in: noBranchUserIds };

    createdByFilter.$and = createdByFilter.$and || [];
    createdByFilter.$and.push({
      $or: [
        { lead_assign_Branch: null },
        { lead_assign_Branch: { $exists: false } },
      ],
    });
  } else if (roleName !== "Super Admin") {
    createdByFilter.created_by = currentUser.userId;
  }

  const dateFilter = {};

  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  let counselorDateFilter = {};

  if (!startDate || !endDate) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    counselorDateFilter.createdAt = {
      $gte: startOfMonth,
      $lte: endOfMonth,
    };
  } else {
    counselorDateFilter = { ...dateFilter };
  }

  const branchUsers = await User.find(
    { branchId: { $ne: null } },
    { _id: 1, branchId: 1 },
  ).lean();
  branchUsers.forEach((user) => {
    userToBranchMap.set(user._id.toString(), user.branchId.toString());
  });

  const branches = await Branch.find({}, { admin: 1 }).lean();
  branches.forEach((b) => {
    if (b.admin) adminToBranchMap.set(b.admin.toString(), b._id.toString());
  });

  return {
    dateFilter,
    counselorDateFilter,
    createdByFilter,
    userToBranchMap,
    adminToBranchMap,
  };
}

function buildLeadFilter_HeadOffice(createdByFilter) {
  return {
    $and: [
      createdByFilter, // created_by: { $in: noBranchUsers }
      {
        $or: [
          // lead NOT assigned
          { lead_assign_Branch: null },
          { lead_assign_Branch: { $exists: false } },
        ],
      },
    ],
  };
}
function buildLeadFilter_Branch(createdByFilter, branchId) {
  return {
    $or: [createdByFilter, { lead_assign_Branch: branchId }],
  };
}

// function buildStudentFilter_HeadOffice(createdByFilter){
//   return {
//     $and: [

//     ]
//   }
// }

async function getAggregatedData(dateFilter, createdByFilter) {
  const pipeline = [
    { $match: { ...dateFilter, ...createdByFilter } },
    {
      $facet: {
        totalAdmissions: [
          {
            $match: {
              "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
            },
          },
          { $count: "count" },
        ],
        totalOfferLetter: [
          {
            $match: {
              "interestedCourseDetails.status": "Offer Letter Received",
            },
          },
          { $count: "count" },
        ],
        totalVisaApproved: [
          {
            $match: {
              $or: [
                { "visaApplicationDetails.visaOutcomeStatus": "Approved" },
                { "visaApplicationDetails.visaDecision.status": "Approved" },
                { "visaApplicationDetails.visaOutcome.decision": "Granted" },
                { "visaApplicationDetails.decision.decision": "Approved" },
                { "visaApplicationDetails.decision.decision": "Approved" },
              ],
            },
          },
          { $count: "count" },
        ],
        topCounselor: [
          { $unwind: "$visaAllocationDetails" },
          {
            $group: { _id: "$visaAllocationDetails.user", count: { $sum: 1 } },
          },
          { $sort: { count: -1 } },
          { $limit: 1 },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          { $project: { name: "$user.name", count: 1 } },
        ],
        totalUniversityCollection: [
          {
            $addFields: {
              amountNumeric: {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$universityPaymentReceived.amount", null] },
                      { $ne: ["$universityPaymentReceived.amount", ""] },
                    ],
                  },
                  { $toDouble: "$universityPaymentReceived.amount" },
                  0,
                ],
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$amountNumeric" } } },
        ],
        countryVisaApproval: [
          {
            $match: {
              "visaApplicationDetails.visaOutcomeStatus": "Approved",
              "purposeDetails.preferredCountry": { $ne: null, $ne: "" },
            },
          },
          {
            $group: {
              _id: "$purposeDetails.preferredCountry",
              totalApproved: { $sum: 1 },
            },
          },
          { $sort: { totalApproved: -1 } },
        ],
      },
    },
    {
      $project: {
        totalAdmissions: { $arrayElemAt: ["$totalAdmissions.count", 0] },
        totalOfferLetter: { $arrayElemAt: ["$totalOfferLetter.count", 0] },
        totalVisaApproved: { $arrayElemAt: ["$totalVisaApproved.count", 0] },
        topCounselor: { $arrayElemAt: ["$topCounselor", 0] },
        totalUniversityCollection: {
          $arrayElemAt: ["$totalUniversityCollection.total", 0],
        },
        countryVisaApproval: "$countryVisaApproval",
      },
    },
  ];

  const [result] = await StudentApplication.aggregate(pipeline);
  return result || {};
}

async function getTopCounselorByAdmission(
  counselorDateFilter,
  createdByFilter,
) {
  const pipeline = [
    {
      $match: {
        ...counselorDateFilter,
        ...createdByFilter,
        "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
      },
    },
    { $unwind: "$userAllocationDetails" },
    { $group: { _id: "$userAllocationDetails.user", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $project: { name: "$user.name", count: 1 } },
  ];

  return await StudentApplication.aggregate(pipeline);
}

async function getLeadFromPercentage(dateFilter, createdByFilter) {
  const pipeline = [
    { $match: { ...dateFilter, ...createdByFilter } },
    { $group: { _id: "$lead_form", count: { $sum: 1 } } },
    {
      $group: {
        _id: null,
        total: { $sum: "$count" },
        data: {
          $push: {
            lead_form: "$_id",
            count: "$count",
          },
        },
      },
    },
    { $unwind: "$data" },
    {
      $project: {
        lead_from: "$data.lead_form",
        count: "$data.count",
        percentage: {
          $round: [
            { $multiply: [{ $divide: ["$data.count", "$total"] }, 100] },
            2,
          ],
        },
      },
    },
  ];

  return await Lead.aggregate(pipeline);
}

async function getTodaysFollowUps(createdByFilter) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return await Lead.countDocuments({
    ...createdByFilter,
    next_follow_up: { $gte: todayStart, $lte: todayEnd },
  });
}

async function getTopBranch(dateFilter, userToBranchMap, adminToBranchMap) {
  const allStudents = await StudentApplication.find(dateFilter, {
    created_by: 1,
  }).lean();
  const branchCountMap = new Map();

  for (const student of allStudents) {
    const creatorId = student.created_by?.toString();
    let branchId = null;
    if (userToBranchMap.has(creatorId)) {
      branchId = userToBranchMap.get(creatorId);
    } else if (adminToBranchMap.has(creatorId)) {
      branchId = adminToBranchMap.get(creatorId);
    }
    if (branchId) {
      branchCountMap.set(branchId, (branchCountMap.get(branchId) || 0) + 1);
    }
  }

  let topBranchId = null;
  let maxCount = 0;
  for (const [branchId, count] of branchCountMap.entries()) {
    if (count > maxCount) {
      topBranchId = branchId;
      maxCount = count;
    }
  }

  let topBranchName = null;
  if (topBranchId) {
    const branch = await Branch.findById(topBranchId, { name: 1 });
    topBranchName = branch?.name || null;
  }

  return {
    topBranchName,
    topBranchStudentCount: maxCount,
  };
}

async function getBranchWiseFinancials(
  startDate,
  endDate,
  createdByFilter,
  userToBranchMap,
  adminToBranchMap,
) {
  const filter = {
    ...createdByFilter,
    "universityPaymentReceived.amount": { $nin: [null, ""] },
  };

  if (startDate && endDate) {
    filter["universityPaymentReceived.date"] = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const studentsWithAmount = await StudentApplication.find(filter, {
    universityPaymentReceived: 1,
    created_by: 1,
  }).lean();

  const branchCollectionMap = new Map();

  for (const student of studentsWithAmount) {
    const amount = parseFloat(student.universityPaymentReceived?.amount || "0");
    if (!amount || isNaN(amount)) continue;

    const creatorId = student.created_by?.toString();
    const branchId =
      userToBranchMap.get(creatorId) || adminToBranchMap.get(creatorId);

    if (branchId) {
      branchCollectionMap.set(
        branchId,
        (branchCollectionMap.get(branchId) || 0) + amount,
      );
    }
  }

  // ✅ Handle expenses (center is a string)
  const expenseFilter = {};
  if (startDate && endDate) {
    expenseFilter.date = { $gte: startDate, $lte: endDate };
  }

  const expenses = await AccountExpense.find(expenseFilter, {
    center: 1,
    amount: 1,
  }).lean();

  const branchExpenseMap = new Map();

  for (const exp of expenses) {
    const branchName = exp.center?.trim();
    const amount = parseFloat(exp.amount || "0");
    if (!branchName || !amount || isNaN(amount)) continue;

    branchExpenseMap.set(
      branchName,
      (branchExpenseMap.get(branchName) || 0) + amount,
    );
  }

  // ✅ Map branch IDs (from collection) → branch names
  const branchIdToNameMap = new Map();
  const allBranchIds = [...branchCollectionMap.keys()];
  const branches = await Branch.find(
    { _id: { $in: allBranchIds } },
    { name: 1 },
  ).lean();

  for (const b of branches) {
    branchIdToNameMap.set(b._id.toString(), b.name);
  }

  // ✅ Combine by branch name
  const result = [];
  const processed = new Set();

  for (const [branchId, collection] of branchCollectionMap.entries()) {
    const branchName = branchIdToNameMap.get(branchId) || "Unknown Branch";
    const expense = branchExpenseMap.get(branchName) || 0;

    result.push({ branch: branchName, collection, expense });
    processed.add(branchName);
  }

  // ✅ Add expense-only branches
  for (const [branchName, expense] of branchExpenseMap.entries()) {
    if (!processed.has(branchName)) {
      result.push({ branch: branchName, collection: 0, expense });
    }
  }

  return result;
}
