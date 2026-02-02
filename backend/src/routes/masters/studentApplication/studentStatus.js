const router = require("express").Router();
const { verifyToken } = require("../../../../middleware/jwt");

const {
    create,
    update,
    getById,
    getAll,
    deleteStatus
} = require("../../../controller/masters/studentApplication/studentStatus");


router.post("/create" ,verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/get/:id" , verifyToken, getById);
router.get("/getAll" , verifyToken, getAll);
router.delete("/delete/:id" , verifyToken, deleteStatus);

module.exports = router;