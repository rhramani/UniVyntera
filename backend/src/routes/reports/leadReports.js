const router = require("express").Router();
const { verifyToken } = require("../../../middleware/jwt");

const {
    leadSourceReport,
    getAllUniqueSources,
    exportDataToExcel
} = require("../../controller/reports/leadReports");


router.get("/sourceReport" ,verifyToken, leadSourceReport);
router.get("/sourceOfReference" , verifyToken, getAllUniqueSources);
router.get("/exportData" , verifyToken, exportDataToExcel);

module.exports = router;