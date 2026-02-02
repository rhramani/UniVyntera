const router = require("express").Router();
const { verifyToken } = require("../../middleware/jwt");
const uploadDisk = require("../../middleware/uploadLocallyMulter");
const {
  create,
  update,
  getById,
  getAll,
  deleteCM,
  bulkUploadClientMail
} = require("../controller/clientMail");

router.post("/create", verifyToken, create);
router.put("/update/:id", verifyToken, update);
router.get("/get/:id", verifyToken, getById);
router.get("/getAll", verifyToken, getAll);
router.delete("/delete/:id", verifyToken, deleteCM);
router.post("/bulkUpload" ,verifyToken, uploadDisk  , bulkUploadClientMail);

module.exports = router;
