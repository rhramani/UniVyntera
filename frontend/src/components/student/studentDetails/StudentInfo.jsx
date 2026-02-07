import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake"; // For DOB
import PublicIcon from "@mui/icons-material/Public"; // For Country
import LocationCityIcon from "@mui/icons-material/LocationCity"; // For City
import FlagIcon from "@mui/icons-material/Flag"; // For Preferred Country
import HomeIcon from "@mui/icons-material/Home"; // For Address
import BadgeIcon from "@mui/icons-material/Badge"; // For Passport Number
import usePermissions from "../../commonComponents/usePermissions";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { RiChatSmile2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import ChatComponent from "./chat/ChatComponent";
import {
  getOneStudentApplication,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { decryptData } from "../../../utils/encryptionUtils";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { countryCodeISO } from "../../../utils/countryISOCode";
import { BASEURL } from "../../../baseUrl";

const StudentInfo = ({
  student,
  setShowStudentInfoModal,
  studentStatusOptions,
  selectedStudentStatus,
  handleStudentStatusChange,
  userRole,
  userType,
  showStudentInfoModal,
  studentInfoFormik,
  countries,
  oneStudentData,
  fetchOneStudentDetails,
  customStyles,
}) => {
  const dispatch = useDispatch();

  const [showChat, setShowChat] = useState(false);
  const [chatStudent, setChatStudent] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [showDOBCalendar, setShowDOBCalendar] = useState(false);
  const [dobValue, setDOBValue] = useState(null);
  const dobInputRef = useRef(null);

  const userId = decryptData(localStorage.getItem("userId"));

  const { canUpdate, canCreate } = usePermissions("Student Applications");

  const studentAgreementRef = useRef(null);
  const agencyAgreementRef = useRef(null);

  const fetchStudentData = async (studentId) => {
    try {
      const res = await dispatch(getOneStudentApplication(studentId));
      setStudentData(res?.data?.data || {});
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
    }
  };

  const handleChatOpen = (student) => {
    setChatStudent(student);
    setShowChat(true);
    // setShowChatModal(true);
    fetchStudentData(student._id);
  };

  const handleChatClose = () => {
    setShowChat(false);
    setChatStudent(null);
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

  const handleAgreementUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();

    if (type === "agreementByStudent") {
      formData.append("agreementByStudent", file);
    }

    if (type === "agreementByAgency") {
      formData.append("agreementByAgency", file);
    }

    try {
      const res = await dispatch(
        updateStudentApplication(formData, student._id),
      );

      if (res?.status === 200) {
        toast.success("Document uploaded successfully");

        if (type === "agreementByStudent" && studentAgreementRef.current) {
          studentAgreementRef.current.value = "";
        }

        if (type === "agreementByAgency" && agencyAgreementRef.current) {
          agencyAgreementRef.current.value = "";
        }

        await fetchOneStudentDetails();
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const downloadFile = async (filePath) => {
    try {
      const response = await fetch(`${BASEURL}/${filePath}`, {
        method: "GET",
      });

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filePath.split("/").pop(); // filename
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document");
    }
  };

  return (
    <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4 mt-2 premium-student-card">
      <Card.Header className="form-main-heading p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <div
            className="avatar-initial rounded-circle bg-primary-transparent text-primary d-flex align-items-center justify-content-center fw-bold fs-4"
            style={{ width: "50px", height: "50px" }}
          >
            {student?.name?.charAt(0) || "S"}
          </div>
          <div>
            <h4 className="mb-0 fw-bold d-flex align-items-center text-primary gap-2">
              {student?.name}
              <span
                className="badge text-white text-primary rounded-pill px-3 py-2 shadow-sm"
                style={{ fontSize: "0.8rem", backgroundColor: "#6b63c3" }}
              >
                {student?.studentId}
              </span>
            </h4>
            {student?.interestedCourseDetails?.length === 0 && (
              <div className="text-danger">
                Please select a course from the Course Selection tab to proceed.
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
          {userRole !== "Student" && userRole !== "LeadStudent" && (
            <div
              className="action-icon-btn  text-primary"
              title="Chat with Student"
              onClick={() => handleChatOpen(student)}
            >
              <RiChatSmile2Fill size={26} style={{
                color: "#007bff",
                cursor: "pointer",
              }} />
            </div>
          )}

          {userRole !== "B2B Admin" &&
            userRole !== "B2B Member" &&
            userRole !== "Branch" &&
            userType !== "Branch User" &&
            userRole !== "Student" &&
            userRole !== "LeadStudent" && (
              <div className="status-select-wrapper">
                <Select
                  options={studentStatusOptions}
                  value={selectedStudentStatus}
                  onChange={handleStudentStatusChange}
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
              onClick={() => setShowStudentInfoModal(true)}
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
                <div className="value text-truncate" title={student?.email}>
                  {student?.email || "N/A"}
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
                <div className="value">{student?.contact || "N/A"}</div>
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
                  {student?.DOB ? formatDate(parseDate(student.DOB)) : "N/A"}
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
                <div className="value">{student?.country || "N/A"}</div>
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
                <div className="value">{student?.city || "N/A"}</div>
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
                  {student?.purposeDetails?.preferredCountry?.join(", ") ||
                    "N/A"}
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
                <label>Residential Address</label>
                <div className="value text-truncate" title={student?.address}>
                  {student?.address || "N/A"}
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
                <div className="value">{student?.passportNumber || "N/A"}</div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-4 pt-2">
          <Row className="g-4">
            <Col md={6}>
              <div className="agreement-upload-box p-3 rounded-4 border bg-white shadow-xs">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="icon-sm bg-light rounded text-primary">
                      <MdCalendarToday size={16} />
                    </div>
                    <span className="fw-bold text-dark">
                      Agreement By Agency
                    </span>
                  </div>
                  {student?.agreementByAgency && (
                    <span
                      className="download-badge"
                      onClick={() => downloadFile(student.agreementByAgency)}
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </span>
                  )}
                </div>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="modern-file-input"
                  ref={agencyAgreementRef}
                  onChange={(e) =>
                    handleAgreementUpload(e, "agreementByAgency")
                  }
                  disabled={
                    userRole === "Student" || userRole === "LeadStudent"
                  }
                />
              </div>
            </Col>

            <Col md={6}>
              <div className="agreement-upload-box p-3 rounded-4 border bg-white shadow-xs">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="icon-sm bg-light rounded text-primary">
                      <MdCalendarToday size={16} />
                    </div>
                    <span className="fw-bold text-dark">
                      Agreement By Student
                    </span>
                  </div>
                  {student?.agreementByStudent && (
                    <span
                      className="download-badge"
                      onClick={() => downloadFile(student.agreementByStudent)}
                    >
                      <i className="bi bi-download me-1"></i> Download
                    </span>
                  )}
                </div>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="modern-file-input"
                  ref={studentAgreementRef}
                  onChange={(e) =>
                    handleAgreementUpload(e, "agreementByStudent")
                  }
                />
              </div>
            </Col>
          </Row>
        </div>
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

        .agreement-upload-box {
          transition: all 0.3s;
        }
        .agreement-upload-box:hover {
          border-color: #6c5ffc !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        }
        .icon-sm {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .download-badge {
          font-size: 11px;
          font-weight: 700;
          color: #6c5ffc;
          background: rgba(108, 95, 252, 0.1);
          padding: 4px 10px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .download-badge:hover {
          background: #6c5ffc;
          color: white;
        }
        .modern-file-input {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12px;
          padding: 6px 12px;
          background: #f8fafc;
        }
        .modern-file-input::file-selector-button {
          background: #e2e8f0;
          border: none;
          border-radius: 4px;
          padding: 2px 8px;
          margin-right: 10px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      {showChat && chatStudent && (
        <div className="studentApplicationChat">
          <div className="chat-card">
            <div style={{ padding: "3px" }}>
              <ChatComponent
                studentId={chatStudent._id}
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
        show={showStudentInfoModal}
        onHide={() => {
          setShowStudentInfoModal(false);
          studentInfoFormik.resetForm();
        }}
        size="lg"
        centered
        className="premium-modal"
      >
        <Modal.Header className="form-main-heading p-4">
          <Modal.Title className="fw-bold text-white">
            Update Student Information
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowStudentInfoModal(false);
              studentInfoFormik.resetForm();
            }}
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={studentInfoFormik.handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="fw-semibold">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  className="custom-select-height rounded-3"
                  placeholder="Enter Name"
                  value={studentInfoFormik.values.name}
                  onChange={studentInfoFormik.handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  className="custom-select-height rounded-3"
                  placeholder="Enter Email"
                  value={studentInfoFormik.values.email}
                  onChange={studentInfoFormik.handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Mobile Number</Form.Label>
                <PhoneInput
                  country={countryCodeISO()}
                  value={studentInfoFormik.values.contact}
                  onChange={(contact, data) => {
                    const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                    const formattedPhone = `${dialCode} ${contact.replace(
                      data.dialCode,
                      "",
                    )}`.trim();

                    studentInfoFormik.setFieldValue("contact", formattedPhone);
                  }}
                  inputProps={{
                    name: "contact",
                    required: true,
                    className: "form-control custom-select-height rounded-3",
                  }}
                  inputStyle={{ width: "100%", paddingLeft: "65px" }}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    className="custom-select-height rounded-3 cursor-pointer bg-white"
                    placeholder="dd/mm/yyyy"
                    value={
                      studentInfoFormik.values.DOB
                        ? formatDate(parseDate(studentInfoFormik.values.DOB))
                        : ""
                    }
                    readOnly
                    onClick={() => setShowDOBCalendar(!showDOBCalendar)}
                  />
                  <MdCalendarToday className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
                  {showDOBCalendar && (
                    <div
                      className="position-absolute z-index-modal top-100 start-0 mt-1 shadow-lg bg-white rounded-3 overflow-hidden"
                      style={{ width: "300px" }}
                    >
                      <Calendar
                        onChange={(d) => {
                          studentInfoFormik.setFieldValue("DOB", formatDate(d));
                          setShowDOBCalendar(false);
                        }}
                        value={parseDate(studentInfoFormik.values.DOB)}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Country</Form.Label>
                <Select
                  options={countries?.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  value={
                    studentInfoFormik.values.country
                      ? {
                          value: studentInfoFormik.values.country,
                          label: studentInfoFormik.values.country,
                        }
                      : null
                  }
                  onChange={(opt) =>
                    studentInfoFormik.setFieldValue("country", opt?.value || "")
                  }
                  styles={{
                    control: (b) => ({
                      ...b,
                      borderRadius: "10px",
                      minHeight: "45px",
                    }),
                  }}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  className="custom-select-height rounded-3"
                  placeholder="Enter City"
                  value={studentInfoFormik.values.city}
                  onChange={studentInfoFormik.handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Passport Number</Form.Label>
                <Form.Control
                  type="text"
                  name="passportNumber"
                  className="custom-select-height rounded-3"
                  placeholder="Enter Passport Number"
                  value={studentInfoFormik.values.passportNumber}
                  onChange={studentInfoFormik.handleChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">
                  Preferred Country
                </Form.Label>
                <Select
                  isMulti
                  options={countries?.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  value={
                    studentInfoFormik.values.purposeDetails?.preferredCountry?.map(
                      (c) => ({ value: c, label: c }),
                    ) || []
                  }
                  onChange={(opts) =>
                    studentInfoFormik.setFieldValue(
                      "purposeDetails.preferredCountry",
                      opts?.map((o) => o.value) || [],
                    )
                  }
                  styles={{
                    control: (b) => ({
                      ...b,
                      borderRadius: "10px",
                      minHeight: "45px",
                    }),
                  }}
                />
              </Col>
              <Col md={12}>
                <Form.Label className="fw-semibold">
                  Residential Address
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  className="rounded-3"
                  placeholder="Enter Address"
                  value={studentInfoFormik.values.address}
                  onChange={studentInfoFormik.handleChange}
                />
              </Col>
            </Row>
            <div className="text-end mt-4">
              <Button
                variant="primary"
                className="rounded-pill px-5 fw-bold shadow-sm"
                type="submit"
              >
                Update Profile
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default StudentInfo;
