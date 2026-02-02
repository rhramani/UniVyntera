const router = require("express").Router();

const { 
    create,
    update,
    getAll,
    deleted
 } = require("../../../controller/masters/studentApplication/applicationType");

const {verifyToken, optionalVerifyToken} = require("../../../../middleware/jwt");

router.post("/create", verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/getAll" , optionalVerifyToken, getAll);
router.delete("/delete/:id" , verifyToken, deleted);


module.exports = router;
