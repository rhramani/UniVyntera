const router = require("express").Router();

const {
  createProgramLevelServices,
  updateProgramLevel,
  getAllProgramLevels,
  deleteProgramById,
} = require("../../controller/masters/programLevelMaster");

const { verifyToken, optionalVerifyToken } = require("../../../middleware/jwt");

router.post("/create", verifyToken, createProgramLevelServices);
router.put("/update/:id", verifyToken, updateProgramLevel);
router.get("/getAll", optionalVerifyToken, getAllProgramLevels);
router.delete("/delete/:id", verifyToken, deleteProgramById);

module.exports = router;
