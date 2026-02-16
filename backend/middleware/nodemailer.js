const Role = require("../model/masters/roles");
const User = require("../model/user");
const B2BAdmin = require("../model/masters/b2b/b2bAdmin");
const B2BMember = require("../model/masters/b2b/b2bMember");
const Branch = require("../model/branch/branches");
const coachingFaculty = require("../model/masters/coachingDetails/coachingFaculty");

const nodemailer = require("nodemailer");
const Configuration = require("../model/configuration");

const baseUrl = process.env.BASE_URL || "http://localhost:3000/api/";

// Get latest config from DB
const getConfig = async () => {
  const config = await Configuration.findOne().sort({ createdAt: -1 });
  if (!config || !config.nodemailer?.email || !config.nodemailer?.password) {
    throw new Error("Email configuration not found in DB");
  }
  return config;
};

// Build transporter dynamically
const getTransporter = async () => {
  const config = await getConfig();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.nodemailer.email,
      pass: config.nodemailer.password,
    },
  });
};

// Generic mail sender
const sendEmail = async (to, subject, html, attachments = [], bcc = null) => {

  const config = await getConfig();
  const transporter = await getTransporter();

  const hasBcc = Array.isArray(bcc) && bcc.length > 0;

  const mailOptions = {
    from: config.nodemailer.email,
    to: hasBcc ? "zokepcrm@gmail.com" : to,
    subject,
    html,
  };

  if (attachments.length > 0) mailOptions.attachments = attachments;
  if (hasBcc) mailOptions.bcc = bcc.join(",");

  await transporter.sendMail(mailOptions);
};

//OTP send Email
const sendOTPEmail = async (email, otp) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = "Your OTP for Login";
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
         <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #333;">Here’s your OTP to Login in your Zokep CRM</h2>
          <p style="font-size: 16px; color: #666;">Enter the 6-digit code to verify your identity and access to your account.</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; margin: 20px auto; display: inline-block; font-size: 24px; font-weight: bold; color: #333;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #999;">Thanks for helping us to keep your account secure.</p>
        </div>

         <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>

      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

