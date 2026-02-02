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
import Select from "react-select";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const AusVisaOutcome = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const [showGrantCalendar, setShowGrantCalendar] = useState(false);
  const [showValidityFromCalendar, setShowValidityFromCalendar] =
    useState(false);
  const [showValidityToCalendar, setShowValidityToCalendar] = useState(false);

  const grantCalendarRef = useRef(null);
  const validityFromRef = useRef(null);
  const validityToRef = useRef(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Visa Grant Letter"];

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
        grantCalendarRef.current &&
        !grantCalendarRef.current.contains(event.target)
      ) {
        setShowGrantCalendar(false);
      }
      if (
        validityFromRef.current &&
        !validityFromRef.current.contains(event.target)
      ) {
        setShowValidityFromCalendar(false);
      }
      if (
        validityToRef.current &&
        !validityToRef.current.contains(event.target)
      ) {
        setShowValidityToCalendar(false);
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
  const visaOptions = [
    { value: "Granted", label: "Granted" },
    { value: "Refused", label: "Refused" },
    { value: "Pending", label: "Pending" },
  ];
  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.visaOutcome) {
      const visaOutcome = applicationData.visaApplicationDetails.visaOutcome;

      formik.setValues({
        decision: visaOutcome.decision || "",
        visaNumber: visaOutcome.number || "",
        grantDate: visaOutcome.grantDate
          ? toISODate(parseDate(visaOutcome.grantDate))
          : "",
        validity: {
          from: visaOutcome.validity?.from
            ? toISODate(parseDate(visaOutcome.validity.from))
            : "",
          to: visaOutcome.validity?.to
            ? toISODate(parseDate(visaOutcome.validity.to))
            : "",
        },
        grantLetterUpload: [],
      });
    }
  }, [applicationData]);

  const formik = useFormik({
    initialValues: {
      decision: "",
      visaNumber: "",
      grantDate: "",
      validity: {
        from: "",
        to: "",
      },
      grantLetterUpload: [],
    },
    validationSchema: Yup.object({
      decision: Yup.string(),
      visaNumber: Yup.string(),
      grantDate: Yup.string(),
      validity: Yup.object({
        from: Yup.string(),
        to: Yup.string(),
      }),
      grantLetterUpload: Yup.array().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            visaOutcome: {
              decision: values.decision,
              number: values.visaNumber,
              grantDate: values.grantDate,
              validity: {
                from: values.validity.from,
                to: values.validity.to,
              },
            },
          },
        };

        const oldOutcome =
          applicationData?.visaApplicationDetails?.visaOutcome || {};
        if (
          oldOutcome.decision !== values.decision ||
          oldOutcome.number !== values.visaNumber ||
          oldOutcome.grantDate !== values.grantDate ||
          oldOutcome.validity?.from !== values.validity.from ||
          oldOutcome.validity?.to !== values.validity.to
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.grantLetterUpload) {
          hasFileUpload = true;
          formData = new FormData();
          // formData.append("uploadedDocument", values.grantLetterUpload);
          values.grantLetterUpload.forEach((file) => {
            formData.append("uploadedDocument", file);
          });
          formData.append("customDocumentName", "Visa Grant Letter");
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
        toast.success("Visa outcome details updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update visa outcome.");
      } finally {
        setIsLoading(false);
      }
    },
  });
  useEffect(() => {
    if (formik.values.decision !== "Granted") {
      formik.setFieldValue("visaNumber", "");
      formik.setFieldValue("grantDate", "");
      formik.setFieldValue("validity.from", "");
      formik.setFieldValue("validity.to", "");
      formik.setFieldValue("grantLetterUpload", "");
    }
  }, [formik.values.decision]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("grantLetterUpload", files);
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
      <h5>Visa Outcome</h5>
      <div className="bg-white mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Visa Decision</Form.Label>
                <Select
                  name="decision"
                  options={visaOptions}
                  value={visaOptions.find(
                    (option) => option.value === formik.values.decision
                  )}
                  onChange={(selectedOption) =>
                    formik.setFieldValue(
                      "decision",
                      selectedOption?.value || ""
                    )
                  }
                  placeholder="Select"
                  isClearable
                  classNamePrefix="custom-select"
                  isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                />
              </Form.Group>
            </Col>

            {/* Visa Number */}
            {formik.values.decision === "Granted" && (
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Number (Grant Number)</Form.Label>
                  <Form.Control
                    type="text"
                    name="visaNumber"
                    placeholder="Enter grant number"
                    value={formik.values.visaNumber}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </Form.Group>
              </Col>
            )}

            {formik.values.decision === "Granted" && (
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Grant Date</Form.Label>
                  <div style={{ position: "relative" }} ref={grantCalendarRef}>
                    <Form.Control
                      type="text"
                      name="grantDate"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.grantDate
                          ? formatDate(parseDate(formik.values.grantDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowGrantCalendar(true)}
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
                    {showGrantCalendar && (
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
                            formik.setFieldValue("grantDate", toISODate(date));
                            setShowGrantCalendar(false);
                          }}
                          value={parseDate(formik.values.grantDate) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
            )}

            {formik.values.decision === "Granted" && (
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Validity (From)</Form.Label>
                  <div style={{ position: "relative" }} ref={validityFromRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.validity.from
                          ? formatDate(parseDate(formik.values.validity.from))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowValidityFromCalendar(true)}
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
                    {showValidityFromCalendar && (
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
                              "validity.from",
                              toISODate(date)
                            );
                            setShowValidityFromCalendar(false);
                          }}
                          value={parseDate(formik.values.validity.from) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
            )}

            {formik.values.decision === "Granted" && (
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Validity (To)</Form.Label>
                  <div style={{ position: "relative" }} ref={validityToRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.validity.to
                          ? formatDate(parseDate(formik.values.validity.to))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowValidityToCalendar(true)}
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
                    {showValidityToCalendar && (
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
                              "validity.to",
                              toISODate(date)
                            );
                            setShowValidityToCalendar(false);
                          }}
                          value={parseDate(formik.values.validity.to) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
            )}

            {formik.values.decision === "Granted" && (
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Visa Grant Letter</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="custom-select-height"
                    disabled={userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                </Form.Group>
              </Col>
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

export default AusVisaOutcome;
