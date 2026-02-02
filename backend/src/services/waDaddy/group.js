const groupModel = require("../../../model/waDaddy/group");
const contactModel = require("../../../model/waDaddy/contact");

// ========== Create Group ==========
async function createGroup(name, contactIds, description, user) {
  try {
    // let admin_id = user.userId;
    let group_created_by = user.userId;
    let createdByName = user.userName;

    const group = new groupModel({
      name,
      contactIds,
      description,
      // admin_id,
      group_created_by,
      createdByName,
    });
    await group.save();
    return {
      success: true,
      message: "Group created successfully",
      status: 201,
    };
  } catch (error) {
    console.error("Create group Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function getAllGroups( page, limit, search) {
  // let admin_id;
  // if(user.type === 'Admin'){
  //     admin_id = user._id;
  // }else if(user.type === 'Admin2'){
  //     admin_id = user.main_admin_id;
  // }

  try {
    const skip = (page - 1) * limit;
    const query = {
      name: { $regex: search, $options: "i" },
      // admin_id: admin_id,
    };
    const groups = await groupModel
      .find(query)
      .populate("group_created_by", "name")
      .skip(skip)
      .limit(limit);
    const totalGroups = await groupModel.countDocuments(query);
    return {
      success: true,
      message: "Groups fetched successfully",
      status: 200,
      data: groups,
      totalCount: totalGroups,
      totalPages: Math.ceil(totalGroups / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Get all groups Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function addContactToGroup(groupId, contactIds) {
  try {
    const group = await groupModel.findById(groupId);
    if (!group) {
      return {
        success: false,
        message: "Group not found",
        status: 404,
      };
    }
    // Convert existing contactIds to string for comparison (in case they are ObjectIds)
    const existingIds = group.contactIds.map((id) => id.toString());

    // Filter out already existing IDs
    const newUniqueIds = contactIds.filter(
      (id) => !existingIds.includes(id.toString())
    );

    // Push only new unique IDs
    group.contactIds.push(...newUniqueIds);
    await group.save();

    return {
      success: true,
      message: `${newUniqueIds.length} contact(s) added to group successfully`,
      status: 200,
    };
  } catch (error) {
    console.error("Add contact to group Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function deleteContactFromGroup(groupId, contactIds) {
  try {
    const group = await groupModel.findById(groupId);
    if (!group) {
      return {
        success: false,
        message: "Group not found",
        status: 404,
      };
    }
    // Convert contactIds to string for comparison (in case they are ObjectIds)
    const contactIdsString = contactIds.map((id) => id.toString());

    // Filter out contacts to be deleted
    group.contactIds = group.contactIds.filter(
      (id) => !contactIdsString.includes(id.toString())
    );
    await group.save();
    return {
      success: true,
      message: `${contactIds.length} contact(s) deleted from group successfully`,
      status: 200,
    };
  } catch (error) {
    console.error("Delete contact from group Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function getContactsOfGroup(id, page, limit, search) {
  try {
    const group = await groupModel.findById(id);
    if (!group) {
      return {
        success: false,
        message: "Group not found",
        status: 404,
      };
    }
    const skip = (page - 1) * limit;

    const filter = {
      _id: { $in: group.contactIds },
      fname: { $regex: search, $options: "i" },
      phoneNumber: { $regex: search, $options: "i" },
    };

    const contacts = await contactModel
      .find(filter)
      .skip(skip)
      .limit(Number(limit));

    const totalContacts = await contactModel.countDocuments(filter);

    return {
      success: true,
      message: "Contacts fetched successfully",
      status: 200,
      data: contacts,
      totalCount: totalContacts,
      totalPages: Math.ceil(totalContacts / limit),
      currentPage: Number(page),
    };
  } catch (error) {
    console.error("Get contacts of group Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function deleteGroup(id) {
  try {
    const group = await groupModel.findById(id);
    if (!group) {
      return {
        success: false,
        message: "Group not found",
        status: 404,
      };
    }
    await groupModel.findByIdAndDelete(id);
    return {
      success: true,
      message: "Group deleted successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Delete group Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

async function getGroupById(id) {
  try {
    const group = await groupModel.findById(id).populate("contactIds");
    if (!group) {
      return {
        success: false,
        message: "Group not found",
        status: 404,
      };
    }
    return {
      success: true,
      message: "Group fetched successfully",
      status: 200,
      data: group,
    };
  } catch (error) {
    console.error("Get group by id Error:", error);
    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

module.exports = {
  createGroup,
  getAllGroups,
  addContactToGroup,
  deleteContactFromGroup,
  getContactsOfGroup,
  deleteGroup,
  getGroupById
};
