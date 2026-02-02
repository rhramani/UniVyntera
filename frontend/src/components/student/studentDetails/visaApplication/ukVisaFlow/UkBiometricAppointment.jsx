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
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import DocumentHandler from "../DocumentHandler";

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

const UkBiometricAppointment = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const [applicationData, setApplicationData] = useState(null);
  const [showAppointmentDateCalendar, setShowAppointmentDateCalendar] =
    useState(false);
  const appointmentDateRef = useRef(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));
  const documentTypes = ["Biometric Appointment Confirmation"];

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formik = useFormik({
    initialValues: {
      booked:
        applicationData?.visaApplicationDetails?.biometricAppointment?.booked ||
        false,
      dateTime: applicationData?.visaApplicationDetails?.biometricAppointment
        ?.dateTime
        ? parseDate(
            applicationData.visaApplicationDetails.biometricAppointment.dateTime
          )
        : null,
      location:
        applicationData?.visaApplicationDetails?.biometricAppointment
          ?.location || "",
      confirmationUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      booked: Yup.boolean().required("Appointment Booked is required"),
      dateTime: Yup.string(),
      location: Yup.string(),
      confirmationUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldData =
          applicationData?.visaApplicationDetails?.biometricAppointment || {};
        if (
          oldData.booked !== values.booked ||
          (oldData.dateTime ? new Date(oldData.dateTime).toString() : "") !==
            (values.dateTime ? values.dateTime.toString() : "") ||
          oldData.location !== values.location
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
            "Biometric Appointment Confirmation"
          );
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
          const jsonData = {
            visaApplicationDetails: {
              biometricAppointment: {
                booked: values.booked,
                dateTime: values.dateTime
                  ? formatPayloadDateTime(values.dateTime)
                  : "",
                location: values.location,
              },
            },
          };
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload && formData) {
          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Biometric appointment details updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update biometric appointment details.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("confirmationUpload", event.target.files[0]);
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
      <h5>Biometric Appointment (VFS/Official)</h5>
      <div className="bg-white mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Appointment Booked?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    id="booked-yes"
                    label="Yes"
                    name="booked"
                    value="true"
                    checked={formik.values.booked === true}
                    onChange={() => formik.setFieldValue("booked", true)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="booked-no"
                    label="No"
                    name="booked"
                    value="false"
                    checked={formik.values.booked === false}
                    onChange={() => formik.setFieldValue("booked", false)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </div>
                {formik.touched.booked && formik.errors.booked && (
                  <div className="text-danger">{formik.errors.booked}</div>
                )}
              </Form.Group>
            </Col>

            {formik.values.booked && (
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
                        placeholder="dd/mm/yyyy hh:mm"
                        value={
                          formik.values.dateTime
                            ? formatDisplayDateTime(formik.values.dateTime)
                            : ""
                        }
                        readOnly
                        onClick={() => setShowAppointmentDateCalendar(true)}
                        className="custom-select-height"
                        style={{
                          cursor:
                            userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
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
                                formik.values.dateTime || new Date();
                              const updatedDateTime = new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate(),
                                currentDateTime.getHours(),
                                currentDateTime.getMinutes()
                              );
                              formik.setFieldValue("dateTime", updatedDateTime);
                            }}
                            value={
                              formik.values.dateTime
                                ? parseDate(formik.values.dateTime)
                                : new Date()
                            }
                            locale="en-GB"
                          />
                          <Form.Control
                            type="time"
                            className="mt-2"
                            value={
                              formik.values.dateTime
                                ? formik.values.dateTime
                                    .toTimeString()
                                    .slice(0, 5)
                                : ""
                            }
                            onChange={(e) => {
                              const currentDateTime =
                                formik.values.dateTime || new Date();
                              const [hours, minutes] =
                                e.target.value.split(":");
                              const updatedDateTime = new Date(
                                currentDateTime.getFullYear(),
                                currentDateTime.getMonth(),
                                currentDateTime.getDate(),
                                hours,
                                minutes
                              );
                              formik.setFieldValue("dateTime", updatedDateTime);
                            }}
                          />
                        </div>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.dateTime}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Location (City/Center)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter location"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      className="custom-select-height"
                      name="location"
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.location}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Upload Appointment Confirmation</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="custom-select-height"
                      disabled={
                        applicationData?.uploadedDocumentDetails?.some(
                          (doc) =>
                            doc.customDocumentName ===
                            "Biometric Appointment Confirmation"
                        ) || userRole === "Student" || userRole === "LeadStudent"
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmationUpload}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </>
            )}
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

export default UkBiometricAppointment;
