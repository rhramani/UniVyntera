const settingServices = require("../services/settings");
const { uploadToCloudinary } = require("../../middleware/cloudinary");

const create = async (req, res) => {
  try {
    let data = {};

    // if(req.files?.logo?.[0]){
    //   const cloudinaryRes = await uploadToCloudinary(req.files.logo[0].buffer ,req.files.logo[0].mimetype, "settings" );
    //   data.dashboardLogo = cloudinaryRes.secure_url;
    // }
    if (req.files && req.files?.logo && req.files?.logo?.length > 0) {
      const fullPath = req.files.logo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.dashboardLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }
    //  if(req.files?.loginPageLogo?.[0]){
    //     const cloudinaryRes = await uploadToCloudinary(req.files.loginPageLogo?.[0].buffer , req.files.loginPageLogo?.[0].mimetype,"settings");
    //     data.loginPageLogo = cloudinaryRes.secure_url;
    //   }
    if (
      req.files &&
      req.files?.loginPageLogo &&
      req.files?.loginPageLogo?.length > 0
    ) {
      const fullPath = req.files.logo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.loginPageLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }
    const { userId, userName } = req.user;
    data.created_by = userId;
    data.createdByName = userName;
    data.logoSize = req.body.logoSize;
    const result = await settingServices.create(data);

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
    let data = {};
    const id = req.params.id;
    const { userId, userName } = req.user;
    // if (req.files?.logo?.[0]) {
    //   const cloudinaryRes = await uploadToCloudinary(
    //     req.files.logo[0].buffer,
    //     req.files.logo[0].mimeType,
    //     "settings"
    //   );
    //   data.dashboardLogo = cloudinaryRes.secure_url;
    // }
    // if (req.files && req.files?.logo && req.files?.logo?.length > 0) {
    //   const fullPath = req.files.logo[0].path;
    //   const uploadIndex = fullPath.indexOf("uploads");
    //   data.dashboardLogo =
    //     uploadIndex !== -1
    //       ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
    //       : fullPath;
    // }

    if (req.files && req.files?.logo && req.files?.logo?.length > 0) {
      const fullPath = req.files.logo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.dashboardLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }
     if (
      req.files &&
      req.files?.loginPageLogo &&
      req.files?.loginPageLogo?.length > 0
    ) {
      const fullPath = req.files.logo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      data.loginPageLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }
    data.updated_by = userId;
    data.updatedByName = userName;
    data.logoSize = req.body.logoSize;

    const result = await settingServices.update(id, data);

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
    const result = await settingServices.getAll();
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
    const result = await settingServices.delete(req.params.id);
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
  deleteData,
};
