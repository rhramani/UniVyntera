const router = require("express").Router();

const {verifyToken} = require("../../../middleware/jwt");

const {
    getUniqueInterestedInstitutes,
    getIntakeMonthAndYearLists,
    getStudentApplicationReports,
    tailormadeAgreementPendingReports,
    getMostPreferredCourses,
    exportsDataToExcel,
    exportMostPreferredCourses,
    exportTailormadeAgreementPendingReports,
    getFiltersForMostPrefferedCourse,
    getUniquePreferredCountries
} = require("../../controller/reports/studentApplicationReports");


router.get("/getInstitute" ,verifyToken, getUniqueInterestedInstitutes);
router.get("/getintakes" , verifyToken , getIntakeMonthAndYearLists);
router.get("/getReport" , verifyToken , getStudentApplicationReports);
router.get("/getPendingAgreement" , verifyToken , tailormadeAgreementPendingReports);
router.get("/getMostPreferredCourses" , verifyToken , getMostPreferredCourses);                                                                                                             
router.get("/downloadReport" , verifyToken, exportsDataToExcel);
router.get("/exportMostPreferredCourses" , verifyToken,exportMostPreferredCourses);
router.get("/exportPendingAgreement" ,verifyToken, exportTailormadeAgreementPendingReports);
router.get("/getFiltersForMostPrefferedCourse" , verifyToken, getFiltersForMostPrefferedCourse);
router.get("/getUniquePreferredCountries" ,verifyToken, getUniquePreferredCountries);

module.exports = router;        