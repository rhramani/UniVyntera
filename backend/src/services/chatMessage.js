const mongoose = require("mongoose");

const ChatMessage = require("../../model/chatMessage");
const StudentApplication = require("../../model/masters/studentApplication/studentApplication");
const B2BMember = require("../../model/masters/b2b/b2bMember");
const B2BAdmin = require("../../model/masters/b2b/b2bAdmin");
const Branch = require("../../model/branch/branches");
const User = require("../../model/user");
const { associatedUser } = require("../controller/chatMessage");

const chatMessageServices = {
  getAll: async (studentId, page = 1, limit = 20, searchText = "") => {
    const limitNum = parseInt(limit);
    const thread = await ChatMessage.findOne({ student: studentId });

    if (!thread) {
      return {
        data: [],
        page: parseInt(page),
        limit: limitNum,
        totalMessages: 0,
        totalPages: 0,
      };
    }

    let messages = thread.messages;

    // 🔍 Search text filter
    if (searchText) {
      const searchRegex = new RegExp(searchText, "i");
      messages = messages.filter((msg) => searchRegex.test(msg.message));
    }

    // 📦 Sort oldest to newest
    messages = messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    const totalMessages = messages.length;
    const totalPages = Math.ceil(totalMessages / limitNum);

    // ✂ Paginate (from end)
    const start = Math.max(totalMessages - page * limitNum, 0);
    const end = totalMessages - (page - 1) * limitNum;
    const paginatedMessages = messages.slice(start, end);

    // 🧠 Collect unique senderIds
    const senderIds = [
      ...new Set(paginatedMessages.map((m) => m.senderId?.toString())),
    ];

    const [users, b2bAdmins, b2bMembers, branches] = await Promise.all([
      User.find({ _id: { $in: senderIds } }).select("name"),
      B2BAdmin.find({ _id: { $in: senderIds } }).select("companyName"),
      B2BMember.find({ _id: { $in: senderIds } }).select("firstName lastName"),
      Branch.find({ _id: { $in: senderIds } }).select("name"),
    ]);

    // 🗺️ Create ID-to-name map
    const senderMap = {};
    [...users, ...b2bAdmins, ...b2bMembers, ...branches].forEach((sender) => {
      if (sender.name) {
        senderMap[sender._id.toString()] = sender.name; // User or Branch
      } else if (sender.companyName) {
        senderMap[sender._id.toString()] = sender.companyName; // B2B Admin
      } else if (sender.firstName) {
        senderMap[sender._id.toString()] = `${sender.firstName} ${
          sender.lastName || ""
        }`.trim(); // B2B Member
      } else {
        senderMap[sender._id.toString()] = "Unknown Sender";
      }
    });

    // 🧩 Attach senderName
    const enrichedMessages = paginatedMessages.map((msg) => ({
      ...msg.toObject(),
      senderName: senderMap[msg.senderId?.toString()] || "Unknown Sender",
    }));

    return {
      data: enrichedMessages,
      page: parseInt(page),
      limit: limitNum,
      totalMessages,
      totalPages,
    };
  },
  getUnreadMessageCounts: async (currentUser) => {
    const roleName =
      typeof currentUser?.role === "string"
        ? currentUser?.role
        : currentUser?.role?.name;

    // const filter = {};
    const filter = {
          admissionProcessRequired: true,
        };

    if (roleName === "Super Admin" || roleName === "Branch Manager") {
      // filter.isSubmit = true;
      const accessConditions = [
        { isSubmit: true },
        { created_by: currentUser.userId },
        { clone_by: currentUser.userId },
      ];

      filter.$or = accessConditions;
    } else {
          if (roleName === "B2B Admin") {
            const b2bMembers = await B2BMember.find({
              b2bAdmin: currentUser.userId,
            }).select("_id");
            const memberIds = b2bMembers.map((m) => m._id.toString());
            filter.created_by = { $in: [currentUser.userId, ...memberIds] };
    
          } else if (currentUser.userType === "B2B Member") {
            filter.created_by = currentUser.userId;
    
        
          } else if (roleName === "Branch") {
            const branchMembers = await User.find({
              branchId: currentUser.userId,
            }).select("_id");
            const branchMemberIds = branchMembers.map((m) => m._id.toString());
           
            filter.created_by = { $in: [currentUser.userId, ...branchMemberIds] };
          
          } else if (currentUser.userType === "Branch User") {
            filter.created_by = currentUser.userId;
    
           
          } else if (currentUser.userType === "Student"){
            filter._id = currentUser.userId;
          }else if (currentUser.viewB2BStudentApplication) {
            const accessConditions = [];
    
            // ✅ Add Assigned B2B Access FIRST (Global Rule)
            if (currentUser.assignedB2B && currentUser.assignedB2B.length > 0) {
              const adminIds = currentUser.assignedB2B.map(
                (id) => new mongoose.Types.ObjectId(id)
              );
    
              const b2bMembers = await B2BMember.find({
                b2bAdmin: { $in: adminIds },
              }).select("_id");
    
              const memberIds = b2bMembers.map((m) => m._id.toString());
    
              accessConditions.push({
                created_by: { $in: [...adminIds, ...memberIds] },
              });
            }
    
            // Common for all 3 types
            // const allocationMatch = {
            //   userAllocationDetails: {
            //     $elemMatch: { user: currentUser.userId },
            //   },
            // };
    
            const allocationMatch = {
              $or: [
                {
                  userAllocationDetails: {
                    $elemMatch: { user: currentUser.userId },
                  },
                },
                {
                  visaAllocationDetails: {
                    $elemMatch: { user: currentUser.userId },
                  },
                },
              ],
            };
    
            filter.isSubmit = true;
    
            // ✅ Type: ALL
            if (currentUser.whichB2BStudentApplication === "all") {
              accessConditions.push(
                { created_by: currentUser.userId },
                {
                  created_by_type: {
                    $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
                  },
                },
                allocationMatch
              );
            }
    
            // ✅ Type: COUNTRYWISE
            else if (currentUser.whichB2BStudentApplication === "countrywise") {
              accessConditions.push({ created_by: currentUser.userId });
    
              const userDoc = await User.findById(currentUser.userId).select(
                "country"
              );
              if (userDoc?.country?.length) {
                accessConditions.push({
                  $and: [
                    {
                      created_by_type: {
                        $in: ["B2B Admin", "B2B Member", "Branch", "Branch User"],
                      },
                    },
                    {
                      "purposeDetails.preferredCountry": {
                        $in: userDoc.country.map((c) => new RegExp(`^${c}$`, "i")),
                      },
                    },
                  ],
                });
              }
    
              accessConditions.push(allocationMatch);
            }
    
            // ✅ Type: DEFAULT
            else {
              accessConditions.push(
                { created_by: currentUser.userId },
                allocationMatch
              );
            }

            filter.$or = accessConditions;
    
          } else {
            filter.$or = [
              { created_by: currentUser.userId },
              {
                userAllocationDetails: {
                  $elemMatch: { user: currentUser.userId },
                },
              },
              {
                visaAllocationDetails: {
                  $elemMatch: { user: currentUser.userId },
                },
              },
            ];
          }
        }

    const students = await StudentApplication.find(filter).select("_id name");

    if (!students.length) return [];

    const studentIds = students.map((s) => s._id);

    const unreadCounts = await ChatMessage.aggregate([
      { $match: { student: { $in: studentIds } } },
      {
        $project: {
          student: 1,
          unreadCount: {
            $size: {
              $filter: {
                input: "$messages",
                as: "msg",
                cond: {
                  $and: [
                    // Exclude current user's own messages
                    {
                      $ne: [
                        { $toString: "$$msg.senderId" },
                        currentUser.userId.toString(),
                      ],
                    },
                    {
                      $or: [
                        // ✅ Old data (isRead = false)
                        // { $eq: ["$$msg.isRead", false] },

                        // ✅ New data (current user not in readBy)
                        {
                          $not: {
                            $in: [
                              new mongoose.Types.ObjectId(currentUser.userId),
                              { $ifNull: ["$$msg.readBy", []] },
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    const unreadMap = {};
    unreadCounts.forEach((item) => {
      unreadMap[item.student.toString()] = item.unreadCount;
    });

    const result = students
      .map((student) => ({
        studentId: student._id,
        name: student.name,
        unreadMessageCount: unreadMap[student._id.toString()] || 0,
      }))
      .filter((s) => s.unreadMessageCount > 0);

    const totalUnreadMessages = result.reduce(
      (acc, student) => acc + student.unreadMessageCount,
      0
    );

    // 🛑 Final response (same as before)
    return {
      totalUnreadMessages,
      unreadByStudent: result,
      unreadStudentCount: result.length,
    };
  },
  associatedUser: async (userId) => {
    const threads = await ChatMessage.find({
      "messages.senderId": userId,
    }).distinct("student");
    return threads;
  },
};

module.exports = chatMessageServices;
