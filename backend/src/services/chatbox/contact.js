const Contact = require("../../../model/waDaddy/contact");
const Group = require("../../../model/chatbox/group");
const XLSX = require("xlsx");
const fs = require("fs");

async function addContact(fname, lname, phoneNumber, email, groupId, user) {
  try {
    // let admin_id = user.userId;
    let contact_create_by = user.userId;
    let createdByName = user.userName;

    const existing = await Contact.findOne({
      phoneNumber: phoneNumber,
      // admin_id: admin_id,
    });

    if (existing) {
      return {
        success: false,
        message: "CONTACT ALREADY EXISTS!",
        status: 409,
      };
    }

    const contact = new Contact({
      fname,
      lname,
      phoneNumber,
      email,
      // admin_id,
      contact_create_by,
      createdByName,
    });
    await contact.save();
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return {
          success: false,
          message: "GROUP NOT FOUND",
          status: 404,
        };
      }
      group.contactIds.push(contact._id);
      await group.save();
    }

    return {
      success: true,
      message: "CONTACT ADDED SUCCESSFULLY",
      data: contact,
      status: 201,
    };
  } catch (error) {
    console.error("Add Contact Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function getAllContacts(page, limit, search, subscribed, user) {
  try {
    let admin_id = user.userId;

    // Base query for counts (no skip/limit)
    const baseQuery = {
      $or: [
        { fname: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ],
      //   admin_id,
    };

    // Only add subscribed filter for the paginated list, not for overall counts
    const listQuery = { ...baseQuery };
    if (subscribed == "true") {
      listQuery.isSubscribed = true;
    } else if (subscribed == "false") {
      listQuery.isSubscribed = false;
    }

    const [total, subscribedCounts, unsubscribedCounts, contacts] =
      await Promise.all([
        Contact.countDocuments(listQuery), // total for current filter
        Contact.countDocuments({ ...baseQuery, isSubscribed: true }), // overall subscribed
        Contact.countDocuments({ ...baseQuery, isSubscribed: false }), // overall unsubscribed
        Contact.find(listQuery)
          .populate("contact_create_by", "name")
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 }),
      ]);

    return {
      success: true,
      message: "CONTACTS FETCHED SUCCESSFULLY",
      subscribedCounts, // overall subscribed count
      unsubscribedCounts, // overall unsubscribed count
      data: contacts,
      totalCount: total, // page-filtered total
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      status: 200,
    };
  } catch (error) {
    console.error("Get Contacts Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function getAllContactsExport(search, subscribed) {
  try {
    // let admin_id = user.userId;
    // if (user.type === "Admin") {
    //   admin_id = user._id;
    // } else if (user.type === "Admin2") {
    //   admin_id = user.main_admin_id;
    // }

    const query = {
      $or: [
        { fname: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ],
    };
    // query.admin_id = admin_id;

    // Only apply subscribed filter if provided
    if (subscribed == "true") {
      query.isSubscribed = true;
    } else if (subscribed == "false") {
      query.isSubscribed = false;
    }

    const [contacts, subscribedCounts, unsubscribedCounts] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }),
      Contact.countDocuments({ ...query, isSubscribed: true }),
      Contact.countDocuments({ ...query, isSubscribed: false }),
    ]);

    return {
      success: true,
      message: "CONTACTS FETCHED SUCCESSFULLY",
      subscribedCounts,
      unsubscribedCounts,
      data: contacts,
      totalCount: contacts.length,
      status: 200,
    };
  } catch (error) {
    console.error("Get Contacts Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function chatContacts(search, subscribed) {
  try {
    // let admin_id = user.userId;

    const query = {
      $or: [
        { fname: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ],
    };
    // query.admin_id = admin_id;

    // Only apply subscribed filter if provided
    if (subscribed == "true") {
      query.isSubscribed = true;
    } else if (subscribed == "false") {
      query.isSubscribed = false;
    }
    const contacts = await Contact.find(query).sort({ lastMessageTime: -1 });

    return {
      success: true,
      message: "CONTACTS FETCHED SUCCESSFULLY",
      data: contacts,
      status: 200,
    };
  } catch (error) {
    console.error("Get Contacts Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function updateContact(id, fname, lname, phoneNumber, email, user) {
  try {
    
    const updated = await Contact.findByIdAndUpdate(
      id,
      { fname, lname, phoneNumber, email, contact_create_by: user.userId ,createdByName:user.userName },
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        message: "CONTACT NOT FOUND",
        status: 404,
      };
    }

    return {
      success: true,
      message: "CONTACT UPDATED SUCCESSFULLY",
      data: updated,
      status: 200,
    };
  } catch (error) {
    console.error("Update Contact Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}


async function getContactById(id) {
  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return {
        success: false,
        message: "CONTACT NOT FOUND",
        status: 404,
      };
    }

    return {
      success: true,
      message: "CONTACT FETCHED SUCCESSFULLY",
      data: contact,
      status: 200,
    };
  } catch (error) {
    console.error("Get Contact Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function deleteContact(id) {
  try {
    // const groups = await Group.find({ contactIds: id });
    // if (groups.length > 0) {
    //   return {
    //     success: false,
    //     message:
    //       "CONTACT CANNOT BE DELETED AS IT IS ASSIGNED TO ONE OR MORE GROUPS",
    //     status: 400,
    //   };
    // }
    const deleted = await Contact.findByIdAndDelete(id);
    if (deleted) {
      await Group.updateMany({ contactIds: id }, { $pull: { contactIds: id } });
    }
    if (!deleted) {
      return {
        success: false,
        message: "CONTACT NOT FOUND",
        status: 404,
      };
    }

    return {
      success: true,
      message: "CONTACT DELETED SUCCESSFULLY",
      data: deleted,
      status: 200,
    };
  } catch (error) {
    console.error("Delete Contact Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function multipleDelete(contactIds) {
  try {
    // Step 1: Remove contactIds from any groups they're part of
    await Group.updateMany(
      { contactIds: { $in: contactIds } },
      { $pull: { contactIds: { $in: contactIds } } }
    );

    // Step 2: Delete the contacts
    const deleted = await Contact.deleteMany({ _id: { $in: contactIds } });
    console.log("Deleted contacts:", deleted);

    if (deleted.deletedCount === 0) {
      return {
        success: false,
        message: "CONTACTS NOT FOUND",
        status: 404,
      };
    }

    return {
      success: true,
      message: "CONTACTS DELETED SUCCESSFULLY",
      data: deleted,
      status: 200,
    };
  } catch (error) {
    console.error("Multiple Delete Contact Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function importContactsFromExcel(filePath, groupId, user) {
  try {
    console.log("groupIddd" , groupId);
    //= user.userId;
    let contact_create_by = user.userId;
    let createdByName = user.userName;

    // Check file existence
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at path: " + filePath);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheet.length) {
      throw new Error("Excel file is empty.");
    }

    const contactsToInsert = [];
    const duplicates = [];
    const errors = [];

    for (const [index, row] of sheet.entries()) {
      try {
        const phoneNumber = String(
          row.phoneNumber || row["Phone Number"] || ""
        ).trim();

        if (!phoneNumber) {
          errors.push({ row: index + 2, error: "Missing phoneNumber" }); // +2 because Excel rows start at 1 and header is row 1
          continue;
        }

        const existing = await Contact.findOne({ phoneNumber });
        if (existing) {
          duplicates.push(phoneNumber);
          continue;
        }

        contactsToInsert.push({
          fname: row.firstName || row["First Name"] || "",
          lname: row.lastName || row["Last Name"] || "",
          email: row.email || row["Email"] || "",
          phoneNumber: row.phoneNumber || row["Phone Number"] || "",
          isSubscribed:
            row.isSubscribed !== undefined ? row.isSubscribed : true,
          contact_create_by,
          createdByName,
        });
      } catch (rowErr) {
        errors.push({ row: index + 2, error: rowErr.message });
      }
    }
    let insertedContacts;
    if (contactsToInsert.length > 0) {
      insertedContacts = await Contact.insertMany(contactsToInsert);
    }
    console.log("insertedContacts", insertedContacts);
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        throw new Error("Group not found");
      }
      group.contactIds.push(...insertedContacts.map((contact) => contact._id));
      await group.save();
    }
    fs.unlinkSync(filePath);

    return {
      success: true,
      inserted: contactsToInsert.length,
      duplicates,
      errors,
    };
  } catch (err) {
    // Cleanup file if exists
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return {
      success: false,
      error: err.message,
    };
  }
}

module.exports = {
  addContact,
  getAllContacts,
  getAllContactsExport,
  chatContacts,
  getContactById,
  updateContact,
  deleteContact,
  multipleDelete,
  importContactsFromExcel
};
