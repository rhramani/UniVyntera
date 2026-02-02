// socket.js
import io from "socket.io-client";
import { CHAT_MESSAGE_URL } from "./baseUrl"; // Adjust the import path as needed
import { BASEURL } from "./baseUrl";
let socketInstance = null;
let internalSocket = null;

const initializeSocket = ({
  studentId,
  senderId,
  role,
  onConnect,
  onDisconnect,
  onReceiveMessage,
  onUserStatus,
  onMessageRead,
  onNotification,
  onNotificationRead,
  onLeadNotification,
  onError,
}) => {
  // if (socketInstance) {
  //   console.log("[SOCKET] Socket already initialized");
  //   return socketInstance;
  // }
  // New start
  // if (socketInstance && socketInstance.connected) {
  //   console.log("[SOCKET] Socket already initialized");
  //   // If connecting to a different studentId or global, leave the old room
  //   if (socketInstance.studentId !== studentId) {
  //     socketInstance.emit("leaveRoom", { studentId: socketInstance.studentId, role });
  //     socketInstance.studentId = studentId;
  //     socketInstance.emit("joinRoom", { studentId, role });
  //   }
  //   return socketInstance;
  // }
  // New end

  // Initialize Socket.IO connection
  socketInstance = io(`${CHAT_MESSAGE_URL}/chat-namespace`, {
    auth: {
      studentId,
      senderId,
      role,
    },
    transports: ["websocket"],
  });
  // console.log("🚀 ~ initializeSocket ~ studentId:", studentId)
  // console.log("🚀 ~ initializeSocket ~ senderId:", senderId)
  // console.log("🚀 ~ initializeSocket ~ role:", role)

  socketInstance.studentId = studentId;

  // Handle connection
  socketInstance.on("connect", () => {
    // console.log("[SOCKET] Connected to Socket.IO server");
    socketInstance.emit("joinRoom", { studentId, role });

    // New start
    // Join global notification room if studentId is "global"
    if (studentId === "global") {
      socketInstance.emit("joinRoom", {
        studentId: "global-notifications",
        role,
      });
    }
    // New end
    onConnect?.();
  });

  // Handle disconnection
  socketInstance.on("disconnect", () => {
    // console.log("[SOCKET] Disconnected from Socket.IO server");
    onDisconnect?.();
  });

  // Handle receiving messages
  socketInstance.on("receive_message", (message) => {
    // console.log("[SOCKET] Received message:", message);
    onReceiveMessage?.(message);
  });

  // Handle user status updates
  socketInstance.on("user_status", ({ userId, status }) => {
    // console.log("[SOCKET] User status:", { userId, status });
    onUserStatus?.({ userId, status });
  });

  // Handle message read confirmation
  socketInstance.on("message_read_true", ({ messageIds }) => {
    console.log("🚀 ~ initializeSocket ~ messageIds 1:", messageIds);
    // console.log(
    //   "[SOCKET] Received message_read_true with messageIds:",
    //   messageIds
    // );
    onMessageRead?.({ messageIds });
  });

  // NEW: Handle notification events
  socketInstance.on("receive_notification", (notification) => {
    // console.log("[SOCKET] Received notification:", notification);
    onNotification?.(notification);
  });

  socketInstance.on("notification_read_true", ({ notificationIds }) => {
    // console.log(
    //   "[SOCKET] Received notification_read_true with notificationIds:",
    //   notificationIds
    // );
    onNotificationRead?.({ notificationIds });
  });

  // Handle lead notification events
  socketInstance.on("receive_lead_notification", (leadNotification) => {
    // console.log("[SOCKET] Received lead notification:", leadNotification);
    onLeadNotification?.(leadNotification);
  });
  // END NEW

  // Handle connection errors
  // socketInstance.on("connect_error", (error) => {
  //   console.error("[SOCKET] Socket connection error:", error);
  //   onError?.(error);
  // });

  return socketInstance;
};

const initializeInternalSocket = ({
  senderId,
  onInternalMessage,
  onMessagesReadUpdate,
  onPersonStatus,
  onConnect,
  onDisconnect,
}) => {
  // if (internalSocket) return internalSocket;

  if (!internalSocket) {
    internalSocket = io(`${CHAT_MESSAGE_URL}/internal-namespace`, {
      auth: { senderId },
      transports: ["websocket"],
    });
  }

  internalSocket.off("connect");
  internalSocket.on("connect", () => {
    console.log("✅ Internal Socket Connected", internalSocket.id);
    onConnect?.();
  });

  internalSocket.off("disconnect");
  internalSocket.on("disconnect", () => onDisconnect?.());

  // ✅ ONLY internal events here
  internalSocket.off("receive_internal_message");
  internalSocket.on("receive_internal_message", (data) => {
    console.log("📩 Internal Message Received:", data);
    onInternalMessage?.(data);
  });

  internalSocket.off("messages_read_update");
  internalSocket.on("messages_read_update", (data) => {
    console.log("👁️ Messages Read Update:", data);
    onMessagesReadUpdate?.(data);
  });

  internalSocket.off("person_status");
  internalSocket.on("person_status", (data) => {
    console.log("🟢 Person Status Update:", data);
    onPersonStatus?.(data);
  });

  return internalSocket;
};

