// SocketContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { initializeSocket, leaveRoom, disconnectSocket } from "../socket";
import { decryptData } from "../utils/encryptionUtils";
import { useNotification } from "./NotificationContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { setNotifications, setNotificationCount, fetchNotifications } = 
    useNotification();

  useEffect(() => {
    const userRole = decryptData(localStorage.getItem("role"));
    const userId = decryptData(localStorage.getItem("userId"));

    if (userId && userRole) {
      const socketInstance = initializeSocket({
        studentId: "global",
        senderId: userId,
        role: userRole,
        query: { userId },   // New Added
        onConnect: () => {
          console.log("[SOCKET] Global socket connected");
          fetchNotifications();
        },
        onDisconnect: () => console.log("[SOCKET] Global socket disconnected"),
        onReceiveMessage: () => {},
        onUserStatus: () => {},
        onMessageRead: () => {},
        onNotification: (notification) => {
          console.log("🚀 ~ SocketProvider ~ notification:", notification)
          
          if (notification.senderId !== userId) {
            setNotifications((prev) => {
              const exists = prev.some((n) => n.messageId === notification.messageId);
              if (!exists) {
                setNotificationCount((prevCount) => prevCount + 1);
                return [...prev, { ...notification, readBy: [] }];
              }
              return prev;
            });
          }
          fetchNotifications();
        },
        onNotificationRead: ({ notificationIds }) => {
          console.log("🚀 ~ SocketProvider ~ notificationIds:", notificationIds)
          setNotifications((prev) => {
            const updatedNotifications = prev.map((notif) =>
              notificationIds?.includes(notif.messageId)
                ? {
                    ...notif,
                    readBy: [...(notif.readBy || []), userId], // add current user to readBy
                  }
                : notif
            );

            // Calculate the number of notifications newly marked as read
            const newlyReadCount = prev.filter(
              (n) =>
                notificationIds.includes(n.messageId) &&
                !(n.readBy || []).includes(userId)
            ).length;

            setNotificationCount((prevCount) => prevCount - newlyReadCount);

            return updatedNotifications;
          });
          fetchNotifications();
        },
        onError: (error) => {
          console.error("[SOCKET] Global socket error:", error);
        },
      });

      setSocket(socketInstance);

      return () => {
        leaveRoom(socketInstance, { studentId: "global", role: userRole });
        disconnectSocket();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
