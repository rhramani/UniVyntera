const router = require("express").Router();

const {
    create,
    update,
    getOne,
    getAll,
    deleteRecord
} = require("../../../controller/masters/studentApplication/applicationStatus");

const {verifyToken} = require("../../../../middleware/jwt");

router.post("/create" , verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/getOne" , verifyToken, getOne);
router.get("/getAll" , verifyToken, getAll);
router.delete("/delete/:id" , verifyToken, deleteRecord);

module.exports = router;
