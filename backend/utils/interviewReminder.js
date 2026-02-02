const StudentApplication = require("../model/masters/studentApplication/studentApplication");
const { sendEmail, getConfig } = require("../middleware/nodemailer");

async function sendInterviewReminders() {
  try {
    const now = new Date();

    // ✅ For 2 days before the interview
    const twoDaysLaterStart = new Date(now);
    twoDaysLaterStart.setDate(twoDaysLaterStart.getDate() + 2);
    twoDaysLaterStart.setHours(0, 0, 0, 0);

    const twoDaysLaterEnd = new Date(now);
    twoDaysLaterEnd.setDate(twoDaysLaterEnd.getDate() + 2);
    twoDaysLaterEnd.setHours(23, 59, 59, 999);

    const students = await StudentApplication.find({
      "interestedCourseDetails.interviewScheduling": { $exists: true },
    })
      .populate("userAllocationDetails.user", "name email")
      .lean();


    if (!students.length) return;

    for (const student of students) {
      for (const course of student.interestedCourseDetails || []) {
        const scheduling = course.interviewScheduling;
        if (!scheduling) continue;

        let interviews = [];
        if (scheduling.singleInterview?.dateTime) {
          interviews.push(scheduling.singleInterview);
        }
        if (Array.isArray(scheduling.multiRoundInterview)) {
          interviews.push(...scheduling.multiRoundInterview);
        }

        for (const interview of interviews) {
          const interviewDate = new Date(interview.dateTime);

          // ✅ Check if interview is 2 days later
          if (
            interviewDate >= twoDaysLaterStart &&
            interviewDate <= twoDaysLaterEnd
          ) {
            const config = await getConfig();
            const topLogoUrl = config.gmail?.topLogo
              ? process.env.BASE_URL + config.gmail.topLogo
              : "";
            const bottomLogoUrl = config.gmail?.bottomLogo
              ? process.env.BASE_URL + config.gmail.bottomLogo
              : "";

            for (const allocation of student.userAllocationDetails || []) {
              const user = allocation.user;
              if (!user?.email) continue;

              const mailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                  <div style="max-width: 700px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4;">
                      <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
                    </div>
                    <div style="padding: 20px;">
                      <h2>Upcoming Interview Reminder</h2>
                      <p>Hello <b>${user.name}</b>,</p>
                      <p>An interview has been scheduled for student <b>${
                        student.name || "N/A"
                      }</b> in <b>2 days</b>.</p>
                      <p><b>Date & Time:</b> ${interview.dateTime}</p>
                      <p><b>Mode:</b> ${interview.mode || "N/A"}</p>
                      <p><b>Meeting Link:</b> 
                        ${
                            interview.meetingLink
                            ? `<a href="${interview.meetingLink}" target="_blank">${interview.meetingLink}</a>`
                            : "N/A"
                        }
                    </p>

                      <p>Please prepare accordingly.</p>
                      <p>Best Regards,<br/>SmartX CRM Team</p>
                    </div>
                    <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4;">
                      <p style="margin: 0; font-size: 12px; color: #555;">Powered by</p>
                      <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
                    </div>
                  </div>
                </div>
              `;

              await sendEmail(
                user.email,
                "Interview Reminder (2 Days Left)",
                mailHtml
              );
              console.log(`✅ Mail sent to ${user.email}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = sendInterviewReminders;
