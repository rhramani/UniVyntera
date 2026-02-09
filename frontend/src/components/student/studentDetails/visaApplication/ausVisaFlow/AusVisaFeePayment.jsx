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

const AusVisaFeePayment = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Visa Fee"];

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
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayDateTime = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatPayloadDateTime = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr instanceof Date && !isNaN(dateStr)) return dateStr;

    const parsed = new Date(dateStr);
    return isNaN(parsed) ? null : parsed;
  };
  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.visaFeePayment) {
      const visaFeePayment =
        applicationData?.visaApplicationDetails.visaFeePayment;
      formik.setValues({
        amount: visaFeePayment.amount || "",
        currency: visaFeePayment.currency || "",
        paymentDateTime: visaFeePayment.paymentDateTime
          ? parseDate(visaFeePayment.paymentDateTime)
          : "",
        receiptUpload: null,
      });
    }
  }, [applicationData]);

  const formik = useFormik({
    initialValues: {
      amount: "",
      currency: "",
      paymentDateTime: "",
      receiptUpload: "",
    },
    validationSchema: Yup.object({
      amount: Yup.string(),
      currency: Yup.string(),
      paymentDateTime: Yup.string(),
      receiptUpload: Yup.string().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            visaFeePayment: {
              amount: values.amount,
              currency: values.currency,
              paymentDateTime: values.paymentDateTime
                ? formatPayloadDateTime(values.paymentDateTime)
                : "",
            },
          },
        };

        const oldPayment =
          applicationData?.visaApplicationDetails?.visaFeePayment || {};
        if (
          oldPayment.amount !== values.amount ||
          oldPayment.currency !== values.currency ||
          oldPayment.paymentDateTime !==
            jsonData.visaApplicationDetails.visaFeePayment.paymentDateTime
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.receiptUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.receiptUpload);
          formData.append("customDocumentName", "Visa Fee");
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
        toast.success("Visa Fee Payment details updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update Visa Fee Payment details.");
      } finally {
        setIsLoading(false);
      }
    },
  });
console.log("formik", formik.errors)
  const handleFileChange = (event) => {
    formik.setFieldValue("receiptUpload", event.target.files[0]);
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
      <h5>Visa Fee Payment</h5>
      <div className="bg-white rounded mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Currency</Form.Label>
                <Select
                  name="currency"
                  options={[
                    { value: "AUD", label: "AUD" },
                    { value: "INR", label: "INR" },
                  ]}
                  value={[
                    { value: "AUD", label: "AUD" },
                    { value: "INR", label: "INR" },
                  ].find((option) => option.value === formik.values.currency)}
                  onChange={(selectedOption) =>
                    formik.setFieldValue(
                      "currency",
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
                  placeholder="Select currency"
                  classNamePrefix="custom-select"
                  isClearable
                  isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                />
                {formik.touched.currency && formik.errors.currency && (
                  <div className="text-danger small">
                    {formik.errors.currency}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Payment Amount (AUD/INR)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  name="amount"
                  className="custom-select-height"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Payment Date & Time</Form.Label>
                <div style={{ position: "relative" }} ref={calendarRef}>
                  <Form.Control
                    type="text"
                    placeholder="dd/mm/yyyy – hh:mm"
                    value={
                      formik.values.paymentDateTime
                        ? formatDisplayDateTime(formik.values.paymentDateTime)
                        : ""
                    }
                    readOnly
                    onClick={() => setShowCalendar(true)}
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
                  {showCalendar && (
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
                        padding: "10px",
                      }}
                    >
                      <Calendar
                        className="form-control border-0"
                        onChange={(date) => {
                          const currentDateTime =
                            formik.values.paymentDateTime || new Date();
                          const updatedDateTime = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                            currentDateTime.getHours(),
                            currentDateTime.getMinutes()
                          );
                          formik.setFieldValue(
                            "paymentDateTime",
                            updatedDateTime
                          );
                        }}
                        value={
                          formik.values.paymentDateTime
                            ? parseDate(formik.values.paymentDateTime)
                            : new Date()
                        }
                        locale="en-GB"
                      />
                      <Form.Control
                        type="time"
                        className="mt-2"
                        value={
                          formik.values.paymentDateTime
                            ? formik.values.paymentDateTime
                                .toTimeString()
                                .slice(0, 5)
                            : ""
                        }
                        onChange={(e) => {
                          const currentDateTime =
                            formik.values.paymentDateTime || new Date();
                          const [hours, minutes] = e.target.value.split(":");
                          const updatedDateTime = new Date(
                            currentDateTime.getFullYear(),
                            currentDateTime.getMonth(),
                            currentDateTime.getDate(),
                            hours,
                            minutes
                          );
                          formik.setFieldValue(
                            "paymentDateTime",
                            updatedDateTime
                          );
                        }}
                      />
                    </div>
                  )}
                  {formik.touched.paymentDateTime &&
                    formik.errors.paymentDateTime && (
                      <div className="text-danger">
                        {formik.errors.paymentDateTime}
                      </div>
                    )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Upload Visa Fee Receipt (PDF/JPG)</Form.Label>
                <Form.Control
                  type="file"
                  name="receiptUpload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="custom-select-height"
                  disabled={
                    applicationData?.uploadedDocumentDetails?.some(
                      (doc) => doc.customDocumentName === "Visa Fee"
                    ) || userRole === "Student" || userRole === "LeadStudent"
                  }
                />
              </Form.Group>
            </Col>
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

export default AusVisaFeePayment;
