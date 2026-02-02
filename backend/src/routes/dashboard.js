const router = require("express").Router();
const { verifyToken } = require("../../middleware/jwt");

const {
    getDashboard
} = require("../controller/dashboard");

router.get("/get" ,verifyToken,  getDashboard);

module.exports = router;    