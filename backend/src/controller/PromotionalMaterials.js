const PromotionalMaterialsServices = require("../services/promotionalMaterial");
const { uploadToCloudinary } = require("../../middleware/cloudinary");

const create = async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.country) {
      throw { status: false, message: "Country is required" };
    }

    data.created_by = req.user?.userId;
    data.createdByName = req.user?.userName;

    const result = await PromotionalMaterialsServices.create(data);

    return res.status(201).json({
      status: true,
      code: 201,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const addFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { folderName } = req.body;
    const { userId, userName } = req.user;

    if (!folderName) {
      throw new Error("Folder name is required");
    }

    const result = await PromotionalMaterialsServices.addFolder(
      id,
      folderName,
      userId,
      userName
    );

    return res.status(200).json({
      status: true,
      message: "Folder added successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const addDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { materialName, folderName } = req.body;

    if (!materialName || !folderName) {
      throw new Error("Both folderName and materialName are required");
    }

    const files = req.files?.material;
    if (!files || !files.length) {
      throw new Error("At least one material file is required");
    }

    const uploadedLinks = [];

    if (files && files.length > 0) {
      for (const file of files) {
        // ✅ Get full local file path from multer
        const fullPath = file.path;

        // ✅ Extract relative path starting from "uploads"
        const uploadIndex = fullPath.indexOf("uploads");
        // const relativePath =
        //   uploadIndex !== -1
        //     ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
        //     : fullPath;

        const relativePath =
          uploadIndex !== -1
            ? "/" + fullPath.substring(uploadIndex).replace(/\\/g, "/")
            : fullPath.replace(/\\/g, "/");
            
        // ✅ Push relative path object to uploadedLinks array
        uploadedLinks.push({ link: relativePath });
      }
    }

    const result = await PromotionalMaterialsServices.addDocument(
      id,
      folderName,
      materialName,
      uploadedLinks,
      req.user?.userId,
      req.user?.userName
    );

    return res.status(200).json({
      status: true,
      message: "Material added successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const update = async (req, res) => {
  try {
    const data = req.body || {};
    const { id, docId, materialId } = req.query;

    const result = await PromotionalMaterialsServices.update(
      id,
      docId,
      materialId,
      data,
      req.files
    );

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id: materialId, docId, fileId } = req.params;

    const result = await PromotionalMaterialsServices.deleteDocument(
      materialId,
      docId,
      fileId
    );

    return res.status(200).json({
      status: true,
      code: 200,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getOne = async (req, res) => {
  try {
    const result = await PromotionalMaterialsServices.getOne(
      req.params.id,
      req.query.search
    );
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { page, limit, search = "" } = req.query;
    const result = await PromotionalMaterialsServices.getAll(
      page,
      limit,
      search
    );
    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: false,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  create,
  addFolder,
  addDocument,
  update,
  deleteDocument,
  getOne,
  getAll,
  deleteDocument,
};
