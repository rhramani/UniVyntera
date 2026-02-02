const router = require("express").Router();

const {
    create,
    update,
    getOne,
    getAll
} = require("../controller/rolesPermissions");

const {verifyToken} = require("../../middleware/jwt");

router.post("/create", verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/getOne/:roleId" , verifyToken, getOne);
router.get("/getAll" , verifyToken, getAll);

module.exports = router;