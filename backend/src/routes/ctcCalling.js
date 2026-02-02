const router = require("express").Router();
const {verifyToken} = require("../../middleware/jwt");

const {
    callingLead,
    callFromDialer,
    webhook
} = require("../controller/ctcCalling");

router.post("/callLead/:leadId",verifyToken, callingLead);
router.post("/call" ,verifyToken, callFromDialer);
router.post("/webhook" , webhook);

module.exports = router;