const router = require("express").Router();
const {verifyToken} = require("../../middleware/jwt");


const uploadDisk = require("../../middleware/uploadLocallyMulter");

const {
    create,
    update,
    getAll,
    deleteData
} = require("../controller/settings");

router.post("/create" , verifyToken, uploadDisk, create);
router.put("/update/:id" , verifyToken, uploadDisk, update);
router.get("/getAll" , getAll);  
router.delete("/delete/:id" , verifyToken, deleteData);  

module.exports = router;