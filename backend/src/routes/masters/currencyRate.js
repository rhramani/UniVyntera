const router = require("express").Router();
const { verifyToken, optionalVerifyToken } = require("../../../middleware/jwt");
const uploadDisk = require("../../../middleware/uploadLocallyMulter");

const {
  create,
  bulkUploadCourse,
  update,
  getOne,
  getAll,
  deleteData,
} = require("../../controller/masters/currencyRate");

router.post("/create", verifyToken, create);
router.post("/bulkUpload", verifyToken, uploadDisk, bulkUploadCourse);
router.put("/update/:id", verifyToken, update);
router.get("/get/:id", verifyToken, getOne);
router.get("/getAll", optionalVerifyToken, getAll);
router.delete("/delete/:id", verifyToken, deleteData);

module.exports = router;
