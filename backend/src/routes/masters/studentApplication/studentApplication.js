const router = require("express").Router();

const { 
    createStudent,
    updateStudent,
    getAllStudent,
    getOneStudent,
    deleteStudent,
    downloadDocuments,
    downloadStudentExcel,
    cloneStudentApplication,
    checkPendingDoc,
    sendPendingDocumentsEmail,
    getCoachingStudent,
    getFollowupStudent,
    getstudentAccountant,
    statusUpdateFromEmail,
    checkInstituteFeesDeadline
 } = require("../../../controller/masters/studentApplication/studentApplication");

 
 const uploadDisk = require("../../../../middleware/uploadLocallyMulter");
const {verifyToken} = require("../../../../middleware/jwt");

router.post("/create", verifyToken, uploadDisk, createStudent);
router.put("/update/:id" , verifyToken,uploadDisk, updateStudent);
router.get("/getAll" , verifyToken, getAllStudent);
router.get("/getOne/:id" , verifyToken, getOneStudent);
router.delete("/delete/:id" , verifyToken, deleteStudent);
router.get("/studentAccountant/:id" ,verifyToken, getstudentAccountant);
router.get("/download/:applicationId/:documentIds" , downloadDocuments);
router.post("/clone/:id" ,verifyToken ,cloneStudentApplication);
router.get("/pendingDocList/:id" , verifyToken, checkPendingDoc);
router.post("/pendingDocMail/:id" , verifyToken , sendPendingDocumentsEmail);
router.get("/getCoachingStudent" ,verifyToken,  getCoachingStudent);
router.get("/getFollowupStudent" , verifyToken, getFollowupStudent);
router.get("/downloadStudentExcel" , verifyToken, downloadStudentExcel);
router.get("/statusUpdateFromEmail" , statusUpdateFromEmail);
router.get("/sendFeesDeadlineEmail/:id" , verifyToken ,checkInstituteFeesDeadline);

module.exports = router;
