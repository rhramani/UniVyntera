import { useState, useMemo, useRef, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import Calendar from "react-calendar";
import { MdCalendarToday } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";

const PersonalDetailsFollowupValidationSchema = Yup.object({
  nextFollowUpDate: Yup.string(),
  status: Yup.string(),
  remarks: Yup.string(),
});

const DocumentDetailsFollowupValidationSchema = Yup.object({
  nextFollowUpDate: Yup.string(),
  status: Yup.string(),
  remarks: Yup.string(),
});

const CourseSelectionFollowupValidationSchema = Yup.object({
  nextFollowUpDate: Yup.string(),
  status: Yup.string(),
  remarks: Yup.string(),
});

const VisaApplicationFollowupValidationSchema = Yup.object({
  nextFollowUpDate: Yup.string(),
  status: Yup.string(),
  remarks: Yup.string(),
});

const FollowUpModal = ({ 
  show, 
  formatDate, 
  parseDate, 
  oneStudentData, 
  setShowFollowUpModal, 
  fetchOneStudentDetails,
  id,
  toISODate,
  activeTab 
}) => {
  const [showPersonalCalendar, setShowPersonalCalendar] = useState(false);
  const [showDocumentCalendar, setShowDocumentCalendar] = useState(false);
  const [showCourseCalendar, setShowCourseCalendar] = useState(false);
  const [showVisaCalendar, setShowVisaCalendar] = useState(false);
  const [personalDetailsCalendar, setPersonalDetailsCalendar] = useState(false);
  const personalDetailsRef = useRef(null);
  const [documentCalendar, setDocumentCalendar] = useState(false);
  const documentRef = useRef(null);
  const [courseSelectionCalendar, setCourseSelectionCalendar] = useState(false);
  const courseSelectionRef = useRef(null);
  const [visaApplicationCalendar, setVisaApplicationCalendar] = useState(false);
  const visaApplicationRef = useRef(null);
  const [activeTabForModal, setActiveTabForModal] = useState(null);
  const dispatch = useDispatch();

  // Set active tab when modal opens
  useEffect(() => {
    if (show && activeTab) {
      setActiveTabForModal(activeTab);
    }
  }, [show, activeTab]);
  const personalDetailsFollowupFormik = useFormik({
    initialValues: {
      nextFollowUpDate: oneStudentData?.followUps?.personalDetails
        ?.nextFollowUpDate
        ? formatDate(
            parseDate(oneStudentData.followUps.personalDetails.nextFollowUpDate)
          )
        : "",
      status: oneStudentData?.followUps?.personalDetails?.status || "Pending",
      remarks: oneStudentData?.followUps?.personalDetails?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: PersonalDetailsFollowupValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const parsedDate = parseDate(values.nextFollowUpDate);
      const formattedDate = parsedDate ? toISODate(parsedDate) : "";
      const payload = {
        followUps: {
          personalDetails: {
            nextFollowUpDate: formattedDate,
            remarks: values.remarks,
            status: values.status,
          },
        },
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Follow-up updated successfully");
        fetchOneStudentDetails();
      }
    },
  });

  const documentsFollowupFormik = useFormik({
    initialValues: {
      nextFollowUpDate: oneStudentData?.followUps?.documentDetails
        ?.nextFollowUpDate
        ? formatDate(
            parseDate(oneStudentData.followUps.documentDetails.nextFollowUpDate)
          )
        : "",
      status: oneStudentData?.followUps?.documentDetails?.status || "Pending",
      remarks: oneStudentData?.followUps?.documentDetails?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: DocumentDetailsFollowupValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const parsedDate = parseDate(values.nextFollowUpDate);
      const formattedDate = parsedDate ? toISODate(parsedDate) : "";
      const payload = {
        followUps: {
          documentDetails: {
            nextFollowUpDate: formattedDate,
            remarks: values.remarks,
            status: values.status,
          },
        },
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Follow-up updated successfully");
        fetchOneStudentDetails();
      }
    },
  });

  const courseSelectionFollowupFormik = useFormik({
    initialValues: {
      nextFollowUpDate: oneStudentData?.followUps?.interestedCourse
        ?.nextFollowUpDate
        ? formatDate(
            parseDate(
              oneStudentData.followUps.interestedCourse.nextFollowUpDate
            )
          )
        : "",
      status: oneStudentData?.followUps?.interestedCourse?.status || "Pending",
      remarks: oneStudentData?.followUps?.interestedCourse?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: CourseSelectionFollowupValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const parsedDate = parseDate(values.nextFollowUpDate);
      const formattedDate = parsedDate ? toISODate(parsedDate) : "";
      const payload = {
        followUps: {
          interestedCourse: {
            nextFollowUpDate: formattedDate,
            remarks: values.remarks,
            status: values.status,
          },
        },
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Follow-up updated successfully");
        fetchOneStudentDetails();
      }
    },
  });

  const visaApplicationFollowupFormik = useFormik({
    initialValues: {
      nextFollowUpDate: oneStudentData?.followUps?.visaApplication
        ?.nextFollowUpDate
        ? formatDate(
            parseDate(oneStudentData.followUps.visaApplication.nextFollowUpDate)
          )
        : "",
      status: oneStudentData?.followUps?.visaApplication?.status || "Pending",
      remarks: oneStudentData?.followUps?.visaApplication?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: VisaApplicationFollowupValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const parsedDate = parseDate(values.nextFollowUpDate);
      const formattedDate = parsedDate ? toISODate(parsedDate) : "";
      const payload = {
        followUps: {
          visaApplication: {
            nextFollowUpDate: formattedDate,
            remarks: values.remarks,
            status: values.status,
          },
        },
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Follow-up updated successfully");
        fetchOneStudentDetails();
      }
    },
  });
  const handleModalClose = () => {
    setShowFollowUpModal(false);
    setPersonalDetailsCalendar(false);
    setDocumentCalendar(false);
    setCourseSelectionCalendar(false);
    setVisaApplicationCalendar(false);
  };

  const getFormikForTab = () => {
    switch (activeTabForModal) {
      case "personal":
        return personalDetailsFollowupFormik;
      case "document":
        return documentsFollowupFormik;
      case "courseSelection":
        return courseSelectionFollowupFormik;
      case "visaApplication":
        return visaApplicationFollowupFormik;
      default:
        return null;
    }
  };

  const handleDateChange = (selectedDate) => {
    const formatted = formatDate(selectedDate);
    if (activeTabForModal === "personal") {
      personalDetailsFollowupFormik.setFieldValue(
        "nextFollowUpDate",
        formatted
      );
      setShowPersonalCalendar(false);
    } else if (activeTabForModal === "document") {
      documentsFollowupFormik.setFieldValue("nextFollowUpDate", formatted);
      setShowDocumentCalendar(false);
    } else if (activeTabForModal === "courseSelection") {
      courseSelectionFollowupFormik.setFieldValue(
        "nextFollowUpDate",
        formatted
      );
      setShowCourseCalendar(false);
    } else if (activeTabForModal === "visaApplication") {
      visaApplicationFollowupFormik.setFieldValue(
        "nextFollowUpDate",
        formatted
      );
      setShowVisaCalendar(false);
    }
  };

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Closed", label: "Closed" },
  ];

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>
          Follow Up -{" "}
          <span className=" text-capitalize">
            {activeTabForModal?.replace(/([A-Z])/g, " $1").trim()}
          </span>
        </Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={handleModalClose}
        />
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const formik = getFormikForTab();
            if (formik) formik.handleSubmit(e);
            handleModalClose();
          }}
        >
          <div className="p-3">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group controlId="followUpDate">
                  <Form.Label>Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      className="form-control custom-select-height"
                      name="nextFollowUpDate"
                      placeholder="dd/mm/yyyy"
                      value={
                        getFormikForTab()?.values?.nextFollowUpDate
                          ? formatDate(
                              parseDate(getFormikForTab().values.nextFollowUpDate)
                            )
                          : ""
                      }
                      readOnly
                      onClick={(e) => {
                        e.preventDefault();
                        if (activeTabForModal === "personal")
                          setShowPersonalCalendar(true);
                        else if (activeTabForModal === "document")
                          setShowDocumentCalendar(true);
                        else if (activeTabForModal === "courseSelection")
                          setShowCourseCalendar(true);
                        else if (activeTabForModal === "visaApplication")
                          setShowVisaCalendar(true);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        paddingRight: "40px",
                      }}
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
                    {(showPersonalCalendar ||
                      showDocumentCalendar ||
                      showCourseCalendar ||
                      showVisaCalendar) && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 10000,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: 350,
                        }}
                      >
                        <Calendar
                          className="form-control border-0"
                          onChange={(d) => handleDateChange(d)}
                          value={
                            parseDate(
                              getFormikForTab()?.values?.nextFollowUpDate
                            ) || null
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="followUpStatus">
                  <Form.Label>Status</Form.Label>
                  <Select
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "8px",
                        borderColor: "#ced4da",
                        boxShadow: "none",
                        "&:hover": { borderColor: "#adb5bd" },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#888",
                        fontSize: "14px",
                      }),
                    }}
                    classNamePrefix="custom-select"
                    options={statusOptions}
                    value={
                      getFormikForTab()?.values?.status
                        ? {
                            value: getFormikForTab().values.status,
                            label: getFormikForTab().values.status,
                          }
                        : null
                    }
                    onChange={(option) => {
                      getFormikForTab()?.setFieldValue(
                        "status",
                        option ? option.value : ""
                      );
                    }}
                    placeholder="Select Status"
                    isClearable
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="followUpRemark">
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control filter-height"
                    placeholder="Enter remark"
                    name="remarks"
                    value={getFormikForTab()?.values?.remarks || ""}
                    onChange={getFormikForTab()?.handleChange}
                    onBlur={getFormikForTab()?.handleBlur}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={handleModalClose}
          className="custom-select-height"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            const formik = getFormikForTab();
            formik?.handleSubmit();
            handleModalClose();
          }}
          className="custom-select-height"
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FollowUpModal;
