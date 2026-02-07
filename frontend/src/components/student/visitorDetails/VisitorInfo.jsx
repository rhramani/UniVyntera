import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FlagIcon from "@mui/icons-material/Flag";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import usePermissions from "../../commonComponents/usePermissions";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { RiChatSmile2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { decryptData } from "../../../utils/encryptionUtils";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import ChatComponent from "../studentDetails/chat/ChatComponent";
import { getOneVisitorApplication } from "../../../redux/actions/Visitor/VisitorApplication.action";
import { countryCodeISO } from "../../../utils/countryISOCode";

const VisitorInfo = ({
  visitor,
  setShowVisitorInfoModal,
  visitorStatusOptions,
  selectedVisitorStatus,
  handleVisitorStatusChange,
  userRole,
  userType,
  showVisitorInfoModal,
  visitorInfoFormik,
  countries,
}) => {
  const dispatch = useDispatch();

  const [showChat, setShowChat] = useState(false);
  const [chatVisitor, setChatVisitor] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [showDOBCalendar, setShowDOBCalendar] = useState(false);
  const [dobValue, setDOBValue] = useState(null);
  const dobInputRef = useRef(null);

  const userId = decryptData(localStorage.getItem("userId"));

  const { canUpdate, canCreate } = usePermissions("Visitor Application");

  const fetchVisitorData = async (visitorId) => {
    try {
      const res = await dispatch(getOneVisitorApplication(visitorId));
      setStudentData(res?.data?.data || {});
    } catch (error) {
      console.error("Error fetching visitor data:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleChatOpen = (visitor) => {
    setChatVisitor(visitor);
    setShowChat(true);
    // setShowChatModal(true);
    fetchVisitorData(visitor._id);
  };

  const handleChatClose = () => {
    setShowChat(false);
    setChatVisitor(null);
  };

  // Helper for dd/mm/yyyy
  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return null;
  };

  return (
    <>
      <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4 mt-2 premium-student-card">
        <Card.Header className="form-main-heading p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <div
              className="avatar-initial rounded-circle bg-primary-transparent text-primary d-flex align-items-center justify-content-center fw-bold fs-4"
              style={{ width: "50px", height: "50px" }}
            >
              {visitor?.name?.charAt(0) || "V"}
            </div>
            <div>
              <h4 className="mb-0 fw-bold d-flex align-items-center text-primary gap-2">
                {visitor?.name}
                <span
                  className="badge text-white text-primary rounded-pill px-3 py-2 shadow-sm"
                  style={{ fontSize: "0.8rem", backgroundColor: "#6b63c3" }}
                >
                  {visitor?.visitorId}
                </span>
              </h4>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
            {userRole !== "Student" && userRole !== "LeadStudent" && (
              <div
                className="action-icon-btn text-primary"
                title="Chat with Visitor"
                onClick={() => handleChatOpen(visitor)}
              >
                <RiChatSmile2Fill
                  size={26}
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}

            {userRole !== "B2B Admin" &&
              userRole !== "B2B Member" &&
              userRole !== "Branch" &&
              userType !== "Branch User" && (
                <div className="status-select-wrapper">
                  <Select
                    options={visitorStatusOptions}
                    value={selectedVisitorStatus}
                    onChange={handleVisitorStatusChange}
                    placeholder="Select Status"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                        width: "150px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#64748b",
                        fontSize: "13px",
                      }),
                    }}
                  />
                </div>
              )}

            {(canUpdate || canCreate) && (
              <Button
                variant="primary"
                className="custom-select-height"
                onClick={() => setShowVisitorInfoModal(true)}
                style={{
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  height: "40px",
                }}
              >
                <EditIcon style={{ fontSize: "16px" }} className="me-1 mb-1" />{" "}
                Edit Profile
              </Button>
            )}
          </div>
        </Card.Header>

        <Card.Body className="p-4 bg-white">
          <Row className="g-4">
            <Col md={6} lg={4} xl={3}>
              <div className="detail-card">
                <div className="detail-icon-wrapper bg-orange-light text-orange">
                  <EmailIcon style={{ fontSize: "24px" }} />
                </div>
                <div className="detail-content">
                  <label>Email Address</label>
                  <div className="value text-truncate" title={visitor?.email}>
                    {visitor?.email || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div className="detail-card">
                <div className="detail-icon-wrapper bg-green-light text-green">
                  <PhoneIcon style={{ fontSize: "24px" }} />
                </div>
                <div className="detail-content">
                  <label>Mobile Number</label>
                  <div className="value">{visitor?.contact || "N/A"}</div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div className="detail-card">
                <div className="detail-icon-wrapper bg-pink-light text-pink">
                  <CakeIcon style={{ fontSize: "24px" }} />
                </div>
                <div className="detail-content">
                  <label>Date of Birth</label>
                  <div className="value">
                    {visitor?.DOB ? formatDate(parseDate(visitor.DOB)) : "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div className="detail-card">
                <div className="detail-icon-wrapper bg-blue-light text-primary">
                  <PublicIcon style={{ fontSize: "24px" }} />
                </div>
                <div className="detail-content">
                  <label>Citizenship</label>
                  <div className="value">{visitor?.country || "N/A"}</div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div className="detail-card">
                <div className="detail-icon-wrapper bg-gray-light text-secondary">
                  <LocationCityIcon style={{ fontSize: "24px" }} />
                </div>
                <div className="detail-content">
                  <label>Current City</label>
                  <div className="value">{visitor?.city || "N/A"}</div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div className="detail-card">
                <div className="detail-icon-wrapper bg-brown-light text-brown">
                  <FlagIcon style={{ fontSize: "24px" }} />
                </div>
                <div className="detail-content">
                  <label>Preferred Destination</label>
                  <div className="value text-truncate">
                    {visitor?.preferredCountry || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div className="detail-card">
                <div className="detail-icon-wrapper bg-purple-light text-purple">
                  <HomeIcon style={{ fontSize: "24px" }} />
                </div>
                <div className="detail-content">
                  <label>Address</label>
                  <div className="value text-truncate" title={visitor?.address}>
                    {visitor?.address || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div className="detail-card">
                <div className="detail-icon-wrapper bg-indigo-light text-indigo">
                  <BadgeIcon style={{ fontSize: "24px" }} />
                </div>
                <div className="detail-content">
                  <label>Passport Number</label>
                  <div className="value" title={visitor?.passportNumber}>
                    {visitor?.passportNumber || "N/A"}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>

        <style>{`
        .premium-student-card {
          border: 1px solid #f1f5f9 !important;
        }
        .bg-primary-transparent {
          background-color: rgba(108, 95, 252, 0.1) !important;
        }
        .bg-light-soft {
          background-color: #f8fafc;
        }
        .bg-blue-light { background-color: #eff6ff; }
        .bg-orange-light { background-color: #fff7ed; }
        .bg-green-light { background-color: #f0fdf4; }
        .bg-pink-light { background-color: #fdf2f8; }
        .bg-red-light { background-color: #fef2f2; }
        .bg-gray-light { background-color: #f1f5f9; }
        .bg-brown-light { background-color: #fefce8; }
        .bg-purple-light { background-color: #faf5ff; }
        .bg-indigo-light { background-color: #eef2ff; }
        
        .text-orange { color: #f97316; }
        .text-green { color: #22c55e; }
        .text-pink { color: #ec4899; }
        .text-brown { color: #854d0e; }
        .text-purple { color: #a855f7; }
        .text-indigo { color: #6366f1; }

        .action-icon-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-icon-btn:hover {
          transform: translateY(-2px);
          filter: brightness(0.95);
        }

        .border-dashed {
          border-style: dashed !important;
        }

        .detail-card {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-radius: 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          height: 100%;
          transition: all 0.2s;
        }
        .detail-card:hover {
          background-color: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          border-color: #cbd5e1;
        }
        .detail-icon-wrapper {
          width: 52px;
          height: 52px;
          min-width: 52px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .detail-content label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .detail-content .value {
          font-weight: 700;
          color: #1e293b;
          font-size: 14px;
          line-height: 1.2;
        }

        .custom-select-height {
          height: 40px;
        }
      `}</style>
      </Card>

      {showChat && chatVisitor && (
        <div className="studentApplicationChat">
          <div className="chat-card">
            <div style={{ padding: "3px" }}>
              <ChatComponent
                studentId={chatVisitor._id}
                senderId={userId}
                role={userRole}
                studentData={studentData}
                handleChatClose={handleChatClose}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        show={showVisitorInfoModal}
        onHide={() => {
          setShowVisitorInfoModal(false);
          visitorInfoFormik.resetForm();
        }}
        size="lg"
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Update Visitor Information</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowVisitorInfoModal(false);
              visitorInfoFormik.resetForm();
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={visitorInfoFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  className="custom-select-height"
                  placeholder="Enter Name"
                  value={visitorInfoFormik.values.name}
                  onChange={visitorInfoFormik.handleChange}
                  onBlur={visitorInfoFormik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  className="custom-select-height"
                  placeholder="Enter Email"
                  value={visitorInfoFormik.values.email}
                  onChange={visitorInfoFormik.handleChange}
                  onBlur={visitorInfoFormik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <PhoneInput
                  country={countryCodeISO()}
                  value={visitorInfoFormik.values.contact}
                  onChange={(contact, data) => {
                    const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                    const formattedPhone = `${dialCode} ${contact.replace(
                      data.dialCode,
                      "",
                    )}`.trim();

                    visitorInfoFormik.setFieldValue("contact", formattedPhone);
                  }}
                  onBlur={visitorInfoFormik.handleBlur}
                  inputProps={{
                    name: "contact",
                    required: true,
                    className: "form-control custom-select-height",
                  }}
                  inputStyle={{
                    width: "100%",
                    paddingLeft: "65px",
                    borderRadius: "4px",
                  }}
                  buttonStyle={{
                    marginRight: "10px",
                  }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    name="DOB"
                    className="custom-select-height"
                    placeholder="dd/mm/yyyy"
                    value={
                      visitorInfoFormik.values.DOB
                        ? formatDate(parseDate(visitorInfoFormik.values.DOB))
                        : ""
                    }
                    readOnly
                    ref={dobInputRef}
                    onClick={() => {
                      if (visitorInfoFormik.values.DOB) {
                        setDOBValue(parseDate(visitorInfoFormik.values.DOB));
                      }
                      setShowDOBCalendar((show) => !show);
                    }}
                    style={{ cursor: "pointer", backgroundColor: "#fff" }}
                  />
                  <MdCalendarToday
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                      pointerEvents: "none",
                    }}
                    size={20}
                  />
                  {showDOBCalendar && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        zIndex: 9999,
                        background: "#fff",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        borderRadius: "8px",
                        marginTop: "4px",
                        width: 300,
                        minWidth: 300,
                        maxWidth: 300,
                      }}
                    >
                      <Calendar
                        className="form-control m-0 p-0 border-0"
                        onChange={(selectedDate) => {
                          setDOBValue(selectedDate);
                          const formatted = formatDate(selectedDate);
                          visitorInfoFormik.setFieldValue("DOB", formatted);
                          setShowDOBCalendar(false);
                        }}
                        value={dobValue}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Country</Form.Label>
                <Select
                  className="custom-select-height"
                  options={countries?.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  value={
                    visitorInfoFormik.values.country
                      ? {
                          value: visitorInfoFormik.values.country,
                          label: visitorInfoFormik.values.country,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    visitorInfoFormik.setFieldValue(
                      "country",
                      selectedOption ? selectedOption.value : "",
                    );
                  }}
                  placeholder="Select Country"
                  isClearable
                  isSearchable
                  classNamePrefix="custom-select"
                  noOptionsMessage={() => "No countries available"}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "12px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  className="custom-select-height"
                  placeholder="Enter City"
                  value={visitorInfoFormik.values.city}
                  onChange={visitorInfoFormik.handleChange}
                  onBlur={visitorInfoFormik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  className="custom-select-height"
                  placeholder="Enter Address"
                  value={visitorInfoFormik.values.address}
                  onChange={visitorInfoFormik.handleChange}
                  onBlur={visitorInfoFormik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Passport Number</Form.Label>
                <Form.Control
                  type="text"
                  name="passportNumber"
                  className="custom-select-height"
                  placeholder="Enter Passport Number"
                  value={visitorInfoFormik.values.passportNumber}
                  onChange={visitorInfoFormik.handleChange}
                  onBlur={visitorInfoFormik.handleBlur}
                />
                {visitorInfoFormik.touched.passportNumber &&
                  visitorInfoFormik.errors.passportNumber && (
                    <div className="text-danger">
                      {visitorInfoFormik.errors.passportNumber}
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Preferred Country</Form.Label>
                <Select
                  className="custom-select-height"
                  options={countries?.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  value={
                    visitorInfoFormik.values?.preferredCountry
                      ? {
                          value: visitorInfoFormik.values.preferredCountry,
                          label: visitorInfoFormik.values.preferredCountry,
                        }
                      : ""
                  }
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions
                      ? [selectedOptions.value]
                      : [];
                    visitorInfoFormik.setFieldValue(
                      "preferredCountry",
                      selectedValues,
                    );
                  }}
                  placeholder="Select Country"
                  isClearable
                  isSearchable
                  classNamePrefix="custom-select"
                  noOptionsMessage={() => "No countries available"}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "12px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                />
              </Col>
            </Row>
            <div className="text-end mt-3">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
              >
                Update Visitor Information
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VisitorInfo;
