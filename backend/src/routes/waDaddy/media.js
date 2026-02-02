const router = require("express").Router();
const multer = require("multer");
const { verifyToken } = require("../../../middleware/jwt");
const mediaController = require("../../controller/waDaddy/media");

const uploads = multer({ dest: 'uploads/' });

router.post("/upload-sample-media", verifyToken, uploads.single("file") , mediaController.uploadSampleMedia);

module.exports = router;