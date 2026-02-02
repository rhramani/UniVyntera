const Announcement = require("../../model/announcement");
const User = require("../../model/user");
const B2BAdmin = require("../../model/masters/b2b/b2bAdmin");
const Branch = require("../../model/branch/branches");

const paginate = require("../../utils/pagination");
const { sendAnnouncementEmail } = require("../../middleware/nodemailer");
const clientMail = require("../../model/clientMail");

const announcementServices = {
  sendAnnouncementMail: async (data, userId, userName, role) => {
    const { type, subject, message, fileUrl, categories, individualEmail } =
      data;
    let resolvedRole = typeof role === "string" ? role || role : role?.name;
    const types = Array.isArray(type) ? type : [type];

    let emailList = [];

    for (const t of types) {
      await Announcement.create({
        type: t,
        subject,
        message,
        fileUrl,
        sentBy: userId,
        sentByName: userName,
      });

      if (t === "Inhouse") {
        const users = await User.find({ email: { $ne: null } }, "email");
        emailList.push(...users.map((user) => user.email));
      }

      // if (t === "B2B") {
      //     const b2bAdmins = await B2BAdmin.find({ email: { $ne: null } }, "email");
      //     emailList.push(...b2bAdmins.map(admin => admin.email));
      // }

      // New start
      if (t === "B2B") {
        const b2bAdmins = await B2BAdmin.find(
          {
            email: { $ne: null },
            subscription: true, // Filter for subscription: true
          },
          "email"
        );
        emailList.push(...b2bAdmins.map((admin) => admin.email));
      }
      // New end

      if (t === "Branch") {
        const branches = await Branch.find({ email: { $ne: null } }, "email");
        emailList.push(...branches.map((branch) => branch.email));
      }

      if (t === "ClientMail") {
        let query = { email: { $ne: null } };

        if (categories && categories.length > 0) {
          query.category = { $in: categories };
        }
        const clients = await clientMail.find(query, "email");
        emailList.push(...clients.map((client) => client.email));
        // const branches = await clientMail.find({ email: { $ne: null } }, "email");
        // emailList.push(...branches.map((branch) => branch.email));
      }

      if (t === "Individual") {
        emailList.push(individualEmail);
      }
    }

    emailList = [...new Set(emailList)].filter(
      (email) => typeof email === "string" && email.includes("@")
    );

    const BATCH_SIZE = 40;
    const DELAY_MS = 3000;

    for (let i = 0; i < emailList.length; i += BATCH_SIZE) {
      const batch = emailList.slice(i, i + BATCH_SIZE);

      await sendAnnouncementEmail(
        batch,
        subject,
        message,
        userName,
        fileUrl,
        resolvedRole
      );

      await new Promise((res) => setTimeout(res, DELAY_MS));
    }

    return "Announcements created and emails sent.";
  },

  getHistory: async (page, limit, searchText = "", role) => {
    const searchOptions = {
      searchText,
      searchFields: ["type", "subject", "sentByName"],
    };

    let filter = {};

    if (role === "B2B Admin" || role === "B2B Member") {
      filter.type = "B2B";
    } else if (role === "Branch") {
      filter.type = "Branch";
    }

    const result = await paginate(
      Announcement,
      filter,
      page,
      limit,
      { createdAt: -1 },
      [],
      searchOptions
    );

    return result;
  },
  delete: async (id) => {
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      throw {
        status: false,
        message: "Mail history not found or already deleted",
      };
    }
    return "Mail history deleted successfully";
  },
};

module.exports = announcementServices;
