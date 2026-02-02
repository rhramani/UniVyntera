const configurationServices = require("../services/configuration");
const Configuration = require("../../model/configuration");


const create = async (req, res) => {
  try {

    const data = req.body;
    const { userId , userName } = req.user;

    if(typeof data.cloudinary === "string") {
      try {
        data.cloudinary = JSON.parse(data.cloudinary);
      } catch (err) {
        console.log("Invalid cloudinary JSON:", err);
      }
    }

    if(typeof data.nodemailer === "string") {
        try {
        data.nodemailer = JSON.parse(data.nodemailer);
      } catch (err) {
        console.log("Invalid nodemailer JSON:", err);
      }
    }

    if(req.files && req.files.gmailTopLogo && req.files.gmailTopLogo.length > 0){
      const fullPath = req.files.gmailTopLogo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");

      data.gmail = data.gmail || {};
      data.gmail.topLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    if(req.files && req.files.gmailBottomLogo && req.files.gmailBottomLogo.length > 0){
      const fullPath = req.files.gmailBottomLogo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");

      data.gmail = data.gmail || {};
      data.gmail.bottomLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

  if(req.files && req.files.invoiceLogo && req.files.invoiceLogo.length > 0){
      const fullPath = req.files.invoiceLogo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");

      data.invoiceLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    data.created_by = userId;
    data.createdByName = userName;

    const result = await configurationServices.create(data);

    return res.status(201).json({
      status: true,
      code: 201,
      message: result,
    });
  } catch (error) {
    console.log("error" , error);
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const update = async (req, res) => {
  try {
    let updateData = req.body;
    const { userId, userName } = req.user;

    // Parse JSON strings if nested objects are sent as strings
    if (typeof updateData.cloudinary === "string") {
      try {
        updateData.cloudinary = JSON.parse(updateData.cloudinary);
      } catch (err) {
        console.log("Invalid cloudinary JSON:", err);
      }
    }

    if (typeof updateData.nodemailer === "string") {
      try {
        updateData.nodemailer = JSON.parse(updateData.nodemailer);
      } catch (err) {
        console.log("Invalid nodemailer JSON:", err);
      }
    }

    // Get existing config
    const existingConfig = await Configuration.findById(req.params.id);
    if (!existingConfig) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Configuration not found",
      });
    }

    // --- Merge instead of overwrite ---
    updateData.cloudinary = {
      ...(existingConfig.cloudinary || {}),
      ...(updateData.cloudinary || {}),
    };

    updateData.nodemailer = {
      ...(existingConfig.nodemailer || {}),
      ...(updateData.nodemailer || {}),
    };

    updateData.gmail = {
      ...(existingConfig.gmail || {}),
      ...(updateData.gmail || {}),
    };

    updateData.uniCommissionInvoice = {
      ...(existingConfig.uniCommissionInvoice?.toObject?.() || {}),
      ...(updateData.uniCommissionInvoice || {}),
      bankDetails: {
         ...(existingConfig.uniCommissionInvoice?.bankDetails  || {}),
      ...(updateData.uniCommissionInvoice?.bankDetails  || {}),
      }
    };

     updateData.b2bInvoice = {
      ...(existingConfig.b2bInvoice?.toObject?.() || {}),
      ...(updateData.b2bInvoice || {}),
    };

    updateData.applicationFeeInvoice = {
      ...(existingConfig.applicationFeeInvoice?.toObject?.() || {}),
      ...(updateData.applicationFeeInvoice || {}),
      bankDetails: {
         ...(existingConfig.applicationFeeInvoice?.bankDetails  || {}),
      ...(updateData.applicationFeeInvoice?.bankDetails  || {}),
      }
    };

    // Handle file uploads
    if (req.files && req.files.gmailTopLogo && req.files.gmailTopLogo.length > 0) {
      const fullPath = req.files.gmailTopLogo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      updateData.gmail.topLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    if (req.files && req.files.gmailBottomLogo && req.files.gmailBottomLogo.length > 0) {
      const fullPath = req.files.gmailBottomLogo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      updateData.gmail.bottomLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    if (req.files && req.files.invoiceLogo && req.files.invoiceLogo.length > 0) {
      const fullPath = req.files.invoiceLogo[0].path;
      const uploadIndex = fullPath.indexOf("uploads");
      updateData.invoiceLogo =
        uploadIndex !== -1
          ? fullPath.substring(uploadIndex).replace(/\\/g, "/")
          : fullPath;
    }

    

    // // Audit fields
    // updateData.updated_by = userId;
    // updateData.updatedByName = userName;

    // Update only fields provided (merge style)
    const result = await configurationServices.update (
      req.params.id,
      updateData,
      userId, 
      userName
    );

    return res.status(200).json({
      status: true,
      code: 200,
      message: result,
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
    const result = await configurationServices.getAll();

    return res.status(200).json({
      status: true,
      code: 200,
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getVoiceAIConfig = async (req, res) => {
  try {
    const result = await configurationServices.getVoiceAIConfig();

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getCTCCredentials = async (req, res) => {
  try{
    const result = await configurationServices.getCTCCredentials();
     return res.status(200).json({
      status: true,
      code: 200,
      data: result
     })
  }catch(error) {
     return res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
}


module.exports = {
  create,
  update,
  getAll,
  getVoiceAIConfig,
  getCTCCredentials
};
