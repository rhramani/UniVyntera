import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  updateStudentApplication,
  getOneStudentApplication,
  deleteStudentApplication,
  downloadDocument,
  pendingDocMail,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";

const formatDisplayDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatPayloadDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const formatDisplayDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatPayloadDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}/${month}/${day}`;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date && !isNaN(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  return isNaN(parsed) ? null : parsed;
};

const AusMedicalExamination = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showAppointmentDateCalendar, setShowAppointmentDateCalendar] =
    useState(false);
  const [showReportIssueDateCalendar, setShowReportIssueDateCalendar] =
    useState(false);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const appointmentDateRef = useRef(null);
  const reportIssueDateRef = useRef(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Medical Report"];

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      toast.error("Failed to fetch application data.");
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appointmentDateRef.current &&
        !appointmentDateRef.current.contains(event.target)
      ) {
        setShowAppointmentDateCalendar(false);
      }
      if (
        reportIssueDateRef.current &&
        !reportIssueDateRef.current.contains(event.target)
      ) {
        setShowReportIssueDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formik = useFormik({
    initialValues: {
      hospitalName: "",
      appointmentDateTime: "",
      location: "",
      reportIssueDate: "",
      reportUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      hospitalName: Yup.string(),
      appointmentDateTime: Yup.string(),
      location: Yup.string(),
      reportIssueDate: Yup.string(),
      reportUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            medicalExamination: {
              hospitalName: values.hospitalName,
              appointmentDateTime: values.appointmentDateTime
                ? formatPayloadDateTime(values.appointmentDateTime)
                : "",
              location: values.location,
              reportIssueDate: values.reportIssueDate
                ? formatPayloadDate(values.reportIssueDate)
                : "",
            },
          },
        };

        const oldData =
          applicationData?.visaApplicationDetails?.medicalExamination || {};
        if (
          oldData.hospitalName !== values.hospitalName ||
          oldData.appointmentDateTime !==
            (values.appointmentDateTime
              ? formatPayloadDateTime(values.appointmentDateTime)
              : "") ||
          oldData.location !== values.location ||
          oldData.reportIssueDate !==
            (values.reportIssueDate
              ? formatPayloadDate(values.reportIssueDate)
              : "")
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.reportUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.reportUpload);
          formData.append("customDocumentName", "Medical Report");
          formData.append(
            "ref_module",
            applicationData?.visaApplicationDetails?._id
          );
        }

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          return;
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload && formData) {
          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Medical Examination details updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update Medical Examination details.");
      } finally {
        setIsLoading(false);
      }
    },
  });
  const handleFileChange = (event) => {
    formik.setFieldValue("reportUpload", event.target.files[0]);
  };

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.medicalExamination) {
      const medicalExamination =
        applicationData.visaApplicationDetails.medicalExamination;
      formik.setValues({
        hospitalName: medicalExamination.hospitalName || "",
        appointmentDateTime: medicalExamination.appointmentDateTime
          ? parseDate(medicalExamination.appointmentDateTime)
          : null,
        location: medicalExamination.location || "",
        reportIssueDate: medicalExamination.reportIssueDate
          ? parseDate(medicalExamination.reportIssueDate)
          : null,
      });
    }
  }, [applicationData]);
  const handleCheckboxChangeId = (docId, docName) => {
    setSelectedDocsIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
    setSelectedDocumentNames((prev) =>
      prev.includes(docName)
        ? prev.filter((name) => name !== docName)
        : [...prev, docName]
    );
  };

  const sendPendingDocumentMain = (id, selectedDocumentNames) => {
    const toastId = toast.loading("Sending the pending documents email");

    dispatch(pendingDocMail(id, selectedDocumentNames))
      .then((res) => {
        if (res?.status === 200) {
          toast.update(toastId, {
            render:
              res?.data?.data || "Pending documents email sent successfully",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          setSelectedDocsIds([]);
          setSelectedDocumentNames([]);
        } else {
          toast.update(toastId, {
            render: res?.data?.message || "Failed to send email",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      })
      .catch(() => {
        toast.update(toastId, {
          render: "Failed to send email. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="mb-4 my-5 p-4 bg-light rounded shadow-sm">
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <LoadMoreButton isLoading={isLoading} />
        </div>
      )}
      <h5>Medical Examination</h5>
      <div className="bg-white rounded mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Hospital/Panel Clinic Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter hospital/clinic name"
                  value={formik.values.hospitalName}
                  onChange={formik.handleChange}
                  name="hospitalName"
                  className="custom-select-height"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Appointment Date & Time</Form.Label>
                <div style={{ position: "relative" }} ref={appointmentDateRef}>
                  <Form.Control
                    type="text"
                    placeholder="dd/mm/yyyy hh:mm"
                    value={
                      formik.values.appointmentDateTime
                        ? formatDisplayDateTime(
                            formik.values.appointmentDateTime
                          )
                        : ""
                    }
                    readOnly
                    onClick={() => setShowAppointmentDateCalendar(true)}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      paddingRight: "40px",
                    }}
                    className="custom-select-height"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <MdCalendarToday
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                    }}
                    size={20}
                  />
                  {showAppointmentDateCalendar && (
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
                        padding: "10px",
                      }}
                    >
                      <Calendar
                        className="form-control border-0"
                        onChange={(date) => {
                          const currentDateTime =
                            formik.values.appointmentDateTime || new Date();
                          const updatedDateTime = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                            currentDateTime.getHours(),
                            currentDateTime.getMinutes()
                          );
                          formik.setFieldValue(
                            "appointmentDateTime",
                            updatedDateTime
                          );
                          setShowAppointmentDateCalendar(false);
                        }}
                        value={formik.values.appointmentDateTime || new Date()}
                        locale="en-GB"
                      />
                      <Form.Control
                        type="time"
                        className="mt-2"
                        value={
                          formik.values.appointmentDateTime
                            ? formik.values.appointmentDateTime
                                .toTimeString()
                                .slice(0, 5)
                            : ""
                        }
                        onChange={(e) => {
                          const currentDateTime =
                            formik.values.appointmentDateTime || new Date();
                          const [hours, minutes] = e.target.value.split(":");
                          const updatedDateTime = new Date(
                            currentDateTime.getFullYear(),
                            currentDateTime.getMonth(),
                            currentDateTime.getDate(),
                            hours,
                            minutes
                          );
                          formik.setFieldValue(
                            "appointmentDateTime",
                            updatedDateTime
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  name="location"
                  className="custom-select-height"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Report Issue Date</Form.Label>
                <div style={{ position: "relative" }} ref={reportIssueDateRef}>
                  <Form.Control
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={
                      formik.values.reportIssueDate
                        ? formatDisplayDate(formik.values.reportIssueDate)
                        : ""
                    }
                    readOnly
                    onClick={() => setShowReportIssueDateCalendar(true)}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      paddingRight: "40px",
                    }}
                    className="custom-select-height"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <MdCalendarToday
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                    }}
                    size={20}
                  />
                  {showReportIssueDateCalendar && (
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
                      }}
                    >
                      <Calendar
                        className="form-control border-0"
                        onChange={(date) => {
                          formik.setFieldValue("reportIssueDate", date);
                          setShowReportIssueDateCalendar(false);
                        }}
                        value={formik.values.reportIssueDate || new Date()}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Upload Medical Report</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="custom-select-height"
                  name="reportUpload"
                  disabled={
                    applicationData?.uploadedDocumentDetails?.some(
                      (doc) => doc.customDocumentName === "Medical Report"
                    ) || userRole === "Student" || userRole === "LeadStudent"
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          {userRole !== "Student" && userRole !== "LeadStudent" && (
            <div className="d-flex justify-content-end me-3">
              <Button
                type="submit"
                variant="primary"
                className="custom-select-height"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          )}
        </Form>
      </div>

      <DocumentHandler
        applicationData={applicationData}
        documentTypes={documentTypes}
        id={id}
        dispatch={dispatch}
        updateStudentApplication={updateStudentApplication}
        deleteStudentApplication={deleteStudentApplication}
        downloadDocument={downloadDocument}
        userRole={userRole}
        selectedDocsIds={selectedDocsIds}
        handleCheckboxChangeId={handleCheckboxChangeId}
        selectedDocumentNames={selectedDocumentNames}
        sendPendingDocumentMain={sendPendingDocumentMain}
        fetchData={fetchData}
      />
    </div>
  );
};

export default AusMedicalExamination;
