const router = require("express").Router();

const {
  createDocumentType,
  updateDocumentType,
  getAllDocumentType,
  deleteDocumentType,
} = require("../../../../controller/masters/documentList/visitor/visitorDocumentType");

const { verifyToken } = require("../../../../../middleware/jwt");

router.post("/create", verifyToken, createDocumentType);
router.put("/update/:id", verifyToken, updateDocumentType);
router.get("/getAll", verifyToken, getAllDocumentType);
router.delete("/delete/:id", verifyToken, deleteDocumentType);

module.exports = router;
