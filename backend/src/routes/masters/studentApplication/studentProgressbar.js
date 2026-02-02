const router = require("express").Router();

const {
    createOrUpdateProgress,
    getAllProgressSteps,
    deleteProgressSteps
} = require("../../../controller/masters/studentApplication/studentProgressbar");

const {verifyToken} = require("../../../../middleware/jwt");

router.post("/create" ,verifyToken, createOrUpdateProgress);
router.get("/getAll", verifyToken, getAllProgressSteps);
router.delete("/delete/:id" , verifyToken, deleteProgressSteps);

module.exports = router;

