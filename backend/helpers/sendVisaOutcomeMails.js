const Role = require("../model/masters/roles");
const User = require("../model/user");
const { getVisaDecision } = require("./visaflowStatusResolver");
const {
  getEmailRecipient,
} = require("./getRecipientDetails");

const {
  sendVisaStatusUpdateEmail,
  sendNewEligibleStudentEmail
} = require("../middleware/nodemailer");

module.exports.sendVisaOutcomeMails = async ({
  country,
  student,
  updateVisaData,
}) => {
  // 1️⃣ Get normalized decision (Approved / Refused / Granted etc.)
  const decision = getVisaDecision(country, updateVisaData);

  if (!decision) return; // nothing to send

  // 2️⃣ Send Visa Status Update mail (student + counselor)
  const recipients = await getEmailRecipient(student);

  for (const { recipientEmail, recipientType } of recipients) {
    await sendVisaStatusUpdateEmail(
      recipientEmail,
      student.studentId,
      decision,                 
      student.updatedAt,
      student.name,
      recipientType
    );
  }

  // 3️⃣ If Approved → notify Admin & Accountant
  if (decision === "Approved" || decision === "Granted") {
    const roles = await Role.find({
      name: { $in: ["Super Admin", "Accountant"] },
    }).select("_id");

    const roleIds = roles.map((r) => r._id);

    const notifyUsers = await User.find({
      role: { $in: roleIds },
      email: { $ne: null },
    }).select("email");

    for (const user of notifyUsers) {
      await sendNewEligibleStudentEmail(
        user.email,
        student.studentId,
        "Visa Approved",
        student.name
      );
    }
  }
};
