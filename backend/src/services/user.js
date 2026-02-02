const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const axios = require("axios");

const User = require("../../model/user");
const LoginHistory = require("../../model/loginHistory");
const Role = require("../../model/masters/roles");
const Lead = require("../../model/lead");
const B2BAdmin = require("../../model/masters/b2b/b2bAdmin");
const B2BMember = require("../../model/masters/b2b/b2bMember");
const Branch = require("../../model/branch/branches");
const BranchMember = require("../../model/branch/branchMember");
const CoachingFaculty = require("../../model/masters/coachingDetails/coachingFaculty");
const RolePermission = require("../../model/rolesPermission");
const StudentApplication = require("../../model/masters/studentApplication/studentApplication");
const CrmSettings = require("../../model/crmSettings");

const { storeOTP, verifyOTP } = require("../../utils/otp");
const { sendOTPEmail } = require("../../middleware/nodemailer");
const checkEmailUniqueness = require("../../helpers/uniqueEmail");
const findUserAndModel = require("../../helpers/findModel");

const paginate = require("../../utils/pagination");
const coachingFaculty = require("../../model/masters/coachingDetails/coachingFaculty");
const { populate } = require("../../model/configuration");

const userServices = {
  register: async (userData, files, userId, userName) => {
    let {
      name,
      email,
      phone,
      role,
      country,
      b2bCountry,
      b2bState,
      birthdayDate,
      joiningDate,
      viewSpecificB2B,
      password,
      b2bAdminId,
      viewB2BStudentApplication,
      whichB2BStudentApplication,
      branchId,
      restrictByIp,
      allowedIps,
      assignedB2B,
    } = userData;

    // const logo = files["logo"] ? `uploads/${files["logo"][0].filename}` : null;
    // const profile = files["profile"]
    //   ? `uploads/${files["profile"][0].filename}`
    //   : null;

    await checkEmailUniqueness(email);

    const checkUsername = await User.findOne({ name });
    if (checkUsername) {
      throw {
        status: false,
        message: "User already exists with this username",
      };
    }

    if (typeof country === "string") {
      country = country.split(",").map((item) => item.trim());
    }

    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    let userRole = null;
    if (branchId) {
      let branchRole = await Role.findOne({ name: "Branch User" });

      if (!branchRole) {
        branchRole = await Role.create({ name: "Branch User" });
      }
      userRole = branchRole._id;
    }

    let originalRestrictByIp;
    if (restrictByIp !== undefined) {
      originalRestrictByIp = restrictByIp;
    }

    const newUser = await User.create({
      name,
      email,
      // logo,
      phone,
      // profile,
      role,
      userRole,
      country,
      b2bCountry,
      b2bState,
      birthdayDate,
      joiningDate,
      viewSpecificB2B,
      password: hashedPassword,
      b2bAdminId,
      viewB2BStudentApplication,
      whichB2BStudentApplication,
      branchId,
      restrictByIp,
      originalRestrictByIp,
      allowedIps,
      assignedB2B,
      created_by: userId,
      createdByName: userName,
    });

    return newUser;
  },

  requestOTP: async (email) => {
    const result = await findUserAndModel(email);
    if (!result) throw { status: false, message: "User not found" };

    const otp = await storeOTP(email, result.model);
    await sendOTPEmail(email, otp);
    return "OTP sent successfully";
  },

  login: async (loginData, req) => {
    const { email, otp, password, location, ipAddress, googleId } = loginData;
    let user;
    let userType = null;
    let loginType = null;
    let loginStatus = "failed";
    let locationName = null;

    if (location && location.latitude && location.longitude) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`,
        );
        locationName = response.data.display_name || "Unknown Location";
      } catch (error) {
        console.error("Reverse geocoding error:", error.message);
        locationName = "Unknown Location";
      }
    }

    const clientIp = ipAddress || "Unknown IP";
    user = await User.findOne({ email })
      .populate("role", "name")
      .populate("userRole", "name")
      .populate("branchId", "name")
      .lean();

    if (user?.restrictByIp && user.allowedIps && user.allowedIps.length > 0) {
      if (!user.allowedIps.includes(clientIp)) {
        throw {
          status: false,
          message: `Login not allowed from this IP (${clientIp})`,
        };
      }
    }

    if (password) {
      loginType = "password";

      // Step 1: Try finding user in User collection
      user = await User.findOne({ email })
        .populate("role", "name")
        .populate("userRole", "name")
        .populate("branchId", "name");

      if (user) {
        if (user.status !== "Active") {
          throw {
            status: false,
            message: "Your account is inactive. Please contact support.",
          };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw { status: false, message: "Invalid Credentials" };
        }
        if (user.branchId) {
          userType = "Branch User";
        } else {
          userType = "user";
        }
      } else {
        // Step 2: Try finding user in Branch collection
        user = await Branch.findOne({ email });

        if (user) {
          if (user.status !== "Active") {
            throw {
              status: false,
              message: "Your account is inactive. Please contact support.",
            };
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw { status: false, message: "Invalid Credentials" };
          }
          userType = "Branch";
        } else {
          // Step 3: Try finding user in BranchMember collection
          user = await BranchMember.findOne({ email }).populate(
            "branch",
            "name",
          );
          if (user) {
            if (user.status !== "Active") {
              throw {
                status: false,
                message: "Your account is inactive. Please contact support.",
              };
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              throw { status: false, message: "Invalid Credentials" };
            }
            userType = "Branch Member";
          } else {
            // Step 4: Try finding user in B2BAdmin collection
            user = await B2BAdmin.findOne({ email });

            if (user) {
              if (user.status !== "Active") {
                throw {
                  status: false,
                  message: "Your account is inactive. Please contact support.",
                };
              }

              const isMatch = await bcrypt.compare(password, user.password);
              if (!isMatch) {
                throw { status: false, message: "Invalid Credentials" };
              }
              userType = "B2B Admin";
            } else {
              // Step 5: Try finding user in B2BMember collection
              // user = await B2BMember.findOne({ email }).populate("b2bAdmin", "companyName companyLogo").populate("userRole", "name");

              // if (!user) {
              //   throw { status: false, message: "User not found" };
              // }

              // if (user.status !== "Active") {
              //   throw {
              //     status: false,
              //     message: "Your account is inactive. Please contact support.",
              //   };
              // }
              // const isMatch = await bcrypt.compare(password, user.password);
              // if (!isMatch) {
              //   throw { status: false, message: "Invalid Credentials" };
              // }
              // userType = "B2B Member";

              user = await B2BMember.findOne({ email })
                .populate("b2bAdmin", "companyName companyLogo")
                .populate("userRole", "name");
              if (user) {
                if (user.status !== "Active") {
                  throw {
                    status: false,
                    message:
                      "Your account is inactive. Please contact support.",
                  };
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                  throw { status: false, message: "Invalid Credentials" };
                }
                userType = "B2B Member";
              } else {
                user = await CoachingFaculty.findOne({ email }).populate(
                  "userRole",
                  "name",
                );

                if (user) {
                  if (user.status && user.status !== "Active") {
                    throw {
                      status: false,
                      message:
                        "Your account is inactive. Please contact support.",
                    };
                  }

                  const isMatch = await bcrypt.compare(password, user.password);
                  if (!isMatch) {
                    throw { status: false, message: "Invalid Credentials" };
                  }

                  userType = "Coaching Faculty";
                }
                // else {
                //   user = await StudentApplication.findOne({ email });

                //   if (!user) {
                //     throw { status: false, message: "User not found" };
                //   }

                //   const isMatch = await bcrypt.compare(password, user.password);
                //   if (!isMatch) {
                //     throw { status: false, message: "Invalid Credentials" };
                //   }

                //   userType = "Student";
                // }
                else {
                  user = await StudentApplication.findOne({ email });

                  if (user) {
                    const isMatch = await bcrypt.compare(
                      password,
                      user.password,
                    );
                    if (!isMatch) {
                      throw { status: false, message: "Invalid Credentials" };
                    }
                    userType = "Student";
                  } else {
                    user = await Lead.findOne({ email });
                    if (!user) {
                      throw { status: false, message: "User not found" };
                    }

                    if (!user.password) {
                      throw {
                        status: false,
                        message: "Password login not allowed for lead",
                      };
                    }

                    const isMatch = await bcrypt.compare(
                      password,
                      user.password,
                    );
                    if (!isMatch) {
                      throw { status: false, message: "Invalid Credentials" };
                    }

                    userType = "LeadStudent";
                  }
                }
              }
            }
          }
        }
      }
    } else {
      loginType = "otp";

      const otpModels = [
        {
          model: User,
          type: "user",
          populate: [{ path: "role", select: "name" }],
        },
        { model: Branch, type: "Branch" },
        {
          model: BranchMember,
          type: "Branch Member",
          populate: [{ path: "branch", select: "name" }],
        },
        {
          model: B2BAdmin,
          type: "B2B Admin",
        },
        {
          model: B2BMember,
          type: "B2B Member",
          populate: [
            { path: "b2bAdmin", select: "companyName companyLogo" },
            { path: "userRole", select: "name" },
          ],
        },
        {
          model: CoachingFaculty,
          type: "Coaching Faculty",
          populate: [{ path: "userRole", select: "name" }],
        },
        {
          model: StudentApplication,
          type: "Student",
          // populate: [
          //   { path: "branch", select: "name" },
          //   { path: "course", select: "programName" },
          // ],
        },
        {
          model: Lead,
          type: "LeadStudent",
        },
      ];

      let foundUser = null;
      let foundType = null;
      for (const m of otpModels) {
        try {
          const u = await verifyOTP(email, otp, m.model);

          if (u) {
            // if (u.status !== "Active") {
            //   throw {
            //     status: false,
            //     message: "Your account is inactive. Please contact support.",
            //   };
            // }
            let populatedUser = u;
            if (m.populate) {
              populatedUser = await m.model
                .findById(u._id)
                .populate(m.populate);
            }
            foundUser = populatedUser;
            foundType = m.type;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      if (!foundUser) {
        throw { status: false, message: "Invalid or Expired OTP" };
      }

      user = foundUser;
      userType = foundType;
    }

    loginStatus = "success";
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: [
          "user",
          "Branch User",
          "B2B Member",
          "Coaching Faculty",
          "Student",
          "LeadStudent",
        ].includes(userType)
          ? user.role
          : userType,
        userRole: user.userRole,
        userType,
        userName: ["B2B Member"].includes(userType)
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
          : user.name || user.companyName,
        b2bName:
          userType === "B2B Member" ? user.b2bAdmin?.companyName : undefined,
        branch:
          userType === "Branch"
            ? { _id: user._id, name: user.name }
            : userType === "Branch User"
              ? user.branchId?.name
              : undefined,
        viewB2BStudentApplication: user.viewB2BStudentApplication,
        whichB2BStudentApplication: user.whichB2BStudentApplication,
        assignedB2B: user.assignedB2B,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // const ipAddress = req.headers["x-forwarded-for"]?.split(',').shift() ||
    //                   req.socket?.remoteAddress ||
    //                   req.ip ||
    //                   'Unknown IP'

   
    const getRoleName = (role) => {
  if (!role) return "";

  // If role is object like { _id, name }
  if (typeof role === "object" && role.name) {
    return role.name;
  }

  // If array
  if (Array.isArray(role)) {
    return getRoleName(role[0]);
  }

  // If already string
  return String(role).trim();
};
    await LoginHistory.create({
      user: user._id,
      ipAddress,
      loginType,
      loginStatus,
      role: userType === "user" ? getRoleName(user.role) : userType,
      location: location
        ? { latitude: location.latitude, longitude: location.longitude }
        : undefined,
      locationName: locationName || undefined,
    });

    let rolePermissions = null;
    if (
      [
        "user",
        "B2B Admin",
        "B2B Member",
        "Branch",
        "Branch User",
        "Coaching Faculty",
      ].includes(userType)
    ) {
      const currentRole =
        userType === "B2B Member" ||
        userType === "Branch Member" ||
        userType === "Coaching Faculty"
          ? user.userRole
          : user.role;

      if (currentRole?._id || currentRole) {
        const roleId = currentRole._id || currentRole;
        const rolePermissionDoc = await RolePermission.findOne({
          role: roleId,
        }).populate({
          path: "role",
          select: "name",
        });

        if (rolePermissionDoc) {
          rolePermissions = rolePermissionDoc.tabs;
        }
      }
    }

    // const roleSource = userType === "B2B Member" ? user.userRole : user.role;
    const roleSource = ["B2B Member", "Coaching Faculty"].includes(userType)
      ? user.userRole
      : user.role;

    const roleName =
      userType === "user"
        ? roleSource?.name
        : userType === "Branch"
          ? "Branch"
          : userType === "Branch User"
            ? roleSource?.name
            : userType === "B2B Admin"
              ? "B2B Admin"
              : userType === "B2B Member"
                ? roleSource?.name
                : userType === "Coaching Faculty"
                  ? roleSource?.name
                  : userType;

    const tokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();
    // const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { tokens: { token } } },
      { new: true },
    );

    return {
      user: {
        _id: user._id,
        email: user.email,
        username: user.name || user.companyName,
        role: {
          _id: roleSource?._id,
          name: roleName,
        },
        userRole: user.userRole,
        branch: user.branchId,
        status: user.status,
        userType,
        rolePermissions,
      },
      token,
      tokenExpiry,
      ...(userType === "B2B Admin" && { companyLogo: user.companyLogo }),
      ...(userType === "B2B Member" && {
        companyLogo: user.b2bAdmin?.companyLogo || null,
      }),
    };
  },

  updateUser: async (id, updateData, files, userId, userName) => {
    const {
      email,
      password,
      viewB2BStudentApplication,
      whichB2BStudentApplication,
      restrictByIp,
    } = updateData;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      throw { status: false, message: "User not found" };
    }
    if (email && email !== existingUser.email) {
      await checkEmailUniqueness(email, id, "User");
    }

    // if (files && files["logo"]) {
    //   updateData.logo = `uploads/${files["logo"][0].filename}`;
    // }
    if (files && files["profileImage"]) {
      updateData.profileImage = `/uploads/${files["profileImage"][0].filename}`;
    }

    let updatePayload = {
      ...updateData,
      updated_by: userId,
      updatedByName: userName,
    };

    if (typeof viewB2BStudentApplication !== "undefined") {
      updatePayload.viewB2BStudentApplication = viewB2BStudentApplication;
    }

    if (typeof whichB2BStudentApplication !== "undefined") {
      updatePayload.whichB2BStudentApplication = whichB2BStudentApplication;
    }

    if (typeof restrictByIp !== "undefined") {
      updatePayload.originalRestrictByIp = restrictByIp;
    }
    if (updateData.currentPassword && updateData.password) {
      const isMatch = await bcrypt.compare(
        updateData.currentPassword,
        existingUser.password,
      );

      if (!isMatch) {
        throw { status: false, message: "Current password is incorrect" };
      }

      const saltRounds = 10;
      updatePayload.password = await bcrypt.hash(
        updateData.password,
        saltRounds,
      );

      // Optional: logout user from all devices
      updatePayload.tokens = [];
    }

    const updateUser = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!updateUser) {
      throw { status: false, message: "User not found" };
    }

    return updateUser;
  },

  getOneUser: async (userId) => {
    const getOne = await User.findById(userId);

    if (!getOne) {
      throw { status: false, message: "User not found" };
    }
    return getOne;
  },

  // getAllUser: async (
  //   page,
  //   limit,
  //   searchText = "",
  //   role = "",
  //   branchId = "",
  //   showAll = false,
  // ) => {
  //   const searchOptions = { searchText, searchFields: ["name"] };
  //   const populateFields = [
  //     { path: "role", select: "name" },
  //     { path: "userRole", select: "name" },
  //     { path: "created_by", select: "name" },
  //     { path: "branchId", select: "name address city state country" },
  //   ];

  //   const filter = {};

  //   let modelToQuery = User; // default model

  //   if (role) {
  //     let roleFilter = { name: role };
  //     if (branchId) {
  //       roleFilter.branchId = branchId;
  //     }

  //     const roleData = await Role.findOne(roleFilter);
  //     if (!roleData) {
  //       throw { status: false, message: "Role not found" };
  //     }

  //     filter.role = roleData._id;

  //     // Decide which model to query based on the role name
  //     switch (role) {
  //       case "B2B Admin":
  //         modelToQuery = B2BAdmin;
  //         break;
  //       case "B2B Member":
  //         modelToQuery = B2BMember;
  //         break;
  //       case "Branch":
  //         modelToQuery = Branch;
  //         break;
  //       case "Branch Member":
  //         modelToQuery = BranchMember;
  //         break;
  //       default:
  //         modelToQuery = User;
  //         break;
  //     }
  //   }

  //   if (String(showAll) !== "true") {
  //     if (branchId) {
  //       filter.branchId = branchId;
  //     } else {
  //       filter.branchId = { $in: [null, undefined] };
  //     }
  //   }

  //   const getAll = await paginate(
  //     modelToQuery,
  //     filter,
  //     page,
  //     limit,
  //     { createdAt: -1 },
  //     populateFields,
  //     searchOptions,
  //   );

  //   if (!getAll || !getAll.data || getAll.data.length === 0) {
  //     throw { status: false, message: "No user found" };
  //   }

  //   return getAll;
  // },

   getAllUser: async (
    page,
    limit,
    searchText = "",
    role = "",
    branchId = "",
    showAll = false,
  ) => {
    const searchOptions = { searchText, searchFields: ["name"] };
    const populateFields = [
      { path: "role", select: "name" },
      { path: "userRole", select: "name" },
      { path: "created_by", select: "name" },
      { path: "branchId", select: "name address city state country" },
    ];

    const filter = {};

    let modelToQuery = User; // default model

    if (role) {
  let roles;

  if (showAll) {
    // Get ALL roles with same name across branches
    roles = await Role.find({ name: role }).select("_id");
  } else {
    // Normal branch-wise role
    let roleFilter = { name: role };
    if (branchId) roleFilter.branchId = branchId;

    const roleData = await Role.findOne(roleFilter).select("_id");
    if (!roleData) {
      throw { status: false, message: "Role not found" };
    }
    roles = [roleData];
  }

  const roleIds = roles.map(r => r._id);

  filter.role = { $in: roleIds };

  // Model selection stays based on role name (not ID)
  switch (role) {
    case "B2B Admin":
      modelToQuery = B2BAdmin;
      break;
    case "B2B Member":
      modelToQuery = B2BMember;
      break;
    case "Branch":
      modelToQuery = Branch;
      break;
    case "Branch Member":
      modelToQuery = BranchMember;
      break;
    default:
      modelToQuery = User;
      break;
  }
}


    if (String(showAll) !== "true") {
      if (branchId) {
        filter.branchId = branchId;
      } else {
        filter.branchId = { $in: [null, undefined] };
      }
    }

    const getAll = await paginate(
      modelToQuery,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions,
    );

    if (!getAll || !getAll.data || getAll.data.length === 0) {
      throw { status: false, message: "No user found" };
    }

    return getAll;
  },
  
  getAllCounselors: async () => {
    const role = await Role.findOne({ name: "counselor" });
    if (!role) {
      throw { status: true, message: "Counselor role not found" };
    }

    const users = await User.find({ role: role._id });

    if (!users.length) {
      throw { status: true, message: "No counselor found" };
    }

    return users;
  },

  deleteUser: async (targetUserId, loggedInUserId) => {
    const userToDelete = await User.findById(targetUserId);
    if (!userToDelete) {
      return { status: false, message: "User not found" };
    }

    // Try to find logged-in user in any of the three models
    let loggedInUser =
      (await User.findById(loggedInUserId)) ||
      (await Branch.findById(loggedInUserId)) ||
      (await B2BAdmin.findById(loggedInUserId));

    if (!loggedInUser) {
      return {
        status: false,
        message: "Requesting user not found in any model",
      };
    }

    // Prevent deleting creator
    if (String(loggedInUser.created_by) === String(userToDelete._id)) {
      return {
        status: false,
        message: "You are not allowed to delete the user who created you.",
      };
    }

    // Proceed with delete
    await User.findByIdAndDelete(targetUserId);

    return { status: true, message: "User deleted successfully" };
  },
  getLoginHistory: async (page, limit) => {
    const populateFields = [
      {
        path: "user",
        select: "name role",
        populate: {
          path: "role",
          select: "name",
        },
      },
    ];
    const history = await paginate(
      LoginHistory,
      {},
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      {},
    );

    if (!history) {
      throw { status: false, message: "No history found" };
    }

    const formattedHistory = history.data.map((entry) => ({
      _id: entry._id,
      user: entry.user,
      loginTime: moment(entry.loginTime).format("DD-MM-YYYY HH:mm"),
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      loginType: entry.loginType,
      status: entry.status,
      message: entry.message,
    }));

    return formattedHistory;
  },
  globalIpRestriction: async (role, data) => {
    const { enable } = data;
    const roleName = typeof role === "string" ? role : role?.name;

    if (roleName !== "Super Admin") {
      throw { status: false, message: "you do not have access" };
    }
    if (enable) {
      await User.updateMany(
        {
          originalRestrictByIp: true,
        },
        {
          $set: { restrictByIp: true },
        },
      );
    } else {
      await User.updateMany({}, { $set: { restrictByIp: false } });
    }

    // Optional: verify creation
    const settingExists = await CrmSettings.findOne({});
    console.log("enablee", enable);
    if (!settingExists) {
      await CrmSettings.create({ ipRestriction: enable });
    } else {
      await CrmSettings.updateOne(
        {}, // match first (or any) document
        { $set: { ipRestriction: enable } },
        { new: true }, // create if none exists
      );
    }
    return `Global IP restriction ${
      enable ? "enabled" : "disabled"
    } successfully`;
  },
};

module.exports = userServices;
