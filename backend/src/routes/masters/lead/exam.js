const router = require("express").Router();

const { createExam,
        updateExam,
        getAllExam,
        deleteExam
 } = require("../../../controller/masters/lead/exam");

const {verifyToken, optionalVerifyToken} = require("../../../../middleware/jwt");

router.post("/create", verifyToken, createExam);
router.put("/update/:id" , verifyToken, updateExam);
router.get("/getAll" , optionalVerifyToken, getAllExam);
router.delete("/delete/:id" , verifyToken, deleteExam);

module.exports = router;
