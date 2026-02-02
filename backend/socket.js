const { uploadToCloudinary } = require("./middleware/cloudinary");
const ChatMessage = require("./model/chatMessage");
const B2BAdmin = require("./model/masters/b2b/b2bAdmin");
const B2BMember = require("./model/masters/b2b/b2bMember");
const internalChatMessage = require("./model/internalchatMessage");
const Branch = require("./model/branch/branches");
const User = require("./model/user");
const StudentApplication = require("./model/masters/studentApplication/studentApplication");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
let io;
let notificationNamespace;
let wadaddyNamespace;
let internalSpace;

const initSocket = (server) => {
  io = new Server(server, {
    maxHttpBufferSize: 10 * 1024 * 1024,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const chatNameSpace = io.of("/chat-namespace");

  chatNameSpace.on("connection", (socket) => {
    const { studentId, senderId, role } = socket.handshake.auth;

    if (!studentId || !senderId || !role) {
      console.log("[SOCKET] Missing parameters. Disconnecting...");
      socket.disconnect();
      return;
    }

    socket.join(studentId);
    if (studentId === "global") {
      socket.join("global-notifications");
      // console.log(`[SOCKET] ${senderId} joined global-notifications`);
    }

    chatNameSpace.to(studentId).emit("user_status", {
      userId: senderId,
      status: "online",
    });

    // New start
    // Utility function to get sender and student names
    const getSenderName = async (id) => {
      const models = [
        { model: User, label: "User" },
        { model: B2BAdmin, label: "B2BAdmin" },
        { model: B2BMember, label: "B2BMember" },
        { model: Branch, label: "Branch" },
      ];

      for (const { model, label } of models) {
        try {
          const doc = await model.findById(id).select("name");
          if (doc?.name) return doc.name;
        } catch (err) {
          console.error(
            `[SOCKET] Error searching in ${label} model:`,
            err.message,
          );
        }
      }
      return "Unknown";
    };

    const getStudentName = async (id) => {
      try {
        const student = await StudentApplication.findById(id).select("name");
        return student?.name || "Unknown Student";
      } catch (err) {
        console.error("[SOCKET] Error fetching student name:", err.message);
        return "Unknown Student";
      }
    };
    // New end

    socket.on(
      "send_message",
      async ({
        student,
        senderId: msgSenderId,
        role: msgRole,
        message,
        mediaFiles,
      }) => {
        try {
          if (
            !message &&
            (!Array.isArray(mediaFiles) || mediaFiles.length === 0)
          ) {
            return;
          }
          const uploads = [];
          // if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
          //   for (const file of mediaFiles) {
          //     const { buffer, mimeType, fileName } = file;
          //     const sanitizePublicId = (fileName) =>
          //       fileName
          //         .replace(/\.[^/.]+$/, "") // remove file extension
          //         .replace(/[\/\\?%*:|"<>()[\]{}&]/g, "") // remove illegal/special characters
          //         .replace(/\s+/g, "_") // replace whitespace with _
          //         .toLowerCase();

          //     const cloudinaryPublicId = sanitizePublicId(fileName);

          //     const uploadResult = await uploadToCloudinary(
          //       Buffer.from(buffer, "base64"),
          //       mimeType,
          //       "chat-media",
          //       cloudinaryPublicId
          //     );

          //     uploads.push({
          //       url: uploadResult.secure_url,
          //       type: mimeType,
          //       name: fileName,
          //     });
          //   }
          // }
          if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
            for (const [index, file] of mediaFiles.entries()) {
              if (!file) continue;

              const extension = path.extname(file.fileName || "") || ".png"; // default to .png
              const fileName =
                (file.fileName || `file_${Date.now()}_${index}`) + extension;

              const uploadsDir = path.join(__dirname, "uploads/chat");
              if (!fs.existsSync(uploadsDir))
                fs.mkdirSync(uploadsDir, { recursive: true });

              // Decode base64 buffer
              const base64Data = file.buffer.replace(/^data:.*;base64,/, ""); // remove data URL prefix if present
              const bufferData = Buffer.from(base64Data, "base64");

              const savePath = path.join(uploadsDir, fileName);
              fs.writeFileSync(savePath, bufferData);

              // Relative path for DB
              const uploadIndex = savePath.indexOf("uploads");
              const relativePath =
                uploadIndex !== -1
                  ? savePath.substring(uploadIndex).replace(/\\/g, "/")
                  : savePath;

              uploads.push({
                url: relativePath,
                type: file.mimeType || "application/octet-stream",
                name: fileName,
              });
            }
          }
          const newMessage = {
            student: student || studentId,
            senderId: msgSenderId || senderId,
            role: msgRole || role,
            message,
            timestamp: new Date(),
            isRead: false,
          };
          if (message) newMessage.message = message;
          if (uploads.length > 0) newMessage.media = uploads;

          let thread = await ChatMessage.findOne({ student: studentId });

          if (!thread) {
            thread = await ChatMessage.create({
              student: studentId,
              messages: [newMessage],
            });
          } else {
            thread.messages.push(newMessage);
            await thread.save();
          }

          // Get the saved message with its _id
          const savedMessage = thread.messages[thread.messages.length - 1];
          const messageToEmit = {
            studentId: studentId,
            senderId: savedMessage.senderId,
            role: savedMessage.role,
            message: savedMessage.message,
            media: savedMessage.media,
            timestamp: savedMessage.timestamp,
            _id: savedMessage._id,
            isRead: savedMessage.isRead,
          };

          // const models = [
          //   { model: User, label: "User" },
          //   { model: B2BAdmin, label: "B2BAdmin" },
          //   { model: B2BMember, label: "B2BMember" },
          //   { model: Branch, label: "Branch" },
          // ];

          // const getSenderName = async (id) => {
          //   for (const { model, label } of models) {
          //     try {
          //       const doc = await model.findById(id).select("name");
          //       if (doc?.name) return doc.name;
          //     } catch (err) {
          //       console.error(
          //         `[SOCKET] Error searching in ${label} model:`,
          //         err.message
          //       );
          //     }
          //   }
          //   return "Unknown";
          // };

          // // Usage
          // const senderName = await getSenderName(msgSenderId || senderId);

          // New start
          // Get sender and student names for notification
          const senderName = await getSenderName(msgSenderId || senderId);
          const studentName = await getStudentName(studentId);
          // ew end

          // NEW: Emit notification to other users in the room
          const notification = {
            messageId: savedMessage._id,
            studentId: studentId,
            senderId: savedMessage.senderId,
            role: savedMessage.role,
            message: savedMessage.message
              ? savedMessage.message.substring(0, 50)
              : "New media message",
            timestamp: savedMessage.timestamp,
            isRead: false,
            senderName, // New
            studentName, // New
          };

          const roomSockets = await chatNameSpace.in(studentId).fetchSockets();
          for (const roomSocket of roomSockets) {
            if (roomSocket.handshake.query.senderId !== msgSenderId) {
              roomSocket.emit("receive_notification", notification);
            }
          }
          // END NEW

          // New start
          // Emit to global notifications room (excluding sender)
          const globalSockets = await chatNameSpace
            .in("global-notifications")
            .fetchSockets();
          for (const globalSocket of globalSockets) {
            if (globalSocket.handshake.query.senderId !== msgSenderId) {
              globalSocket.emit("receive_notification", notification);
            }
          }
          // New end
          chatNameSpace.to(studentId).emit("receive_message", messageToEmit);
        } catch (error) {
          console.error("Error saving message:", error);
          socket.emit("message_error", { error: "Failed to send message" });
        }
      },
    );

    socket.on("message_read", async ({ messageIds, userId }) => {
      if (!Array.isArray(messageIds) || messageIds.length === 0) {
        // console.log("[SOCKET] Invalid messageIds provided");
        return;
      }

      try {
        const thread = await ChatMessage.findOne({ student: studentId });
        if (!thread) {
          // console.log("[SOCKET] No thread found for student:", studentId);
          return;
        }

        // Update all matching message IDs
        const updatedMessageIds = [];
        let hasChanges = false;

        messageIds.forEach((id) => {
          try {
            const message = thread.messages.id(id);
            if (message && !message.readBy.includes(userId)) {
              message.readBy.push(userId);
              updatedMessageIds.push(id);
              hasChanges = true;
            }
          } catch (err) {
            console.log("[SOCKET] Invalid message ID:", id);
          }
        });

        if (!hasChanges) {
          // console.log("[SOCKET] No messages were updated");
          return;
        }

        await thread.save();

        // Emit to all clients in the room
        chatNameSpace.to(studentId).emit("message_read_true", {
          messageIds: updatedMessageIds,
          studentId,
          userId,
        });

        // NEW: Emit notification read confirmation
        chatNameSpace.to(studentId).emit("notification_read_true", {
          messageIds: updatedMessageIds,
          studentId,
          userId,
        });
        // END NEW

        // New start
        chatNameSpace
          .to("global-notifications")
          .emit("notification_read_true", {
            notificationIds: updatedMessageIds,
            studentId: studentId,
          });
        // New end
      } catch (err) {
        console.error("[SOCKET] Error updating read status:", err);
        socket.emit("message_read_error", {
          error: "Failed to mark messages as read",
          messageIds,
        });
      }
    });

    // NEW: Handle notification read event
    socket.on("notification_read", async ({ notificationIds }) => {
      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return;
      }

      try {
        const thread = await ChatMessage.findOne({ student: studentId });
        if (!thread) {
          console.log("[SOCKET] No thread found for student:", studentId);
          return;
        }

        const updatedNotificationIds = [];
        let hasChanges = false;

        notificationIds.forEach((id) => {
          try {
            const message = thread.messages.id(id);
            if (message && !message.isRead) {
              message.isRead = true;
              updatedNotificationIds.push(id);
              hasChanges = true;
            }
          } catch (err) {
            console.log("[SOCKET] Invalid notification ID:", id);
          }
        });

        if (hasChanges) {
          await thread.save();
          chatNameSpace.to(studentId).emit("notification_read_true", {
            notificationIds: updatedNotificationIds,
            studentId: studentId,
          });
          chatNameSpace
            .to("global-notifications")
            .emit("notification_read_true", {
              notificationIds: updatedNotificationIds,
              studentId: studentId,
            });
        }
      } catch (err) {
        console.error("[SOCKET] Error updating notification read status:", err);
        socket.emit("notification_read_error", {
          error: "Failed to mark notifications as read",
          notificationIds,
        });
      }
    });
    // END NEW

    socket.on("leaveRoom", ({ studentId: roomId, role: userRole }) => {
      socket.leave(roomId);
    });

    socket.on("disconnect", () => {
      console.log(`[SOCKET] Disconnected: ${role}-${senderId}`);
      chatNameSpace.to(studentId).emit("user_status", {
        userId: senderId,
        status: "offline",
      });
    });

    // Handle connection errors
    socket.on("error", (error) => {
      console.error("[SOCKET] Socket error:", error);
    });
  });

  notificationNamespace = io.of("/notification-namespace");

  notificationNamespace.on("connection", (socket) => {
    const { userId } = socket.handshake.query;

    // Validate userId
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      console.error("[NOTIFICATION SOCKET] Invalid or missing userId:", userId);
      socket.emit("error", { message: "Invalid userId provided" });
      socket.disconnect();
      return;
    }

    // Join personal room
    socket.join(userId);

    // Join global notifications room (optional, kept for future use)
    socket.join("global-notifications");

    // Mark user online
    notificationNamespace.to(userId).emit("user_status", {
      userId,
      status: "online",
    });

    // Handle reconnection
    socket.on("reconnect", () => {
      socket.join(userId); // Re-join personal room
      socket.join("global-notifications"); // Re-join global room
      notificationNamespace.to(userId).emit("user_status", {
        userId,
        status: "online",
      });
      // Signal client to fetch notifications
      socket.emit("fetch_notifications");
    });

    socket.on("disconnect", () => {
      notificationNamespace.to(userId).emit("user_status", {
        userId,
        status: "offline",
      });
    });

    socket.on("error", (err) => {
      socket.emit("error", {
        message: "Socket error occurred",
        details: err.message,
      });
    });
  });
  // Wadaddy Namespace (used as global namespace)
  wadaddyNamespace = io.of("/wadaddy-namespace");

  wadaddyNamespace.on("connection", (socket) => {
    // All users join a single global room
    socket.join("all-users");

    // Acknowledge join
    socket.emit("connected_to_global", {
      message: "You are now connected to the global channel.",
    });

    socket.on("disconnect", () => {
      console.log("❌ Wadaddy Socket disconnected:", socket.id);
    });
  });

  // internalSpace = io.of("/internal-namespace");

  // internalSpace.on("connection", (socket) => {
  //   const { revicerId, senderId, role } = socket.handshake.auth;

  //   if (!revicerId || !senderId || !role) {
  //     console.log("[SOCKET] Missing parameters. Disconnecting...");
  //     socket.disconnect();
  //     return;
  //   }

  //   socket.join(revicerId);

  //   if (revicerId === "global") {
  //     socket.join("inhouse-notifications");
  //     // console.log(`[SOCKET] ${senderId} joined global-notifications`);
  //   }

  //   internalSpace.to(revicerId).emit("person_status", {
  //     userId: senderId,
  //     status: "online",
  //   });

  //   const getSenderName = async (id) => {
  //     // const models = [
  //     //   { model: User, label: "User" },
  //     //   { model: B2BAdmin, label: "B2BAdmin" },
  //     //   { model: B2BMember, label: "B2BMember" },

  //     //   { model: Branch, label: "Branch" },
  //     // ];

  //     // for (const { model, label } of models) {
  //       try {
  //         const doc = await User.findById(id).select("name");
  //         if (doc?.name) return doc.name;
  //       } catch (err) {
  //         console.error(
  //           `[SOCKET] Error searching in ${label} model:`,
  //           err.message
  //         );
  //       }
  //     // }
  //     return "Unknown";
  //   };

  //   const getRevicerName = async (id) => {
  //     try {
  //       const revicer = await User.findById(id).select("name");
  //       return revicer?.name || "Unknown Student";
  //     } catch (err) {
  //       console.error("[SOCKET] Error fetching revicer name:", err.message);
  //       return "Unknown revicer";
  //     }
  //   };

  //   socket.on("internal_message", async (
  //     {revicerId,senderId: msgSenderId,role: msgRole,message,mediaFiles}
  //   ) => {
  // 		try {
  //       // Upload if file and image
  //       if ( !message && (!Array.isArray(mediaFiles) || mediaFiles.length === 0) ) { return; }
  //       const uploads = [];
  //       if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
  //         for (const [index, file] of mediaFiles.entries()) {
  //           if (!file) continue;

  //           const extension = path.extname(file.fileName || "") || ".png"; // default to .png
  //           const fileName =
  //             (file.fileName || `file_${Date.now()}_${index}`) + extension;

  //           const uploadsDir = path.join(__dirname, "uploads/chat");
  //           if (!fs.existsSync(uploadsDir))
  //             fs.mkdirSync(uploadsDir, { recursive: true });

  //           // Decode base64 buffer
  //           const base64Data = file.buffer.replace(/^data:.*;base64,/, ""); // remove data URL prefix if present
  //           const bufferData = Buffer.from(base64Data, "base64");

  //           const savePath = path.join(uploadsDir, fileName);
  //           fs.writeFileSync(savePath, bufferData);

  //           // Relative path for DB
  //           const uploadIndex = savePath.indexOf("uploads");
  //           const relativePath =
  //             uploadIndex !== -1
  //               ? savePath.substring(uploadIndex).replace(/\\/g, "/")
  //               : savePath;

  //           uploads.push({
  //             url: relativePath,
  //             type: file.mimeType || "application/octet-stream",
  //             name: fileName,
  //           });

  //         }
  //       }

  //       // Create new message
  //       const newMessage = {
  //         revicerId: revicerId,
  //         senderId: msgSenderId || senderId,
  //         role: msgRole || role,
  //         message,
  //         timestamp: new Date(),
  //         isRead: false,
  //       };
  //       if (message) newMessage.message = message;
  //       if (uploads.length > 0) newMessage.media = uploads;

  //       let thread = await internalChatMessage.findOne({ revicerId: revicerId });

  //       if (!thread) {
  //         thread = await internalChatMessage.create({
  //           revicerId: revicerId,
  //           messages: [newMessage],
  //         });
  //       } else {
  //         thread.messages.push(newMessage);
  //         await thread.save();
  //       }

  //       const savedMessage = thread.messages[thread.messages.length - 1];
  //       const messageToEmit = {
  //         revicerId: revicerId,
  //         senderId: savedMessage.senderId,
  //         role: savedMessage.role,
  //         message: savedMessage.message,
  //         media: savedMessage.media,
  //         timestamp: savedMessage.timestamp,
  //         _id: savedMessage._id,
  //         isRead: savedMessage.isRead,
  //       };

  //       const senderName = await getSenderName(msgSenderId || senderId);
  //       const reciverName = await getRevicerName(revicerId);

  //       // NEW: Emit notification to other users in the room
  //       const notification = {
  //         messageId: savedMessage._id,
  //         revicerId: revicerId,
  //         senderId: savedMessage.senderId,
  //         role: savedMessage.role,
  //         message: savedMessage.message
  //           ? savedMessage.message.substring(0, 50)
  //           : "New media message",
  //         timestamp: savedMessage.timestamp,
  //         isRead: false,
  //         senderName, // New
  //         reciverName, // New
  //       };

  //       const roomSockets = await internalSpace.in(revicerId).fetchSockets();
  //       for (const roomSocket of roomSockets) {
  //         if (roomSocket.handshake.query.senderId !== msgSenderId) {
  //           roomSocket.emit("receive_notification", notification);
  //         }
  //       }

  //       // END NEW

  //       // New start
  //       // Emit to global notifications room (excluding sender)
  //       const globalSockets = await internalSpace
  //         .in("global-notifications")
  //         .fetchSockets();
  //       for (const globalSocket of globalSockets) {
  //         if (globalSocket.handshake.query.senderId !== msgSenderId) {
  //           globalSocket.emit("receive_notification", notification);
  //         }
  //       }
  //       // New end
  //       internalSpace.to(revicerId).emit("receive_message", messageToEmit);

  //     } catch (error) {
  //       console.error("Error saving:", {stack: error.stack, message: error.message});
  //       socket.emit("message_error", { error: "Failed to send message" });
  //     }
  //   })
  // });

  internalSpace = io.of("/internal-namespace");
  internalSpace.on("connection", (socket) => {
    const { senderId } = socket.handshake.auth;

    if (!senderId) {
      socket.disconnect();
      return;
    }

    socket.join(senderId);

    internalSpace.emit("person_status", {
      userId: senderId,
      status: "online",
    });

    // send message
    socket.on(
      "internal_message",
      async ({ receiverId, message, mediaFiles }) => {
        console.log("receiverIdreceiverId" ,receiverId);
          console.log("messagemessage" , message);
        try {
          if (!message && (!mediaFiles || mediaFiles.length === 0)) return;

          const uploads = [];

          if (Array.isArray(mediaFiles)) {
            for (const [index, file] of mediaFiles.entries()) {
              const extension = path.extname(file.fileName || "") || ".png";
              const fileName = `file_${Date.now()}_${index}${extension}`;

              const uploadsDir = path.join(__dirname, "uploads/chat");
              if (!fs.existsSync(uploadsDir))
                fs.mkdirSync(uploadsDir, { recursive: true });

              const base64Data = file.buffer.replace(/^data:.*;base64,/, "");
              const bufferData = Buffer.from(base64Data, "base64");

              const savePath = path.join(uploadsDir, fileName);
              fs.writeFileSync(savePath, bufferData);

              uploads.push({
                url: savePath
                  .substring(savePath.indexOf("uploads"))
                  .replace(/\\/g, "/"),
                type: file.mimeType,
                name: fileName,
              });
            }
          }

          // find or create conversation

          let thread = await internalChatMessage.findOne({
            participants: { $all: [senderId, receiverId] },
          });

          if (!thread) {
            thread = await internalChatMessage.create({
              participants: [senderId, receiverId],
              messages: [],
            });
          }

          const newMessage = {
            message,
            media: uploads,
            timestamp: new Date(),
            readBy: [senderId],
          };

          thread.messages.push(newMessage);
          await thread.save();

          const savedMessage = thread.messages.at(-1);

          const emitData = {
            conversationId: thread._id,
            senderId,
            receiverId,
            message: savedMessage.message,
            media: savedMessage.media,
            timestamp: savedMessage.timestamp,
            _id: savedMessage._id,
            readBy: savedMessage.readBy,
          };

          internalSpace
            .to(senderId)
            .to(receiverId)
            .emit("receive_internal_message", emitData);
        } catch (err) {
          console.log("Internal Message Error:", err);
        }
      },
    );

    // mark as read

    socket.on(
      "internal_message_read",
      async ({ conversationId, messageIds }) => {
        try {
          const userId = senderId;
          const thread = await internalChatMessage.findById(conversationId);

          if (!thread) return;

          const updatedIds = [];

          messageIds.forEach((id) => {
            const msg = thread.messages.id(id);

            if (msg && !msg.readBy.includes(userId)) {
              msg.readBy.push(userId);
              updatedIds.push(id);
            }
          });

          await thread.save();

          internalSpace.to(thread.participants).emit("messages_read_update", {
            conversationId,
            messageIds: updatedIds,
            readBy: userId,
          });
        } catch (err) {
          console.log("Internal Message Read error:", err);
        }
      },
    );

    socket.on("disconnect", () => {
      internalSpace.emit("person_status", {
        userId: senderId,
        status: "offline",
      });
    });
  });

  return io;
};

