const path = require("path");
const fs = require("fs");
const StudentApplication = require("../../../model/masters/studentApplication/studentApplication");
const { createObjectCsvWriter } = require("csv-writer");
const paginate = require("../../../utils/pagination");

const visaReportsServices = {
  getVisaReports: async (
    page,
    limit,
    searchText = "",
    status,
    startDate,
    endDate,
    country,
    currentUser
  ) => {
    let query = {};
    if (status === "filed") {
      query["visaApplicationDetails.status"] = "Visa Filed";
    } else if (status === "approved") {
      query["visaApplicationDetails.visaOutcomeStatus"] = "Approved";
    } else if (status === "rejected") {
      query["visaApplicationDetails.visaOutcomeStatus"] = "Rejected";
    }

    if (startDate || endDate) {
      query["visaApplicationDetails.VFSAppointmentDateTime"] = {};
      if (startDate) {
        query["visaApplicationDetails.VFSAppointmentDateTime"].$gte = new Date(
          startDate
        );
      }
      if (endDate) {
        query["visaApplicationDetails.VFSAppointmentDateTime"].$lte = new Date(
          new Date(endDate).setHours(23, 59, 59, 999)
        );
      }
    }

    if (country) {
      query["purposeDetails.preferredCountry"] = {
        $regex: new RegExp(country, "i"), // case-insensitive match
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
      query.created_by = { $in: [currentUser.userId, ...branchMembersIds] };
    } else if (roleName === "Branch Member") {
      query.created_by = currentUser.userId;
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
  exportVisaReport: async (ids) => {
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

    const filePath = path.join(downloadDir, "visaReports.csv");
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "studentId", title: "Student ID" },
        { id: "vfsDate", title: "VFS Date" },
        { id: "studentName", title: "Student Name" },
        { id: "type", title: "Type" },
        { id: "createdBy", title: "created By" },
        { id: "prefferedCountry", title: "Preffered Country" },
        { id: "instituteName", title: "Institute Name" },
        { id: "courseName", title: "Course Name" },
        { id: "status", title: "Status" },
        { id: "intakeYear", title: "Intake Year" },
        { id: "emailId", title: "Email Id" },
        { id: "phoneNo", title: "Phone Number" },
      ],
    });

    const records = dataList.map((item) => {
      const paidCourse = item.interestedCourseDetails?.find(
        (course) => course.instituteFeePayment.feeStatus === "paid"
      );
      return {
        studentId: item.studentId || "",
        vfsDate: item.visaApplicationDetails?.VFSAppointmentDateTime
          ? new Date(
              item.visaApplicationDetails.VFSAppointmentDateTime
            ).toLocaleDateString("en-GB")
          : "",
        studentName: item.name || "",
        type:
          item.created_by_type === "B2B Admin" ||
          item.created_by_type === "B2B Member"
            ? "B2B"
            : item.created_by_type === "Branch" ||
              item.created_by_type === "Branch User"
            ? "Branch"
            : "Head Office",
        createdBy: item.createdByName || "",
        preferredCountry: item.purposeDetails?.preferredCountry[0] || "",
        instituteName: paidCourse?.institute?.instituteName || "",
        courseName: paidCourse?.course?.programName || "",
        status: item.mainStatus?.name || "",
        intakeYear: paidCourse?.intakeYear,
        emailId: item.email || "",
        phoneNo: item.contact || "",
      };
    });

    await csvWriter.writeRecords(records);
    return {
      success: true,
      filePath,
    };
  },
};

module.exports = visaReportsServices;
