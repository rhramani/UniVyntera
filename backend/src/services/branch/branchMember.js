const bcrypt = require("bcrypt");

const Branch = require("../../../model/branch/branches");
const BranchMember = require("../../../model/branch/branchMember");
const Role = require("../../../model/masters/roles");

const paginate = require("../../../utils/pagination");
const checkEmailUniqueness = require("../../../helpers/uniqueEmail");

const branchMemberServices = {
  create: async (data, userId, userName) => {
    const { branch, password, email } = data;

    await checkEmailUniqueness(email);

    const findBranch = await Branch.findById(branch);
    if (!findBranch) {
      throw { status: false, message: "Branch not found" };
    }

    // const memberCount = await B2BMember.countDocuments({ b2bAdmin });
    // if (memberCount >= admin.memberLimit) {
    //   throw {
    //     status: false,
    //     message: `Member limit reached. Only ${admin.memberLimit} members allowed.`,
    //   };
    // }

    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    const userRole = await Role.findOne({ name: "Branch Member" });
    if(!userRole){
      throw{
        status: false,
        message: "Branch Member role not found in Role collection"
      }
    }

    data.created_by = userId;
    data.createdByName = userName;
    const newMember = await BranchMember.create({
      ...data,
      password: hashedPassword,
      userRole: userRole
    });
    return newMember;
  },

  update: async (updateId, updateData, userId, userName) => {


    const {email , password} = updateData;

    const existingMember = await BranchMember.findById(updateId);
    if(!existingMember) {
      throw {status: false, message: "Branch Member not found"};
    }

    if(email && email !== existingMember.email){
      await checkEmailUniqueness(email, updateId, "branchMember")
    }
    
    let updatePayload = { ...updateData, updated_by: userId, updatedByName: userName };

    if(password){
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatePayload.password = hashedPassword;
    }

    const updated = await BranchMember.findByIdAndUpdate(
      updateId,
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw { status: false, message: "Branch Member not found" };
    }

    return updated;
  },
  getById: async (id) => {
    const member = await BranchMember.findById(id);
    if (!member) {
      throw { status: false, message: "Branch Member not found" };
    }
    return member;
  },
  getAll: async (page, limit, searchText = "") => {
    const populateFields = [
      { path: "branch", select: "name" },
      { path: "role", select: "name" },
      { path: "created_by", select: "name" },
    ];

    const searchOptions = {
      searchText,
      searchFields: ["firstName", "lastName", "role"],
    };

    const result = await paginate(
      BranchMember,
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
    const deleted = await BranchMember.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Branch Member not found or already deleted",
      };
    }
    return "Branch Member deleted succesfully";
  },

  getMemberByBranch: async (page, limit, searchText = "", branchId) => {
    const populateFields = [
      { path: "branch", select: "name" },
      { path: "created_by", select: "name" },
      { path: "role", select: "name" },
    ];
    const searchOptions = {
      searchText,
      searchFields: ["firstName", "lastName", "email", "phone"],
    };

    const filter = {
      branch: branchId,
    };
    
    const result = await paginate(
      BranchMember,
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

module.exports = branchMemberServices;
