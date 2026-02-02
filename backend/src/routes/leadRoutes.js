// routes/leadRoutes.js
const express = require("express");
const router = express.Router();
const leadController = require("../controller/lead");
// const uploadFields = require('../../middleware/multer');
const uploadDisk = require("../../middleware/uploadLocallyMulter");
const uploadFields = require("../../middleware/multer");

const { verifyToken, optionalVerifyToken } = require("../../middleware/jwt");

router.post("/addLead", optionalVerifyToken, leadController.addLead);
router.get("/leadGet/:id", verifyToken, leadController.getLead);
router.get("/leadGetAll", verifyToken, leadController.getAllLead);
router.get("/getB2BLead" ,verifyToken, leadController.getB2BLead);
router.get("/leadById/:userId", leadController.LeadsByUserId);
router.put("/leadUpdate/:id", verifyToken, leadController.updateLead);
router.put("/bulk-lead-assign", verifyToken, leadController.bulkLeadAssign);
router.delete("/leadDelete/:id", leadController.deleteLead);
router.post("/upload-excel",verifyToken, uploadDisk, leadController.bulkAddLeads);
router.get("/leadByFilter", leadController.filterLeadsByDate);
router.get("/downloadLead",verifyToken, leadController.downloadAllLeads);
router.post("/bulk-delete", leadController.bulkDeleteLeads);
router.get("/getFollowUpLeads", verifyToken, leadController.getFollowUpLeads);
router.get("/getPendingFollowUps" , verifyToken, leadController.getPendingFollowUps);
router.get(
  "/followUpLeadByDate",
  verifyToken,
  leadController.getFollowUpLeadsByDate
);
router.get(
  "/getLeadsByAssignedUser/:id",
  leadController.getLeadsByAssignedUser
);
router.get("/editHistory/:id", leadController.getLeadHistory);
router.post(
  "/convertToApplication/:id",
  verifyToken,
  uploadFields,
  leadController.convertLeadToApplication
);
router.get("/assignedUser", verifyToken, leadController.AssignedLead);
router.get("/leadFroms", leadController.LeadFroms);
router.post("/sendWPMessage", verifyToken, leadController.sendWPMessage);
router.get("/countryList", optionalVerifyToken, leadController.countryList);
router.get("/eodReport" ,verifyToken, leadController.eodReport);
router.get("/birthDay" , verifyToken, leadController.birthday);
router.get("/getNewLead" ,verifyToken, leadController.allNewLead);

router.get("/applicationProcess/:id" ,verifyToken, leadController.applicationProcess);

module.exports = router;
