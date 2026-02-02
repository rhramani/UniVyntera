const router = require("express").Router();

const {
    create,
    addDocument,
    update,
    getOne,
    getAll,
    deleteDocument
} = require("../controller/promotionalPpt");

const {verifyToken} = require("../../middleware/jwt");
const uploadDisk = require("../../middleware/uploadLocallyMulter");

router.post("/create" ,verifyToken,uploadDisk, create);
router.patch("/add-doc/:id" , verifyToken, uploadDisk, addDocument);
router.put("/update" , verifyToken, uploadDisk, update);
router.get("/getOne/:id" , verifyToken, getOne);
router.get("/getAll" , verifyToken, getAll);
router.delete("/delete/:id/:docId?/:fileId?" , deleteDocument);

module.exports = router;