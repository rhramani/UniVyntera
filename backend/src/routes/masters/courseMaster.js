const router = require("express").Router();

const {
    createCourse,
    bulkUploadCourse,
    updateCourse,
    getAllCourse,
    getOneCourse,
    deleteAllCourse,
    courseFilter,
    exportDataToExcel,
    getCurrenctCode,
    getCountriesFromCourses,
    getDurationFromCourses,
    getDependentCourseFilters,
    getStatesFromCourses,
    getStudyAreasByCountry
} = require("../../controller/masters/courseMaster");

const {verifyToken, optionalVerifyToken} = require("../../../middleware/jwt");
const uploadDisk = require("../../../middleware/uploadLocallyMulter");

router.post("/create" , optionalVerifyToken, createCourse);
router.post("/bulkUpload" , optionalVerifyToken, uploadDisk, bulkUploadCourse);
router.put("/update/:id", optionalVerifyToken, updateCourse);
router.get("/getAll" , optionalVerifyToken, getAllCourse); // not used
router.get("/getOne/:id" ,verifyToken, getOneCourse );
router.delete("/delete/:id" , optionalVerifyToken, deleteAllCourse);
router.get("/courseFilter" ,optionalVerifyToken, courseFilter);
router.get("/downloadExcel",optionalVerifyToken, exportDataToExcel);
router.get("/currencyCode" , getCurrenctCode);
router.get("/country" , getCountriesFromCourses);
router.get("/duration" , getDurationFromCourses);
router.get("/getDependentFilter" , getDependentCourseFilters);
router.get("/state" , getStatesFromCourses);
router.get("/studyArea" , getStudyAreasByCountry);

module.exports = router;