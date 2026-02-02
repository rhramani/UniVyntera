const router = require("express").Router();

const { create, update , getAll, getVoiceAIConfig, getCTCCredentials} = require("../controller/configuration");

const { verifyToken } = require("../../middleware/jwt");
const uploadDisk= require("../../middleware/uploadLocallyMulter");

router.post("/create", verifyToken, uploadDisk , create);
router.put("/update/:id", verifyToken,uploadDisk, update);
router.get("/get" , verifyToken , getAll);
router.get("/getVoiceAI" , verifyToken, getVoiceAIConfig);
router.get("/getCTCCred" , verifyToken , getCTCCredentials);

module.exports = router;