//Lead Assign Email
const sendLeadAssignEmail = async (
  email,
  name,
  leadName,
  assignedByName,
  resolvedRole
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `New Student Lead Assigned: ${leadName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
         <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>

        <p style="font-size: 16px; color: #333;">Dear ${name},</p>  
        <p style="font-size: 16px; color: #555;">
          A new student lead, <strong>${leadName}</strong>, has been assigned to you by <strong>${assignedByName}</strong>.
        </p>
        <p style="font-size: 16px; color: #555;">
          Please log in to your Zokep CRM dashboard and reach out to the student at your earliest convenience.
        </p>
        <br />
        <p style="font-size: 16px; color: #333;">Best Regards,<br/>${assignedByName}<br/>${resolvedRole}</p>

          <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>

      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// b2b admin welcome Email
const sendB2BWelcomeEmail = async (
  email,
  name,
  tempPassword,
  companyName = "Kurm Infotech"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `Welcome to Zokep CRM – You're Officially Onboard!`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
         <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>

        <p style="font-size: 16px; color: #333;">Dear ${name},</p>  
        <p style="font-size: 16px; color: #555;">
          Welcome to <strong>Zokep</strong> CRM!<br/>
          We’re excited to have you on board. You now have access to our CRM platform where you can manage your leads, track customer interactions, and streamline your workflow efficiently.
        </p>
        <h3 style="color: #333;">Here are your login credentials:</h3>
        <ul style="font-size: 16px; color: #555;">
          <li><strong>CRM URL:</strong> <a href="https://zokepconsultant.com/">https://zokepconsultant.com</a></li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Temporary Password:</strong> ${tempPassword}</li>
        </ul>
        <p style="font-size: 14px; color: #999;">🔒 For security reasons, we recommend changing your password after your first login.</p>
        <p style="font-size: 16px; color: #555;">
          If you have any questions or need support, feel free to reach out to our team at <a href="mailto:zokepcrm@gmail.com">zokepcrm@gmail.com</a>.
        </p>
        <p style="font-size: 16px; color: #333;">
          We’re thrilled to have you with us and look forward to your success!
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Warm Regards</p>

          <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>


    </div>
  `;

  await sendEmail(email, subject, html);
};

// New Student Application Email
// const sendNewStudentApplicationEmail = async (
//   email,
//   recipientName,
//   studentName,
//   b2bPartnerName,
//   senderName,
//   companyName = "Kurm Infotech",
//   role
// ) => {
//   const subject = `New Student Application Submitted by ${b2bPartnerName}`;
//   const html = `
//     <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
//       <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
//         <!-- Top Logo -->
//         <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
//           <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
//         </div>
//         <p style="font-size: 16px; color: #333;">Dear ${recipientName},</p>
//         <p style="font-size: 16px; color: #555;">
//           A new student application has been submitted by <strong>${b2bPartnerName}</strong>.
//         </p>
//         <p style="font-size: 16px; color: #555;">
//           <strong>Student Name:</strong> ${studentName}
//         </p>
//         <p style="font-size: 16px; color: #555;">
//           Please review the application at your earliest convenience.
//         </p>
//         <p style="font-size: 16px; color: #555;">
//           Let us know if you need any further details.
//         </p>
//         <br/>
//         <p style="font-size: 16px; color: #333;">
//           Best Regards,<br/>
//           ${senderName}<br/>
//           ${role ? `${role}<br/>` : ""}
//        </p>
//           <!-- Bottom Logo -->
//         <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
//           <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
//           <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
//         </div>
//       </div>
//     </div>
//   `;

//   await sendEmail(email, subject, html);
// };

const sendNewStudentApplicationEmail = async (
  bccEmails,
  studentName,
  b2bPartnerName,
  senderName,
  companyName = "Kurm Infotech",
  role
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `New Student Application Submitted by ${b2bPartnerName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        <p style="font-size: 16px; color: #333;">Dear Team,</p>
        <p style="font-size: 16px; color: #555;">
          A new student application has been submitted by <strong>${b2bPartnerName}</strong>.
        </p>
        <p style="font-size: 16px; color: #555;">
          <strong>Student Name:</strong> ${studentName}
        </p>
        <p style="font-size: 16px; color: #555;">
          Please review the application at your earliest convenience.
        </p>
        <p style="font-size: 16px; color: #555;">
          Let us know if you need any further details.
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">
          Best Regards,<br/>
          ${senderName}<br/>
          ${role ? `${role}<br/>` : ""}
        </p>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(null, subject, html, [], bccEmails);
};

// send document uploaded mail

const sendDocumentUploadEmail = async (
  bccEmails,
  studentName,
  b2bPartnerName,
  senderName,
  role,
  documentName,
  documentUrl = null
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `New Document Uploaded for ${studentName} by ${b2bPartnerName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        
        <p style="font-size: 16px; color: #333;">Dear Team,</p>
        <p style="font-size: 16px; color: #555;">
          A new document has been uploaded for <strong>${studentName}</strong> by <strong>${b2bPartnerName}</strong>.
        </p>
        
        <p style="font-size: 16px; color: #555;">
          <strong>Document Name:</strong> ${documentName}
        </p>

        ${
          documentUrl
            ? `<p style="font-size: 16px; color: #555;">
                 <strong>View Document:</strong> 
                 <a href="${documentUrl}" target="_blank" style="color: #1a73e8;">Click here</a>
               </p>`
            : ""
        }

        <br/>
        <p style="font-size: 16px; color: #333;">
          Best Regards,<br/>
          ${senderName}<br/>
          ${role ? `${role}<br/>` : ""}
        </p>
        
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(null, subject, html, [], bccEmails);
};

// send interested course update mail

const sendInterestedCourseUpdateEmail = async (
  bccEmails,
  studentName,
  b2bPartnerName,
  senderName,
  role,
  documentName,
  documentUrl = null
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `Course details updated for ${studentName} by ${b2bPartnerName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        
        <p style="font-size: 16px; color: #333;">Dear Team,</p>
       <p style="font-size: 16px; color: #555;">
        Course details for <strong>${studentName}</strong> have been updated by <strong>${b2bPartnerName}</strong>.
      </p>
      <br/>
      <p style="font-size: 16px; color: #555;">
        <strong>Updated Fields:</strong> ${documentName}
      </p>

        <br/>
        <p style="font-size: 16px; color: #333;">
          Best Regards,<br/>
          ${senderName}<br/>
          ${role ? `${role}<br/>` : ""}
        </p>
        
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(null, subject, html, [], bccEmails);
};

// branch welcome mail
const sendBranchWelcomeEmail = async (
  email,
  name,
  tempPassword,
  companyName = "Kurm Infotech"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `Welcome to Zokep CRM – You're Officially Onboard!`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
         <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        <p style="font-size: 16px; color: #333;">Dear ${name},</p>  
        <p style="font-size: 16px; color: #555;">
          Welcome to <strong>Zokep</strong> CRM!<br/>
          We’re excited to have you on board. You now have access to our CRM platform where you can manage your leads, track customer interactions, and streamline your workflow efficiently.
        </p>
        <h3 style="color: #333;">Here are your login credentials:</h3>
        <ul style="font-size: 16px; color: #555;">
          <li><strong>CRM URL:</strong> <a href="https://zokepconsultant.com/">https://zokepconsultant.com/</a></li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Temporary Password:</strong> ${tempPassword}</li>
        </ul>
        <p style="font-size: 14px; color: #999;">🔒 For security reasons, we recommend changing your password after your first login.</p>
        <p style="font-size: 16px; color: #555;">
          If you have any questions or need support, feel free to reach out to our team at <a href="mailto:zokepcrm@gmail.com">zokepcrm@gmail.com</a>.
        </p>
        <p style="font-size: 16px; color: #333;">
          We’re thrilled to have you with us and look forward to your success!
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Warm Regards</p>
          <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// New B2B Partner Email
const sendNewB2BPartnerEmail = async (
  email,
  B2BName,
  companyName = "Kurm Infotech"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `New B2B Partner Application Received – Action Required`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
         <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        <p style="font-size: 16px; color: #333;">Dear Team,</p>
        <p style="font-size: 16px; color: #555;">
          A new <strong>B2B Partner</strong> application has been submitted and is now available for review in the admin panel.
        </p>
        <h3 style="color: #333;">Details:</h3>
        <ul style="font-size: 16px; color: #555;">
          <li><strong>B2B Partner Name:</strong>${B2BName}</li>
          <li><strong>Lead Type:</strong> B2B Partner</li>
          <li><strong>Source:</strong> Website Form Submission</li>
          <li><strong>Action:</strong> Please log in to the B2B admin page to view and process the lead.</li>
        </ul>
        <p style="font-size: 16px; color: #555;">
          👉 <a href="https://zokepconsultant.com/">Access B2B Admin Panel</a>
        </p>
        <p style="font-size: 16px; color: #333;">
          Let’s ensure timely follow-up and onboarding for a smooth partnership experience.
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Best Regards</p>
          <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// Pending Doc Email
const sendPendingDocsEmail = async (
  email,
  missingDocuments,
  studentName,
  studentId,
  recipientType = "Student"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const introLine =
    recipientType === "Student"
      ? `Dear <b>${studentName}</b> (StudentID: <b>${studentId}</b>), please submit the following documents at your earliest convenience to complete your application process.`
      : `The following documents for student <strong>${studentName}</strong> (StudentID: <b>${studentId}</b>) are still pending. Please follow up accordingly.`;

  const subject = `Pending Documents for Your Application`;
  const docsListHtml = missingDocuments.length
    ? missingDocuments
        .map((doc) => {
          const docTypeText = doc.documentTypeName
            ? ` (${doc.documentTypeName})`
            : "";
          return `
          <li style="margin-bottom: 10px; font-size: 16px; color: #444;">
            <strong>${doc.documentName}</strong>${docTypeText}
          </li>
        `;
        })
        .join("")
    : `<li style="font-size: 16px; color: #444;">No pending documents found.</li>`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
       <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
      <div style="padding: 20px;">
        <h2 style="color: #333; text-align: center;">Documents Pending for Your Application</h2>
         <p style="font-size: 16px; color: #666; text-align: center;">
          ${introLine}
        </p>
        <ul style="list-style-type: disc; padding-left: 40px; margin-top: 20px;">
          ${docsListHtml}
        </ul>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          If you have any questions, feel free to contact your counselor.
        </p>
      </div>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
    </div>
  </div>
  `;

  await sendEmail(email, subject, html);
};

// send document reupload Email
const sendDocumentReuploadEmail = async (
  email,
  documentName,
  documentType,
  studentName,
  studentId,
  recipientType = "Student",
  remarks,
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const introLine =
    recipientType === "Student"
      ? `Dear <b>${studentName}</b> (StudentID: <b>${studentId}</b>), please Reupload the following document at your earliest convenience to complete your application process.`
      : `The following document for student <strong>${studentName}</strong> (StudentID: <b>${studentId}</b>) are needed to reupload. Please follow up accordingly.`;

  const subject = `Reupload Documents for Your Application`;
  const docsListHtml = `
      <li style="margin-bottom: 10px; font-size: 16px; color: #444;">
        <strong>${documentName}</strong> (${documentType})<br>
      </li>
      <li style="margin-bottom: 10px; font-size: 16px;">
        <strong style="color: #0004ffff;">Remarks:</strong> ${remarks}
      </li>`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
       <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
      <div style="padding: 20px;">
        <h2 style="color: #333; text-align: center;">Document to Reupload for Your Application</h2>
         <p style="font-size: 16px; color: #666; text-align: center;">
          ${introLine}
        </p>
        <ul style="list-style-type: disc; padding-left: 40px; margin-top: 20px;">
          ${docsListHtml}
        </ul>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          If you have any questions, feel free to contact your counselor.
        </p>
      </div>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
    </div>
  </div>
  `;

  await sendEmail(email, subject, html);
};

// send student application status update Email

const sendApplicationStatusUpdateEmail = async (
  email,
  applicationId = null,
  studentId = null,
  status = "Updated",
  updatedAt = new Date(),
  studentName = "Student",
  recipientType = "Student"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const introLine =
    recipientType === "Student"
      ? `Dear <b>${studentName}</b>,<br>We wanted to let you know that your application has been updated successfully. Below are the latest details:`
      : `The application for student <strong>${studentName}</strong> has been updated. See the latest details below:`;

  const subject = `Application Update Notification`;

  let detailItems = ``;
  if (studentId) {
    detailItems += `<li>🧑‍🎓 <strong>Student ID:</strong> ${studentId}</li>`;
  }
  if (applicationId) {
    detailItems += `<li>📄 <strong>Application ID:</strong> ${applicationId}</li>`;
  }

  detailItems += `
    <li>✅ <strong>Status:</strong> ${status}</li>
    <li>🕒 <strong>Last Updated:</strong> ${new Date(updatedAt).toLocaleString(
      "en-IN",
      { timeZone: "Asia/Kolkata" }
    )}</li>
  `;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
       <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
      <div style="padding: 20px;">
        <h2 style="color: #333; text-align: center;">Application Update Notification</h2>
        <p style="font-size: 16px; color: #666; text-align: center;">
          ${introLine}
        </p>
        <ul style="list-style-type: none; padding-left: 0; margin-top: 20px; font-size: 16px; color: #444;">
          ${detailItems}
        </ul>
        <p style="font-size: 15px; color: #666; text-align: center; margin-top: 30px;">
          You can log in to your account to view more details or take the next steps if required.
        </p>
        <p style="font-size: 14px; color: #999; text-align: center;">
          Thank you for using our services!
        </p>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 13px; color: #888; border-radius: 0 0 8px 8px;">
        Best Regards,<br>
        <strong>Kurm Infotech Team</strong><br>
        <a href="https://zokepconsultant.com" style="color: #888; text-decoration: none;">https://zokepconsultant.com</a>
      </div>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
    </div>
  </div>
  `;

  await sendEmail(email, subject, html);
};

// Send Announcement Email to (Inhouse , B2B , Branch)

const sendAnnouncementEmail = async (
  email,
  subject,
  message,
  sentByName,
  fileUrl = null,
  resolvedRole,
  companyName = "Kurm Infotech"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const cleanMessage = message.replace(/\\/g, "/").replace(/\n/g, "<br/>");
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        <h2 style="color: #333; text-align: center;">${subject}</h2>
        <p style="font-size: 16px; color: #555;">${cleanMessage}</p>
        <br/>
        <p style="font-size: 16px; color: #333;">Best Regards,<br/>${sentByName}<br/>${resolvedRole}</p>
          <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  const attachments = fileUrl
    ? [
        {
          filename: fileUrl.split("/").pop(), // get file name from URL
          path: fileUrl,
        },
      ]
    : [];
  await sendEmail(null, subject, html, attachments, email);
};

// Send Visa Status Update Email
const sendVisaStatusUpdateEmail = async (
  email,
  studentId = null,
  status = "Updated",
  updatedAt = new Date(),
  studentName = "Student",
  recipientType = "Student"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const introLine =
    recipientType === "Student"
      ? `Dear <b>${studentName}</b>,<br>We wanted to let you know that your  visa application has been updated successfully. Below are the latest details:`
      : `The visa application for student <strong>${studentName}</strong> has been updated. See the latest details below:`;

  const subject = `Visa Status Update Notification`;

  let detailItems = ``;
  if (studentId) {
    detailItems += `<li>🧑‍🎓 <strong>Student ID:</strong> ${studentId}</li>`;
  }

  detailItems += `
    <li>✅ <strong>Status:</strong> ${status}</li>
    <li>🕒 <strong>Last Updated:</strong> ${new Date(updatedAt).toLocaleString(
      "en-IN",
      { timeZone: "Asia/Kolkata" }
    )}</li>
  `;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
       <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
      <div style="padding: 20px;">
        <h2 style="color: #333; text-align: center;">Application Update Notification</h2>
        <p style="font-size: 16px; color: #666; text-align: center;">
          ${introLine}
        </p>
        <ul style="list-style-type: none; padding-left: 0; margin-top: 20px; font-size: 16px; color: #444;">
          ${detailItems}
        </ul>
        <p style="font-size: 15px; color: #666; text-align: center; margin-top: 30px;">
          You can log in to your account to view more details or take the next steps if required.
        </p>
        <p style="font-size: 14px; color: #999; text-align: center;">
          Thank you for using our services!
        </p>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 13px; color: #888; border-radius: 0 0 8px 8px;">
        Best Regards,<br>
        <strong>Kurm Infotech Team</strong><br>
        <a href="https://zokepconsultant.com" style="color: #888; text-decoration: none;">https://zokepconsultant.com</a>
      </div>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
    </div>
  </div>
  `;

  await sendEmail(email, subject, html);
};

// Send Unread Message Alert Email
const sendUnreadMessageAlertEmail = async (
  email,
  recipientType,
  studentName,
  messageText,
  messageTime,
  companyName = "Kurm Infotech"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `Unread Message Alert for ${studentName} – ${recipientType}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        <p style="font-size: 16px; color: #333;">Dear ${recipientType},</p>
        <p style="font-size: 16px; color: #555;">
          There is an <strong>unread chat message</strong> for student <strong>${studentName}</strong> that has not been read for over 5 minutes.
        </p>
        <h3 style="color: #333;">Message Preview:</h3>
        <ul style="font-size: 16px; color: #555;">
          <li><strong>Time:</strong> ${new Date(
            messageTime
          ).toLocaleString()}</li>
          <li><strong>Message:</strong> ${messageText || "(media message)"}</li>
        </ul>
        <p style="font-size: 16px; color: #555;">
          👉 <a href="https://zokepconsultant.com/">Open Chat in Admin Panel</a>
        </p>
        <p style="font-size: 16px; color: #333;">
          Please log in and take action to avoid delays in communication.
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Best Regards</p>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// Send B2B Commission Query Email
const sendB2BCommissionQueryEmail = async (
  email,
  studentName,
  studentId,
  b2bName,
  remarks,
  companyName = "Kurm Infotech"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `Commission Query Raised – ${studentName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>

        <p style="font-size: 16px; color: #333;">Dear Accounts/Admin Team,</p>

        <p style="font-size: 16px; color: #555;">
          A <strong>commission query</strong> has been submitted by <strong>${b2bName}</strong> for student <strong>${studentName}</strong> (ID: ${studentId}).
        </p>

        <h3 style="color: #333;">Remarks:</h3>
        <p style="font-size: 16px; color: #555; background: #f1f1f1; padding: 10px; border-radius: 4px;">
          ${remarks || "No remarks provided."}
        </p>

        <p style="font-size: 16px; color: #555;">
          👉 <a href="https://zokepconsultant.com/">View Student in Admin Panel</a>
        </p>

        <br/>
        <p style="font-size: 16px; color: #333;">Best Regards</p>

        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// send student application status update Email
const sendNewEligibleStudentEmail = async (
  email,
  studentId = null,
  status = "Visa Approved",
  studentName = "Student"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const introLine = `
    The visa application for student <strong>${studentName}</strong> has been <span style="color: green;"><strong>Approved</strong></span>.<br>
    This student is now <strong>eligible</strong>. Please review the updated status below.
  `;

  const subject = `New Eligible Student: Visa Approved`;

  let detailItems = ``;
  if (studentId) {
    detailItems += `<li>🧑‍🎓 <strong>Student ID:</strong> ${studentId}</li>`;
  }

  detailItems += `
    <li>✅ <strong>Status:</strong> ${status}</li>
     `;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <!-- Top Logo -->
      <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
        <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
      </div>

      <div style="padding: 20px;">
        <h2 style="color: #333; text-align: center;">🎉 New Eligible Student Notification</h2>
        <p style="font-size: 16px; color: #444; text-align: center;">
          ${introLine}
        </p>

        <ul style="list-style-type: none; padding-left: 0; margin-top: 20px; font-size: 16px; color: #444;">
          ${detailItems}
        </ul>

        <p style="font-size: 15px; color: #666; text-align: center; margin-top: 30px;">
          You can log in to your account to view full student details and take the next steps if required.
        </p>
         <p style="font-size: 16px; color: #555;">
          👉 <a href="https://zokepconsultant.com/">Open Zokep CRM</a>
        </p>

        <p style="font-size: 16px; color: #333;">Best Regards</p>
      </div>


      <!-- Bottom Logo -->
      <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
        <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
      </div>
    </div>
  </div>
  `;

  await sendEmail(email, subject, html);
};

const sendUniversityCommissionStatusEmail = async (
  studentId = null,
  studentName = "Student",
  status = "Updated"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const introLine = `
    The university commission status for student <strong>${studentName}</strong> has been updated. See the latest details below:
  `;

  const subject = `University Commission Update Notification`;

  let detailItems = ``;
  if (studentId) {
    detailItems += `<li>🧑‍🎓 <strong>Student ID:</strong> ${studentId}</li>`;
  }

  detailItems += `
    <li>✅ <strong>New Accountant Status:</strong> ${status}</li>
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333; text-align: center;">University Commission Status Update</h2>
          <p style="font-size: 16px; color: #666; text-align: center;">${introLine}</p>
          <ul style="list-style-type: none; padding-left: 0; margin-top: 20px; font-size: 16px; color: #444;">
            ${detailItems}
          </ul>
          <p style="font-size: 15px; color: #666; text-align: center; margin-top: 30px;">
            Please log in to review and take appropriate action if needed.
          </p>
           <p style="font-size: 16px; color: #555;">
          👉 <a href="https://zokepconsultant.com/">Open Zokep CRM</a>
        </p>
          <p style="font-size: 16px; color: #333;">Best Regards</p>
        </div>
 
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  const roles = await Role.find({
    name: { $in: ["Super Admin", "Accountant"] },
  }).select("_id");
  const roleIds = roles.map((role) => role._id);

  // Get all users with those roles
  const users = await User.find({
    role: { $in: roleIds },
    email: { $ne: null },
  }).select("email");

  // Send email to each user
  for (const user of users) {
    await sendEmail(user.email, subject, html);
  }
};

const sendB2BCommissionStatusEmail = async (
  student,
  accountantStatus = "Updated"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const studentId = student.studentId;
  const studentName = student.name || "Student";

  const introLine = `
    The university commission accountant status for student <strong>${studentName}</strong> has been updated. Please review the new status below:
  `;

  const subject = `University Commission Accountant Status Update`;

  let detailItems = ``;
  if (studentId) {
    detailItems += `<li>🧑‍🎓 <strong>Student ID:</strong> ${studentId}</li>`;
  }

  detailItems += `
    <li>📌 <strong>New Accountant Status:</strong> ${accountantStatus}</li>
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333; text-align: center;">Commission Status Notification</h2>
          <p style="font-size: 16px; color: #666; text-align: center;">${introLine}</p>
          <ul style="list-style-type: none; padding-left: 0; margin-top: 20px; font-size: 16px; color: #444;">
            ${detailItems}
          </ul>
          <p style="font-size: 15px; color: #666; text-align: center; margin-top: 30px;">
            Kindly log in to your Zokep portal to view full details.
          </p>
          <p style="font-size: 16px; text-align: center;">
            👉 <a href="https://zokepconsultant.com/" target="_blank">Open Zokep CRM</a>
          </p>
          <p style="font-size: 16px; color: #333; text-align: center;">Best Regards</p>
        </div>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  // Find the B2B user to notify
  let b2bEmail = null;

  if (student.created_by_type === "B2B Admin" && student.createdByName) {
    const b2b = await B2BAdmin.findOne({
      companyName: student.createdByName,
    }).select("email");
    b2bEmail = b2b?.email;
  } else if (student.created_by_type === "B2B Member" && student.b2bCompany) {
    const b2bMember = await B2BMember.findOne({
      companyName: student.b2bCompany,
    }).select("email");
    b2bEmail = b2bMember?.email;
  } else if (student.created_by_type === "Branch" && student.createdByName) {
    const branch = await Branch.findOne({ name: student.createdByName }).select(
      "email"
    );
    b2bEmail = branch?.email;
  } else if (student.created_by_type === "Branch User" && student.branch) {
    const branch = await Branch.findOne({ name: student.branch }).select(
      "email"
    );
    b2bEmail = branch?.email;
  }

  if (b2bEmail) {
    await sendEmail(b2bEmail, subject, html);
  }
};

// Send mail to coaching faculty
const sendStudentAssignToFacultyEmail = async (
  facultyId,
  studentName,
  assignedByName
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const facultyDoc = await coachingFaculty.findById(facultyId).lean();
  if (!facultyDoc) return;

  const { name: facultyName, email: facultyEmail } = facultyDoc;

  const subject = `New Student Assigned: ${studentName}`;
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      
      <!-- Top Logo -->
      <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
        <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
      </div>

      <p style="font-size: 16px; color: #333;">Dear ${facultyName},</p>  
      <br>
      <p style="font-size: 16px; color: #555;">
        A new student, <strong>${studentName}</strong>, has been assigned to you by <strong>${assignedByName}</strong>.
      </p>
      <br>
      <p style="font-size: 16px; color: #555;">
        Please log in to your Zokep CRM dashboard and review the student details to begin coaching guidance.
      </p>
      <br />
      <p style="font-size: 16px; color: #333;">Best Regards</p>

      <!-- Bottom Logo -->
      <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
        <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
      </div>

    </div>
  </div>
`;

  await sendEmail(facultyEmail, subject, html);
};

// send follow ups mail

const sendFollowUpReminderEmail = async (
  bccEmails,
  studentName,
  followUpType,
  followUpDate,
  senderName,
  companyName = "Kurm Infotech",
  role,
  isToday = false // NEW flag to differentiate Today reminder vs Upcoming
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = isToday
    ? `Today's Follow-Up Reminder: ${studentName} - ${followUpType}`
    : `Upcoming Follow-Up Reminder: ${studentName} - ${followUpType}`;

  const formattedDate = new Date(followUpDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>

        <p style="font-size: 16px; color: #333;">Dear Team,</p>
        <p style="font-size: 16px; color: #555;">
          ${
            isToday
              ? `This is a <strong>same-day reminder</strong> that a follow-up is scheduled <strong>today</strong> for <strong>${studentName}</strong>.`
              : `This is a reminder that a follow-up is scheduled in <strong>5 days</strong> for <strong>${studentName}</strong>.`
          }
        </p>
        
        <p style="font-size: 16px; color: #555;">
          <strong>Follow-Up Type:</strong> ${followUpType} <br/>
          <strong>Follow-Up Date:</strong> ${formattedDate}
        </p>
        
        <p style="font-size: 16px; color: #555;">
          Please take the necessary actions ${
            isToday ? "today" : "before the scheduled date"
          }.
        </p>

        <br/>
        <p style="font-size: 16px; color: #333;">
          Best Regards,<br/>
          ${senderName}<br/>
          ${role ? `${role}<br/>` : ""}
          ${companyName}
        </p>

        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(null, subject, html, [], bccEmails);
};

// send student welcome email

const sendStudentWelcomeEmail = async (email, name) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = "Welcome to Zokep CRM 🎉";

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
       <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>  
      
      <p style="font-size: 16px; color: #333;">Dear ${name},</p>
      <br/>
        <p style="font-size: 16px; color: #555;">
          Welcome to <strong>Zokep CRM</strong> 🎉<br/>
          Your study abroad application process has officially begun.
        </p>
        <br/>
        <p style="font-size: 16px; color: #555;">
          From course selection to visa documentation, Zokep will guide you every step of the way. You can now log in to track progress, upload documents, and stay updated on every milestone.
        </p>
        <br/>
        <p style="font-size: 16px; color: #555;">
          We’re excited to support your journey to your dream university!
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Best regards,</p>
        <p style="font-size: 16px; color: #333;">Team Zokep</p>

         <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// send interview scheduled email

const sendInterviewScheduledEmail = async (
  email,
  studentName,
  courseName,
  recipientType,
  recipientId,
  interviewType,
  dateTime,
  mode,
  meetingLink,
  rounds = [] // array for multi-round
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = "Interview Scheduled – Important Details Inside";

  const introLine =
    recipientType === "Student"
      ? `Dear ${studentName} (${recipientId}),`
      : `Dear B2B Partner,<br/>Regarding your referred student ${studentName} (ID: ${recipientId}),`;

  // MULTI-ROUND TABLE HTML
  let multiRoundHtml = "";
  if (rounds.length > 0) {
    multiRoundHtml = `
      <p><strong>Interview Rounds:</strong></p>
      <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width:100%;">
        <tr style="background:#f0f0f0;">
          <th>Round</th>
          <th>Date & Time</th>
          <th>Mode</th>
          <th>Meeting Link</th>
        </tr>
        ${rounds
          .map(
            (r) => `
          <tr>
            <td>Round ${r.round || "-"}</td>
            <td>${r.dateTime || "N/A"}</td>
            <td>${r.mode || "N/A"}</td>
            <td>${
              r.meetingLink
                ? `<a href="${r.meetingLink}" target="_blank">Join</a>`
                : "N/A"
            }</td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;
  }

  // MAIN EMAIL HTML
  const html = `
    <div style="font-family: Arial; background:#f9f9f9; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:8px;">
        
        <!-- Top Logo -->
        <div style="text-align:center; padding:20px 0; background:#f4f4f4;">
          <img src="${topLogoUrl}" style="width:100px;" />
        </div>

        <p>${introLine}</p>

        <p>Your interview for <strong>${courseName}</strong> has been scheduled.</p>

        <p><strong>Interview Type:</strong> ${interviewType}</p>

        ${
          rounds.length === 0
            ? `
        <!-- Single Interview Format -->
        <p>
          <strong>Date & Time:</strong> ${dateTime}<br/>
          <strong>Mode:</strong> ${mode}<br/>
          ${
            meetingLink
              ? `<strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a>`
              : ""
          }
        </p>
        `
            : multiRoundHtml
        }

        <p>Best wishes,<br/>Team Zokep</p>

        <!-- Bottom Logo -->
        <div style="text-align:center; padding:20px 0; background:#f4f4f4;">
          <p style="font-size:12px;">Powered by</p>
          <img src="${bottomLogoUrl}" style="width:150px;" />
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// send course selection mail

const sendCourseSelectionEmail = async (
  email,
  recipientName,
  universityName,
  courseName,
  recipientType = "Student",
  recipientId
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = "Congratulations – Your Course Selection Is Underway!";

  let introLine =
    "Fantastic news! Your course selection process has officially started.<br/>" +
    `You are now on your way to join <strong>${universityName}</strong> for the <strong>${courseName}</strong> program.`;

  if (recipientType === "B2B") {
    introLine =
      "Great news! Your referred student's course selection process has officially started.<br/>" +
      `They are now on their way to join <strong>${universityName}</strong> for the <strong>${courseName}</strong> program.`;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">


        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>  

        <p style="font-size: 16px; color: #333;">Dear ${recipientName} ${recipientId},</p>
        <br/>
        <p style="font-size: 16px; color: #555;">
          ${introLine}
        </p>
        <br/>
        <p style="font-size: 16px; color: #555;">
          Track every step—from document submission to visa updates—right inside Zokep CRM.
        </p>
        <br/>
        <p style="font-size: 16px; color: #555;">
          We’re excited to see progress towards the dream university!
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Best wishes,</p>
        <p style="font-size: 16px; color: #333;">Team Zokep</p>

          <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// send visa approve mail

const sendVisaApprovalEmail = async (
  email,
  studentName,
  countryName,
  recipientType,
  recipientId
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `Congratulations – Your ${countryName} Visa Is Approved & Received!`;

  const introLine =
    recipientType === "Student"
      ? `Dear ${studentName} (${recipientId}),`
      : `Dear B2B Partner, <br/> regarding your referred student ${studentName} (Student ID: ${recipientId}),`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">


        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>  

        <p style="font-size: 16px; color: #333;">${introLine}</p>
        <br/>
        <p style="font-size: 16px; color: #555;">
          Wonderful news! Your <strong>${countryName}</strong> visa has been successfully approved and received.<br/>
          You’re now set to begin the next chapter of your study-abroad journey.
        </p>
        <br/>
        <p style="font-size: 16px; color: #555;">
          Wishing you a smooth and exciting transition to life in <strong>${countryName}</strong>!
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Best wishes,</p>
        <p style="font-size: 16px; color: #333;">Team Zokep</p>

          <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// send visa refusal mail
const sendVisaRefusalEmail = async (
  email,
  studentName,
  countryName,
  recipientType,
  recipientId
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = "Visa Decision – Regret to Inform";

  const introLine =
    recipientType === "Student"
      ? `Dear ${studentName} (${recipientId}),`
      : `Dear B2B Partner, <br/> regarding your referred student ${studentName} (ID: ${recipientId}),`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        

       <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>  


        <p style="font-size: 16px; color: #333;">${introLine}</p>
        <br/>

        <p style="font-size: 16px; color: #555;">
          We regret to inform you that your <strong>${countryName}</strong> visa application has been refused.<br/>
          Our team will reach out to discuss the reasons and assist you with possible next steps.
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Sincerely,</p>
        <p style="font-size: 16px; color: #333;">Team Zokep</p>

        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// send offer letter received mail

const sendOfferLetterReceivedEmail = async (
  email,
  studentName,
  courseName,
  recipientType,
  recipientId,
  offerType,
  offerLetterLink,
  acceptUrl,
  rejectUrl
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = "Your Offer Letter Has Been Received!";

  const introLine =
    recipientType === "Student"
      ? `Dear ${studentName} (${recipientId}),`
      : `Dear Agent Partner, <br/> regarding your referred student ${studentName} (ID: ${recipientId}),`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>  

        <p style="font-size: 16px; color: #333;">${introLine}</p>
        <br/>
       <p style="font-size: 16px; color: #555;">
          Your <strong>${offerType} Offer Letter</strong> for the 
          <strong>${courseName}</strong> program has been received.<br/>
          You can now log in to Zokep CRM to view and download it, 
          and proceed with the next steps in your study-abroad journey.
        </p>
  

        ${
          offerLetterLink
            ? `<p>You can download the offer letter here:  
                <a href="${offerLetterLink}" target="_blank">${offerType} Offer Letter </a></p>`
            : "<p>No offer letter document uploaded.</p>"
        }


      <p style="text-align:center; margin-top: 30px;">
        <a href="${acceptUrl}"
          style="background:#1e90ff; padding:12px 22px; color:white; 
                  text-decoration:none; border-radius:6px; font-size:16px;">
          Accept Offer Letter
        </a>
      </p>

        <p style="text-align:center; margin-top: 30px;">
          <a href="${rejectUrl}"
            style="background:#ff4d4d; padding:12px 22px; color:white; 
                    text-decoration:none; border-radius:6px; font-size:16px;">
            Reject Offer Letter
          </a>
        </p>



        <br/>
        <p style="font-size: 16px; color: #333;">Best wishes,</p>
        <p style="font-size: 16px; color: #333;">Team Zokep</p>

        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// send mail for task assign

const sendTaskAssignEmail = async (
  email,
  assigneeName,
  taskTitle,
  priority,
  dueDate,
  assignedByName
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const subject = `New Task Assigned: ${taskTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>

        <p style="font-size: 16px; color: #333;">Hello ${assigneeName},</p>

        <p style="font-size: 16px; color: #555;">
          A new task has been assigned to you. Here are the details:
        </p>

        <div style="background: #f7f7f7; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Task Title:</strong> ${taskTitle}</p>
          <p style="margin: 5px 0;"><strong>Priority:</strong> ${priority || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Due Date:</strong> ${formattedDueDate}</p>
          <p style="margin: 5px 0;"><strong>Assigned By:</strong> ${assignedByName}</p>
        </div>

        <p style="font-size: 16px; color: #555;">
          Please review the task and update the status accordingly.
        </p>

        <br />
        <p style="font-size: 16px; color: #333;">
          Thank you,<br/> Team Zokep
        </p>

        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>

      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// send mail for task due reminder

const sendTaskDueReminderEmail = async (
  email,
  assigneeName,
  taskTitle,
  priority,
  dueDate,
  yourName
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const subject = `Reminder: Task Due Date Coming – ${taskTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>

        <p style="font-size: 16px; color: #333;">Hello ${assigneeName},</p>

        <p style="font-size: 16px; color: #555;">
          This is a gentle reminder that the following task is due tomorrow:
        </p>

        <div style="background: #f7f7f7; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Task Title:</strong> ${taskTitle}</p>
          <p style="margin: 5px 0;"><strong>Original Due Date:</strong> ${formattedDueDate}</p>
          <p style="margin: 5px 0;"><strong>Priority:</strong> ${priority || "N/A"}</p>
        </div>

        <p style="font-size: 16px; color: #555;">
          Please update the task status or let us know if any support is required.
        </p>

        <br />
        <p style="font-size: 16px; color: #333;">
          Best regards,<br/>${yourName}
        </p>

        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>

      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};





// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ################################################################### coaching application mail functions #############################################################################
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// welcome mail
const sendCoachingWelcomeEmail = async (email, name) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = "Welcome to Zokep CRM 🎉";

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
       <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>  

        <p style="font-size: 16px; color: #333;">Dear ${name},</p>
        <br/>
        <p style="font-size: 16px; color: #555;">
          Welcome to <strong>Zokep CRM</strong> 🎉<br/>
          Your coaching admission process has officially begun.
        </p>
         <br/>
        <p style="font-size: 16px; color: #555;">
          We’re excited to support you as you move closer to your dream university!
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Best regards,</p>
        <p style="font-size: 16px; color: #333;">Team Zokep</p>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

const sendOfferLetterRejectedEmail = async (
  email,
  studentName,
  courseName,
  recipientType,
  recipientId,
  offerType,
  rejectionLetterLink
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `${offerType} – Rejected`;

  const introLine =
    recipientType === "Student"
      ? `Dear ${studentName} (${recipientId}),`
      : `Dear Agent Partner, <br/> regarding your referred student ${studentName} (ID: ${recipientId}),`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

        <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>

        <p style="font-size: 16px; color: #333;">${introLine}</p>

        <p style="font-size: 16px; color: #555;">
          We would like to inform you that your <strong>${offerType}</strong> for the 
          <strong>${courseName}</strong> program
          has been <strong style="color: red;">rejected</strong>.
        </p>

   ${
     rejectionLetterLink
       ? `<p style="font-size: 16px; color: #555;">
                 You can view the rejection document here: <br/>
                 <a href="${rejectionLetterLink}" target="_blank">Download Rejection Letter</a>
               </p>`
       : `<p style="font-size: 16px; color: #555; color:red;">
                 No Rejection Letter uploaded.
               </p>`
   }

        <br/>
        <p style="font-size: 16px; color: #333;">For any clarification, feel free to contact your counselor.</p>
        <p style="font-size: 16px; color: #333;">Team Zokep</p>

        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>

      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ################################################################### visitor application mail functions ###################################################################
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// welcome mail

const sendVisitorWelcomeEmail = async (email, name, country) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const subject = `Welcome to Zokep CRM 🎉 Your ${country} Visitor Visa Application Has Started`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        
      <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>  

      
        <p style="font-size: 16px; color: #333;">Dear ${name},</p>
          <br/>
        <p style="font-size: 16px; color: #555;">
          Welcome to <strong>Zokep CRM</strong> 🎉<br/>
          Your <strong>${country}</strong> visitor visa application process has officially begun.
        </p>
          <br/>
        <p style="font-size: 16px; color: #555;">
          From document submission and appointment scheduling to visa fee tracking and status updates, Zokep will guide you every step of the way.
        </p>
          <br/>
        <p style="font-size: 16px; color: #555;">
          We’re excited to assist you as you move closer to your trip to <strong>${country}</strong>!
        </p>
        <br/>
        <p style="font-size: 16px; color: #333;">Best regards,</p>
        <p style="font-size: 16px; color: #333;">Team Zokep</p>

        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

// Pending Doc Email to visitor
const sendPendingDocsVisitorEmail = async (
  email,
  missingDocuments,
  visitorName,
  visitorId,
  recipientType = "Visitor"
) => {
  const config = await getConfig();
  const topLogoUrl = config.gmail?.topLogo
    ? baseUrl + config.gmail.topLogo
    : "";
  const bottomLogoUrl = config.gmail?.bottomLogo
    ? baseUrl + config.gmail.bottomLogo
    : "";

  const introLine =
    recipientType === "Visitor"
      ? `Dear <b>${visitorName}</b> (visitorId: <b>${visitorId}</b>), please submit the following documents at your earliest convenience to complete your application process.`
      : `The following documents for visitor <strong>${visitorName}</strong> (visitorId: <b>${visitorId}</b>) are still pending. Please follow up accordingly.`;

  const subject = `Pending Documents for Your Application`;
  const docsListHtml = missingDocuments.length
    ? missingDocuments
        .map((doc) => {
          const docTypeText = doc.documentTypeName
            ? ` (${doc.documentTypeName})`
            : "";
          return `
          <li style="margin-bottom: 10px; font-size: 16px; color: #444;">
            <strong>${doc.documentName}</strong>${docTypeText}
          </li>
        `;
        })
        .join("")
    : `<li style="font-size: 16px; color: #444;">No pending documents found.</li>`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
       <!-- Top Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 8px 8px 0 0;">
          <img src="${topLogoUrl}" alt="Logo" style="width: 100px; height: auto;">
        </div>
      <div style="padding: 20px;">
        <h2 style="color: #333; text-align: center;">Documents Pending for Your Application</h2>
         <p style="font-size: 16px; color: #666; text-align: center;">
          ${introLine}
        </p>
        <ul style="list-style-type: disc; padding-left: 40px; margin-top: 20px;">
          ${docsListHtml}
        </ul>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
          If you have any questions, feel free to contact your counselor.
        </p>
      </div>
        <!-- Bottom Logo -->
        <div style="text-align: center; padding: 20px 0; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #555;">Powered by</p>
          <img src="${bottomLogoUrl}" alt="Logo" style="width: 150px; height: auto;">
        </div>
    </div>
  </div>
  `;

  await sendEmail(email, subject, html);
};

module.exports = {
  getConfig,
  sendEmail,

  sendTaskDueReminderEmail,
  sendOfferLetterRejectedEmail,
  sendDocumentUploadEmail,
  sendInterestedCourseUpdateEmail,
  sendOTPEmail,
  sendLeadAssignEmail,
  sendTaskAssignEmail,
  sendB2BWelcomeEmail,
  sendNewStudentApplicationEmail,
  sendBranchWelcomeEmail,
  sendNewB2BPartnerEmail,
  sendPendingDocsEmail,
  sendDocumentReuploadEmail,
  sendApplicationStatusUpdateEmail,
  sendAnnouncementEmail,
  sendVisaStatusUpdateEmail,
  sendUnreadMessageAlertEmail,
  sendB2BCommissionQueryEmail,
  sendNewEligibleStudentEmail,
  sendUniversityCommissionStatusEmail,
  sendB2BCommissionStatusEmail,
  sendStudentAssignToFacultyEmail,
  sendFollowUpReminderEmail,
  sendStudentWelcomeEmail,
  sendCourseSelectionEmail,
  sendVisaApprovalEmail,
  sendVisaRefusalEmail,
  sendOfferLetterReceivedEmail,
  sendInterviewScheduledEmail,

  // coaching mail functions
  sendCoachingWelcomeEmail,

  // visitor mail functions
  sendVisitorWelcomeEmail,
  sendPendingDocsVisitorEmail,
};
