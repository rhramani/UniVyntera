const Institute = require("../model/masters/institute.js");
const Roles = require("../model/masters/roles.js");
const User = require("../model/user.js");
const { sendEmail, getConfig } = require("../middleware/nodemailer");

async function sendAgreementEndingReminder() {
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const institutes = await Institute.find({
      agreementEndDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (institutes.length === 0) {
      console.log("No institutes expiring in 2 days");
      return;
    }

    const superAdminRole = await Roles.find({ name: "Super Admin" });
    
    if (!superAdminRole) {
      console.log("No Role found");
      return;
    }
    const superAdmins = await User.find({ role: superAdminRole[0]._id });
    if (!superAdmins.length) {
      console.log("No Super Admin users found");
      return;
    }
    const superAdminEmails = superAdmins
      .map((admin) => admin.email)
      .filter(Boolean);
    if (superAdminEmails.length === 0) {
      console.log("⚠️ Super admins found but no valid emails.");
      return;
    }

    for (const institute of institutes) {
      const config = await getConfig();
      const topLogoUrl = config.gmail?.topLogo
        ? process.env.BASE_URL + config.gmail.topLogo
        : "";
      const bottomLogoUrl = config.gmail?.bottomLogo
        ? process.env.BASE_URL + config.gmail.bottomLogo
        : "";

      const subject = `⚠️ Agreement Expiry Reminder: ${institute.instituteName}`;

      const mailHtml = `
             <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                             <div style="max-width: 700px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                               <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4;">
                                 <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
                               </div>
                               <div style="padding: 20px;">
                                <h2 style="color: #d9534f;">Agreement Expiry Reminder</h2>
          <p>Dear Super Admin,</p>
          <p>This is a reminder that the agreement for 
          <strong>${institute.instituteName}</strong> 
          will expire on <strong>${new Date(
            institute.agreementEndDate
          ).toDateString()}</strong>.</p>

          ${
            institute.agreementStartDate
              ? `<p>Agreement Start Date: <strong>${new Date(
                  institute.agreementStartDate
                ).toDateString()}</strong></p>`
              : ""
          }

          <p>Please take necessary action to renew or follow up with the institute.</p>
          <br>
          <p>Best regards,<br><strong>SmartX CRM System</strong></p>
                               </div>
                               <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4;">
                                 <p style="margin: 0; font-size: 12px; color: #555;">Powered by</p>
                                 <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
                               </div>
                             </div>
                           </div>
          `;

      await sendEmail(
        superAdminEmails.join(","), // to
        subject,
        mailHtml
      );
    }

    console.log(
      `✅ Sent reminder emails for ${institutes.length} institutes expiring soon.`
    );
  } catch (error) {
    console.log("Error is agreement reminder cron:", error);
  }
}

module.exports = sendAgreementEndingReminder;
