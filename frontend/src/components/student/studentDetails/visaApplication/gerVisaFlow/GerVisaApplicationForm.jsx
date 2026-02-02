import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const GerVisaApplicationForm = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const dateCalendarRef = useRef(null);

  const dispatch = useDispatch();
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Visa Application Form Copy"];

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
        dateCalendarRef.current &&
        !dateCalendarRef.current.contains(event.target)
      ) {
        setShowDateCalendar(false);
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
      completed: "No",
      applicationDate: "",
      formUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      completed: Yup.string().required("Form completed status is required"),
      applicationDate: Yup.string(),
      formUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldForm =
          applicationData?.visaApplicationDetails?.visaApplicationForm || {};

        const jsonData = {
          visaApplicationDetails: {
            visaApplicationForm: {
              completed: values.completed === "Yes",
              applicationDate:
                values.completed === "Yes" && values.applicationDate
                  ? values.applicationDate
                  : "",
            },
          },
        };

        if (
          oldForm.completed !== (values.completed === "Yes") ||
          oldForm.applicationDate !==
            jsonData.visaApplicationDetails.visaApplicationForm.applicationDate
        ) {
          hasJsonChanges = true;
        }

        if (values.formUpload && values.completed === "Yes") {
          hasFileUpload = true;
        }

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          return;
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload) {
          const formData = new FormData();
          formData.append("uploadedDocument", values.formUpload);
          formData.append("customDocumentName", "Visa Application Form Copy");
          formData.append(
            "ref_module",
            applicationData.visaApplicationDetails._id
          );

          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Visa Application Form details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update visa application form:", error);
        toast.error(
          error.message ||
            "Failed to update visa application form details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.visaApplicationForm) {
      const visaApplicationForm =
        applicationData.visaApplicationDetails.visaApplicationForm;
      formik.setValues({
        completed: visaApplicationForm.completed ? "Yes" : "No",
        applicationDate: visaApplicationForm.applicationDate
          ? toISODate(parseDate(visaApplicationForm.applicationDate))
          : "",
        formUpload: "",
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
        <h5>Visa Application Form</h5>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Form Completed?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="radio"
                      id="formCompletedYes"
                      name="completed"
                      value="Yes"
                      checked={formik.values.completed === "Yes"}
                      onChange={() => formik.setFieldValue("completed", "Yes")}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      label="No"
                      type="radio"
                      id="formCompletedNo"
                      name="completed"
                      value="No"
                      checked={formik.values.completed === "No"}
                      onChange={() => formik.setFieldValue("completed", "No")}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </div>
                  {formik.touched.completed && formik.errors.completed && (
                    <div className="text-danger small">
                      {formik.errors.completed}
                    </div>
                  )}
                </Form.Group>
              </Col>

              {formik.values.completed === "Yes" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Application Date</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={dateCalendarRef}
                      >
                        <Form.Control
                          type="text"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.applicationDate
                              ? formatDate(
                                  parseDate(formik.values.applicationDate)
                                )
                              : ""
                          }
                          readOnly
                          onClick={() => setShowDateCalendar(true)}
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
                        {showDateCalendar && (
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
                                const formattedDate = toISODate(date);
                                formik.setFieldValue(
                                  "applicationDate",
                                  formattedDate
                                );
                                setShowDateCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.applicationDate) || null
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                        {formik.touched.applicationDate &&
                          formik.errors.applicationDate && (
                            <div className="text-danger small">
                              {formik.errors.applicationDate}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Upload Application Form Copy</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        onChange={(event) =>
                          formik.setFieldValue(
                            "formUpload",
                            event.currentTarget.files[0]
                          )
                        }
                        className="custom-select-height"
                        disabled={
                          applicationData?.uploadedDocumentDetails?.some(
                            (doc) =>
                              doc.customDocumentName ===
                              "Visa Application Form Copy"
                          ) || userRole === "Student" || userRole === "LeadStudent"
                        }
                      />
                      {formik.touched.formUpload &&
                        formik.errors.formUpload && (
                          <div className="text-danger small">
                            {formik.errors.formUpload}
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

export default GerVisaApplicationForm;
