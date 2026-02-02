const Campaign = require("../../../model/waDaddy/campaign");
const { getApiSetup } = require("../../../helpers/wadaddyApi");
const axios = require("axios");
const MessageModel = require("../../../model/waDaddy/message");
const ContactModel = require("../../../model/waDaddy/contact");
const CampaignLogModel = require("../../../model/waDaddy/campaignLog");
const { sendTemplateMessage } = require("../../../utils/whatsappApi");
const { getTemplates } = require("../../services/waDaddy/template");

exports.sendBulkMessages = async (
  {
    name,
    fromNumberId,
    templateId,
    contactGroup,
    templateName,
    language,
    parameters,
  },
  user
) => {
  const template = await getTemplates();
  const templateDetails = template?.data?.data?.find(
    (template) => template.id === templateId
  );

  const message = templateDetails?.components;
  // let admin_id = user.userId;
  let campaign_created_by = user.userId;
  let createdByName = user.userName;

  const campaign = await Campaign.create({
    name,
    fromNumberId,
    templateId,
    templateName,
    message,
    contactGroup,
    parameters,
    status: "in_progress",
    // admin_id,
    campaign_created_by,
    createdByName,
  });

  const logs = [];

  for (let i = 0; i < contactGroup.length; i++) {
    const contact = contactGroup[i];
    const paramSet = parameters[i] || {};

    try {
      const result = await sendTemplateMessage(
        {
          to: contact,
          templateName,
          languageCode: language,
          components: {
            header: paramSet.header || null, // { type: 'text' | 'image' | 'video' | 'document', value: '...' }
            body: paramSet.body || null, // ['value1', 'value2']
          },
        },
        user
      );

      const status = result.status === 200 ? "SENT" : "FAILED";
      const messageId = result.data?.messages?.[0]?.id;

      await CampaignLogModel.create({
        campaignId: campaign._id,
        contact,
        status,
        messageId,
        date: new Date(),
        // admin_id,
        campaign_created_by,
        createdByName,
      });

      logs.push({ contact, status, messageId });
    } catch (err) {
      logs.push({
        contact,
        status: "FAILED",
        messageId: null,
        error: err.message,
      });
    }
  }
};

