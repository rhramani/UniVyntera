const router = require("express").Router();

const { verifyToken } = require("../../../middleware/jwt");
const contactController = require("../../controller/chatbox/contact");
const uploadDisk = require("../../../middleware/uploadLocallyMulter");

router.post("/create", verifyToken, contactController.addContact);
router.get("/getAll", verifyToken, contactController.getAllContacts);
router.get("/export", verifyToken, contactController.getAllContactsExport);
router.get("/chat", verifyToken, contactController.chatContacts);
router.get("/get/:id", contactController.getContactById);
router.put('/update/:id',verifyToken, contactController.updateContact);
router.delete("/delete/:id", contactController.deleteContact);
router.post("/multipleDelete", contactController.multipleDelete);
router.post(
  "/import-contacts",
  verifyToken,
  uploadDisk,
  contactController.importContactsFromExcel
);

module.exports = router;
