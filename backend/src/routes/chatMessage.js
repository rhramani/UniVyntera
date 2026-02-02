const router = require("express").Router();
const {verifyToken, optionalVerifyToken} = require("../../middleware/jwt");

const {
     getChatMessages,
     getUnreadMessageCounts,
     associatedUser
} = require("../controller/chatMessage");

router.get("/history/:studentId" , getChatMessages);
router.get("/notification" ,optionalVerifyToken, getUnreadMessageCounts);
router.get("/associatedUser/:id" , verifyToken,associatedUser);

module.exports = router;