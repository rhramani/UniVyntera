const router = require("express").Router();

const { verifyToken } = require("../../middleware/jwt");

const {
  create,
  update,
  getAll,
  deleteData,
  getUniqueStudent,
  exportDataToExcel,
  getInvoiceWithTotals,
  getInvoiceHistory,
  getFinancialSummary,
} = require("../controller/generateInvoice");

router.post("/create", verifyToken, create);
router.put("/update/:id", verifyToken, update);
router.get("/getAll", verifyToken, getAll);
router.delete("/delete/:id", verifyToken, deleteData);
router.get("/getUniqueStudent", verifyToken, getUniqueStudent);
router.get("/exportDataToExcel", verifyToken, exportDataToExcel);
router.get("/getInvoiceWithTotals", verifyToken, getInvoiceWithTotals);
router.get("/getInvoiceHistory", verifyToken, getInvoiceHistory);
router.get("/totalBankCash", verifyToken, getFinancialSummary);

module.exports = router;
