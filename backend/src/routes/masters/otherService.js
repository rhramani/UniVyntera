const router = require("express").Router();

const { verifyToken, optionalVerifyToken } = require("../../../middleware/jwt");
const { 
    createOther,
    updateOther,
    getAllOther,
    deleteOther
 } = require("../../controller/masters/otherService");



router.post("/create", verifyToken, createOther);
router.put("/update/:id" , verifyToken, updateOther);
router.get("/getAll" , optionalVerifyToken, getAllOther);
router.delete("/delete/:id" , verifyToken, deleteOther);


module.exports = router;