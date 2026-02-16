const mongoose = require("mongoose");
const studentApplication = require("../model/masters/studentApplication/studentApplication");
const Document = require("../model/masters/documentList/documents");
const { sendEmail, getConfig } = require("../middleware/nodemailer");
const { getEmailRecipient } = require("../helpers/getRecipientDetails");

const checkDocumentDeadline = async () => {
  try {
    console.log("⏰ Running document deadline reminder job");

    // ===== Date range: tomorrow =====
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(startOfToday);
    endOfTomorrow.setDate(startOfToday.getDate() + 1);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // ===== Fetch students =====
    const students = await studentApplication.find({
      "uploadedDocumentDetails.deadline": {
        $gte: startOfToday,
        $lte: endOfTomorrow,
      },
      "uploadedDocumentDetails.status": {
        $nin: ["", "verified", null],
      },
    });

    if (!students.length) {
      console.log("✅ No document deadlines found");
      return;
    }

    // ===== Collect document IDs (from Document table) =====
    const documentIds = new Set();

    students.forEach((student) => {
      student.uploadedDocumentDetails.forEach((doc) => {
        if (doc.documentName) {
          documentIds.add(doc.documentName.toString());
        }
      });
    });

    // ===== Fetch documents from Document table =====
    const documents = await Document.find({
      _id: {
        $in: [...documentIds].map((id) => new mongoose.Types.ObjectId(id)),
      },
    }).select("_id name");

    // ===== Build ID → name map =====
    const documentMap = {};
    documents.forEach((doc) => {
      documentMap[doc._id.toString()] = doc.name;
    });

    // ===== Mail config =====
    const config = await getConfig();
    const topLogoUrl = config.gmail?.topLogo
      ? process.env.BASE_URL + config.gmail.topLogo
      : "";
    const bottomLogoUrl = config.gmail?.bottomLogo
      ? process.env.BASE_URL + config.gmail.bottomLogo
      : "";

    // ===== Process each student =====
    for (const student of students) {
      const dueDocs = student.uploadedDocumentDetails.filter(
        (doc) =>
          doc.deadline &&
          doc.deadline >= startOfToday &&
          doc.deadline <= endOfTomorrow &&
          doc.status !== "Submitted" &&
          !doc.filePath
      );

      if (!dueDocs.length) continue;

      const recipients = await getEmailRecipient(student);
      const bccEmails = recipients.map((r) => r.recipientEmail).filter(Boolean);

      if (!bccEmails.length) continue;

      // ===== Build mail table =====
      const docHtml = dueDocs
        .map((doc) => {
          const documentName =
            documentMap[doc.documentName?.toString()] || "Document";

          return `
            <tr>
              <td>${documentName}</td>
              <td>${new Date(doc.deadline).toDateString()}</td>
              <td>${doc.status || "Pending"}</td>
            </tr>
          `;
        })
        .join("");

      const mailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 700px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

            <div style="text-align:center;padding:20px;background:#f4f4f4;">
              <img src="${topLogoUrl}" style="width:100px;" />
            </div>

            <h2>Document Deadline Reminder</h2>

            <p>
              The following document(s) for <strong>${student.name}</strong>
              are due <strong>today / tomorrow</strong>.
            </p>

            <table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;">
              <thead style="background:#eee;">
                <tr>
                  <th>Document Name</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${docHtml}</tbody>
            </table>

            <p>Best Regards,<br/>Zokep CRM Team</p>

            <div style="text-align:center;padding:20px;background:#f4f4f4;">
              <img src="${bottomLogoUrl}" style="width:150px;" />
            </div>
          </div>
        </div>
      `;

      await sendEmail(
        null,
        `⏰ Document Deadline Reminder – ${student.name}`,
        mailHtml,
        [],
        bccEmails
      );

    }
  } catch (error) {
    console.error("❌ Document Deadline Error:", error);
  }
};

module.exports = checkDocumentDeadline;
