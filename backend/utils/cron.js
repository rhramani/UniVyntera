const cron = require("node-cron");
const leadService = require("../src/controller/lead");
const ChatMessage = require("../model/chatMessage");
const StudentApplication = require("../model/masters/studentApplication/studentApplication");
const Configuration = require("../model/configuration");
const sendEODReport  = require("../utils/eodReport");
const sendAppointmentReminder = require("./appointmentReminder");
const sendDailyFollowups = require("./followupReminder");
const sendInterviewReminders = require("./interviewReminder");
const sendAgreementEndingReminder = require("./instituteAgreementEndingReminder");
const voiceAIService = require("../src/services/voiceAI");
const leadSvc = require("../src/services/lead");
const sendTaskDueReminderEmail = require("./taskDeadlineReminder");
const checkDocumentDeadline = require("./documentDeadlineReminder");
const checkInstituteFeeDeadline = require("./instituteFeesDeadlineReminder");
const configurationServices = require("../src/services/configuration")

const Lead = require("../model/lead");

const {
  getInternalRecipients,
  getB2BRecipients,
  getBranchCreatorEmail,
  sendFollowUpReminderEmail,
} = require("../helpers/getRecipientDetails");
const { sendUnreadMessageAlertEmail } = require("../middleware/nodemailer");

// fetch facebook lead every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("Running Facebook Lead Fetch and Registration...");

  try {
    const setting = await Configuration.findOne().lean();

    if (!setting || !setting.leadFacebookToken) {
      console.log("❌ No Facebook access token found in DB");
      return;
    }
    const facebookPageAccessToken = setting.leadFacebookToken;
    const facebookPageId = setting.leadFacebookPageId || "348482798825495";

    // Process leads
    await leadService.fetchAndSubmitFacebookLeads(
      facebookPageId,
      facebookPageAccessToken
    );
  } catch (err) {
    console.error("❌ Error fetching Facebook leads:", err.message);
  }
});

// unread message alert
cron.schedule("* * * * *", async () => {
  // console.log("⏰ Checking for unread chat messages older than 5 minutes...");

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const chats = await ChatMessage.find({
    messages: {
      $elemMatch: {
        isRead: false,
        mailSent: { $ne: true },
        timestamp: { $lte: fiveMinutesAgo },
      },
    },
  });
  for (const chat of chats) {
    const student = await StudentApplication.findById(chat.student)
      .populate("userAllocationDetails.user")
      .populate("branch")
      .lean();

    if (!student) continue;

    let shouldSave = false;

    for (const message of chat.messages) {
      if (
        !message.isRead &&
        !message.mailSent &&
        new Date(message.timestamp) <= fiveMinutesAgo
      ) {
        let recipients = [];

        if (["B2B Admin", "B2B Member"].includes(message.role)) {
          recipients = await getInternalRecipients(student); // B2B → internal
        } else if (["Branch", "Branch User"].includes(message.role)) {
          recipients = await getInternalRecipients(student); // Branch → internal
        } else {
          // Internal user sent message
          if (
            student.created_by_type === "B2B Admin" ||
            student.created_by_type === "B2B Member"
          ) {
            recipients = await getB2BRecipients(student);
          } else if (
            student.created_by_type === "Branch" ||
            student.created_by_type === "Branch User"
          ) {
            recipients = await getBranchCreatorEmail(student);
          }
        }

        if (!recipients.length) continue;

        for (const { recipientEmail, recipientType } of recipients) {
          await sendUnreadMessageAlertEmail(
            recipientEmail,
            recipientType,
            student.name,
            message.message,
            message.timestamp
          );
        }

        message.mailSent = true;
        shouldSave = true;
      }
    }

    if (shouldSave) {
      await ChatMessage.findByIdAndUpdate(chat._id, {
        messages: chat.messages,
      });
    }
  }
});

