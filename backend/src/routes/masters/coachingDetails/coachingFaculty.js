const router = require("express").Router();
const  { verifyToken } = require("../../../../middleware/jwt");

const {
    facultyRegistration,
    updateFaculty,
    getOne,
    getAll,
    deleteData,
    getBatchTimes
} = require("../../../controller/masters/coachingDetails/coachingFaculty");

router.post("/create" ,verifyToken, facultyRegistration);
router.put("/update/:id" , verifyToken , updateFaculty);
router.get("/getOne/:id" , verifyToken , getOne);
router.get("/getAll" , verifyToken ,getAll);
router.delete("/delete/:id" ,verifyToken, deleteData);
router.get("/getBatchTimes", verifyToken, getBatchTimes);

module.exports = router;
