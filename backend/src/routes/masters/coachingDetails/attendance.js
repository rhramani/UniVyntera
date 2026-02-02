const router = require("express").Router();
const { verifyToken } = require("../../../../middleware/jwt");

const {
  markAttendence,
  getAllAttendence,
  deleteAttendance,
  getPastAttendanceHistory
} = require("../../../controller/masters/coachingDetails/attendance");

router.post("/mark" ,verifyToken, markAttendence);
router.get("/getAll" ,verifyToken, getAllAttendence);
router.get("/getPastStudent" , verifyToken, getPastAttendanceHistory);
router.delete("/delete/:studentId/:date", deleteAttendance);


module.exports = router;