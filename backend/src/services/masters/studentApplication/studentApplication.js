const ExcelJS = require("exceljs");
const path = require("path");
const bcrypt = require("bcrypt");
const fs = require("fs");
const mongoose = require("mongoose");
const crypto = require("crypto");

const studentApplication = require("../../../../model/masters/studentApplication/studentApplication");
const notificationModel = require("../../../../model/masters/notification/notification");
const { getNotificationNamespace } = require("../../../../socket");
const coachingFaculty = require("../../../../model/masters/coachingDetails/coachingFaculty");

const Institute = require("../../../../model/masters/institute");
const Course = require("../../../../model/masters/course");
const Documents = require("../../../../model/masters/documentList/documents");
const User = require("../../../../model/user");
const B2BMember = require("../../../../model/masters/b2b/b2bMember");
const B2BAdmin = require("../../../../model/masters/b2b/b2bAdmin");
const BranchMember = require("../../../../model/branch/branchMember");
const CountryDocument = require("../../../../model/masters/documentList/countryDocument");
const Document = require("../../../../model/masters/documentList/documents");
const ApplicationStatus = require("../../../../model/masters/studentApplication/applicationStatus");
const StudentStatus = require("../../../../model/masters/studentApplication/studentStatus");
const Role = require("../../../../model/masters/roles");
const DocumentTypes = require("../../../../model/masters/documentList/documentType");
const InterestedCourseStatus = require("../../../../model/masters/studentApplication/interestedCourseStatus");
const VisaStatus = require("../../../../model/masters/visaStatus");
const LoanInquiry = require("../../../../model/loanInquiry");
const GenerateInvoice = require("../../../../model/generateInvoice");
const AccountantStatus = require("../../../../model/masters/accountantStatus");
const LoanStatus = require("../../../../model/masters/loanStatus");
const ProcessHistory = require("../../../../model/studentProcessHistory");

const paginate = require("../../../../utils/pagination");
const { getNextSequence } = require("../../../../helpers/nextIdSequence");
const { buildVisaApplication } = require("../../../../helpers/visaFlowbuilder");
const addDeleteHistory = require("../../../../helpers/deleteHistory");

const {
  sendVisaOutcomeMails,
} = require("../../../../helpers/sendVisaOutcomeMails");

const {
  getEmailRecipient,
} = require("../../../../helpers/getRecipientDetails");
const {
  sendDocumentUploadEmail,
  sendInterestedCourseUpdateEmail,
  sendNewStudentApplicationEmail,
  sendPendingDocsEmail,
  sendDocumentReuploadEmail,
  sendApplicationStatusUpdateEmail,
  sendVisaStatusUpdateEmail,
  sendNewEligibleStudentEmail,
  sendUniversityCommissionStatusEmail,
  sendB2BCommissionStatusEmail,
  sendStudentAssignToFacultyEmail,
  sendStudentWelcomeEmail,
  sendCoachingWelcomeEmail,
  sendCourseSelectionEmail,
  sendVisaApprovalEmail,
  sendVisaRefusalEmail,
  sendOfferLetterReceivedEmail,
  sendInterviewScheduledEmail,
  sendOfferLetterRejectedEmail,
} = require("../../../../middleware/nodemailer");
const { uploadToCloudinary } = require("../../../../middleware/cloudinary");
const {
  trackStudentEvents,
} = require("../../../../helpers/applicationProcessHistory");
const {
  resolveVisaStatus,
} = require("../../../../helpers/visaflowStatusResolver");

const { sendSingleMessage } = require("../../chatbox/campaign");

const buildAccessFilterForUser = async (user, mainStatus) => {
  const roleName = typeof user.role === "string" ? user.role : user.role?.name;

  const filter = {};

  // 🟣 B2B Admin
  if (roleName === "B2B Admin") {
    const members = await B2BMember.find({
      b2bAdmin: user._id,
    }).select("_id");

    filter.created_by = {
      $in: [user._id, ...members.map((m) => m._id)],
    };
  }

  // 🟣 B2B Member
  else if (user.userType === "B2B Member") {
    filter.created_by = user._id;
  }

  // 🟢 Counsellors / normal users
  else if (user.viewB2BStudentApplication) {
    let accessConditions = [];

    // ✅ Assigned B2B access FIRST
    if (user.assignedB2B && user.assignedB2B.length > 0) {
      const adminIds = user.assignedB2B.map(
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

    // ✅ Allocation match (user + visa)
    const allocationMatch = {
      $or: [
        {
          userAllocationDetails: {
            $elemMatch: { user: user._id },
          },
        },
        {
          visaAllocationDetails: {
            $elemMatch: { user: user._id },
          },
        },
      ],
    };

    filter.isSubmit = true;

    // ✅ Type: ALL
    if (user.whichB2BStudentApplication === "all") {
      accessConditions.push(
        { created_by: user._id },
        {
          created_by_type: {
            $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
          },
        },
        allocationMatch,
      );
    }

    // ✅ Type: COUNTRYWISE
    else if (user.whichB2BStudentApplication === "countrywise") {
      accessConditions.push({ created_by: user._id });

      const userDoc = await User.findById(user._id).select("country");
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
    }

    // ✅ Type: DEFAULT
    else {
      accessConditions.push({ created_by: user._id }, allocationMatch);
    }

    filter.$or = accessConditions;
  }

  // 🟢 Default counsellor/user (no viewB2B permission)
  else {
    filter.$or = [
      { created_by: user._id },
      {
        userAllocationDetails: {
          $elemMatch: { user: user._id },
        },
      },
      {
        visaAllocationDetails: {
          $elemMatch: { user: user._id },
        },
      },
    ];
  }

  if (user.viewSpecificB2B) {
    const userStates = Array.isArray(user.b2bState)
      ? user.b2bState.map((s) => s.toLowerCase())
      : [];
    const userCountries = Array.isArray(user.b2bCountry)
      ? user.b2bCountry.map((c) => c.toLowerCase())
      : [];
    const useStateFilter = userStates.length > 0;

    const b2bAdmins = await B2BAdmin.find().select("companyName state country");

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

      if (!filter.$or) filter.$or = [];
      filter.$or.push(...b2bAccessConditions);
    }
  }

  // ✅ mainStatus support
  if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
    const mainStatusId = new mongoose.Types.ObjectId(mainStatus);

    if (filter.$or) {
      filter.$or = filter.$or.map((cond) => ({
        $and: [cond, { mainStatus: mainStatusId }],
      }));
    } else {
      filter.mainStatus = mainStatusId;
    }
  }

  return filter;
};

