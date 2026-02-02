const router = require("express").Router();
const { verifyToken } = require("../../../../middleware/jwt");

const {
    createPlan,
    updatePlan,
    getById,
    getAll,
    deleteData
} = require("../../../controller/masters/generateInvoice/subPlan");


router.post("/create" ,verifyToken, createPlan);
router.put("/update/:id" , verifyToken, updatePlan);
router.get("/get/:id" , verifyToken, getById);
router.get("/getAll" , verifyToken, getAll);
router.delete("/delete/:id" , verifyToken, deleteData);

module.exports = router;