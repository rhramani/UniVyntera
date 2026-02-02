const axios = require("axios");

// Chatbox
const { getApiSetup } = require("../helpers/chatboxApi");

const MessageModel = require("../model/chatbox/message");
const ContactModel = require("../model/waDaddy/contact");

exports.sendTemplateMessage = async (
  { to, templateName, languageCode, components = {} },
  user
) => {
  let admin_id = user.userId;
  const config = await getApiSetup();
  const url = `${config.chatboxUrl}/${config.wabaId}/messages`;

  const headers = {
    apikey: `${config.apikey}`,
    "Content-Type": "application/json",
  };

  const formattedComponents = [];

  // Header
  if (components.header) {
    const { type, value, filename } = components.header;
    const headerObj = { type: "header", parameters: [] };

    if (type === "text") {
      headerObj.parameters.push({ type: "text", text: value });
    } else if (type === "image") {
      headerObj.parameters.push({ type: "image", image: { id: value } });
    } else if (type === "video") {
      headerObj.parameters.push({ type: "video", video: { id: value } });
    } else if (type === "document") {
      headerObj.parameters.push({
        type: "document",
        document: { id: value, filename },
      });
    }

    formattedComponents.push(headerObj);
  }

  // Body

  let plainTextBody = "";
  if (
    components.body &&
    Array.isArray(components.body) &&
    components.body.length > 0
  ) {
    plainTextBody = components.body.join(" ");
    formattedComponents.push({
      type: "body",
      parameters: components.body.map((text) => ({ type: "text", text })),
    });
  }

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: formattedComponents,
    },
  };

  try {
    const result = await axios.post(url, data, { headers });

    if (result.status === 200) {
      const messageId = result.data?.messages?.[0]?.id;
      // Update lastMessageTime for the contact
      await ContactModel.findOneAndUpdate(
        { phoneNumber: to, admin_id: admin_id },
        { lastMessageTime: new Date() },
        { new: true }
      );
      await MessageModel.create({
        from: user.registeredNumber,
        to,
        messageId,
        text: plainTextBody || `${templateName} sent`,
        type: "template", // Use correct type
        direction: "outbound",
        timestamp: new Date(),
        wabaId: user.wabaId,
        phoneNumberId: user.phoneNumberId,
        admin_id: user.type === "Admin" ? user._id : user.main_admin_id,
        status: "sent",
      });
      return result;
    }
  } catch (error) {
    console.log(
      "Error sending template message:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

// WaDaddy
// const { getApiSetup } = require("../helpers/wadaddyApi");

// const MessageModel = require("../model/waDaddy/message");
// const ContactModel = require("../model/waDaddy/contact");

// exports.sendTemplateMessage = async (
//   { to, templateName, languageCode, components = {} },
//   user
// ) => {
//   let admin_id = user.userId;
//   const config = await getApiSetup();
//   const url = `${config.chatboxUrl}/${config.wabaId}/messages`;

//   const headers = {
//     apikey: `${config.apikey}`,
//     "Content-Type": "application/json",
//   };

//   const formattedComponents = [];

//   // Header
//   if (components.header) {
//     const { type, value, filename } = components.header;
//     const headerObj = { type: "header", parameters: [] };

//     if (type === "text") {
//       headerObj.parameters.push({ type: "text", text: value });
//     } else if (type === "image") {
//       headerObj.parameters.push({ type: "image", image: { id: value } });
//     } else if (type === "video") {
//       headerObj.parameters.push({ type: "video", video: { id: value } });
//     } else if (type === "document") {
//       headerObj.parameters.push({
//         type: "document",
//         document: { id: value, filename },
//       });
//     }

//     formattedComponents.push(headerObj);
//   }

//   // Body

//   let plainTextBody = "";
//   if (
//     components.body &&
//     Array.isArray(components.body) &&
//     components.body.length > 0
//   ) {
//     plainTextBody = components.body.join(" ");
//     formattedComponents.push({
//       type: "body",
//       parameters: components.body.map((text) => ({ type: "text", text })),
//     });
//   }

//   const data = {
//     messaging_product: "whatsapp",
//     recipient_type: "individual",
//     to,
//     type: "template",
//     template: {
//       name: templateName,
//       language: { code: languageCode },
//       components: formattedComponents,
//     },
//   };

//   try {
//     const result = await axios.post(url, data, { headers });

//     if (result.status === 200) {
//       const messageId = result.data?.messages?.[0]?.id;
//       // Update lastMessageTime for the contact
//       await ContactModel.findOneAndUpdate(
//         { phoneNumber: to, admin_id: admin_id },
//         { lastMessageTime: new Date() },
//         { new: true }
//       );
//       await MessageModel.create({
//         from: user.registeredNumber,
//         to,
//         messageId,
//         text: plainTextBody || `${templateName} sent`,
//         type: "template", // Use correct type
//         direction: "outbound",
//         timestamp: new Date(),
//         wabaId: user.wabaId,
//         phoneNumberId: user.phoneNumberId,
//         admin_id: user.type === "Admin" ? user._id : user.main_admin_id,
//         status: "sent",
//       });
//       return result;
//     }
//   } catch (error) {
//     console.log(
//       "Error sending template message:",
//       error?.response?.data || error.message
//     );
//     throw error;
//   }
// };
