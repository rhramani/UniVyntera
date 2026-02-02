const router = require("express").Router();

const { create, update, getAll, deleteData} = require("../../../controller/masters/lead/followUpType");

const {verifyToken, optionalVerifyToken} = require("../../../../middleware/jwt");

router.post("/create", verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/getAll" , optionalVerifyToken, getAll);
router.delete("/delete/:id" , verifyToken, deleteData);


module.exports = router;
