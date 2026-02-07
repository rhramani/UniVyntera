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
    <div className="my-4 student-info-container">
      <Row>
        <div className="d-flex justify-content-between mb-3">
          <h3 className="text-primary">{`${student?.name} (${student?.studentId})`}</h3>
          <div className="d-flex align-items-center gap-3">
            {student?.interestedCourseDetails?.length === 0 && (
              <div className="text-danger">
                Please select a course from the Course Selection tab to proceed.
              </div>
            )}
            {userRole !== "Student" && userRole !== "LeadStudent" && (
              <RiChatSmile2Fill
                size={26}
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                }}
                onClick={() => handleChatOpen(student)}
                // onClick={() =>
                //   navigate(`/student-chat/${item._id}`)
                // }
              />
            )}
            {userRole !== "B2B Admin" &&
              userRole !== "B2B Member" &&
              userRole !== "Branch" &&
              userType !== "Branch User" &&
              userRole !== "Student" &&
              userRole !== "LeadStudent" && (
                <div className="d-flex justify-content-end">
                  <Select
                    options={studentStatusOptions}
                    value={selectedStudentStatus}
                    onChange={handleStudentStatusChange}
                    placeholder="Select Status"
                    // classNamePrefix="custom-select"
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
                onClick={() => setShowStudentInfoModal(true)}
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
            {student.name || "N/A"}
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
            {student.email || "N/A"}
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
            {student.contact || "N/A"}
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
            {formatDate(parseDate(student.DOB))}
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
            {student.country || "N/A"}
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
            {student.city || "N/A"}
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
            {student.purposeDetails?.preferredCountry?.join(", ") || "N/A"}
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
            {student.address || "N/A"}
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
            {student.passportNumber || "N/A"}
          </p>
        </Col>
      </Row>
      <Row>
        {/* ============ Agreement By Agency ============ */}
        <Col md={student?.agreementByAgency ? 4 : 6} className="mb-3">
          <Form.Label>Agreement By Agency</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="custom-select-height"
            ref={agencyAgreementRef}
            onChange={(e) => handleAgreementUpload(e, "agreementByAgency")}
            disabled={userRole === "Student" || userRole === "LeadStudent"}
          />
        </Col>

        {student?.agreementByAgency && (
          <Col md={2} className="mb-3 d-flex align-items-end">
            <Button
              variant="primary"
              className="custom-select-height"
              onClick={() => downloadFile(student.agreementByAgency)}
            >
              Download
            </Button>
          </Col>
        )}

        {/* ============ Agreement By Student ============ */}
        <Col md={student?.agreementByStudent ? 4 : 6} className="mb-3">
          <Form.Label>Agreement By Student</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="custom-select-height"
            ref={studentAgreementRef}
            onChange={(e) => handleAgreementUpload(e, "agreementByStudent")}
          />
        </Col>

        {student?.agreementByStudent && (
          <Col md={2} className="mb-3 d-flex align-items-end">
            <Button
              variant="primary"
              className="custom-select-height"
              onClick={() => downloadFile(student.agreementByStudent)}
            >
              Download
            </Button>
          </Col>
        )}
      </Row>

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
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Update Student Information</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowStudentInfoModal(false);
              studentInfoFormik.resetForm();
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={studentInfoFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  className="custom-select-height"
                  placeholder="Enter Name"
                  value={studentInfoFormik.values.name}
                  onChange={studentInfoFormik.handleChange}
                  onBlur={studentInfoFormik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  className="custom-select-height"
                  placeholder="Enter Email"
                  value={studentInfoFormik.values.email}
                  onChange={studentInfoFormik.handleChange}
                  onBlur={studentInfoFormik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
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
                  onBlur={studentInfoFormik.handleBlur}
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
                      studentInfoFormik.values.DOB
                        ? formatDate(parseDate(studentInfoFormik.values.DOB))
                        : ""
                    }
                    readOnly
                    ref={dobInputRef}
                    onClick={() => {
                      if (studentInfoFormik.values.DOB) {
                        setDOBValue(parseDate(studentInfoFormik.values.DOB));
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
                          studentInfoFormik.setFieldValue("DOB", formatted);
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
                    studentInfoFormik.values.country
                      ? {
                          value: studentInfoFormik.values.country,
                          label: studentInfoFormik.values.country,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    studentInfoFormik.setFieldValue(
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
                  value={studentInfoFormik.values.city}
                  onChange={studentInfoFormik.handleChange}
                  onBlur={studentInfoFormik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  className="custom-select-height"
                  placeholder="Enter Address"
                  value={studentInfoFormik.values.address}
                  onChange={studentInfoFormik.handleChange}
                  onBlur={studentInfoFormik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Passport Number</Form.Label>
                <Form.Control
                  type="text"
                  name="passportNumber"
                  className="custom-select-height"
                  placeholder="Enter Passport Number"
                  value={studentInfoFormik.values.passportNumber}
                  onChange={studentInfoFormik.handleChange}
                  onBlur={studentInfoFormik.handleBlur}
                />
                {studentInfoFormik.touched.passportNumber &&
                  studentInfoFormik.errors.passportNumber && (
                    <div className="text-danger">
                      {studentInfoFormik.errors.passportNumber}
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
                    studentInfoFormik.values.purposeDetails?.preferredCountry
                      ?.length > 0
                      ? studentInfoFormik.values.purposeDetails?.preferredCountry.map(
                          (country) => ({
                            value: country,
                            label: country,
                          }),
                        )
                      : []
                  }
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions
                      ? [selectedOptions.value]
                      : [];
                    studentInfoFormik.setFieldValue(
                      "purposeDetails.preferredCountry",
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
                Update Student Information
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentInfo;