/* =====================================================
   ✅ NEW — INTERNAL CHAT EMIT HELPERS
===================================================== */

// ▶️ send internal message
const sendInternalMessage = (socket, { receiverId, message, mediaFiles }) => {
  if (socket && socket.connected) {
    socket.emit("internal_message", {
      receiverId,
      message,
      mediaFiles: mediaFiles || [],
    });
  } else {
    console.error("[SOCKET] internal_message failed — not connected");
  }
};

// ✅ mark messages read (blue tick)
const markInternalMessagesRead = (socket, { conversationId, messageIds }) => {
  if (socket && socket.connected) {
    socket.emit("internal_message_read", {
      conversationId,
      messageIds,
    });
  } else {
    console.error("[SOCKET] internal_message_read failed — not connected");
  }
};

// Initialize notification socket for lead notifications
const initializeNotificationSocket = ({
  userId,
  onConnect,
  onDisconnect,
  onLeadNotification,
  onError,
}) => {
  const notificationSocket = io(`${CHAT_MESSAGE_URL}/notification-namespace`, {
    query: {
      userId,
    },
    transports: ["websocket"],
  });

  // Handle connection
  notificationSocket.on("connect", () => {
    // console.log("[NOTIFICATION SOCKET] Connected to notification namespace");
    onConnect?.();
  });

  // Handle disconnection
  notificationSocket.on("disconnect", () => {
    // console.log("[NOTIFICATION SOCKET] Disconnected from notification namespace");
    onDisconnect?.();
  });

  // Handle lead notification events
  notificationSocket.on("receive_notification", (leadNotification) => {
    // console.log("[NOTIFICATION SOCKET] Received lead notification:", leadNotification);
    onLeadNotification?.(leadNotification);
  });

  // Handle connection errors
  notificationSocket.on("error", (error) => {
    console.error("[NOTIFICATION SOCKET] Socket error:", error);
    onError?.(error);
  });

  return notificationSocket;
};

// Function to send a message
const sendMessage = (socket, messageData) => {
  if (socket && socket.connected) {
    socket.emit("send_message", messageData);
  } else {
    console.error("[SOCKET] Cannot send message: Socket is not connected");
  }
};

// Function to mark messages as read
const markMessagesAsRead = (socket, messageIds) => {
  if (socket && socket.connected) {
    socket.emit("message_read", { messageIds });
  } else {
    console.error(
      "[SOCKET] Cannot mark messages as read: Socket is not connected",
    );
  }
};

// NEW: Function to mark notifications as read (already exists but ensuring it's included)
const markNotificationsAsRead = (socket, notificationIds) => {
  if (socket && socket.connected && notificationIds?.length > 0) {
    socket.emit("notification_read", { notificationIds });
    // console.log("[SOCKET] Emitted notification_read:", notificationIds);
  } else {
    console.error(
      "[SOCKET] Cannot mark notifications as read: Socket is not connected",
    );
  }
};

// Function to leave a room
const leaveRoom = (socket, { studentId, role }) => {
  if (socket && socket.connected) {
    socket.emit("leaveRoom", { studentId, role });
    // socket.disconnect();
  }
};

// Function to get the socket instance
const getSocket = () => socketInstance;

// Function to disconnect the socket
const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.emit("leaveRoom", {
      studentId: socketInstance.studentId,
      role: socketInstance.role,
    });
    socketInstance.disconnect();
    socketInstance = null;
    // console.log("[SOCKET] Socket disconnected and instance cleared");
  }
};
// const socket = io(BASEURL); // Or your production backend URL

// Function to get the internal socket instance
const getInternalSocket = () => internalSocket;

// Function to disconnect the internal socket
const disconnectInternalSocket = () => {
  if (internalSocket) {
    internalSocket.disconnect();
    internalSocket = null;
  }
};

export {
  initializeSocket,
  initializeNotificationSocket,
  sendMessage,
  markMessagesAsRead,
  markNotificationsAsRead,
  leaveRoom,
  getSocket,
  disconnectSocket,
  // socket,

  // new whatsapp chat
  initializeInternalSocket,
  sendInternalMessage,
  markInternalMessagesRead,
  getInternalSocket,
  disconnectInternalSocket,
};
