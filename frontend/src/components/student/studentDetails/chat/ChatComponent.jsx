import { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Alert,
  Row,
  Col,
  Card,
  Nav,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";
import io from "socket.io-client";
import Axios from "../../../../api";
import { BASEURL } from "../../../../baseUrl";
import { FaDownload, FaFileExcel, FaFilePdf, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Scrollbar from "react-scrollbars-custom";
import ALLImages from "../../../../common/Imagedata";
import moment from "moment";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import {
  initializeSocket,
  leaveRoom,
  markNotificationsAsRead,
} from "../../../../socket";
import { useNotification } from "../../../../context/NotificationContext";
import { decryptData } from "../../../../utils/encryptionUtils";

const ChatComponent = ({
  studentId,
  senderId,
  role,
  studentData,
  handleChatClose,
  isB2B = false,
}) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  // NEW: State for notifications
  const {
    notificationCount,
    setNotificationCount,
    notifications,
    setNotifications,
    fetchNotifications,
  } = useNotification();

  // END NEW
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState("offline");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1); // Track current page
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [hasMore, setHasMore] = useState(true);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const [showImageFullscreen, setShowImageFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [downloadedImages, setDownloadedImages] = useState(new Set());

  const messagesEndRef = useRef(null);
  const scrollbarRef = useRef(null); // Reference to Scrollbar component
  const prevScrollHeightRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const prevScrollTopRef = useRef(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = decryptData(localStorage.getItem("userId"));

  const renderMessageWithLinks = (text) => {
    if (!text) return "";

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#0d6efd;text-decoration:underline;">${url}</a>`;
    });
  };

  // Growing Textarea Logic start
  const adjustTextareaHeight = (el) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  useEffect(() => {
    if (newMessage === "" && textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  }, [newMessage]);
  // Growing Textarea Logic end

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollDown(false);

    const unreadMessages = messages.filter(
      (msg) => msg.role !== role || !msg.readBy?.includes(userId)
    );
    if (unreadMessages.length > 0 && socket) {
      const messageIds = unreadMessages.map((msg) => msg._id);
      socket.emit("message_read", { messageIds, userId });
      // console.log("message_readmessage_readmessage_read", messageIds);

      // NEW: Mark notifications as read when scrolling to bottom
      const notificationIds = notifications
        .filter((notif) => !notif.readBy?.includes(userId))
        .map((notif) => notif.messageId);
      if (notificationIds.length > 0) {
        markNotificationsAsRead(socket, notificationIds);
      }
      // END NEW
    }

    //
    if (textareaRef.current) textareaRef.current.style.height = "40px";
  };

  const fetchChatHistory = async (pageNum) => {
    setIsLoading(true);
    try {
      const response = await Axios.get(
        `${BASEURL}/chat/history/${studentId}?page=${pageNum}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const mappedMessages = response.data.data.data.map((msg) => ({
        studentId: studentId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        role: msg.role,
        media: msg.media,
        message: msg.message,
        timestamp: msg.timestamp,
        _id: msg._id,
        // isRead: msg.isRead,
        readBy: msg.readBy || [],
      }));
      if (pageNum === 1) {
        setMessages(mappedMessages);
      } else {
        setMessages((prevMessages) => [...mappedMessages, ...prevMessages]);
      }
      setHasMore(response.data.data.totalPages > pageNum);

      // NEW: Initialize notification count from chat history
      const unreadCount = mappedMessages.filter(
        (msg) => msg.role !== role && !msg.readBy?.includes(userId)
      ).length;
      setNotificationCount(unreadCount);
      // END NEW
    } catch (err) {
      console.error("Error fetching chat history:", err);
      setError("Failed to load chat history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize socket with callbacks
    const socket = initializeSocket({
      studentId,
      senderId,
      role,
      onConnect: () => {
        setIsConnected(true);
        setOtherUserStatus("online");
        setError("");
        fetchChatHistory(page);
      },
      onDisconnect: () => {
        setIsConnected(false);
        setOtherUserStatus("offline");
      },
      onReceiveMessage: (message) => {
        setMessages((prevMessages) => {
          const filteredMessages = prevMessages.filter(
            (msg) => !msg._id.startsWith("temp-")
          );
          return [...filteredMessages, message];
        });
        fetchNotifications();
      },
      onUserStatus: ({ userId, status }) => {
        if (userId !== senderId) {
          setOtherUserStatus(status);
        }
      },
      onMessageRead: ({ messageIds }) => {
        if (Array.isArray(messageIds) && messageIds.length > 0) {
          setPage(1);
          fetchChatHistory(1);

          // Filter out notifications related to the read messages
          setNotifications((prev) =>
            prev.filter((notif) => !messageIds.includes(notif.messageId))
          );

          // Recalculate notification count after filtering
          setNotificationCount((prev) => {
            const filteredNotifications = notifications.filter((notif) => {
              return (
                !messageIds.includes(notif.messageId) &&
                !notif.isRead &&
                notif.senderId !== senderId
              );
            });
            return filteredNotifications.length;
          });
          fetchNotifications();
        }
      },
      // NEW: Handle notifications
      onNotification: (notification) => {
        if (notification.senderId !== senderId) {
          setNotifications((prev) => [...prev, notification]);
          setNotificationCount((prev) => prev + 1);
        }
        fetchNotifications();
      },
      onNotificationRead: ({ notificationIds }) => {
        setNotifications((prev) => {
          const updatedNotifications = prev.map((notif) =>
            notificationIds?.includes(notif.messageId)
              ? { ...notif, isRead: true }
              : notif
          );

          // Calculate count from the updated notifications
          const unreadCount = updatedNotifications.filter(
            (notif) => !notif.isRead && notif.senderId !== senderId
          ).length;

          setNotificationCount(unreadCount);

          return updatedNotifications;
        });
        fetchNotifications();
      },
      // END NEW
      onError: (error) => {
        setIsConnected(false);
        setError("Connection error. Please try again later.");
      },
    });

    setSocket(socket);

    // Cleanup on unmount
    return () => {
      leaveRoom(socket, { studentId, role });
      // disconnectSocket();
    };
  }, [studentId, senderId, role]);

  useEffect(() => {
    if (isInitialLoadRef.current && messages.length > 0) {
      scrollToBottom();
      isInitialLoadRef.current = false;
    }
  }, [messages]);

  const handleScroll = (scrollValues) => {
    if (isLoading || !hasMore) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollValues;
    const isScrollingUp = scrollTop < prevScrollTopRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isScrollingUp && !isAtBottom) {
      setShowScrollDown(true);
    }
    // Hide button when at bottom
    if (isAtBottom) {
      setShowScrollDown(false);

      // Emit message_read event for unread messages
      const unreadMessages = messages.filter(
        (msg) => msg.role !== role && !msg.readBy?.includes(userId)
      );
      if (unreadMessages.length > 0 && socket) {
        const messageIds = unreadMessages.map((msg) => msg._id);
        socket.emit("message_read", { messageIds, userId });
        console.log("[SOCKET] Emitted message_read:", messageIds);
        // NEW: Mark notifications as read when at bottom
        const notificationIds = notifications
          .filter((notif) => !notif.isRead)
          .map((notif) => notif.messageId);
        if (notificationIds.length > 0) {
          markNotificationsAsRead(socket, notificationIds);
        }
        // END NEW
      }
    }
    prevScrollTopRef.current = scrollTop;

    if (scrollTop < 1) {
      prevScrollHeightRef.current =
        scrollbarRef.current?.contentElement.scrollHeight || 0;
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    // Fetch chat history when component mounts
    fetchChatHistory(1);
  }, [studentId]);
  // useEffect(() => {
  //   if (page > 1) {
  //     fetchChatHistory(page);
  //   }
  // }, [page]);

  useEffect(() => {
    if (page > 1 && scrollbarRef.current) {
      const newScrollHeight = scrollbarRef.current.contentElement.scrollHeight;
      const scrollOffset = newScrollHeight - prevScrollHeightRef.current;
      scrollbarRef.current.contentElement.scrollTop = scrollOffset;
    }
  }, [messages]);

  // const handleFileSelect = (e) => {
  //   setFiles(Array.from(e.target.files));
  //   e.target.value = null;
  // };
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = selectedFiles.filter((file) => file.size <= maxSize);
    if (validFiles.length < selectedFiles.length) {
      setError("Some files are too large (max 5MB)");
    }
    setFiles(validFiles);
    e.target.value = null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // if (!newMessage.trim() || !isConnected) return;
    if (!isConnected || (!newMessage.trim() && files.length === 0)) return;
    setError("");

    try {
      const mediaPayload = await Promise.all(
        files.map(async (file) => {
          const buffer = await file.arrayBuffer();
          return {
            buffer: btoa(
              new Uint8Array(buffer).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            ),
            mimeType: file.type,
            fileName: file.name,
          };
        })
      );
      const messageData = {
        student: studentId,
        senderId: senderId,
        role: role,
        message: newMessage,
        mediaFiles: mediaPayload.length > 0 ? mediaPayload : undefined,
      };

      const tempMessage = {
        studentId,
        senderId,
        role,
        message: newMessage.trim() || undefined,
        mediaFiles: mediaPayload.map((file) => ({
          url: URL.createObjectURL(files[mediaPayload.indexOf(file)]), // Local preview
          type: file.mimeType,
          name: file.fileName,
        })),
        timestamp: new Date(),
        _id: `temp-${Date.now()}`,
        readBy: [senderId],
      };
      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      socket.emit("send_message", messageData);

      // socket.emit("send_message", messageData);
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     ...messageData,
      //     isRead: false,
      //     timestamp: new Date(),
      //     _id: `temp-${Date.now()}`,
      //   },
      // ]);
      setNewMessage("");
      setFiles([]);
      mediaPayload.forEach((file) => {
        const url = URL.createObjectURL(files[mediaPayload.indexOf(file)]);
        setDownloadedImages((prev) => new Set(prev).add(url));
      });

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }

      setTimeout(scrollToBottom, 0);
      fetchNotifications();
    } catch (error) {
      console.error("Error Sending message:", error);
      setError("Failed to send message");
    }
  };

  const handleImageClick = (url, name) => {
    setSelectedImage(url);
    setSelectedImageName(name);
    setShowImageFullscreen(true);
  };

  const handleDownload = async (url, fileName = "file") => {
    console.log("urlurl>>>>>", url);
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      // Get file extension from MIME type
      const mimeType = blob.type; // e.g., "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      let extension;
      if (mimeType === "application/vnd.ms-excel") {
        extension = "xls";
      } else if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        extension = "xlsx";
      } else {
        extension = mimeType.split("/")[1] || "file"; // Fallback for other types
      }

      // Append extension if not already included in filename
      const finalFileName = fileName.includes(".")
        ? fileName
        : `${fileName}.${extension}`;

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      setDownloadedImages((prev) => new Set(prev).add(url));
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download file.");
    }
  };

  const getDateLabel = (timestamp) => {
    const messageDate = moment(timestamp);
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");

    if (messageDate.isSame(today, "day")) {
      return "Today";
    } else if (messageDate.isSame(yesterday, "day")) {
      return "Yesterday";
    } else {
      return messageDate.format("DD/MM/YYYY");
    }
  };

  const studentName = studentData?.name || "Unknown";

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col sm={12} md={12} lg={12} xl={12}>
          <Card className="custom-card">
            <div className="main-content-app pt-0">
              <div className="main-chat-header pt-3">
                {/* <FaArrowLeft
                  size={17}
                  onClick={handleChatClose}
                  // onClick={() => navigate("/student/studentapplication")}
                  className="me-2"
                /> */}
                <div className="main-img-user online">
                  <img alt="avatar" src={ALLImages("face1")} />
                </div>
                <div className="main-chat-msg-name d-flex justify-content-between align-items-center w-100">
                  <div>
                    <h6>{isB2B ? "Message" : studentName}</h6>
                    <span
                      className={`dot-label ${
                        otherUserStatus === "online"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    ></span>
                    <small className="me-3">{otherUserStatus}</small>

                    {/* <OverlayTrigger overlay={<Tooltip>Notifications</Tooltip>}>
                      <span
                        className="notification-icon ms-2"
                        // onClick={handleMarkAllNotificationsRead}
                        style={{ cursor: "pointer" }}
                      >
                        <FaBell />
                        {notificationCount > 0 && (
                          <Badge bg="danger" className="ms-1">
                            {notificationCount}
                          </Badge>
                        )}
                      </span>
                    </OverlayTrigger> */}
                  </div>
                  {!isB2B && (
                    <FaTimes
                      size={20}
                      onClick={handleChatClose}
                      // onClick={() => navigate("/student/studentapplication")}
                      className="me-2"
                      cursor="pointer"
                    />
                  )}
                </div>
                {/* <Nav>
                    <OverlayTrigger overlay={<Tooltip>Audio Call</Tooltip>}>
                      <Nav.Link><i className="fe fe-phone-call"></i></Nav.Link>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Video Call</Tooltip>}>
                      <Nav.Link><i className="fe fe-video"></i></Nav.Link>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Add Contact</Tooltip>}>
                      <Nav.Link><i className="fe fe-user-plus"></i></Nav.Link>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                      <Nav.Link><i className="fe fe-trash-2"></i></Nav.Link>
                    </OverlayTrigger>
                  </Nav> */}
              </div>
              <div className="main-chat-body" id="ChatBody">
                {isLoading && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 2000,
                    }}
                  >
                    <LoadMoreButton isLoading={isLoading} />
                  </div>
                )}
                <Scrollbar
                  // style={{ height: 390 }}
                  className="chat-body-section"
                  onScroll={handleScroll}
                  ref={scrollbarRef}
                >
                  <div className="content-inner chat-content">
                    {messages.length === 0 && (
                      <div className="no-messages text-center">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                    {messages.map((msg, index) => {
                      let showDateSeparator = false;
                      if (index === 0) {
                        showDateSeparator = true;
                      } else {
                        const currentDate = moment(msg.timestamp).startOf(
                          "day"
                        );
                        const prevDate = moment(
                          messages[index - 1].timestamp
                        ).startOf("day");
                        showDateSeparator = !currentDate.isSame(
                          prevDate,
                          "day"
                        );
                      }

                      return (
                        <div key={index}>
                          {showDateSeparator && (
                            <div className="date-separator">
                              {getDateLabel(msg.timestamp)}
                            </div>
                          )}
                          <div
                            className={`media ${
                              msg.role === role ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className="main-img-user online">
                              <img alt="avatar" src={ALLImages("face1")} />
                            </div>
                            <div className="media-body">
                              {/* {msg.message && (
                                <div
                                  className="main-msg-wrapper"
                                  style={{ whiteSpace: "pre-wrap" }}
                                >
                                  {msg.message}
                                </div>
                              )} */}
                              {msg.message && (
                                <div
                                  className="main-msg-wrapper"
                                  style={{ whiteSpace: "pre-wrap" }}
                                  dangerouslySetInnerHTML={{
                                    __html: renderMessageWithLinks(msg.message),
                                  }}
                                />
                              )}

                              {msg.media?.length > 0 && (
                                <div>
                                  {msg.media.map((m, i) => (
                                    <div key={i} className="mt-2">
                                      {m.type.startsWith("image/") ? (
                                        <div className="image-container">
                                          <img
                                            src={`${BASEURL}/${m.url}`}
                                            alt={m.name}
                                            className="chat-image"
                                            onClick={() =>
                                              handleImageClick(
                                                `${BASEURL}/${m.url}`,
                                                m.name
                                              )
                                            }
                                          />
                                          <FaDownload
                                            className="image-download-btn"
                                            onClick={() =>
                                              handleDownload(
                                                `${BASEURL}/${m.url}`,
                                                m.name
                                              )
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          className="pdf-container"
                                          onClick={() =>
                                            handleDownload(
                                              `${BASEURL}/${m.url}`,
                                              m.name
                                            )
                                          }
                                          style={{ cursor: "pointer" }}
                                        >
                                          <div className="whatsapp-document">
                                            {m.type === "application/pdf" ? (
                                              <FaFilePdf className="whatsapp-document-icon" />
                                            ) : m.type ===
                                                "application/vnd.ms-excel" ||
                                              m.type ===
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                                              <FaFileExcel
                                                className="whatsapp-document-icon"
                                                color="green"
                                              />
                                            ) : (
                                              <FaFilePdf className="whatsapp-document-icon" />
                                            )}
                                            <div className="whatsapp-document-text">
                                              <div>
                                                <div className="whatsapp-document-name">
                                                  {m.name}
                                                </div>
                                                <div className="whatsapp-document-meta">
                                                  {m.type === "application/pdf"
                                                    ? "PDF Document"
                                                    : m.type ===
                                                        "application/vnd.ms-excel" ||
                                                      m.type ===
                                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                    ? "Excel Document"
                                                    : "Document"}
                                                </div>
                                              </div>
                                              <div>
                                                {msg.role !== role &&
                                                  !downloadedImages.has(
                                                    `${BASEURL}/${m.url}`
                                                  ) && (
                                                    <FaDownload
                                                      className="pdf-download-btn"
                                                      onClick={() =>
                                                        handleDownload(
                                                          `${BASEURL}/${m.url}`,
                                                          m.name
                                                        )
                                                      }
                                                    />
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div>
                                <span>
                                  {moment(msg.timestamp).format("hh:mm A")}
                                </span>
                                {msg.senderName && (
                                  <span className="ms-1">
                                    ({msg.senderName})
                                  </span>
                                )}
                                {msg.role === role && (
                                  <span className="read-status ms-2">
                                    {msg.readBy?.length > 0 ? (
                                      <i className="fas fa-check-double text-info" />
                                    ) : (
                                      <i
                                        className="fas fa-check text-muted"
                                        style={{ fontSize: "11px" }}
                                      />
                                    )}
                                  </span>
                                )}
                                <Link to="#">
                                  <i className="icon ion-android-more-horizontal"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </Scrollbar>
                {showScrollDown && (
                  <div className="text-center">
                    <Button
                      variant="primary"
                      className="scroll-down-button enhanced"
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "40%",
                      }}
                      onClick={scrollToBottom}
                    >
                      <i className="fas fa-arrow-down"></i>
                      <span className="ms-2">New Messages</span>
                      {/* NEW: Show notification count on scroll down button */}
                      {notificationCount > 0 && (
                        <Badge bg="danger" className="ms-2">
                          {notificationCount}
                        </Badge>
                      )}
                      {/* END NEW */}
                    </Button>
                  </div>
                )}
              </div>
              <div className="whatsapp-footer">
                {/* <Nav>
                  <Nav.Link
                    className="attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="fe fe-paperclip me-3"></i>
                  </Nav.Link>
                </Nav> */}
                <button
                  type="button"
                  className="attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!isConnected}
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
                <Form onSubmit={handleSendMessage} className="w-100">
                  <Form.Control
                    ref={textareaRef}
                    as="textarea"
                    rows={1}
                    className="whatsapp-input"
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      adjustTextareaHeight(e.target);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    disabled={!isConnected}
                    style={{
                      overflowY: "auto",
                      scrollbarWidth: "none",
                      resize: "none",
                    }}
                  />
                </Form>

                <button
                  type="submit"
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={
                    !isConnected || (!newMessage.trim() && files.length === 0)
                  }
                >
                  <i
                    className="far fa-paper-plane"
                    style={{ marginRight: "3px" }}
                  ></i>
                </button>
                {/* <Link
                  className="send-btn"
                  to="#"
                  onClick={handleSendMessage}
                  disabled={
                    !isConnected || (!newMessage.trim() && files.length === 0)
                  }
                >
                  <i className="far fa-paper-plane"></i>
                </Link> */}
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
          </Card>
        </Col>
      </Row>

      {showImageFullscreen && (
        <div className="fullscreen-image-container">
          <img
            src={selectedImage}
            alt="Fullscreen"
            className={
              downloadedImages.has(selectedImage)
                ? "fullscreen-image"
                : "fullscreen-image-blurred"
            }
          />
          {!downloadedImages.has(selectedImage) && (
            <div className="download-prompt">
              Tap Download to view this image
            </div>
          )}
          <FaTimes
            className="fullscreen-close-btn"
            onClick={() => setShowImageFullscreen(false)}
          />
          <FaDownload
            className="fullscreen-download-btn"
            onClick={() => handleDownload(selectedImage, selectedImageName)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
