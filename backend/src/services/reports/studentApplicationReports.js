const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");

const {
  buildAccessFilterForUser,
} = require("../masters/studentApplication/studentApplication");
const StudentApplication = require("../../../model/masters/studentApplication/studentApplication");
const User = require("../../../model/user");
const B2BMember = require("../../../model/masters/b2b/b2bMember");

const paginate = require("../../../utils/pagination");

const studentApplicationReportsServices = {
  getUniqueInterestedInstitutes: async () => {
    const result = await StudentApplication.aggregate([
      { $unwind: "$interestedCourseDetails" },
      { $match: { "interestedCourseDetails.institute": { $ne: null } } },
      {
        $group: {
          _id: "$interestedCourseDetails.institute",
        },
      },
      {
        $lookup: {
          from: "institutes",
          localField: "_id",
          foreignField: "_id",
          as: "institute",
        },
      },
      { $unwind: "$institute" },
      {
        $project: {
          _id: 0,
          instituteId: "$institute._id",
          instituteName: "$institute.instituteName",
          // country: "$institute.country",
          // campus: "$institute.campus"
        },
      },
    ]);

    return result;
  },
  getUniqueIntakeMonthsAndYears: async () => {
    const result = await StudentApplication.aggregate([
      { $unwind: "$interestedCourseDetails" },
      {
        $match: {
          "interestedCourseDetails.intakeMonth": { $ne: null },
          "interestedCourseDetails.intakeYear": { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          months: { $addToSet: "$interestedCourseDetails.intakeMonth" },
          years: { $addToSet: "$interestedCourseDetails.intakeYear" },
        },
      },
      {
        $project: {
          _id: 0,
          intakeMonths: "$months",
          intakeYears: "$years",
        },
      },
    ]);

    return result[0] || { intakeMonths: [], intakeYears: [] };
  },

  getStudentApplicationReports: async (
    page,
    limit,
    searchText = "",
    currentUser,
    mainStatus = "",
    branchId,
    showAll = false,
    institute,
    intakeMonth,
    intakeYear,
    applicationType,
    startDate,
    endDate,
    country,
    type,
    b2bId,
    filterUserId
  ) => {
    const populateFields = [
      { path: "purposeDetails.inquiryFor", select: "name" },
      {
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
          { path: "campus", select: "campus" },
          { path: "course", select: "programName" },
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

    const searchOptions = {
      searchText,
      searchFields: [
        "name",
        "contact",
        "email",
        "purposeDetails.preferredCountry",
        "studentId",
      ],
    };

    const filter = {
      admissionProcessRequired: true,
    };

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    let effectiveUser = currentUser;

    if (
      (roleName === "Super Admin" || currentUser.viewB2BStudentApplication) &&
      filterUserId &&
      mongoose.Types.ObjectId.isValid(filterUserId)
    ) {
      const userToMimic = await User.findById(filterUserId).populate("role");
      if (userToMimic) {
        effectiveUser = userToMimic;
      }
    }

    const currentId = currentUser.userId || currentUser._id;
    const effectiveId = effectiveUser?._id || effectiveUser?.userId;

    const canMimic =
      (roleName === "Super Admin" || currentUser.viewB2BStudentApplication) &&
      filterUserId &&
      effectiveId &&
      currentId &&
      effectiveId.toString() !== currentId.toString();

    if (canMimic) {
      const mimicFilter = await buildAccessFilterForUser(
        effectiveUser,
        mainStatus
      );
      Object.assign(filter, mimicFilter);
    }

    const isAssignedB2B = currentUser.assignedB2B;

    if (!canMimic) {
      if (roleName === "Super Admin" || roleName === "Branch Manager") {
        if (
          !(
            roleName === "Super Admin" &&
            effectiveId.toString() !== currentId.toString() &&
            String(showAll) !== "true"
          )
        ) {
          if (String(showAll) === "true") {
            if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
              filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
            }
            if (b2bId && mongoose.Types.ObjectId.isValid(b2bId)) {
              const b2bMembers = await B2BMember.find({
                b2bAdmin: b2bId,
              }).select("_id");
              const memberIds = b2bMembers.map((m) => m._id);
              filter.created_by = {
                $in: [new mongoose.Types.ObjectId(b2bId), ...memberIds],
              };
            }
          } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
            const branchUsers = await User.find({ branchId }).select("_id");
            const branchUserIds = branchUsers.map((u) => u._id.toString());

            filter.created_by = { $in: [branchId, ...branchUserIds] };
          } else {
            const accessConditions = [
              { isSubmit: true },
              { created_by: currentUser.userId },
              { clone_by: currentUser.userId },
            ];

            if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
              const mainStatusId = new mongoose.Types.ObjectId(mainStatus);
              filter.$or = accessConditions.map((cond) => ({
                $and: [cond, { mainStatus: mainStatusId }],
              }));
            } else {
              filter.$or = accessConditions;
            }

            filter.$nor = [
              {
                created_by_type: { $in: ["Branch", "Branch User"] },
                // branch: { $ne: null },
              },
            ];
          }
        }
      } else {
        if (roleName === "B2B Admin") {
          const b2bMembers = await B2BMember.find({
            b2bAdmin: currentUser.userId,
          }).select("_id");
          const memberIds = b2bMembers.map((m) => m._id.toString());
          filter.created_by = { $in: [currentUser.userId, ...memberIds] };

          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
          }
        } else if (roleName === "B2B Member") {
          filter.created_by = currentUser.userId;

          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
          }
        } else if (roleName === "Branch") {
          const branchMembers = await User.find({
            branchId: currentUser.userId,
          }).select("_id");
          const branchMemberIds = branchMembers.map((m) => m._id.toString());
          filter.created_by = { $in: [currentUser.userId, ...branchMemberIds] };

          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
          }
        } else if (roleName === "Branch User") {
          filter.created_by = currentUser.userId;

          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
          }
        } else if (currentUser.viewB2BStudentApplication) {
          const accessConditions = [];

          // ✅ Add Assigned B2B Access FIRST (Global Rule)
          if (currentUser.assignedB2B && currentUser.assignedB2B.length > 0) {
            const adminIds = currentUser.assignedB2B.map(
              (id) => new mongoose.Types.ObjectId(id)
            );

            const b2bMembers = await B2BMember.find({
              b2bAdmin: { $in: adminIds },
            }).select("_id");

            const memberIds = b2bMembers.map((m) => m._id.toString());

            accessConditions.push({
              created_by: { $in: [...adminIds, ...memberIds] },
            });
          }

          // Common for all 3 types
          // const allocationMatch = {
          //   userAllocationDetails: {
          //     $elemMatch: { user: currentUser.userId },
          //   },
          // };

          const allocationMatch = {
            $or: [
              {
                userAllocationDetails: {
                  $elemMatch: { user: currentUser.userId },
                },
              },
              {
                visaAllocationDetails: {
                  $elemMatch: { user: currentUser.userId },
                },
              },
            ],
          };

          filter.isSubmit = true;

          // ✅ Type: ALL
          if (currentUser.whichB2BStudentApplication === "all") {
            accessConditions.push(
              { created_by: currentUser.userId },
              {
                created_by_type: {
                  $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
                },
              },
              allocationMatch
            );
          }

          // ✅ Type: COUNTRYWISE
          else if (currentUser.whichB2BStudentApplication === "countrywise") {
            accessConditions.push({ created_by: currentUser.userId });

            const userDoc = await User.findById(currentUser.userId).select(
              "country"
            );
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
                      $in: userDoc.country.map(
                        (c) => new RegExp(`^${c}$`, "i")
                      ),
                    },
                  },
                ],
              });
            }

            accessConditions.push(allocationMatch);
          }

          // ✅ Type: DEFAULT
          else {
            accessConditions.push(
              { created_by: currentUser.userId },
              allocationMatch
            );
          }

          // ✅ Main Status support
          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            const mainStatusId = new mongoose.Types.ObjectId(mainStatus);

            filter.$or = accessConditions.map((cond) => ({
              $and: [cond, { mainStatus: mainStatusId }],
            }));
          } else {
            filter.$or = accessConditions;
          }
        } else {
          filter.$or = [
            { created_by: currentUser.userId },
            {
              userAllocationDetails: {
                $elemMatch: { user: currentUser.userId },
              },
            },
            {
              visaAllocationDetails: {
                $elemMatch: { user: currentUser.userId },
              },
            },
          ];
        }
      }
    }

    const fullUser = await User.findById(currentUser.userId).select(
      "viewSpecificB2B b2bCountry b2bState"
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
        "companyName state country"
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
        const b2bAccessConditions = [
          {
            created_by_type: "B2B Admin",
            createdByName: { $in: allowedCompanyNames },
          },
          {
            created_by_type: "B2B Member",
            b2bCompany: { $in: allowedCompanyNames },
          },
        ];

        // Combine with existing $or if present
        if (!filter.$or) filter.$or = [];
        filter.$or.push(...b2bAccessConditions);
      }
    }

    if (institute && mongoose.Types.ObjectId.isValid(institute)) {
      filter["interestedCourseDetails.institute"] = new mongoose.Types.ObjectId(
        institute
      );
    }

    if (intakeMonth) {
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

      const normalizedKey = intakeMonth.toLowerCase().slice(0, 3);
      const monthVariants = monthAliasMap[normalizedKey] || [intakeMonth];
      filter["interestedCourseDetails.intakeMonth"] = { $in: monthVariants };
    }

    if (intakeYear) {
      filter["interestedCourseDetails.intakeYear"] = intakeYear;
    }

    if (applicationType) {
      filter["interestedCourseDetails.typeOfApplication"] = "Tailormade";
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // To include the full end date till 23:59:59
        filter.createdAt.$lte = new Date(
          new Date(endDate).setHours(23, 59, 59, 999)
        );
      }
    }

    if (country) {
      filter["purposeDetails.preferredCountry.0"] = new RegExp(
        `^${country}$`,
        "i"
      );
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

    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      const branchMembers = await User.find({
        branchId: branchId,
      }).select("_id");
      const branchMemberIds = branchMembers.map((m) => m._id.toString());
      filter.created_by = { $in: [branchId, ...branchMemberIds] };
    }

    // Get all data without pagination first (we'll handle pagination after flattening)
    const getAllData = await StudentApplication.find(filter)
      .populate(populateFields)
      .sort({ createdAt: -1 });

    if (!getAllData || !getAllData.length) {
      throw { status: false, message: "No Students found" };
    }

    // Flatten the data first - create separate record for each interested course
    const flattenedData = [];

    getAllData.forEach((student) => {
      const studentObj = student.toObject();

      if (
        studentObj.interestedCourseDetails &&
        studentObj.interestedCourseDetails.length > 0
      ) {
        // Create separate record for each interested course
        studentObj.interestedCourseDetails.forEach((course) => {
          const flattenedStudent = {
            ...studentObj,
            interestedCourseDetails: [course], // Single course instead of array
          };
          flattenedData.push(flattenedStudent);
        });
      } else {
        // If no interested courses, include the student with empty array
        flattenedData.push({
          ...studentObj,
          interestedCourseDetails: [],
        });
      }
    });

    // Apply search filter to flattened data if provided
    let filteredFlattenedData = flattenedData;
    if (searchText && searchText.trim()) {
      const searchRegex = new RegExp(searchText, "i");
      filteredFlattenedData = flattenedData.filter((student) => {
        return searchOptions.searchFields.some((field) => {
          if (field.includes(".")) {
            const fieldParts = field.split(".");
            let value = student;
            for (const part of fieldParts) {
              value = value?.[part];
            }
            return value && searchRegex.test(String(value));
          } else {
            return student[field] && searchRegex.test(String(student[field]));
          }
        });
      });
    }

    const totalUniqueRecords = getAllData.length;
    const totalRecords = filteredFlattenedData.length;
    const totalPages = Math.ceil(totalRecords / parseInt(limit));
    const currentPage = parseInt(page);
    const pageSize = parseInt(limit);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredFlattenedData.slice(
      startIndex,
      startIndex + pageSize
    );

    const getAll = {
      totalUniqueRecords,
      totalRecords,
      currentPage,
      totalPages,
      pageSize,
      data: paginatedData,
    };

    return getAll;
  },
  tailormadeAgreementPendingReports: async (
    page = 1,
    limit = 10,
    searchText = "",
    status = "",
    currentUser
  ) => {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(searchText, "i");

    const baseMatch = {
      "purposeDetails.preferredCountry": "Finland",
      "interestedCourseDetails.typeOfApplication": "Tailormade",
      uploadedDocumentDetails: {
        $not: {
          $elemMatch: {
            documentName: "Compulsory Agreement Document",
          },
        },
      },
      ...(status && mongoose.Types.ObjectId.isValid(status)
        ? { mainStatus: new mongoose.Types.ObjectId(status) }
        : {}),
    };

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName === "Branch") {
      const branchMembers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");
      const branchMembersIds = branchMembers.map((m) => m._id.toString());
      query.created_by = { $in: [currentUser.userId, ...branchMembersIds] };
    }

    const projectStage = {
      $project: {
        studentId: 1,
        name: 1,
        created_by_type: 1,
        email: 1,
        contact: 1,
        preferredCountry: "$purposeDetails.preferredCountry",
        instituteName: "$instituteData.instituteName",
        courseName: "$courseData.programName",
        status: "$statusData.name",
        color: "$statusData.color",
        mainStatus: "$statusData._id",
        intakeYear: "$interestedCourseDetails.intakeYear",
      },
    };

    const searchMatchStage = searchText
      ? {
          $match: {
            $or: [
              { name: { $regex: searchRegex } },
              { email: { $regex: searchRegex } },
              { contact: { $regex: searchRegex } },
              { studentId: { $regex: searchRegex } },
              { courseName: { $regex: searchRegex } },
              { instituteName: { $regex: searchRegex } },
              { status: { $regex: searchRegex } },
            ],
          },
        }
      : null;

    const aggregationStages = [
      { $match: baseMatch },
      { $unwind: "$interestedCourseDetails" },
      {
        $match: {
          "interestedCourseDetails.typeOfApplication": "Tailormade",
        },
      },
      {
        $lookup: {
          from: "institutes",
          localField: "interestedCourseDetails.institute",
          foreignField: "_id",
          as: "instituteData",
        },
      },
      { $unwind: { path: "$instituteData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "courses",
          localField: "interestedCourseDetails.course",
          foreignField: "_id",
          as: "courseData",
        },
      },
      { $unwind: { path: "$courseData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "studentstatuses",
          localField: "mainStatus",
          foreignField: "_id",
          as: "statusData",
        },
      },
      { $unwind: { path: "$statusData", preserveNullAndEmptyArrays: true } },
      projectStage,
      ...(searchMatchStage ? [searchMatchStage] : []),
    ];

    const dataPipeline = [
      ...aggregationStages,
      { $skip: skip },
      { $limit: limit },
    ];
    const countPipeline = [...aggregationStages, { $count: "total" }];

    const [students, totalResult] = await Promise.all([
      StudentApplication.aggregate(dataPipeline),
      StudentApplication.aggregate(countPipeline),
    ]);

    const totalRecords = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      totalRecords,
      currentPage: String(page),
      totalPages,
      pageSize: String(limit),
      data: students,
    };
  },

  getMostPreferredCourses: async (
    page = 1,
    limit = 10,
    searchText = "",
    institute = "",
    country = "",
    course = "",
    currentUser
  ) => {
    page = parseInt(page);
    limit = parseInt(limit);
    const searchRegex = new RegExp(searchText, "i");
    const courseRegex = new RegExp(course, "i");
    const instituteRegex = new RegExp(institute, "i");
    const countryRegex = new RegExp(country, "i");

    let branchMatch = {};

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName === "Branch") {
      const branchMembers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");

      const branchMemberIds = branchMembers.map(
        (m) => new mongoose.Types.ObjectId(m._id)
      );

      const allIds = [
        new mongoose.Types.ObjectId(currentUser.userId),
        ...branchMemberIds,
      ];

      branchMatch.created_by = { $in: allIds };
    }

    const pipeline = [
      {
        $match: {
          ...branchMatch,
        },
      },
      {
        $unwind: "$interestedCourseDetails",
      },
      {
        $group: {
          _id: "$interestedCourseDetails.course",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      // NEW: lookup for university name
      {
        $lookup: {
          from: "institutes", // assuming university is stored in institutes collection
          localField: "course.university",
          foreignField: "_id",
          as: "course.universityDetails",
        },
      },
      {
        $unwind: {
          path: "$course.universityDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "course.universityName": "$course.universityDetails.instituteName",
        },
      },
      {
        $project: {
          "course.universityDetails": 0,
        },
      },

      // ✅ NEW: Search filter stage (optional if no searchText)
      {
        $match: {
          ...(searchText && {
            $or: [
              { "course.programName": { $regex: searchRegex } },
              { "course.universityName": { $regex: searchRegex } },
            ],
          }),
          ...(course && { "course.programName": { $regex: courseRegex } }),
          ...(institute && {
            "course.universityName": { $regex: instituteRegex },
          }),
          ...(country && { "course.country": { $regex: countryRegex } }),
        },
      },

      { $sort: { count: -1 } },
      {
        $facet: {
          paginatedResults: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await StudentApplication.aggregate(pipeline);
    const courses = result[0]?.paginatedResults || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    return {
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      data: courses,
    };
  },
  exportDataToExcel: async (ids) => {
    const dataList = await StudentApplication.find({ _id: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate([
        { path: "mainStatus", select: "name" },
        {
          path: "interestedCourseDetails",
          populate: [
            { path: "institute", select: "instituteName" },
            { path: "course", select: "programName" },
            { path: "created_by", select: "name" },
          ],
        },
      ]);

    if (!dataList.length) {
      throw { success: false, message: "No Students found." };
    }

    const downloadDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const filePath = path.join(downloadDir, "studentReports.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "studentId", title: "Student ID" },
        { id: "studentName", title: "Student Name" },
        { id: "type", title: "Type" },
        { id: "prefferedCountry", title: "Preffered Country" },
        { id: "instituteName", title: "Institute Name" },
        { id: "courseName", title: "Course Name" },
        { id: "status", title: "Status" },
        { id: "intakeYear", title: "Intake Year" },
        { id: "emailId", title: "Email Id" },
        { id: "phoneNo", title: "Phone Number" },
      ],
    });

    const records = [];

    for (const student of dataList) {
      const studentObj = student.toObject();
      const interestedCourses = studentObj.interestedCourseDetails || [];

      if (interestedCourses.length === 0) {
        records.push({
          studentId: studentObj.studentId || "",
          studentName: studentObj.name || "",
          type:
            studentObj.created_by_type === "B2B Admin" ||
            studentObj.created_by_type === "B2B Member"
              ? "B2B"
              : studentObj.created_by_type === "Branch" ||
                studentObj.created_by_type === "Branch User"
              ? "Branch"
              : "Head Office",
          prefferedCountry: studentObj.purposeDetails?.preferredCountry || "",
          instituteName: "",
          courseName: "",
          status: studentObj.mainStatus?.name || "",
          intakeYear: "",
          emailId: studentObj.email || "",
          phoneNo: studentObj.contact || "",
        });
      } else {
        for (const course of interestedCourses) {
          records.push({
            studentId: studentObj.studentId || "",
            studentName: studentObj.name || "",
            type:
              studentObj.created_by_type === "B2B Admin" ||
              studentObj.created_by_type === "B2B Member"
                ? "B2B"
                : studentObj.created_by_type === "Branch" ||
                  studentObj.created_by_type === "Branch User"
                ? "Branch"
                : "Head Office",
            prefferedCountry: studentObj.purposeDetails?.preferredCountry || "",
            instituteName: course.institute?.instituteName || "",
            courseName: course.course?.programName || "",
            status: studentObj.mainStatus?.name || "",
            intakeYear: course.intakeYear || "",
            emailId: studentObj.email || "",
            phoneNo: studentObj.contact || "",
          });
        }
      }
    }
    await csvWriter.writeRecords(records);

    return { success: true, filePath };
  },
  exportMostPreferredCourses: async (
    searchText = "",
    institute = "",
    country = "",
    course = ""
  ) => {
    const searchRegex = new RegExp(searchText, "i");
    const courseRegex = new RegExp(course, "i");
    const instituteRegex = new RegExp(institute, "i");
    const countryRegex = new RegExp(country, "i");

    const pipeline = [
      { $unwind: "$interestedCourseDetails" },
      {
        $group: {
          _id: "$interestedCourseDetails.course",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $lookup: {
          from: "institutes",
          localField: "course.university",
          foreignField: "_id",
          as: "course.universityDetails",
        },
      },
      {
        $unwind: {
          path: "$course.universityDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "course.universityName": "$course.universityDetails.instituteName",
        },
      },
      {
        $project: {
          "course.universityDetails": 0,
        },
      },
      {
        $match: {
          ...(searchText && {
            $or: [
              { "course.programName": { $regex: searchRegex } },
              { "course.universityName": { $regex: searchRegex } },
            ],
          }),
          ...(course && { "course.programName": { $regex: courseRegex } }),
          ...(institute && {
            "course.universityName": { $regex: instituteRegex },
          }),
          ...(country && { "course.country": { $regex: countryRegex } }),
        },
      },
      { $sort: { count: -1 } },
    ];

    const result = await StudentApplication.aggregate(pipeline);

    if (!result.length) {
      throw { success: false, message: "No course data found for export." };
    }

    const downloadDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const filePath = path.join(downloadDir, "mostPreferredCourses.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "courseName", title: "Course Name" },
        { id: "university", title: "University Name" },
        { id: "country", title: "Country" },
        { id: "count", title: "No. of Students" },
      ],
    });

    const records = result.map((item) => ({
      courseName: item.course.programName || "",
      university: item.course.universityName || "",
      country: item.course.country || "",
      count: item.count || 0,
    }));

    await csvWriter.writeRecords(records);

    return { success: true, filePath };
  },

  exportTailormadeAgreementPendingReports: async (
    searchText = "",
    status = ""
  ) => {
    const searchRegex = new RegExp(searchText, "i");

    const baseMatch = {
      "purposeDetails.preferredCountry": "Finland",
      "interestedCourseDetails.typeOfApplication": "Tailormade",
      uploadedDocumentDetails: {
        $not: {
          $elemMatch: {
            documentName: "Compulsory Agreement Document",
          },
        },
      },
      ...(status && mongoose.Types.ObjectId.isValid(status)
        ? { mainStatus: new mongoose.Types.ObjectId(status) }
        : {}),
    };

    const projectStage = {
      $project: {
        studentId: 1,
        name: 1,
        created_by_type: 1,
        email: 1,
        contact: 1,
        preferredCountry: "$purposeDetails.preferredCountry",
        instituteName: "$instituteData.instituteName",
        courseName: "$courseData.programName",
        status: "$statusData.name",
        intakeYear: "$interestedCourseDetails.intakeYear",
      },
    };

    const searchMatchStage = searchText
      ? {
          $match: {
            $or: [
              { name: { $regex: searchRegex } },
              { email: { $regex: searchRegex } },
              { contact: { $regex: searchRegex } },
              { studentId: { $regex: searchRegex } },
              { courseName: { $regex: searchRegex } },
              { instituteName: { $regex: searchRegex } },
              { status: { $regex: searchRegex } },
            ],
          },
        }
      : null;

    const aggregationPipeline = [
      { $match: baseMatch },
      { $unwind: "$interestedCourseDetails" },
      {
        $match: {
          "interestedCourseDetails.typeOfApplication": "Tailormade",
        },
      },
      {
        $lookup: {
          from: "institutes",
          localField: "interestedCourseDetails.institute",
          foreignField: "_id",
          as: "instituteData",
        },
      },
      { $unwind: { path: "$instituteData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "courses",
          localField: "interestedCourseDetails.course",
          foreignField: "_id",
          as: "courseData",
        },
      },
      { $unwind: { path: "$courseData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "studentstatuses",
          localField: "mainStatus",
          foreignField: "_id",
          as: "statusData",
        },
      },
      { $unwind: { path: "$statusData", preserveNullAndEmptyArrays: true } },
      projectStage,
      ...(searchMatchStage ? [searchMatchStage] : []),
    ];

    const students = await StudentApplication.aggregate(aggregationPipeline);

    if (!students.length) {
      throw { success: false, message: "No matching students found." };
    }

    const downloadDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const filePath = path.join(downloadDir, "tailormadeAgreementReport.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "studentId", title: "Student ID" },
        { id: "studentName", title: "Student Name" },
        { id: "type", title: "Type" },
        { id: "prefferedCountry", title: "Preffered Country" },
        { id: "instituteName", title: "Institute Name" },
        { id: "courseName", title: "Course Name" },
        { id: "status", title: "Status" },
        { id: "intakeYear", title: "Intake Year" },
        { id: "emailId", title: "Email Id" },
        { id: "phoneNo", title: "Phone Number" },
      ],
    });

    const records = students.map((student) => ({
      studentId: student.studentId || "",
      studentName: student.name || "",
      type:
        student.created_by_type === "B2B Admin" ||
        student.created_by_type === "B2B Member"
          ? "B2B"
          : student.created_by_type === "Branch" ||
            student.created_by_type === "Branch User"
          ? "Branch"
          : "Head Office",
      prefferedCountry: student.preferredCountry || "",
      instituteName: student.instituteName || "",
      courseName: student.courseName || "",
      status: student.status || "",
      intakeYear: student.intakeYear || "",
      emailId: student.email || "",
      phoneNo: student.contact || "",
    }));

    await csvWriter.writeRecords(records);

    return { success: true, filePath };
  },

  getFiltersForMostPrefferedCourse: async () => {
    const pipeline = [
      {
        $unwind: "$interestedCourseDetails",
      },
      {
        $group: {
          _id: "$interestedCourseDetails.course",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "institutes",
          localField: "course.university",
          foreignField: "_id",
          as: "institute",
        },
      },
      {
        $unwind: "$institute",
      },
      {
        $project: {
          courseName: "$course.programName",
          instituteName: "$institute.instituteName",
          country: "$course.country",
        },
      },
    ];

    const result = await StudentApplication.aggregate(pipeline);

    const instituteSet = new Set();
    const courseSet = new Set();
    const countrySet = new Set();

    result.forEach((item) => {
      if (item.instituteName) instituteSet.add(item.instituteName);
      if (item.courseName) courseSet.add(item.courseName);
      if (item.country) countrySet.add(item.country);
    });

    return {
      institute: [...instituteSet],
      courseName: [...courseSet],
      country: [...countrySet],
    };
  },
  getUniquePreferredCountries: async () => {
    const results = await StudentApplication.aggregate([
      {
        $match: {
          "purposeDetails.preferredCountry": { $exists: true, $ne: [] },
        },
      },
      {
        $project: {
          preferredCountry: "$purposeDetails.preferredCountry",
        },
      },
      {
        $unwind: "$preferredCountry",
      },
      {
        $group: {
          _id: "$preferredCountry",
        },
      },
      {
        $sort: { _id: 1 }, // Optional: sort alphabetically
      },
    ]);

    const countries = results.map((item) => item._id);
    return countries;
  },
};

module.exports = studentApplicationReportsServices;
