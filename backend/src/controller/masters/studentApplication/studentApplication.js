const {
  StudentApplicationServices,
} = require("../../../services/masters/studentApplication/studentApplication");
const checkInstituteFeeDeadline = require("../../../../utils/instituteFeesDeadlineReminder");
const { uploadToCloudinary } = require("../../../../middleware/cloudinary");
const {
  sendApplicationStatusUpdateEmail,
} = require("../../../../middleware/nodemailer");

const archiver = require("archiver");
const axios = require("axios");

const createStudent = async (req, res) => {
  try {
    const { userId, userName, userType, b2bName, branch } = req.user;
    const branchName =
      typeof branch === "object" && branch !== null ? branch.name : branch;

    let coachingDetails = req.body.coachingDetails;

    // Parse if it's string
    if (typeof coachingDetails === "string") {
      coachingDetails = JSON.parse(coachingDetails);
    }

    // ✅ Handle local exam document upload
    if (req.files && req.files.coachingDoc) {
      const files = Array.isArray(req.files.coachingDoc)
        ? req.files.coachingDoc
        : [req.files.coachingDoc];

      if (
        coachingDetails.examDetails &&
        Array.isArray(coachingDetails.examDetails)
      ) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fullPath = file.path;
          const uploadIndex = fullPath.indexOf("uploads");
          const relativePath =
            uploadIndex !== -1
              ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
              : fullPath;

          if (coachingDetails.examDetails[i]) {
            coachingDetails.examDetails[i].document = relativePath; // ✅ Save local path
          }
        }
      }
    }

    req.body.coachingDetails = coachingDetails;
    const result = await StudentApplicationServices.create(
      req.body,
      userId,
      userName,
      userType,
      b2bName,
      branchName
    );

    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const files = req.files?.uploadedDocument;
    const coachingDoc = req.files?.coachingDoc;
    const resultDoc = req.files?.resultDoc;
    const mockTestDoc = req.files?.mockTestDoc;
    const { userId, userName, userType } = req.user;
    const agreementByStudent = req.files?.agreementByStudent;
    const agreementByAgency = req.files?.agreementByAgency;
    const { student, emailInfo } = await StudentApplicationServices.update(
      req.params.id,
      req.body,
      userId,
      userName,
      userType,
      files,
      coachingDoc,
      resultDoc,
      mockTestDoc,
      agreementByStudent,
      agreementByAgency
    );
    res.status(200).json({
      status: true,
      code: 200,
      data: student,
    });

    if (emailInfo) {
      setImmediate(async () => {
        for (const { recipientEmail, recipientType } of emailInfo.recipients) {
          try {
            await sendApplicationStatusUpdateEmail(
              recipientEmail,
              emailInfo.applicationId,
              emailInfo.studentId,
              emailInfo.status,
              emailInfo.updatedAt,
              emailInfo.name,
              recipientType
            );
          } catch (err) {
            console.error("Failed to send status email:", err);
          }
        }
      });
    }
  } catch (error) {
    console.log("errorrr===", error);
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};
const statusUpdateFromEmail = async (req, res) => {
  try {
    const { type, token, studentId, courseId } = req.query;

    const result = await StudentApplicationServices.statusUpdateFromEmail(
      type,
      token,
      studentId,
      courseId
    );

    res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    console.log("errorrr", error);
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};


const getAllStudent = async (req, res) => {
  try {
    const {
      page,
      limit,
      searchOnField,
      search = "",
      mainStatus = "",
      branchId,
      showAll,
      country,
      followUp,
      b2bId,
      filterUserId,
      updatedOn,
      startDate,
      endDate
    } = req.query;
    const currentUser = req.user;
    const result = await StudentApplicationServices.getAll(
      page,
      limit,
      searchOnField,
      search,
      currentUser,
      mainStatus,
      branchId,
      showAll,
      country,
      followUp,
      b2bId,
      filterUserId,
      updatedOn,
      startDate,
      endDate
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const downloadStudentExcel = async (req, res) => {
  try {
    const filters = req.query;
    const currentUser = req.user;

    const result = await StudentApplicationServices.downloadStudentApplication(
      filters,
      currentUser
    );

    if (!result.status) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      status: true,
      fileUrl: result.file,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getOneStudent = async (req, res) => {
  try {
    const result = await StudentApplicationServices.getById(req.params.id);

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const result = await StudentApplicationServices.delete(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const downloadDocuments = async (req, res) => {
  try {
    const { applicationId, documentIds } = req.params;
    const documents = await StudentApplicationServices.downloadDocuments(
      applicationId,
      documentIds
    );

    if (documents.length === 1) {
      const response = await axios.get(documents[0].filePath, {
        responseType: "stream",
      });

      res.setHeader("Content-Type", response.headers["content-type"]);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${documents[0].fileName}"`
      );
      return response.data.pipe(res);
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="documents-${applicationId}.zip"`
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(res);

    for (const doc of documents) {
      const response = await axios.get(doc.filePath, {
        responseType: "stream",
      });

      archive.append(response.data, {
        name: doc.fileName,
      });
    }

    await archive.finalize();
  } catch (error) {
    res.status(error.status ? 400 : 500).json({
      status: false,
      code: error.status ? 400 : 500,
      message: error.message || "Something went wrong",
    });
  }
};
const cloneStudentApplication = async (req, res) => {
  try {
    const { country } = req.query;
    const result = await StudentApplicationServices.cloneStudentApplication(
      req.params.id,
      country,
      req.user?.userId,
      req.user?.userName,
      req.body.invoice
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getstudentAccountant = async (req, res) => {
  try {
    const result = await StudentApplicationServices.getstudentAccountant(
      req.params.id
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const checkPendingDoc = async (req, res) => {
  try {
    const result = await StudentApplicationServices.checkPendingDoc(
      req.params.id
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const sendPendingDocumentsEmail = async (req, res) => {
  try {
    const result = await StudentApplicationServices.sendPendingDocumentsEmail(
      req.params.id,
      req.body.customDocumentList
    );
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getCoachingStudent = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      status,
      faculty,
      startDate,
      endDate,
      targetAchieved,
      branch,
      showAll
    } = req.query;
    const currentUser = req.user;
    const result = await StudentApplicationServices.getCoachingStudent(
      page,
      limit,
      search,
      currentUser,
      status,
      faculty,
      startDate,
      endDate,
      targetAchieved,
      branch,
      showAll
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getFollowupStudent = async (req, res) => {
  try {
    const { page, limit, search, date, country, type } = req.query;
    const result = await StudentApplicationServices.getFollowupStudent(
      page,
      limit,
      search,
      date,
      country,
      type
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const checkInstituteFeesDeadline = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!studentId) {
      return res.status(400).json({
        status: false,
        message: "Student ID is required",
      });
    }

    await checkInstituteFeeDeadline({
      studentId: req.params.studentId,
      triggeredBy: {
        source: "API",
        userId: req.user.userId,
        userName: req.user.userName,
      },
    });

    return res.status(200).json({
      status: true,
      code: 200,
      message: "Institute fee reminder sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  createStudent,
  updateStudent,
  getAllStudent,
  downloadStudentExcel,
  getOneStudent,
  deleteStudent,
  downloadDocuments,
  cloneStudentApplication,
  checkPendingDoc,
  sendPendingDocumentsEmail,
  getCoachingStudent,
  getFollowupStudent,
  getstudentAccountant,
  statusUpdateFromEmail,
  checkInstituteFeesDeadline,
};
