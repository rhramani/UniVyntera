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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const AusTuitionFeePayment = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showPaymentCalendar, setShowPaymentCalendar] = useState(false);
  const paymentCalendarRef = useRef(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Tuition Fee Receipts"];

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
  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.tuitionFeePayment) {
      const tuitionFeePayment =
        applicationData?.visaApplicationDetails.tuitionFeePayment;
      formik.setValues({
        amount: tuitionFeePayment.amount || "",
        currency: tuitionFeePayment.currency || "",
        academicPeriod: tuitionFeePayment.academicPeriod || "",
        paymentDate: tuitionFeePayment.paymentDate
          ? toISODate(parseDate(tuitionFeePayment.paymentDate))
          : "",
        receiptUpload: "",
      });
    }
  }, [applicationData]);

  const formik = useFormik({
    initialValues: {
      paymentDate: "",
      amount: "",
      currency: "",
      academicPeriod: "",
      receiptUpload: "",
    },
    validationSchema: Yup.object({
      paymentDate: Yup.string(),
      amount: Yup.string(),
      currency: Yup.string(),
      academicPeriod: Yup.string(),
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
              paymentDate: values.paymentDate,
              amount: values.amount,
              currency: values.currency,
              academicPeriod: values.academicPeriod,
            },
          },
        };

        const oldPayment =
          applicationData?.visaApplicationDetails?.tuitionFeePayment || {};
        if (
          oldPayment.paymentDate !== values.paymentDate ||
          oldPayment.amount !== values.amount ||
          oldPayment.currency !== values.currency ||
          oldPayment.academicPeriod !== values.academicPeriod
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.receiptUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.receiptUpload);
          formData.append("customDocumentName", "Tuition Fee Receipts");
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
        toast.success("Tuition Fee Payment details updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update Tuition Fee Payment details.");
      } finally {
        setIsLoading(false);
      }
    },
  });

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
      <h5>Tuition Fee Payment</h5>
      <div className="bg-white mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Payment Date</Form.Label>
                <div style={{ position: "relative" }} ref={paymentCalendarRef}>
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
                          formik.setFieldValue("paymentDate", toISODate(date));
                          setShowPaymentCalendar(false);
                        }}
                        value={parseDate(formik.values.paymentDate) || null}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>

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
                      height: "40px",
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
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Amount (AUD/INR)</Form.Label>
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
                <Form.Label>Academic Year / Semester</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 2025 / Semester 1"
                  value={formik.values.academicPeriod}
                  onChange={formik.handleChange}
                  name="academicPeriod"
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
                <Form.Label>Upload Fee Receipt</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="custom-select-height"
                  disabled={
                    applicationData?.uploadedDocumentDetails?.some(
                      (doc) => doc.customDocumentName === "Tuition Fee Receipts"
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

export default AusTuitionFeePayment;