// send alert before 5 days for follow ups
cron.schedule("0 9 * * *", async () => {
  const today = new Date();

  // today followup
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  // followup after 5 days
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + 5);

  const fiveDayStart = new Date(targetDate);
  fiveDayStart.setHours(0, 0, 0, 0);

  const fiveDayEnd = new Date(targetDate);
  fiveDayEnd.setHours(23, 59, 59, 999);

  const applications = await StudentApplication.find({
    $or: [
      {
        "followUps.personalDetails.nextFollowUpDate": {
          $gte: todayStart,
          $lte: todayEnd,
        },
      },
      {
        "followUps.documentDetails.nextFollowUpDate": {
          $gte: todayStart,
          $lte: todayEnd,
        },
      },
      {
        "followUps.interestedCourse.nextFollowUpDate": {
          $gte: todayStart,
          $lte: todayEnd,
        },
      },
      {
        "followUps.visaApplication.nextFollowUpDate": {
          $gte: todayStart,
          $lte: todayEnd,
        },
      },

      {
        "followUps.personalDetails.nextFollowUpDate": {
          $gte: fiveDayStart,
          $lte: fiveDayEnd,
        },
      },
      {
        "followUps.documentDetails.nextFollowUpDate": {
          $gte: fiveDayStart,
          $lte: fiveDayEnd,
        },
      },
      {
        "followUps.interestedCourse.nextFollowUpDate": {
          $gte: fiveDayStart,
          $lte: fiveDayEnd,
        },
      },
      {
        "followUps.visaApplication.nextFollowUpDate": {
          $gte: fiveDayStart,
          $lte: fiveDayEnd,
        },
      },
    ],
  })
    .populate([
      { path: "userAllocationDetails.user", select: "email name" },
      { path: "visaAllocationDetails.user", select: "email name" },
      { path: "created_by", select: "email name" },
    ])
    .lean();

  if (!applications.length) {
    return;
  }

  for (const app of applications) {
    const studentName = app?.name || "Student";
    const todayLabel = "Today's Follow-up";
    const fiveDayLabel = "Upcoming Follow-up (in 5 days)";

    const followUps = [];

    const checks = [
      {
        label: "Personal Details",
        date: app.followUps?.personalDetails?.nextFollowUpDate,
      },
      {
        label: "Document Details",
        date: app.followUps?.documentDetails?.nextFollowUpDate,
      },
      {
        label: "Interested Course",
        date: app.followUps?.interestedCourse?.nextFollowUpDate,
      },
      {
        label: "Visa Application",
        date: app.followUps?.visaApplication?.nextFollowUpDate,
      },
    ];

    let subjectType = "";

    for (const chk of checks) {
      if (chk.date) {
        if (chk.date >= todayStart && chk.date <= todayEnd) {
          followUps.push(`${chk.label} (${todayLabel})`);
          subjectType = todayLabel;
        } else if (chk.date >= fiveDayStart && chk.date <= fiveDayEnd) {
          followUps.push(`${chk.label} (${fiveDayLabel})`);
          subjectType = fiveDayLabel;
        }
      }
    }

    if (!followUps.length) continue;

    const bccEmails = [
      app.userAllocationDetails?.user?.email,
      app.visaAllocationDetails?.user?.email,
      app.created_by?.email,
    ].filter(Boolean);

    const uniqueBccEmails = [...new Set(bccEmails)];
    await sendFollowUpReminderEmail(
      uniqueBccEmails,
      studentName || "Student",
      followUps,
      app.createdByName || "System",
      subjectType // 🔑 pass subject type
    );
  }
});

// eod report email to super admin cron
cron.schedule("0 20 * * *", async () => {
  console.log("⏰ Running scheduled EOD Report job at 8 PM...");
  await sendEODReport();
});

// before 2 days visa appoitment email cron

cron.schedule("0 9 * * *" , async () => {
  console.log("⏰ Running scheduled reminder before 2 days of appointment date...");
  await sendAppointmentReminder();
})

// send Today's followup mail

cron.schedule("0 9 * * *" , async () =>{ 
  console.log("⏰ Running daily follow-up reminder cron at 9 AM...");
  await sendDailyFollowups();
})

// send Today's pending followup at 4 PM mail

cron.schedule("0 16 * * *" , async () =>{ 
  console.log("⏰ Running daily follow-up reminder cron at 9 AM...");
  await sendDailyFollowups();
})

// send task deadline email

cron.schedule("0 9 * * *", async () => {
  await sendTaskDueReminderEmail();
});


// send application interview reminder mail

