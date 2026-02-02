const router = require("express").Router();

const {
    createVisitorType,
    updateVisitorType,
    getAllVisitorType,
    deleteVisitorType
} = require("../../../controller/masters/visitorList/visitorType");

const {verifyToken} = require("../../../../middleware/jwt");

router.post("/create" , verifyToken, createVisitorType);
router.put("/update/:id" , verifyToken, updateVisitorType);
router.get("/getAll" , verifyToken, getAllVisitorType);
router.delete("/delete/:id" , verifyToken, deleteVisitorType);

module.exports = router;
