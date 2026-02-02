const router = require("express").Router();
const { verifyToken } = require("../../middleware/jwt");

const uploadFields = require("../../middleware/multer");


const {
    create,
    get
} = require("../controller/fundTransfer");


router.post("/create" ,verifyToken ,uploadFields,create);
router.get("/get" , verifyToken, get);

module.exports = router;