cron.schedule("0 9 * * *" , async () => {
   console.log("⏰ Running scheduled reminder before 2 days of application interview date...");
  await sendInterviewReminders();
}) 


// send mail to Super admin for institute agreement ending date

cron.schedule("0 9 * * *" , async () => {
   console.log("⏰ Running scheduled reminder before 2 days of agreement reminder date...");
  await sendAgreementEndingReminder();
})

// send mail for document deadline in student application

cron.schedule("0 9 * * *" , async () => {
  console.log("Running scheduled reminder before 1 day of document deadline...")
  await checkDocumentDeadline();
})

// send mail for institute fees deadline student application

cron.schedule("40 17 * * *" , async () => {
  console.log("Running scheduled reminder before 1 day of institute fee payment deadline...")
  await checkInstituteFeeDeadline();
})

// ==============================
// Daily 9 AM: Voice AI Bulk Calling for New Leads
// ==============================
// cron.schedule("*/1 * * * *", async () => {
//   try {
//     console.log("starting cron voice AI Calling");
//         const voiceAIConfig =
//       await configurationServices.getVoiceAIConfig();

//     const { OMNIDIM_DEFAULT_PHONE_NUMBER_ID } = voiceAIConfig;

//     if (!OMNIDIM_DEFAULT_PHONE_NUMBER_ID) {
//       console.warn(
//         "⚠️ VoiceAI: OMNIDIM_DEFAULT_PHONE_NUMBER_ID missing in configuration."
//       );
//       return;
//     }

//     const defaultFromNumberId = Number(
//       OMNIDIM_DEFAULT_PHONE_NUMBER_ID
//     );

//     if (!Number.isFinite(defaultFromNumberId)) {
//       console.warn(
//         `⚠️ VoiceAI: Invalid OMNIDIM_DEFAULT_PHONE_NUMBER_ID: ${OMNIDIM_DEFAULT_PHONE_NUMBER_ID}`
//       );
//       return;
//     }
//     const normalizePhone = (raw) => {
//       if (typeof raw !== "string") return null;
//       const digits = raw.replace(/[^\d+]/g, "");
//       const stripped = digits.replace(/\D/g, "");
//       const withPlus = digits.startsWith("+") ? `+${stripped}` : `+${stripped}`;
//       if (/^\+\d{7,15}$/.test(withPlus)) return withPlus;
//       return null;
//     };

//     const leads = await leadSvc.allNewLead();

//     const contact_list = (Array.isArray(leads) ? leads : [])
//       .map((l) => {
//         const normalized = normalizePhone(l.phone);
//         if (!normalized) return null;
//         return {
//           phone_number: normalized,
//           lead_id: String(l._id),
//           name: l.name,
//           email: l.email,
//           country_interested: Array.isArray(l.country_interested)
//             ? l.country_interested
//             : [],
//           course: l.course || "",
//           intake: l.intake || "",
//           level: l.level || "",
//           source_of_reference: l.source_of_reference || "",
//         };
//       })
//       .filter(Boolean);


//     if (contact_list.length === 0) {
//       // console.log(
//       //   "📞 VoiceAI: No valid E.164 numbers found among New leads. Skipping bulk call creation."
//       // );
//       return;
//     }

//     //update the status where once calling is started
//     const selectedLeadIds = contact_list.map((c) => c.lead_id);
//     await Lead.updateMany(
//       { _id: { $in: selectedLeadIds } },
//       { $set: { call_in_progress: true } }
//     );

//     const payload = {
//       name: "New Lead Inquiry",
//       contact_list,
//       phone_number_id: defaultFromNumberId,
//       // Optional: enable auto retry behavior similar to route
//       retry_config: {
//         auto_retry: true,
//         auto_retry_schedule: "scheduled_time",
//         retry_schedule_days: 2,
//         retry_schedule_hours: 6,
//         retry_limit: 2,
//       },
//       enabled_reschedule_call: true,
//     };

//     await voiceAIService.createBulkCall(payload);
//     // console.log("📞 VoiceAI: Bulk call created.", {
//     //   total_contacts: contact_list.length,
//     //   response: result,
//     // });
//   } catch (err) {
//     console.error("❌ VoiceAI: Error creating daily bulk call:", err);
//   }
// });