// Export so APIs can use

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

const getNotificationNamespace = () => {
  if (!notificationNamespace) {
    console.error("[NOTIFICATION SOCKET] Namespace not initialized");
  }
  return notificationNamespace;
};

const getWadaddyNamespace = () => {
  if (!wadaddyNamespace) {
    throw new Error("Wadaddy namespace not initialized");
  }
  return wadaddyNamespace;
};

module.exports = {
  initSocket,
  getIO,
  getNotificationNamespace,
  getWadaddyNamespace,
};

// const { uploadToCloudinary } = require("./middleware/cloudinary");
// const ChatMessage = require("./model/chatMessage");
// const B2BAdmin = require("./model/masters/b2b/b2bAdmin");
// const B2BMember = require("./model/masters/b2b/b2bMember");
// const Branch = require("./model/branch/branches");
// const User = require("./model/user");
// const BranchMember = require("./model/branch/branchMember");

// module.exports = (io) => {
//   const chatNameSpace = io.of("/chat-namespace");

//   chatNameSpace.on("connection", (socket) => {
//     const { studentId, senderId, role } = socket.handshake.query;

//     if (!studentId || !senderId || !role) {
//       console.log("[SOCKET] Missing parameters. Disconnecting...");
//       socket.disconnect();
//       return;
//     }

