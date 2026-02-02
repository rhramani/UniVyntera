import React, { useState, useRef, useEffect } from "react";
import { adminGetOne } from "../redux/actions/Admin.action";
import { useDispatch } from "react-redux";
import { decryptData } from "../utils/encryptionUtils";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import {
  getInternalSocket,
  initializeInternalSocket,
  markInternalMessagesRead,
  sendInternalMessage,
} from "../socket";
import {
  getAllInternalChatHistory,
  getAllInternalChatUser,
} from "../redux/actions/Dashboard.action";

const WhatsAppLightUI = ({ onClose }) => {
  const dispatch = useDispatch();
  const [allUser, setAllUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const [onlineMap, setOnlineMap] = useState({});

  const currentUserId = decryptData(localStorage.getItem("userId"));
  const [messages, setMessages] = useState([]);
  console.log("messagesmessages", messages);

  const selectedUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const fetchChatHistory = () => {
    if (!selectedUser) return;
    dispatch(getAllInternalChatHistory(selectedUser.conversationId)).then(
      (res) => {
        setMessages(res?.data?.message?.messages || []);
      },
    );
  };

  // useEffect(() => {
  //   if (!selectedUser) return;
  //   fetchChatHistory();
  // }, [selectedUser]);

  useEffect(() => {
    if (!currentUserId) return;

    initializeInternalSocket({
      senderId: currentUserId,

      onInternalMessage: (msg) => {
        console.log("📩 Internal Message Received:", msg);

        const activeUser = selectedUserRef.current;

        if (
          String(msg.senderId) === String(activeUser?._id) ||
          String(msg.receiverId) === String(activeUser?._id)
        ) {
          setMessages((prev) => {
            console.log("prev len:", prev.length);
            return [...prev, msg];
          });
        }
      },

      onPersonStatus: ({ userId, status }) => {
        setOnlineMap((prev) => ({
          ...prev,
          [userId]: status === "online",
        }));
      },

      onMessagesReadUpdate: ({ messageIds, readBy }) => {
        setMessages((prev) =>
          prev.map((m) =>
            messageIds.includes(m._id)
              ? { ...m, readBy: [...(m.readBy || []), readBy] }
              : m,
          ),
        );
      },
    });
  }, [currentUserId]); // ONLY once

  useEffect(() => {
    if (!messages.length || !selectedUser) return;

    const unreadIds = messages
      .filter(
        (m) =>
          m.senderId === selectedUser._id && !m.readBy?.includes(currentUserId),
      )
      .map((m) => m._id);

    if (!unreadIds.length) return;

    const socket = getInternalSocket();

    markInternalMessagesRead(socket, {
      conversationId: messages[0].conversationId,
      messageIds: unreadIds,
    });
  }, [messages, selectedUser]);

  const fetchChatUsers = async () => {
    try {
      const res = await dispatch(getAllInternalChatUser());

      setAllUser(res?.data?.message || []);
    } catch (e) {
      console.log("chat user list error", e);
      setAllUser([]);
    }
  };

  useEffect(() => {
    fetchChatUsers();
  }, []);

  const handleUserClick = async (user) => {
    console.log("user", user);
    setSelectedUser(user);

    try {
      const res = await dispatch(
        getAllInternalChatHistory(user.conversationId),
      );
      setMessages(res?.data?.message?.messages || []);
    } catch (e) {
      console.log("conversation load error", e);
      setMessages([]);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = selectedFiles.filter((file) => file.size <= maxSize);
    if (validFiles.length < selectedFiles.length) {
      toast.error("Some files are too large (max 5MB)");
    }
    setFiles(validFiles);
    e.target.value = null;
  };

  const [activeChat, setActiveChat] = useState(allUser[0]);

  const [input, setInput] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const filteredChats = allUser.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      chat._id != currentUserId,
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    const socket = getInternalSocket();

    if (!socket?.connected) {
      console.log("❌ internal socket not connected");
      return;
    }

    sendInternalMessage(socket, {
      receiverId: selectedUser._id,
      message: input,
      mediaFiles: files,
    });

    setInput("");
    setFiles([]);

    // 2️⃣ refresh user chat list
    // await fetchChatUsers();
    const res = await dispatch(getAllInternalChatUser());
    console.log("updatedUsers", allUser, selectedUser);
    // 3️⃣ find same user again from fresh list
    const updatedUser = res?.data?.message.find(
      (u) => u._id === selectedUser._id,
    );
    console.log("updatedUser.conversationId", updatedUser.conversationId);
    if (!updatedUser?.conversationId) {
      console.log("❌ convId not found after refresh");
      return;
    }

    // 4️⃣ refresh history using convId
    try {
      const res = await dispatch(
        getAllInternalChatHistory(updatedUser.conversationId),
      );

      setMessages(res?.data?.message?.messages || []);
    } catch (e) {
      console.log("history refresh error", e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const styles = {
    app: {
      display: "flex",
      height: "100%",
      width: "100%",
      background: "#f0f2f5",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    },
    sidebar: {
      width: "35%",
      minWidth: "300px",
      background: "#ffffff",
      borderRight: "1px solid #d1d7db",
      display: "flex",
      flexDirection: "column",
    },
    sidebarHeader: {
      padding: "20px 16px",
      fontSize: "20px",
      fontWeight: 600,
      color: "#111b21",
      background: "#f0f2f5",
      borderBottom: "1px solid #d1d7db",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    searchContainer: {
      padding: "10px 12px",
      background: "#f0f2f5",
      borderBottom: "1px solid #d1d7db",
    },
    search: {
      width: "100%",
      padding: "9px 32px 9px 12px",
      borderRadius: "8px",
      border: "1px solid #d1d7db",
      outline: "none",
      fontSize: "14px",
      background:
        '#ffffff url(\'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23646c73" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>\') no-repeat right 10px center',
      backgroundSize: "16px",
    },
    chatList: {
      flex: 1,
      overflowY: "auto",
      backgroundColor: "#ffffff",
    },
    chatItem: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "12px 16px",
      cursor: "pointer",
      transition: "background 0.2s",
      borderBottom: "1px solid #f0f2f5",
    },
    avatar: {
      width: "49px",
      height: "49px",
      borderRadius: "50%",
      background: "#25d366",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
      fontSize: "18px",
      flexShrink: 0,
    },
    chatInfo: {
      flex: 1,
      minWidth: 0,
    },
    chatTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "4px",
    },
    chatName: {
      fontWeight: 600,
      fontSize: "16px",
      color: "#111b21",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    chatTime: {
      fontSize: "12px",
      color: "#667781",
      flexShrink: 0,
    },
    chatLast: {
      fontSize: "14px",
      color: "#667781",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    unreadBadge: {
      backgroundColor: "#25d366",
      color: "white",
      fontSize: "12px",
      fontWeight: "bold",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "8px",
    },
    chatArea: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "#efeae2",
      backgroundImage:
        "url('https://web.whatsapp.com/img/bg-chat-tile_9f39b5e.png')",
      backgroundRepeat: "repeat",
    },
    chatHeader: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "10px 16px",
      background: "#f0f2f5",
      borderBottom: "1px solid #d1d7db",
      minHeight: "60px",
    },
    headerAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#25d366",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
      fontSize: "16px",
    },
    headerInfo: {
      flex: 1,
    },
    headerName: {
      fontWeight: 600,
      fontSize: "16px",
      color: "#111b21",
    },
    status: {
      fontSize: "13px",
      color: "#667781",
    },
    messages: {
      flex: 1,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      overflowY: "auto",
      position: "relative",
    },
    msg: {
      maxWidth: "65%",
      padding: "8px 12px",
      borderRadius: "8px",
      boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
      fontSize: "14.2px",
      lineHeight: "19px",
      wordBreak: "break-word",
    },
    userMsg: {
      alignSelf: "flex-end",
      backgroundColor: "#d9fdd3",
      marginLeft: "auto",
      textAlign: "left",
    },
    botMsg: {
      alignSelf: "flex-start",
      backgroundColor: "#ffffff",
      marginRight: "auto",
      textAlign: "left",
    },
    msgTime: {
      fontSize: "11px",
      color: "#667781",
      textAlign: "right",
      marginTop: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "4px",
    },
    inputBar: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 16px",
      background: "#f0f2f5",
      borderTop: "1px solid #d1d7db",
      minHeight: "62px",
    },
    attachButton: {
      position: "relative",
      border: "none",
      background: "transparent",
      fontSize: "24px",
      color: "#54656f",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
    },
    attachMenu: {
      position: "absolute",
      bottom: "50px",
      left: "0",
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      padding: "8px 0",
      width: "220px",
      zIndex: 1000,
    },
    attachItem: {
      padding: "12px 16px",
      borderRadius: "0",
      cursor: "pointer",
      fontSize: "14px",
      color: "#111b21",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "background 0.2s",
    },
    input: {
      flex: 1,
      padding: "9px 12px",
      borderRadius: "8px",
      border: "1px solid #d1d7db",
      outline: "none",
      fontSize: "15px",
      backgroundColor: "#ffffff",
      minHeight: "40px",
      maxHeight: "120px",
      resize: "none",
    },
    sendButton: {
      border: "none",
      background: "transparent",
      fontSize: "24px",
      color: "#54656f",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
    },
    closeButton: {
      background: "none",
      border: "1px black solid",
      color: "#54656f",
      cursor: "pointer",
      fontSize: "20px",
      padding: "4px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
    },
  };

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span>In House chat</span>
          <button style={styles.closeButton} onClick={onClose} title="Close">
            ×
          </button>
        </div>

        <div style={styles.searchContainer}>
          <input
            style={styles.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start new chat"
          />
        </div>

        <div style={styles.chatList}>
          {filteredChats.length > 0
            ? filteredChats.map((c) => (
                <div
                  key={c?.userId}
                  className={`chat-item ${
                    selectedUser?.userId === c?.userId ? "chat-item-active" : ""
                  }`}
                  style={styles.chatItem}
                  onClick={() => handleUserClick(c)}
                >
                  <div style={{ position: "relative" }}>
                    <div style={styles.avatar}>
                      {c.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <span
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: onlineMap[c._id] ? "#25d366" : "#ccc",
                        border: "2px solid white",
                      }}
                    />
                  </div>

                  <div style={styles.chatInfo}>
                    <div style={styles.chatTop}>
                      <span style={styles.chatName}>
                        {`${c.name} - ${c.role}`}
                      </span>

                      <span style={styles.chatTime}>
                        {c.lastTime &&
                          new Date(c.lastTime).toLocaleTimeString()}
                      </span>
                    </div>

                    <div style={styles.chatLast}>
                      {c.lastMessage}

                      {c.unreadCount > 0 && (
                        <span style={styles.unreadBadge}>{c.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        <div style={styles.chatHeader}>
          {/* <div style={styles.headerAvatar}>
            {selectedUser?.name?.slice(0, 2).toUpperCase()}
          </div> */}

          <div style={styles.headerInfo}>
            <div style={styles.headerName}>
              {" "}
              {selectedUser?.name || "Select User"}
            </div>
            <div style={styles.status}>
              {onlineMap[selectedUser?._id] ? "online" : "offline"}
            </div>
          </div>
        </div>

        <div style={styles.messages}>
          {messages.map((m) => {
            // normalize sender id safely
            const senderId =
              typeof m.senderId === "object" ? m.senderId?._id : m.senderId;

            const mine = String(senderId) === String(currentUserId);

            const read = (m.readBy || []).some(
              (id) => String(id) === String(currentUserId),
            );

            return (
              <div
                key={m._id}
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: read ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.msg,
                    background: read ? "#d9fdd3" : "#ffffff",
                  }}
                >
                  <div>{m.message}</div>

                  <div style={styles.msgTime}>
                    {new Date(
                      m.timestamp || m.createdAt || Date.now(),
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                    {/* {(read ? " ✓✓" : " ✓")} */}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputBar}>
          <button
            type="button"
            className="attach-btn"
            onClick={() => fileInputRef.current?.click()}
            // disabled={!isConnected}
          >
            <i className="fe fe-paperclip"></i>
          </button>
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <textarea
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            onKeyDown={handleKeyPress}
            rows={1}
          />
          <button
            style={{
              ...styles.sendButton,
              color: input.trim() ? "#25d366" : "#54656f",
            }}
            onClick={sendMessage}
            disabled={!input.trim()}
            title="Send"
          >
            ➤
          </button>
        </div>
        {files.length > 0 && (
          <div className="mt-2">
            <strong>Selected files:</strong>
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppLightUI;
