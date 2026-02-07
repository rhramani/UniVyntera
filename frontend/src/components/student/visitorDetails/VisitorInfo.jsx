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
    <div className="my-4 student-info-container">
      <Row>
        <div className="d-flex justify-content-between mb-3">
          <h3 className="text-primary">{`${visitor?.name} (${visitor?.visitorId})`}</h3>
          <div className="d-flex align-items-center gap-3">
            <RiChatSmile2Fill
              size={26}
              style={{
                color: "#007bff",
                cursor: "pointer",
              }}
              onClick={() => handleChatOpen(visitor)}
              // onClick={() =>
              //   navigate(`/student-chat/${item._id}`)
              // }
            />
            {userRole !== "B2B Admin" &&
              userRole !== "B2B Member" &&
              userRole !== "Branch" &&
              userType !== "Branch User" && (
                <div className="d-flex justify-content-end">
                  <Select
                    options={visitorStatusOptions}
                    value={selectedVisitorStatus}
                    onChange={handleVisitorStatusChange}
                    placeholder="Select Status"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                        width: "150px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
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
              >
                <EditIcon style={{ fontSize: "16px" }} /> Edit Profile
              </Button>
            )}
          </div>
        </div>
        {/* <Col md={4}>
           <p className="student-info-item d-flex text-gray-6">
             <BadgeIcon
               className="me-2 fixed-icon"
               style={{ color: "#0288D1", fontSize: "20px" }}
             />
             <strong className="info-label">Name</strong>
             <strong>&nbsp;:&nbsp;</strong>
             {visitor.name || "N/A"}
           </p>
         </Col> */}
        <Col md={4}>
          <p className="student-info-item d-flex text-gray-6">
            <EmailIcon
              className="me-2 fixed-icon"
              style={{ color: "#FB8C00", fontSize: "20px" }}
            />
            <strong className="info-label">Email</strong>
            <strong>&nbsp;:&nbsp;</strong>
            {visitor?.email || "N/A"}
          </p>
        </Col>
        <Col md={4}>
          <p className="student-info-item d-flex text-gray-6">
            <PhoneIcon
              className="me-2 fixed-icon"
              style={{ color: "#34A853", fontSize: "20px" }}
            />
            <strong className="info-label">Mobile Number</strong>
            <strong>&nbsp;:&nbsp;</strong>
            {visitor?.contact || "N/A"}
          </p>
        </Col>
        <Col md={4}>
          <p className="student-info-item d-flex text-gray-6">
            <CakeIcon
              className="me-2 fixed-icon"
              style={{ color: "#FB8C00", fontSize: "20px" }}
            />
            <strong className="info-label">DOB</strong>
            <strong>&nbsp;:&nbsp;</strong>
            {formatDate(parseDate(visitor.DOB))}
          </p>
        </Col>
        <Col md={4}>
          <p className="student-info-item d-flex text-gray-6">
            <PublicIcon
              className="me-2 fixed-icon"
              style={{ color: "#EA4335", fontSize: "20px" }}
            />
            <strong className="info-label">Country</strong>
            <strong>&nbsp;:&nbsp;</strong>
            {visitor?.country || "N/A"}
          </p>
        </Col>
        <Col md={4}>
          <p className="student-info-item d-flex text-gray-6">
            <LocationCityIcon
              className="me-2 fixed-icon"
              style={{ color: "#6C757D", fontSize: "20px" }}
            />
            <strong className="info-label">City</strong>
            <strong>&nbsp;:&nbsp;</strong>
            {visitor?.city || "N/A"}
          </p>
        </Col>
        <Col md={4}>
          <p className="student-info-item d-flex text-gray-6">
            <FlagIcon
              className="me-2 fixed-icon"
              style={{ color: "#6D4C41", fontSize: "20px" }}
            />
            <strong className="info-label">Preferred Country</strong>
            <strong>&nbsp;:&nbsp;</strong>
            {visitor?.preferredCountry || "N/A"}
          </p>
        </Col>
        <Col md={4}>
          <p className="student-info-item d-flex text-gray-6">
            <HomeIcon
              className="me-2 fixed-icon"
              style={{ color: "#5E35B1", fontSize: "20px" }}
            />
            <strong className="info-label">Address</strong>
            <strong>&nbsp;:&nbsp;</strong>
            {visitor?.address || "N/A"}
          </p>
        </Col>
        <Col md={4}>
          <p className="student-info-item d-flex text-gray-6">
            <BadgeIcon
              className="me-2 fixed-icon"
              style={{ color: "#2A48A0", fontSize: "20px" }}
            />
            <strong className="info-label">Passport Number</strong>
            <strong>&nbsp;:&nbsp;</strong>
            {visitor?.passportNumber || "N/A"}
          </p>
        </Col>
      </Row>
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
    </div>
  );
};

export default VisitorInfo;
