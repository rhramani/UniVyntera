import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../api";
import { BASEURL } from "../baseUrl";
import toast from "react-hot-toast";

// 1. Create Context
const NotificationContext = createContext();

// 2. Create Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationMessageCount, setNotificationMessageCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      // const userId = decryptData(localStorage.getItem("userId"));
      // if (!userId) return;

      const response = await Axios.get(`${BASEURL}/chat/notification`);

      const fetchedNotifications = response?.data?.data?.unreadByStudent || [];
      const fetchedNotificationCount = response?.data?.data?.unreadStudentCount || [];
      const fetchedNotificationMessageCount = response?.data?.data?.totalUnreadMessages || [];

      setNotifications(fetchedNotifications);
      setNotificationCount(
        fetchedNotificationCount
      );
      setNotificationMessageCount(fetchedNotificationMessageCount)
      // setNotificationCount(
      //   fetchedNotifications.filter((n) => !n.isRead).length
      // );
    } catch (error) {
      console.error(
        "[NotificationContext] Failed to fetch notifications:",
        error
      );
      toast.error("Failed to load notifications");
    }
  };

  
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        notifications,
        setNotifications,
        notificationMessageCount,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// 3. Create Custom Hook (Optional but clean)
// export const useNotification = () => useContext(NotificationContext);
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};