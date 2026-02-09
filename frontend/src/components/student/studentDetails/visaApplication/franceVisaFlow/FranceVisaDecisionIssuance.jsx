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
import Select from "react-select";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const FranceVisaDecisionIssuance = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showGrantDateCalendar, setShowGrantDateCalendar] = useState(false);
  const [showValidityFromCalendar, setShowValidityFromCalendar] =
    useState(false);
  const [showValidityToCalendar, setShowValidityToCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const dispatch = useDispatch();
  const grantDateRef = useRef(null);
  const validityFromRef = useRef(null);
  const validityToRef = useRef(null);

  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Visa Decision & Issuance Copy"];

  const visaOptions = [
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
        grantDateRef.current &&
        !grantDateRef.current.contains(event.target)
      ) {
        setShowGrantDateCalendar(false);
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

  const formik = useFormik({
    initialValues: {
      status: "",
      visaNumber: "",
      grantDate: "",
      visaValidityFrom: "",
      visaValidityTo: "",
      visaDocUpload: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      status: Yup.string().required("Visa status is required"),
      visaNumber: Yup.string(),
      grantDate: Yup.string(),
      visaValidityFrom: Yup.string(),
      visaValidityTo: Yup.string(),
      visaDocUpload: Yup.array().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            visaDecision: {
              status: values.status,
              visaNumber: values.status === "Approved" ? values.visaNumber : "",
              grantDate:
                values.status === "Approved" && values.grantDate
                  ? values.grantDate
                  : "",
              validity: {
                from:
                  values.status === "Approved" && values.visaValidityFrom
                    ? values.visaValidityFrom
                    : "",
                to:
                  values.status === "Approved" && values.visaValidityTo
                    ? values.visaValidityTo
                    : "",
              },
            },
          },
        };

        const oldVisaDecision =
          applicationData?.visaApplicationDetails?.visaDecision || {};
        if (
          oldVisaDecision.status !== values.status ||
          oldVisaDecision.visaNumber !== values.visaNumber ||
          oldVisaDecision.grantDate !== values.grantDate ||
          oldVisaDecision.validity?.from !== values.visaValidityFrom ||
          oldVisaDecision.validity?.to !== values.visaValidityTo
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.visaDocUpload) {
          hasFileUpload = true;
          formData = new FormData();
          // formData.append("uploadedDocument", values.visaDocUpload);
          values.visaDocUpload.forEach((file) => {
            formData.append("uploadedDocument", file);
          });
          formData.append(
            "customDocumentName",
            "Visa Decision & Issuance Copy"
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
        toast.success("Visa Decision & Issuance details updated successfully!");
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
      const visaDecision = applicationData.visaApplicationDetails.visaDecision;
      formik.setValues({
        status: visaDecision.status || "",
        visaNumber: visaDecision.visaNumber || "",
        grantDate: visaDecision.grantDate
          ? toISODate(parseDate(visaDecision.grantDate))
          : "",
        visaValidityFrom: visaDecision.validity?.from
          ? toISODate(parseDate(visaDecision.validity.from))
          : "",
        visaValidityTo: visaDecision.validity?.to
          ? toISODate(parseDate(visaDecision.validity.to))
          : "",
        visaDocUpload: [],
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("visaDocUpload", files);
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
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Status</Form.Label>
                  <Select
                    name="status"
                    options={visaOptions}
                    value={visaOptions.find(
                      (option) => option.value === formik.values.status
                    )}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "status",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "40px",
                        borderRadius: "4px",
                        borderColor: "#ced4da",
                        boxShadow: "none",
                        "&:hover": { borderColor: "#888" },
                      }),
                      menu: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    placeholder="Select status"
                    classNamePrefix="custom-select"
                    isClearable
                    isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-danger">{formik.errors.status}</div>
                  )}
                </Form.Group>
              </Col>

              {formik.values.status === "Approved" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Visa Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="visaNumber"
                        placeholder="Enter visa number"
                        value={formik.values.visaNumber}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                        style={{
                          cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
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
                      <Form.Label>Visa Grant Date</Form.Label>
                      <div style={{ position: "relative" }} ref={grantDateRef}>
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
                          onClick={() => setShowGrantDateCalendar(true)}
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
                        {showGrantDateCalendar && (
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
                                  "grantDate",
                                  toISODate(date)
                                );
                                setShowGrantDateCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.grantDate) || new Date()
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                        {formik.touched.grantDate &&
                          formik.errors.grantDate && (
                            <div className="text-danger">
                              {formik.errors.grantDate}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Visa Validity From</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={validityFromRef}
                      >
                        <Form.Control
                          type="text"
                          name="visaValidityFrom"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.visaValidityFrom
                              ? formatDate(
                                  parseDate(formik.values.visaValidityFrom)
                                )
                              : ""
                          }
                          readOnly
                          onClick={() => setShowValidityFromCalendar(true)}
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
                                  "visaValidityFrom",
                                  toISODate(date)
                                );
                                setShowValidityFromCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.visaValidityFrom) ||
                                new Date()
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                        {formik.touched.visaValidityFrom &&
                          formik.errors.visaValidityFrom && (
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
                      <div style={{ position: "relative" }} ref={validityToRef}>
                        <Form.Control
                          type="text"
                          name="visaValidityTo"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.visaValidityTo
                              ? formatDate(
                                  parseDate(formik.values.visaValidityTo)
                                )
                              : ""
                          }
                          readOnly
                          onClick={() => setShowValidityToCalendar(true)}
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
                                  "visaValidityTo",
                                  toISODate(date)
                                );
                                setShowValidityToCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.visaValidityTo) ||
                                new Date()
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                        {formik.touched.visaValidityTo &&
                          formik.errors.visaValidityTo && (
                            <div className="text-danger">
                              {formik.errors.visaValidityTo}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>
                </>
              )}

              {(formik.values.status === "Approved" ||
                formik.values.status === "Refused") && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Upload Visa Copy / e-Visa (PDF/JPG/PNG)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      name="visaDocUpload"
                      accept=".pdf,.jpg,.jpeg,.png"
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

export default FranceVisaDecisionIssuance;
