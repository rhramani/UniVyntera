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

const FranceCampusFranceRegistration = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSubmissionCalendar, setShowSubmissionCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Campus France Approval Letter"];
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const dispatch = useDispatch();
  const submissionRef = useRef(null);

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
        submissionRef.current &&
        !submissionRef.current.contains(event.target)
      ) {
        setShowSubmissionCalendar(false);
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
      accountCreated: "",
      applicationNo: "",
      submissionDate: "",
      approvalLetterUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      accountCreated: Yup.string(),
      applicationNo: Yup.string(),
      submissionDate: Yup.string(),
      approvalLetterUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            campusFranceRegistration: {
              accountCreated: values.accountCreated === "Yes",
              applicationNo:
                values.accountCreated === "Yes" ? values.applicationNo : "",
              submissionDate:
                values.accountCreated === "Yes" && values.submissionDate
                  ? values.submissionDate
                  : "",
            },
          },
        };

        const oldData =
          applicationData?.visaApplicationDetails?.campusFranceRegistration ||
          {};

        if (
          oldData.accountCreated !== (values.accountCreated === "Yes") ||
          oldData.applicationNo !==
            (values.accountCreated === "Yes" ? values.applicationNo : "") ||
          oldData.submissionDate !==
            (values.accountCreated === "Yes" ? values.submissionDate : "")
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.approvalLetterUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.approvalLetterUpload);
          formData.append(
            "customDocumentName",
            "Campus France Approval Letter"
          );
          formData.append(
            "ref_module",
            applicationData.visaApplicationDetails._id
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
        toast.success("Campus France registration updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update Campus France registration:", error);
        toast.error(
          error.message ||
            "Failed to update Campus France registration. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.campusFranceRegistration) {
      const campusFranceRegistration =
        applicationData.visaApplicationDetails.campusFranceRegistration;
      formik.setValues({
        accountCreated: campusFranceRegistration.accountCreated ? "Yes" : "No",
        applicationNo: campusFranceRegistration.applicationNo || "",
        submissionDate: campusFranceRegistration.submissionDate
          ? toISODate(parseDate(campusFranceRegistration.submissionDate))
          : "",
        approvalLetterUpload: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("approvalLetterUpload", file);
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
          <h5>Campus France Registration</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Campus France Account Created?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="radio"
                      name="accountCreated"
                      value="Yes"
                      id="yesCampusFranceCreated"
                      checked={formik.values.accountCreated === "Yes"}
                      onChange={(e) => {
                        formik.handleChange(e);
                        if (e.target.value === "No") {
                          formik.setValues({
                            ...formik.values,
                            accountCreated: "No",
                            applicationNo: "",
                            submissionDate: "",
                            approvalLetterUpload: "",
                          });
                        }
                      }}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      label="No"
                      type="radio"
                      name="accountCreated"
                      value="No"
                      id="noCampusFranceCreated"
                      checked={formik.values.accountCreated === "No"}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setValues({
                          ...formik.values,
                          accountCreated: "No",
                          applicationNo: "",
                          submissionDate: "",
                          approvalLetterUpload: "",
                        });
                      }}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.touched.accountCreated &&
                      formik.errors.accountCreated && (
                        <div className="text-danger">
                          {formik.errors.accountCreated}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              {formik.values.accountCreated === "Yes" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Campus France Application No.</Form.Label>
                      <Form.Control
                        type="text"
                        name="applicationNo"
                        placeholder="Enter application number"
                        value={formik.values.applicationNo}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                        style={{
                          cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                        }}
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      {formik.touched.applicationNo &&
                        formik.errors.applicationNo && (
                          <div className="text-danger">
                            {formik.errors.applicationNo}
                          </div>
                        )}
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Submission Date</Form.Label>
                      <div style={{ position: "relative" }} ref={submissionRef}>
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
                          onClick={() => setShowSubmissionCalendar(true)}
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
                        {showSubmissionCalendar && (
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
                                setShowSubmissionCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.submissionDate) || ""
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                        {formik.touched.submissionDate &&
                          formik.errors.submissionDate && (
                            <div className="text-danger">
                              {formik.errors.submissionDate}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Upload Campus France Approval Letter (PDF/JPG/PNG)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="approvalLetterUpload"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="custom-select-height"
                        disabled={
                          applicationData?.uploadedDocumentDetails?.some(
                            (doc) =>
                              doc.customDocumentName ===
                              "Campus France Approval Letter"
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

export default FranceCampusFranceRegistration;
