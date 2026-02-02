const router = require("express").Router();
const {verifyToken} = require("../../middleware/jwt");

const {
    create,
    update,
    getAll,
    deleteData
} = require("../controller/tutorial");


router.post("/create" ,verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/getAll" , verifyToken, getAll);
router.delete("/delete/:id" , verifyToken, deleteData);

module.exports = router;