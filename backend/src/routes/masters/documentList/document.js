const router = require("express").Router();

const {
    createDocument,
    updateDocument,
    getAllDocument,
    deleteDocument
} = require("../../../controller/masters/documentList/document");

const {verifyToken} = require("../../../../middleware/jwt");

router.post("/create", verifyToken, createDocument);
router.put("/update/:id" , verifyToken, updateDocument);
router.get("/getAll" , verifyToken, getAllDocument);
router.delete("/delete/:id" , verifyToken, deleteDocument);

module.exports = router;
