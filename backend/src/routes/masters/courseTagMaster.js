const router = require("express").Router();

const {
  create,
  update,
  // getById,
  getAll,
  deleteTag,
} = require("../../controller/masters/courseTagMaster");

const { verifyToken, optionalVerifyToken } = require("../../../middleware/jwt");

router.post("/create", verifyToken, create);
router.put("/update/:id", verifyToken, update);
// router.get("/get/:id" , verifyToken, getById);
router.get("/getAll", optionalVerifyToken, getAll);
router.delete("/delete/:id", verifyToken, deleteTag);

module.exports = router;
