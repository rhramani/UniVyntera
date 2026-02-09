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

const GerBiometricsInterview = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showInterviewCalendar, setShowInterviewCalendar] = useState(false);
  const interviewCalendarRef = useRef(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = [
    "Acknowledgement Slip",
    "Submitted Documents Checklist",
  ];
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

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
        interviewCalendarRef.current &&
        !interviewCalendarRef.current.contains(event.target)
      ) {
        setShowInterviewCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const isDocumentUploaded = (documentType) => {
    return applicationData?.uploadedDocumentDetails?.some(
      (doc) => doc.customDocumentName === documentType
    );
  };

  const formik = useFormik({
    initialValues: {
      interviewDateTime: "",
      consulateLocation: "",
      acknowledgementUpload: "",
      submittedDocsUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      interviewDateTime: Yup.string(),
      consulateLocation: Yup.string(),
      acknowledgementUpload: Yup.string(),
      submittedDocsUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const refModuleId = applicationData.visaApplicationDetails._id;

        let hasJsonChanges = false;
        const jsonData = {
          visaApplicationDetails: {
            biometricsInterview: {
              interviewDateTime: values.interviewDateTime
                ? formatPayloadDateTime(values.interviewDateTime)
                : "",
              consulateLocation: values.consulateLocation,
            },
          },
        };

        const oldData =
          applicationData?.visaApplicationDetails?.biometricsInterview || {};
        if (
          oldData.interviewDateTime !==
            jsonData.visaApplicationDetails.biometricsInterview
              .interviewDateTime ||
          oldData.consulateLocation !==
            jsonData.visaApplicationDetails.biometricsInterview
              .consulateLocation
        ) {
          hasJsonChanges = true;
        }

        const uploads = [];
        if (values.acknowledgementUpload) {
          uploads.push({
            file: values.acknowledgementUpload,
            name: "Acknowledgement Slip",
          });
        }
        if (values.submittedDocsUpload) {
          uploads.push({
            file: values.submittedDocsUpload,
            name: "Submitted Documents Checklist",
          });
        }

        if (hasJsonChanges && uploads.length === 0) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        for (const upload of uploads) {
          const formData = new FormData();
          formData.append("uploadedDocument", upload.file);
          formData.append("customDocumentName", upload.name);
          formData.append("ref_module", refModuleId);
          await dispatch(updateStudentApplication(formData, id));
        }

        if (hasJsonChanges && uploads.length > 0) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        await fetchData();
        toast.success("Biometrics & Interview details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update biometrics interview details:", error);
        toast.error(
          error.message ||
            "Failed to update biometrics interview details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.biometricsInterview) {
      const biometricsInterview =
        applicationData.visaApplicationDetails.biometricsInterview;
      formik.setValues({
        interviewDateTime: biometricsInterview.interviewDateTime
          ? parseDate(biometricsInterview.interviewDateTime)
          : "",
        consulateLocation: biometricsInterview.consulateLocation || "",
        acknowledgementUpload: "",
        submittedDocsUpload: "",
      });
    }
  }, [applicationData]);

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
        <h5>Biometrics & Interview</h5>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Interview Date & Time</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={interviewCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy – hh:mm"
                      value={
                        formik.values.interviewDateTime
                          ? formatDisplayDateTime(
                              formik.values.interviewDateTime
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowInterviewCalendar(true)}
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
                            setShowInterviewCalendar(false);
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
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
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
                    {formik.touched.interviewDateTime &&
                      formik.errors.interviewDateTime && (
                        <div className="text-danger">
                          {formik.errors.interviewDateTime}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Consulate Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter consulate location"
                    value={formik.values.consulateLocation}
                    onChange={formik.handleChange}
                    name="consulateLocation"
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.consulateLocation &&
                    formik.errors.consulateLocation && (
                      <div className="text-danger">
                        {formik.errors.consulateLocation}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Acknowledgement Slip</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "acknowledgementUpload",
                        event.currentTarget.files[0]
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      isDocumentUploaded("Acknowledgement Slip") ||
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.acknowledgementUpload &&
                    formik.errors.acknowledgementUpload && (
                      <div className="text-danger">
                        {formik.errors.acknowledgementUpload}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Upload Submitted Documents (Checklist)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "submittedDocsUpload",
                        event.currentTarget.files[0]
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      isDocumentUploaded("Submitted Documents Checklist") ||
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.submittedDocsUpload &&
                    formik.errors.submittedDocsUpload && (
                      <div className="text-danger">
                        {formik.errors.submittedDocsUpload}
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

export default GerBiometricsInterview;
