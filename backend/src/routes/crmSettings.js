const router = require("express").Router();
const {verifyToken} = require("../../middleware/jwt");



const {
    create,
    update,
    getAll,
    deleteData
} = require("../controller/crmSettings");

router.post("/create" , verifyToken, create);
router.put("/update" , verifyToken, update);
router.get("/getAll" , getAll);  
router.delete("/delete/:id" , verifyToken, deleteData);  

module.exports = router;