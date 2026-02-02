const mongoose = require("mongoose");

const studentApplication = require("../../../../model/masters/studentApplication/studentApplication");
const Attendence = require("../../../../model/masters/coachingDetails/attendance");

const attendenceServices = {
  mark: async (data, userId) => {
    const { student, date, status, remarks } = data;

    const exists = await Attendence.findOne({
      student: student,
      date: new Date(date),
    });

    if (exists) {
      const updated = await Attendence.updateOne(
        { _id: exists._id },
        {
          $set: {
            status,
            remarks,
            markedBy: userId,
          },
        }
      );

      return updated;
    } else {
      const newAttendence = await Attendence.create({
        student,
        date,
        status,
        remarks,
        markedBy: userId,
      });

      return newAttendence;
    }
  },
  getAll: async (
    startDate,
    endDate,
    studentId,
    currentUser,
    page = 1,
    limit = 10
  ) => {
    const matchStudents = {
      "coachingDetails.coachingRequired": true,
      "coachingDetails.endDate": { $gte: new Date() },
    };
    // Role-based filtering
    let roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (roleName === undefined) {
      roleName =
        typeof currentUser.userRole === "string"
          ? currentUser.userRole
          : currentUser.userRole?.name;
    }
     if (roleName === "Coaching Faculty") {
    matchStudents["coachingDetails.batchFaculty"] =
      new mongoose.Types.ObjectId(currentUser.userId);
  }

    if (studentId) {
      matchStudents._id = new mongoose.Types.ObjectId(studentId);
    }

    const totalRecords = await studentApplication.countDocuments(matchStudents);
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // Step 1: Get students and their attendance
    const data = await studentApplication.aggregate([
      { $match: matchStudents },
      { $sort: { studentName: 1 } },
      { $skip: skip },
      { $limit: limit },
      // Lookup attendance
      {
        $lookup: {
          from: "attendences",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$student", "$$studentId"],
                },
                ...(startDate && endDate && !studentId
                  ? {
                      date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                      },
                    }
                  : {}),
              },
            },
            // lookup in faculty
            {
              $lookup: {
                from: "coachingfaculties",
                localField: "markedBy",
                foreignField: "_id",
                as: "markedByFaculty",
              },
            },
            // lookup in users
            {
              $lookup: {
                from: "users",
                localField: "markedBy",
                foreignField: "_id",
                as: "markedByUser",
              },
            },
            // merge names
            {
              $addFields: {
                markedByName: {
                  $cond: {
                    if: { $gt: [{ $size: "$markedByFaculty" }, 0] },
                    then: { $arrayElemAt: ["$markedByFaculty.name", 0] },
                    else: { $arrayElemAt: ["$markedByUser.name", 0] },
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                date: 1,
                status: 1,
                markedBy: 1,
                markedByName: 1,
                remarks: 1,
              },
            },
          ],
          as: "attendenceRecords",
        },
      },

      {
        $project: {
          _id: 1,
          studentName: "$name",
          coachingEndDate: "$coachingDetails.endDate",
          attendenceRecords: 1,
        },
      },
    ]);

    return {
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      pageSize: limit,
      data,
    };
  },
 getPastAttendanceHistory: async (
  startDate,
  endDate,
  studentId,
  currentUser,
  page = 1,
  limit = 10
) => {
  // --- Base match for past students ---
  const matchStudents = {
    "coachingDetails.coachingRequired": true,
    "coachingDetails.endDate": { $lt: new Date() }, // ✅ only completed coaching
  };

  // --- Role-based filtering ---
  let roleName =
    typeof currentUser.role === "string"
      ? currentUser.role
      : currentUser.role?.name;

  if (roleName === undefined) {
    roleName =
      typeof currentUser.userRole === "string"
        ? currentUser.userRole
        : currentUser.userRole?.name;
  }

  if (roleName !== "Super Admin") {
    matchStudents["coachingDetails.batchFaculty"] =
      new mongoose.Types.ObjectId(currentUser.userId);
  }

  if (studentId) {
    matchStudents._id = new mongoose.Types.ObjectId(studentId);
  }

  // --- Count total past students ---
  const totalRecords = await studentApplication.countDocuments(matchStudents);

  // --- Pagination setup ---
  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  // --- Aggregate for past students & their attendance ---
  const data = await studentApplication.aggregate([
    { $match: matchStudents },

    // Sort + Paginate before lookup
    { $sort: { name: 1 } },
    { $skip: skip },
    { $limit: limit },

    // Lookup attendance
    {
      $lookup: {
        from: "attendences",
        let: { studentId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$student", "$$studentId"] },
              ...(startDate && endDate && !studentId
                ? {
                    date: {
                      $gte: new Date(startDate),
                      $lte: new Date(endDate),
                    },
                  }
                : {}),
            },
          },
          // Faculty lookup
          {
            $lookup: {
              from: "coachingfaculties",
              localField: "markedBy",
              foreignField: "_id",
              as: "markedByFaculty",
            },
          },
          // User lookup
          {
            $lookup: {
              from: "users",
              localField: "markedBy",
              foreignField: "_id",
              as: "markedByUser",
            },
          },
          // Merge faculty/user name
          {
            $addFields: {
              markedByName: {
                $cond: {
                  if: { $gt: [{ $size: "$markedByFaculty" }, 0] },
                  then: { $arrayElemAt: ["$markedByFaculty.name", 0] },
                  else: { $arrayElemAt: ["$markedByUser.name", 0] },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: 1,
              status: 1,
              markedBy: 1,
              markedByName: 1,
              remarks: 1,
            },
          },
        ],
        as: "attendenceRecords",
      },
    },

    // Final projection
    {
      $project: {
        _id: 1,
        studentName: "$name",
        coachingEndDate: "$coachingDetails.endDate",
        attendenceRecords: 1,
      },
    },
  ]);

  // --- Response ---
  return {
    totalRecords,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    pageSize: limit,
    data,
  };
},

  delete: async (studentId, date) => {
    const start = new Date(date);   
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const deleted = await Attendence.deleteOne({
      student: studentId,
      date: { $gte: start, $lte: end },
    });
    return deleted;
  },
};

module.exports = attendenceServices;
