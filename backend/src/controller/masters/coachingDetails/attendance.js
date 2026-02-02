const AttendenceServices = require("../../../services/masters/coachingDetails/attendance");

const markAttendence = async (req, res) => {
  try {
    const data = req.body;
    const result = await AttendenceServices.mark(data, req.user.userId);

    return res.status(200).json({
      status: true,
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};


const getAllAttendence = async (req, res) => {
  try {
    const {startDate , endDate, studentId, page , limit} = req.query;
    const result = await AttendenceServices.getAll(startDate , endDate, studentId, req.user, page , limit);

    return res.status(200).json({
        status: true,
        code: 200,
        data: result
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

const getPastAttendanceHistory = async (req, res) => {
  try{
    const {startDate , endDate, studentId, page , limit} = req.query;
    const result = await AttendenceServices.getPastAttendanceHistory(startDate , endDate, studentId, req.user, page , limit);

    return res.status(200).json({
        status: true,
        code: 200,
        data: result
    })

  }catch(error){
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
}

const deleteAttendance = async (req, res) => {
  try {
    const { studentId, date } = req.params;
    const result = await AttendenceServices.delete(studentId, date);
    return res.status(200).json({ status: true, message: "Attendance deleted", result });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 500,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  markAttendence,
  getAllAttendence,
  deleteAttendance,
  getPastAttendanceHistory,
  getPastAttendanceHistory
};
