const visitorApplicationService = require("../../services/visitorApplication/visitorApplication");

const { uploadToCloudinary } = require("../../../middleware/cloudinary");
const archiver = require("archiver");
const axios = require("axios");

const create = async (req, res) => {
  try {
    const { userId, userName, userType, b2bName, branch } = req.user;

    const branchName =
      typeof branch === "object" && branch !== null ? branch.name : branch;

    let categoryDetails = req.body.categoryDetails;

    if (typeof categoryDetails === "string") {
      categoryDetails = JSON.parse(categoryDetails);
    }
    // if (req.files?.categoryDoc?.[0]) {
    //   const cloudinaryRes = await uploadToCloudinary(
    //     req.files.categoryDoc[0].buffer,
    //     req.files.categoryDoc[0].mimetype,
    //     "categoryDoc"
    //   );
    //   categoryDetails.document = cloudinaryRes.secure_url;
    // }

    // if (req.files && req.files.categoryDoc) {
    //   const files = Array.isArray(req.files.categoryDoc)
    //     ? req.files.categoryDoc
    //     : [req.files.categoryDoc];

    //   if (Array.isArray(categoryDetails)) {
    //     for (let i = 0; i < files.length; i++) {
    //       const file = files[i];

    //       const uploadRes = await uploadToCloudinary(
    //         file.buffer,
    //         file.mimetype,
    //         "categoryDoc"
    //       );

    //       if (categoryDetails[i]) {
    //         categoryDetails[i].document = uploadRes.secure_url;
    //       }
    //     }
    //   }
    // }

    if (req.files && req.files.categoryDoc) {
      const files = Array.isArray(req.files.categoryDoc)
        ? req.files.categoryDoc
        : [req.files.categoryDoc];

      if (Array.isArray(categoryDetails)) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // ✅ Get full local file path (multer gives this)
          const fullPath = file.path;

          // ✅ Extract relative path from "uploads" for consistency
          const uploadIndex = fullPath.indexOf("uploads");
          const relativePath =
            uploadIndex !== -1
              ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
              : fullPath;

          // ✅ Assign relative path to categoryDetails[i]
          if (categoryDetails[i]) {
            categoryDetails[i].document = relativePath;
          }
        }
      }
    }

    req.body.categoryDetails = categoryDetails;
    const result = await visitorApplicationService.create(
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

const update = async (req, res) => {
  try {
    const files = req.files?.uploadedDocument;
    const categoryDoc = req.files?.categoryDoc;
    const { userId, userName } = req.user;

    const result = await visitorApplicationService.update(
      req.params.id,
      req.body,
      userId,
      userName,
      files,
      categoryDoc
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

const getAll = async (req, res) => {
  try {
    const {
      page,
      limit,
      search = "",
      mainStatus = "",
      branchId,
      showAll,
      country,
      followUp,
    } = req.query;
    const currentUser = req.user;
    const result = await visitorApplicationService.getAll(
      page,
      limit,
      search,
      currentUser,
      mainStatus,
      branchId,
      showAll,
      country,
      followUp
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    console.log("errorr", error);
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getOne = async (req, res) => {
  try {
    const result = await visitorApplicationService.getOne(req.params.id);

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

const deleteData = async (req, res) => {
  try {
    const result = await visitorApplicationService.delete(
      req.params.id,
      req.body
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
    const { visitorId, documentIds } = req.params;
    const documents = await visitorApplicationService.downloadDocuments(
      visitorId,
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
      `attachment; filename="documents-${visitorId}.zip"`
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

const cloneVisitorApplication = async (req, res) => {
  try {
    const { country } = req.query;
    const result = await visitorApplicationService.cloneVisitorApplication(
      req.params.id,
      country,
      req.user?.userId
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
    const result = await visitorApplicationService.checkPendingDoc(
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
    const result = await visitorApplicationService.sendPendingDocumentsEmail(
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

module.exports = {
  create,
  update,
  getAll,
  getOne,
  deleteData,
  downloadDocuments,
  cloneVisitorApplication,
  checkPendingDoc,
  sendPendingDocumentsEmail,
};
