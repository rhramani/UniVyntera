const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const mongoose = require("mongoose");

const studentApplication = require("../../model/masters/studentApplication/studentApplication");
const Role = require("../../model/masters/roles");
const User = require("../../model/user");
const paginate = require("../../utils/pagination");
const { sendB2BCommissionQueryEmail } = require("../../middleware/nodemailer");
const B2BAdmin = require("../../model/masters/b2b/b2bAdmin");
const B2BMember = require("../../model/masters/b2b/b2bMember");

const accountantServices = {
  getEligibleStudents: async (
    page,
    limit,
    searchText = "",
    startDate,
    endDate,
    institute,
    type,
    country,
    currentUser,  
    verificationSent,
    sideConfirmation
  ) => {
    // const filter = {
    //   "visaApplicationDetails.visaOutcomeStatus": "Approved",
    //   interestedCourseDetails: {
    //     $elemMatch: {
    //       "instituteFeePayment.feeStatus": "paid",
    //     },
    //   },
    // };
    const filter = {
      $and: [ 
        {
          $or: [
            { "visaApplicationDetails.visaOutcomeStatus": "Approved" },
            { "visaApplicationDetails.visaDecision.status": "Approved" },
            { "visaApplicationDetails.visaOutcome.decision": "Granted" },
            { "visaApplicationDetails.visaDecision.decision": "Approved" },
            { "visaApplicationDetails.decision.decision": "Approved" },
          ],
        },
        // {
        //   interestedCourseDetails: {
        //     $elemMatch: {
        //       "instituteFeePayment.feeStatus": "paid",
        //     },
        //   },
        // },
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
      filter["visaApplicationDetails.visaOutcomeDate"] = dateFilter;
    }

    // Institute filter
    if (institute) {
      filter["interestedCourseDetails"] = {
        $elemMatch: {
          "instituteFeePayment.feeStatus": "paid",
          institute: institute,
        },
      };
    }
    // Type filter
    if (type === "b2b") {
      filter.created_by_type = { $in: ["B2B Admin", "B2B Member"] };
    } else if (type === "branch") {
      filter.created_by_type = { $in: ["Branch", "Branch User"] };
    }

    // Country filter
    if (country) {
      filter["purposeDetails.preferredCountry"] = { $in: [country] };
    }

    // ✅ New filters with enhanced handling
    if (verificationSent) {
      const isVerificationSent =
        verificationSent === "true" || verificationSent === true;
      filter["universityVerificationSent"] = isVerificationSent;
    }

    if (sideConfirmation) {
      const isSideConfirmation =
        sideConfirmation === "true" || sideConfirmation === true;
      filter["universitySideConfirmation.status"] = isSideConfirmation;
    }

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    // ✅ Role-based filtering
    if (roleName === "B2B Admin" && currentUser.userId) {
      const memberList = await B2BMember.find({
        b2bAdmin: currentUser.userId,
      }).select("_id");
      const memberIds = memberList.map((m) => m._id.toString());
      filter["created_by"] = { $in: [currentUser.userId, ...memberIds] };
    } else if (roleName === "Branch" && currentUser.userId) {
      const branchUsers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");
      const userIdsUnderBranch = branchUsers.map((u) => u._id.toString());
      filter["created_by"] = {
        $in: [currentUser.userId, ...userIdsUnderBranch],
      };
    }

    // else if (roleName === "Super Admin") {
    // } else {
    //   filter["created_by"] = currentUser.userId;
    // }

    const searchOptions = {
      searchText,
      searchFields: ["studentId", "name", "email", "contact"],
    };

    const populateFields = [
      { path: "purposeDetails.inquiryFor", select: "name" },
      {
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
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
    ];

    const getAll = await paginate(
      studentApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    // Only include paid courses
    if (getAll?.data?.length) {
      getAll.data.forEach((student) => {
        student.interestedCourseDetails =
          student.interestedCourseDetails?.filter(
            (detail) =>
              detail?.instituteFeePayment?.feeStatus?.toLowerCase() === "paid"
          );
      });
    }

    return getAll;
  },

  getEligibleInstitutes: async () => {
    const institutes = await studentApplication.aggregate([
      // {
      //   $match: {
      //     "visaApplicationDetails.visaOutcomeStatus": "Approved",
      //     "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
      //   },
      // },
      {
        $match: {
          $or: [
            { "visaApplicationDetails.visaOutcomeStatus": "Approved" },
            { "visaApplicationDetails.visaDecision.status": "Approved" },
            { "visaApplicationDetails.visaOutcome.decision": "Granted" },
            { "visaApplicationDetails.decision.decision": "Approved" },
             { "visaApplicationDetails.visaDecision.decision": "Approved" },
          ],
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
      {
        $unwind: "$institute",
      },
      {
        $project: {
          _id: "$institute._id",
          instituteName: "$institute.instituteName",
        },
      },
    ]);

    return institutes;
  },

  getEligibleCountries: async () => {
    const countries = await studentApplication.aggregate([
      // {
      //   $match: {
      //     "visaApplicationDetails.visaOutcomeStatus": "Approved",
      //     "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
      //   },
      // },
      {
        $match: {
          $or: [
            { "visaApplicationDetails.visaOutcomeStatus": "Approved" },
            { "visaApplicationDetails.visaDecision.status": "Approved" },
            { "visaApplicationDetails.visaOutcome.decision": "Granted" },
            { "visaApplicationDetails.decision.decision": "Approved" },
          ],
          "interestedCourseDetails.instituteFeePayment.feeStatus": "paid",
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

  exportDataToExcel: async (ids) => {
    const dataList = await studentApplication
      .find({ _id: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate({
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
          {
            path: "course",
            select: "programName yearlyTuitionFee currencyCode",
          },
          { path: "created_by", select: "name" },
        ],
      });

    if (!dataList.length) {
      return { success: false, message: "No Students found." };
    }

    const downloadsDir = path.join(__dirname, "../../public");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, "eligibleStudentsList.csv");

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "studentId", title: "StudentID" },
        { id: "name", title: "Student Name" },
        { id: "instituteName", title: "Institute" },
        { id: "programName", title: "Program" },
        { id: "yearlyTuitionFee", title: "Tuition Fee" },
        { id: "currencyCode", title: "currency Code" },
        { id: "type", title: "Type" },
        { id: "country", title: "Preferred Country" },
      ],
    });

    // Prepare flattened data with only paid courses
    const records = [];

    dataList.forEach((student) => {
      const paidCourses =
        student.interestedCourseDetails?.filter(
          (detail) =>
            detail?.instituteFeePayment?.feeStatus?.toLowerCase() === "paid"
        ) || [];

      paidCourses.forEach((detail) => {
        records.push({
          studentId: student.studentId,
          name: student.name,
          instituteName: detail?.institute?.instituteName || "",
          programName: detail?.course?.programName || "",
          yearlyTuitionFee: detail?.course?.yearlyTuitionFee || "",
          type:
            student.created_by_type === "B2B Admin" ||
            student.created_by_type === "B2B Member"
              ? "B2B"
              : student.created_by_type === "Branch" ||
                student.created_by_type === "Branch User"
              ? "Branch"
              : "Head Office",
          country: student.purposeDetails.preferredCountry[0],
          intakeYear: detail?.intakeYear,
          intakeMonth: detail?.intakeMonth,
        });
      });
    });

    await csvWriter.writeRecords(records);

    return { success: true, filePath };
  },

  universityCommision: async (
    page,
    limit,
    searchText = "",
    startDate,
    endDate,
    institute,
    country,
    currentUser,
    invoiceGenerate, paymentReceived
  ) => {
    
    const filter = {
      "universitySideConfirmation.status": true,
    };

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
    if(invoiceGenerate){
      const isInvoiceSent = invoiceGenerate === "true" || invoiceGenerate === true;
       filter["universitytInvoiceGenerated.status"] = isInvoiceSent;
    }

    if(paymentReceived){
      const isPaymentReceived = paymentReceived === "true" || paymentReceived === true;
       filter["universityPaymentReceived.status"] = isPaymentReceived;
    }

    // Correctly handle $elemMatch with optional institute filter
    filter.interestedCourseDetails = {
      $elemMatch: {
        // "instituteFeePayment.feeStatus": "paid",
        ...(institute && { institute }), // conditionally add institute match
      },
    };

    if (country) {
      filter["purposeDetails.preferredCountry"] = { $in: [country] };
    }

    const searchOptions = {
      searchText,
      searchFields: ["studentId", "name", "email", "contact"],
    };

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName === "Branch" && currentUser.userId) {
      const branchUsers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");
      const userIdsUnderBranch = branchUsers.map((u) => u._id.toString());
      filter["created_by"] = {
        $in: [currentUser.userId, ...userIdsUnderBranch],
      };
    }
    console.log("filterssss" , filter);
    const populateFields = [
      { path: "purposeDetails.inquiryFor", select: "name" },
      {
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
          { path: "course", select: "programName" },
          { path: "created_by", select: "name" },
        ],
      },
      {
        path: "purposeDetails.created_by",
        select: "name",
      },
      {
        path: "created_by",
        select: "name",
      },
      {
        path: "personalDetailStatus",
        select: "name",
      },
      {
        path: "documentDetailStatus",
        select: "name",
      },
      {
        path: "counsellingDetailStatus",
        select: "name",
      },
      {
        path: "lastUpdatedStatus",
        select: "name",
      },
      {
        path: "mainStatus",
        select: "name color",
      },
      {
        path: "lastUpdatedStatus",
        select: "name",
      },
    ];

    const getAll = await paginate(
      studentApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (getAll && getAll.data?.length) {
      getAll.data.forEach((student) => {
        delete student.uploadedDocumentDetails;

        // Keep only course details with feeStatus === "paid"
        student.interestedCourseDetails =
          student.interestedCourseDetails?.filter(
            (detail) =>
              detail?.instituteFeePayment?.feeStatus?.toLowerCase() === "paid"
          );
      });
    }

    return getAll;
  },

  getEligibleCommissionUniversity: async () => {
    const universities = await studentApplication.aggregate([
      {
        $match: {
          "universitySideConfirmation.status": true,
        },
      },
      { $unwind: "$interestedCourseDetails" },
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
      {
        $unwind: "$institute",
      },
      {
        $project: {
          _id: "$institute._id",
          instituteName: "$institute.instituteName",
        },
      },
    ]);
    return universities;
  },

  getEligibleCommissionCountry: async () => {
    const countries = await studentApplication.aggregate([
      {
        $match: {
          "universitySideConfirmation.status": true,
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

  getB2BCommissionList: async (
    page,
    limit,
    searchText = "",
    startDate,
    endDate,
    institute,
    country,
    type,
    status,
    userId,
    role
  ) => {
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
    const searchOptions = {
      searchText,
      searchFields: ["studentId", "name", "email", "contact"],
    };

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

    // Correctly handle $elemMatch with optional institute filter
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
    if (type === "b2b") {
      filter.created_by_type = { $in: ["B2B Admin", "B2B Member"] };
    } else if (type === "branch") {
      filter.created_by_type = { $in: ["Branch", "Branch User"] };
    } else {
      filter.created_by_type = { $ne: "user" };
    }

    if ((role === "B2B Admin" || role === "Branch") && userId) {
      if (role === "B2B Admin") {
        // Find B2B Members under this admin
        const memberList = await B2BMember.find({ b2bAdmin: userId }).select(
          "_id"
        );

        const memberIds = memberList.map((member) => member._id.toString());

        filter["created_by"] = { $in: [userId, ...memberIds] };
      } else if (role === "Branch") {
        // Branch: get users linked to this branch in User model
        const branchUsers = await User.find({ branchId: userId }).select("_id");
        const userIdsUnderBranch = branchUsers.map((u) => u._id.toString());

        // Include self and all users under this branch
        filter["created_by"] = { $in: [userId, ...userIdsUnderBranch] };
      }
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
      {
        path: "created_by",
        select: "name userType",
      },
    ];

    const getAll = await paginate(
      studentApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (getAll && getAll.data?.length) {
      getAll.data.forEach((student) => {
        // delete student.uploadedDocumentDetails;

        // Keep only course details with feeStatus === "paid"
        student.interestedCourseDetails =
          student.interestedCourseDetails?.filter(
            (detail) =>
              detail?.instituteFeePayment?.feeStatus?.toLowerCase() === "paid"
          );
      });
    }
    for (const student of getAll.data) {
      let b2bData = null;

      if (student.created_by_type === "B2B Admin" && student.createdByName) {
        b2bData = await B2BAdmin.findOne({
          companyName: student.createdByName,
        }).select("phone bankName branch ifscCode accountNumber companyLogo");
      } else if (
        student.created_by_type === "B2B Member" &&
        student.b2bCompany
      ) {
        b2bData = await B2BAdmin.findOne({
          companyName: student.b2bCompany,
        }).select("phone bankName branch ifscCode accountNumber companyLogo");
      }
      if (b2bData) {
        student.b2bDetails = {
          phone: b2bData.phone || null,
          bankName: b2bData.bankName || null,
          branch: b2bData.branch || null,
          ifscCode: b2bData.ifscCode || null,
          accountNumber: b2bData.accountNumber || null,
          companyLogo: b2bData.companyLogo || null,
        };
      } else {
        student.b2bDetails = null;
      }
    }

    return getAll;
  },

  sendCommissionQueryEmail: async (studentId) => {
    // 1. Fetch the student
    const student = await studentApplication
      .findById(studentId)
      .populate("created_by", "name") // to get B2B name
      .lean();

    if (!student) {
      throw { status: false, message: "Student not found" };
    }

    // 2. Check remarks
    const remarks = student.b2bCommissionRemarks;
    if (!remarks || remarks.trim() === "") {
      throw { status: false, message: "No remarks found for this student." };
    }

    let createdByName = "Unknown";

    switch (student.created_by_type) {
      case "B2B Admin":
        createdByName = student.createdByName || "Unknown Creator";
      case "Branch":
        createdByName = student.createdByName || "Unknown Creator";
        break;
      case "B2B Member":
        createdByName = student.b2bCompany || "Unknown B2B Company";
        break;
      case "Branch User":
        createdByName = student.branch || "Unknown Branch";
        break;
    }

    // 3. Get all users with "Super Admin" role
    const targetRole = await Role.findOne({ name: "Super Admin" });
    if (!targetRole) {
      throw { status: false, message: "Super Admin role not found" };
    }

    const superAdmins = await User.find({ role: targetRole._id });

    if (!superAdmins.length) {
      throw { status: false, message: "No Super Admin users found" };
    }

    // 4. Remove duplicate emails (just in case)
    const uniqueEmails = [
      ...new Set(superAdmins.map((user) => user.email).filter(Boolean)),
    ];

    // 5. Send email to all Super Admins
    for (const email of uniqueEmails) {
      await sendB2BCommissionQueryEmail(
        email,
        student.name,
        student.studentId,
        createdByName,
        remarks
      );
    }

    return "Commission query mail sent successfully";
  },

  editInvoiceNo: async (studentIds, data, editParam) => {
    const { invoiceNumber, invoiceDate } = data;
    if (!studentIds) {
      throw { status: false, message: "No student IDs provided" };
    }

    const idsArray = studentIds.split(",").map((id) => id.trim());
    const validObjectIds = idsArray.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (!validObjectIds.length) {
      throw { status: false, message: "No valid student IDs found" };
    }

    // Convert editParam from query (string) to boolean
    const edit = editParam === "true" || editParam === true;

    const students = await studentApplication
      .find({
        _id: { $in: validObjectIds },
      })
      .select("name studentId b2bInvoice");

    const withInvoice = students.filter(
      (s) => s.b2bInvoice?.number && s.b2bInvoice?.date
    );
    const withoutInvoice = students.filter(
      (s) => !s.b2bInvoice?.number || !s.b2bInvoice?.date
    );

    // Case 1: Single student
    if (validObjectIds.length === 1) {
      const student = students[0];
      const hasInvoice = student.b2bInvoice?.number && student.b2bInvoice?.date;

      if (hasInvoice && !edit) {
        throw {
          status: false,
          message: "Invoice already exists. Set edit=true to update.",
        };
      }

      const result = await studentApplication.updateOne(
        { _id: validObjectIds[0] },
        {
          $set: {
            b2bInvoice: {
              number: invoiceNumber,
              date: invoiceDate,
            },
          },
        }
      );

      return {
        status: true,
        message: `Invoice ${hasInvoice ? "updated" : "added"} for ${
          student.name
        } (${student.studentId}).`,
        updatedCount: result.modifiedCount,
      };
    }

    // Case 2: Multiple students
    if (withInvoice.length > 0 && withoutInvoice.length > 0) {
      throw {
        status: false,
        message: "Some students already have invoice details. Cannot update.",
      };
    }

    if (withInvoice.length === students.length) {
      return {
        status: true,
        message: "All students already have invoice details.",
        updatedCount: 0,
      };
    }

    // Proceed to add invoice
    const result = await studentApplication.updateMany(
      { _id: { $in: validObjectIds } },
      {
        $set: {
          b2bInvoice: {
            number: invoiceNumber,
            date: invoiceDate,
          },
        },
      }
    );

    return {
      status: true,
      message: `Invoice details successfully added for ${result.modifiedCount} student(s).`,
      updatedCount: result.modifiedCount,
    };
  },
  getStudentsByB2b: async (b2bId) => {
    if (!mongoose.Types.ObjectId.isValid(b2bId)) {
      throw { status: false, message: "Invalid B2B Id" };
    }

    const b2bMembers = await B2BMember.find({ b2bAdmin: b2bId }).select("_id");
    const memberIds = b2bMembers.map((m) => m._id.toString());

    const filter = {
      $or: [
        {
          created_by_type: "B2B Admin",
          created_by: b2bId,
        },
        {
          created_by_type: "B2B Member",
          created_by: { $in: memberIds },
        },
      ],
    };

    const getAll = await studentApplication
      .find(filter)
      .select("_id studentId name");
    if (getAll && getAll.data?.length) {
      getAll.data.forEach((student) => {
        // delete student.uploadedDocumentDetails;

        // Keep only course details with feeStatus === "paid"
        student.interestedCourseDetails =
          student.interestedCourseDetails?.filter(
            (detail) =>
              detail?.instituteFeePayment?.feeStatus?.toLowerCase() === "paid"
          );
      });
    }
    return getAll;
  },
};

module.exports = accountantServices;
