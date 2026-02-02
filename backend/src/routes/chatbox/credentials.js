const router = require("express").Router();

const { verifyToken } = require("../../../middleware/jwt");
const {
    create,
    update,
    getAll
} = require("../../controller/chatbox/credentials");


router.post("/create" , verifyToken, create);
router.put("/update/:id" , verifyToken, update);
router.get("/get" , verifyToken, getAll);

module.exports = router;

