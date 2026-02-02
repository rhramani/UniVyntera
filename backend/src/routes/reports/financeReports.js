const router = require("express").Router();
const { verifyToken } = require("../../../middleware/jwt");

const {
    feePaymentReports,
    studentFinanceSummary,
    universityPaymentCollection,
    exportFeePaymentReports,
    exportStudentFinanceSummaryReport,
    universityPaymentCollectionExport 
} = require("../../controller/reports/financeReports");

router.get("/feePayment" , verifyToken, feePaymentReports);
router.get("/studentFinanceSummary", verifyToken , studentFinanceSummary);
router.get("/universityPaymentCollection" , verifyToken, universityPaymentCollection);
router.get("/exportfeePayment" ,verifyToken, exportFeePaymentReports);
router.get("/exportFeePaymentReports" ,verifyToken, exportStudentFinanceSummaryReport);
router.get("/exportUniversityPaymentCollection",verifyToken, universityPaymentCollectionExport);

module.exports = router;