//     console.log(
//       `[SOCKET] Connected: ${role}-${senderId} for student ${studentId}`
//     );

//     socket.join(studentId);

//     chatNameSpace.to(studentId).emit("user_status", {
//       userId: senderId,
//       status: "online",
//     });

//     socket.on(
//       "send_message",
//       async ({
//         student,
//         senderId: msgSenderId,
//         role: msgRole,
//         message,
//         mediaFiles,
//       }) => {
//         try {
//           if (
//             !message &&
//             (!Array.isArray(mediaFiles) || mediaFiles.length === 0)
//           ) {
//             return;
//           }
//           const uploads = [];
//           if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
//             for (const file of mediaFiles) {
//               const { buffer, mimeType, fileName } = file;

//               const sanitizePublicId = (fileName) =>
//                 fileName
//                   .replace(/\.[^/.]+$/, "") // remove file extension
//                   .replace(/[\/\\?%*:|"<>()[\]{}&]/g, "") // remove illegal/special characters
//                   .replace(/\s+/g, "_") // replace whitespace with _
//                   .toLowerCase();

//               const cloudinaryPublicId = sanitizePublicId(fileName);
//               console.log(
//                 "cloudinaryPublicIdcloudinaryPublicId",
//                 cloudinaryPublicId
//               );
//               const uploadResult = await uploadToCloudinary(
//                 Buffer.from(buffer, "base64"),
//                 mimeType,
//                 "chat-media",
//                 cloudinaryPublicId
//               );

