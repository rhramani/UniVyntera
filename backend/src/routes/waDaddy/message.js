const express = require('express');
const router = express.Router();
const messageController = require('../../controller/waDaddy/message');

const { verifyToken } = require('../../../middleware/jwt');

router.post('/send', verifyToken, messageController.sendMessage );
router.get('/', verifyToken, messageController.getChatMessages);

module.exports = router;
