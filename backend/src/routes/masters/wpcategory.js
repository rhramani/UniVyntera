const router = require("express").Router();

const {
    create,
    update,
    getById,
    getAll,
    deleteOne
} = require("../../controller/masters/wpcategory");

const {verifyToken} = require("../../../middleware/jwt");

router.post("/create" , verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/getOne/:id" , verifyToken, getById);
router.get("/getAll" , verifyToken, getAll);
router.delete("/delete/:id" , verifyToken, deleteOne);

module.exports = router;