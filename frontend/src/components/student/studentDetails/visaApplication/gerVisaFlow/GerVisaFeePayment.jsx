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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const GerVisaFeePayment = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showPaymentCalendar, setShowPaymentCalendar] = useState(false);
  const paymentCalendarRef = useRef(null);

  const dispatch = useDispatch();
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Visa Fee Payment Receipt"];

  const paymentModeOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Bank", label: "Bank" },
    { value: "Online", label: "Online" },
  ];

  const currencyOptions = [
    { value: "EUR", label: "EUR" },
    { value: "INR", label: "INR" },
  ];

  const statusOptions = [
    { value: "verified", label: "Verified" },
    { value: "unverified", label: "Unverified" },
    { value: "Reupload", label: "Reupload" },
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
        paymentCalendarRef.current &&
        !paymentCalendarRef.current.contains(event.target)
      ) {
        setShowPaymentCalendar(false);
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
      amount: "",
      currency: "",
      mode: "",
      paymentDate: "",
      receiptUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Payment amount is required")
        .positive("Payment amount must be positive"),
      currency: Yup.string().required("Currency code is required"),
      mode: Yup.string().required("Payment mode is required"),
      paymentDate: Yup.string().required("Payment date is required"),
      receiptUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const oldPayment =
          applicationData?.visaApplicationDetails?.visaFeePayment || {};

        let hasJsonChanges = false;
        let hasFileUpload = !!values.receiptUpload;

        if (
          oldPayment.amount !== parseFloat(values.amount) ||
          oldPayment.currency !== values.currency ||
          oldPayment.mode !== values.mode ||
          oldPayment.paymentDate !== values.paymentDate
        ) {
          hasJsonChanges = true;
        }
        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          return;
        }

        if (hasJsonChanges) {
          const jsonData = {
            visaApplicationDetails: {
              visaFeePayment: {
                amount: parseFloat(values.amount),
                currency: values.currency,
                mode: values.mode,
                paymentDate: values.paymentDate,
              },
            },
          };
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload) {
          const refModuleId = applicationData.visaApplicationDetails._id;
          let formData = new FormData();
          formData.append("uploadedDocument", values.receiptUpload);
          formData.append("customDocumentName", "Visa Fee Payment Receipt");
          formData.append("ref_module", refModuleId);

          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Visa Fee Payment details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update visa fee payment details:", error);
        toast.error(
          error.message ||
            "Failed to update visa fee payment details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.visaFeePayment) {
      const visaFeePayment =
        applicationData.visaApplicationDetails.visaFeePayment;
      formik.setValues({
        amount: visaFeePayment.amount || "",
        currency: visaFeePayment.currency || "",
        mode: visaFeePayment.mode || "",
        paymentDate: visaFeePayment.paymentDate
          ? toISODate(parseDate(visaFeePayment.paymentDate))
          : "",
        receiptUpload: "",
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
        <h5>Visa Fee Payment</h5>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Currency</Form.Label>
                  <Select
                    name="currency"
                    options={currencyOptions}
                    value={currencyOptions.find(
                      (option) => option.value === formik.values.currency
                    )}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "currency",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    onBlur={() => formik.setFieldTouched("currency", true)}
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
                  <Form.Label>Payment Amount (EUR/INR)</Form.Label>
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
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="text-danger small">
                      {formik.errors.amount}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Payment Mode</Form.Label>
                  <Select
                    name="mode"
                    options={paymentModeOptions}
                    value={paymentModeOptions.find(
                      (option) => option.value === formik.values.mode
                    )}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "mode",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    onBlur={() => formik.setFieldTouched("mode", true)}
                    placeholder="Select Payment Mode"
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
                  {formik.touched.mode && formik.errors.mode && (
                    <div className="text-danger small">
                      {formik.errors.mode}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Payment Date</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={paymentCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.paymentDate
                          ? formatDate(parseDate(formik.values.paymentDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowPaymentCalendar(true)}
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
                    {showPaymentCalendar && (
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
                            formik.setFieldValue("paymentDate", formattedDate);
                            setShowPaymentCalendar(false);
                          }}
                          value={parseDate(formik.values.paymentDate) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.paymentDate &&
                      formik.errors.paymentDate && (
                        <div className="text-danger small">
                          {formik.errors.paymentDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Payment Receipt</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "receiptUpload",
                        event.currentTarget.files[0]
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) =>
                          doc.customDocumentName ===
                            "Visa Fee Payment Receipt" &&
                          doc.status !== "Reupload"
                      ) || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.receiptUpload &&
                    formik.errors.receiptUpload && (
                      <div className="text-danger small">
                        {formik.errors.receiptUpload}
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

export default GerVisaFeePayment;
