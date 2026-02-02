const router = require("express").Router();

const { 
    createInquiry,
    updateInquiry,
    getAllInquiry,
    deleteInquiry
 } = require("../../../controller/masters/lead/inquiry");

const {verifyToken, optionalVerifyToken} = require("../../../../middleware/jwt");

router.post("/create", verifyToken, createInquiry);
router.put("/update/:id" , verifyToken, updateInquiry);
router.get("/getAll" , optionalVerifyToken, getAllInquiry);
router.delete("/delete/:id" , verifyToken, deleteInquiry);


module.exports = router;
