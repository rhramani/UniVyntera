const router = require("express").Router();

const {
    create,
    update,
    getAll,
    deleteType,
} = require("../../controller/taskManagement/taskType");

const { verifyToken } = require("../../../middleware/jwt");

router.post("/create", verifyToken, create);
router.put("/update/:id", verifyToken, update);
router.get("/getAll", verifyToken, getAll);
router.delete("/delete/:id", verifyToken, deleteType);


module.exports = router;