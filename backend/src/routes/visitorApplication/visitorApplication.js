const router = require("express").Router();

const visitorApplicationController = require("../../controller/visitorApplication/visitorApplication");

const uploadFields = require("../../../middleware/multer");
const uploadDisk = require("../../../middleware/uploadLocallyMulter");
const { verifyToken } = require("../../../middleware/jwt");

router.post("/create" , verifyToken, uploadDisk,visitorApplicationController.create);
router.put("/update/:id" , verifyToken , uploadDisk, visitorApplicationController.update);
router.get("/getAll" , verifyToken, visitorApplicationController.getAll);
router.get("/getOne/:id" , verifyToken, visitorApplicationController.getOne);
router.get("/download/:visitorId/:documentIds" , visitorApplicationController.downloadDocuments);
router.post("/clone/:id" ,verifyToken ,visitorApplicationController.cloneVisitorApplication);
router.get("/pendingDocList/:id" , verifyToken, visitorApplicationController.checkPendingDoc);
router.delete("/delete/:id" , verifyToken, visitorApplicationController.deleteData);
router.post("/pendingDocMail/:id" , verifyToken, visitorApplicationController.sendPendingDocumentsEmail);

module.exports = router;