const router = require("express").Router();

const reportsController = require("../../controller/reports/allReports");
const { verifyToken } = require("../../../middleware/jwt");

router.get("/overall" ,verifyToken, reportsController.overAllReport);
router.get("/leadFrom" , verifyToken, reportsController.leadFromReport);
router.get("/visaNumberCounselor" , verifyToken, reportsController.visaNumberCounselorReport);
router.get("/counselorPerformance" , verifyToken, reportsController.counselorPerformanceReport);
router.get("/branchWiseAdmissions" ,verifyToken, reportsController.branchWiseAdmissionsReport);
router.get("/branchPerformance" , verifyToken , reportsController.branchPerformanceReport);
router.get("/admissionCount" , verifyToken, reportsController.getAdmissionReport); // need to check
router.get("/visaCollection" , verifyToken, reportsController.visaCollectionReport);
router.get("/branchTotalApplication" , verifyToken, reportsController.branchTotalApplicationReport);
router.get("/visitorVisaReport" ,verifyToken , reportsController.visitorVisaReport);
router.get("/coachingReport" ,verifyToken, reportsController.coachingReport);

module.exports = router; 