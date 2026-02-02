const router = require("express").Router();

const {
    createQualification,
    updateQualification,
    getAllQualification,
    deleteQualification
} = require("../../controller/masters/qualificationMaster");

const {verifyToken} = require("../../../middleware/jwt");

router.post("/create" , verifyToken, createQualification);
router.put("/update/:id" , verifyToken, updateQualification);
router.get("/getAll" , verifyToken , getAllQualification);
router.delete("/delete/:id" , verifyToken, deleteQualification);

module.exports = router;