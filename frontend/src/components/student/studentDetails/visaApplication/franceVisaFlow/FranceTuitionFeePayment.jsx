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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const FranceTuitionFeePayment = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDateCalendar, setShowPaymentDateCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const dispatch = useDispatch();
  const paymentDateRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Tuition Fee Payment Receipt"];
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

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
        paymentDateRef.current &&
        !paymentDateRef.current.contains(event.target)
      ) {
        setShowPaymentDateCalendar(false);
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
      paymentDate: "",
      academicYear: "",
      currency: "",
      amount: "",
      receiptUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      paymentDate: Yup.string(),
      academicYear: Yup.string(),
      currency: Yup.string(),
      amount: Yup.string(),
      receiptUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            tuitionFeePayment: {
              paymentDate: values.paymentDate || "",
              academicYear: values.academicYear,
              currency: values.currency,
              amount: values.amount || "",
            },
          },
        };

        const oldPayment =
          applicationData?.visaApplicationDetails?.tuitionFeePayment || {};

        if (
          oldPayment.paymentDate !== values.paymentDate ||
          oldPayment.academicYear !== values.academicYear ||
          oldPayment.currency !== values.currency ||
          oldPayment.amount !== values.amount
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.receiptUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.receiptUpload);
          formData.append("customDocumentName", "Tuition Fee Payment Receipt");
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
        toast.success("Tuition fee payment details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update tuition fee payment details:", error);
        toast.error(
          error.message ||
            "Failed to update tuition fee payment details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.tuitionFeePayment) {
      const tuitionFeePayment =
        applicationData.visaApplicationDetails.tuitionFeePayment;

      formik.setValues({
        paymentDate: tuitionFeePayment.paymentDate
          ? toISODate(parseDate(tuitionFeePayment.paymentDate))
          : "",
        academicYear: tuitionFeePayment.academicYear || "",
        currency: tuitionFeePayment.currency || "",
        amount: tuitionFeePayment.amount ? tuitionFeePayment.amount : "",
        receiptUpload: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("receiptUpload", file);
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
          <h5>Tuition Fee Payment</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Payment Date</Form.Label>
                  <div style={{ position: "relative" }} ref={paymentDateRef}>
                    <Form.Control
                      type="text"
                      name="paymentDate"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.paymentDate
                          ? formatDate(parseDate(formik.values.paymentDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowPaymentDateCalendar(true)}
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
                    {showPaymentDateCalendar && (
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
                              "paymentDate",
                              toISODate(date)
                            );
                            setShowPaymentDateCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.paymentDate) || new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.paymentDate &&
                      formik.errors.paymentDate && (
                        <div className="text-danger">
                          {formik.errors.paymentDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Academic Year</Form.Label>
                  <Form.Control
                    type="text"
                    name="academicYear"
                    placeholder="Enter academic year (e.g., 2025-2026)"
                    value={formik.values.academicYear}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.academicYear &&
                    formik.errors.academicYear && (
                      <div className="text-danger">
                        {formik.errors.academicYear}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Currency</Form.Label>
                  <Select
                    name="currency"
                    options={[
                      { value: "EUR", label: "EUR" },
                      { value: "INR", label: "INR" },
                      { value: "USD", label: "USD" },
                      { value: "GBP", label: "GBP" },
                    ]}
                    value={[
                      { value: "EUR", label: "EUR" },
                      { value: "INR", label: "INR" },
                      { value: "USD", label: "USD" },
                      { value: "GBP", label: "GBP" },
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
                    <div className="text-danger">{formik.errors.currency}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    placeholder="Enter amount (e.g., 5000.00)"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="text-danger">{formik.errors.amount}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Fee Receipt (PDF/JPG/PNG)</Form.Label>
                  <Form.Control
                    type="file"
                    name="receiptUpload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="custom-select-height"
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) =>
                          doc.customDocumentName ===
                          "Tuition Fee Payment Receipt"
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
                  className="custom-select-height"
                  variant="primary"
                  disabled={
                    isLoading || !applicationData?.visaApplicationDetails?._id
                  }
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

export default FranceTuitionFeePayment;
