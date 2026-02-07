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

const GerHealthInsurance = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const fromCalendarRef = useRef(null);
  const toCalendarRef = useRef(null);

  const dispatch = useDispatch();
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Health Insurance Certificate"];

  const providerOptions = [
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" },
  ];

  const insuranceTypeOptions = [
    { value: "Temporary", label: "Temporary" },
    { value: "Long-term", label: "Long-term" },
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
      if (
        fromCalendarRef.current &&
        !fromCalendarRef.current.contains(event.target) &&
        toCalendarRef.current &&
        !toCalendarRef.current.contains(event.target)
      ) {
        setShowFromCalendar(false);
        setShowToCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }
    if (dateStr.includes("-")) {
      const parsedDate = new Date(dateStr);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
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
      providerName: "",
      insuranceType: "",
      policyNumber: "",
      validityFrom: "",
      validityTo: "",
      certificateUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      providerName: Yup.string(),
      insuranceType: Yup.string(),
      policyNumber: Yup.string(),
      validityFrom: Yup.string(),
      validityTo: Yup.string(),
      certificateUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldData =
          applicationData?.visaApplicationDetails?.healthInsurance || {};

        const jsonData = {
          visaApplicationDetails: {
            healthInsurance: {
              providerName: values.providerName,
              insuranceType: values.insuranceType,
              policyNumber: values.policyNumber,
              validity: {
                from: values.validityFrom,
                to: values.validityTo,
              },
            },
          },
        };

        if (
          oldData.providerName !== values.providerName ||
          oldData.insuranceType !== values.insuranceType ||
          oldData.policyNumber !== values.policyNumber ||
          (oldData.validity?.from || "") !== values.validityFrom ||
          (oldData.validity?.to || "") !== values.validityTo
        ) {
          hasJsonChanges = true;
        }

        if (values.certificateUpload) {
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
          const refModuleId = applicationData.visaApplicationDetails._id;
          let formData = new FormData();
          formData.append("uploadedDocument", values.certificateUpload);
          formData.append("customDocumentName", "Health Insurance Certificate");
          formData.append("ref_module", refModuleId);

          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Health Insurance details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update health insurance details:", error);
        toast.error(
          error.message ||
            "Failed to update health insurance details. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.healthInsurance) {
      const healthInsurance =
        applicationData.visaApplicationDetails.healthInsurance;
      formik.setValues({
        providerName: healthInsurance.providerName || "",
        insuranceType: healthInsurance.insuranceType || "",
        policyNumber: healthInsurance.policyNumber || "",
        validityFrom: healthInsurance.validity?.from
          ? toISODate(parseDate(healthInsurance.validity.from))
          : "",
        validityTo: healthInsurance.validity?.to
          ? toISODate(parseDate(healthInsurance.validity.to))
          : "",
        certificateUpload: "",
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
        <h5>Health Insurance</h5>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Provider Name</Form.Label>
                  <Select
                    options={providerOptions}
                    value={providerOptions.find(
                      (o) => o.value === formik.values.providerName,
                    )}
                    onChange={(selected) =>
                      formik.setFieldValue(
                        "providerName",
                        selected?.value || "",
                      )
                    }
                    classNamePrefix="custom-select"
                    placeholder="Select option"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                    isClearable
                    isDisabled={
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.providerName &&
                    formik.errors.providerName && (
                      <div className="text-danger">
                        {formik.errors.providerName}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Insurance Type</Form.Label>
                  <Select
                    options={insuranceTypeOptions}
                    value={insuranceTypeOptions.find(
                      (o) => o.value === formik.values.insuranceType,
                    )}
                    onChange={(selected) =>
                      formik.setFieldValue(
                        "insuranceType",
                        selected?.value || "",
                      )
                    }
                    classNamePrefix="custom-select"
                    placeholder="Select option"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                    isClearable
                    isDisabled={
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.insuranceType &&
                    formik.errors.insuranceType && (
                      <div className="text-danger">
                        {formik.errors.insuranceType}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Policy Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter policy number"
                    value={formik.values.policyNumber}
                    onChange={formik.handleChange}
                    name="policyNumber"
                    className="custom-select-height"
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent"
                          ? "not-allowed"
                          : "",
                    }}
                    disabled={
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.policyNumber &&
                    formik.errors.policyNumber && (
                      <div className="text-danger">
                        {formik.errors.policyNumber}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Validity From</Form.Label>
                  <div style={{ position: "relative" }} ref={fromCalendarRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.validityFrom
                          ? formatDate(parseDate(formik.values.validityFrom))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowFromCalendar(true)}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent"
                            ? "not-allowed"
                            : "pointer",
                        paddingRight: "40px",
                      }}
                      className="custom-select-height"
                      disabled={
                        userRole === "Student" || userRole === "LeadStudent"
                      }
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
                    {showFromCalendar && (
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
                              "validityFrom",
                              toISODate(date),
                            );
                            setShowFromCalendar(false);
                          }}
                          value={parseDate(formik.values.validityFrom) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.validityFrom &&
                      formik.errors.validityFrom && (
                        <div className="text-danger">
                          {formik.errors.validityFrom}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Validity To</Form.Label>
                  <div style={{ position: "relative" }} ref={toCalendarRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.validityTo
                          ? formatDate(parseDate(formik.values.validityTo))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowToCalendar(true)}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent"
                            ? "not-allowed"
                            : "pointer",
                        paddingRight: "40px",
                      }}
                      className="custom-select-height"
                      disabled={
                        userRole === "Student" || userRole === "LeadStudent"
                      }
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
                    {showToCalendar && (
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
                            formik.setFieldValue("validityTo", toISODate(date));
                            setShowToCalendar(false);
                          }}
                          value={parseDate(formik.values.validityTo) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.validityTo && formik.errors.validityTo && (
                      <div className="text-danger">
                        {formik.errors.validityTo}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Insurance Certificate</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "certificateUpload",
                        event.currentTarget.files[0],
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) =>
                          doc.customDocumentName ===
                          "Health Insurance Certificate",
                      ) ||
                      userRole === "Student" ||
                      userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.certificateUpload &&
                    formik.errors.certificateUpload && (
                      <div className="text-danger">
                        {formik.errors.certificateUpload}
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

export default GerHealthInsurance;
