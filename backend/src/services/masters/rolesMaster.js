const mongoose = require("mongoose");

const Roles = require("../../../model/masters/roles");
const User = require("../../../model/user");
const B2BMember = require("../../../model/masters/b2b/b2bMember");
const paginate = require("../../../utils/pagination");

const rolesServices = {
  createRole: async (data, branchId, userId, userName) => {
    const { name } = data;

    const query = { name };

    if (branchId) {
      query.branchId = branchId;
    } else {
      query.branchId = { $exists: false }; // or use null if you store null explicitly
    }

    const checkRole = await Roles.findOne(query);
    if (checkRole) {
      throw { status: false, message: "Role already exist in this scope" };
    }

    const newRole = await Roles.create({
      name,
      branchId: branchId || undefined,
      created_by: userId,
      createdByName: userName,
    });

    return newRole;
  },

  updateRole: async (roleId, branchId, updateData, userId, userName) => {
    const { name } = updateData;

    const existingRole = await Roles.findById(roleId);
    if (!existingRole) {
      throw { status: false, message: "Role not found" };
    }

    const trimmedName = name?.trim();

    if (trimmedName && trimmedName !== existingRole.name) {
      const query = {
        name: trimmedName,
        _id: { $ne: roleId },
      };

      if (branchId) {
        query.branchId = branchId;
      } else {
        query.branchId = { $exists: false };
      }

      const duplicate = await Roles.findOne(query);
      if (duplicate) {
        throw { status: false, message: "Role already exists in this scope" };
      }
    }

    const updatedRole = await Roles.findByIdAndUpdate(
      roleId,
      {
        ...(trimmedName && { name: trimmedName }),
        ...(branchId && { branchId }),
        updated_by: userId,
        updatedByName: userName,
      },
      { new: true }
    );

    return updatedRole;
  },

  getRoleById: async (roleId) => {
    const getRole = await Roles.findById(roleId).populate("branchId", "name");

    if (!getRole) {
      throw { status: false, message: "Role not found" };
    }

    return getRole;
  },

  getAllRoles: async (
    page,
    limit,
    searchText = "",
    branchId = "",
    showAll = false
  ) => {
    const populateFields = [
      {
        path: "branchId",
        select: "name",
      },
    ];
    const query = {};

    if (String(showAll) !== "true") {
      if (branchId) {
        query.branchId = branchId;
      } else {
        query.branchId = { $in: [null, undefined] };
      }
    }

    const searchOptions = { searchText, searchFields: ["name"] };
    const getAll = await paginate(
      Roles,
      query,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );

    if (!getAll) {
      return { status: false, message: "No roles found" };
    }

    return getAll;
  },

  //   getAllRolesWithoutPagination: async (branchId) => {
  //   const rolesWithUsers = await User.aggregate([
  //     { $match: { role: { $exists: true } } },
  //     { $group: { _id: "$role" } }
  //   ]);

  //   const roleIdsSet = new Set([
  //     ...rolesWithUsers.map(entry => entry._id.toString()),
  //   ]);

  //   const roleIdsWithUsers = Array.from(roleIdsSet);

  //   const query = { _id: { $in: roleIdsWithUsers } };

  //   if (branchId) {
  //     query.branchId = branchId;
  //   } else {
  //     query.branchId = { $in: [null, undefined] }; // Only roles without branch
  //   }

  //   const getAll = await Roles.find(query);

  //   if (!getAll || getAll.length === 0) {
  //     throw { status: false, message: "No roles found" };
  //   }

  //   return getAll;
  // },

  getAllRolesWithoutPagination: async (branchId = "", showAll = false) => {
    const query = {};

    if (String(showAll) !== "true") {
      if (branchId) {
        query.branchId = new mongoose.Types.ObjectId(branchId);
      } else {
        query.$or = [{ branchId: { $exists: false } }, { branchId: null }];
      }
    }

    const roles = await Roles.find(query)
      .populate({ path: "branchId", select: "name" })
      .sort({ createdAt: -1 });

    if (!roles || roles.length === 0) {
      throw { status: false, message: "No roles found" };
    }

    return roles;
  },
  deleteRole: async (roleId) => {
    const role = await Roles.findByIdAndDelete(roleId);

    if (!role) {
      throw { status: false, message: "Role not found" };
    }

    return "Role deleted successfully";
  },
};

module.exports = rolesServices;
