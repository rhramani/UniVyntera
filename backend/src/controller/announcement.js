const announcementServices = require("../services/announcement");
const { uploadToCloudinary } = require("../../middleware/cloudinary");

const sendAnnouncement = async (req, res) => {
    try {
        const data = req.body;
        const { userId, userName , role} = req.user;
      console.log("roleee" ,req.user);
        // if (req.files?.material?.[0]) {
        //     const file = req.files.material[0];
        //     const cloudinaryRes = await uploadToCloudinary(file.buffer, file.mimetype, "announcement", file.originalname)
        //      data.fileUrl = cloudinaryRes.secure_url;
        // }
        if(req.files && req.files?.material && req.files?.material?.length > 0){
            const fullPath = req.files.material[0].path;
            const uploadIndex = fullPath.indexOf("uploads");
            data.fileUrl = uploadIndex !== -1 ? fullPath.substring(uploadIndex).replace(/\\/g, "/") : fullPath;
        }
        const result = await announcementServices.sendAnnouncementMail(data, userId, userName , role);

        return res.status(200).json({
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

}

const getHistory = async (req, res) => {
    try {
        const {page , limit , search = "" , role} = req.query;

        const result = await announcementServices.getHistory(page , limit , search, role);

         return res.status(200).json({
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
}

const deleteHistory = async (req,res) => {
    try {
        const { id } = req.params;
        const result = await announcementServices.delete(id);

         return res.status(200).json({
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
}

const uploadMedia = async (req, res) => {
  try {
    let imageUrl = null;
    let fileUrl = null;

    // Process image upload
    if (req.files?.messageImage?.length > 0) {
      const file = req.files.messageImage[0];
      const fullPath = file.path;
      const uploadIndex = fullPath.indexOf("uploads");
      imageUrl = fullPath.substring(uploadIndex);
    }

    // Process file upload
    if (req.files?.messageFile?.length > 0) {
      const file = req.files.messageFile[0];
      const fullPath = file.path; 
      const uploadIndex = fullPath.indexOf("uploads");
      fileUrl = fullPath.substring(uploadIndex);
    }

    return res.status(201).json({
      status: true,
      message: "Media uploaded successfully",
      imageUrl,
      fileUrl,
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
    sendAnnouncement,
    getHistory,
    deleteHistory,
    uploadMedia
}