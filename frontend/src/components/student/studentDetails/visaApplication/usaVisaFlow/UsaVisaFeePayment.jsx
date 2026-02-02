import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const UsaVisaFeePayment = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const paymentDateCalendarRef = useRef(null);
  const documentTypes = ["Payment Receipt"];
  const userRole = decryptData(localStorage.getItem("role"));
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
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
        paymentDateCalendarRef.current &&
        !paymentDateCalendarRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
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
      paymentMode: "",
      paymentModeOther: "",
      paymentAmount: "",
      paymentCurrency: "",
      paymentDate: "",
      paymentReffNo: "",
      paymentReceipt: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      paymentMode: Yup.string().required("Please select a payment mode"),
      paymentModeOther: Yup.string().when("paymentMode", {
        is: "Other",
        then: Yup.string().required("Please specify the payment mode"),
      }),
      paymentAmount: Yup.number().required("Payment amount is required"),
      paymentCurrency: Yup.string().required("Please select a currency"),
      paymentDate: Yup.string().required("Payment date is required"),
      paymentReffNo: Yup.string().required(
        "Payment reference number is required"
      ),
      paymentReceipt: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            visaFeePayment: {
              paymentMode:
                values.paymentMode === "Other"
                  ? values.paymentModeOther
                  : values.paymentMode,
              paymentAmount: Number(values.paymentAmount),
              paymentCurrency: values.paymentCurrency,
              paymentDate: values.paymentDate,
              paymentReffNo: values.paymentReffNo,
            },
          },
        };

        const oldPayment =
          applicationData?.visaApplicationDetails?.visaFeePayment || {};

        if (
          oldPayment.paymentMode !==
            jsonData.visaApplicationDetails.visaFeePayment.paymentMode ||
          oldPayment.paymentAmount !==
            jsonData.visaApplicationDetails.visaFeePayment.paymentAmount ||
          oldPayment.paymentCurrency !==
            jsonData.visaApplicationDetails.visaFeePayment.paymentCurrency ||
          oldPayment.paymentDate !==
            jsonData.visaApplicationDetails.visaFeePayment.paymentDate ||
          oldPayment.paymentReffNo !==
            jsonData.visaApplicationDetails.visaFeePayment.paymentReffNo
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.paymentReceipt) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.paymentReceipt);
          formData.append("customDocumentName", "Payment Receipt");
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
        toast.success("Visa fee payment updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update visa fee payment:", error);
        toast.error("Failed to update visa fee payment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.visaFeePayment) {
      const payment = applicationData.visaApplicationDetails.visaFeePayment;
      formik.setValues({
        paymentMode: ["Online", "Bank", "UPI", "Gpay", "Netbanking"].includes(
          payment.paymentMode
        )
          ? payment.paymentMode
          : "Other",
        paymentModeOther: [
          "Online",
          "Bank",
          "UPI",
          "Gpay",
          "Netbanking",
        ].includes(payment.paymentMode)
          ? ""
          : payment.paymentMode || "",
        paymentAmount: payment.paymentAmount || "",
        paymentCurrency: payment.paymentCurrency || "",
        paymentDate: toISODate(parseDate(payment.paymentDate)) || "",
        paymentReffNo: payment.paymentReffNo || "",
        paymentReceipt: null,
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("paymentReceipt", file);
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
          <h5>Visa Fee Payment</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Payment Mode</Form.Label>
                  <Select
                    name="paymentMode"
                    options={[
                      { value: "Online", label: "Online" },
                      { value: "Bank", label: "Bank" },
                      { value: "UPI", label: "UPI" },
                      { value: "Gpay", label: "Gpay" },
                      { value: "Netbanking", label: "Netbanking" },
                      { value: "Other", label: "Other" },
                    ]}
                    value={[
                      { value: "Online", label: "Online" },
                      { value: "Bank", label: "Bank" },
                      { value: "UPI", label: "UPI" },
                      { value: "Gpay", label: "Gpay" },
                      { value: "Netbanking", label: "Netbanking" },
                      { value: "Other", label: "Other" },
                    ].find(
                      (option) => option.value === formik.values.paymentMode
                    )}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "paymentMode",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    placeholder="Select payment mode"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: "40px",
                        minHeight: "40px",
                        borderRadius: "4px",
                        borderColor: "#ced4da",
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
                    isSearchable
                    isClearable
                    isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.values.paymentMode === "Other" && (
                    <Form.Control
                      type="text"
                      name="paymentModeOther"
                      className="custom-select-height mt-2"
                      placeholder="Specify other payment mode"
                      value={formik.values.paymentModeOther}
                      onChange={formik.handleChange}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  )}
                  {formik.errors.paymentMode && formik.touched.paymentMode && (
                    <div className="text-danger">
                      {formik.errors.paymentMode}
                    </div>
                  )}
                  {formik.errors.paymentModeOther &&
                    formik.touched.paymentModeOther && (
                      <div className="text-danger">
                        {formik.errors.paymentModeOther}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Payment Amount</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      name="paymentAmount"
                      placeholder="Enter amount"
                      className="custom-select-height"
                      value={formik.values.paymentAmount}
                      onChange={formik.handleChange}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Select
                      name="paymentCurrency"
                      options={[
                        { value: "USD", label: "USD" },
                        { value: "INR", label: "INR" },
                      ]}
                      value={[
                        { value: "USD", label: "USD" },
                        { value: "INR", label: "INR" },
                      ].find(
                        (option) =>
                          option.value === formik.values.paymentCurrency
                      )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "paymentCurrency",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      placeholder="Select currency"
                      classNamePrefix="custom-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          height: "40px",
                          minHeight: "40px",
                          width: "130px",
                          borderRadius: "4px",
                          borderColor: "#ced4da",
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
                      isSearchable
                      isClearable
                      isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </div>
                  {formik.errors.paymentAmount &&
                    formik.touched.paymentAmount && (
                      <div className="text-danger">
                        {formik.errors.paymentAmount}
                      </div>
                    )}
                  {formik.errors.paymentCurrency &&
                    formik.touched.paymentCurrency && (
                      <div className="text-danger">
                        {formik.errors.paymentCurrency}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Payment Date</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={paymentDateCalendarRef}
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
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCalendar(true);
                      }}
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
                        }}
                      >
                        <Calendar
                          className="form-control border-0"
                          onChange={(selectedDate) => {
                            formik.setFieldValue(
                              "paymentDate",
                              toISODate(selectedDate)
                            );
                            setShowCalendar(false);
                          }}
                          value={parseDate(formik.values.paymentDate) || null}
                          locale="en-GB"
                          onClickOutside={() => setShowCalendar(false)}
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
                  <Form.Label>Payment Reference No.</Form.Label>
                  <Form.Control
                    type="text"
                    name="paymentReffNo"
                    className="custom-select-height"
                    placeholder="Enter reference number"
                    value={formik.values.paymentReffNo}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.paymentReffNo &&
                    formik.touched.paymentReffNo && (
                      <div className="text-danger">
                        {formik.errors.paymentReffNo}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Payment Receipt</Form.Label>
                  <Form.Control
                    type="file"
                    name="paymentReceipt"
                    className="custom-select-height"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) => doc.customDocumentName === "Payment Receipt"
                      ) || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.errors.paymentReceipt &&
                    formik.touched.paymentReceipt && (
                      <div className="text-danger">
                        {formik.errors.paymentReceipt}
                      </div>
                    )}
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

export default UsaVisaFeePayment;
