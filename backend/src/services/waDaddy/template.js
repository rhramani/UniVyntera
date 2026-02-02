const axios = require("axios");
const { getApiSetup } = require("../../../helpers/wadaddyApi");

exports.getTemplates = async (category) => {
  const config = await getApiSetup();
  const url = `${config.baseUrl}/${config.apiVersion}/${config.wabaId}/message_templates`;
  // console.log("Requesting URL:", url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
    });
    let templates = response.data.data || []; // Adjust if needed

    // If category is provided, filter templates by case-insensitive match
    if (category) {
      const categoryLower = category.toLowerCase();
      templates = templates.filter(
        (template) =>
          template.category && template.category.toLowerCase() === categoryLower
      );
    }
    return { data: templates };
  } catch (err) {
    console.error("❌ Axios Error:", err.message);

    if (err.response) {
      console.error(
        "❌ Error Response Data:",
        JSON.stringify(err.response.data, null, 2)
      );
      console.error("❌ Status Code:", err.response.status);
      console.error("❌ Headers:", err.response.headers);
    } else if (err.request) {
      console.error("❌ No response received:", err.request);
    } else {
      console.error("❌ Error setting up request:", err.message);
    }

    throw new Error(
      err.response?.data?.error?.message || "Failed to fetch templates"
    );
  }
};

exports.createTemplate = async (data) => {
  const config = await getApiSetup();

  const url = `${config.baseUrl}/${config.apiVersion}/${config.wabaId}/message_templates`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Template created:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ Error Response:",
        JSON.stringify(error.response.data, null, 2)
      );
      throw new Error(JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
      throw new Error("No response received from Meta API");
    } else {
      console.error("❌ Error setting up request:", error.message);
      throw new Error(error.message);
    }
  }
};

exports.deleteTemplate = async (templateName) => {
  const config = await getApiSetup();
  // const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
  // const TOKEN = process.env.WHATSAPP_TOKEN;

  try {
    const response = await axios.delete(
      `${config.baseUrl}/${config.apiVersion}/${config.wabaId}/message_templates`,
      {
        params: { name: templateName },
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Failed to delete template"
    );
  }
};
