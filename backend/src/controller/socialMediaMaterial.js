const SocialMediaMaterialsServices = require("../services/socialMediaMaterial");
const { uploadToCloudinary } = require("../../middleware/cloudinary");

const create = async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.country) {
      throw { status: false, message: "Country is required" };
    }

    data.created_by = req.user?.userId;
    data.createdByName = req.user?.userName;

    const result = await SocialMediaMaterialsServices.create(data);

    return res.status(200).json({
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

const addDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { materialName } = req.body;

    if (!materialName) {
      throw new Error("Material name is required");
    }

    const files = req.files?.material;
    if (!files || !files.length) {
      throw new Error("At least one material file is required");
    }

    // Upload to Cloudinary
    const uploadedLinks = [];
    // for (const file of files) {
    //   const uploadRes = await uploadToCloudinary(file.buffer, file.mimetype, "socialMedia-materials");
    //   uploadedLinks.push(uploadRes.secure_url);
    // }

    if (files && files.length > 0) {
      for (const file of files) {
        // ✅ Get full local file path from multer
        const fullPath = file.path;

        // ✅ Extract relative path from "uploads" (for consistent URLs)
        const uploadIndex = fullPath.indexOf("uploads");
        // const relativePath =
        //   uploadIndex !== -1
        //     ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
        //     : fullPath;

        const relativePath =
          uploadIndex !== -1
            ? "/" + fullPath.substring(uploadIndex).replace(/\\/g, "/")
            : fullPath.replace(/\\/g, "/");

        // ✅ Push relative path to array
        uploadedLinks.push(relativePath);
      }
    }

    const result = await SocialMediaMaterialsServices.addDocument(
      id,
      {
        name: materialName,
        urls: uploadedLinks,
      },
      req.user?.userId,
      req.user?.userName
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
const update = async (req, res) => {
  try {
    const data = req.body || {};
    const { id, docId } = req.query;

    const result = await SocialMediaMaterialsServices.update(
      id,
      docId,
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

    const result = await SocialMediaMaterialsServices.deleteDocument(
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
    const result = await SocialMediaMaterialsServices.getOne(
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
    const result = await SocialMediaMaterialsServices.getAll(
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
  addDocument,
  update,
  deleteDocument,
  getOne,
  getAll,
  deleteDocument,
};
