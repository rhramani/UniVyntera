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
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const CanadaTuitionFeePayment = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentCalendar, setShowPaymentCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const documentTypes = ["Tuition Fee Receipt"];
  const userRole = decryptData(localStorage.getItem("role"));
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const paymentCalendarRef = useRef(null);

  const currencyOptions = [
    { value: "CAD", label: "CAD" },
    { value: "INR", label: "INR" },
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
        paymentCalendarRef.current &&
        !paymentCalendarRef.current.contains(event.target)
      ) {
        setShowPaymentCalendar(false);
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
      amount: "",
      currencyCode: "CAD",
      receiptDocuments: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      paymentDate: Yup.string(),
      academicYear: Yup.string(),
      amount: Yup.number().positive("Amount must be a positive number"),
      currencyCode: Yup.string(),
      receiptDocuments: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            tutuionFeePayment: {
              paymentDate: values.paymentDate || "",
              academicYear: values.academicYear,
              amount: parseFloat(values.amount),
              currencyCode: values.currencyCode,
            },
          },
        };

        const oldData =
          applicationData?.visaApplicationDetails?.tutuionFeePayment || {};
        if (
          oldData.paymentDate !== values.paymentDate ||
          oldData.academicYear !== values.academicYear ||
          oldData.amount !== parseFloat(values.amount) ||
          oldData.currencyCode !== values.currencyCode
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.receiptDocuments) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.receiptDocuments);
          formData.append("customDocumentName", "Tuition Fee Receipt");
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
    if (applicationData?.visaApplicationDetails?.tutuionFeePayment) {
      const tuition = applicationData.visaApplicationDetails.tutuionFeePayment;
      formik.setValues({
        paymentDate: tuition.paymentDate
          ? toISODate(parseDate(tuition.paymentDate))
          : "",
        academicYear: tuition.academicYear || "",
        amount: tuition.amount || "",
        currencyCode: tuition.currencyCode || "CAD",
        receiptDocuments: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("receiptDocuments", file);
  };

  const handleCheckboxChangeId = (docId, docName) => {
    setSelectedDocsIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
    setSelectedDocumentNames((prev) =>
      prev.includes(docName)
        ? prev.filter((name) => name !== docName)
        : [...prev, docName]
    );
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
      .catch(() => {
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
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Payment Date</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={paymentCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      name="paymentDate"
                      className="custom-select-height"
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
                          onChange={(selectedDate) => {
                            formik.setFieldValue(
                              "paymentDate",
                              toISODate(selectedDate)
                            );
                            setShowPaymentCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.paymentDate) || new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.errors.paymentDate &&
                      formik.touched.paymentDate && (
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
                    className="custom-select-height"
                    placeholder="e.g., 2024-2025"
                    value={formik.values.academicYear}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.academicYear &&
                    formik.touched.academicYear && (
                      <div className="text-danger">
                        {formik.errors.academicYear}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <div className="d-flex flex-wrap">
                    <Form.Control
                      type="number"
                      name="amount"
                      className="custom-select-height w-50"
                      placeholder="Enter amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Select
                      options={currencyOptions}
                      className="w-50"
                      value={currencyOptions.find(
                        (option) => option.value === formik.values.currencyCode
                      )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "currencyCode",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      classNamePrefix="custom-select"
                      placeholder="Select currencyCode"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          height: "40px",
                          minHeight: "40px",
                          marginLeft: "5px",
                          borderRadius: "4px",
                          borderColor: "#ced4da",
                          fontSize: "13px",
                          boxShadow: "none",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                      isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </div>
                  {formik.errors.amount && formik.touched.amount && (
                    <div className="text-danger">{formik.errors.amount}</div>
                  )}
                  {formik.errors.currencyCode &&
                    formik.touched.currencyCode && (
                      <div className="text-danger">
                        {formik.errors.currencyCode}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Tuition Fee Receipt (PDF/JPG)</Form.Label>
                  <Form.Control
                    type="file"
                    name="receiptDocuments"
                    accept=".pdf,.jpg,.jpeg"
                    className="custom-select-height"
                    onChange={handleFileChange}
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) =>
                          doc.customDocumentName === "Tuition Fee Receipt"
                      ) || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                </Form.Group>
              </Col>
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

export default CanadaTuitionFeePayment;
