const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const mime = require("mime-types");

const { getApiSetup } = require("../../../helpers/wadaddyApi");

exports.uploadMediaToMeta = async (filePath) => {
  const form = new FormData();
  const mimeType = mime.lookup(filePath);

  if (!mimeType) {
    throw new Error("Unable to detect file MIME type.");
  }
  form.append("file", fs.createReadStream(filePath));
  form.append("type", mimeType);

  try {
    const config = await getApiSetup();

    const url = `${config.baseUrl}/${config.apiVersion}/${config.phoneNumberId}/media?messaging_product=whatsapp`;

    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${config.token}`,
      },
    });
  
    console.log("✅ Media uploaded:", response.data);
    return response.data.id;
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ Meta API Error:",
        JSON.stringify(error.response.data, null, 2)
      );
      throw new Error(JSON.stringify(error.response.data));
    } else {
      console.error("❌ Upload failed:", error.message);
      throw new Error("Failed to upload media");
    }
  }
};
