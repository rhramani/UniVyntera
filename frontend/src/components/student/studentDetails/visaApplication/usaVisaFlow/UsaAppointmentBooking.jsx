import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch } from "react-redux";
import {
  updateStudentApplication,
  getOneStudentApplication,
  deleteStudentApplication,
  downloadDocument,
  pendingDocMail,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const formatDisplayDateTime = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatPayloadDateTime = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date && !isNaN(dateStr)) return dateStr;

  const parsed = new Date(dateStr);
  return isNaN(parsed) ? null : parsed;
};

const UsaAppointmentBooking = ({ id }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showVacCalendar, setShowVacCalendar] = useState(false);
  const [showInterviewCalendar, setShowInterviewCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const paymentDateCalendarRef = useRef(null);
  const documentTypes = ["Appointment Confirmation"];
  const userRole = decryptData(localStorage.getItem("role"));
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const vacCalendarRef = useRef(null);
  const interviewCalendarRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch application:", error);
      toast.error("Failed to fetch application data. Please try again.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        vacCalendarRef.current &&
        !vacCalendarRef.current.contains(event.target)
      ) {
        setShowVacCalendar(false);
      }
      if (
        interviewCalendarRef.current &&
        !interviewCalendarRef.current.contains(event.target)
      ) {
        setShowInterviewCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      confirmed: applicationData?.visaApplicationDetails?.appointmentBooking
        ?.confirmed
        ? "Yes"
        : "No",
      vacDateTime: applicationData?.visaApplicationDetails?.appointmentBooking
        ?.vac?.dateTime
        ? parseDate(
            applicationData.visaApplicationDetails.appointmentBooking.vac
              .dateTime
          )
        : null,
      vacLocation:
        applicationData?.visaApplicationDetails?.appointmentBooking?.vac
          ?.location || "",
      interviewDateTime: applicationData?.visaApplicationDetails
        ?.appointmentBooking?.interview?.dateTime
        ? parseDate(
            applicationData.visaApplicationDetails.appointmentBooking.interview
              .dateTime
          )
        : null,
      interviewLocation:
        applicationData?.visaApplicationDetails?.appointmentBooking?.interview
          ?.location || "",
      appointmentConfirmation: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      confirmed: Yup.string().required("Please select an option"),
      vacDateTime: Yup.string(),
      vacLocation: Yup.string(),
      interviewDateTime: Yup.string(),
      interviewLocation: Yup.string(),
      appointmentConfirmation: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            appointmentBooking: {
              confirmed: values.confirmed === "Yes",
              vac:
                values.confirmed === "Yes"
                  ? {
                      dateTime: values.vacDateTime
                        ? formatPayloadDateTime(values.vacDateTime)
                        : "",
                      location: values.vacLocation,
                    }
                  : null,
              interview:
                values.confirmed === "Yes"
                  ? {
                      dateTime: values.interviewDateTime
                        ? formatPayloadDateTime(values.interviewDateTime)
                        : "",
                      location: values.interviewLocation,
                    }
                  : null,
            },
          },
        };

        const oldBooking =
          applicationData?.visaApplicationDetails?.appointmentBooking || {};
        const oldVac = oldBooking?.vac || {};
        const oldInterview = oldBooking?.interview || {};

        if (
          oldBooking?.confirmed !== (values.confirmed === "Yes") ||
          (values.confirmed === "Yes" &&
            (oldVac.dateTime !== formatPayloadDateTime(values.vacDateTime) ||
              oldVac.location !== values.vacLocation ||
              oldInterview.dateTime !==
                formatPayloadDateTime(values.interviewDateTime) ||
              oldInterview.location !== values.interviewLocation))
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.confirmed === "Yes" && values.appointmentConfirmation) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.appointmentConfirmation);
          formData.append("customDocumentName", "Appointment Confirmation");
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
        toast.success("Appointment booking updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update appointment booking:", error);
        toast.error("Failed to update appointment booking. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("appointmentConfirmation", file);
  };

  const handleCheckboxChangeId = (docId, docName) => {
    setSelectedDocsIds((prev) => {
      if (prev.includes(docId)) {
        return prev.filter((id) => id !== docId);
      }
      return [...prev, docId];
    });
    setSelectedDocumentNames((prev) => {
      if (prev.includes(docName)) {
        return prev.filter((name) => name !== docName);
      }
      return [...prev, docName];
    });
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
      .catch((error) => {
        console.error("Error sending pending doc email:", error);
        toast.update(toastId, {
          render: "Failed to send email. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <>
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
      <div className="mb-4 my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Appointment Booking</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Appointment Confirmed?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      id="yesAppointmentConfirmed"
                      name="confirmed"
                      value="Yes"
                      checked={formik.values.confirmed === "Yes"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      id="noAppointmentConfirmed"
                      name="confirmed"
                      value="No"
                      checked={formik.values.confirmed === "No"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.errors.confirmed && formik.touched.confirmed && (
                      <div className="text-danger">
                        {formik.errors.confirmed}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              {formik.values.confirmed === "Yes" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Appointment Confirmation Upload</Form.Label>
                      <Form.Control
                        type="file"
                        name="appointmentConfirmation"
                        className="custom-select-height"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        disabled={
                          applicationData?.uploadedDocumentDetails?.some(
                            (doc) =>
                              doc.customDocumentName ===
                              "Appointment Confirmation"
                          ) || userRole === "Student" || userRole === "LeadStudent"
                        }
                      />
                      {formik.errors.appointmentConfirmation &&
                        formik.touched.appointmentConfirmation && (
                          <div className="text-danger">
                            {formik.errors.appointmentConfirmation}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>VAC (OFC) Date & Time</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={vacCalendarRef}
                      >
                        <Form.Control
                          type="text"
                          placeholder="dd/mm/yyyy hh:mm"
                          value={
                            formik.values.vacDateTime
                              ? formatDisplayDateTime(formik.values.vacDateTime)
                              : ""
                          }
                          readOnly
                          onClick={() => setShowVacCalendar(true)}
                          className="custom-select-height"
                          style={{
                            cursor:
                              userRole === "Student" || userRole === "LeadStudent"
                                ? "not-allowed"
                                : "pointer",
                            paddingRight: "40px",
                          }}
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
                        {showVacCalendar && (
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
                                  formik.values.vacDateTime || new Date();
                                const updatedDateTime = new Date(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate(),
                                  currentDateTime.getHours(),
                                  currentDateTime.getMinutes()
                                );
                                formik.setFieldValue(
                                  "vacDateTime",
                                  updatedDateTime
                                );
                              }}
                              value={
                                formik.values.vacDateTime
                                  ? parseDate(formik.values.vacDateTime)
                                  : new Date()
                              }
                              locale="en-GB"
                            />
                            <Form.Control
                              type="time"
                              className="mt-2"
                              value={
                                formik.values.vacDateTime
                                  ? formik.values.vacDateTime
                                      .toTimeString()
                                      .slice(0, 5)
                                  : ""
                              }
                              onChange={(e) => {
                                const currentDateTime =
                                  formik.values.vacDateTime || new Date();
                                const [hours, minutes] =
                                  e.target.value.split(":");
                                const updatedDateTime = new Date(
                                  currentDateTime.getFullYear(),
                                  currentDateTime.getMonth(),
                                  currentDateTime.getDate(),
                                  hours,
                                  minutes
                                );
                                formik.setFieldValue(
                                  "vacDateTime",
                                  updatedDateTime
                                );
                              }}
                            />
                          </div>
                        )}
                        {formik.errors.vacDateTime &&
                          formik.touched.vacDateTime && (
                            <div className="text-danger">
                              {formik.errors.vacDateTime}
                            </div>
                          )}
                      </div>
                      <Form.Control
                        type="text"
                        name="vacLocation"
                        className="custom-select-height mt-2"
                        placeholder="Enter VAC location"
                        value={formik.values.vacLocation}
                        onChange={formik.handleChange}
                        style={{
                          cursor:
                            userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                        }}
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      {formik.errors.vacLocation &&
                        formik.touched.vacLocation && (
                          <div className="text-danger">
                            {formik.errors.vacLocation}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Interview Date & Time</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={interviewCalendarRef}
                      >
                        <Form.Control
                          type="text"
                          placeholder="dd/mm/yyyy hh:mm"
                          value={
                            formik.values.interviewDateTime
                              ? formatDisplayDateTime(
                                  formik.values.interviewDateTime
                                )
                              : ""
                          }
                          readOnly
                          onClick={() => setShowInterviewCalendar(true)}
                          className="custom-select-height"
                          style={{
                            cursor:
                              userRole === "Student" || userRole === "LeadStudent"
                                ? "not-allowed"
                                : "pointer",
                            paddingRight: "40px",
                          }}
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
                        {showInterviewCalendar && (
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
                                  formik.values.interviewDateTime || new Date();
                                const updatedDateTime = new Date(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate(),
                                  currentDateTime.getHours(),
                                  currentDateTime.getMinutes()
                                );
                                formik.setFieldValue(
                                  "interviewDateTime",
                                  updatedDateTime
                                );
                              }}
                              value={
                                formik.values.interviewDateTime
                                  ? parseDate(formik.values.interviewDateTime)
                                  : new Date()
                              }
                              locale="en-GB"
                            />
                            <Form.Control
                              type="time"
                              className="mt-2"
                              value={
                                formik.values.interviewDateTime
                                  ? formik.values.interviewDateTime
                                      .toTimeString()
                                      .slice(0, 5)
                                  : ""
                              }
                              onChange={(e) => {
                                const currentDateTime =
                                  formik.values.interviewDateTime || new Date();
                                const [hours, minutes] =
                                  e.target.value.split(":");
                                const updatedDateTime = new Date(
                                  currentDateTime.getFullYear(),
                                  currentDateTime.getMonth(),
                                  currentDateTime.getDate(),
                                  hours,
                                  minutes
                                );
                                formik.setFieldValue(
                                  "interviewDateTime",
                                  updatedDateTime
                                );
                              }}
                            />
                          </div>
                        )}
                        {formik.errors.interviewDateTime &&
                          formik.touched.interviewDateTime && (
                            <div className="text-danger">
                              {formik.errors.interviewDateTime}
                            </div>
                          )}
                      </div>
                      <Form.Control
                        type="text"
                        name="interviewLocation"
                        className="custom-select-height mt-2"
                        placeholder="Enter interview location"
                        value={formik.values.interviewLocation}
                        onChange={formik.handleChange}
                        style={{
                          cursor:
                            userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                        }}
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      {formik.errors.interviewLocation &&
                        formik.touched.interviewLocation && (
                          <div className="text-danger">
                            {formik.errors.interviewLocation}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>
            {userRole !== "Student" && userRole !== "LeadStudent" && (
              <div className="d-flex justify-content-end me-3">
                <Button
                  variant="primary"
                  type="submit"
                  className="custom-select-height"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Update"}
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
    </>
  );
};

export default UsaAppointmentBooking;