exports.getCampaignReport = async () => {
  return await CampaignLogModel.aggregate([
    {
      $lookup: {
        from: "wadaddycampaigns", // collection name in MongoDB (lowercase + plural by convention)
        localField: "campaignId",
        foreignField: "_id",
        as: "campaignInfo",
      },
    },
    {
      $unwind: "$campaignInfo",
    },
    {
      $group: {
        _id: {
          campaignName: "$campaignInfo.name",
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
        total: { $sum: 1 },
        sent: {
          $sum: {
            $cond: [{ $eq: ["$status", "SENT"] }, 1, 0],
          },
        },
        failed: {
          $sum: {
            $cond: [{ $eq: ["$status", "FAILED"] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        campaignName: "$_id.campaignName",
        date: "$_id.date",
        total: 1,
        sent: 1,
        failed: 1,
      },
    },
    {
      $sort: { date: -1 },
    },
  ]);
};
exports.getCampaignReports = async ({ campaignId, user }) => {
  const objectId = new mongoose.Types.ObjectId(campaignId);

  const match = { campaignId: objectId };

  const pipeline = [
    { $match: match },

    // Lookup campaign & contact
    {
      $lookup: {
        from: "campaigns",
        localField: "campaignId",
        foreignField: "_id",
        as: "campaign",
      },
    },
    { $unwind: "$campaign" },

    {
      $lookup: {
        from: "contacts",
        localField: "contact",
        foreignField: "phoneNumber",
        as: "contactData",
      },
    },
    { $unwind: { path: "$contactData", preserveNullAndEmptyArrays: true } },

    // Deduplicate after joins (keep first doc for each contact+messageId)
    {
      $group: {
        _id: { contact: "$contact", messageId: "$messageId" },
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },

    // Normalize status fields to lowercase for safe comparisons
    {
      $addFields: {
        status_lc: { $toLower: { $ifNull: ["$status", ""] } },
        whatsappStatus_lc: { $toLower: { $ifNull: ["$whatsappStatus", ""] } },
      },
    },

    {
      $facet: {
        groupedData: [
          {
            $group: {
              _id: {
                campaignId: "$campaignId",
                campaignName: "$campaign.name",
                message: "$campaign.message",
                date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              },
              logs: {
                $push: {
                  contact: "$contact",
                  status: "$status",
                  messageId: "$messageId",
                  date: "$date",
                  whatsappStatus: "$whatsappStatus",
                  whatsappStatusDate: "$whatsappStatusDate",
                  fullName: {
                    $cond: {
                      if: {
                        $and: [
                          { $ifNull: ["$contactData.fname", false] },
                          { $ifNull: ["$contactData.lname", false] },
                        ],
                      },
                      then: {
                        $concat: [
                          "$contactData.fname",
                          " ",
                          "$contactData.lname",
                        ],
                      },
                      else: "$contact",
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              campaignId: "$_id.campaignId",
              campaignName: "$_id.campaignName",
              message: "$_id.message",
              date: "$_id.date",
              logs: 1, // Return all logs without pagination
            },
          },
          { $sort: { date: 1 } },
        ],

        overallCounts: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              // Counts from `status` field (sent/failed)
              sent: {
                $sum: { $cond: [{ $eq: ["$status_lc", "sent"] }, 1, 0] },
              },
              failed: {
                $sum: { $cond: [{ $eq: ["$status_lc", "failed"] }, 1, 0] },
              },
              // Counts from `whatsappStatus` field (delivered/read/failed)
              delivered: {
                $sum: {
                  $cond: [{ $eq: ["$whatsappStatus_lc", "delivered"] }, 1, 0],
                },
              },
              read: {
                $sum: {
                  $cond: [{ $eq: ["$whatsappStatus_lc", "read"] }, 1, 0],
                },
              },
              whatsappFailed: {
                $sum: {
                  $cond: [{ $eq: ["$whatsappStatus_lc", "failed"] }, 1, 0],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              total: 1,
              sent: 1,
              failed: 1,
              delivered: 1,
              read: 1,
              whatsappFailed: 1,
            },
          },
        ],
      },
    },
  ];

  const result = await CampaignLogModel.aggregate(pipeline);
  const { groupedData, overallCounts } = result[0];

  return {
    data: groupedData,
    counts: overallCounts[0] || {
      total: 0,
      sent: 0,
      failed: 0,
      delivered: 0,
      read: 0,
      whatsappFailed: 0,
    },
  };
};
exports.fetchLogsByCampaignId = async (campaignId) => {
  return await CampaignLogModel.find({ campaignId }).sort({ date: -1 });
};

exports.getDashboardCounts = async () => {
  const summary = await CampaignLogModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return summary.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
};

exports.getAllCampaign = async () => {
  try {
    let query = {};
    // if (user.type === "Admin") {
    //   query = { admin_id: user._id };
    // } else if (user.type === "Admin2") {
    //   query = { admin_id: user.main_admin_id };
    // }

    // Fetch campaigns
    const campaigns = await Campaign.find(query)
      // .populate("campaign_created_by", "name")
      .sort({ createdAt: -1 })
      .lean();

    if (!campaigns.length) {
      return {
        success: false,
        message: "No campaign found",
        status: 404,
      };
    }

    // Get all campaignIds to query CampaignLog
    const campaignIds = campaigns.map((c) => c._id);

    const logCounts = await CampaignLogModel.aggregate([
      { $match: { campaignId: { $in: campaignIds } } },
      {
        $group: {
          _id: "$campaignId",
          sent: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
          delivered: {
            $sum: { $cond: [{ $eq: ["$whatsappStatus", "delivered"] }, 1, 0] },
          },
        },
      },
    ]);

    // convert result into map
    const countsMap = {};
    for (const r of logCounts) {
      countsMap[r._id.toString()] = {
        sent: r.sent || 0,
        failed: r.failed || 0,
        delivered: r.delivered || 0,
      };
    }

    // Merge counts into campaign data
    const enrichedCampaigns = campaigns.map((campaign) => ({
      ...campaign,
      sentCount: countsMap[campaign._id.toString()]?.sent || 0,
      failedCount: countsMap[campaign._id.toString()]?.failed || 0,
    }));

    return {
      success: true,
      message: "Campaigns found",
      status: 200,
      data: enrichedCampaigns,
    };
  } catch (error) {
    console.error("Error in getAllCampaign:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
};

exports.sendSingleMessage = async (
  {
    to,
    templateId,
    templateName,
    fromNumberId,
    languageCode,
    parameters, // { header, body, footer, buttons }
  },
  user
) => {
  // Step 1: Get template
  const template = await getTemplates();
  let templateDetails;

  if (templateId) {
    templateDetails = template?.data?.find((tpl) => tpl.id === templateId);
  } else if (templateName) {
    templateDetails = template?.data?.find((tpl) => tpl.name === templateName);
  }

  const message = templateDetails.components;

  // Step 2: Prepare formattedComponents
  const formattedComponents = [];

  // Header
  if (parameters.header) {
    const { type, value, filename } = parameters.header;
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

  // Body (POSITIONAL)
  if (Array.isArray(parameters.body) && parameters.body.length > 0) {
    formattedComponents.push({
      type: "body",
      parameters: parameters.body.map((text) => ({
        type: "text",
        text,
      })),
    });
  }

  // Footer (optional - not dynamic)
  if (parameters.footer) {
    formattedComponents.push({
      type: "footer",
      parameters: [{ type: "text", text: parameters.footer }],
    });
  }

  // Buttons (only Quick Reply supports parameters)
  if (Array.isArray(parameters.buttons) && parameters.buttons.length > 0) {
    formattedComponents.push({
      type: "button",
      sub_type: "quick_reply",
      index: "0",
      parameters: parameters.buttons.map((btn) => ({
        type: "payload",
        payload: btn.payload,
      })),
    });
  }

  // Step 3: Call WhatsApp API
  const data = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: formattedComponents,
    },
  };

  const config = await getApiSetup();
  const headers = {
    Authorization: `Bearer ${config.token}`,
    'Content-Type': 'application/json',
  };

  let response;
try {
  response = await axios.post(
    `${config.baseUrl}/${config.apiVersion}/${config.phoneNumberId}/messages`,
    data,
    { headers }
  );
  
} catch (error) {
  console.error("Axios Request Failed:", error.response?.data || error.message);
  throw error; // re-throw if you want upstream handling
}


  const messageId = response.data?.messages?.[0]?.id;
  const status = response.status === 200 ? "sent" : "failed";
  // let admin_id = user.userId;
  //   if (user.type == "Admin") {
  //     admin_id = user._id;
  //   } else if (user.type == "Admin2") {
  //     admin_id = user.main_admin_id;
  //   }
  try {
    const contact = await ContactModel.findOneAndUpdate(
      { phoneNumber: to },
      { lastMessageTime: new Date() },
      { new: true }
    );

    // if (!contact) {
    //   console.warn(`⚠️ Contact not found for number: ${to}`);
    // }
  } catch (err) {
    console.warn(`⚠️ Failed to update contact: ${err.message}`);
  }

  // Step 4: Save log
  // await CampaignLogModel.create({
  //   campaignId: null,
  //   contact: to,
  //   status,
  //   messageId,
  //   date: new Date(),
  //   type: "single",
  //   templateName,
  //   message,
  //   admin_id,
  // });
  await MessageModel.create({
    to: to,
    from: user?.registeredNumber,
    text: "Single Template Message send",
    type: "single_template",
    status,
    messageId,
    timestamp: new Date(),
    direction: "outbound",
    templateName,
    // admin_id,
  });

  return {
    status,
    messageId,
  };
};
