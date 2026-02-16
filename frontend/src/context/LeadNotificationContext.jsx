// LeadNotificationContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { decryptData } from '../../src/utils/encryptionUtils';

const LeadNotificationContext = createContext();

export const LeadNotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const userId = decryptData(localStorage.getItem("userId"));

  useEffect(() => {
    if (!userId) return;
    const newSocket = io(`wss://zokepconsultant.com/lead-notifications-namespace`, {
      query: { userId },
      transports: ['websocket'],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [userId]);

  return (
    <LeadNotificationContext.Provider value={{ socket }}>
      {children}
    </LeadNotificationContext.Provider>
  );
};

export const useLeadNotification = () => useContext(LeadNotificationContext);