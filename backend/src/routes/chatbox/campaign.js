const router = require("express").Router();

const campaigncontroller = require("../../controller/chatbox/campaign");

const { verifyToken } = require("../../../middleware/jwt");

router.post("/send-campaign" ,verifyToken, campaigncontroller.sendCampaign );
router.get('/report',verifyToken, campaigncontroller.getCampaignReport);
router.get('/allCampaigns',verifyToken, campaigncontroller.getAllCampaign);
router.get('/logs/:campaignId', campaigncontroller.getCampaignLogs);
router.get('/dashboard/summary',verifyToken, campaigncontroller.getDashboardSummary);

router.get('/:id/report',verifyToken, campaigncontroller.getCampaignReports);
router.post("/send-single-message",verifyToken, campaigncontroller.sendSingleMessage);

module.exports = router;