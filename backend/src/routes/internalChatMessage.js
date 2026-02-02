const router = require("express").Router();
const {verifyToken, optionalVerifyToken} = require("../../middleware/jwt");

const {
     getChatUserList,
     getConversation
} = require("../controller/internalchatMessage");

router.get("/getChatUserList" ,verifyToken, getChatUserList);
router.get("/getConversation/:conversationId" ,verifyToken, getConversation);

module.exports = router;