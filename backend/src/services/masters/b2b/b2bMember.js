const bcrypt = require("bcrypt");

const B2BMember = require("../../../../model/masters/b2b/b2bMember");
const B2BAdmin = require("../../../../model/masters/b2b/b2bAdmin");
const Role = require("../../../../model/masters/roles");

const paginate = require("../../../../utils/pagination");
const checkEmailUniqueness = require("../../../../helpers/uniqueEmail");

const b2bMemberServices = {
  create: async (data, userId, userName) => {
    const { b2bAdmin, password, email } = data;

    await checkEmailUniqueness(email);

    const admin = await B2BAdmin.findById(b2bAdmin);
    if (!admin) {
      throw { status: false, message: "B2B Admin not found" };
    }

    const memberCount = await B2BMember.countDocuments({ b2bAdmin });
    if (memberCount >= admin.memberLimit) {
      throw {
        status: false,
        message: `Member limit reached. Only ${admin.memberLimit} members allowed.`,
      };
    }
    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const userRole = await Role.findOne({ name: "B2B Member" });
    if(!userRole){
      throw{
        status: false,
        message: "B2B Member role not found in Role collection"
      }
    }

    data.created_by = userId;
    data.createdByName = userName;
    const newMember = await B2BMember.create({
      ...data,
      password: hashedPassword,
      userRole: userRole
    });
    return newMember;
  },

  update: async (updateId, updateData, userId, userName) => {


    const {email , password} = updateData;

    const existingB2B = await B2BMember.findById(updateId);
    if(!existingB2B) {
      throw {status: false, message: "B2B Member not found"};
    }

    if(email && email !== existingB2B.email){
      await checkEmailUniqueness(email, updateId, "B2BMember")
    }
    
    let updatePayload = { ...updateData, updated_by: userId, updatedByName: userName };

    if(password){
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatePayload.password = hashedPassword;
    }

    const updated = await B2BMember.findByIdAndUpdate(
      updateId,
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw { status: false, message: "B2B Member not found" };
    }

    return updated;
  },
  getById: async (id) => {
    const member = await B2BMember.findById(id);
    if (!member) {
      throw { status: false, message: "B2B Member not found" };
    }
    return member;
  },
  getAll: async (page, limit, searchText = "") => {
    const populateFields = [
      { path: "b2bAdmin", select: "companyName" },
      { path: "role", select: "name" },
      { path: "created_by", select: "name" },
    ];

    const searchOptions = {
      searchText,
      searchFields: ["firstName", "lastName", "role"],
    };

    const result = await paginate(
      B2BMember,
      {},
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );
    return result;
  },
  delete: async (id) => {
    const deleted = await B2BMember.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "B2B Member not found or already deleted",
      };
    }
    return "B2B Member deleted succesfully";
  },

  getMemberByAdmin: async (page, limit, searchText = "", b2bAdminId, roleId) => {
    const populateFields = [
      { path: "b2bAdmin", select: "companyName" },
      { path: "created_by", select: "name" },
      { path: "role", select: "name" },
    ];
    const searchOptions = {
      searchText,
      searchFields: ["firstName", "lastName", "email", "phone"],
    };

    const filter = {
      b2bAdmin: b2bAdminId,
    };
    if(roleId) {
      filter.role = roleId
    }
    const result = await paginate(
      B2BMember,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );
    return result;
  },
};

module.exports = b2bMemberServices;
