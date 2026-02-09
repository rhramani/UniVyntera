import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
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

const UkVisaApplicationForm = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const [showSubmissionDateCalendar, setShowSubmissionDateCalendar] =
    useState(false);
  const submissionDateCalendarRef = useRef(null);
  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Application Form PDF"];
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
        submissionDateCalendarRef.current &&
        !submissionDateCalendarRef.current.contains(event.target)
      ) {
        setShowSubmissionDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (dateStr.includes("-")) return new Date(dateStr);
    return null;
  };
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formik = useFormik({
    initialValues: {
      started:
        applicationData?.visaApplicationDetails?.visaApplicationForm?.started ??
        "",
      submissionDate: applicationData?.visaApplicationDetails
        ?.visaApplicationForm?.submissionDate
        ? toISODate(
            parseDate(
              applicationData.visaApplicationDetails.visaApplicationForm
                .submissionDate
            )
          )
        : "",
      applicationFormUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      started: Yup.string(),
      submissionDate: Yup.string(),
      applicationFormUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldForm =
          applicationData?.visaApplicationDetails?.visaApplicationForm || {};

        if (
          oldForm.started !== values.started ||
          oldForm.submissionDate !== values.submissionDate
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.applicationFormUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.applicationFormUpload);
          formData.append("customDocumentName", "Application Form PDF");
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
          await dispatch(
            updateStudentApplication(
              {
                visaApplicationDetails: {
                  visaApplicationForm: {
                    started: values.started,
                    submissionDate: values.submissionDate,
                  },
                },
              },
              id
            )
          );
        }

        if (hasFileUpload && formData) {
          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Visa Application Form updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update Visa Application Form.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("applicationFormUpload", event.target.files[0]);
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
      <h5>Visa Application Form (UKVI Portal)</h5>
      <div className="bg-white rounded mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Application Started?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    id="started-yes"
                    label="Yes"
                    name="started"
                    value="true"
                    checked={formik.values.started === true}
                    onChange={() => formik.setFieldValue("started", true)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="started-no"
                    label="No"
                    name="started"
                    value="false"
                    checked={formik.values.started === false}
                    onChange={() => formik.setFieldValue("started", false)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </div>
                {formik.touched.started && formik.errors.started && (
                  <div className="text-danger">{formik.errors.started}</div>
                )}
              </Form.Group>
            </Col>

            {formik.values.started === true && (
              <>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Application Submission Date</Form.Label>
                    <div
                      style={{ position: "relative" }}
                      ref={submissionDateCalendarRef}
                    >
                      <Form.Control
                        type="text"
                        name="submissionDate"
                        placeholder="dd/mm/yyyy"
                        value={
                          formik.values.submissionDate
                            ? formatDate(
                                parseDate(formik.values.submissionDate)
                              )
                            : ""
                        }
                        readOnly
                        onClick={() => setShowSubmissionDateCalendar(true)}
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
                      {showSubmissionDateCalendar && (
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
                              formik.setFieldValue(
                                "submissionDate",
                                toISODate(date)
                              );
                              setShowSubmissionDateCalendar(false);
                            }}
                            value={
                              parseDate(formik.values.submissionDate) || null
                            }
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Upload Application Form PDF</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="custom-select-height"
                      disabled={
                        applicationData?.uploadedDocumentDetails?.some(
                          (doc) =>
                            doc.customDocumentName === "Application Form PDF"
                        ) || userRole === "Student" || userRole === "LeadStudent"
                      }
                    />
                  </Form.Group>
                </Col>
              </>
            )}
          </Row>
          {userRole !== "Studnet" && (
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

export default UkVisaApplicationForm;
