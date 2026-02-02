const Task = require("../model/taskManagement/task");
const User = require("../model/user");
const Role = require("../model/masters/roles");

const { sendTaskDueReminderEmail } = require("../middleware/nodemailer");

const sendTaskDueReminders = async () => {
  try {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      dueDate: { $gte: start, $lte: end },
    })
      .populate("user", "name email")
      .populate("priority", "name")
      .populate("created_by", "name");

    if (!tasks.length) {
      console.log("✅ No tasks due tomorrow");
      return;
    }

    const superAdminRole = await Role.findOne({ name: "Super Admin" });
    let superAdmins = [];

    if (superAdminRole) {
      superAdmins = await User.find(
        { role: superAdminRole._id },
        { name: 1, email: 1 }
      );
    }

    for (const task of tasks) {
      const priorityName = task?.priority?.name || "N/A";
      const assignedByName = task.createdByName || "System";

      for (const u of task.user || []) {
        if (u.email) {
          await sendTaskDueReminderEmail(
            u.email,
            u.name,
            task.title,
            priorityName,
            task.dueDate,
            assignedByName
          );
        }
      }

      for (const admin of superAdmins) {
        if (admin.email) {
          await sendTaskDueReminderEmail(
            admin.email,
            admin.name,
            task.title,
            priorityName,
            task.dueDate,
            assignedByName
          );
        }
      }
    }

    console.log(`📧 Reminder emails sent for ${tasks.length} tasks.`);
  } catch (error) {
    console.error("❌ Error in sendTaskDueReminders:", error);
  }
};



module.exports = sendTaskDueReminders;