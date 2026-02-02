const bcrypt = require("bcrypt");
const moment = require("moment");

const CoachingFaculty = require("../../../../model/masters/coachingDetails/coachingFaculty");
const Role = require("../../../../model/masters/roles");
const User = require("../../../../model/user");

const paginate = require("../../../../utils/pagination");

const { storeOTP, verifyOTP } = require("../../../../utils/otp");
const checkEmailUniqueness = require("../../../../helpers/uniqueEmail");
const findUserAndModel = require("../../../../helpers/findModel");

const coachingFacultyServices = {
  create: async (data, userId, userName) => {
    const { name, email, password } = data;

    await checkEmailUniqueness(email);

    const checkFaculty = await CoachingFaculty.findOne({ name });
    if (checkFaculty) {
      throw {
        status: false,
        message: "faculty already exist with this username ",
      };
    }

    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    let userRole = null;
    let findRole = await Role.findOne({ name: "Coaching Faculty" });
    if (!findRole) {
      findRole = await Role.create({ name: "Coaching Faculty" });
      userRole = findRole._id;
    } else {
      userRole = findRole._id;
    }

    const newFaculty = await CoachingFaculty.create({
      ...data,
      password: hashedPassword,
      userRole,
      created_by: userId,
      createdByName: userName,
    });

    return newFaculty;
  },
  update: async (id, updateData, userId, userName) => {
    const { email, password } = updateData;

    const existingUser = await CoachingFaculty.findById(id);

    if (!existingUser) {
      throw { status: false, message: "Coaching faculty not found" };
    }

    if (email && email !== existingUser.email) {
      await checkEmailUniqueness(email, id, "CoachingFaculty");
    }

    let updatedPayload = {
      ...updateData,
      updated_by: userId,
      updatedByName: userName,
    };

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatedPayload.password = hashedPassword;
    }

    const updateFaculty = await CoachingFaculty.findByIdAndUpdate(
      id,
      updatedPayload,
      { new: true }
    );
    return updateFaculty;
  },
  getOneUser: async (id) => {
    const getOne = await CoachingFaculty.findById(id);
    if (!getOne) {
      throw { status: false, message: "Coaching faculty not found" };
    }
    return getOne;
  },

  getAll: async (
    page,
    limit,
    searchText = "",
    batchStatus,
    type,
    currentUser,
    branchId , 
    showAll
  ) => {
    const searchOptions = { searchText, searchFields: ["name", "email"] };

    const populateFields = [{ path: "userRole", select: "name" } , {path: "branchId" , select: "name"}];

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    const filter = {};
    if (batchStatus && batchStatus.trim() !== "") {
      filter["batchDetails.status"] = batchStatus;
    }

    if (type && type.trim() !== "") {
      filter.types = { $in: [type] };
    }

    if (roleName === "Branch") {
      const branchMembers = await User.find({
        branchId: currentUser.userId,
      }).select("_id");
      const branchMemberIds = branchMembers.map((m) => m._id.toString());
      // filter.created_by = { $in: [currentUser.userId, ...branchMemberIds] };
      filter.branchId = currentUser.userId;
    } else if(roleName === "Branch User"){
      filter.created_by = currentUser.userId;
    }

    if(String(showAll) !== "true"){
      if(branchId) {
        filter.branchId = branchId;
      } else {
        filter.branchId = { $in: [null, undefined] };
      }
    } 

    const result = await paginate(
      CoachingFaculty,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );
    return result;
  },
  deleteData: async (id) => {
    const getData = await CoachingFaculty.findByIdAndDelete(id);
    if (!getData) {
      throw {
        status: false,
        message: "Coaching faculty not found or already deleted",
      };
    }
    return "Coaching faculty deleted succesfully";
  },
  getBatchTimes: async (facultyId, status) => {
    const filter = {};
    if (facultyId) {
      filter._id = facultyId;
    }

    const faculties = await CoachingFaculty.find(filter, {
      batchDetails: 1,
    }).lean();

    let batchTimes = [];

    faculties.forEach((f) => {
      if (Array.isArray(f.batchDetails)) {
        f.batchDetails.forEach((detail) => {
          if (!status || detail.status === status) {
            if (Array.isArray(detail.times)) {
              batchTimes.push(
                ...detail.times.filter((t) => t && t.trim() !== "")
              );
            }
          }
        });
      }
    });

    batchTimes = [...new Set(batchTimes)];

    return batchTimes;
  },
};

module.exports = coachingFacultyServices;
