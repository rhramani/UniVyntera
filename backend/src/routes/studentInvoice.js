const router = require("express").Router();

const {
    createInvoice,
    updateInvoice,
    getAllInvoice,
    deleteInvoice,
    exportDataToExcel
} = require("../controller/studentInvoice");

const {verifyToken} = require("../../middleware/jwt");

router.post("/create" ,verifyToken, createInvoice);
router.put("/update/:id" , verifyToken , updateInvoice);
router.get("/get" , verifyToken, getAllInvoice);
router.delete("/delete/:id" , verifyToken , deleteInvoice);
router.get("/getReport" , verifyToken, exportDataToExcel);

module.exports = router;