//               uploads.push({
//                 url: uploadResult.secure_url,
//                 type: mimeType,
//                 name: fileName,
//               });
//             }
//           }

//           const newMessage = {
//             student: student || studentId,
//             senderId: msgSenderId || senderId,
//             role: msgRole || role,
//             message,
//             timestamp: new Date(),
//             isRead: false,
//           };
//           if (message) newMessage.message = message;
//           if (uploads.length > 0) newMessage.media = uploads;

//           let thread = await ChatMessage.findOne({ student: studentId });

//           if (!thread) {
//             thread = await ChatMessage.create({
//               student: studentId,
//               messages: [newMessage],
//             });
//           } else {
//             thread.messages.push(newMessage);
//             await thread.save();
//           }

//           // Get the saved message with its _id
//           const savedMessage = thread.messages[thread.messages.length - 1];

//           // New add start
//           // Fetch sender details based on role
//           let senderName = "Unknown";
//           if (msgRole === "Super Admin" || msgRole === "Admin") {
//             const user = await User.findById(msgSenderId).select("name");
//             if (user) senderName = user.name;
//           } else if (msgRole === "b2bAdmin" || msgRole === "B2B Admin") {
//             const b2bAdmin = await B2BAdmin.findById(msgSenderId).select(
//               "companyName"
//             );
//             if (b2bAdmin) senderName = b2bAdmin.companyName;
//           } else if (msgRole === "b2bMember" || msgRole === "B2B Member") {
//             const b2bMember = await B2BMember.findById(msgSenderId).select(
//               "firstName lastName"
//             );
//             if (b2bMember)
//               senderName = `${b2bMember.firstName || ""} ${
//                 b2bMember.lastName || ""
//               }`.trim();
//           } else if (msgRole === "Branch") {
//             const branch = await Branch.findById(msgSenderId).select("name");
//             if (branch) senderName = branch.name;
//           } else if (msgRole === "Branch Member") {
//             const branchMember = await BranchMember.findById(
//               msgSenderId
//             ).select("firstName lastName");
//             if (branchMember)
//               senderName = `${branchMember.firstName || ""} ${
//                 branchMember.lastName || ""
//               }`.trim();
//           }
//           // New add end

