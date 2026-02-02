const studentApplication = require("../model/masters/studentApplication/studentApplication");
const { sendEmail, getConfig } = require("../middleware/nodemailer");
const { getEmailRecipient } = require("../helpers/getRecipientDetails");
const { addMailHistory } = require("../helpers/applicationProcessHistory");

const checkInstituteFeeDeadline = async ({
  studentId = null,
  triggeredBy = {
    source: "CRON",
    userId: null,
    userName: "SYSTEM (Auto Reminder)",
  },
} = {}) => {
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 1);
    endDate.setHours(23, 59, 59, 999);

    // ===== Fetch students having at least one matching course =====
    const filter = {
      interestedCourseDetails: {
        $elemMatch: {
          "instituteFeePayment.feeDeadline": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
    };

    if (studentId) {
      filter._id = studentId;
    }

    const students = await studentApplication
      .find(filter)
      .populate("interestedCourseDetails.institute", "instituteName")
      .populate("interestedCourseDetails.course", "programName");

    if (!students.length) {
      console.log("✅ No institute fee reminders found");
      return;
    }

    const config = await getConfig();
    const topLogoUrl = config.gmail?.topLogo
      ? process.env.BASE_URL + config.gmail.topLogo
      : "";
    const bottomLogoUrl = config.gmail?.bottomLogo
      ? process.env.BASE_URL + config.gmail.bottomLogo
      : "";

    for (const student of students) {
      if (!student.email) continue;

      // ✅ Filter only matching courses
      const dueCourses = student.interestedCourseDetails.filter((course) => {
        const deadline = course?.instituteFeePayment?.feeDeadline;
        const status = course?.instituteFeePayment?.feeStatus;

        return (
          deadline &&
          //   status !== "Paid" &&
          deadline >= startDate &&
          deadline <= endDate
        );
      });

      if (!dueCourses.length) continue;

      const recipients = await getEmailRecipient(student);
      const bccEmails = recipients.map((r) => r.recipientEmail).filter(Boolean);

      // ===== Build course rows =====
      const courseRows = dueCourses
        .map(
          (c) => `
        <tr>
          <td>${c.institute?.instituteName || "-"}</td>
          <td>${c.course?.programName || "-"}</td>
          <td>${c.instituteFeePayment.currencyCode || ""} ${
            c.instituteFeePayment.feeAmount || "N/A"
          }</td>
          <td>${new Date(c.instituteFeePayment.feeDeadline).toDateString()}</td>
        </tr>
      `
        )
        .join("");

      const subject = "⏳ Institute Fee Payment Reminder";

      const html = `
         <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            ${
              topLogoUrl
                ? `<div style="text-align:center;">
              <img src="${topLogoUrl}" style="max-height:60px;" />
            </div>`
                : ""
            }

            <h2>Institute Fee Payment Reminder</h2>
            <p>Dear <strong>${student.name}</strong>,</p>

            <p>The following institute fee payments are due soon:</p>

            <table border="1" cellpadding="8" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <th>Institute</th>
                  <th>Course</th>
                  <th>Total Fees</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                ${courseRows}
              </tbody>
            </table>

            <p>Please ensure payment before the deadline to avoid delays.</p>

            <p>Regards,<br/>EduCRM Team</p>

            ${
              bottomLogoUrl
                ? `<div style="text-align:center; margin-top:20px;">
              <img src="${bottomLogoUrl}" style="max-height:40px;" />
            </div>`
                : ""
            }
          </div>
        </div>
      `;

      await sendEmail(null, subject, html, [], bccEmails);

      const isCron = triggeredBy.source === "CRON";

      const historyUserId = isCron ? null : triggeredBy.userId;
      const historyUserName = isCron
        ? "SYSTEM (Auto Reminder)"
        : triggeredBy.userName;

      await addMailHistory({
        studentId: student._id,
        event: "Institute Fee Reminder Sent",
        value: {
          courses: dueCourses.map((c) => ({
            institute: c.institute?.instituteName,
            course: c.course?.programName,
            deadline: c.instituteFeePayment.feeDeadline,
            amount: c.instituteFeePayment.feeAmount,
          })),
          triggeredBy: historyUserName,
        },
        userId: historyUserId,
        userName: historyUserName,
      });
    }
  } catch (error) {
    console.error("❌ Institute Fee Deadline Error:", error);
  }
};

module.exports = checkInstituteFeeDeadline;
