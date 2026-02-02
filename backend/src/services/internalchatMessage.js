const internalchatMessage = require("../../model/internalchatMessage");
const User = require("../../model/user");
const mongoose = require("mongoose");

const internalchatMessageServices = {
  getChatUserList: async (currentUserId) => {
    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: currentUserObjectId },
        },
      },
       {
      $lookup: {
        from: "roles",               // collection name
        localField: "role",
        foreignField: "_id",
        as: "roleData",
      },
    },
    {
      $unwind: {
        path: "$roleData",
        preserveNullAndEmptyArrays: true,
      },
    },
      {
        $lookup: {
          from: "internal_chat_messages",
          let: { otherUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: [currentUserObjectId, "$participants"] },
                    { $in: ["$$otherUserId", "$participants"] },
                  ],
                },
              },
            },
          ],
          as: "chatData",
        },
      },

      // 👇 DEBUG ADD — see if lookup working
      {
        $addFields: {
          chatDataSize: { $size: "$chatData" },
        },
      },

      {
        $unwind: {
          path: "$chatData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$chatData.messages", -1] },
        },
      },

      {
        $project: {
          name: 1,
          role: "$roleData.name",        
          // roleId: "$roleData._id",
          userId: "$_id",
          conversationId: "$chatData._id",
          chatDataSize: 1, 
          lastMessage: "$lastMessage.message",
          lastTime: "$lastMessage.timestamp",
        },
      },
    ]);

    return users;
  },
  getConversation: async (conversationId) => {
    const chat = await internalchatMessage
      .findById(conversationId)
      .populate("participants", "name");

    if (!chat) throw { status: false, message: "chat not found" };

    return chat;
  },
};
module.exports = internalchatMessageServices;
