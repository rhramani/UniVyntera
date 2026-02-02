const router = require("express").Router();

const {
  createRequirements,
  updateRequirements,
  getAllRequirements,
  deleteRequirement,
} = require("../../controller/masters/requirementsMaster");

const { verifyToken, optionalVerifyToken } = require("../../../middleware/jwt");

router.post("/create", verifyToken, createRequirements);
router.put("/update/:id", verifyToken, updateRequirements);
router.get("/getAll", optionalVerifyToken, getAllRequirements);
router.delete("/delete/:id", verifyToken, deleteRequirement);

module.exports = router;
