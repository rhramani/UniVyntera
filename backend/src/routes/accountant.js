const router = require("express").Router();
const {verifyToken} = require("../../middleware/jwt");

const {
    getEligibleStudents,
    getEligibleInstitutes,
    getEligibleCountries,
    exportDataToExcel,
    universityCommision,
    getEligibleCommissionUniversity,
    getEligibleCommissionCountry,
    getB2BCommissionList,
    sendCommissionQueryEmail,
    editInvoiceNo,
    getStudentsByB2b
} = require("../controller/accountant");

router.get("/totalAdmission" ,verifyToken, getEligibleStudents);
router.get("/totalInstitute" , verifyToken, getEligibleInstitutes);
router.get("/totalCountry" , verifyToken, getEligibleCountries);
router.get("/exportData" , verifyToken , exportDataToExcel);
router.get("/universityCommission" , verifyToken, universityCommision);
router.get("/totalCommissionUniversity" , verifyToken, getEligibleCommissionUniversity);
router.get("/totalCommissionCountry" , verifyToken, getEligibleCommissionCountry);
router.get("/b2bCommissionList" , verifyToken, getB2BCommissionList);
router.post("/commissionQueryMail/:id" , verifyToken , sendCommissionQueryEmail);
router.put("/editInvoice" , verifyToken , editInvoiceNo);
router.get("/studentByB2B/:id" , verifyToken, getStudentsByB2b);

module.exports = router;            