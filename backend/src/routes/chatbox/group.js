const router = require("express").Router();

const { verifyToken } = require("../../../middleware/jwt");
const groupController = require("../../controller/chatbox/group");


router.post("/create" , verifyToken, groupController.createGroup);
router.get('/getAll',verifyToken, groupController.getAllGroups);
router.post('/add-contact/:groupId', groupController.addContactToGroup);
router.post('/remove-contact/:groupId', groupController.deleteContactFromGroup);
router.get('/contacts/:id', groupController.getContactsOfGroup);
router.delete('/delete/:id', groupController.deleteGroup);
router.get('/get/:id', groupController.getGroupById);

module.exports = router;
