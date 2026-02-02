import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
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

const CanadaMedicalProcess = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showReportDateCalendar, setShowReportDateCalendar] = useState(false);
  const [showMedicalDateCalendar, setShowMedicalDateCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const userRole = decryptData(localStorage.getItem("role"));
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const reportDateCalendarRef = useRef(null);
  const medicalDateCalendarRef = useRef(null);

  const documentTypes = ["Medical Report Certificate"];

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch application:", error);
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
        reportDateCalendarRef.current &&
        !reportDateCalendarRef.current.contains(event.target)
      ) {
        setShowReportDateCalendar(false);
      }
      if (
        medicalDateCalendarRef.current &&
        !medicalDateCalendarRef.current.contains(event.target)
      ) {
        setShowMedicalDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      hospitalName: "",
      medicalDateTime: "",
      location: "",
      reportDocuments: "",
      reportDate: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      hospitalName: Yup.string(),
      medicalDateTime: Yup.string(),
      location: Yup.string(),
      reportDate: Yup.string(),
      reportDocuments: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldMedical =
          applicationData?.visaApplicationDetails?.medicalProcess || {};

        const jsonData = {
          visaApplicationDetails: {
            medicalProcess: {
              hospitalName: values.hospitalName,
              dateTime: values.medicalDateTime
                ? formatPayloadDateTime(values.medicalDateTime)
                : "",
              location: values.location,
              reportDocuments: oldMedical.reportDocuments || "",
              reportDate: values.reportDate
                ? formatPayloadDate(values.reportDate)
                : "",
            },
          },
        };

        if (
          oldMedical.hospitalName !== values.hospitalName ||
          (oldMedical.dateTime &&
            formatPayloadDateTime(values.medicalDateTime) !==
              oldMedical.dateTime) ||
          oldMedical.location !== values.location ||
          (oldMedical.reportDate &&
            formatPayloadDate(values.reportDate) !== oldMedical.reportDate)
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.reportDocuments) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.reportDocuments);
          formData.append("customDocumentName", "Medical Report Certificate");
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
        toast.success("Medical process details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update medical process details:", error);
        toast.error(
          error.message ||
            "Failed to update medical process details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.medicalProcess) {
      const medical = applicationData.visaApplicationDetails.medicalProcess;
      formik.setValues({
        hospitalName: medical.hospitalName || "",
        medicalDateTime: medical.dateTime ? parseDate(medical.dateTime) : null,
        location: medical.location || "",
        reportDocuments: "",
        reportDate: medical.reportDate ? parseDate(medical.reportDate) : null,
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("reportDocuments", file);
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
          <h5>Medical Process Details</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Hospital Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="hospitalName"
                    placeholder="Enter hospital name"
                    className="custom-select-height"
                    value={formik.values.hospitalName}
                    onChange={formik.handleChange}
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.hospitalName &&
                    formik.touched.hospitalName && (
                      <div className="text-danger">
                        {formik.errors.hospitalName}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Medical Report Date</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={reportDateCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      name="reportDate"
                      placeholder="dd/mm/yyyy"
                      className="custom-select-height"
                      value={
                        formik.values.reportDate
                          ? formatDisplayDate(formik.values.reportDate)
                          : ""
                      }
                      readOnly
                      onClick={() => setShowReportDateCalendar(true)}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                        backgroundColor: "#fff",
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
                    {showReportDateCalendar && (
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
                          onChange={(selectedDate) => {
                            formik.setFieldValue("reportDate", selectedDate);
                            setShowReportDateCalendar(false);
                          }}
                          value={
                            formik.values.reportDate
                              ? parseDate(formik.values.reportDate)
                              : new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.errors.reportDate && formik.touched.reportDate && (
                      <div className="text-danger">
                        {formik.errors.reportDate}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Date | Time | Location</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={medicalDateCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      name="medicalDateTime"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy hh:mm"
                      value={
                        formik.values.medicalDateTime
                          ? formatDisplayDateTime(formik.values.medicalDateTime)
                          : ""
                      }
                      readOnly
                      onClick={() => setShowMedicalDateCalendar(true)}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent"  ? "not-allowed" : "pointer",
                        backgroundColor: "#fff",
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
                      }}
                      size={20}
                    />
                    {showMedicalDateCalendar && (
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
                          onChange={(selectedDate) => {
                            const currentDateTime =
                              formik.values.medicalDateTime || new Date();
                            const updatedDateTime = new Date(
                              selectedDate.getFullYear(),
                              selectedDate.getMonth(),
                              selectedDate.getDate(),
                              currentDateTime.getHours(),
                              currentDateTime.getMinutes()
                            );
                            formik.setFieldValue(
                              "medicalDateTime",
                              updatedDateTime
                            );
                            setShowMedicalDateCalendar(false);
                          }}
                          value={
                            formik.values.medicalDateTime
                              ? parseDate(formik.values.medicalDateTime)
                              : new Date()
                          }
                          locale="en-GB"
                        />
                        <Form.Control
                          type="time"
                          className="mt-2"
                          value={
                            formik.values.medicalDateTime
                              ? formik.values.medicalDateTime
                                  .toTimeString()
                                  .slice(0, 5)
                              : ""
                          }
                          onChange={(e) => {
                            const currentDateTime =
                              formik.values.medicalDateTime || new Date();
                            const [hours, minutes] = e.target.value.split(":");
                            const updatedDateTime = new Date(
                              currentDateTime.getFullYear(),
                              currentDateTime.getMonth(),
                              currentDateTime.getDate(),
                              hours,
                              minutes
                            );
                            formik.setFieldValue(
                              "medicalDateTime",
                              updatedDateTime
                            );
                          }}
                        />
                      </div>
                    )}
                    {formik.errors.medicalDateTime &&
                      formik.touched.medicalDateTime && (
                        <div className="text-danger">
                          {formik.errors.medicalDateTime}
                        </div>
                      )}
                  </div>
                  <Form.Control
                    type="text"
                    name="location"
                    className="custom-select-height mt-2"
                    placeholder="Enter Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.location && formik.touched.location && (
                    <div className="text-danger">{formik.errors.location}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Upload Medical Report Certificate (PDF/JPG)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="reportDocuments"
                    accept=".pdf,.jpg,.jpeg"
                    className="custom-select-height"
                    onChange={handleFileChange}
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) =>
                          doc.customDocumentName ===
                          "Medical Report Certificate"
                      ) || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                </Form.Group>
              </Col>
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

export default CanadaMedicalProcess;
