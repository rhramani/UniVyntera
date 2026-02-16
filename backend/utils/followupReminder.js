const User = require("../model/user");

const { getFollowUpLeadsByDate } = require("../src/services/lead");
const { sendEmail, getConfig } = require("../middleware/nodemailer");

async function sendDailyFollowups() {
  try {
    const users = await User.find({ status: "Active" }).lean();

    for (const user of users) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const leads = await getFollowUpLeadsByDate(
        1,
        50,
        startOfDay,
        "",
        user._id,
        "",
        "",
        "",
        "",
        "",
        ""
      );

      if (!leads.leads.length) continue;

      const config = await getConfig();
      const topLogoUrl = config.gmail?.topLogo
        ? process.env.BASE_URL + config.gmail.topLogo
        : "";
      const bottomLogoUrl = config.gmail?.bottomLogo
        ? process.env.BASE_URL + config.gmail.bottomLogo
        : "";

      const leadsHtml = leads.leads
        .map(
          (l) => `
            <tr>
                <td>${l.name || "N/A"}</td>
                <td>${l.email || "N/A"}</td>
                <td>${l.phone || "N/A"}</td>
                <td>${l.country_interested || "N/A"}</td>
            </tr>
        `
        )
        .join();

      const mailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 700px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4;">
              <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
            </div>

            <h2 style="color: #333;">Daily Follow-up Leads</h2>
            <p style="color: #555;">Dear ${user.name}, here are your leads that need follow-up today:</p>

            <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse: collapse;">
              <thead style="background:#eee;">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country Interested</th>
                </tr>
              </thead>
              <tbody>
                ${leadsHtml}
              </tbody>
            </table>

            <p style="margin-top:20px; color:#333;">Best Regards,<br/>Zokep CRM Team</p>

            <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4;">
              <p style="margin: 0; font-size: 12px; color: #555;">Powered by</p>
              <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
            </div>
          </div>
        </div>
      `;
      await sendEmail(user.email, "Your Daily follow-up Leads", mailHtml);
    }
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = sendDailyFollowups;
