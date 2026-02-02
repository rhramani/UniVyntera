const router = require("express").Router();

const {
    create,
    update,
    getOne,
    getAll,
    deleteBranch
} = require("../../controller/branch/branches");

const {verifyToken, optionalVerifyToken} = require("../../../middleware/jwt");

router.post("/create" , verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/getOne/:id" , verifyToken, getOne);
router.get("/getAll" , optionalVerifyToken, getAll);
router.delete("/delete/:id" , verifyToken, deleteBranch);

module.exports = router;