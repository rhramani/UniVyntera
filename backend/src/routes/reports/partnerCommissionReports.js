const router =  require("express").Router();

const { partnerCommissionSummary,
    pendingB2BInvoice ,
    uniqueB2BAndBranchList ,
    partnerConversionReport,
    exportPartnerConversionReport,
    pendingB2BCountry,
    downloadPendingB2BInvoice
} = require( "../../controller/reports/partnerCommissionReports");

const { verifyToken } = require("../../../middleware/jwt");

router.get("/partnerCommissionSummary" ,verifyToken, partnerCommissionSummary);
router.get("/pendingB2BInvoice" ,verifyToken, pendingB2BInvoice);
router.get("/uniqueB2BAndBranchList" ,verifyToken, uniqueB2BAndBranchList);
router.get("/partnerConversionReport" , verifyToken, partnerConversionReport);
router.get("/exportPartnerConversion" , verifyToken, exportPartnerConversionReport);
router.get("/totalPendingB2BCountry" ,verifyToken, pendingB2BCountry);
router.get("/download" , verifyToken, downloadPendingB2BInvoice);

module.exports = router;