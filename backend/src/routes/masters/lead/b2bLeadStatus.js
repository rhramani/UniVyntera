const router = require("express").Router();
const {
  verifyToken,
  optionalVerifyToken,
} = require("../../../../middleware/jwt");

const {
  create,
  update,
  getById,
  getAll,
  deleteLS,
} = require("../../../controller/masters/lead/b2bLeadStatus");

router.post("/create", verifyToken, create);
router.put("/update/:id", verifyToken, update);
router.get("/get/:id", verifyToken, getById);
router.get("/getAll", optionalVerifyToken, getAll);
router.delete("/delete/:id", verifyToken, deleteLS);

module.exports = router;
