const router = require("express").Router();

const {
  create,
  update,
  getAll,
  deleteData,
} = require("../controller/clientMailCategory.js");

const { verifyToken } = require("../../middleware/jwt");

router.post("/create", verifyToken, create);
router.put("/update/:id", verifyToken, update);
router.get("/getAll", verifyToken, getAll);
router.delete("/delete/:id", verifyToken, deleteData);

module.exports = router;
