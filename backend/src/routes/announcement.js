const router = require("express").Router();
const { verifyToken } = require("../../middleware/jwt");
const uploadFields = require("../../middleware/multer");
const uploadDisk = require("../../middleware/uploadLocallyMulter");

const {
    sendAnnouncement , 
    uploadMedia,
    getHistory,
    deleteHistory
} = require("../controller/announcement");

router.post("/sendMail" , verifyToken, uploadDisk, sendAnnouncement);
router.post("/upload" , uploadDisk, uploadMedia );
router.get("/getHistory" , verifyToken, getHistory);
router.delete("/delete/:id" , verifyToken, deleteHistory);

// router.post("/sendMail" , verifyToken, uploadFields, sendAnnouncement);
module.exports = router;