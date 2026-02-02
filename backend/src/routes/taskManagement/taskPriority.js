const router = require("express").Router();

const {
    create,
    update,
    getAll,
    deletePriority,
} = require("../../controller/taskManagement/TaskPriority");

const { verifyToken } = require("../../../middleware/jwt");

router.post("/create", verifyToken, create);
router.put("/update/:id", verifyToken, update);
router.get("/getAll", verifyToken, getAll);
router.delete("/delete/:id", verifyToken, deletePriority);


module.exports = router;