//           const messageToEmit = {
//             studentId: studentId,
//             senderId: savedMessage.senderId,
//             role: savedMessage.role,
//             message: savedMessage.message,
//             media: savedMessage.media,
//             timestamp: savedMessage.timestamp,
//             _id: savedMessage._id,
//             isRead: savedMessage.isRead,
//           };

//           // const models = [
//           //   { model: User, label: "User" },
//           //   { model: B2BAdmin, label: "B2BAdmin" },
//           //   { model: B2BMember, label: "B2BMember" },
//           //   { model: Branch, label: "Branch" },
//           // ];

//           // const getSenderName = async (id) => {
//           //   for (const { model, label } of models) {
//           //     try {
//           //       const doc = await model.findById(id).select("name");
//           //       if (doc?.name) return doc.name;
//           //     } catch (err) {
//           //       console.error(
//           //         `[SOCKET] Error searching in ${label} model:`,
//           //         err.message
//           //       );
//           //     }
//           //   }
//           //   return "Unknown";
//           // };

//           // // Usage
//           // const senderName = await getSenderName(msgSenderId || senderId);

//           // NEW: Emit notification to other users in the room
//           const notification = {
//             messageId: savedMessage._id,
//             studentId: studentId,
//             senderId: savedMessage.senderId,
//             role: savedMessage.role,
//             message: savedMessage.message
//               ? savedMessage.message.substring(0, 50)
//               : "New media message",
//             timestamp: savedMessage.timestamp,
//             isRead: false,
//             senderName: senderName, // new add
//           };

