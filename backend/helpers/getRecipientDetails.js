const B2BAdmin = require("../model/masters/b2b/b2bAdmin");
const B2BMember = require("../model/masters/b2b/b2bMember");
const User = require("../model/user");
const Branch = require("../model/branch/branches");
const studentApplication = require("../model/masters/studentApplication/studentApplication"); // if needed

const getEmailRecipient = async (student) => {

  const recipients = [];

  const addRecipient = (email, type) => {
    if (email && !recipients.find((r) => r.recipientEmail === email)) {
      recipients.push({ recipientEmail: email, recipientType: type });
    }
  };

  if (student.created_by_type === "B2B Admin") {
    const admin = await B2BAdmin.findById(student.created_by).select("email").lean();
    if (admin?.email) addRecipient(admin.email, "B2B");
  }

  else if (student.created_by_type === "B2B Member") {
    const member = await B2BMember.findById(student.created_by).select("email b2bAdmin").lean();
    if (member?.email) addRecipient(member.email, "B2B");

    if (member?.b2bAdmin) {
      const admin = await B2BAdmin.findById(member.b2bAdmin).select("email").lean();
      if (admin?.email) addRecipient(admin.email, "B2B");
    }
  }

  else if (student.created_by_type === "Branch") {
    if (student.email) addRecipient(student.email, "Student");

    // 1. Add allocated users
    if (student.userAllocationDetails?.length) {
      const allocationUserIds = student.userAllocationDetails.map((d) => d.user);
      const users = await User.find({ _id: { $in: allocationUserIds } }).select("email").lean();
      users.forEach((u) => {
        if (u?.email) addRecipient(u.email, "Allocated User");
      });
    }

    // 2. Add branch user email if present
    if (student.branch) {
      const branchUser = await Branch.find({ name: student.branch}).select("email").lean();
      if (branchUser?.email) addRecipient(branchUser.email, "Branch");
    }
  }

  else if (student.created_by_type === "user") {
    // 1. Add the user who created the student
    const creator = await User.findById(student.created_by).select("email").lean();
    if (creator?.email) addRecipient(creator.email, "Creator");
    // 2. Add allocated users
    if (student.userAllocationDetails?.length) {
      const allocationUserIds = student.userAllocationDetails.map((d) => d.user);
      const users = await User.find({ _id: { $in: allocationUserIds } }).select("email").lean();
      users.forEach((u) => {
        if (u?.email) addRecipient(u.email, "Allocated User");
      });
    }


    // ✅ 3. Also include student email
    if (student.email) addRecipient(student.email, "Student");
  }

  // Fallback: Add student email if no one else was added
  if (recipients.length === 0 && student.email) {
    addRecipient(student.email, "Student");
  }

  return recipients;
};









// chat

const getInternalRecipients = async (student) => {
  const recipients = [];

  const add = (email, type) => {
    if (email && !recipients.find(r => r.recipientEmail === email)) {
      recipients.push({ recipientEmail: email, recipientType: type });
    }
  };

  if (student.userAllocationDetails?.length) {
    const ids = student.userAllocationDetails.map((d) => d.user);
    const users = await User.find({ _id: { $in: ids } }).select("email").lean();
    users.forEach((u) => add(u.email, "Allocated User"));
  }
  // if (student.branch) {
  //   const branchUser = await Branch.findById(student.branch).select("email").lean();
  //   if (branchUser?.email) add(branchUser.email, "Branch");
  // }

  if (student.created_by_type === "User") {
    const creator = await User.findById(student.created_by).select("email").lean();
    if (creator?.email) add(creator.email, "Creator");
  }

  return recipients;
};

const getB2BRecipients = async (student) => {
  const recipients = [];

  const add = (email, type) => {
    if (email && !recipients.find(r => r.recipientEmail === email)) {
      recipients.push({ recipientEmail: email, recipientType: type });
    }
  };

  if (student.created_by_type === "B2B Admin") {
    const admin = await B2BAdmin.findById(student.created_by).select("email").lean();
    if (admin?.email) add(admin.email, "B2B Admin");
  }

  if (student.created_by_type === "B2B Member") {
    const member = await B2BMember.findById(student.created_by).select("email b2bAdmin").lean();
    if (member?.email) add(member.email, "B2B Member");

    if (member?.b2bAdmin) {
      const admin = await B2BAdmin.findById(member.b2bAdmin).select("email").lean();
      if (admin?.email) add(admin.email, "B2B Admin");
    }
  }

  return recipients;
};

const getBranchCreatorEmail = async (student) => {
  const recipients = [];

  const add = (email, type) => {
    if (email && !recipients.find(r => r.recipientEmail === email)) {
      recipients.push({ recipientEmail: email, recipientType: type });
    }
  };

  // branch user (via branch field)
  if (student.branch) {
    const branchUser = await Branch.findById(student.created_by).select("email").lean();
    if (branchUser?.email) add(branchUser.email, "Branch");
  }

  return recipients;
};


module.exports = { getEmailRecipient, getInternalRecipients,getB2BRecipients , getBranchCreatorEmail};