// routes/leadRoutes.js
const express = require("express");
const router = express.Router();
const leadController = require("../controller/aICallLead");
// const uploadFields = require('../../middleware/multer');
const uploadDisk = require("../../middleware/uploadLocallyMulter");
const uploadFields = require("../../middleware/multer");

const { verifyToken, optionalVerifyToken } = require("../../middleware/jwt");

router.post("/addLead", optionalVerifyToken, leadController.addLead);
router.get("/leadGet/:id", verifyToken, leadController.getLead);
router.get("/leadGetAll", verifyToken, leadController.getAllLead);
router.put("/leadUpdate/:id", verifyToken, leadController.updateLead);
router.delete("/leadDelete/:id", leadController.deleteLead);

module.exports = router;
