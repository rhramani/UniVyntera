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
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

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

const AusBiometrics = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const [showRequestCalendar, setShowRequestCalendar] = useState(false);
  const [showAppointmentCalendar, setShowAppointmentCalendar] = useState(false);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const requestDateRef = useRef(null);
  const appointmentDateRef = useRef(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Biometrics Acknowledgement"];

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
        requestDateRef.current &&
        !requestDateRef.current.contains(event.target)
      ) {
        setShowRequestCalendar(false);
      }
      if (
        appointmentDateRef.current &&
        !appointmentDateRef.current.contains(event.target)
      ) {
        setShowAppointmentCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.biometrics) {
      const biometrics = applicationData.visaApplicationDetails.biometrics;
      formik.setValues({
        hospitalName: biometrics.hospitalName || "",
        appointmentDateTime: biometrics.appointmentDateTime
          ? parseDate(biometrics.appointmentDateTime)
          : null,
        location: biometrics.location || "",
        requestDate: biometrics.requestDate
          ? parseDate(biometrics.requestDate)
          : null,
      });
    }
  }, [applicationData]);

  const formik = useFormik({
    initialValues: {
      requestDate: "",
      appointmentDateTime: "",
      location: "",
      acknowledgementUpload: "",
    },
    validationSchema: Yup.object({
      requestDate: Yup.string(),
      appointmentDateTime: Yup.string(),
      location: Yup.string(),
      acknowledgementUpload: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            biometrics: {
              requestDate: values.requestDate
                ? formatPayloadDate(values.requestDate)
                : "",
              appointmentDateTime: values.appointmentDateTime
                ? formatPayloadDateTime(values.appointmentDateTime)
                : "",
              location: values.location,
            },
          },
        };

        const oldBio =
          applicationData?.visaApplicationDetails?.biometrics || {};
        if (
          oldBio.requestDate !==
            jsonData.visaApplicationDetails.biometrics.requestDate ||
          oldBio.appointmentDateTime !==
            jsonData.visaApplicationDetails.biometrics.appointmentDateTime ||
          oldBio.location !==
            jsonData.visaApplicationDetails.biometrics.location
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.acknowledgementUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.acknowledgementUpload);
          formData.append("customDocumentName", "Biometrics Acknowledgement");
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
        toast.success("Biometrics details updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update biometrics details.");
      } finally {
        setIsLoading(false);
      }
    },
  });
  const handleFileChange = (event) => {
    formik.setFieldValue("acknowledgementUpload", event.target.files[0]);
  };

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
      <h5>Biometrics (if requested)</h5>
      <div className="bg-white mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Biometrics Request Date</Form.Label>
                <div style={{ position: "relative" }} ref={requestDateRef}>
                  <Form.Control
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={
                      formik.values.requestDate
                        ? formatDisplayDate(formik.values.requestDate)
                        : ""
                    }
                    readOnly
                    onClick={() => setShowRequestCalendar(true)}
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
                      pointerEvents: "none",
                    }}
                    size={20}
                  />
                  {showRequestCalendar && (
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
                        onChange={(date) => {
                          formik.setFieldValue("requestDate", date);
                          setShowRequestCalendar(false);
                        }}
                        value={formik.values.requestDate || new Date()}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Appointment Date & Time</Form.Label>
                <div style={{ position: "relative" }} ref={appointmentDateRef}>
                  <Form.Control
                    type="text"
                    placeholder="dd/mm/yyyy – hh:mm"
                    value={
                      formik.values.appointmentDateTime
                        ? formatDisplayDateTime(
                            formik.values.appointmentDateTime
                          )
                        : ""
                    }
                    readOnly
                    onClick={() => setShowAppointmentCalendar(true)}
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
                      pointerEvents: "none",
                    }}
                    size={20}
                  />
                  {showAppointmentCalendar && (
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
                          setShowAppointmentCalendar(false);
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
                <Form.Label>Appointment Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter appointment location"
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
                <Form.Label>Upload Biometrics Acknowledgement</Form.Label>
                <Form.Control
                  type="file"
                  name="acknowledgementUpload"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="custom-select-height"
                  disabled={
                    applicationData?.uploadedDocumentDetails?.some(
                      (doc) =>
                        doc.customDocumentName === "Biometrics Acknowledgement"
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

export default AusBiometrics;
