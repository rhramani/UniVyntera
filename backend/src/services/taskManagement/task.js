const mongoose = require("mongoose");

const Task = require("../../../model/taskManagement/task");
const paginate = require("../../../utils/pagination");
const User = require("../../../model/user");
const Branch = require("../../../model/branch/branches");

const { sendTaskAssignEmail } = require("../../../middleware/nodemailer");
const { getNotificationNamespace } = require("../../../socket");
const notification = require("../../../model/masters/notification/notification.js");
const taskServices = {
  create: async (data, userId, userName) => {
    const newData = await Task.create({
      ...data,
      created_by: userId,
      createdByName: userName,
    });

    const populatedTask = await Task.findById(newData._id).populate(
      "priority",
      "name"
    );

    const priorityName = populatedTask?.priority?.name || "N/A";

    if (Array.isArray(data.user) && data.user.length > 0) {
      const users = await User.find(
        { _id: { $in: data.user } },
        { name: 1, email: 1 }
      );

      const notificationNamespace = getNotificationNamespace();

      for (const u of users) {
        if (u.email) {
          await sendTaskAssignEmail(
            u.email,
            u.name,
            populatedTask.title,
            priorityName,
            populatedTask.dueDate,
            userName
          );
        }

        const newNotification = await notification.create({
          recipientId: u._id,
          message: `A new task "${populatedTask.title}" has been assigned to you by ${userName}.`,
          taskId: populatedTask._id,
          createdBy: userId,
        });

        if (notificationNamespace) {
          notificationNamespace
            .to(String(u._id))
            .emit("receive_notification", newNotification);
        }
      }
    }

    return newData;
  },
  update: async (updateId, updateData, userId, userName) => {
    const oldTask = await Task.findById(updateId).select("user");

    if (!oldTask) {
      throw { status: false, message: "Task not found" };
    }

    const updated = await Task.findByIdAndUpdate(
      updateId,
      {
        $set: {
          ...updateData,
          updated_by: userId,
          updatedByName: userName,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("priority", "name");

    if (!updated) {
      throw { status: false, message: "Task not found" };
    }

    const priorityName = updated?.priority?.name || "N/A";

    if (Array.isArray(updateData.user)) {
      const oldUsers = (oldTask.user || []).map(String);
      const newUsers = updateData.user.map(String);

      const newlyAssigned = newUsers.filter((id) => !oldUsers.includes(id));

      if (newlyAssigned.length > 0) {
        const users = await User.find(
          { _id: { $in: newlyAssigned } },
          { name: 1, email: 1 }
        );

        const notificationNamespace = getNotificationNamespace();

        for (const u of users) {
          // 📧 Email
          if (u.email) {
            await sendTaskAssignEmail(
              u.email,
              u.name,
              updated.title,
              priorityName,
              updated.dueDate,
              userName
            );
          }

          // 🔔 Notification
          const newNotification = await notification.create({
            recipientId: u._id,
            message: `A new task "${updated.title}" has been assigned to you by ${userName}.`,
            taskId: updated._id,
            createdBy: userId,
          });

          if (notificationNamespace) {
            notificationNamespace
              .to(String(u._id))
              .emit("receive_notification", newNotification);
          }
        }
      }
    }

    return updated;
  },

  getById: async (id) => {
    const task = await Task.findById(id)
      .populate("branch", "name")
      .populate("role", "name")
      .populate("user", "name")
      .populate("category", "name")
      .populate("priority", "name")
      .populate("type", "name")
      .populate("status", "name");

    if (!task) {
      throw { status: false, message: "Task not found" };
    }

    return task;
  },
  getAll: async (
    page,
    limit,
    searchText = "",
    showAll = false,
    branchId,
    role,
    user,
    status,
    category,
    priority,
    type,
    currentUser
  ) => {
    const populateFields = [
      { path: "branch", select: "name" },
      { path: "role", select: "name" },
      { path: "user", select: "name" },
      { path: "category", select: "name" },
      { path: "priority", select: "name" },
      { path: "type", select: "name" },
      { path: "status", select: "name" },
    ];

    let filter = {};

    const roleName =
      typeof currentUser.role === "string"
        ? currentUser.role
        : currentUser.role?.name;

    if (role) {
      if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
        filter.$and = filter.$and || [];
        filter.$and.push({
          $and: [{ role: role }, { branch: branchId }],
        });
      } else {
        filter.role = role;
      }
    }

    if (user && mongoose.Types.ObjectId.isValid(user)) {
      filter.user = new mongoose.Types.ObjectId(user);
    }

    if (status && mongoose.Types.ObjectId.isValid(status)) {
      filter.status = new mongoose.Types.ObjectId(status);
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    if (priority && mongoose.Types.ObjectId.isValid(priority)) {
      filter.priority = new mongoose.Types.ObjectId(priority);
    }

    if (type && mongoose.Types.ObjectId.isValid(type)) {
      filter.type = new mongoose.Types.ObjectId(type);
    }

    if (roleName === "Super Admin") {
      if (String(showAll) === "true") {
      } else if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
        const branchUsers = await User.find({ branchId }).select("_id");
        const branchUserIds = branchUsers.map((u) => u._id.toString());

        filter.$or = [
          // {
          //   created_by: { $in: [branchId, ...branchUserIds] },
          // },
          {
            branch: branchId,
          },
        ];
      } else {
        const noBranchUsers = await User.find({
          $or: [{ branchId: { $exists: false } }, { branchId: null }],
        }).select("_id");

        const noBranchUserIds = noBranchUsers.map((u) => u._id);

        filter.branch = null;
        // filter.created_by = {
        //   //   $in: noBranchUserIds,
        //   $in: [currentUser.userId, ...noBranchUserIds],
        // };
      }
    } else {
      if (roleName === "Branch") {
        const branchMembers = await User.find({
          branchId: currentUser.userId,
        }).select("_id");

        const branchMemberIds = branchMembers.map((m) => m._id.toString());

        filter.$or = [
          {
            created_by: { $in: [currentUser.userId, ...branchMemberIds] },
          },
          {
            branch: currentUser.userId,
          },
        ];
      } else if (currentUser.userType === "branch User") {
        filter.$or = [
          { created_by: currentUser.userId },
          {
            user: currentUser.userId,
          },
        ];
      } else {
        filter.$or = [
          { created_by: currentUser.userId },
          {
            user: currentUser.userId,
          },
        ];
      }
    }

    const searchOptions = { searchText, searchFields: ["title"] };

    const get = await paginate(
      Task,
      filter,
      page,
      limit,
      { createdAt: -1 },
      populateFields,
      searchOptions
    );
    if (!get) {
      throw { status: false, message: "Task not found" };
    }
    return get;
  },
  delete: async (id) => {
    const deleteData = await Task.findByIdAndDelete(id);

    if (!deleteData) {
      throw { status: false, message: "Task not found" };
    }
    return "Task deleted successfully";
  },
};

module.exports = taskServices;
