import { useState, useRef, useEffect } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
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

const FranceAppointmentBooking = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAppointmentCalendar, setShowAppointmentCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const dispatch = useDispatch();
  const appointmentDateRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));

  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const documentTypes = ["Appointment Booking Confirmation"];

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch application:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      toast.error("Invalid application ID. Please provide a valid ID.");
    }
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
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

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr instanceof Date && !isNaN(dateStr)) return dateStr;
    const parsed = new Date(dateStr);
    return isNaN(parsed) ? null : parsed;
  };

  const formik = useFormik({
    initialValues: {
      confirmed: "",
      appointmentDateTime: "",
      location: "",
      confirmationUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      confirmed: Yup.string().required("Please select Yes or No"),
      location: Yup.string(),
      appointmentDateTime: Yup.string(),
      confirmationUpload: Yup.string(),
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
              appointmentDateTime: values.appointmentDateTime
                ? formatPayloadDateTime(values.appointmentDateTime)
                : "",
              location: values.location,
            },
          },
        };

        const oldBooking =
          applicationData?.visaApplicationDetails?.appointmentBooking || {};

        if (
          oldBooking.confirmed !== (values.confirmed === "Yes") ||
          oldBooking.appointmentDateTime !==
            (values.appointmentDateTime
              ? formatPayloadDateTime(values.appointmentDateTime)
              : "") ||
          oldBooking.location !== values.location
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.confirmationUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.confirmationUpload);
          formData.append(
            "customDocumentName",
            "Appointment Booking Confirmation"
          );
          formData.append(
            "ref_module",
            applicationData?.visaApplicationDetails?._id
          );
        }

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          setIsLoading(false);
          return;
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload && formData) {
          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Appointment Booking details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update appointment booking details:", error);
        toast.error(
          error.message ||
            "Failed to update appointment booking details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.appointmentBooking) {
      const appointmentBooking =
        applicationData.visaApplicationDetails.appointmentBooking;
      formik.setValues({
        confirmed: appointmentBooking.confirmed ? "Yes" : "No",
        appointmentDateTime: appointmentBooking.appointmentDateTime
          ? parseDate(appointmentBooking.appointmentDateTime)
          : "",
        location: appointmentBooking.location || "",
        confirmationUpload: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("confirmationUpload", file);
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
          <h5>Appointment Booking (VFS / Embassy)</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
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
                      name="confirmed"
                      value="Yes"
                      id="yesConfirmed"
                      checked={formik.values.confirmed === "Yes"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      name="confirmed"
                      value="No"
                      id="noConfirmed"
                      checked={formik.values.confirmed === "No"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </div>
                  {formik.touched.confirmed && formik.errors.confirmed && (
                    <div className="text-danger">{formik.errors.confirmed}</div>
                  )}
                </Form.Group>
              </Col>

              {formik.values.confirmed === "Yes" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Appointment Date & Time</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={appointmentDateRef}
                      >
                        <Form.Control
                          type="text"
                          name="appointmentDateTime"
                          placeholder="dd/mm/yyyy hh:mm"
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
                              userRole === "Student" || userRole === "LeadStudent"
                                ? "not-allowed"
                                : "pointer",
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
                              padding: 10,
                            }}
                          >
                            <Calendar
                              className="form-control border-0"
                              onChange={(date) => {
                                const currentDateTime =
                                  formik.values.appointmentDateTime ||
                                  new Date();
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
                              }}
                              value={
                                formik.values.appointmentDateTime || new Date()
                              }
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
                                  formik.values.appointmentDateTime ||
                                  new Date();
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
                                  "appointmentDateTime",
                                  updatedDateTime
                                );
                              }}
                            />
                          </div>
                        )}
                        {formik.touched.appointmentDateTime &&
                          formik.errors.appointmentDateTime && (
                            <div className="text-danger">
                              {formik.errors.appointmentDateTime}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Location (VFS / Consulate City)</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="Enter location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                        style={{
                          cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                        }}
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      {formik.touched.location && formik.errors.location && (
                        <div className="text-danger">
                          {formik.errors.location}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Upload Appointment Confirmation (PDF/JPG/PNG)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="confirmationUpload"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="custom-select-height"
                        disabled={
                          applicationData?.uploadedDocumentDetails?.some(
                            (doc) =>
                              doc.customDocumentName ===
                              "Appointment Booking Confirmation"
                          ) || userRole === "Student" || userRole === "LeadStudent"
                        }
                      />
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>
            {userRole !== "Student" && userRole !== "LeadStudent" && (
              <div className="d-flex justify-content-end me-3">
                <Button
                  type="submit"
                  className="custom-select-height"
                  variant="primary"
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
    </>
  );
};

export default FranceAppointmentBooking;
