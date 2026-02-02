import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { BASEURL } from "../../baseUrl";
// const socket = io(`${BASEURL}/wadaddy-namespace`);
import { getChatContacts } from "../../redux/actions/BulkMessage/Contact.action";
import {
  sendMessage,
  getHistory,
  appendMessage,
  updateMessageStatus,
} from "../../redux/actions/BulkMessage/Chat.action";
import { toast } from "react-toastify";
// import socket from "../../../../../socket";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import { Repeat } from "@mui/icons-material";
import { FaComment } from "react-icons/fa";
import { FiCheck, FiCheckCircle, FiXCircle } from "react-icons/fi";
dayjs.extend(localizedFormat);

let lastMessageDate = null;

const ChatMessages = () => {
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { state } = useLocation();
  // const contacts = useSelector((state) => state.contact || {});
  const [contacts, setContacts] = useState([]);
  const chatState = useSelector((state) => state.chat || {});
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const adminId = localStorage.getItem("id");
  const socketRef = useRef(null);

  // Filter contacts if group is selected from GroupList
  const groupContactIds = state?.groupContactIds || [];

  const filteredContacts = contacts || [];

  useEffect(() => {
    socketRef.current = io(`${BASEURL}/wadaddy-namespace`, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log(
        "🌍 Connected to Wadaddy Global Namespace:",
        socketRef.current.id
      );
    });

    socketRef.current.on("connected_to_global", (data) => {
      console.log("✅ Server message:", data.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
    // socket.emit("join", adminId); // Join the admin room
  }, [dispatch]);

  // useEffect(() => {
  //   const handleNewMessage = (msg) => {
  //     console.log("📩 New message received:", msg);

  //     // If it's for the currently selected contact
  //     if (
  //       (msg.from === selectedContact?.phoneNumber &&
  //         msg.direction === "inbound") ||
  //       (msg.to === selectedContact?.phoneNumber &&
  //         msg.direction === "outbound")
  //     ) {
  //       const newMsg = {
  //         _id: msg._id || Math.random().toString(), // Use messageId for consistency
  //         from: msg.from,
  //         to: msg.to,
  //         text: msg.text,
  //         type: msg.type,
  //         direction: msg.direction,
  //         timestamp: new Date(msg.timestamp), // Ensure Date object
  //         status: msg.status || "RECEIVED",
  //         messageId: msg.messageId,
  //       };
  //       console.log("newMsg", newMsg);
  //       dispatch(appendMessage(newMsg));
  //       dispatch(getChatContacts());
  //     }
  //   };

  //   const handleStatusUpdate = ({ messageId, status, timestamp }) => {
  //     console.log("📬 Status update received:", {
  //       messageId,
  //       status,
  //       timestamp,
  //     });

  //     if (selectedContact) {
  //       dispatch(updateMessageStatus({ messageId, status, timestamp }));
  //       // dispatch({
  //       //   type: 'UPDATE_MESSAGE_STATUS',
  //       //   payload: {
  //       //     messageId,
  //       //     status,
  //       //     timestamp: new Date(timestamp),
  //       //   },
  //       // });
  //     }
  //   };

  //   socket.on("new-message", handleNewMessage);
  //   socket.on("message:status_update", handleStatusUpdate);

  //   return () => {
  //     socket.off("new-message", handleNewMessage);
  //     socket.off("message:status_update", handleStatusUpdate);
  //   };
  // }, [selectedContact, dispatch]);

  // Fetch contacts
  useEffect(() => {
    (async () => {
      const contectData = await dispatch(getChatContacts());
      setContacts(contectData?.data?.data);
    })();
  }, [dispatch]);

  // Set first contact as default
  useEffect(() => {
    if (filteredContacts.length > 0 && !selectedContact) {
      setSelectedContact(filteredContacts[0]);
    }
  }, [filteredContacts, selectedContact]);

  // Fetch message history for selected contact
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedContact?.phoneNumber) {
        setIsLoadingMessages(true);
        try {
          const historyData = await dispatch(getHistory(selectedContact.phoneNumber));
          // Map the response data to messages state
          const mappedMessages = (historyData?.messages || []).map((msg) => ({
            id: msg._id,
            text: msg.text,
            timestamp: new Date(msg.timestamp),
            isSent: msg.direction === "outbound",
            status: msg.status,
            type: msg.type,
          }));
          setMessages(mappedMessages);
        } finally {
          setIsLoadingMessages(false);
        }
      }
    };

    fetchMessages();
  }, [selectedContact, dispatch]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send text message
  const handleSendMessage = async () => {
    if (!selectedContact || !messageInput) {
      toast.warn("Please select a contact and enter a message.");
      return;
    }

    const payload = {
      to: selectedContact.phoneNumber,
      text: messageInput,
    };

    try {
      await dispatch(sendMessage(payload));
      setMessageInput("");
      // toast.success('Message sent successfully.');
      const contectData = await dispatch(getChatContacts()); // Update contact list for lastMessageTime
      setContacts(contectData?.data?.data);
      // Optionally refetch messages after send
      const historyData = await dispatch(getHistory(selectedContact.phoneNumber));
      const mappedMessages = (historyData?.messages || []).map((msg) => ({
        id: msg._id,
        text: msg.text,
        timestamp: new Date(msg.timestamp),
        isSent: msg.direction === "outbound",
        status: msg.status,
        type: msg.type,
      }));
      setMessages(mappedMessages);
    } catch (error) {
      toast.error("Failed to send message.");
    }
  };
  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };
  function formatLastMessageTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      date.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString(); // fallback to date string like 7/30/2025
  }

  const isWithin24Hours = () => {
    if (!selectedContact?.lastIncomingMessageTime) return false;

    const lastIncoming = dayjs(selectedContact.lastIncomingMessageTime);
    const now = dayjs();

    return now.diff(lastIncoming, "hour") <= 24;
  };

  // Map messages for rendering (now using local state)
  const renderMessages =
    messages.map((msg, index) => {
      const isOutbound =
        msg.direction === "outbound" || msg.isSent;
      const msgDate = dayjs(msg.timestamp).format(
        "DD MMM YYYY"
      );
      const showDateHeader = msgDate !== lastMessageDate;
      lastMessageDate = msgDate;

      const status = (msg.status || "").toLowerCase();

      return (
        <React.Fragment key={msg.id}>
          {showDateHeader && (
            <div
              className="text-center text-muted small mb-2"
              style={{
                marginTop: index === 0 ? 0 : "1rem",
              }}
            >
              {msgDate}
            </div>
          )}
          <div
            className={`p-3 rounded-3 mb-3 ${
              isOutbound
                ? "bg-light"
                : "bg-info bg-opacity-25"
            }`}
            style={{
              maxWidth: "50%",
              marginLeft: isOutbound ? "auto" : "0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div className="text-dark small">
              {msg.text}
            </div>
            <div className="d-flex align-items-center justify-content-end mt-1">
              <small className="text-muted me-2">
                {dayjs(msg.timestamp).format("hh:mm A")}
              </small>
              {isOutbound && (
                <>
                  {status === "failed" && (
                    <FiXCircle
                      size={16}
                      color="red"
                      title="Failed"
                    />
                  )}
                  {status === "sent" && (
                    <FiCheck
                      size={16}
                      color="gray"
                      title="Sent"
                    />
                  )}
                  {status === "delivered" && (
                    <FiCheckCircle
                      size={16}
                      color="gray"
                      title="Delivered"
                    />
                  )}
                  {status === "read" && (
                    <FiCheckCircle
                      size={16}
                      color="#34B7F1"
                      title="Read"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </React.Fragment>
      );
    });

  return (
    <>
      <Container fluid className="min-vh-100 bg-light pb-5 position-relative">
        <Pageheader
          mainheading="Chat"
          parentfolder="Home"
          activepage="Chat Messages"
        />
        <Row className="mt-5 row-sm">
          <Col md={12} lg={12} xl={12}>
            <Card className="custom-card transcation-crypto">
              <Card.Body className="p-0">
                <Row className="g-0">
                  {/* Left – Contact List */}
                  <Col
                    md={4}
                    className="border-end"
                    style={{
                      maxHeight: "calc(100vh - 200px)",
                      overflowY: "auto",
                    }}
                  >
                    <Card.Header className="border-bottom-0 bg-primary text-white p-3">
                      <Card.Title as="h5" className="mb-0">
                        Chats ({filteredContacts.length})
                      </Card.Title>
                    </Card.Header>
                    {!contacts ? (
                      <div className="p-4 text-center text-muted">
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Loading...
                      </div>
                    ) : filteredContacts.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        No contacts found.
                      </div>
                    ) : (
                      filteredContacts?.map((contact) => (
                        <div
                          key={contact._id}
                          className={`d-flex align-items-center p-3 border-bottom ${
                            selectedContact?._id === contact._id
                              ? "bg-primary bg-opacity-10"
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedContact(contact)}
                        >
                          <Image
                            src={`https://ui-avatars.com/api/?name=${
                              contact.fname || ""
                            }+${contact.lname || ""}&size=32&background=random`}
                            roundedCircle
                            width={32}
                            height={32}
                            alt={`${contact.fname || ""} ${
                              contact.lname || ""
                            }`}
                          />
                          <div className="ms-3 flex-grow-1">
                            <div
                              className={`fw-semibold ${
                                contact.newMessage
                                  ? "text-success"
                                  : "text-dark"
                              }`}
                            >
                              {contact.fname || ""} {contact.lname || ""}
                            </div>
                            <small className="text-muted">
                              {contact.phoneNumber || "N/A"}
                            </small>
                          </div>
                          <div className="text-end">
                            <small className="text-muted">
                              {formatLastMessageTime(contact?.lastMessageTime)}
                            </small>
                          </div>
                        </div>
                      ))
                    )}
                  </Col>

                  {/* Right – Chat Section */}
                  <Col md={8} className="d-flex flex-column">
                    <Card.Header className="border-bottom-0 bg-primary text-white p-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <Image
                            src={
                              selectedContact
                                ? `https://ui-avatars.com/api/?name=${
                                    selectedContact.fname || ""
                                  }+${
                                    selectedContact.lname || ""
                                  }&size=32&background=random`
                                : ""
                            }
                            roundedCircle
                            width={32}
                            height={32}
                            alt={
                              selectedContact
                                ? `${selectedContact.fname || ""} ${
                                    selectedContact.lname || ""
                                  }`
                                : "No Contact"
                            }
                          />
                          <div className="ms-3">
                            <div className="fw-semibold text-black">
                              {selectedContact
                                ? `${selectedContact.fname || ""} ${
                                    selectedContact.lname || ""
                                  }`
                                : "Select a Contact"}
                            </div>
                            <small className="text-black opacity-75">
                              {selectedContact?.phoneNumber || "N/A"}
                            </small>
                          </div>
                        </div>
                        <Button
                          variant="link"
                          className="p-0 text-white"
                          onClick={() => {
                            const refreshMessages = async () => {
                              if (selectedContact?.phoneNumber) {
                                setIsLoadingMessages(true);
                                try {
                                  const historyData = await dispatch(getHistory(selectedContact.phoneNumber));
                                  const mappedMessages = (historyData?.messages || []).map((msg) => ({
                                    id: msg._id,
                                    text: msg.text,
                                    timestamp: new Date(msg.timestamp),
                                    isSent: msg.direction === "outbound",
                                    status: msg.status,
                                    type: msg.type,
                                  }));
                                  setMessages(mappedMessages);
                                } finally {
                                  setIsLoadingMessages(false);
                                }
                              }
                            };
                            refreshMessages();
                          }}
                        >
                          <Repeat size={20} />
                        </Button>
                      </div>
                    </Card.Header>
                    <div
                      className="flex-grow-1 p-4"
                      style={{
                        maxHeight: "calc(100vh - 300px)",
                        overflowY: "auto",
                      }}
                    >
                      {selectedContact ? (
                        isLoadingMessages ? (
                          <div className="p-4 text-center text-muted">
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Loading messages...
                          </div>
                        ) : messages.length > 0 ? (
                          renderMessages
                        ) : (
                          <div className="p-4 text-center text-muted">
                            No messages found.
                          </div>
                        )
                      ) : (
                        <div className="p-4 text-center text-muted">
                          Select a contact to view messages.
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <Card.Footer className="border-top p-4">
                      {selectedContact && isWithin24Hours() ? (
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control
                            type="text"
                            placeholder="Type a message..."
                            className="custom-select-height"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoadingMessages}
                          />
                          <Button
                            variant="primary"
                            className="custom-btn custom-select-height px-3"
                            onClick={handleSendMessage}
                            disabled={isLoadingMessages}
                          >
                            <FaComment className="me-2" />
                            Send
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-muted small">
                          Your free 24-hour window is over.{" "}
                          <span className="text-success fw-semibold">
                            WhatsApp via your own personal number.
                          </span>
                        </div>
                      )}
                    </Card.Footer>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>{" "}
    </>
  );
};

export default ChatMessages;