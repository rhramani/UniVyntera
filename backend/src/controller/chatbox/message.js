const axios = require("axios");
const Message = require("../../../model/chatbox/message");
const { getApiSetup } = require("../../../helpers/chatboxApi");
const contactModel = require("../../../model/waDaddy/contact");
const { getIO,wadaddyNamespace } = require("../../../socket");

exports.sendMessage = async (req, res) => {
  const { to, text } = req.body;
  const user = req.user;

  const config = await getApiSetup();

  // let admin_id = user.userId;
  let createdByName = user.userName;

  const url = `${config.chatboxUrl}/${config.phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    "preview_url": false,
    recipient_type: "individual",
    to,
    type: "text",
    text: {
      body: text,
    },
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        apikey: `${config.apikey}`,
        "Content-Type": "application/json",
      },
    });
    const messageId = response.data.messages?.[0]?.id;

    const saved = await Message.create({
      from: config.registeredNumber,
      to,
      text,
      type: "text",
      messageId,
      timestamp: new Date(),
      direction: "outbound",
      wabaId: config.wabaId,
      phoneNumberId: config.phoneNumberId,
      // admin_id: admin_id,
      createdByName,
    });

    await contactModel.findOneAndUpdate(
      { phoneNumber: to },
      { lastMessageTime: new Date() },
      { new: true }
    );
    // const io = getIO();
    // Optional: emit to Socket.IO
    // io.emit("new-message", saved);
    // res.status(200).json({
    //   status: true,
    //   code: 200,
    //   data: saved,
    // });
    // const wadaddyNamespace = getWadaddyNamespace();

    // wadaddyNamespace.to("all-users").emit("new-message", saved);

    res.status(200).json({
      status: true,
      code: 200,
      data: saved,
    });
  } catch (error) {
    console.log("=-----error---",error)
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

// exports.getChatMessages = async (req, res) => {
//   try {
//     const { phoneNumber } = req.body;
//     // const user = req.user;

//     if (!phoneNumber) {
//       return res.status(400).json({ message: "Phone number is required" });
//     }

//     // const admin_id = user.userId;
//     const contact = await contactModel.findOneAndUpdate(
//       {
//         phoneNumber,
//         // admin_id,
//       },
//       {
//         newMessage: false,
//       }
//     );

//     const msgs = await Message.find({
//       // admin_id,
//       $or: [{ to: phoneNumber }, { from: phoneNumber }],
//     }).lean();

//     const normalized = msgs.map((msg) => ({
//       _id: msg._id,
//       from: msg.from,
//       to: msg.to,
//       text: msg.type === "template" ? "Template sent via campaign" : msg.text,
//       type: msg.type,
//       direction: msg.direction,
//       timestamp: msg.timestamp,
//       // make status lowercase and guard against undefined/null
//       status: (msg.status || "").toString().toLowerCase() || null,
//       // preserve any other useful fields if needed
//       messageId: msg.messageId || null,
//     }));

//     // Sort by timestamp (oldest -> newest). For newest-first use (b - a).
//     normalized.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//     res.status(200).json({
//       status: true,
//       code: 200,
//       data: normalized,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       code: 500,
//       message: error.message || "Something went wrong",
//     });
//   }
// };
exports.getChatMessages = async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    // const user = req.user;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // const admin_id = user.type === "Admin" ? user._id : user.main_admin_id;

    const contact = await contactModel.findOneAndUpdate(
      {
        phoneNumber,
        // admin_id,
      },
      {
        newMessage: false,
      }
    );

    // Fetch only from Message collection
    const msgs = await Message.find({
      // admin_id,
      $or: [{ to: phoneNumber }, { from: phoneNumber }],
    }).lean();

    // Normalize messages for frontend
    const normalized = msgs.map((msg) => ({
      _id: msg._id,
      from: msg.from,
      to: msg.to,
      text: msg.type === "template" ? "Template sent via campaign" : msg.text,
      type: msg.type,
      direction: msg.direction,
      timestamp: msg.timestamp,
      // make status lowercase and guard against undefined/null
      status: (msg.status || "").toString().toLowerCase() || null,
      // preserve any other useful fields if needed
      messageId: msg.messageId || null,
    }));

    // Sort by timestamp (oldest -> newest). For newest-first use (b - a).
    normalized.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return res.json({ messages: normalized });
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