//           const roomSockets = await chatNameSpace.in(studentId).fetchSockets();

//           for (const roomSocket of roomSockets) {
//             if (roomSocket.handshake.query.senderId !== msgSenderId) {
//               roomSocket.emit("receive_notification", notification);
//             }
//           }
//           // END NEW

//           chatNameSpace.to(studentId).emit("receive_message", messageToEmit);
//         } catch (error) {
//           console.error("Error saving message:", error);
//           socket.emit("message_error", { error: "Failed to send message" });
//         }
//       }
//     );

//     socket.on("message_read", async ({ messageIds }) => {
//       console.log("messageIdsmessageIdsmessageIds", messageIds);
//       if (!Array.isArray(messageIds) || messageIds.length === 0) {
//         console.log("[SOCKET] Invalid messageIds provided");
//         return;
//       }

//       try {
//         console.log(
//           "studentIdstudentIdstudentIdstudentIdstudentIdstudentId",
//           studentId
//         );
//         const thread = await ChatMessage.findOne({ student: studentId });
//         if (!thread) {
//           console.log("[SOCKET] No thread found for student:", studentId);
//           return;
//         }

//         // Update all matching message IDs
//         const updatedMessageIds = [];
//         let hasChanges = false;

//         messageIds.forEach((id) => {
//           try {
//             const message = thread.messages.id(id);
//             if (message && !message.isRead) {
//               message.isRead = true;
//               updatedMessageIds.push(id);
//               hasChanges = true;
//               console.log("[SOCKET] Marked message as read:", id);
//             }
//           } catch (err) {
//             console.log("[SOCKET] Invalid message ID:", id);
//           }
//         });

