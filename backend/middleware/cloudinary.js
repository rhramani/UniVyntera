const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require("path");

const Configuration = require("../model/configuration");

require("dotenv").config();

// Cloudinary Config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const loadCloudinaryConfig = async () => {
  const config = await Configuration.findOne().lean();

  if (!config || !config.cloudinary) {
    throw new Error("❌ No Cloudinary config found in DB");
  }

  const { cloudName, apiKey, apiSecret } = config.cloudinary;
  
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return cloudinary;
};

/**
 * Upload file (image or pdf) to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 * @param {string} folder
 * @param {string|null} customFileName
 */
const uploadToCloudinary = async (
  fileBuffer,
  mimeType,
  folder = "crm-uploads",
  customFileName = null
) => {
  const isImage = mimeType.startsWith("image/");

  const isRawFile = [
    "application/pdf",
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ].includes(mimeType);

  const resourceType = isImage ? "image" : isRawFile ? "raw" : "auto";

  let publicId;
  if (customFileName) {
    const ext = path.extname(customFileName);
    if (mimeType === "application/pdf") {
      publicId = customFileName.replace(ext, "");
    } else {
      publicId = customFileName;
    }
  }

  const cloudinaryInstance = await loadCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryInstance.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
        public_id: publicId,
        overwrite: false,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    throw new Error("Cloudinary deletion failed: " + error.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
