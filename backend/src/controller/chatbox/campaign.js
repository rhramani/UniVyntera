const campaignService = require("../../services/chatbox/campaign");
const Campaign = require("../../../model/chatbox/campaign");
const dashboardService = require("../../services/chatbox/dashboardService.js")
// exports.sendCampaign = async (req, res) => {
//   try {
//     const user = req.user;
//     const result = await campaignService.sendBulkMessages(req.body, user);

//     res.json({ success: true, result });
//   } catch (err) {
//     console.log("errorr" , err);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.sendCampaign = async (req, res) => {
  try {
    const user = req.user;
    const { scheduledAt } = req.body;
    
    let result;
    if (scheduledAt) {
      // Save campaign as scheduled
      const campaign = await Campaign.create({
        ...req.body,
        status: "scheduled",
        scheduledAt,
        // admin_id: user.type === "Admin" ? user._id : user.main_admin_id,
        campaign_created_by: user.userId,
      });

      result = {
        campaignId: campaign._id,
        message: "Campaign scheduled successfully",
      };
    } else {
      // Send instantly (your current flow)
      result = await campaignService.sendBulkMessages(req.body, user);
    }

    return res.json({ success: true, result });
  } catch (err) {
    console.error("sendCampaign error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getAllCampaign = async (req, res) => {
  try {
    const user = req.user;
    const result = await campaignService.getAllCampaign(user);
    res.json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
};

exports.getCampaignReport = async (req, res) => {
  try {
    const user = req.user;
    const report = await campaignService.getCampaignReport();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCampaignReports = async (req, res) => {
  try {
    const user = req.user;
    const { id: campaignId } = req.params;

    const report = await campaignService.getCampaignReports({
      campaignId,
      user,
    });

    res.status(200).json({
      success: true,
      message: "Campaign report fetched successfully.",
      data: report.data || [],
      counts: report.counts || { total: 0, sent: 0, failed: 0 },
    });
  } catch (err) {
    console.error("Error fetching campaign reports:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching campaign reports.",
      error: err.message,
    });
  }
};

exports.getCampaignLogs = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const logs = await campaignService.fetchLogsByCampaignId(campaignId);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const counts = await dashboardService.getDashboardCounts();
    res.json({ success: true, counts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendSingleMessage = async (req, res) => {
  try {
    const user = req.user;
    const result = await campaignService.sendSingleMessage(req.body, user);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("❌ Error sending single message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
