const router = require("express").Router();

const { createDegree, updateDegree, getAllDegree, deleteDegree } = require("../../../controller/masters/lead/degree");

const {verifyToken, optionalVerifyToken} = require("../../../../middleware/jwt");

router.post("/create", verifyToken, createDegree);
router.put("/update/:id" , verifyToken, updateDegree);
router.get("/getAll" , optionalVerifyToken, getAllDegree);
router.delete("/delete/:id" , verifyToken, deleteDegree);


module.exports = router;
