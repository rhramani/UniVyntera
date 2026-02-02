import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
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

const GerAppointmentBooking = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [showAppointmentCalendar, setShowAppointmentCalendar] = useState(false);
  const bookingCalendarRef = useRef(null);
  const appointmentCalendarRef = useRef(null);

  const dispatch = useDispatch();
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Appointment Booking Confirmation"];

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      toast.error("Failed to fetch application data.");
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
        bookingCalendarRef.current &&
        !bookingCalendarRef.current.contains(event.target) &&
        appointmentCalendarRef.current &&
        !appointmentCalendarRef.current.contains(event.target)
      ) {
        setShowBookingCalendar(false);
        setShowAppointmentCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formik = useFormik({
    initialValues: {
      bookingDate: "",
      appointmentDateTime: "",
      location: "",
      confirmationUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      bookingDate: Yup.string(),
      appointmentDateTime: Yup.string(),
      location: Yup.string(),
      confirmationUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        // if (!applicationData?.visaApplicationDetails?._id) {
        //   toast.error("Invalid application data.");
        //   setIsLoading(false);
        //   return;
        // }

        const refModuleId = applicationData.visaApplicationDetails._id;
        const oldBooking =
          applicationData.visaApplicationDetails?.appointmentBooking || {};

        const jsonData = {
          visaApplicationDetails: {
            appointmentBooking: {
              bookingDate: values.bookingDate
                ? formatPayloadDate(values.bookingDate)
                : "",
              appointmentDateTime: values.appointmentDateTime
                ? formatPayloadDateTime(values.appointmentDateTime)
                : "",
              location: values.location,
            },
          },
        };

        const hasJsonChanges =
          oldBooking.bookingDate !==
            jsonData.visaApplicationDetails.appointmentBooking.bookingDate ||
          oldBooking.appointmentDateTime !==
            jsonData.visaApplicationDetails.appointmentBooking
              .appointmentDateTime ||
          oldBooking.location !==
            jsonData.visaApplicationDetails.appointmentBooking.location;

        const hasFileUpload = !!values.confirmationUpload;

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          setIsLoading(false);
          return;
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload) {
          const formData = new FormData();
          formData.append("uploadedDocument", values.confirmationUpload);
          formData.append(
            "customDocumentName",
            "Appointment Booking Confirmation"
          );
          formData.append("ref_module", refModuleId);

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
        bookingDate: appointmentBooking.bookingDate
          ? parseDate(appointmentBooking.bookingDate)
          : "",
        appointmentDateTime: appointmentBooking.appointmentDateTime
          ? parseDate(appointmentBooking.appointmentDateTime)
          : "",
        location: appointmentBooking.location || "",
        confirmationUpload: "",
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
        <h5>Appointment Booking (Embassy/Consulate)</h5>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Appointment Booking Date</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={bookingCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.bookingDate
                          ? formatDisplayDate(formik.values.bookingDate)
                          : ""
                      }
                      readOnly
                      onClick={() => setShowBookingCalendar(true)}
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
                    {showBookingCalendar && (
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
                            const formattedDate = date;
                            formik.setFieldValue("bookingDate", formattedDate);
                            setShowBookingCalendar(false);
                          }}
                          value={formik.values.bookingDate || new Date()}
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.bookingDate &&
                      formik.errors.bookingDate && (
                        <div className="text-danger">
                          {formik.errors.bookingDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Appointment Date & Time</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={appointmentCalendarRef}
                  >
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
                  <Form.Label>City / Consulate Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city or consulate location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    name="location"
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <div className="text-danger">{formik.errors.location}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Appointment Confirmation</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "confirmationUpload",
                        event.currentTarget.files[0]
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) =>
                          doc.customDocumentName ===
                          "Appointment Booking Confirmation"
                      ) || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.confirmationUpload &&
                    formik.errors.confirmationUpload && (
                      <div className="text-danger">
                        {formik.errors.confirmationUpload}
                      </div>
                    )}
                </Form.Group>
              </Col>
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

export default GerAppointmentBooking;