//         if (!hasChanges) {
//           console.log("[SOCKET] No messages were updated");
//           return;
//         }

//         await thread.save();
//         console.log(
//           "[SOCKET] Successfully updated messages:",
//           updatedMessageIds
//         );

//         // Emit to all clients in the room
//         chatNameSpace.to(studentId).emit("message_read_true", {
//           messageIds: updatedMessageIds,
//           studentId: studentId,
//         });

//         // NEW: Emit notification read confirmation
//         chatNameSpace.to(studentId).emit("notification_read_true", {
//           messageIds: updatedMessageIds,
//           studentId: studentId,
//         });
//         // END NEW

//         console.log(
//           "[SOCKET] Emitted message_read_true to room:",
//           updatedMessageIds
//         );
//       } catch (err) {
//         console.error("[SOCKET] Error updating read status:", err);
//         socket.emit("message_read_error", {
//           error: "Failed to mark messages as read",
//           messageIds,
//         });
//       }
//     });

//     // NEW: Handle notification read event
//     socket.on("notification_read", async ({ notificationIds }) => {
//       if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
//         console.log("[SOCKET] Invalid notificationIds provided");
//         return;
//       }

//       try {
//         const thread = await ChatMessage.findOne({ student: studentId });
//         if (!thread) {
//           console.log("[SOCKET] No thread found for student:", studentId);
//           return;
//         }

