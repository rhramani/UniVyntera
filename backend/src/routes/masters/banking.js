const router = require("express").Router();

const {
  createBanking,
  updateBanking,
  getAllBanking,
  deleteBanking,
} = require("../../controller/masters/banking");
const { verifyToken } = require("../../../middleware/jwt");

router.post("/create", verifyToken, createBanking);
router.put("/update/:id", verifyToken, updateBanking);
router.get("/getAll", verifyToken, getAllBanking);
router.delete("/delete/:id", verifyToken, deleteBanking);

module.exports = router;
