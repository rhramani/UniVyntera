// src/layouts/NotificationContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { decryptData } from "../utils/encryptionUtils";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  console.log("Rendering NotificationProvider");


  return (
    <NotificationContext.Provider value={socket}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationSocket = () => useContext(NotificationContext);
