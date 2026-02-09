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

const GerVisaDecisionIssuance = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showIssueDateCalendar, setShowIssueDateCalendar] = useState(false);
  const [showExpiryDateCalendar, setShowExpiryDateCalendar] = useState(false);
  const issueDateRef = useRef(null);
  const expiryDateRef = useRef(null);

  const dispatch = useDispatch();
  const documentTypes = ["Visa Copy / Grant Document"];
  const userRole = decryptData(localStorage.getItem("role"));
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const decisionOptions = [
    { value: "Approved", label: "Approved" },
    { value: "Refused", label: "Refused" },
    { value: "Pending", label: "Pending" },
  ];

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
      [issueDateRef, expiryDateRef].forEach((ref) => {
        if (ref.current && !ref.current.contains(event.target)) {
          if (ref === issueDateRef) setShowIssueDateCalendar(false);
          if (ref === expiryDateRef) setShowExpiryDateCalendar(false);
        }
      });
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
      status: "",
      visaNumber: "",
      issueDate: "",
      expiryDate: "",
      visaDocUpload: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      status: Yup.string().required("Decision status is required"),
      visaNumber: Yup.string(),
      issueDate: Yup.string(),
      expiryDate: Yup.string(),
      visaDocUpload: Yup.array().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const refModuleId = applicationData.visaApplicationDetails._id;

        const oldDecision =
          applicationData?.visaApplicationDetails?.visaDecision || {};
        const jsonData = {
          visaApplicationDetails: {
            visaDecision: {
              status: values.status,
              visaNumber: values.visaNumber || null,
              issueDate: values.issueDate,
              expiryDate: values.expiryDate,
            },
          },
        };

        const hasJsonChanges =
          oldDecision.status !== values.status ||
          oldDecision.visaNumber !== values.visaNumber ||
          oldDecision.issueDate !== values.issueDate ||
          oldDecision.expiryDate !== values.expiryDate;

        const hasFileUpload = !!values.visaDocUpload;

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          setIsLoading(false);
          return;
        }

        if (hasFileUpload) {
          let formData = new FormData();
          // formData.append("uploadedDocument", values.visaDocUpload);
          values.visaDocUpload.forEach((file) => {
            formData.append("uploadedDocument", file);
          });
          formData.append("customDocumentName", "Visa Copy / Grant Document");
          formData.append("ref_module", refModuleId);

          const uploadResponse = await dispatch(
            updateStudentApplication(formData, id)
          );

          if (uploadResponse?.data?.documentId) {
            jsonData.visaApplicationDetails.visaDecision.visaDocUpload =
              uploadResponse.data.documentId;
          }
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
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
        issueDate: visaDecision.issueDate
          ? toISODate(parseDate(visaDecision.issueDate))
          : "",
        expiryDate: visaDecision.expiryDate
          ? toISODate(parseDate(visaDecision.expiryDate))
          : "",
        visaDocUpload: [],
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
        <h5>Visa Decision & Issuance</h5>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Decision Status</Form.Label>
                  <Select
                    name="status"
                    value={decisionOptions.find(
                      (option) => option.value === formik.values.status
                    )}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "status",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    onBlur={() => formik.setFieldTouched("status", true)}
                    options={decisionOptions}
                    placeholder="Select Status"
                    isClearable
                    classNamePrefix="custom-select"
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
                    isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-danger small">
                      {formik.errors.status}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter visa number"
                    value={formik.values.visaNumber}
                    onChange={formik.handleChange}
                    name="visaNumber"
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.visaNumber && formik.errors.visaNumber && (
                    <div className="text-danger small">
                      {formik.errors.visaNumber}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Issue Date</Form.Label>
                  <div style={{ position: "relative" }} ref={issueDateRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.issueDate
                          ? formatDate(parseDate(formik.values.issueDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowIssueDateCalendar(true)}
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
                    {showIssueDateCalendar && (
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
                            formik.setFieldValue("issueDate", formattedDate);
                            setShowIssueDateCalendar(false);
                          }}
                          value={parseDate(formik.values.issueDate) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.issueDate && formik.errors.issueDate && (
                      <div className="text-danger small">
                        {formik.errors.issueDate}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Expiry Date</Form.Label>
                  <div style={{ position: "relative" }} ref={expiryDateRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.expiryDate
                          ? formatDate(parseDate(formik.values.expiryDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowExpiryDateCalendar(true)}
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
                    {showExpiryDateCalendar && (
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
                            formik.setFieldValue("expiryDate", formattedDate);
                            setShowExpiryDateCalendar(false);
                          }}
                          value={parseDate(formik.values.expiryDate) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.expiryDate && formik.errors.expiryDate && (
                      <div className="text-danger small">
                        {formik.errors.expiryDate}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Visa Copy / Grant Document</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "visaDocUpload",
                        Array.from(event.currentTarget.files)
                      )
                    }
                    multiple
                    className="custom-select-height"
                    disabled={userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.visaDocUpload &&
                    formik.errors.visaDocUpload && (
                      <div className="text-danger small">
                        {formik.errors.visaDocUpload}
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

export default GerVisaDecisionIssuance;
