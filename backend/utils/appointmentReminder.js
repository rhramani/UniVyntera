const StudentApplication = require("../model/masters/studentApplication/studentApplication");
const User = require("../model/user");
const { sendEmail, getConfig } = require("../middleware/nodemailer");

const getAppointmentDates = async (student) => {
  const details = student.visaApplicationDetails || {};
  const dates = [];
  switch (student.purposeDetails?.preferredCountry[0]) {
    case "Australia":
      if (details.biometrics?.appointmentDateTime) {
        dates.push(details.biometrics.appointmentDateTime);
      }
      break;

    case "France":
      if (details.appointmentBooking?.appointmentDateTime) {
        dates.push(details.appointmentBooking.appointmentDateTime);
      }
      break;

    case "Germany":
      if (details.appointmentBooking?.appointmentDateTime) {
        dates.push(details.appointmentBooking.appointmentDateTime);
      }
      break;

    case "UK":
      if (details.biometricAppointment?.dateTime) {
        dates.push(details.biometricAppointment.dateTime);
      }
      break;

    case "USA":
      if (details.appointmentBooking?.vac?.dateTime) {
        dates.push(details.appointmentBooking.vac.dateTime);
      }
      if (details.appointmentBooking?.interview?.dateTime) {
        dates.push(details.appointmentBooking.interview.dateTime);
      }
      break;

    default:
      if (details.VFSAppointmentDateTime) {
        dates.push(details.VFSAppointmentDateTime);
      }
  }

  return dates.filter(Boolean);
};

function isTwoDaysBefore(appointmentDate) {
  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);

  return appointmentDate.toDateString() === twoDaysLater.toDateString();
}

async function getAllocatedUsers(student) {
  const userIds = [
    ...(student.userAllocationDetails || []).map((u) => u.userId),
    ...(student.visaAllocationDetails || []).map((u) => u.userId),
  ];

  const users = await User.find({ _id: { $in: userIds } }, "email name");

  return users;
}

async function sendAppointmentReminder() {
  try {
    const students = await StudentApplication.find({
      visaApplicationDetails: { $exists: true, $ne: [] },
    }).lean();

    for (const student of students) {
      const appointmentDates = await getAppointmentDates(student);
      const studentName = student.name;

      for (const date of appointmentDates) {
        if (isTwoDaysBefore(new Date(date))) {
          const users = await getAllocatedUsers(student);

          const appointmentDate = date;
          const appointmentLocation =
            student.visaApplicationDetails?.location || "N/A";

          const baseUrl =
            process.env.BASE_URL || "http://69.62.75.212:3000/api/";
          const config = await getConfig();
          const topLogoUrl = config.gmail?.topLogo
            ? process.env.BASE_URL + config.gmail.topLogo
            : "";
          const bottomLogoUrl = config.gmail?.bottomLogo
            ? process.env.BASE_URL + config.gmail.bottomLogo
            : "";

          const mailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          
          <!-- Top Logo -->
          <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
            <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
          </div>

          <p style="font-size: 16px; color: #333;">Dear Team,</p>  

          <p style="font-size: 16px; color: #555;">
            This is a friendly reminder that <strong>${studentName}</strong> has a visa appointment scheduled in <strong>2 days</strong>.
          </p>

          <p style="font-size: 16px; color: #555;">
            <strong>Date:</strong> ${new Date(
              appointmentDate
            ).toLocaleString()}<br/>
            <strong>Location:</strong> ${appointmentLocation || "N/A"}
          </p>

          <p style="font-size: 16px; color: #555;">
            Please ensure that all necessary documents are prepared and coordinate with the student if required.
          </p>

          <br />
          <p style="font-size: 16px; color: #333;">Best Regards,<br/>SmartX CRM Team</p>

          <!-- Bottom Logo -->
          <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
            <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
          </div>
        </div>
      </div>
  `;

          for (const user of users) {
            await sendEmail(
            user.email,
            "Visa Application Reminder",
              mailHtml,
            );
          }
        }
      }
    }
  } catch (error) {
    console.log("errorrr", error);
  }
}

module.exports = sendAppointmentReminder;
