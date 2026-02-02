const router = require("express").Router();

const {
    create,
    update,
    getAll,
    getOne,
    deleteData,
} = require("../../controller/taskManagement/task");
const uploadDisk = require("../../../middleware/uploadLocallyMulter");

const { verifyToken } = require("../../../middleware/jwt");

router.post("/create", verifyToken,uploadDisk, create);
router.put("/update/:id", verifyToken,uploadDisk, update);
router.get("/getAll", verifyToken, getAll);
router.get("/get/:id" ,verifyToken, getOne);
router.delete("/delete/:id", verifyToken, deleteData);


module.exports = router;