//         const updatedNotificationIds = [];
//         let hasChanges = false;

//         notificationIds.forEach((id) => {
//           try {
//             const message = thread.messages.id(id);
//             if (message && !message.isRead) {
//               message.isRead = true;
//               updatedNotificationIds.push(id);
//               hasChanges = true;
//               console.log("[SOCKET] Marked notification as read:", id);
//             }
//           } catch (err) {
//             console.log("[SOCKET] Invalid notification ID:", id);
//           }
//         });

//         if (hasChanges) {
//           await thread.save();
//           chatNameSpace.to(studentId).emit("notification_read_true", {
//             notificationIds: updatedNotificationIds,
//             studentId: studentId,
//           });
//           console.log(
//             "[SOCKET] Emitted notification_read_true:",
//             updatedNotificationIds
//           );
//         }
//       } catch (err) {
//         console.error("[SOCKET] Error updating notification read status:", err);
//         socket.emit("notification_read_error", {
//           error: "Failed to mark notifications as read",
//           notificationIds,
//         });
//       }
//     });
//     // END NEW

//     socket.on("leaveRoom", ({ studentId: roomId, role: userRole }) => {
//       console.log(`[SOCKET] ${userRole} leaving room ${roomId}`);
//       socket.leave(roomId);
//     });

//     socket.on("disconnect", () => {
//       console.log(`[SOCKET] Disconnected: ${role}-${senderId}`);
//       chatNameSpace.to(studentId).emit("user_status", {
//         userId: senderId,
//         status: "offline",
//       });
//     });

//     // Handle connection errors
//     socket.on("error", (error) => {
//       console.error("[SOCKET] Socket error:", error);
//     });
//   });
// };
