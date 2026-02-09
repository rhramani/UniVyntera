import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  updateStudentApplication,
  getOneStudentApplication,
  deleteStudentApplication,
  downloadDocument,
  pendingDocMail,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";

const UkConfirmationofAcceptanceforStudies = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCasIssuedDateCalendar, setShowCasIssuedDateCalendar] =
    useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const casIssuedDateCalendarRef = useRef(null);
  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["CAS Letter"];

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
    if (id) fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        casIssuedDateCalendarRef.current &&
        !casIssuedDateCalendarRef.current.contains(event.target)
      ) {
        setShowCasIssuedDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.cas) {
      const cas = applicationData?.visaApplicationDetails.cas;
      formik.setValues({
        applied: cas.applied ?? false,
        issued: cas.issued ?? false,
        casNumber: cas.casNumber || "",
        issuedDate: cas.issuedDate ? toISODate(parseDate(cas.issuedDate)) : "",
        casLetterUpload: "",
      });
    }
  }, [applicationData]);

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
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
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
      applied: false,
      issued: false,
      casNumber: "",
      issuedDate: "",
      casLetterUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      applied: Yup.boolean(),
      issued: Yup.boolean(),
      casNumber: Yup.string(),
      issuedDate: Yup.string(),
      casLetterUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            cas: {
              applied: values.applied,
              issued: values.issued,
              casNumber: values.casNumber,
              issuedDate: values.issuedDate,
            },
          },
        };

        const oldCas = applicationData?.visaApplicationDetails?.cas || {};
        if (
          oldCas.applied !== values.applied ||
          oldCas.issued !== values.issued ||
          oldCas.casNumber !== values.casNumber ||
          oldCas.issuedDate !== values.issuedDate
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.casLetterUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.casLetterUpload);
          formData.append("customDocumentName", "CAS Letter");
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
        toast.success("CAS details updated successfully!");
        resetForm();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update CAS details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("casLetterUpload", event.target.files[0]);
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
      <h5>CAS (Confirmation of Acceptance for Studies)</h5>
      <div className="bg-white rounded mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Applied for CAS?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    id="applied-yes"
                    label="Yes"
                    name="applied"
                    value="true"
                    checked={formik.values.applied === true}
                    onChange={() => formik.setFieldValue("applied", true)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="applied-no"
                    label="No"
                    name="applied"
                    value="false"
                    checked={formik.values.applied === false}
                    onChange={() => formik.setFieldValue("applied", false)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </div>
                {formik.touched.applied && formik.errors.applied && (
                  <div className="text-danger">{formik.errors.applied}</div>
                )}
              </Form.Group>
            </Col>

            {formik.values.applied === true && (
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>CAS Issued?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      id="issued-yes"
                      label="Yes"
                      name="issued"
                      value="true"
                      checked={formik.values.issued === true}
                      onChange={() => formik.setFieldValue("issued", true)}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="issued-no"
                      label="No"
                      name="issued"
                      value="false"
                      checked={formik.values.issued === false}
                      onChange={() => formik.setFieldValue("issued", false)}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </div>
                  {formik.touched.issued && formik.errors.issued && (
                    <div className="text-danger">{formik.errors.issued}</div>
                  )}
                </Form.Group>
              </Col>
            )}

            {formik.values.issued === true && (
              <>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>CAS Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="casNumber"
                      placeholder="Enter CAS Number"
                      value={formik.values.casNumber}
                      onChange={formik.handleChange}
                      className="custom-select-height"
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.errors.casNumber && formik.touched.casNumber && (
                      <div className="text-danger">
                        {formik.errors.casNumber}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>CAS Issued Date</Form.Label>
                    <div
                      style={{ position: "relative" }}
                      ref={casIssuedDateCalendarRef}
                    >
                      <Form.Control
                        type="text"
                        name="issuedDate"
                        placeholder="dd/mm/yyyy"
                        value={
                          formik.values.issuedDate
                            ? formatDate(parseDate(formik.values.issuedDate))
                            : ""
                        }
                        readOnly
                        onClick={() => setShowCasIssuedDateCalendar(true)}
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
                      {showCasIssuedDateCalendar && (
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
                                "issuedDate",
                                toISODate(date)
                              );
                              setShowCasIssuedDateCalendar(false);
                            }}
                            value={parseDate(formik.values.issuedDate) || null}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Upload CAS Letter</Form.Label>
                    <Form.Control
                      type="file"
                      name="casLetterUpload"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      className="custom-select-height"
                      disabled={
                        applicationData?.uploadedDocumentDetails?.some(
                          (doc) => doc.customDocumentName === "CAS Letter"
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

export default UkConfirmationofAcceptanceforStudies;
