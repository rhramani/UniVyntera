const router = require("express").Router();
const { verifyToken } = require("../../../middleware/jwt");

const {
    getVisaReports,
    exportVisaReport
} = require("../../controller/reports/visaReports");

router.get("/getVisa" ,verifyToken, getVisaReports);
router.get("/exportVisaReport" ,verifyToken, exportVisaReport);

module.exports = router;