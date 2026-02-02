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
import Select from "react-select";
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const CanadaVisaDecisionIssuance = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showReceivedCalendar, setShowReceivedCalendar] = useState(false);
  const [showIssueFromCalendar, setShowIssueFromCalendar] = useState(false);
  const [showIssueToCalendar, setShowIssueToCalendar] = useState(false);
  const [showPassportReceived, setShowPassportReceived] = useState(false);
  const [showVisaDecision, setShowVisaDecision] = useState(false);
  const [showVisaDetails, setShowVisaDetails] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const receivedCalendarRef = useRef(null);
  const issueFromCalendarRef = useRef(null);
  const issueToCalendarRef = useRef(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Visa Document"];

  const visaDecisionOption = [
    { value: "Approved", label: "Approved" },
    { value: "Refused", label: "Refused" },
    { value: "Pending", label: "Pending" },
  ];

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
    if (id) {
      fetchData();
    } else {
      toast.error("Invalid application ID. Please provide a valid ID.");
    }
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        receivedCalendarRef.current &&
        !receivedCalendarRef.current.contains(event.target)
      ) {
        setShowReceivedCalendar(false);
      }
      if (
        issueFromCalendarRef.current &&
        !issueFromCalendarRef.current.contains(event.target)
      ) {
        setShowIssueFromCalendar(false);
      }
      if (
        issueToCalendarRef.current &&
        !issueToCalendarRef.current.contains(event.target)
      ) {
        setShowIssueToCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      passportSentForVisa: applicationData?.visaApplicationDetails?.visaDecision
        ?.passportSentForVisa
        ? "Yes"
        : "No",
      passportReceivedWithVisa: applicationData?.visaApplicationDetails
        ?.visaDecision?.passportReceivedWithVisa
        ? "Yes"
        : "No",
      decision:
        applicationData?.visaApplicationDetails?.visaDecision?.decision || "",
      visaNumber:
        applicationData?.visaApplicationDetails?.visaDecision?.visaNumber || "",
      receivedDate: applicationData?.visaApplicationDetails?.visaDecision
        ?.receivedDate
        ? toISODate(
            parseDate(
              applicationData.visaApplicationDetails.visaDecision.receivedDate
            )
          )
        : "",
      issueFrom: applicationData?.visaApplicationDetails?.visaDecision
        ?.issueFrom
        ? toISODate(
            parseDate(
              applicationData.visaApplicationDetails.visaDecision.issueFrom
            )
          )
        : "",
      issueTo: applicationData?.visaApplicationDetails?.visaDecision?.issueTo
        ? toISODate(
            parseDate(
              applicationData.visaApplicationDetails.visaDecision.issueTo
            )
          )
        : "",
      documents: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      passportSentForVisa: Yup.string(),
      passportReceivedWithVisa: Yup.string(),
      decision: Yup.string(),
      visaNumber: Yup.string(),
      receivedDate: Yup.string(),
      issueFrom: Yup.string(),
      issueTo: Yup.string(),
      documents: Yup.array().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const jsonData = {
          visaApplicationDetails: {
            visaDecision: {
              passportSentForVisa: values.passportSentForVisa === "Yes",
              passportReceivedWithVisa:
                values.passportReceivedWithVisa === "Yes",
              decision: values.decision || "Pending",
              visaNumber:
                values.decision === "Approved" ? values.visaNumber : "",
              receivedDate:
                values.decision === "Approved" && values.receivedDate
                  ? values.receivedDate
                  : "",
              issueFrom:
                values.decision === "Approved" && values.issueFrom
                  ? values.issueFrom
                  : "",
              issueTo:
                values.decision === "Approved" && values.issueTo
                  ? values.issueTo
                  : "",
            },
          },
        };

        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldDecision =
          applicationData?.visaApplicationDetails?.visaDecision || {};
        if (
          oldDecision.passportSentForVisa !==
            (values.passportSentForVisa === "Yes") ||
          oldDecision.passportReceivedWithVisa !==
            (values.passportReceivedWithVisa === "Yes") ||
          oldDecision.decision !== (values.decision || "Pending") ||
          oldDecision.visaNumber !==
            (values.decision === "Approved" ? values.visaNumber : "") ||
          oldDecision.receivedDate !==
            (values.decision === "Approved" ? values.receivedDate : "") ||
          oldDecision.issueFrom !==
            (values.decision === "Approved" ? values.issueFrom : "") ||
          oldDecision.issueTo !==
            (values.decision === "Approved" ? values.issueTo : "")
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.documents) {
          if (!applicationData?.visaApplicationDetails?._id) {
            throw new Error(
              "Invalid ref_module: visaApplicationDetails._id is undefined"
            );
          }
          hasFileUpload = true;
          formData = new FormData();
          // formData.append("uploadedDocument", values.documents);
          values.documents.forEach((file) => {
            formData.append("uploadedDocument", file);
          });
          formData.append("customDocumentName", "Visa Document");
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
        toast.success("Visa decision details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update visa decision details:", error);
        toast.error(
          error.message ||
            "Failed to update visa decision details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.visaDecision) {
      const visaDecisionData =
        applicationData.visaApplicationDetails.visaDecision;
      formik.setValues({
        passportSentForVisa: visaDecisionData.passportSentForVisa
          ? "Yes"
          : "No",
        passportReceivedWithVisa: visaDecisionData.passportReceivedWithVisa
          ? "Yes"
          : "No",
        decision: visaDecisionData.decision || "",
        visaNumber: visaDecisionData.visaNumber || "",
        receivedDate: visaDecisionData.receivedDate
          ? toISODate(parseDate(visaDecisionData.receivedDate))
          : "",
        issueFrom: visaDecisionData.issueFrom
          ? toISODate(parseDate(visaDecisionData.issueFrom))
          : "",
        issueTo: visaDecisionData.issueTo
          ? toISODate(parseDate(visaDecisionData.issueTo))
          : "",
        documents: "",
      });
      setShowPassportReceived(visaDecisionData.passportSentForVisa);
      setShowVisaDecision(visaDecisionData.passportReceivedWithVisa);
      setShowVisaDetails(
        visaDecisionData.decision === "Approved" ||
          visaDecisionData.decision === "Refused"
      );
    }
  }, [applicationData]);

  const handleVisaDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("documents", files);
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
          <h5>Visa Decision & Issuance</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Passport sent for Visa Printing?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      name="passportSentForVisa"
                      value="Yes"
                      id="yesPassportForVisaPrinting"
                      checked={formik.values.passportSentForVisa === "Yes"}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setShowPassportReceived(true);
                        if (formik.values.passportReceivedWithVisa === "No") {
                          setShowVisaDecision(false);
                          setShowVisaDetails(false);
                          formik.setFieldValue("decision", "");
                          formik.setFieldValue("visaNumber", "");
                          formik.setFieldValue("receivedDate", "");
                          formik.setFieldValue("issueFrom", "");
                          formik.setFieldValue("issueTo", "");
                        }
                      }}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      name="passportSentForVisa"
                      value="No"
                      id="noPassportForVisaPrinting"
                      checked={formik.values.passportSentForVisa === "No"}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setShowPassportReceived(false);
                        setShowVisaDecision(false);
                        setShowVisaDetails(false);
                        formik.setFieldValue("passportReceivedWithVisa", "No");
                        formik.setFieldValue("decision", "");
                        formik.setFieldValue("visaNumber", "");
                        formik.setFieldValue("receivedDate", "");
                        formik.setFieldValue("issueFrom", "");
                        formik.setFieldValue("issueTo", "");
                      }}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.touched.passportSentForVisa &&
                      formik.errors.passportSentForVisa && (
                        <div className="text-danger">
                          {formik.errors.passportSentForVisa}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              {showPassportReceived && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Passport Received with Visa Printing?
                    </Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        label="Yes"
                        name="passportReceivedWithVisa"
                        value="Yes"
                        id="yesPassportReceivedWithVisaPrinting"
                        checked={
                          formik.values.passportReceivedWithVisa === "Yes"
                        }
                        onChange={(e) => {
                          formik.handleChange(e);
                          setShowVisaDecision(e.target.value === "Yes");
                          if (e.target.value !== "Yes") {
                            setShowVisaDetails(false);
                            formik.setValues({
                              ...formik.values,
                              decision: "",
                              visaNumber: "",
                              receivedDate: "",
                              issueFrom: "",
                              issueTo: "",
                            });
                          }
                        }}
                        className="custom-radio-border"
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="No"
                        name="passportReceivedWithVisa"
                        value="No"
                        id="noPassportReceivedWithVisaPrinting"
                        checked={
                          formik.values.passportReceivedWithVisa === "No"
                        }
                        onChange={(e) => {
                          formik.handleChange(e);
                          setShowVisaDecision(false);
                          setShowVisaDetails(false);
                          formik.setValues({
                            ...formik.values,
                            decision: "",
                            visaNumber: "",
                            receivedDate: "",
                            issueFrom: "",
                            issueTo: "",
                          });
                        }}
                        className="custom-radio-border"
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      {formik.touched.passportReceivedWithVisa &&
                        formik.errors.passportReceivedWithVisa && (
                          <div className="text-danger">
                            {formik.errors.passportReceivedWithVisa}
                          </div>
                        )}
                    </div>
                  </Form.Group>
                </Col>
              )}

              {showVisaDecision && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Visa Decision</Form.Label>
                    <Select
                      name="decision"
                      options={visaDecisionOption}
                      value={
                        formik.values.decision
                          ? {
                              value: formik.values.decision,
                              label: formik.values.decision,
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        const decisionValue = selectedOption
                          ? selectedOption.value
                          : "";
                        formik.setFieldValue("decision", decisionValue);
                        setShowVisaDetails(
                          decisionValue === "Approved" ||
                            decisionValue === "Refused"
                        );
                        if (decisionValue !== "Approved") {
                          formik.setValues({
                            ...formik.values,
                            decision: decisionValue,
                            visaNumber: "",
                            receivedDate: "",
                            issueFrom: "",
                            issueTo: "",
                          });
                        } else {
                          formik.setValues({
                            ...formik.values,
                            decision: decisionValue,
                          });
                        }
                      }}
                      placeholder="Select Decision"
                      classNamePrefix="custom-select"
                      isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.touched.decision && formik.errors.decision && (
                      <div className="text-danger">
                        {formik.errors.decision}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              )}

              {showVisaDetails && (
                <>
                  {formik.values.decision === "Approved" && (
                    <>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Visa Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="visaNumber"
                            className="custom-select-height"
                            placeholder="Enter Visa Number"
                            value={formik.values.visaNumber}
                            onChange={formik.handleChange}
                            style={{
                              cursor:
                                userRole === "Student" || userRole === "LeadStudent"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            disabled={userRole === "Student" || userRole === "LeadStudent"}
                          />
                          {formik.touched.visaNumber &&
                            formik.errors.visaNumber && (
                              <div className="text-danger">
                                {formik.errors.visaNumber}
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Visa Received Date</Form.Label>
                          <div
                            style={{ position: "relative" }}
                            ref={receivedCalendarRef}
                          >
                            <Form.Control
                              type="text"
                              name="receivedDate"
                              className="custom-select-height"
                              placeholder="dd/mm/yyyy"
                              value={
                                formik.values.receivedDate
                                  ? formatDate(
                                      parseDate(formik.values.receivedDate)
                                    )
                                  : ""
                              }
                              readOnly
                              onClick={() => setShowReceivedCalendar(true)}
                              style={{
                                cursor:
                                  userRole === "Student" || userRole === "LeadStudent"
                                    ? "not-allowed"
                                    : "pointer",
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
                            {showReceivedCalendar && (
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
                                  width: 300,
                                }}
                              >
                                <Calendar
                                  className="form-control border-0"
                                  onChange={(selectedDate) => {
                                    formik.setFieldValue(
                                      "receivedDate",
                                      toISODate(selectedDate)
                                    );
                                    setShowReceivedCalendar(false);
                                  }}
                                  value={
                                    parseDate(formik.values.receivedDate) ||
                                    new Date()
                                  }
                                  locale="en-GB"
                                />
                              </div>
                            )}
                            {formik.touched.receivedDate &&
                              formik.errors.receivedDate && (
                                <div className="text-danger">
                                  {formik.errors.receivedDate}
                                </div>
                              )}
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Visa Issue Date (From → To)</Form.Label>
                          <div className="d-flex gap-2">
                            <div
                              style={{ position: "relative" }}
                              ref={issueFromCalendarRef}
                            >
                              <Form.Control
                                type="text"
                                name="issueFrom"
                                className="custom-select-height"
                                placeholder="dd/mm/yyyy"
                                value={
                                  formik.values.issueFrom
                                    ? formatDate(
                                        parseDate(formik.values.issueFrom)
                                      )
                                    : ""
                                }
                                readOnly
                                onClick={() => setShowIssueFromCalendar(true)}
                                style={{
                                  cursor:
                                    userRole === "Student" || userRole === "LeadStudent"
                                      ? "not-allowed"
                                      : "pointer",
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
                              {showIssueFromCalendar && (
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
                                      formik.setFieldValue(
                                        "issueFrom",
                                        toISODate(selectedDate)
                                      );
                                      setShowIssueFromCalendar(false);
                                    }}
                                    value={
                                      parseDate(formik.values.issueFrom) ||
                                      new Date()
                                    }
                                    locale="en-GB"
                                  />
                                </div>
                              )}
                              {formik.touched.issueFrom &&
                                formik.errors.issueFrom && (
                                  <div className="text-danger">
                                    {formik.errors.issueFrom}
                                  </div>
                                )}
                            </div>
                            <div
                              style={{ position: "relative" }}
                              ref={issueToCalendarRef}
                            >
                              <Form.Control
                                type="text"
                                name="issueTo"
                                className="custom-select-height"
                                placeholder="dd/mm/yyyy"
                                value={
                                  formik.values.issueTo
                                    ? formatDate(
                                        parseDate(formik.values.issueTo)
                                      )
                                    : ""
                                }
                                readOnly
                                onClick={() => setShowIssueToCalendar(true)}
                                style={{
                                  cursor:
                                    userRole === "Student" || userRole === "LeadStudent"
                                      ? "not-allowed"
                                      : "pointer",
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
                              {showIssueToCalendar && (
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
                                      formik.setFieldValue(
                                        "issueTo",
                                        toISODate(selectedDate)
                                      );
                                      setShowIssueToCalendar(false);
                                    }}
                                    value={
                                      parseDate(formik.values.issueTo) ||
                                      new Date()
                                    }
                                    locale="en-GB"
                                  />
                                </div>
                              )}
                              {formik.touched.issueTo &&
                                formik.errors.issueTo && (
                                  <div className="text-danger">
                                    {formik.errors.issueTo}
                                  </div>
                                )}
                            </div>
                          </div>
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Upload Visa Document (Copy / e-Visa) (PDF/JPG)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="documents"
                        multiple
                        className="custom-select-height"
                        accept=".pdf,.jpg,.jpeg"
                        onChange={handleVisaDocumentChange}
                        disabled={userRole === "Student" || userRole === "LeadStudent"
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

export default CanadaVisaDecisionIssuance;
