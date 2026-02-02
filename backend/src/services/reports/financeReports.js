const StudentApplication = require("../../../model/masters/studentApplication/studentApplication");
const User = require("../../../model/user");

const paginate = require("../../../utils/pagination");
const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

const financeReportServices = {
  feePaymentReports: async (
    page,
    limit,
    searchText,
    feeStatus,
    startDate,
    endDate,
    currentUser
  ) => {
    let query = {};

    if (feeStatus === "proofUploaded") {
      query = {
        "uploadedDocumentDetails.customDocumentName": "Fee Payment Proof",
      };
    } else {
      query = {
        "interestedCourseDetails.instituteFeePayment.feeStatus": feeStatus,
      };
    }

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

    // Date range filter
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include full day
        dateFilter.$lte = end;
      }
      query["visaApplicationDetails.visaOutcomeDate"] = dateFilter;
    }

    const roleName = typeof currentUser.role === "string" ? currentUser.role : currentUser.role?.name;

    if(roleName === "Branch") {
      const branchMembers = await User.find({ branchId: currentUser.userId }).select("_id");
      const branchMembersIds = branchMembers.map((m) => m._id.toString());
      query.created_by =  { $in: [ currentUser.userId, ...branchMembersIds ] };
    } else if (roleName === "Branch Member"){
      query.created_by = currentUser.userId;
    }

    const applications = await paginate(
      StudentApplication,
      query,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    return applications;
  },
  studentFinanceSummary: async (
    page,
    limit,
    searchText = "",
    type,
    startDate,
    endDate
  ) => {
    const query = {
      interestedCourseDetails: {
        $elemMatch: {
          "instituteFeePayment.feeStatus": "paid",
        },
      },
    };

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include full day
        dateFilter.$lte = end;
      }
      query["visaApplicationDetails.visaOutcomeDate"] = dateFilter;
    }

    if (type === "b2b") {
      query.created_by_type = { $in: ["B2B Admin", "B2B Member"] };
    } else if (type === "branch") {
      query.created_by_type = { $in: ["Branch", "Branch User"] };
    }

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

    const applications = await paginate(
      StudentApplication,
      query,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );
    // Only include paid courses
    if (applications?.data?.length) {
      applications.data.forEach((student) => {
        student.interestedCourseDetails =
          student.interestedCourseDetails?.filter(
            (detail) =>
              detail?.instituteFeePayment?.feeStatus?.toLowerCase() === "paid"
          );
      });
    }
    return applications;
  },
  universityPaymentCollection: async (
    page = 1,
    limit = 10,
    searchText = ""
  ) => {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const basePipeline = [
      {
        $match: {
          "visaApplicationDetails.visaOutcomeStatus": "Approved",
          "universityPaymentReceived.status": true,
          "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
        },
      },
      { $unwind: "$interestedCourseDetails" },
      {
        $match: {
          "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
        },
      },
      {
        $group: {
          _id: {
            institute: "$interestedCourseDetails.institute",
            campus: "$interestedCourseDetails.campus",
          },
          totalStudents: { $addToSet: "$_id" },
          totalCommission: {
            $sum: {
              $toDouble: {
                $ifNull: ["$universityPaymentReceived.amount", "0"],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          instituteId: "$_id.institute",
          campusId: "$_id.campus",
          totalStudents: { $size: "$totalStudents" },
          totalCommission: 1,
        },
      },
      {
        $lookup: {
          from: "institutes",
          localField: "instituteId",
          foreignField: "_id",
          as: "institute",
        },
      },
      { $unwind: "$institute" },
      {
        $lookup: {
          from: "campus",
          localField: "campusId",
          foreignField: "_id",
          as: "campus",
        },
      },
      {
        $unwind: {
          path: "$campus",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          totalStudents: 1,
          totalCommission: 1,
          instituteName: "$institute.instituteName",
          country: "$institute.country",
          campusName: { $ifNull: ["$campus.campus", "N/A"] },
        },
      },
      {
        $match: {
          $or: [
            { instituteName: { $regex: searchText, $options: "i" } },
            { campusName: { $regex: searchText, $options: "i" } },
            { country: { $regex: searchText, $options: "i" } },
          ],
        },
      },
    ];

    if (searchText && searchText.trim() !== "") {
      const regex = new RegExp(searchText.trim(), "i"); // case-insensitive search
      basePipeline.push({
        $match: {
          $or: [
            { instituteName: regex },
            { country: regex },
            { campusName: regex },
          ],
        },
      });
    }

    // Step 1: Get total record count
    const countPipeline = [...basePipeline, { $count: "total" }];
    const [countResult] = await StudentApplication.aggregate(countPipeline);
    const totalRecords = countResult?.total || 0;

    // Step 2: Get paginated data
    const paginatedPipeline = [
      ...basePipeline,
      { $sort: { instituteName: 1, campusName: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];
    const data = await StudentApplication.aggregate(paginatedPipeline);

    // Step 3: Return paginated response
    return {
      status: true,
      code: 200,
      data: {
        totalRecords,
        currentPage: String(page),
        totalPages: Math.ceil(totalRecords / limit),
        pageSize: String(limit),
        data,
      },
    };
  },
  exportFeePaymentReports: async (searchText, feeStatus) => {
    let query = {};

    if (feeStatus === "proofUploaded") {
      query = {
        "uploadedDocumentDetails.customDocumentName": "Fee Payment Proof",
      };
    } else {
      query = {
        "interestedCourseDetails.instituteFeePayment.feeStatus": feeStatus,
      };
    }

    const populateFields = [
      { path: "purposeDetails.inquiryFor", select: "name" },
      {
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
          { path: "campus", select: "campus" },
          { path: "course", select: "programName" },
        ],
      },
      { path: "created_by", select: "name" },
    ];

    const searchRegex = new RegExp(searchText, "i");
    const searchConditions = searchText
      ? {
          $or: [
            { name: searchRegex },
            { contact: searchRegex },
            { email: searchRegex },
            { "purposeDetails.preferredCountry": searchRegex },
            { studentId: searchRegex },
          ],
        }
      : {};

    const finalQuery = { ...query, ...searchConditions };

    const applications = await StudentApplication.find(finalQuery)
      .populate(populateFields)
      .sort({ createdAt: -1 })
      .lean();

    if (!applications.length) {
      throw { success: false, message: "No data found for report." };
    }

    const downloadsDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, "feePaymentReport.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "studentId", title: "Student ID" },
        { id: "name", title: "Student Name" },
        { id: "contact", title: "Contact" },
        { id: "email", title: "Email" },
        { id: "preferredCountry", title: "Preferred Country" },
        { id: "institute", title: "Institute" },
        { id: "campus", title: "Campus" },
        { id: "course", title: "Course" },
        { id: "feeStatus", title: "Fee Status" },
        { id: "createdBy", title: "Created By" },
      ],
    });

    const records = [];

    for (const app of applications) {
      for (const courseDetail of app.interestedCourseDetails || []) {
        records.push({
          studentId: app.studentId || "",
          name: app.name || "",
          contact: app.contact || "",
          email: app.email || "",
          preferredCountry: app.purposeDetails?.preferredCountry || "",
          institute: courseDetail.institute?.instituteName || "N/A",
          campus: courseDetail.campus?.campus || "N/A",
          course: courseDetail.course?.programName || "N/A",
          feeStatus: courseDetail.instituteFeePayment?.feeStatus || "N/A",
          createdBy: app.created_by?.name || "N/A",
        });
      }
    }

    await csvWriter.writeRecords(records);

    return { success: true, filePath };
  },
  exportStudentFinanceSummaryReport: async (searchText = "", type) => {
    const query = {
      interestedCourseDetails: {
        $elemMatch: {
          "instituteFeePayment.feeStatus": "paid",
        },
      },
    };

    if (type === "b2b") {
      query.created_by_type = { $in: ["B2B Admin", "B2B Member"] };
    } else if (type === "branch") {
      query.created_by_type = { $in: ["Branch", "Branch User"] };
    }

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
      { path: "created_by", select: "name" },
      { path: "branch", select: "name" },
    ];

    const applications = await StudentApplication.find(query)
      .sort({ createdAt: -1 })
      .populate(populateFields);

    const filteredRecords = [];

    for (const student of applications || []) {
      const paidCourses = student.interestedCourseDetails?.filter(
        (detail) =>
          detail?.instituteFeePayment?.feeStatus?.toLowerCase() === "paid"
      );

      for (const courseDetail of paidCourses || []) {
        filteredRecords.push({
          studentId: student.studentId || "",
          name: student.name || "",
          contact: student.contact || "",
          email: student.email || "",
          preferredCountry: student.purposeDetails?.preferredCountry || "",
          institute: courseDetail.institute?.instituteName || "N/A",
          campus: courseDetail.campus?.campus || "N/A",
          course: courseDetail.course?.programName || "N/A",
          feeStatus: courseDetail.instituteFeePayment?.feeStatus || "N/A",
          createdBy: student.created_by?.name || "N/A",
          branch: student.branch?.name || "N/A",
        });
      }
    }

    if (!filteredRecords.length) {
      throw { success: false, message: "No data found for export." };
    }

    const downloadsDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, "studentFinanceSummary.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "studentId", title: "Student ID" },
        { id: "name", title: "Student Name" },
        { id: "contact", title: "Contact" },
        { id: "email", title: "Email" },
        { id: "preferredCountry", title: "Preferred Country" },
        { id: "institute", title: "Institute" },
        { id: "campus", title: "Campus" },
        { id: "course", title: "Course" },
        { id: "feeStatus", title: "Fee Status" },
        { id: "createdBy", title: "Created By" },
        { id: "branch", title: "Branch" },
      ],
    });

    await csvWriter.writeRecords(filteredRecords);

    return { success: true, filePath };
  },
  universityPaymentCollectionExport: async () => {
    const pipeline = [
      {
        $match: {
          "visaApplicationDetails.visaOutcomeStatus": "Approved",
          "universityPaymentReceived.status": true,
          "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
        },
      },
      { $unwind: "$interestedCourseDetails" },
      {
        $match: {
          "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
        },
      },
      {
        $group: {
          _id: {
            institute: "$interestedCourseDetails.institute",
            campus: "$interestedCourseDetails.campus",
          },
          totalStudents: { $addToSet: "$_id" },
          totalCommission: {
            $sum: {
              $toDouble: {
                $ifNull: ["$universityPaymentReceived.amount", "0"],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          instituteId: "$_id.institute",
          campusId: "$_id.campus",
          totalStudents: { $size: "$totalStudents" },
          totalCommission: 1,
        },
      },
      {
        $lookup: {
          from: "institutes",
          localField: "instituteId",
          foreignField: "_id",
          as: "institute",
        },
      },
      { $unwind: "$institute" },
      {
        $lookup: {
          from: "campus",
          localField: "campusId",
          foreignField: "_id",
          as: "campus",
        },
      },
      {
        $unwind: {
          path: "$campus",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          institute: 1,
          totalStudents: 1,
          totalCommission: 1,
          instituteName: "$institute.instituteName",
          country: "$institute.country",
          campusName: { $ifNull: ["$campus.campus", "N/A"] },
        },
      },
    ];

    const results = await StudentApplication.aggregate(pipeline);
    if (!results.length) throw { success: false, message: "No data found." };

    // CSV file generation
    const downloadsDir = path.join(__dirname, "../../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, "universityPaymentSummary.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "instituteName", title: "Institute Name" },
        { id: "country", title: "Country" },
        { id: "campusName", title: "Campus" },
        { id: "totalCommission", title: "Total Commission" },
        { id: "totalStudents", title: "Total Students" },
      ],
    });

    const records = results.map((item) => ({
      instituteName: item.instituteName || "",
      country: item.country || "",
      campusName: item.campusName || "N/A",
      totalCommission: item.totalCommission || 0,
      totalStudents: item.totalStudents || 0,
    }));

    await csvWriter.writeRecords(records);
    return { success: true, filePath };
  },
};

module.exports = financeReportServices;
