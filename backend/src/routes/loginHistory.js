const router = require("express").Router();
const {verifyToken} = require("../../middleware/jwt");

const {
    getAll
} = require("../controller/loginHistory");

router.get("/getAll" , verifyToken, getAll);

module.exports = router;