const bcrypt = require("bcrypt");
const { createObjectCsvWriter } = require("csv-writer");
const path = require("path");
const fs = require("fs");
const B2BAdmin = require("../../../../model/masters/b2b/b2bAdmin");
const B2BMember = require("../../../../model/masters/b2b/b2bMember");
const Role = require("../../../../model/masters/roles");
const User = require("../../../../model/user");

const paginate = require("../../../../utils/pagination");
const { verifyOTP } = require("../../../../utils/otp");
const checkEmailUniqueness = require("../../../../helpers/uniqueEmail");
const {
  sendNewB2BPartnerEmail,
  sendB2BWelcomeEmail,
} = require("../../../../middleware/nodemailer");
const { deleteFromCloudinary } = require("../../../../middleware/cloudinary");

const b2bAdminServices = {
  create: async (data) => {
    const { companyName, email, password, subscription } = data; // New add : subscription

    // Step 1: Check company name uniqueness
    const existingCompany = await B2BAdmin.findOne({ companyName });
    if (existingCompany) {
      throw { status: false, message: "Company name already exists" };
    }

    // Step 2: Check email uniqueness
    await checkEmailUniqueness(email);

    // Step 3: Hash password if provided
    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Step 4: Get B2B Admin role
    const b2bAdminRole = await Role.findOne({ name: "B2B Admin" });
    if (!b2bAdminRole) {
      throw {
        status: false,
        message: "B2B Admin role not found in Role collection",
      };
    }

    // Step 5: Create new B2B admin
    const newB2bAdmin = await B2BAdmin.create({
      ...data,
      password: hashedPassword,
      role: b2bAdminRole._id,
    });

    // Step 6: Notify internal roles in parallel
    const internalRoles = [
      "Super Admin",
      "B2B Manager",
      "Head Of B2B",
      "Head Of Operations",
    ];
    const roles = await Role.find({ name: { $in: internalRoles } });
    const roleIds = roles.map((role) => role._id);

    const notifyUsers = await User.find({ role: { $in: roleIds } });

    await Promise.all(
      notifyUsers.map(async (user) => {
        try {
          await sendNewB2BPartnerEmail(user.email, companyName);
        } catch (error) {
          console.error(`❌ Failed to notify ${user.email}:`, error.message);
        }
      })
    );

    // Step 7: Send welcome email in background
    setImmediate(() => {
      sendB2BWelcomeEmail(email, companyName, password).catch((err) =>
        console.error("❌ Welcome email failed:", err.message)
      );
    });

    return newB2bAdmin;
  },

  update: async (id, data, userId, userName) => {
    const { companyName, email, password, currentPassword, otp, subscription } =
      data;

    const existingB2B = await B2BAdmin.findById(id);
    if (!existingB2B) {
      throw { status: false, message: "B2B Admin not found" };
    }

    if (email && email !== existingB2B.email) {
      await checkEmailUniqueness(email, id, "B2BAdmin");
    }

    const duplicate = await B2BAdmin.findOne({
      _id: { $ne: id },
      companyName,
    });

    if (duplicate) {
      throw { status: false, message: "Company name already exists" };
    }
    const b2bAdminRole = await Role.findOne({ name: "B2B Admin" });
    if (!b2bAdminRole) {
      throw {
        status: false,
        message: "B2B Admin role not found in Role collection",
      };
    }
    let updatePayload = {
      ...data,
      role: b2bAdminRole._id,
      updated_by: userId,
      updatedByName: userName,
    };

    if (password) {
      const hasExistingPassword = !!existingB2B.password;
      const isSelfUpdate = userId.toString() === id.toString();

      if (hasExistingPassword && isSelfUpdate) {
        const isOtpFlow = otp && !currentPassword;
        const isPasswordFlow = currentPassword && !otp;

        if (isPasswordFlow) {
          const match = await bcrypt.compare(
            currentPassword,
            existingB2B.password
          );
          if (!match) {
            throw { status: false, message: "Current password is incorrect" };
          }
        } else if (isOtpFlow) {
          await verifyOTP(existingB2B.email, otp, B2BAdmin);
        } else {
          throw {
            status: false,
            message:
              "To change the password, either current password or OTP must be provided",
          };
        }
      }

      // Allow update if password is being changed by admin or it's a new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatePayload.password = hashedPassword;
    }
    
    const updated = await B2BAdmin.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (data.status === "Inactive") {
      await B2BMember.updateMany(
        { b2bAdmin: id },
        { $set: { status: "Inactive" } }
      );
    }
    if (data.status === "Active") {
      await B2BMember.updateMany(
        { b2bAdmin: id },
        { $set: { status: "Active" } }
      );
    }

    return updated;
  },

  getById: async (id) => {
    const admin = await B2BAdmin.findById(id);
    if (!admin) {
      throw { status: false, message: "B2B Admin not found" };
    }
    return admin;
  },

  getAll: async (
    page,
    limit,
    searchText = "",
    status = "",
    country = "",
    subscription = ""
  ) => {
    const populateFields = [
      { path: "b2bAssignRole", select: "name" },
      { path: "assignTeam", select: "name" },
      { path: "created_by", select: "name" },
    ];

    const searchOptions = {
      searchText,
      searchFields: ["companyName", "email", "contactPerson", "city", "state"],
    };

    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (country) {
      filter.country = country;
    }
    if (subscription !== "") {
      filter.subscription = subscription === "true";
    }

    const result = await paginate(
      B2BAdmin,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );
    return result;
  },

  b2bCountry: async () => {
    const countryList = await B2BAdmin.aggregate([
      { $match: { country: { $ne: "" } } },
      { $group: { _id: "$country" } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, country: "$_id" } },
    ]);
    return countryList.map((item) => item.country);
  },

  delete: async (id) => {
    const admin = await B2BAdmin.findById(id);
    if (!admin) {
      throw {
        status: false,
        message: "B2B Admin not found or already deleted",
      };
    }

    await B2BAdmin.findByIdAndDelete(id);
    await B2BMember.deleteMany({ b2bAdmin: id }); // delete Members created by Admin

    return "B2B Admin, associated User, and related Members deleted successfully";
  },

  bulkAddB2BAdmins: async (formattedB2BAdmins) => {
    return await B2BAdmin.insertMany(formattedB2BAdmins);
  },
  downloadB2bAdmin: async (search, status, country, subscription) => {
   
    const filter = {};

    if (search) {
      const regex = { $regex: search, $options: "i" };
      filter.$or = [
        { companyName: regex },
        { email: regex },
        { contactPerson: regex },
        { city: regex },
        { state: regex },
      ];
    }

    if (status) {
      filter.status = status;
    }
    if (country) {
      filter.country = country;
    }
    if (subscription !== "") {
      filter.subscription = subscription === "true";
    }

    const b2bList = await B2BAdmin
      .find(filter)
      .populate([{ path: "b2bAssignRole", select: "name" }, { path: "assignTeam" , select: "name" } , { path: "created_by" , select: "name" }])
      .sort({ createdAt: -1 })
      .lean();

    if(!b2bList.length)
      return { success: false, message: "No B2B Admin fond for selected filters" };

    const downloadsDir = path.join(__dirname, "../../../../public");
    if(!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const filePath = path.join(downloadsDir, `b2bList_${Date.now()}.csv`);
   
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        {id: "companyName" , title: "Company Name"},
        {id: "contactPerson" , title: "Contact Person"},
        {id: "country" , title: "Country"},
        {id: "state" , title: "State"},
        {id: "city" , title: "City"},
        {id: "phone" , title: "Phone"},
        {id: "email" , title: "Email"},
        {id: "commissionPercentage" , title: "Commission Percentage"},
        {id: "memberLimit" , title: "Member Limit"},
        { id: "status" , title: "Status"},
        {id: "agreementStartDate" , title: "Agreement StartDate"},
        {id: "agreementEndDate" , title: "Agreement EndDate"},
      ]
    });

    const records = b2bList.map((b) => ({
      companyName: b.companyName || "",
      contactPerson: b.contactPerson || "",
      country: b.country || "",
      state: b.state || "",
      city: b.city || "",
      phone: b.phone || "",
      email: b.email || "",
      commissionPercentage: b.commissionPercentage || "",
      memberLimit: b.memberLimit || "",
      status: b.status || "",
      agreementStartDate: b.agreementStartDate || "",
      agreementEndDate: b.agreementEndDate || "",
    }));


    await csvWriter.writeRecords(records);

    return { success: true, filePath };
  },
};

module.exports = b2bAdminServices;
