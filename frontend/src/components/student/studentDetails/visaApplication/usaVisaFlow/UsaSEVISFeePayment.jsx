import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
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

const UsaSEVISFeePayment = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDateCalendar, setShowPaymentDateCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const paymentDateCalendarRef = useRef(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const documentTypes = ["SEVIS Fee Receipt"];
  const userRole = decryptData(localStorage.getItem("role"));

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
        setShowPaymentDateCalendar(false);
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
      usdAmount: "",
      inrAmount: "",
      paymentDate: "",
      sevisId: "",
      receipt: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      usdAmount: Yup.number()
        .required("SEVIS amount in USD is required")
        .min(0, "Amount cannot be negative"),
      inrAmount: Yup.number()
        .required("SEVIS amount in INR is required")
        .min(0, "Amount cannot be negative"),
      paymentDate: Yup.string().required("Payment date is required"),
      sevisId: Yup.string().required("SEVIS ID number is required"),
      receipt: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            sevisPayment: {
              usdAmount: Number(values.usdAmount),
              inrAmount: Number(values.inrAmount),
              paymentDate: values.paymentDate,
              sevisId: values.sevisId,
            },
          },
        };

        const oldSevis =
          applicationData?.visaApplicationDetails?.sevisPayment || {};
        if (
          oldSevis.usdAmount !== Number(values.usdAmount) ||
          oldSevis.inrAmount !== Number(values.inrAmount) ||
          oldSevis.paymentDate !== values.paymentDate ||
          oldSevis.sevisId !== values.sevisId
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.receipt) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.receipt);
          formData.append("customDocumentName", "SEVIS Fee Receipt");
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
        toast.success("SEVIS fee payment updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update SEVIS fee payment:", error);
        toast.error("Failed to update SEVIS fee payment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.sevisPayment) {
      const sevis = applicationData.visaApplicationDetails.sevisPayment;
      formik.setValues({
        usdAmount: sevis.usdAmount || "",
        inrAmount: sevis.inrAmount || "",
        paymentDate: toISODate(parseDate(sevis.paymentDate)),
        sevisId: sevis.sevisId || "",
        receipt: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("receipt", file);
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
    const toastId = toast.loading("Sending pending documents email...");
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
          <h5>SEVIS Fee Payment</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>SEVIS Amount in USD</Form.Label>
                  <Form.Control
                    type="number"
                    name="usdAmount"
                    className="custom-select-height"
                    placeholder="Enter amount in USD"
                    value={formik.values.usdAmount}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.usdAmount && formik.touched.usdAmount && (
                    <div className="text-danger">{formik.errors.usdAmount}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>SEVIS Amount in INR</Form.Label>
                  <Form.Control
                    type="number"
                    name="inrAmount"
                    className="custom-select-height"
                    placeholder="Enter amount in INR"
                    value={formik.values.inrAmount}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.inrAmount && formik.touched.inrAmount && (
                    <div className="text-danger">{formik.errors.inrAmount}</div>
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
                        setShowPaymentDateCalendar(true);
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
                          onChange={(selectedDate) => {
                            const formattedDate = toISODate(selectedDate);
                            formik.setFieldValue("paymentDate", formattedDate);
                            setShowPaymentDateCalendar(false);
                          }}
                          value={parseDate(formik.values.paymentDate) || null}
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
                  <Form.Label>SEVIS ID Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="sevisId"
                    className="custom-select-height"
                    placeholder="Enter SEVIS ID number"
                    value={formik.values.sevisId}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.sevisId && formik.touched.sevisId && (
                    <div className="text-danger">{formik.errors.sevisId}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload SEVIS Fee Receipt</Form.Label>
                  <Form.Control
                    type="file"
                    name="receipt"
                    className="custom-select-height"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) => doc.customDocumentName === "SEVIS Fee Receipt"
                      ) || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.errors.receipt && formik.touched.receipt && (
                    <div className="text-danger">{formik.errors.receipt}</div>
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

export default UsaSEVISFeePayment;