const StudentApplicationServices = {
  create: async (studentData, userId, userName, userType, b2bName, branch) => {
    try {
      const { email, purposeDetails, invoice, passportNumber } = studentData;

      // 1. Check duplicate email
      const existingEmail = await studentApplication.findOne({ email });
      if (existingEmail) {
        throw { status: false, message: "Email already exists" };
      }

      const country = purposeDetails?.preferredCountry?.[0] || "BASE";

      if (email) {
        const existingEmailCountry = await studentApplication.findOne({
          email,
          "purposeDetails.preferredCountry": country,
        });

        if (existingEmailCountry) {
          throw {
            status: false,
            message: `Student with email ${email} already exists for country ${country}`,
          };
        }
      }

      if (passportNumber) {
        const existingStudent = await studentApplication.findOne({
          passportNumber,
          "purposeDetails.preferredCountry": country,
        });

        if (existingStudent) {
          throw {
            status: false,
            message: `Student with passport ${passportNumber} already exists for country ${country}`,
          };
        }
      }

      // 2. Add created by info
      studentData.created_by = userId;
      studentData.createdByName = userName;
      studentData.created_by_type = userType;
      if (b2bName) studentData.b2bCompany = b2bName;
      if (branch) studentData.branch = branch;

      // const country = purposeDetails?.preferredCountry?.[0] || "BASE";
      studentData.studentId = await getNextSequence("studentId", "ST");

      if (!studentData.purposeDetails) studentData.purposeDetails = {};
      studentData.purposeDetails.preferredCountry = [country];

      studentData.visaApplicationDetails = buildVisaApplication(
        country,
        userId,
        userName,
      );

      if (
        Array.isArray(studentData.interestedCourseDetails) &&
        studentData.interestedCourseDetails.length > 0
      ) {
        for (const item of studentData.interestedCourseDetails) {
          item.applicationId = await getNextSequence("applicationId", "AI");
        }
      }

      const newStudent = new studentApplication(studentData);
      await newStudent.save();

      await ProcessHistory.create({
        studentId: newStudent._id,
        history: [
          {
            event: "student_created",
            value: newStudent.name,
            updatedBy: userId,
            updatedByName: userName,
          },
        ],
      });

      // Fire-and-forget background tasks
      (async () => {
        try {
          const backgroundTasks = [];
          if (invoice) {
            backgroundTasks.push(
              GenerateInvoice.create({
                ...invoice,
                name: newStudent._id,
                contactNo: newStudent.contact,
                created_by: userId,
                createdByName: userName,
              }),
            );
          }

          if (newStudent.coachingDetails?.batchFaculty) {
            backgroundTasks.push(
              sendStudentAssignToFacultyEmail(
                newStudent.coachingDetails.batchFaculty,
                newStudent.name,
                userName,
              ),
            );
          }

          if (userType !== "B2B Admin" && userType !== "B2B Member") {
            if (newStudent.email) {
              if (newStudent.admissionProcessRequired) {
                backgroundTasks.push(
                  sendStudentWelcomeEmail(newStudent.email, newStudent.name),
                  sendSingleMessage({
                    to: newStudent.contact,
                    templateId: null,
                    templateName: "welcome_application_start1",
                    fromNumberId: "917359266930",
                    languageCode: "en",
                    parameters: { body: [newStudent.name] },
                  }),
                );
              }

              if (newStudent.coachingDetails?.coachingRequired) {
                backgroundTasks.push(
                  sendCoachingWelcomeEmail(newStudent.email, newStudent.name),
                  sendSingleMessage({
                    to: newStudent.contact,
                    templateId: null,
                    templateName: "coaching_admission_welcome1",
                    fromNumberId: "917359266930",
                    languageCode: "en",
                    parameters: { body: [newStudent.name] },
                  }),
                );
              }
            }
          }

          await Promise.all(backgroundTasks);
        } catch (backgroundError) {
          console.error(
            "Background task failed for studentId:",
            newStudent._id,
            backgroundError,
          );
        }
      })();

      return newStudent;
    } catch (error) {
      throw error;
    }
  },
  update: async (
    updateId,
    updateData,
    userId,
    userName,
    userType,
    files,
    coachingDoc,
    resultDoc,
    mockTestDoc,
    agreementByStudent,
    agreementByAgency,
  ) => {
    if (
      updateData &&
      updateData.updateData &&
      typeof updateData.updateData === "string"
    ) {
      try {
        const parsedData = JSON.parse(updateData.updateData);

        updateData = parsedData;
      } catch (error) {
        // console.error("Error parsing updateData:", error);
        throw { status: false, message: "Invalid JSON in updateData" };
      }
    }

    if (
      updateData.mockTestDetails &&
      (updateData.mockTestDetails.branch === "null" ||
        updateData.mockTestDetails.branch === "" ||
        updateData.mockTestDetails.branch === undefined)
    ) {
      updateData.mockTestDetails.branch = null;
    }

    const { email, documentType, documentName } = updateData;

    if (email) {
      const existingEmail = await studentApplication.findOne({
        _id: { $ne: updateId },
        email,
      });

      if (existingEmail) {
        throw { status: false, message: "Email already exists" };
      }
    }

    const validFollowUpTabs = [
      "personalDetails",
      "documentDetails",
      "interestedCourse",
      "visaApplication",
    ];

    const oldStudent = await studentApplication.findById(updateId).lean();
    const student = await studentApplication.findById(updateId);
    if (!student) throw { status: false, message: "Student not found" };

    if (updateData.submittedTabs) {
      const tab = updateData.submittedTabs;

      if (!Array.isArray(student.submittedTabs)) {
        student.submittedTabs = [];
      }

      if (!student.submittedTabs.includes(tab)) {
        student.submittedTabs.push(tab);
      }
    }

    if (updateData.followUps && typeof updateData.followUps === "object") {
      for (const tabKey of validFollowUpTabs) {
        const tabFollowUp = updateData.followUps[tabKey];

        if (tabFollowUp && typeof tabFollowUp === "object") {
          const { status, nextFollowUpDate, remarks } = tabFollowUp;

          // Initialize if not present
          if (!student.followUps) {
            student.followUps = {};
          }
          if (!student.followUps[tabKey]) {
            student.followUps[tabKey] = {};
          }

          if (status) {
            student.followUps[tabKey].status = status;
          }
          if (nextFollowUpDate) {
            student.followUps[tabKey].nextFollowUpDate = new Date(
              nextFollowUpDate,
            );
          }
          if (remarks !== undefined) {
            student.followUps[tabKey].remarks = remarks;
          }
        }
      }
    }

    if (updateData.password) {
      student.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatableFields = [
      "name",
      "contact",
      "alternateContact",
      "gender",
      "email",
      "DOB",
      "age",
      "address",
      "city",
      "state",
      "country",
      "passportNumber",
      "personalDetailStatus",
      "documentDetailStatus",
      "counsellingDetailStatus",
      "mainStatus",
      "loanRequired",
      "loanAmount",
      "loanProvider",
      "visaByRG",
      "universityVerificationSent",
      "universityVerificationDate",
      "universitySideConfirmation",
      "universitytInvoiceGenerated",
      "universityPaymentReceived",
      "accountantStatus",
      "b2bCommissionRemarks",
      "coachingDetails",
      "docUploadByStudent",
      "admissionProcessRequired",
    ];

    if (updateData.coachingDetails?.batchFaculty) {
      await sendStudentAssignToFacultyEmail(
        updateData.coachingDetails.batchFaculty,
        student.name,
        userName,
      );
    }
    if (
      updateData.accountantStatus &&
      updateData.sendUniversityCommissionEmail === true
    ) {
      await sendUniversityCommissionStatusEmail(
        student.studentId,
        student.name,
        updateData.accountantStatus,
      );
    }
    if (
      updateData.accountantStatus &&
      updateData.sendB2BCommissionEmail === true
    ) {
      await sendB2BCommissionStatusEmail(student, updateData.accountantStatus);
    }

    if (updateData.universitySideConfirmation?.status === true) {
      updateData.universitySideConfirmation.confirmedDate = new Date();
    }
    if (updateData.universityPaymentReceived?.status === true) {
      updateData.universityPaymentReceived.date = new Date();

      // Ensure b2bCommission exists
      if (!updateData.universityPaymentReceived.b2bCommission) {
        updateData.universityPaymentReceived.b2bCommission = {};
        updateData.universityPaymentReceived.b2bCommission.paymentProcess =
          "Pending";
      }

      const b2bPaymentStatus =
        updateData.universityPaymentReceived.b2bCommission.paymentProcess;

      if (b2bPaymentStatus === "Paid") {
        updateData.accountantStatus = "Paid";

        const existingStatus = await AccountantStatus.findOne({ name: "Paid" });

        if (!existingStatus) {
          await AccountantStatus.create({ name: "Paid" });
        }
      }
    }
    if (updateData.loanRequired === true) {
      const exisingLoan = await LoanInquiry.findOne({
        email: student.email,
        studentName: student.name,
      });

      if (!exisingLoan) {
        // ✅ Check if "New" status exists in loanStatus master
        let loanStatus = await LoanStatus.findOne({ name: "New" });

        if (!loanStatus) {
          loanStatus = await LoanStatus.create({ name: "New" });
        }

        // ✅ Create Loan Inquiry with status id
        await LoanInquiry.create({
          studentName: student.name,
          email: student.email,
          contact: student.contact,
          country: student.purposeDetails.preferredCountry[0],
          requiredLoan: updateData.loanAmount || "",
          status: loanStatus._id,
          created_by: userId,
          createdByName: userName,
        });
      }
    }

    let lastUpdatedField = null;

    updatableFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        if (field === "coachingDetails") {
          //  Merge instead of replace
          student.coachingDetails = {
            ...(student.coachingDetails.toObject?.() ||
              student.coachingDetails),
            ...updateData.coachingDetails,
          };
        } else {
          student[field] = updateData[field];
        }

        if (
          field === "personalDetailStatus" ||
          field === "documentDetailStatus" ||
          field === "counsellingDetailStatus"
        ) {
          lastUpdatedField = field;
        }
      }
    });

    if (lastUpdatedField) {
      student.lastUpdatedStatus = updateData[lastUpdatedField];
    }

    //send mail for pending documents
    const getPendingStatusIds = async () => {
      const pendingStatuses = await ApplicationStatus.find({ name: /pending/i }) // case-insensitive match
        .select("_id")
        .lean();

      return pendingStatuses.map((s) => s._id.toString());
    };

    if (lastUpdatedField === "documentDetailStatus") {
      const pendingStatusIds = await getPendingStatusIds(); // implement this in a util or service

      const isPending = pendingStatusIds.includes(
        student.documentDetailStatus?.toString(),
      );

      if (isPending) {
        const missingDocs = await studentApplicationServices.checkPendingDoc(
          student._id,
        );

        let recipientEmail = student.email; // default
        let recipientType = "Student";

        if (student.created_by_type === "B2B Admin") {
          const b2bAdmin = await B2BAdmin.findById(student.created_by)
            .select("email")
            .lean();
          if (b2bAdmin?.email) {
            recipientEmail = b2bAdmin.email;
            recipientType = "B2B";
          }
        } else if (student.created_by_type === "B2B Member") {
          const b2bMember = await B2BMember.findById(student.created_by)
            .select("email")
            .lean();
          if (b2bMember?.email) {
            recipientEmail = b2bMember.email;
            recipientType = "B2B";
          }
        }

        await sendPendingDocsEmail(
          recipientEmail,
          missingDocs.missingDocuments,
          student.name,
          student.studentId,
          recipientType,
        );
      }
    }

    const handleSubDocs = (updateList, studentList, fieldName) => {
      for (const item of updateList) {
        // If this is a new item with a tempId that we're tracking
        if (
          !item._id &&
          item.tempId &&
          updateData.educationDetailTempId === item.tempId
        ) {
          studentList?.push({
            ...item,
            created_by: userId,
            createdByName: userName,
          });
        } else if (
          !item._id &&
          item.tempId &&
          updateData.entranceExamTempId === item.tempId
        ) {
          studentList?.push({
            ...item,
            created_by: userId,
            createdByName: userName,
          });
        } else if (!item._id && item.tempId && updateData.aptitudeExamTempId) {
          studentList?.push({
            ...item,
            created_by: userId,
            createdByName: userName,
          });
        } else if (!item._id && item.tempId && updateData.workTempId) {
          studentList?.push({
            ...item,
            created_by: userId,
            createdByName: userName,
          });
        } else if (item._id) {
          const index = studentList.findIndex(
            (i) => i._id.toString() === item._id.toString(),
          );
          if (index !== -1) {
            const existing = studentList[index].toObject();
            studentList[index] = {
              ...existing,
              ...item,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        }
        // If this is a new item without a tempId or not the one we're tracking
        else {
          studentList?.push({
            ...item,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    };

    const { customDocumentName, status, remarks } = updateData;

    const tempIdMap = new Map();

    if (Array.isArray(updateData.educationDetails)) {
      updateData.educationDetails.forEach((eduDetail) => {
        if (eduDetail.tempId) {
          // Generate a consistent ObjectId for this tempId
          const objectId = new mongoose.Types.ObjectId();

          // Store mapping
          tempIdMap.set(eduDetail.tempId, objectId);

          // Add _id to the education detail
          eduDetail._id = objectId;
        }
      });
    }

    if (Array.isArray(updateData.educationDetails)) {
      for (const eduDetail of updateData.educationDetails) {
        if (eduDetail._id && !eduDetail.tempId) {
          // This is an existing education detail
          const index = student.educationDetails.findIndex(
            (i) => i._id.toString() === eduDetail._id.toString(),
          );

          if (index !== -1) {
            // Update existing
            const existing = student.educationDetails[index].toObject();
            student.educationDetails[index] = {
              ...existing,
              ...eduDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          // This is a new education detail
          student.educationDetails.push({
            ...eduDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (Array.isArray(updateData.entranceExamDetails)) {
      updateData.entranceExamDetails.forEach((entDetail) => {
        if (entDetail.tempId) {
          const objectId = new mongoose.Types.ObjectId();

          tempIdMap.set(entDetail.tempId, objectId);
          entDetail._id = objectId;
        }
      });
    }

    if (Array.isArray(updateData.entranceExamDetails)) {
      for (const entDetail of updateData.entranceExamDetails) {
        if (entDetail._id && !entDetail.tempId) {
          const index = student.entranceExamDetails.findIndex(
            (i) => i._id.toString() === entDetail._id.toString(),
          );

          if (index !== -1) {
            const existing = student.entranceExamDetails[index].toObject();
            student.entranceExamDetails[index] = {
              ...existing,
              ...entDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          student.entranceExamDetails.push({
            ...entDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (Array.isArray(updateData.aptitudeExamDetails)) {
      updateData.aptitudeExamDetails.forEach((aptDetail) => {
        if (aptDetail.tempId) {
          const objectId = new mongoose.Types.ObjectId();

          tempIdMap.set(aptDetail.tempId, objectId);

          aptDetail._id = objectId;
        }
      });
    }

    if (Array.isArray(updateData.aptitudeExamDetails)) {
      for (const aptDetail of updateData.aptitudeExamDetails) {
        if (aptDetail._id && !aptDetail.tempId) {
          const index = student.aptitudeExamDetails.findIndex(
            (i) => i._id.toString() === aptDetail._id.toString(),
          );

          if (index !== -1) {
            const existing = student.aptitudeExamDetails[index].toObject();
            student.aptitudeExamDetails[index] = {
              ...existing,
              ...aptDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          student.aptitudeExamDetails.push({
            ...aptDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (Array.isArray(updateData.workExperience)) {
      updateData.workExperience.forEach((workDetail) => {
        if (workDetail.tempId) {
          const objectId = new mongoose.Types.ObjectId();

          tempIdMap.set(workDetail.tempId, objectId);

          workDetail._id = objectId;
        }
      });
    }

    if (Array.isArray(updateData.workExperience)) {
      for (const workDetail of updateData.workExperience) {
        if (workDetail._id && !workDetail.tempId) {
          const index = student.workExperience.findIndex(
            (i) => i._id.toString() === workDetail._id.toString(),
          );

          if (index !== -1) {
            const existing = student.workExperience[index].toObject();
            student.workExperience[index] = {
              ...existing,
              ...workDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          student.workExperience.push({
            ...workDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (Array.isArray(updateData.personalDetailsRemarks)) {
      for (const personalDetails of updateData.personalDetailsRemarks) {
        if (personalDetails._id && !personalDetails.tempId) {
          const index = student.personalDetailsRemarks.findIndex(
            (i) => i._id.toString() === personalDetails._id.toString(),
          );

          if (index !== -1) {
            const existing = student.personalDetailsRemarks[index].toObject();
            student.personalDetailsRemarks[index] = {
              ...existing,
              ...personalDetails,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          student.personalDetailsRemarks.push({
            ...personalDetails,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (Array.isArray(updateData.emergencyDetails)) {
      for (const emergencyDetail of updateData.emergencyDetails) {
        if (emergencyDetail._id && !emergencyDetail.tempId) {
          const index = student.emergencyDetails.findIndex(
            (i) => i._id.toString() === emergencyDetail._id.toString(),
          );

          if (index !== -1) {
            const existing = student.emergencyDetails[index].toObject();
            student.emergencyDetails[index] = {
              ...existing,
              ...emergencyDetail,
              created_by: existing.created_by,
              createdByName: existing.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          student.emergencyDetails.push({
            ...emergencyDetail,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    if (files) {
      for (const file of files) {
        let finalDocName = documentName;

        if (documentName && !customDocumentName) {
          try {
            const doc = await Documents.findById(documentName).lean();
            if (doc) {
              finalDocName = doc.name;
            } else {
              // Not found in Document table — assume it's a raw string and use as-is
              finalDocName = documentName;
            }
          } catch (err) {
            // In case documentName is not a valid ObjectId (e.g., plain string), fallback
            finalDocName = documentName;
          }
        }
        finalDocName = customDocumentName || finalDocName;

        const OFEER_LETTER_DOCS = [
          "Conditional Offer Letter",
          "Unconditional Offer Letter",
          "Rejection Letter",
          "Visa Copy / Grant Document",
          "Visa Document",
          "Visa Outcome Proof",
          "Visa Grant Letter",
          "Visa Decision Copy",
          "Visa Copy",
          "Visa Decision & Issuance Copy",
        ];

        // if (mongoose.Types.ObjectId.isValid(finalDocName)) {
        //   finalDocName = await Document.findById(finalDocName).select("name");
        // }

        // const ext = path.extname(file.originalname)+
        // ;

        //cloudinary code starts
        // const finalStudentName = student?.name
        //   ?.replace(/\s+/g, "_")
        //   .toLowerCase();
        // const safeDocName = finalDocName?.replace(/\s+/g, "_").toLowerCase();
        // const now = new Date();
        // const dateTimeString = now.toISOString().replace(/[:.]/g, "-"); // e.g., 2025-06-02T14-30-15-123Z

        // // const newFileName = `${finalStudentName}_${safeDocName}_${dateTimeString}${ext}`;

        // const sanitizePublicId = (name) =>
        //   name
        //     .replace(/\.[^/.]+$/, "") // remove file extension
        //     .replace(/[\/\\?%*:|"<>()[\]{}&]/g, "") // remove illegal/special characters
        //     .replace(/\s+/g, "_") // replace whitespace with _
        //     .toLowerCase();

        // const cloudinaryPublicId = sanitizePublicId(
        //   `${finalStudentName}_${safeDocName}_${dateTimeString}`
        // );

        // const cloudinaryRes = await uploadToCloudinary(
        //   file.buffer,
        //   file.mimetype,
        //   "student-documents",
        //   cloudinaryPublicId
        // );

        // const cloudFilePath = cloudinaryRes.secure_url;

        // cloudinary code ends
        const uploadDir = path.join(
          __dirname,
          "../../../../uploads/student-documents",
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const finalStudentName = student?.name
          ?.replace(/\s+/g, "_")
          .toLowerCase();
        const safeDocName = finalDocName?.replace(/\s+/g, "_").toLowerCase();
        const now = new Date();
        const dateTimeString = now.toISOString().replace(/[:.]/g, "-");

        const sanitizePublicId = (name) =>
          name
            .replace(/\.[^/.]+$/, "") // remove file extension
            .replace(/[\/\\?%*:|"<>()[\]{}&]/g, "") // remove illegal/special characters
            .replace(/\s+/g, "_") // replace whitespace with _
            .toLowerCase();

        // ✅ Build safe file name

        const ext = path.extname(file.originalname) || "";

        // ✅ Final file name and path
        let newFileName;
        if (OFEER_LETTER_DOCS.includes(finalDocName)) {
          newFileName = file.originalname;
        } else {
          const sanitizedName = sanitizePublicId(
            `${finalStudentName}_${safeDocName}_${dateTimeString}`,
          );

          newFileName = `${sanitizedName}${ext}`;
        }

        const oldPath = file.path;
        const newPath = path.join(uploadDir, newFileName);

        // ✅ Move file to new location
        fs.renameSync(oldPath, newPath);

        // ✅ Generate relative path for DB
        const uploadIndex = newPath.indexOf("uploads");
        const relativePath =
          uploadIndex !== -1
            ? newPath.substring(uploadIndex).replace(/\\/g, "/")
            : newPath;

        // ✅ Assign final path
        const cloudFilePath = relativePath;
        let ref_module = null;
        if (
          updateData.educationDetailTempId &&
          tempIdMap.has(updateData.educationDetailTempId)
        ) {
          ref_module = tempIdMap.get(updateData.educationDetailTempId);
        } else if (
          updateData.entranceExamTempId &&
          tempIdMap.has(updateData.entranceExamTempId)
        ) {
          ref_module = tempIdMap.get(updateData.entranceExamTempId);
        } else if (
          updateData.aptitudeExamTempId &&
          tempIdMap.has(updateData.aptitudeExamTempId)
        ) {
          ref_module = tempIdMap.get(updateData.aptitudeExamTempId);
        } else if (
          updateData.workTempId &&
          tempIdMap.has(updateData.workTempId)
        ) {
          ref_module = tempIdMap.get(updateData.workTempId);
        } else if (updateData.workExperienceId) {
          ref_module = updateData.workExperienceId;
        } else if (updateData.aptitudeExamId) {
          ref_module = updateData.aptitudeExamId;
        } else if (updateData.educationDetailId) {
          ref_module = updateData.educationDetailId;
        } else if (updateData.entranceExamId) {
          ref_module = updateData.entranceExamId;
        } else if (
          updateData.customDocumentName &&
          (updateData.customDocumentName === "Application Submission Form" ||
            updateData.customDocumentName === "Deposit Payment Proof" ||
            updateData.customDocumentName === "Fee Payment Proof" ||
            updateData.customDocumentName === "Conditional Offer Letter" ||
            updateData.customDocumentName === "Unconditional Offer Letter" ||
            updateData.customDocumentName === "Compulsory Agreement Document" ||
            updateData.customDocumentName === "Rejection Letter" ||
            updateData.customDocumentName === "Visa Fee Payment" ||
            updateData.customDocumentName === "Appointment Letter" ||
            updateData.customDocumentName === "Biometrics Receipt" ||
            updateData.customDocumentName === "PIC Decision" ||
            updateData.customDocumentName === "D Visa Document" ||
            updateData.customDocumentName === "Supplementary Additional" ||
            updateData.customDocumentName === "Visa Application Submission" ||
            updateData.customDocumentName === "Visa Outcome Proof" ||
            updateData.customDocumentName === "Commission payment Proof")
        ) {
          ref_module = updateData.ref_module;
        }

        // ✅ Handle Reupload update logic here
        if (updateData.documentId) {
          const index = student.uploadedDocumentDetails.findIndex(
            (doc) => doc._id.toString() === updateData.documentId.toString(),
          );

          if (index !== -1) {
            const existing = student.uploadedDocumentDetails[index].toObject();

            // if (existing.status === "Reupload") {
            // if (existing.filePath) {
            //   try {
            //     fs.unlinkSync(existing.filePath);
            //   } catch (err) {
            //     console.error("Error deleting old file:", err);
            //   }
            // }
            student.uploadedDocumentDetails[index] = {
              ...existing,
              filePath: cloudFilePath,
              status: "unverified",
              updated_by: userId,
              updatedByName: userName,
            };
            // } else {
            //   throw {
            //     status: false,
            //     message:
            //       "Cannot reupload unless the current status is 'Reupload'",
            //   };
            // }
          } else {
            throw {
              status: false,
              message: "Invalid documentId provided for reupload",
            };
          }
        } else {
          // ✅ Fresh document upload flow
          if ((documentType && documentName) || customDocumentName) {
            student.uploadedDocumentDetails?.push({
              documentType: documentType || null,
              documentName: documentName || null,
              customDocumentName: customDocumentName || null,
              status: status || null,
              remarks: remarks || null,
              filePath: cloudFilePath,
              created_by: userId,
              createdByName: userName,
              updated_by: userId,
              updatedByName: userName,
              ref_module: ref_module || null,
            });
            await trackStudentEvents(
              oldStudent,
              {
                ...student.toObject(),
                _triggeredDocument: {
                  documentType,
                  documentName,
                  customDocumentName,
                  status,
                  filePath: cloudFilePath,
                },
              },
              { _docUpload: true },
              userId,
              userName,
            );

            if (["B2B Admin", "B2B Member"].includes(userType)) {
              let usersList = [];

              if (student.userAllocationDetails?.length > 0) {
                const allocationUserIds = student.userAllocationDetails.map(
                  (allocation) => allocation.user,
                );

                const allocationUsers = await User.find({
                  _id: { $in: allocationUserIds },
                });

                usersList.push(...allocationUsers);

                // Unique filter
                usersList = usersList.filter(
                  (user, index, self) =>
                    index ===
                    self.findIndex(
                      (u) => u._id.toString() === user._id.toString(),
                    ),
                );
              }

              let bccEmails = usersList.map((u) => u.email).filter(Boolean);

              // user management users
              const preferredCountry =
                Array.isArray(student.purposeDetails.preferredCountry) &&
                student.purposeDetails.preferredCountry.length > 0
                  ? student.purposeDetails.preferredCountry[0]
                  : null;

              if (preferredCountry) {
                const countryWiseUsers = await User.find({
                  $and: [
                    {
                      $or: [
                        { branchId: null },
                        { branchId: { $exists: false } },
                      ],
                    },
                    { viewB2BStudentApplication: true },
                    { whichB2BStudentApplication: "countrywise" },
                    { country: preferredCountry },
                  ],
                }).select("email");

                const extraEmails = countryWiseUsers
                  .map((u) => u.email)
                  .filter(Boolean);
                bccEmails = [...new Set([...bccEmails, ...extraEmails])];
              }

              if (bccEmails.length > 0) {
                let finalDocName = customDocumentName || null;

                if (!finalDocName && documentName) {
                  try {
                    const doc =
                      await Documents.findById(documentName).select("name");
                    finalDocName = doc ? doc.name : "Unnamed Document";
                  } catch (err) {
                    finalDocName = "Unnamed Document";
                  }
                }

                // 🔥 Fire and forget
                setImmediate(() => {
                  sendDocumentUploadEmail(
                    bccEmails,
                    student.name,
                    userName, // b2bPartnerName
                    userName, // senderName
                    userType,
                    finalDocName,
                    cloudFilePath,
                  ).catch((err) => {
                    console.error("Error sending document upload email:", err);
                  });
                });
              }
            }

            if (
              (customDocumentName || finalDocName) ===
              "Compulsory Agreement Document"
            ) {
              for (const courseDetail of student.interestedCourseDetails) {
                if (courseDetail.typeOfApplication === "Tailormade") {
                  let status = await InterestedCourseStatus.findOne({
                    name: "Under Verification",
                  });
                  if (!status) {
                    status = await InterestedCourseStatus.create({
                      name: "Under Verification",
                    });
                  }

                  courseDetail.status = status.name;
                  courseDetail.updated_by = userId;
                  courseDetail.updatedByName = userName;
                }
              }
            }
          } else {
            throw {
              status: false,
              message:
                "Document must have either (documentType & documentName) or customDocumentName",
            };
          }
        }
      }
    }
    // if (updateData.purposeDetails) {
    //   if (!student.purposeDetails) {
    //     student.purposeDetails = {
    //       ...updateData.purposeDetails,
    //       created_by: userId,
    //       createdByName: userName,
    //     };
    //   } else {
    //     student.purposeDetails = {
    //       ...student.purposeDetails,
    //       ...updateData.purposeDetails,
    //       created_by: student.purposeDetails.created_by || userId,
    //       createdByName: student.purposeDetails.createdByName || userName,
    //       updated_by: userId,
    //       updatedByName: userName,
    //     };
    //   }
    // }

    if (updateData.purposeDetails) {
      const newPreferredCountries =
        updateData.purposeDetails.preferredCountry || [];
      const prevPreferredCountries =
        student.purposeDetails?.preferredCountry || [];

      student.purposeDetails = {
        ...student.purposeDetails,
        ...updateData.purposeDetails,
        created_by: student.purposeDetails.created_by || userId,
        createdByName: student.purposeDetails.createdByName || userName,
        updated_by: userId,
        updatedByName: userName,
      };

      student.markModified("purposeDetails"); // ✅ tell Mongoose nested field changed
      await student.save(); // ✅ persist it

      const newFirstCountry = newPreferredCountries[0]?.toLowerCase() || "base";
      const prevFirstCountry =
        prevPreferredCountries[0]?.toLowerCase() || "base";

      if (newFirstCountry !== prevFirstCountry) {
        const newVisaFlow = buildVisaApplication(
          newFirstCountry,
          userId,
          userName,
        );
        await studentApplication.updateOne(
          { _id: student._id },
          { $set: { visaApplicationDetails: newVisaFlow } },
        );
        return await studentApplication.findById(student._id);
      }
    }

    if (updateData.educationDetailId && updateData.educationDetailUpdate) {
      const index = student.educationDetails.findIndex(
        (ed) => ed._id.toString() === updateData.educationDetailId.toString(),
      );
      if (index !== -1) {
        const existing = student.educationDetails[index].toObject();
        student.educationDetails[index] = {
          ...existing,
          ...updateData.educationDetailUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };

        if (updateData.educationDocumentUpdate) {
          const existingDoc =
            student.uploadedDocumentDetails[docIndex].toObject();
          student.uploadedDocumentDetails[docIndex] = {
            ...existingDoc,
            ...updateData.educationDocumentUpdate,
            updated_by: userId,
            updatedByName: userName,
          };
        }
      }
    }

    if (updateData.coachingExamDetails) {
      // Add new exam details
      if (!Array.isArray(student.coachingDetails.examDetails)) {
        student.coachingDetails.examDetails = [];
      }

      let docUrl = null;
      if (coachingDoc && coachingDoc.length > 0) {
        const fullPath = coachingDoc[0].path; // multer gives full local file path

        // ✅ Extract relative path starting from "uploads"
        const uploadIndex = fullPath.indexOf("uploads");
        const relativePath =
          uploadIndex !== -1
            ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
            : fullPath;

        // ✅ Assign final path to docUrl
        docUrl = relativePath;
      }

      student.coachingDetails.examDetails.push({
        ...updateData.coachingExamDetails,
        document: docUrl, // attach uploaded doc if present
        created_by: userId,
        createdByName: userName,
      });
    }

    // coaching exam update
    if (updateData.coachingExamId && updateData.coachingExamUpdate) {
      const index = student.coachingDetails.examDetails.findIndex(
        (i) => i._id.toString() === updateData.coachingExamId.toString(),
      );

      if (index !== -1) {
        const existingDoc =
          student.coachingDetails.examDetails[index].toObject();
        student.coachingDetails.examDetails[index] = {
          ...existingDoc,
          ...updateData.coachingExamUpdate,
        };
      }
    }

    //multiple exam update from outside form

    if (
      updateData.coachingExamUpdates &&
      Array.isArray(updateData.coachingExamUpdates)
    ) {
      updateData.coachingExamUpdates.forEach((examUpdate) => {
        const { examId, update } = examUpdate;

        const index = student.coachingDetails.examDetails.findIndex(
          (i) => i._id.toString() === examId.toString(),
        );

        if (index !== -1) {
          const existingDoc =
            student.coachingDetails.examDetails[index].toObject();

          student.coachingDetails.examDetails[index] = {
            ...existingDoc,
            ...update,
          };
        }
      });
    }

    // to update document for coaching exam
    // if (updateData.coachingExamId) {
    //   if (coachingDoc) {
    //     const cloudinaryRes = await uploadToCloudinary(
    //       coachingDoc[0].buffer,
    //       coachingDoc[0].mimetype,
    //       "coachingDoc"
    //     );
    //     const index = student.coachingDetails.examDetails.findIndex(
    //       (i) => i._id.toString() === updateData.coachingExamId.toString()
    //     );
    //     const existingDoc =
    //       student.coachingDetails.examDetails[index].toObject();
    //     student.coachingDetails.examDetails[index] = {
    //       ...existingDoc,
    //       document: cloudinaryRes.secure_url,
    //     };
    //   }
    // }

    if (updateData.coachingExamId) {
      if (coachingDoc && coachingDoc.length > 0) {
        // ✅ Get the file path from multer
        const fullPath = coachingDoc[0].path;

        // ✅ Extract relative path starting from "uploads"
        const uploadIndex = fullPath.indexOf("uploads");
        const relativePath =
          uploadIndex !== -1
            ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
            : fullPath;

        // ✅ Find the corresponding exam record
        const index = student.coachingDetails.examDetails.findIndex(
          (i) => i._id.toString() === updateData.coachingExamId.toString(),
        );

        if (index !== -1) {
          const existingDoc =
            student.coachingDetails.examDetails[index].toObject();

          // ✅ Replace the document URL with the local file path
          student.coachingDetails.examDetails[index] = {
            ...existingDoc,
            document: relativePath,
          };
        }
      }
    }

    // target achieved data

    if (updateData.targetAchievedDetails) {
      if (!student.coachingDetails.targetAchieved) {
        student.coachingDetails.targetAchieved = {
          ...updateData.targetAchievedDetails,
        };
      } else {
        Object.entries(updateData.targetAchievedDetails).forEach(
          ([key, value]) => {
            if (value !== undefined) {
              student.coachingDetails.targetAchieved[key] = value;
            }
          },
        );
      }
    }

    // upload result doc in target achieved data
    if (resultDoc && resultDoc.length > 0) {
      // ✅ Get local file path from multer
      const fullPath = resultDoc[0].path;

      // ✅ Extract relative path starting from "uploads"
      const uploadIndex = fullPath.indexOf("uploads");
      const relativePath =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;

      // ✅ Assign to the student's coachingDetails field
      student.coachingDetails.targetAchieved.document = relativePath;
    }

    if (agreementByStudent && agreementByStudent.length > 0) {
      const fullPath = agreementByStudent[0].path;

      const uploadIndex = fullPath.indexOf("uploads");
      const relativePath =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;

      student.agreementByStudent = relativePath;
    }

    if (agreementByAgency && agreementByAgency.length > 0) {
      const fullPath = agreementByAgency[0].path;

      const uploadIndex = fullPath.indexOf("uploads");
      const relativePath =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;

      student.agreementByAgency = relativePath;
    }

    if (updateData.remarksId && updateData.updatedRemark) {
      const index = student.coachingDetails.remarkHistory.findIndex(
        (i) => i._id.toString() === updateData.remarksId.toString(),
      );

      if (index !== -1) {
        const existingDoc =
          student.coachingDetails.remarkHistory[index].toObject();
        student.coachingDetails.remarkHistory[index] = {
          ...existingDoc,
          remarks: updateData.updatedRemark,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (updateData.remarkHistory) {
      if (!Array.isArray(student.coachingDetails.remarkHistory)) {
        student.coachingDetails.remarkHistory = [];
      }

      student.coachingDetails.remarkHistory.push({
        remarks: updateData.remarkHistory,
        created_by: userId,
        createdByName: userName,
      });
    }

    // mock test

    if (updateData.mockTestId) {
      if (mockTestDoc && mockTestDoc.length > 0) {
        // ✅ Get local file path from multer
        const fullPath = mockTestDoc[0].path;

        // ✅ Extract relative path starting from "uploads"
        const uploadIndex = fullPath.indexOf("uploads");
        const relativePath =
          uploadIndex !== -1
            ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
            : fullPath;

        // ✅ Find the existing mockTest entry
        const index = student.coachingDetails.mockTestDetails.findIndex(
          (i) => i._id.toString() === updateData.mockTestId.toString(),
        );

        if (index !== -1) {
          const existingDoc =
            student.coachingDetails.mockTestDetails[index].toObject();

          // ✅ Replace Cloudinary URL with local relative path
          student.coachingDetails.mockTestDetails[index] = {
            ...existingDoc,
            document: relativePath,
          };
        }
      }
    }

    if (updateData.mockTestId && updateData.mockTestUpdate) {
      const index = student.coachingDetails.mockTestDetails.findIndex(
        (i) => i._id.toString() === updateData.mockTestId.toString(),
      );

      if (index !== -1) {
        const existingDoc =
          student.coachingDetails.mockTestDetails[index].toObject();
        student.coachingDetails.mockTestDetails[index] = {
          ...existingDoc,
          ...updateData.mockTestUpdate,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (updateData.mockTestDetails) {
      if (!Array.isArray(student.coachingDetails.mockTestDetails)) {
        student.coachingDetails.mockTestDetails = [];
      }

      let docUrl = null;
      // if (mockTestDoc) {
      //   const cloudinaryRes = await uploadToCloudinary(
      //     mockTestDoc[0].buffer,
      //     mockTestDoc[0].mimetype,
      //     "mockTestDoc"
      //   );
      //   docUrl = cloudinaryRes.secure_url;
      // }

      if (mockTestDoc && mockTestDoc.length > 0) {
        const fullPath = mockTestDoc[0].path; // multer saves local path automatically

        // ✅ Extract relative path from "uploads"
        const uploadIndex = fullPath.indexOf("uploads");
        const relativePath =
          uploadIndex !== -1
            ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
            : fullPath;

        // ✅ Assign to variable
        docUrl = relativePath;
      }
      student.coachingDetails.mockTestDetails.push({
        ...updateData.mockTestDetails,
        document: docUrl,
        created_by: userId,
        createdByName: userName,
      });
    }

    if (updateData.masterSessionId && updateData.masterSessionUpdate) {
      const index = student.coachingDetails.masterSessionDetails.findIndex(
        (i) => i._id.toString() === updateData.masterSessionId.toString(),
      );

      if (index !== -1) {
        const existingDoc =
          student.coachingDetails.masterSessionDetails[index].toObject();
        student.coachingDetails.masterSessionDetails[index] = {
          ...existingDoc,
          ...updateData.masterSessionUpdate,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (!student.coachingDetails) {
      student.coachingDetails = {};
    }

    if (!Array.isArray(student.coachingDetails.masterSessionDetails)) {
      student.coachingDetails.masterSessionDetails = [];
    }

    if (updateData.masterSessionDetails) {
      if (!Array.isArray(student.coachingDetails.masterSessionDetails)) {
        student.coachingDetails.masterSessionDetails = [];
      }
      student.coachingDetails.masterSessionDetails.push({
        ...updateData.masterSessionDetails,
        created_by: userId,
        createdByName: userName,
      });
    }

    if (updateData.subjectLevelDetails) {
      if (!Array.isArray(student.coachingDetails.subjectLevelDetails)) {
        student.coachingDetails.subjectLevelDetails = [];
      }
      student.coachingDetails.subjectLevelDetails.push({
        ...updateData.subjectLevelDetails,
        created_by: userId,
        createdByName: userName,
      });
    }

    if (updateData.subjectLevelId && updateData.subjectLevelUpdate) {
      const index = student.coachingDetails.subjectLevelDetails.findIndex(
        (i) => i._id.toString() === updateData.subjectLevelId.toString(),
      );

      if (index !== -1) {
        const existingDoc =
          student.coachingDetails.subjectLevelDetails[index].toObject();
        student.coachingDetails.subjectLevelDetails[index] = {
          ...existingDoc,
          ...updateData.subjectLevelUpdate,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (updateData.entranceExamId && updateData.entranceExamUpdate) {
      const index = student.entranceExamDetails.findIndex(
        (e) => e._id.toString() === updateData.entranceExamId.toString(),
      );
      if (index !== -1) {
        const existing = student.entranceExamDetails[index].toObject();
        student.entranceExamDetails[index] = {
          ...existing,
          ...updateData.entranceExamUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };

        if (updateData.entranceExamDocumentUpdate) {
          const existingDoc = student.uploadedDocumentDetails[index].toObject();
          student.uploadedDocumentDetails[docIndex] = {
            ...existingDoc,
            ...updateData.entranceExamDocumentUpdate,
            updated_by: userId,
            updatedByName: userName,
          };
        }
      }
    }

    if (updateData.aptitudeExamId && updateData.aptitudeExamUpdate) {
      const index = student.aptitudeExamDetails.findIndex(
        (e) => e._id.toString() === updateData.aptitudeExamId.toString(),
      );
      if (index !== -1) {
        const existing = student.aptitudeExamDetails[index].toObject();
        student.aptitudeExamDetails[index] = {
          ...existing,
          ...updateData.aptitudeExamUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (updateData.workExperienceId && updateData.workExperienceUpdate) {
      const index = student.workExperience.findIndex(
        (e) => e._id.toString() === updateData.workExperienceId.toString(),
      );
      if (index !== -1) {
        const existing = student.workExperience[index].toObject();
        student.workExperience[index] = {
          ...existing,
          ...updateData.workExperienceUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (
      updateData.personalDetailsRemarkId &&
      updateData.personalDetailsRemarksUpdate
    ) {
      const index = student.personalDetailsRemarks.findIndex(
        (e) =>
          e._id.toString() === updateData.personalDetailsRemarkId.toString(),
      );
      if (index !== -1) {
        const existing = student.personalDetailsRemarks[index].toObject();
        student.personalDetailsRemarks[index] = {
          ...existing,
          ...updateData.personalDetailsRemarksUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (updateData.emergencyDetailsId && updateData.emergencyDetailsUpdate) {
      const index = student.emergencyDetails.findIndex(
        (e) => e._id.toString() === updateData.emergencyDetailsId.toString(),
      );
      if (index !== -1) {
        const existing = student.emergencyDetails[index].toObject();
        student.emergencyDetails[index] = {
          ...existing,
          ...updateData.emergencyDetailsUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }

    if (Array.isArray(updateData.interestedCourseDetails)) {
      const tasks = updateData.interestedCourseDetails.map(async (item) => {
        if (!item._id) {
          item.applicationId = await getNextSequence("applicationId", "AI");

          if (student?.purposeDetails?.preferredCountry[0] !== "Finland") {
            item.status = "Under Verification";

            // Fetch institute and course in parallel
            const [institute, course, recipients] = await Promise.all([
              Institute.findById(item.institute),
              Course.findById(item.course),
              getEmailRecipient(student),
            ]);

            const universityName =
              institute?.instituteName || "University Name";
            const courseName = course?.programName || "Course Name";

            // Fire-and-forget background tasks
            (async () => {
              try {
                if (userType !== "B2B Admin" && userType !== "B2B Member") {
                  await Promise.all([
                    ...recipients.map(({ recipientEmail, recipientType }) =>
                      sendCourseSelectionEmail(
                        recipientEmail,
                        student.name,
                        universityName,
                        courseName,
                        recipientType,
                        student.studentId,
                      ),
                    ),
                    sendSingleMessage({
                      to: student.contact,
                      templateName: "course_selection_underway",
                      fromNumberId: "917359266930",
                      languageCode: "en",
                      parameters: {
                        body: [student.name, universityName, courseName],
                      },
                    }),
                  ]);
                }
              } catch (bgError) {
                console.error(
                  `Background task failed for applicationId: ${item.applicationId}`,
                  bgError,
                );
              }
            })();
          }
        }
      });

      // Await all tasks to complete data mutation before saving
      await Promise.all(tasks);

      updateData.interestedCourseDetails =
        updateData.interestedCourseDetails.map((item) => {
          if (item.portalDetails?.applicationType) {
            item.portalDetails.applicationType = new mongoose.Types.ObjectId(
              item.portalDetails.applicationType,
            );
          }
          return item;
        });

      handleSubDocs(
        updateData.interestedCourseDetails,
        student.interestedCourseDetails,
        "interestedCourseDetails",
      );
    }

    let emailInfo = null;
    if (updateData.interestedCourseId && updateData.interestedCourseUpdate) {
      const index = student.interestedCourseDetails.findIndex(
        (e) => e._id.toString() === updateData.interestedCourseId.toString(),
      );
      if (index !== -1) {
        const existing = student.interestedCourseDetails[index].toObject();

        const updatedEntry = {
          ...existing,
          ...updateData.interestedCourseUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };

        const typeOfApplication = updatedEntry.typeOfApplication;
        const statusRequired = [
          "Tailormade",
          "Join",
          "Rolling",
          "Separate",
        ].includes(typeOfApplication);

        let statusToSet = null;

        if (statusRequired) {
          let shouldSetStatus = false;

          if (typeOfApplication !== "Tailormade") {
            // Only if there's no status set already
            if (!updatedEntry.status || updatedEntry.status === "") {
              shouldSetStatus = true;
            }
          }

          if (shouldSetStatus) {
            let status = await InterestedCourseStatus.findOne({
              name: "Under Verification",
            });

            if (!status) {
              status = await InterestedCourseStatus.create({
                name: "Under Verification",
              });
            }

            statusToSet = status.name;
          }
        }

        if (
          updatedEntry.status === "Under Verification" &&
          updateData.interestedCourseUpdate.applicationSubmissionForm ===
            "Uploaded"
        ) {
          let status = await InterestedCourseStatus.findOne({
            name: "Application Submitted",
          });

          if (!status) {
            status = await InterestedCourseStatus.create({
              name: "Application Submitted",
            });
          }

          statusToSet = status.name;
        }

        if (updateData.interestedCourseUpdate.interviewScheduling) {
          // Set Status
          let status = await InterestedCourseStatus.findOne({
            name: "Interview Scheduled",
          });
          if (!status) {
            status = await InterestedCourseStatus.create({
              name: "Interview Scheduled",
            });
          }
          statusToSet = status.name;

          const interviewData =
            updateData.interestedCourseUpdate.interviewScheduling;

          let interviewType = "";
          let dateTime = "";
          let mode = "";
          let meetingLink = "";
          let rounds = []; // for multi-round

          // ----------------------------
          // SINGLE INTERVIEW
          // ----------------------------
          if (interviewData.type === "single") {
            interviewType = "Single Interview";
            dateTime = interviewData.singleInterview?.dateTime || "N/A";
            mode = interviewData.singleInterview?.mode || "N/A";
            meetingLink = interviewData.singleInterview?.meetingLink || "";
          }

          // ----------------------------
          // MULTI ROUND INTERVIEW
          // ----------------------------
          if (interviewData.type === "multi") {
            interviewType = "Multi-Round Interview";
            rounds = interviewData.multiRoundInterview || [];
          }

          // Get recipients
          const recipients = await getEmailRecipient(student);

          // Populate course details
          const populatedStudent = await student.populate([
            {
              path: "interestedCourseDetails.course",
              select: "programName university",
              populate: {
                path: "university",
                select: "instituteName",
              },
            },
            {
              path: "interestedCourseDetails.campus",
              select: "campus country",
            },
          ]);

          const updatedCourseDetail =
            populatedStudent.interestedCourseDetails.find(
              (d) => d._id.toString() === updateData.interestedCourseId,
            );

          const universityName =
            updatedCourseDetail?.course?.university?.instituteName ||
            "the university";
          const courseName =
            updatedCourseDetail?.course?.programName || "the course";

          // --------------------------------------
          // SEND EMAIL ASYNC (non-blocking)
          // --------------------------------------
          (async () => {
            try {
              // if (userType !== "B2B Admin" && userType !== "B2B Member") {
              await Promise.all(
                recipients.map(({ recipientEmail, recipientType }) =>
                  sendInterviewScheduledEmail(
                    recipientEmail,
                    student.name,
                    courseName,
                    recipientType,
                    student.studentId,
                    interviewType,
                    interviewData.type === "single" ? dateTime : null,
                    interviewData.type === "single" ? mode : null,
                    interviewData.type === "single" ? meetingLink : null,
                    rounds, // send full rounds array
                  ),
                ),
              );
              // }
            } catch (err) {
              console.error("Interview Scheduled email error:", err);
            }
          })();
        }

        // if (updateData.interestedCourseUpdate.offerLetterReceived) {
        //   const [existingStatus, recipients, populatedStudent] =
        //     await Promise.all([
        //       InterestedCourseStatus.findOne({ name: "Offer Letter Received" }),
        //       getEmailRecipient(student),
        //       student.populate({
        //         path: "interestedCourseDetails.institute interestedCourseDetails.course",
        //         select: "instituteName programName",
        //       }),
        //     ]);

        //   let status = existingStatus;
        //   if (!status) {
        //     status = await InterestedCourseStatus.create({
        //       name: "Offer Letter Received",
        //     });
        //   }

        //   statusToSet = status.name;

        //   const updatedCourseDetail =
        //     populatedStudent.interestedCourseDetails.find(
        //       (d) => d._id.toString() === updateData.interestedCourseId
        //     );

        //   const universityName =
        //     updatedCourseDetail?.institute?.instituteName || "the university";
        //   const courseName =
        //     updatedCourseDetail?.course?.programName || "the course";

        //   // Fire-and-forget background processing for emails and messages
        //   (async () => {
        //     try {
        //       if (userType !== "B2B Admin" && userType !== "B2B Member") {
        //         await Promise.all(
        //           recipients.map(({ recipientEmail, recipientType }) =>
        //             sendOfferLetterReceivedEmail(
        //               recipientEmail,
        //               student.name,
        //               universityName,
        //               courseName,
        //               recipientType,
        //               student.studentId
        //             )
        //           )
        //         );

        //         await sendSingleMessage({
        //           to: student.contact,
        //           templateName: "offer_letter_received",
        //           fromNumberId: "917359266930",
        //           languageCode: "en",
        //           parameters: {
        //             body: [student.name, universityName, courseName],
        //           },
        //         });
        //       }
        //     } catch (bgError) {
        //       console.error(
        //         "Offer Letter Received email/message failed:",
        //         bgError
        //       );
        //     }
        //   })();
        // }

        if (updateData.interestedCourseUpdate.offerLetterReceived) {
          const offerLetterType =
            updateData.interestedCourseUpdate.offerLetterType || "Offer Letter";

          const [existingStatus, recipients, populatedStudent] =
            await Promise.all([
              InterestedCourseStatus.findOne({ name: "Offer Letter Received" }),
              getEmailRecipient(student),
              student.populate({
                path: "interestedCourseDetails.course",
                select: "instituteName programName",
              }),
            ]);

          let status = existingStatus;
          if (!status) {
            status = await InterestedCourseStatus.create({
              name: "Offer Letter Received",
            });
          }

          statusToSet = status.name;

          const updatedCourseDetail =
            populatedStudent.interestedCourseDetails.find(
              (d) => d._id.toString() === updateData.interestedCourseId,
            );

          const courseName =
            updatedCourseDetail?.course?.programName || "the course";

          // -------------------------------------------------------
          // 🔥 OFFER LETTER TYPE → DOCUMENT NAME MAPPING
          // -------------------------------------------------------
          let finalOfferLetterDocName = "Offer Letter";

          if (offerLetterType?.toLowerCase() === "conditional") {
            finalOfferLetterDocName = "Conditional Offer Letter";
          } else if (offerLetterType?.toLowerCase() === "unconditional") {
            finalOfferLetterDocName = "Unconditional Offer Letter";
          }

          // -------------------------------------------------------
          // 🔥 FIND ACCEPTED OFFER LETTER DOCUMENT
          // -------------------------------------------------------
          const offerLetterDoc = student.uploadedDocumentDetails?.find(
            (doc) =>
              doc.customDocumentName?.toLowerCase() ===
              finalOfferLetterDocName.toLowerCase(),
          );

          const offerLetterLink = offerLetterDoc
            ? `${process.env.BASE_URL}/${offerLetterDoc.filePath}`
            : null;

          // -------------------------------------------------------
          // 🔥 FIND REJECTION DOCUMENT (only if reject type)
          // -------------------------------------------------------
          let rejectionLetterDoc = null;
          let rejectionLetterLink = null;

          if (offerLetterType?.toLowerCase() === "reject") {
            rejectionLetterDoc = student.uploadedDocumentDetails?.find(
              (doc) =>
                doc.customDocumentName?.toLowerCase() === "rejection letter",
            );

            rejectionLetterLink = rejectionLetterDoc
              ? `${process.env.BASE_URL}/${rejectionLetterDoc.filePath}`
              : null;
          }

          // -------------------------------------------------------
          // 🔥 SPECIAL CASE: OFFER LETTER REJECT
          // -------------------------------------------------------
          if (offerLetterType?.toLowerCase() === "reject") {
            let offerTypeForEmail = "Offer Letter";
            if (finalOfferLetterDocName === "Conditional Offer Letter")
              offerTypeForEmail = "Conditional Offer Letter";
            if (finalOfferLetterDocName === "Unconditional Offer Letter")
              offerTypeForEmail = "Unconditional Offer Letter";

            await Promise.all(
              recipients.map(({ recipientEmail, recipientType }) =>
                sendOfferLetterRejectedEmail(
                  recipientEmail,
                  student.name,
                  courseName,
                  recipientType,
                  student.studentId,
                  offerTypeForEmail,
                  rejectionLetterLink, // <-- include link
                ),
              ),
            );
          }

          // -------------------------------------------------------
          // 🔥 NORMAL OFFER LETTER RECEIVED (Accepted case)
          // -------------------------------------------------------
          const acceptToken = crypto.randomBytes(32).toString("hex");

          await studentApplication.updateOne(
            { _id: student._id },
            { $set: { offerLetterAcceptToken: acceptToken } },
          );

          const acceptUrl = `${process.env.BASE_URL}studentApplication/statusUpdateFromEmail?type=Accepted&token=${acceptToken}&studentId=${student._id}&courseId=${updateData.interestedCourseId}`;
          const rejectUrl = `${process.env.BASE_URL}studentApplication/statusUpdateFromEmail?type=Declined&token=${acceptToken}&studentId=${student._id}&courseId=${updateData.interestedCourseId}`;

          (async () => {
            try {
              // if (userType !== "B2B Admin" && userType !== "B2B Member") {
              await Promise.all(
                recipients.map(({ recipientEmail, recipientType }) =>
                  sendOfferLetterReceivedEmail(
                    recipientEmail,
                    student.name,
                    courseName,
                    recipientType,
                    student.studentId,
                    offerLetterType,
                    offerLetterLink,
                    acceptUrl,
                    rejectUrl,
                  ),
                ),
              );

              await sendSingleMessage({
                to: student.contact,
                templateName: "offer_letter_received",
                fromNumberId: "917359266930",
                languageCode: "en",
                parameters: {
                  body: [student.name, courseName],
                },
              });
              // }
            } catch (bgError) {
              console.error(
                "Offer Letter Received email/message failed:",
                bgError,
              );
            }
          })();
        }

        if (updateData.interestedCourseUpdate.offerLetterAcceptedByStudent) {
          let statusName = null;

          if (
            updateData.interestedCourseUpdate.offerLetterAcceptedByStudent ===
            "Accepted"
          ) {
            statusName = "Offer Letter Accepted";
          } else if (
            updateData.interestedCourseUpdate.offerLetterAcceptedByStudent ===
            "Rejected"
          ) {
            statusName = "Offer Letter Rejected";
          } else if (
            updateData.interestedCourseUpdate.offerLetterAcceptedByStudent ===
            "Declined"
          ) {
            statusName = "Offer Letter Declined";
          }

          if (statusName) {
            let status = await InterestedCourseStatus.findOne({
              name: statusName,
            });

            if (!status) {
              status = await InterestedCourseStatus.create({
                name: statusName,
              });
            }

            statusToSet = status.name;
          }
        }

        if (
          updateData.interestedCourseUpdate?.instituteFeePayment?.feeStatus ===
          "paid"
        ) {
          let status = await InterestedCourseStatus.findOne({
            name: "Institute Fee Paid",
          });
          if (!status) {
            status = await InterestedCourseStatus.create({
              name: "Institute Fee Paid",
            });
          }
          statusToSet = status.name;
        }

        if (
          updateData.interestedCourseUpdate?.depositPayment?.feeStatus ===
          "paid"
        ) {
          let status = await InterestedCourseStatus.findOne({
            name: "Deposit Fee Paid",
          });

          if (!status) {
            status = await InterestedCourseStatus.create({
              name: "Deposit Fee Paid",
            });
          }
          statusToSet = status.name;
        }

        if (statusToSet) {
          updatedEntry.status = statusToSet;

          emailInfo = {
            status: statusToSet,
            applicationId: updatedEntry.applicationId,
            studentId: student.studentId,
            updatedAt: student.updatedAt,
            name: student.name,
            recipients: await getEmailRecipient(student),
          };
        }

        student.interestedCourseDetails[index] = updatedEntry;

        const changedFields = [];
        const checkableFields = [
          "institute",
          "campus",
          "course",
          "intakeMonth",
          "intakeYear",
        ];

        checkableFields.forEach((field) => {
          if (
            updateData.interestedCourseUpdate[field] &&
            updateData.interestedCourseUpdate[field].toString() !==
              existing[field]?.toString()
          ) {
            changedFields.push(field);
          }
        });

        if (
          changedFields.length > 0 &&
          ["B2B Admin", "B2B Member"].includes(userType)
        ) {
          let usersList = [];

          if (student.userAllocationDetails?.length > 0) {
            const allocationUserIds = student.userAllocationDetails.map(
              (a) => a.user,
            );

            const allocationUsers = await User.find({
              _id: { $in: allocationUserIds },
            });
            usersList.push(...allocationUsers);

            usersList = usersList.filter(
              (u, i, self) =>
                i ===
                self.findIndex((x) => x._id.toString() === u._id.toString()),
            );
          }

          const bccEmails = usersList.map((u) => u.email).filter(Boolean);

          if (bccEmails.length > 0) {
            const finalDocName = `${changedFields.join(", ")}`;

            setImmediate(() => {
              sendInterestedCourseUpdateEmail(
                bccEmails,
                student.name,
                userName, // B2B partner
                userName, // sender
                userType,
                finalDocName,
                null,
              ).catch((err) => {
                console.error(
                  "Error sending Interested Course update email:",
                  err,
                );
              });
            });
          }
        }
      }
    }

    // Handle uploaded document details
    if (
      updateData.uploadedDocumentDetails &&
      Array.isArray(updateData.uploadedDocumentDetails)
    ) {
      for (const doc of updateData.uploadedDocumentDetails) {
        if (doc._id) {
          // This is an update to an existing document
          const existingIndex = student.uploadedDocumentDetails.findIndex(
            (existingDoc) => existingDoc._id.toString() === doc._id.toString(),
          );

          if (existingIndex !== -1) {
            // Partial update - only update the fields that are provided
            const existingDoc =
              student.uploadedDocumentDetails[existingIndex].toObject();
            student.uploadedDocumentDetails[existingIndex] = {
              ...existingDoc, // Keep all existing fields
              ...doc, // Apply only the fields that are provided in the update
              created_by: existingDoc.created_by,
              createdByName: existingDoc.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };
          }
        } else {
          // This is a new document, push it
          student.uploadedDocumentDetails?.push({
            ...doc,
            created_by: userId,
            createdByName: userName,
          });
        }
      }
    }

    // Direct subdocument update by ID
    if (updateData.documentId && updateData.documentUpdate) {
      const index = student.uploadedDocumentDetails.findIndex(
        (doc) => doc._id.toString() === updateData.documentId.toString(),
      );

      if (index !== -1) {
        const existing = student.uploadedDocumentDetails[index].toObject();

        if (
          updateData.documentUpdate?.status &&
          updateData.documentUpdate.status !== existing.status
        ) {
          await trackStudentEvents(
            oldStudent,
            {
              ...student.toObject(),
              _triggeredDocumentStatus: {
                documentId: existing._id,
                documentName:
                  existing.customDocumentName || existing.documentName,
                oldStatus: existing.status,
                newStatus: updateData.documentUpdate.status,
                remarks: updateData.documentUpdate.remarks || null,
              },
            },
            {
              _docStatusUpdate: true,
            },
            userId,
            userName,
          );
        }

        if (updateData.documentUpdate.status === "Reupload") {
          existing.filePath = "";

          const getDocumentName = await Documents.findById(
            existing.documentName,
          );
          const getDocumentType =
            (await DocumentTypes.findById(existing.documentType)) ||
            existing.documentType;

          let recipientEmail = student.email;
          let recipientType = "Student";

          if (student.created_by_type === "B2B Admin") {
            const b2bAdmin = await B2BAdmin.findById(student.created_by).select(
              "email",
            );
            if (b2bAdmin?.email) {
              recipientEmail = b2bAdmin.email;
              recipientType = "B2B";
            }
          } else if (student.created_by_type === "B2B Member") {
            const b2bMember = await B2BMember.findById(
              student.created_by,
            ).select("email");
            if (b2bMember?.email) {
              recipientEmail = b2bMember.email;
              recipientType = "B2B";
            }
          }

          await sendDocumentReuploadEmail(
            recipientEmail,
            getDocumentName?.name,
            getDocumentType?.name || "",
            student.name,
            student.studentId,
            recipientType,
          );
        }

        if (
          existing.status === "Reupload" &&
          updateData.documentUpdate.filePath
        ) {
          existingfilePath = updateData.documentUpdate;
        }

        student.uploadedDocumentDetails[index] = {
          ...existing,
          ...updateData.documentUpdate,
          created_by: existing.created_by,
          createdByName: existing.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };
      }
    }
    const sendAllocationEmail = async (userId, student) => {
      try {
        const user = await User.findById(userId).populate("role", "name");

        if (user) {
          const studentName = `${student.name}`;
          const b2bPartnerName =
            student.b2bCompany || student.createdByName || "B2B Partner";
          const senderName = b2bPartnerName;
          const companyName = "Kurm Infotech";

          await sendNewStudentApplicationEmail(
            user.email,
            user.name,
            studentName,
            b2bPartnerName,
            senderName,
            companyName,
            user.role.name,
          );
        }
      } catch (error) {
        console.error("Error sending allocation email:", error);
      }
    };

    // user allocation handle
    // if (
    //   updateData.userAllocationDetails &&
    //   Array.isArray(updateData.userAllocationDetails)
    // ) {
    //   for (const userDetail of updateData.userAllocationDetails) {
    //     if (userDetail._id) {
    //       const existingIndex = student.userAllocationDetails.findIndex(
    //         (e) => e._id.toString() === userDetail._id.toString()
    //       );
    //       if (existingIndex !== -1) {
    //         const existingData =
    //           student.userAllocationDetails[existingIndex].toObject();
    //         student.userAllocationDetails[existingIndex] = {
    //           ...existingData,
    //           ...userDetail,
    //           created_by: existingData.created_by,
    //           createdByName: existingData.createdByName,
    //           updated_by: userId,
    //           updatedByName: userName,
    //         };
    //       }
    //     } else {
    //       student.userAllocationDetails?.push({
    //         ...userDetail,
    //         created_by: userId,
    //         createdByName: userName,
    //       });

    //       await sendAllocationEmail(userDetail.user, student);
    //     }
    //   }
    // }

    // if (updateData.userAllocationId && updateData.userAllocationUpdate) {
    //   const index = student.userAllocationDetails.findIndex(
    //     (e) => e._id.toString() === updateData.userAllocationId.toString()
    //   );

    //   if (index !== -1) {
    //     const existingData = student.userAllocationDetails[index].toObject();

    //     student.userAllocationDetails[index] = {
    //       ...existingData,
    //       ...updateData.userAllocationUpdate,
    //       created_by: existingData.created_by,
    //       createdByName: existingData.createdByName,
    //       updated_by: userId,
    //       updatedByName: userName,
    //     };
    //   }
    // }
    if (
      updateData.userAllocationDetails &&
      Array.isArray(updateData.userAllocationDetails)
    ) {
      for (const userDetail of updateData.userAllocationDetails) {
        if (userDetail._id) {
          // update existing allocation
          const existingIndex = student.userAllocationDetails.findIndex(
            (e) => e._id.toString() === userDetail._id.toString(),
          );

          if (existingIndex !== -1) {
            const existingData =
              student.userAllocationDetails[existingIndex].toObject();
            const oldUserId = existingData.user; // previous allocated user

            student.userAllocationDetails[existingIndex] = {
              ...existingData,
              ...userDetail,
              created_by: existingData.created_by,
              createdByName: existingData.createdByName,
              updated_by: userId,
              updatedByName: userName,
            };

            const updatedUserId = userDetail.user;

            // ✅ If user changed, handle notifications
            if (oldUserId.toString() !== updatedUserId.toString()) {
              // 1️⃣ Delete old notifications
              await notificationModel.deleteMany({
                recipientId: oldUserId,
                studentId: student._id,
                notificationType: "user_allocation",
              });

              // 2️⃣ Emit deletion notification to old user
              const deletionNotification = {
                recipientId: oldUserId,
                message: "Your allocation to this student has been removed.",
                studentId: student._id,
                createdBy: userId,
                notificationType: "user_allocation",
              };
              const notificationNamespace = getNotificationNamespace();
              if (notificationNamespace) {
                notificationNamespace
                  .to(String(oldUserId))
                  .emit("receive_notification", deletionNotification);
              }

              // 3️⃣ Create + emit new notification for updated user
              if (updatedUserId) {
                const newNotification = await notificationModel.create({
                  recipientId: updatedUserId,
                  message: `You have been allocated to student "${student.name}" by ${userName}.`,
                  studentId: student._id,
                  createdBy: userId,
                  notificationType: "user_allocation",
                });

                if (notificationNamespace) {
                  notificationNamespace
                    .to(String(updatedUserId))
                    .emit("receive_notification", newNotification);
                }
              }
            }
          }
        } else {
          // new allocation
          student.userAllocationDetails?.push({
            ...userDetail,
            created_by: userId,
            createdByName: userName,
          });

          // 1️⃣ Send email
          await sendAllocationEmail(userDetail.user, student);

          // 2️⃣ Create notification
          const newNotification = await notificationModel.create({
            recipientId: userDetail.user, // allocated userId
            message: `You have been allocated to student "${student.name}" by ${userName}.`,
            studentId: student._id,
            createdBy: userId,
            notificationType: "user_allocation",
          });

          // 3️⃣ Emit notification
          const notificationNamespace = getNotificationNamespace();
          if (notificationNamespace) {
            notificationNamespace
              .to(String(userDetail.user)) // ensure same format as socket join
              .emit("receive_notification", newNotification);
          } else {
            console.warn("⚠️ Notification namespace not available");
          }
        }
      }
    }

    // Separate update case (legacy handling)
    if (updateData.userAllocationId && updateData.userAllocationUpdate) {
      const index = student.userAllocationDetails.findIndex(
        (e) => e._id.toString() === updateData.userAllocationId.toString(),
      );

      if (index !== -1) {
        const existingData = student.userAllocationDetails[index].toObject();
        const oldUserId = existingData.user;

        student.userAllocationDetails[index] = {
          ...existingData,
          ...updateData.userAllocationUpdate,
          created_by: existingData.created_by,
          createdByName: existingData.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };

        const updatedUserId = updateData.userAllocationUpdate.user;

        // ✅ Handle user change
        if (
          updatedUserId &&
          oldUserId.toString() !== updatedUserId.toString()
        ) {
          // Delete old notifications
          await notificationModel.deleteMany({
            recipientId: oldUserId,
            studentId: student._id,
            notificationType: "user_allocation",
          });

          // Emit deletion notification
          const deletionNotification = {
            recipientId: oldUserId,
            message: "Your allocation to this student has been removed.",
            studentId: student._id,
            createdBy: userId,
            notificationType: "user_allocation",
          };
          const notificationNamespace = getNotificationNamespace();
          if (notificationNamespace) {
            notificationNamespace
              .to(String(oldUserId))
              .emit("receive_notification", deletionNotification);
          }

          // Create + emit new notification
          const newNotification = await notificationModel.create({
            recipientId: updatedUserId,
            message: `You have been allocated to student "${student.name}" by ${userName}.`,
            studentId: student._id,
            createdBy: userId,
            notificationType: "user_allocation",
          });

          if (notificationNamespace) {
            notificationNamespace
              .to(String(updatedUserId))
              .emit("receive_notification", newNotification);
          }
        }
      }
    }

    // //visa allocation handle

    // if (
    //   updateData.visaAllocationDetails &&
    //   Array.isArray(updateData.visaAllocationDetails)
    // ) {
    //   for (const userDetail of updateData.visaAllocationDetails) {
    //     student.visaAllocationDetails?.push({
    //       ...userDetail,
    //       created_by: userId,
    //       createdByName: userName,
    //     });

    //     if (student.visaAllocationDetails.length === 1) {
    //       let visaStatus = await VisaStatus.findOne({
    //         name: "Visa Process Started",
    //       });
    //       if (!visaStatus) {
    //         visaStatus = await VisaStatus.create({
    //           name: "Visa Process Started",
    //         });
    //       }

    //       student.visaApplicationDetails.status = visaStatus.name;
    //     }
    //   }
    // }

    // if (updateData.visaAllocationId && updateData.visaAllocationUpdate) {
    //   const index = student.visaAllocationDetails.findIndex(
    //     (e) => e._id.toString() === updateData.visaAllocationId.toString()
    //   );

    //   if (index !== -1) {
    //     const existingData = student.visaAllocationDetails[index].toObject();

    //     student.visaAllocationDetails[index] = {
    //       ...existingData,
    //       ...updateData.visaAllocationUpdate,
    //       created_by: existingData.created_by,
    //       createdByName: existingData.createdByName,
    //       updated_by: userId,
    //       updatedByName: userName,
    //     };
    //   }
    // }

    // visa allocation handle
    if (
      updateData.visaAllocationDetails &&
      Array.isArray(updateData.visaAllocationDetails)
    ) {
      const wasEmpty =
        !student.visaApplicationDetails ||
        !student.visaApplicationDetails.status;

      for (const userDetail of updateData.visaAllocationDetails) {
        student.visaAllocationDetails?.push({
          ...userDetail,
          created_by: userId,
          createdByName: userName,
        });

        // 1️⃣ First allocation: update visa status

        if (wasEmpty) {
          if (student.visaAllocationDetails.length === 1) {
            let visaStatus = await VisaStatus.findOne({
              name: "Visa Process Started",
            });
            if (!visaStatus) {
              visaStatus = await VisaStatus.create({
                name: "Visa Process Started",
              });
            }

            student.visaApplicationDetails.status = visaStatus.name;
            student.markModified("visaApplicationDetails");
          }
        }

        // 2️⃣ Create notification for allocated user
        const newNotification = await notificationModel.create({
          recipientId: userDetail.user, // allocated userId
          message: `You have been allocated to visa process for student "${student.name}" by ${userName}.`,
          studentId: student._id,
          createdBy: userId,
          notificationType: "visa_allocation",
        });

        // 3️⃣ Emit notification
        const notificationNamespace = getNotificationNamespace();
        if (notificationNamespace) {
          notificationNamespace
            .to(String(userDetail.user))
            .emit("receive_notification", newNotification);
        }
      }
    }

    // 4️⃣ Handle Update Case
    if (updateData.visaAllocationId && updateData.visaAllocationUpdate) {
      const index = student.visaAllocationDetails.findIndex(
        (e) => e._id.toString() === updateData.visaAllocationId.toString(),
      );

      if (index !== -1) {
        const existingData = student.visaAllocationDetails[index].toObject();
        const oldUserId = existingData.user; // previous allocated user

        // Update allocation details
        student.visaAllocationDetails[index] = {
          ...existingData,
          ...updateData.visaAllocationUpdate,
          created_by: existingData.created_by,
          createdByName: existingData.createdByName,
          updated_by: userId,
          updatedByName: userName,
        };

        const updatedUserId = updateData.visaAllocationUpdate.user;

        // 4a. Delete old notification
        await notificationModel.deleteMany({
          recipientId: oldUserId,
          studentId: student._id,
          notificationType: "visa_allocation",
        });

        const newNotification = {
          recipientId: updatedUserId,
          message: "deleted notification",
          studentId: student._id,
          createdBy: userId,
          notificationType: "visa_allocation",
        };
        const notificationNamespace = getNotificationNamespace();
        if (notificationNamespace) {
          notificationNamespace
            .to(String(oldUserId))
            .emit("receive_notification", newNotification);
        }

        // 4b. Create + emit new notification for updated user
        if (updatedUserId) {
          const newNotification = await notificationModel.create({
            recipientId: updatedUserId,
            message: `You have been allocated to visa process for student "${student.name}" by ${userName}.`,
            studentId: student._id,
            createdBy: userId,
          });

          const notificationNamespace = getNotificationNamespace();
          if (notificationNamespace) {
            notificationNamespace
              .to(String(updatedUserId))
              .emit("receive_notification", newNotification);
          }
        }
      }
    }

    // visa application handle

    if (updateData.visaApplicationDetails) {
      const countryType =
        updateData.visaApplicationDetails.countryType || "BASE";

      if (!student.visaApplicationDetails) {
        student.visaApplicationDetails = {
          ...updateData.visaApplicationDetails,
          created_by: userId,
          createdByName: userName,
        };
      } else {
        student.visaApplicationDetails = {
          ...student.visaApplicationDetails,
          ...updateData.visaApplicationDetails,
          created_by: student.visaApplicationDetails.created_by || userId,
          createdByName:
            student.visaApplicationDetails.createdByName || userName,
          updated_by: userId,
          updatedByName: userName,
        };
      }

      // if (updateData.visaApplicationDetails?.feeStatus === "Paid") {
      //   let visaStatus = await VisaStatus.findOne({ name: "Visa Fee Paid" });
      //   if (!visaStatus) {
      //     visaStatus = await VisaStatus.create({ name: "Visa Fee Paid" });
      //   }
      //   student.visaApplicationDetails.status = visaStatus.name;
      // }

      // if (updateData.visaApplicationDetails?.biometricsUploaded) {
      //   let visaStatus = await VisaStatus.findOne({
      //     name: "Biometrics Completed",
      //   });
      //   if (!visaStatus) {
      //     visaStatus = await VisaStatus.create({
      //       name: "Biometrics Completed",
      //     });
      //   }

      //   student.visaApplicationDetails.status = visaStatus.name;
      // }

      if (updateData.visaApplicationDetails?.RP_decisionDate) {
        student.visaApplicationDetails.RP_decisionDate.created_by = userId;
        student.visaApplicationDetails.RP_decisionDate.createdByName = userName;
      }

      // if (updateData.visaApplicationDetails?.VFSAppointmentDateTime) {
      //   let visaStatus = await VisaStatus.findOne({
      //     name: "VFS Date Booked",
      //   });
      //   if (!visaStatus) {
      //     visaStatus = await VisaStatus.create({ name: "VFS Date Booked" });
      //   }

      //   student.visaApplicationDetails.status = visaStatus.name;
      // }
      if (updateData.visaApplicationDetails?.visaFileHandover) {
        student.visaApplicationDetails.visaFileHandover.created_by = userId;
        student.visaApplicationDetails.visaFileHandover.createdByName =
          userName;
      }

      if (updateData.visaApplicationDetails?.visaFileSubmission) {
        student.visaApplicationDetails.visaFileSubmission.updated_by = userId;
        student.visaApplicationDetails.visaFileSubmission.updatedByName =
          userName;

        // if (
        //   updateData.visaApplicationDetails?.visaFileSubmission
        //     ?.finalChecklistConfirmed &&
        //   updateData.visaApplicationDetails?.visaFileSubmission?.fileSubmission
        //     ?.isSubmitted &&
        //   updateData.visaApplicationDetails?.visaFileSubmission
        //     ?.submissionDateRecorded
        // ) {
        //   let visaStatus = await VisaStatus.findOne({ name: "Visa Filed" });
        //   if (!visaStatus) {
        //     visaStatus = await VisaStatus.create({ name: "Visa Filed" });
        //   }

        //   student.visaApplicationDetails.status = visaStatus.name;
        // }
      }

      if (updateData.visaApplicationDetails?.visaOutcomeStatus) {
        // let visaStatus = await VisaStatus.findOne({
        //   name: "Visa Decision Updated also upload visa decision proof",
        // });
        // if (!visaStatus) {
        //   visaStatus = await VisaStatus.create({
        //     name: "Visa Decision Updated also upload visa decision proof",
        //   });
        // }

        student.visaApplicationDetails.visaOutcomeDate = new Date();
        // student.visaApplicationDetails.status = visaStatus.name;
        // const recipients = await getEmailRecipient(student);

        // for (const { recipientEmail, recipientType } of recipients) {
        //   await sendVisaStatusUpdateEmail(
        //     recipientEmail,
        //     student.studentId,
        //     student.visaApplicationDetails.visaOutcomeStatus,
        //     student.updatedAt,
        //     student.name,
        //     recipientType
        //   );
        // }

        // if (
        //   updateData.visaApplicationDetails.visaOutcomeStatus === "Approved"
        // ) {
        //   // Step 1: Get role IDs for "Super Admin" and "Accountant"
        //   const roles = await Role.find({
        //     name: { $in: ["Super Admin", "Accountant"] },
        //   }).select("_id");
        //   const roleIds = roles.map((role) => role._id);

        //   // Step 2: Get users with those role IDs
        //   const notifyUsers = await User.find({
        //     role: { $in: roleIds },
        //     email: { $ne: null },
        //   }).select("email");

        //   // Step 3: Send mail to each
        //   for (const user of notifyUsers) {
        //     await sendNewEligibleStudentEmail(
        //       user.email,
        //       student.studentId,
        //       "Visa Approved",
        //       student.name
        //     );
        //   }
        // }
      }

      if (updateData.visaApplicationDetails?.remarks) {
        student.visaApplicationDetails.remarks.created_by = userId;
        student.visaApplicationDetails.remarks.createdByName = userName;
      }

      if (updateData.visaApplicationDetails?.status) {
        student.visaApplicationDetails.status =
          updateData.visaApplicationDetails?.status;
      }
    }

    student.updated_by = userId;
    student.updatedByName = userName;

    if (
      updateData.isSubmit === true &&
      (student.isSubmit === false || student.isSubmit === undefined)
    ) {
      const studentName = `${student.name}`;
      const b2bPartnerName =
        student.b2bCompany || student.createdByName || "B2B Partner";
      const senderName = b2bPartnerName;
      const companyName = "Kurm Infotech";

      const usersToEmail = [];

      let targetRoleNames = [
        "Super Admin",
        "Head of op",
        "Branch Manager",
        "Head of B2B",
        "Head of Admission",
        "Team Leader - Admission (Finland)",
        "Team Leader - Admission (Europe)",
      ];

      // Remove Branch Manager if created_by_type is B2B
      if (["B2B Admin", "B2B Member"].includes(student.created_by_type)) {
        targetRoleNames = targetRoleNames.filter(
          (role) => role !== "Branch Manager",
        );
      }
      const targetRoles = await Role.find({
        name: { $in: targetRoleNames },
      });

      if (targetRoles.length > 0) {
        const roleIds = targetRoles.map((role) => role._id);

        const roleBasedUsers = await User.find({
          role: { $in: roleIds },
        });

        usersToEmail.push(...roleBasedUsers);
      }

      // Get users from userAllocationDetails
      if (
        student.userAllocationDetails &&
        student.userAllocationDetails.length > 0
      ) {
        const allocationUserIds = student.userAllocationDetails.map(
          (allocation) => allocation.user,
        );

        const allocationUsers = await User.find({
          _id: { $in: allocationUserIds },
        });

        usersToEmail.push(...allocationUsers);
      }

      // Remove duplicates
      const uniqueUsers = usersToEmail.filter(
        (user, index, self) =>
          index ===
          self.findIndex((u) => u._id.toString() === user._id.toString()),
      );

      // Send emails to all unique users
      // await Promise.all(
      //   uniqueUsers.map(async (user) => {
      //     try {
      //       await sendNewStudentApplicationEmail(
      //         user.email,
      //         user.name,
      //         studentName,
      //         b2bPartnerName,
      //         senderName,
      //         companyName,
      //         null
      //       );
      //     } catch (err) {
      //       console.error(`❌ Failed to send student app email to ${user.email}:`, err.message);
      //     }
      //   })
      // );

      const bccList = [...new Set(uniqueUsers.map((u) => u.email))];

      // Send email to all via BCC
      // await sendNewStudentApplicationEmail(
      //   bccList,
      //   studentName,
      //   b2bPartnerName,
      //   senderName,
      //   companyName,
      //   null
      // );
    }

    if (updateData && typeof updateData.isSubmit !== "undefined") {
      // Only update if student's current isSubmit is false
      if (student.isSubmit !== true) {
        student.isSubmit = updateData.isSubmit;

        if (updateData.isSubmit === true) {
          let newStatus = await StudentStatus.findOne({ name: "New" });

          if (!newStatus) {
            newStatus = await StudentStatus.create({
              name: "New",
            });
          }

          student.mainStatus = newStatus._id;
        }
      }
    }

    if (updateData.visaApplicationDetails) {
      const country = student.purposeDetails?.preferredCountry?.[0] || "BASE";
      const newStatus = resolveVisaStatus(
        country,
        updateData.visaApplicationDetails,
      );

      if (newStatus) {
        let visaStatus = await VisaStatus.findOne({ name: newStatus });
        if (!visaStatus) {
          visaStatus = await VisaStatus.create({ name: newStatus });
        }
        student.visaApplicationDetails.status = visaStatus.name;
      }

      // await sendVisaOutcomeMails({
      //   country,
      //   student,
      //   updateVisaData: updateData.visaApplicationDetails,
      // });
    }

    await student.save();

    await student.populate("mainStatus", "name");

    await trackStudentEvents(
      oldStudent,
      student.toObject(),
      updateData,
      userId,
      userName,
    );

    if (updateData.mainStatus) {
      await student.populate("mainStatus", "name");

      const statusName = student.mainStatus?.name;
      const preferredCountry = student.purposeDetails.preferredCountry[0];

      const recipients = await getEmailRecipient(student);

      // Fire-and-forget background task
      (async () => {
        try {
          // Send WhatsApp message once
          const whatsappMessagePromise = sendSingleMessage({
            to: student.contact,
            templateName:
              statusName === "Visa Received"
                ? "visa_approved_received1"
                : statusName === "Visa Denied"
                  ? "visa_decision__regret_to_inform1"
                  : null,
            fromNumberId: "917359266930",
            languageCode: "en",
            parameters: { body: [student.name, preferredCountry] },
          });

          // Only send WhatsApp message if relevant template
          const whatsappMessage = whatsappMessagePromise
            .then((res) => res)
            .catch((err) => {
              console.error("WhatsApp message failed:", err);
            });

          // Send emails to all recipients in parallel
          const emailPromises = recipients.map(
            ({ recipientEmail, recipientType }) => {
              if (statusName === "Visa Received") {
                return sendVisaApprovalEmail(
                  recipientEmail,
                  student.name,
                  preferredCountry,
                  recipientType,
                  student.studentId,
                );
              } else if (statusName === "Visa Denied") {
                return sendVisaRefusalEmail(
                  recipientEmail,
                  student.name,
                  preferredCountry,
                  recipientType,
                  student.studentId,
                );
              } else {
                return sendApplicationStatusUpdateEmail(
                  recipientEmail,
                  null,
                  student.studentId,
                  statusName,
                  student.updatedAt,
                  student.name,
                  recipientType,
                );
              }
            },
          );

          await Promise.all([whatsappMessage, ...emailPromises]);
        } catch (bgError) {
          console.error(
            "Visa status notification background task failed:",
            bgError,
          );
        }
      })();
    }

    return { student, emailInfo };
  },
  statusUpdateFromEmail: async (type, token, studentId, courseId) => {
    const student = await studentApplication.findOne({
      _id: studentId,
    });
    if (!student) {
      return "Invalid or expired link";
    }

    await studentApplication.updateOne(
      { _id: studentId, "interestedCourseDetails._id": courseId },
      {
        $set: {
          "interestedCourseDetails.$.offerLetterAcceptedByStudent": type,
        },
      },
    );

    return "Offer Letter status updated successfully";
  },

  getAll: async (
    page,
    limit,
    searchOnField,
    searchText = "",
    currentUser,
    mainStatus = "",
    branchId,
    showAll = false,
    country,
    followUp,
    b2bId,
    filterUserId,
    updatedOn,
    startDate,
    endDate,
  ) => {
    const populateFields = [
      { path: "purposeDetails.inquiryFor", select: "name" },
      {
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
          { path: "course", select: "programName" },
          { path: "campus", select: "campus" },

          { path: "applicationType", select: "name" },
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

    // const searchOptions = {
    //   searchText,
    //   searchOnField,
    //   searchFields: [
    //     "name",
    //     "contact",
    //     "email",
    //     "purposeDetails.preferredCountry",
    //     "studentId",
    //   ],
    // };

    const baseSearchFields = [
      "name",
      "contact",
      "email",
      "purposeDetails.preferredCountry",
      "studentId",
    ];

    // If no specific field → broaden search to B2B name fields also
    let finalSearchFields = [...baseSearchFields];

    if (!searchOnField) {
      finalSearchFields.push("createdByName", "b2bCompany");
    }

    const searchOptions = {
      searchText,
      searchOnField,
      searchFields: finalSearchFields,
    };

    const filter = {
      admissionProcessRequired: true,
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
      roleName === "Super Admin" &&
      filterUserId &&
      effectiveId &&
      currentId &&
      effectiveId.toString() !== currentId.toString();
    // String(showAll) !== "true";

    if (canMimic) {
      const mimicFilter = await buildAccessFilterForUser(
        effectiveUser,
        mainStatus,
      );
      Object.assign(filter, mimicFilter);
    }

    // 🎯 Apply B2B filter (for Super Admin & viewB2B users only)
    if (
      b2bId &&
      mongoose.Types.ObjectId.isValid(b2bId) &&
      (roleName === "Super Admin" || currentUser.userType === "user")
    ) {
      const b2bMembers = await B2BMember.find({
        b2bAdmin: b2bId,
      }).select("_id");

      const memberIds = b2bMembers.map((m) => m._id);

      const b2bUserIds = [new mongoose.Types.ObjectId(b2bId), ...memberIds];

      const b2bCondition = {
        created_by: { $in: b2bUserIds },
      };

      // 🔀 Merge with existing filter
      if (filter.$or) {
        filter.$and = filter.$and || [];
        filter.$and.push({ $or: filter.$or });
        filter.$and.push(b2bCondition);
        delete filter.$or;
      } else {
        Object.assign(filter, b2bCondition);
      }
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
            let accessConditions = [
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
        } else if (currentUser.userType === "B2B Member") {
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
        } else if (currentUser.userType === "Branch User") {
          filter.created_by = currentUser.userId;

          if (mainStatus && mongoose.Types.ObjectId.isValid(mainStatus)) {
            filter.mainStatus = new mongoose.Types.ObjectId(mainStatus);
          }
        } else if (currentUser.viewB2BStudentApplication) {
          let accessConditions = [];

          // ✅ Add Assigned B2B Access FIRST (Global Rule)
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
              allocationMatch,
            );
          }

          // ✅ Type: COUNTRYWISE
          else if (currentUser.whichB2BStudentApplication === "countrywise") {
            accessConditions.push({ created_by: currentUser.userId });

            const userDoc = await User.findById(currentUser.userId).select(
              "country",
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
                        (c) => new RegExp(`^${c}$`, "i"),
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
              allocationMatch,
            );
          }

          if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
            const branchUsers = await User.find({ branchId }).select("_id");
            const branchUserIds = branchUsers.map((u) => u._id);

            const branchCondition = {
              created_by: {
                $in: [new mongoose.Types.ObjectId(branchId), ...branchUserIds],
              },
            };

            filter.$and = [{ $or: accessConditions }, branchCondition];
          } else {
            if (String(showAll) !== "true") {
              filter.$nor = [
                {
                  created_by_type: {
                    $in: ["Branch", "Branch User", "B2B Admin", "B2B Member"],
                  },
                  // branch: { $ne: null },
                },
              ];
            }
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

    const accessUserId = canMimic
      ? effectiveUser._id || effectiveUser.userId
      : currentUser.userId;

    const fullUser = await User.findById(accessUserId).select(
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

    if (followUp) {
      const followUpDate = new Date(followUp);
      const nextDay = new Date(followUpDate);
      nextDay.setDate(followUpDate.getDate() + 1);

      const validFollowUpTabs = [
        "followUps.personalDetails.nextFollowUpDate",
        "followUps.documentDetails.nextFollowUpDate",
        "followUps.interestedCourse.nextFollowUpDate",
        "followUps.visaApplication.nextFollowUpDate",
      ];

      const followUpConditions = validFollowUpTabs.map((field) => ({
        [field]: { $gte: followUpDate, $lt: nextDay },
      }));

      const newAndArray = [];

      // Keep any direct filters (country, mainStatus, etc.)
      for (const [key, value] of Object.entries(filter)) {
        if (key !== "$or" && key !== "$and") {
          newAndArray.push({ [key]: value });
          delete filter[key];
        }
      }

      // Keep existing OR conditions (access rules)
      if (filter.$or) {
        newAndArray.push({ $or: filter.$or });
        delete filter.$or;
      }

      // Keep existing AND conditions
      if (filter.$and) {
        newAndArray.push(...filter.$and);
        delete filter.$and;
      }

      // Add the follow-up condition
      newAndArray.push({ $or: followUpConditions });

      // Set the final AND filter
      filter.$and = newAndArray;
    }

    if (country) {
      const countryCondition = {
        "purposeDetails.preferredCountry.0": new RegExp(`^${country}$`, "i"),
      };

      if (filter.$or) {
        // Combine with existing access conditions
        filter.$and = filter.$and || [];
        filter.$and.push({ $or: filter.$or });
        filter.$and.push(countryCondition);
        delete filter.$or;
      } else {
        // No OR condition, simple direct match
        Object.assign(filter, countryCondition);
      }
    }


    // 🔥 STEP A: Fetch ALL visible applications (IDs only, cheap query)
const visibleApplications = await studentApplication
  .find(filter)
  .select("_id email purposeDetails.preferredCountry createdAt")
  .sort({ createdAt: -1 });


  // 🔥 STEP B: Build email → country map & primary IDs
const emailMap = {};
const primaryIds = [];

for (const app of visibleApplications) {
  if (!app.email) continue;

  if (!emailMap[app.email]) {
    emailMap[app.email] = {
      primaryId: app._id,
      countries: [],
    };
    primaryIds.push(app._id);
  }

  const countries = Array.isArray(app.purposeDetails?.preferredCountry)
    ? app.purposeDetails.preferredCountry
    : [app.purposeDetails?.preferredCountry].filter(Boolean);

  countries.forEach((c) => {
  emailMap[app.email].countries.push({
    _id: app._id,
    country: c,
  });
});

}
// 🔥 STEP C: Paginate ONLY primary applications
filter._id = { $in: primaryIds };

    const getAll = await paginate(
      studentApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions,
    );

// 🔥 STEP D: Attach otherCountriesApplied from result-only map
for (const student of getAll.data) {
  const entry = emailMap[student.email];
  if (!entry) {
    student.otherCountriesApplied = [];
    continue;
  }

  const primaryCountries = new Set(
    Array.isArray(student.purposeDetails?.preferredCountry)
      ? student.purposeDetails.preferredCountry
      : [student.purposeDetails?.preferredCountry].filter(Boolean)
  );

  student.otherCountriesApplied = entry.countries.filter(
  (item) => !primaryCountries.has(item.country)
);

}


    // STEP 1: Collect all documentName ObjectIds
    const documentIds = new Set();

    for (const student of getAll.data) {
      for (const doc of student.uploadedDocumentDetails || []) {
        if (
          doc.documentName &&
          mongoose.Types.ObjectId.isValid(doc.documentName)
        ) {
          documentIds.add(doc.documentName.toString());
        }
      }
    }

    // STEP 2: Fetch document names
    const documents = await Document.find({
      _id: { $in: [...documentIds] },
    }).select("_id name");

    const documentMap = {};
    for (const doc of documents) {
      documentMap[doc._id.toString()] = doc.name;
    }

    const getTotal = await studentApplication.countDocuments(filter);

    if (!getAll || !getAll.data || !getAll.data.length) {
      throw { status: false, message: "No Students found" };
    }
    for (const student of getAll.data) {
      if (student.created_by_type === "B2B Admin" && student.createdByName) {
        const b2bData = await B2BAdmin.findOne({
          companyName: student.createdByName,
        }).select("phone");
        student.b2bContact = b2bData?.phone || null;
      } else if (
        student.created_by_type === "B2B Member" &&
        student.b2bCompany
      ) {
        const b2bData = await B2BAdmin.findOne({
          companyName: student.b2bCompany,
        }).select("phone");
        student.b2bContact = b2bData?.phone || null;
      }
    }



    const studentIds = getAll.data.map((student) => student._id);

    // STEP 2: Fetch invoices for these students
    const invoices = await GenerateInvoice.find({
      name: { $in: studentIds },
    }).select("name dueAmount");

    // STEP 3: Create invoice map (studentId -> dueAmount)
    const invoiceMap = {};
    for (const inv of invoices) {
      const studentId = inv.name?.toString();
      if (studentId) {
        invoiceMap[studentId] = inv.dueAmount || "0";
      }
    }

    // STEP 4: Attach dueAmount to each student
    for (const student of getAll.data) {
      const studentId = student._id.toString();
      student.dueAmount = invoiceMap[studentId] || "0";
    }
    return getAll;
  },

  getById: async (studentId) => {
    const populateFields = [
      { path: "purposeDetails.inquiryFor", select: "name" },
      {
        path: "interestedCourseDetails",
        populate: [
          { path: "institute", select: "instituteName" },
          { path: "course", select: "programName" },
          { path: "campus", select: "campus" },
          { path: "portalDetails.applicationType", select: "name" },
        ],
      },
      {
        path: "userAllocationDetails",
        populate: [
          { path: "role", select: "name" },
          { path: "user", select: "name" },
        ],
      },
      {
        path: "visaAllocationDetails",
        populate: [
          { path: "role", select: "name" },
          { path: "user", select: "name" },
        ],
      },
      { path: "personalDetailStatus", select: "name" },
      { path: "documentDetailStatus", select: "name" },
      { path: "counsellingDetailStatus", select: "name" },
      { path: "lastUpdatedStatus", select: "name" },
      { path: "mainStatus", select: "name color" },
      {
        path: "coachingDetails.masterSessionDetails.branch",
        select: "name",
      },
      {
        path: "coachingDetails.masterSessionDetails.faculty",
        select: "name",
      },
      {
        path: "coachingDetails.mockTestDetails.branch",
        select: "name",
      },
      {
        path: "coachingDetails.mockTestDetails.faculty",
        select: "name",
      },
      { path: "loanProvider", select: "name contact" },
    ];

    const student = await studentApplication
      .findById(studentId)
      .populate(populateFields); // ✅ use populate()

    if (!student) {
      throw { status: false, message: "Student not found" };
    }

    return student;
  },

  delete: async (studentId, params = {}, currentUser) => {
    const userId = currentUser.userId;
    const userName = currentUser.userName;
    const student = await studentApplication.findById(studentId);
    if (!student) {
      throw { status: false, message: "Student not found" };
    }

    const hasSubDocId =
      params.educationDetailId ||
      params.entranceExamId ||
      params.aptitudeExamId ||
      params.workExperienceId ||
      params.documentId ||
      params.interestedCourseId ||
      params.userAllocationId ||
      params.universityApplicationId ||
      params.deletePurposeDetails ||
      params.visaAllocationId ||
      params.coachingExamId ||
      params.remarksId ||
      params.mockTestId ||
      params.masterSessionId ||
      params.personalDetailsRemarksId ||
      params.emergencyDetailsId ||
      params.deleteTargetAchieved;

    if (!hasSubDocId) {
      // if (
      //   student.uploadedDocumentDetails &&
      //   student.uploadedDocumentDetails.length > 0
      // ) {
      //   const fs = require("fs");

      //   for (const doc of student.uploadedDocumentDetails) {
      //     try {
      //       if (doc.filePath && fs.existsSync(doc.filePath)) {
      //         fs.unlinkSync(doc.filePath);
      //       }
      //     } catch (fileError) {
      //       console.error(`Error deleting file: ${doc.filePath}`, fileError);
      //     }
      //   }
      // }

      await addDeleteHistory({
        studentId,
        event: "student_deleted",
        value: {
          name: student.name,
          email: student.email,
          phone: student.phone,
        },
        userId,
        userName,
      });

      const deletedStudent =
        await studentApplication.findByIdAndDelete(studentId);

      if (!deletedStudent) {
        throw { status: false, message: "Failed to delete student" };
      }

      return "Student deleted successfully";
    }

    let updateQuery = {};
    let message = "Record deleted successfully";

    if (params.educationDetailId) {
      const edu = student.educationDetails.find(
        (e) => e._id.toString() === params.educationDetailId,
      );

      if (edu) {
        await addDeleteHistory({
          studentId,
          event: "education_detail_deleted",
          value: edu,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: { educationDetails: { _id: params.educationDetailId } },
      };
      message = "Education detail deleted successfully";
    } else if (params.personalDetailsRemarksId) {
      const personal = student.personalDetailsRemarks.find(
        (e) => e._id.toString() === params.personalDetailsRemarksId,
      );

      if (personal) {
        await addDeleteHistory({
          studentId,
          event: "personal_detail_remarks_deleted",
          value: personal,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: {
          personalDetailsRemarks: { _id: params.personalDetailsRemarksId },
        },
      };

      message = "Remark detail deleted successfully";
    } else if (params.emergencyDetailsId) {
      const emer = student.emergencyDetails.find(
        (e) => e._id.toString() === params.emergencyDetailsId,
      );

      if (emer) {
        await addDeleteHistory({
          studentId,
          event: "emergency_detail_deleted",
          value: emer,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: {
          emergencyDetails: { _id: params.emergencyDetailsId },
        },
      };

      message = "Emergency detail deleted successfully";
    } else if (params.entranceExamId) {
      const entr = student.entranceExamDetails.find(
        (e) => e._id.toString() === params.entranceExamId,
      );

      if (entr) {
        await addDeleteHistory({
          studentId,
          event: "entranceExam_detail_deleted",
          value: entr,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: { entranceExamDetails: { _id: params.entranceExamId } },
      };
      message = "Entrance exam detail deleted successfully";
    } else if (params.aptitudeExamId) {
      const apt = student.aptitudeExamDetails.find(
        (e) => e._id.toString() === params.aptitudeExamId,
      );

      if (apt) {
        await addDeleteHistory({
          studentId,
          event: "aptitudeExam_detail_deleted",
          value: apt,
          userId,
          userName,
        });
      }
      updateQuery = {
        $pull: { aptitudeExamDetails: { _id: params.aptitudeExamId } },
      };
      message = "Aptitude exam detail deleted successfully";
    } else if (params.workExperienceId) {
      const work = student.workExperience.find(
        (e) => e._id.toString() === params.workExperienceId,
      );

      if (work) {
        await addDeleteHistory({
          studentId,
          event: "workExperience_detail_deleted",
          value: work,
          userId,
          userName,
        });
      }
      updateQuery = {
        $pull: { workExperience: { _id: params.workExperienceId } },
      };
      message = "Work experience deleted successfully";
    } else if (params.interestedCourseId) {
      const intr = student.interestedCourseDetails.find(
        (e) => e._id.toString() === params.interestedCourseId,
      );

      if (intr) {
        await addDeleteHistory({
          studentId,
          event: "interestedCourse_detail_deleted",
          value: intr,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: { interestedCourseDetails: { _id: params.interestedCourseId } },
      };
      message = "Interested course deleted successfully";
    } else if (params.userAllocationId) {
      const userAllocate = student.userAllocationDetails.find(
        (e) => e._id.toString() === params.userAllocationId,
      );

      if (userAllocate) {
        await addDeleteHistory({
          studentId,
          event: "userAllocate_detail_deleted",
          value: userAllocate,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: { userAllocationDetails: { _id: params.userAllocationId } },
      };
      message = "Assigned user deleted successfully";
    } else if (params.coachingExamId) {
      const coachingEx = student.coachingDetails.examDetails.find(
        (e) => e._id.toString() === params.coachingExamId,
      );

      if (coachingEx) {
        await addDeleteHistory({
          studentId,
          event: "coachingExam_detail_deleted",
          value: coachingEx,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: {
          "coachingDetails.examDetails": { _id: params.coachingExamId },
        },
      };
      message = "Coaching exam deleted successfully";
    } else if (params.remarksId) {
      const rem = student.coachingDetails.remarkHistory.find(
        (e) => e._id.toString() === params.remarksId,
      );

      if (rem) {
        await addDeleteHistory({
          studentId,
          event: "remark_detail_deleted",
          value: rem,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: {
          "coachingDetails.remarkHistory": { _id: params.remarksId },
        },
      };
      message = "Remark deleted successfully";
    } else if (params.mockTestId) {
      const mock = student.coachingDetails.mockTestDetails.find(
        (e) => e._id.toString() === params.mockTestId,
      );

      if (mock) {
        await addDeleteHistory({
          studentId,
          event: "mockTest_detail_deleted",
          value: mock,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: {
          "coachingDetails.mockTestDetails": { _id: params.mockTestId },
        },
      };
      message = "Mock test data deleted successfully";
    } else if (params.masterSessionId) {
      const mast = student.coachingDetails.masterSessionDetails.find(
        (e) => e._id.toString() === params.masterSessionId,
      );

      if (mast) {
        await addDeleteHistory({
          studentId,
          event: "masterSession_detail_deleted",
          value: mast,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: {
          "coachingDetails.masterSessionDetails": {
            _id: params.masterSessionId,
          },
        },
      };
      message = "Master session data deleted successfully";
    } else if (params.universityApplicationId) {
      const uni = student.universityApplicationDetails.find(
        (e) => e._id.toString() === params.universityApplicationId,
      );

      if (uni) {
        await addDeleteHistory({
          studentId,
          event: "universityApplication_detail_deleted",
          value: uni,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: {
          universityApplicationDetails: { _id: params.universityApplicationId },
        },
      };
    } else if (params.documentId) {
      // const documentToDelete = student.uploadedDocumentDetails.find(
      //   (doc) => doc._id.toString() === params.documentId
      // );

      // if (documentToDelete && documentToDelete.filePath) {
      //   try {
      //     const fs = require("fs");

      //     if (fs.existsSync(documentToDelete.filePath)) {
      //       fs.unlinkSync(documentToDelete.filePath);
      //     }
      //   } catch (fileError) {
      //     console.error(
      //       `Error deleting file: ${documentToDelete.filePath}`,
      //       fileError
      //     );
      //   }
      // }

      const doc = student.uploadedDocumentDetails.find(
        (d) => d._id.toString() === params.documentId,
      );

      if (doc) {
        await addDeleteHistory({
          studentId,
          event: "document_deleted",
          value: {
            documentName: doc.customDocumentName || doc.documentName,
            status: doc.status,
            remarks: doc.remarks || null,
          },
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: { uploadedDocumentDetails: { _id: params.documentId } },
      };
      message = "Document deleted successfully";
    } else if (params.deletePurposeDetails) {
      const purpose = student.purposeDetails;
      if (purpose) {
        await addDeleteHistory({
          studentId,
          event: "purpose_details_deleted",
          value: {
            inquiryFor: purpose.inquiryFor || null,
            preferredCountry: purpose.preferredCountry || [],
            intake: purpose.intake || null,
          },
          userId,
          userName,
        });
      }

      updateQuery = { $set: { purposeDetails: null } };
      message = "Purpose details deleted successfully";
    } else if (params.deleteTargetAchieved) {
      const target = student.coachingDetails?.targetAchieved;

      if (target) {
        await addDeleteHistory({
          studentId,
          event: "target_achieved_deleted",
          value: {
            target: target.target || null,
            achievedOn: target.achievedOn || null,
            remarks: target.remarks || null,
          },
          userId,
          userName,
        });
      }
      updateQuery = { $set: { "coachingDetails.targetAchieved": null } };
      message = "Target achieved deleted successfully;";
    } else if (params.visaAllocationId) {
      const visaAllocate = student.visaAllocationDetails.find(
        (e) => e._id.toString() === params.visaAllocationId,
      );

      if (visaAllocate) {
        await addDeleteHistory({
          studentId,
          event: "visaAllocation_detail_deleted",
          value: visaAllocate,
          userId,
          userName,
        });
      }

      updateQuery = {
        $pull: { visaAllocationDetails: { _id: params.visaAllocationId } },
      };
      message = "Visa allocated user deleted successfully";
    }

    const updateResult = await studentApplication.updateOne(
      { _id: studentId },
      updateQuery,
    );

    if (updateResult.modifiedCount === 0) {
      throw { status: false, message: "Record not found or already deleted" };
    }

    return message;
  },
  downloadDocuments: async (applicationId, documentIds) => {
    const BASEURL = "https://zokepconsultant.com/api";
    const application = await studentApplication.findById(applicationId);
    if (!application) {
      throw { status: false, message: "Student application not found" };
    }

    const docIdArray = documentIds.includes(",")
      ? documentIds.split(",").map((id) => id.trim())
      : [documentIds];

    const documents = [];

    for (const docId of docIdArray) {
      const document = application.uploadedDocumentDetails.find(
        (doc) => doc._id.toString() === docId,
      );

      if (document && document.filePath) {
        let ext = null;

        // Try to get extension from filePath
        const urlParts = document.filePath.split(".");
        if (urlParts.length > 1) {
          ext = urlParts[urlParts.length - 1].split("?")[0];
        }

        // If extension not found, default to pdf
        if (!ext || ext.length > 5 || ext.includes("/")) {
          ext = "pdf";
        }

        const fileName = document.originalName
          ? document.originalName.includes(".")
            ? document.originalName
            : `${document.originalName}.${ext}`
          : `document-${docId}.${ext}`;

        // ✅ Add BASEURL before filePath (ensure no duplicate slashes)
        const normalizedPath = document.filePath.replace(/^\/+/, "");
        const fullUrl = `${BASEURL}/${normalizedPath}`;

        documents.push({
          filePath: fullUrl, // ✅ now includes BASEURL
          fileName,
        });
      }
    }

    if (documents.length === 0) {
      throw { status: false, message: "No valid documents found" };
    }

    return documents;
  },

  cloneStudentApplication: async (
    studentApplicationId,
    newCountryName,
    userId,
    userName,
    invoiceData,
  ) => {
    invoiceData =
      typeof invoiceData === "string" ? JSON.parse(invoiceData) : invoiceData;

    if (!studentApplicationId) {
      throw {
        status: false,
        message: "Student application Id is required",
      };
    }

    const originalApplication =
      await studentApplication.findById(studentApplicationId);

    if (!originalApplication) {
      throw { status: false, message: "Original application not found" };
    }

    const passportNumber = originalApplication.passportNumber;
    if (passportNumber) {
      const duplicate = await studentApplication.findOne({
        passportNumber,
        "purposeDetails.preferredCountry": newCountryName,
      });

      if (duplicate) {
        throw {
          status: false,
          message: `Student with passport ${passportNumber} already exists for ${newCountryName}`,
        };
      }
    }

    const newApplicationData = originalApplication.toObject();
    delete newApplicationData._id;
    delete newApplicationData.interestedCourseDetails;
    delete newApplicationData.userAllocationDetails;
    delete newApplicationData.isSubmit;

    // newApplicationData.interestedCourseDetails[0].institute = newInstituteId;
    newApplicationData.purposeDetails.preferredCountry = newCountryName;

    newApplicationData.studentId = await getNextSequence("studentId", "ST");

    newApplicationData.createdAt = new Date();

    newApplicationData.clone_by = userId;
    let newMainStatus = await StudentStatus.findOne({ name: "New" });

    if (!newMainStatus) {
      newMainStatus = await StudentStatus.create({
        name: "New",
      });
    }
    newApplicationData.mainStatus = newMainStatus._id;
    const newApplication = new studentApplication(newApplicationData);
    await newApplication.save();

    if (invoiceData) {
      const paidAmount = (invoiceData.paidAmount || []).map((p) => ({
        amount: p.amount,
        date: p.date || Date.now(),
        bank: p.bank || null,
        paymentMode: p.paymentMode | null,
      }));

      await GenerateInvoice.create({
        name: newApplication._id,
        contactNo: newApplication.contact,
        mainPlan: invoiceData.mainPlan,
        subPlan: invoiceData.subPlan,
        amount: invoiceData.amount,
        discount: invoiceData.discount,
        payableAmount: invoiceData.payableAmount,
        paidAmount,
        dueAmount: invoiceData.dueAmount,
        paymentType: invoiceData.paymentType,
        remarks: invoiceData.remarks,
        created_by: userId,
        createdByName: userName,
      });
    }

    return newApplication;
  },

  getstudentAccountant: async (studentId) => {
    const student = await studentApplication.findById(studentId);
    if (!student) {
      throw { status: false, message: "Student not found" };
    }

    const invoices = await GenerateInvoice.find({ name: studentId }).sort({
      createdAt: -1,
    });

    // 3. Calculate total paid amount from all invoices
    const totalPaidAmount = invoices.reduce((sum, inv) => {
      if (Array.isArray(inv.paidAmount)) {
        return (
          sum +
          inv.paidAmount.reduce((subSum, pay) => {
            return subSum + (parseFloat(pay.amount) || 0);
          }, 0)
        );
      }
      return sum;
    }, 0);

    return { invoices, totalPaidAmount };
  },

  checkPendingDoc: async (studentId) => {
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      throw { status: false, message: "Invalid or missing studentId" };
    }

    const student = await studentApplication.findById(studentId);
    if (!student) {
      throw { status: false, message: "Student not found" };
    }

    const country = student.purposeDetails?.preferredCountry?.[0];
    if (!country) {
      throw {
        status: false,
        message: "Preferred country not found in student details",
      };
    }

    const docList = await CountryDocument.findOne({ country }).lean();
    if (!docList) {
      throw { status: false, message: "No document list for this country" };
    }

    const uploadedDocSet = new Set(
      (student.uploadedDocumentDetails || []).map(
        (doc) =>
          `${doc.documentType?.toString() || ""}_${
            doc.documentName?.toString() || ""
          }`,
      ),
    );

    const missingDocEntries = [];

    for (const docGroup of docList.documents || []) {
      const typeId = docGroup.type?.toString();

      for (const docItem of docGroup.documentList || []) {
        const documentId = docItem.document?.toString();
        const key = `${typeId}_${documentId}`;

        if (!uploadedDocSet.has(key)) {
          missingDocEntries.push({
            documentId,
            typeId,
            required: true,
          });
        }
      }
    }

    const documentIds = missingDocEntries.map((doc) => doc.documentId);
    const documents = await Document.find({ _id: { $in: documentIds } })
      .populate({ path: "type", model: "DocumentType", select: "name" })
      .select("name type")
      .lean();

    const docDetailMap = {};
    for (const doc of documents) {
      docDetailMap[doc._id.toString()] = {
        documentName: doc.name,
        documentTypeName: doc.type?.name || "Unknown",
      };
    }

    const missingDocuments = missingDocEntries.map((doc) => ({
      ...doc,
      documentName: docDetailMap[doc.documentId]?.documentName || "Unknown",
      documentTypeName:
        docDetailMap[doc.documentId]?.documentTypeName || "Unknown",
    }));

    // ➕ Add: Type-wise count
    const typeWiseCounts = {};
    for (const doc of missingDocuments) {
      const type = doc.documentTypeName;
      if (!typeWiseCounts[type]) {
        typeWiseCounts[type] = 0;
      }
      typeWiseCounts[type]++;
    }

    return {
      missingDocuments, // full details
      typeWiseCounts, // { Passport: 2, SOP: 1, etc. }
    };
  },
  sendPendingDocumentsEmail: async (studentId, customDocumentList = null) => {
    const student = await studentApplication.findById(studentId);
    if (!student) {
      throw { status: false, message: "Student not found" };
    }

    let documentsToSend = [];

    // Check if custom document list is provided
    if (
      customDocumentList &&
      Array.isArray(customDocumentList) &&
      customDocumentList.length > 0
    ) {
      documentsToSend = customDocumentList;
    } else {
      // If no custom list, get missing documents
      const missingDocs = await studentApplicationServices.checkPendingDoc(
        student._id,
      );
      documentsToSend = missingDocs.missingDocuments || [];
    }

    // Determine recipient email
    let recipientEmail = student.email;
    let recipientType = "Student";

    if (student.created_by_type === "B2B Admin") {
      const b2bAdmin = await B2BAdmin.findById(student.created_by).select(
        "email",
      );
      if (b2bAdmin?.email) {
        recipientEmail = b2bAdmin.email;
        recipientType = "B2B";
      }
    } else if (student.created_by_type === "B2B Member") {
      const b2bMember = await B2BMember.findById(student.created_by).select(
        "email",
      );
      if (b2bMember?.email) {
        recipientEmail = b2bMember.email;
        recipientType = "B2B";
      }
    }

    // Send email with documents list
    await sendPendingDocsEmail(
      recipientEmail,
      documentsToSend,
      student.name,
      student.studentId,
      recipientType,
    );

    return customDocumentList
      ? "Custom documents email sent successfully"
      : "Pending documents email sent successfully";
  },
  getCoachingStudent: async (
    page,
    limit,
    searchText = "",
    currentUser,
    status,
    faculty,
    startDate,
    endDate,
    targetAchieved,
    branch,
    showAll,
  ) => {
    // 🔥 FIX: convert showAll from string to boolean
    showAll = showAll === true || showAll === "true";
    branch =
      branch && branch !== "null" && branch !== "undefined" ? branch : null;

    const filter = {
      "coachingDetails.coachingRequired": true,
    };

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
      {
        path: "coachingDetails",
        populate: [
          { path: "registerFor", select: "name" },
          { path: "coachingRequirement", select: "name" },
          { path: "batchFaculty", select: "name" },
        ],
      },
    ];

    const searchOptions = {
      searchText,
      searchFields: [
        "name",
        "contact",
        "email",
        "purposeDetails.preferredCountry",
        "studentId",
        "branch",
      ],
    };

    /* ================= DATE FILTER ================= */
    if (startDate && endDate) {
      filter["coachingDetails.startDate"] = { $gte: new Date(startDate) };
      filter["coachingDetails.endDate"] = { $lte: new Date(endDate) };
    }

    /* ================= BRANCH FILTER (MAIN FIX) ================= */
    /* ================= BRANCH FILTER ================= */
    if (!showAll) {
      if (branch) {
        const branchUsers = await User.find({ branchId: branch }).select("_id");

        const branchUserIds = branchUsers.map((u) => u._id.toString());

        filter["created_by"] = { $in: [branch, ...branchUserIds] };
      } else {
        filter["created_by_type"] = "user";
      }
    }

    // showAll = true → no branch filter

    /* ================= TARGET ACHIEVED (BUG FIXED) ================= */
    if (targetAchieved === true) {
      filter["coachingDetails.targetAchieved.scores.total"] = { $ne: null };
    }
    if (targetAchieved === false) {
      filter["coachingDetails.targetAchieved.scores.total"] = null;
    }

    /* ================= STATUS FILTER ================= */
    if (status) {
      filter["coachingDetails.batchStatus"] = status;
    }

    /* ================= FACULTY FILTER ================= */
    if (faculty) {
      filter["coachingDetails.batchFaculty"] = faculty;
    }

    /* ================= ROLE-BASED ACCESS ================= */
    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName !== "Super Admin") {
      filter.$and = [
        {
          $or: [
            { "coachingDetails.batchFaculty": currentUser.userId },
            { created_by: currentUser.userId },
          ],
        },
      ];
    }

    /* ================= PAGINATION ================= */
    const getAll = await paginate(
      studentApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions,
    );

    /* ================= DUE AMOUNT MAPPING ================= */
    const studentIds = getAll.data.map((student) => student._id);

    const invoices = await GenerateInvoice.find({
      name: { $in: studentIds },
    }).select("name dueAmount");

    const invoiceMap = {};
    for (const inv of invoices) {
      const studentId = inv.name?.toString();
      if (studentId) {
        invoiceMap[studentId] = inv.dueAmount || "0";
      }
    }

    for (const student of getAll.data) {
      const studentId = student._id.toString();
      student.dueAmount = invoiceMap[studentId] || "0";
    }

    return getAll;
  },

  getFollowupStudent: async (
    page,
    limit,
    searchText = "",
    date,
    country,
    type,
  ) => {
    const searchOptions = {
      searchText,
      searchFields: ["name", "contact", "email", "studentId"],
    };

    const populateFields = [
      { path: "created_by", select: "name" },
      { path: "mainStatus", select: "name color" },
    ];

    // Default OR filter for all follow-up tabs
    let orConditions = [
      { "followUps.personalDetails.nextFollowUpDate": { $ne: null } },
      { "followUps.documentDetails.nextFollowUpDate": { $ne: null } },
      { "followUps.interestedCourse.nextFollowUpDate": { $ne: null } },
      { "followUps.visaApplication.nextFollowUpDate": { $ne: null } },
    ];

    // If `type` is provided, filter only that tab
    if (type) {
      orConditions = [
        { [`followUps.${type}.nextFollowUpDate`]: { $ne: null } },
      ];
    }

    if (country) {
      orConditions = orConditions.map((cond) => ({
        $and: [cond, { "purposeDetails.preferredCountry": { $in: [country] } }],
      }));
    }
    const filter = { $or: orConditions };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // If `type` is provided, filter date only in that tab
      if (type) {
        filter.$or = [
          {
            [`followUps.${type}.nextFollowUpDate`]: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        ];
      } else {
        filter.$or = [
          {
            "followUps.personalDetails.nextFollowUpDate": {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
          {
            "followUps.documentDetails.nextFollowUpDate": {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
          {
            "followUps.interestedCourse.nextFollowUpDate": {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
          {
            "followUps.visaApplication.nextFollowUpDate": {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        ];
      }
    }

    const result = await paginate(
      studentApplication,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions,
    );

    return result;
  },
  downloadStudentApplication: async (filters = {}, currentUser) => {
    const {
      page = 1,
      limit = 1000000,
      searchOnField,
      searchText,
      mainStatus,
      branchId,
      showAll,
      country,
      followUp,
      b2bId,
    } = filters;

    const result = await studentApplicationServices.getAll(
      page,
      limit,
      searchOnField,
      searchText,
      currentUser,
      mainStatus,
      branchId,
      showAll,
      country,
      followUp,
      b2bId,
    );

    const students = result?.data || [];

    if (!students.length) {
      return { status: false, message: "No matching students found" };
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students", {
      properties: { defaultRowHeight: 20 },
      pageSetup: { orientation: "landscape" },
    });

    worksheet.columns = [
      { header: "Student ID", key: "studentId", width: 20 },
      { header: "Name", key: "name", width: 25 },
      { header: "Phone Number", key: "phone", width: 20 },
      { header: "Preferred Country", key: "country", width: 25 },
      { header: "Institute Name(s)", key: "institutes", width: 40 },
      { header: "Course(s)", key: "courses", width: 40 },
      { header: "Intake Year(s)", key: "intakeYears", width: 20 },
      { header: "Program Level(s)", key: "programLevels", width: 30 },
      { header: "Current Status", key: "mainStatus", width: 20 },
      { header: "Institute Fees Pay or Not", key: "feeStatus", width: 25 },
      { header: "Visa Approved or Not", key: "visaStatus", width: 20 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF974807" },
      };
      cell.font = {
        name: "Arial",
        color: { argb: "FFFFFF" },
        bold: true,
        size: 12,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const isVisaApproved = (visa) => {
      if (!visa) return false;

      return (
        visa.visaOutcomeStatus === "Approved" ||
        visa.visaDecision?.status === "Approved" ||
        visa.visaOutcome?.decision === "Granted" ||
        visa.decision?.decision === "Approved" ||
        visa.decision?.decision === "Approved"
      );
    };

    students.forEach((s) => {
      const courses = s.interestedCourseDetails || [];

      const instituteNames = courses
        .map((c) => c.institute?.instituteName)
        .filter(Boolean)
        .join(", ");

      const courseNames = courses
        .map((c) => c.course?.programName)
        .filter(Boolean)
        .join(", ");

      const intakeYears = courses
        .map((c) => c.intakeYear)
        .filter(Boolean)
        .join(", ");

      const programLevels = courses
        .map((c) => c.programLevel?.name)
        .filter(Boolean)
        .join(", ");

      const instituteFeeStatus = courses
        .map((c) => c.instituteFeePayment?.feeStatus || "Not Paid")
        .filter(Boolean)
        .join(", ");

      const visaStatus = isVisaApproved(s.visaApplicationDetails)
        ? "Approved"
        : "Not Approved";

      worksheet.addRow({
        studentId: s.studentId || "",
        name: s.name || "",
        phone: s.contact || "",
        country: (s.purposeDetails?.preferredCountry || []).join(", "),
        institutes: instituteNames,
        courses: courseNames,
        intakeYears: intakeYears,
        programLevels: programLevels,
        mainStatus: s.mainStatus?.name || "",
        feeStatus: instituteFeeStatus,
        visaStatus: visaStatus,
      });
    });

    const folderPath = path.join(__dirname, "../../../../uploads/excel");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `student_list_${Date.now()}.xlsx`;
    const filePath = path.join(folderPath, fileName);

    await workbook.xlsx.writeFile(filePath);

    const publicUrl = `/uploads/excel/${fileName}`;
    return { status: true, file: publicUrl };
  },
};

module.exports = { StudentApplicationServices, buildAccessFilterForUser };
