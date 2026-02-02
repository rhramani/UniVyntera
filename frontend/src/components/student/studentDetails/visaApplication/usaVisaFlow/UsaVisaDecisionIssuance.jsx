import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import { useFormik } from "formik";
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
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const UsaVisaDecisionIssuance = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [showVisaFromDateCalendar, setShowVisaFromDateCalendar] =
    useState(false);
  const [showVisaToDateCalendar, setShowVisaToDateCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const visaFromDateCalendarRef = useRef(null);
  const visaToDateCalendarRef = useRef(null);
  const documentTypes = ["Visa Decision Copy"];
  const userRole = decryptData(localStorage.getItem("role"));
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const visaDecisionOptions = [
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
    }
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        visaFromDateCalendarRef.current &&
        !visaFromDateCalendarRef.current.contains(event.target)
      ) {
        setShowVisaFromDateCalendar(false);
      }
      if (
        visaToDateCalendarRef.current &&
        !visaToDateCalendarRef.current.contains(event.target)
      ) {
        setShowVisaToDateCalendar(false);
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
      decision: "",
      visaNumber: "",
      visaValidityFrom: "",
      visaValidityTo: "",
      visaCopy: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      decision: Yup.string().required("Visa decision is required"),
      visaNumber: Yup.string(),
      visaValidityFrom: Yup.string(),
      visaValidityTo: Yup.string(),
      visaCopy: Yup.array().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            decision: {
              decision: values.decision,
              visaNumber:
                values.decision === "Approved" ? values.visaNumber : "",
              validity:
                values.decision === "Approved"
                  ? {
                      from: values.visaValidityFrom,
                      to: values.visaValidityTo,
                    }
                  : "",
            },
          },
        };

        const oldDecision =
          applicationData?.visaApplicationDetails?.decision || {};
        if (
          oldDecision.decision !== values.decision ||
          (values.decision === "Approved" &&
            (oldDecision.visaNumber !== values.visaNumber ||
              oldDecision.validity?.from !== values.visaValidityFrom ||
              oldDecision.validity?.to !== values.visaValidityTo))
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.visaCopy) {
          hasFileUpload = true;
          formData = new FormData();
          // formData.append("uploadedDocument", values.visaCopy);
          values.visaCopy.forEach((file) => {
            formData.append("uploadedDocument", file);
          });
          formData.append("customDocumentName", "Visa Decision Copy");
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
        toast.success("Visa decision details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update visa decision details:", error);
        toast.error(
          "Failed to update visa decision details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.decision) {
      const visa = applicationData.visaApplicationDetails.decision;

      formik.setValues({
        decision: visa.decision || "",
        visaNumber: visa.visaNumber || "",
        visaValidityFrom: toISODate(parseDate(visa.validity?.from)),
        visaValidityTo: toISODate(parseDate(visa.validity.to)),
        visaCopy: [],
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("visaCopy", files);
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
                  <Form.Label>Visa Decision</Form.Label>
                  <Select
                    name="decision"
                    options={visaDecisionOptions}
                    value={visaDecisionOptions.find(
                      (option) => option.value === formik.values.decision
                    )}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "decision",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    classNamePrefix="custom-select"
                    placeholder="Select visa decision"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: "40px",
                        minHeight: "40px",
                        borderRadius: "4px",
                        borderColor: "#ced4da",
                        fontSize: "13px",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#888",
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                    }}
                    isClearable
                    isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.decision && formik.touched.decision && (
                    <div className="text-danger">{formik.errors.decision}</div>
                  )}
                </Form.Group>
              </Col>
              {formik.values.decision === "Approved" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Visa Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="visaNumber"
                        className="custom-select-height"
                        placeholder="Enter visa number"
                        value={formik.values.visaNumber}
                        onChange={formik.handleChange}
                        style={{
                          cursor:
                            userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                        }}
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      {formik.errors.visaNumber &&
                        formik.touched.visaNumber && (
                          <div className="text-danger">
                            {formik.errors.visaNumber}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Visa Validity From</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={visaFromDateCalendarRef}
                      >
                        <Form.Control
                          type="text"
                          name="visaValidityFrom"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.visaValidityFrom
                              ? formatDate(
                                  parseDate(formik.values.visaValidityFrom)
                                )
                              : ""
                          }
                          readOnly
                          onClick={(e) => {
                            e.preventDefault();
                            setShowVisaFromDateCalendar(true);
                          }}
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
                        {showVisaFromDateCalendar && (
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
                                const formattedDate = toISODate(selectedDate);
                                formik.setFieldValue(
                                  "visaValidityFrom",
                                  formattedDate
                                );
                                setShowVisaFromDateCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.visaValidityFrom) ||
                                null
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                        {formik.errors.visaValidityFrom &&
                          formik.touched.visaValidityFrom && (
                            <div className="text-danger">
                              {formik.errors.visaValidityFrom}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Visa Validity To</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={visaToDateCalendarRef}
                      >
                        <Form.Control
                          type="text"
                          name="visaValidityTo"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.visaValidityTo
                              ? formatDate(
                                  parseDate(formik.values.visaValidityTo)
                                )
                              : ""
                          }
                          readOnly
                          onClick={(e) => {
                            e.preventDefault();
                            setShowVisaToDateCalendar(true);
                          }}
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
                        {showVisaToDateCalendar && (
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
                                const formattedDate = toISODate(selectedDate);
                                formik.setFieldValue(
                                  "visaValidityTo",
                                  formattedDate
                                );
                                setShowVisaToDateCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.visaValidityTo) || null
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                        {formik.errors.visaValidityTo &&
                          formik.touched.visaValidityTo && (
                            <div className="text-danger">
                              {formik.errors.visaValidityTo}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Visa Copy Upload</Form.Label>
                      <Form.Control
                        type="file"
                        name="visaCopy"
                        multiple
                        className="custom-select-height"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      {formik.errors.visaCopy && formik.touched.visaCopy && (
                        <div className="text-danger">
                          {formik.errors.visaCopy}
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
                  variant="primary"
                  type="submit"
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
    </>
  );
};

export default UsaVisaDecisionIssuance;
