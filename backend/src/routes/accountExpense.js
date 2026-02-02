const router = require("express").Router();

const {
    createExpense,
    updateExpense,
    getAllExpense,
    deleteExpense,
    exportDataToExcel
} = require("../controller/accountExpense");

const {verifyToken} = require("../../middleware/jwt");
const uploadDisk = require("../../middleware/uploadLocallyMulter");


router.post("/create" ,verifyToken,uploadDisk, createExpense);
router.put("/update/:id" , verifyToken,uploadDisk, updateExpense);
router.get("/getAll" , verifyToken, getAllExpense);
router.delete("/delete/:id" , verifyToken , deleteExpense);
router.get("/getReport" , verifyToken, exportDataToExcel);

module.exports = router;