const router = require("express").Router();

const {
    create,
    update,
    getAll,
    deleteCategory,
} = require("../../controller/taskManagement/taskCategory");

const { verifyToken } = require("../../../middleware/jwt");

router.post("/create", verifyToken, create);
router.put("/update/:id", verifyToken, update);
router.get("/getAll", verifyToken, getAll);
router.delete("/delete/:id", verifyToken, deleteCategory);


module.exports = router;