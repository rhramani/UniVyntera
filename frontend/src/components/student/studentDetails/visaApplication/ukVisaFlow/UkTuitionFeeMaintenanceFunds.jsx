import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
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

const UkTuitionFeeMaintenanceFunds = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const [showDepositDateCalendar, setShowDepositDateCalendar] = useState(false);
  const depositDateCalendarRef = useRef(null);
  const [showFundHeldDateCalendar, setShowFundHeldDateCalendar] =
    useState(false);
  const fundHeldDateCalendarRef = useRef(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const documentTypes = [
    "Fee Receipt",
    "Maintenance Funds Proof",
    "Fund Proof",
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
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        depositDateCalendarRef.current &&
        !depositDateCalendarRef.current.contains(event.target)
      ) {
        setShowDepositDateCalendar(false);
      }
      if (
        fundHeldDateCalendarRef.current &&
        !fundHeldDateCalendarRef.current.contains(event.target)
      ) {
        setShowFundHeldDateCalendar(false);
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
    if (applicationData?.visaApplicationDetails?.tuitionAndFunds) {
      const tf = applicationData?.visaApplicationDetails.tuitionAndFunds;
      formik.setValues({
        depositPaid: tf.depositPaid ?? false,
        depositAmount: tf.depositAmount || "",
        depositCurrency: tf.depositCurrency || "",
        depositPaymentDate: tf.depositPaymentDate
          ? toISODate(parseDate(tf.depositPaymentDate))
          : "",
        feeReceiptUpload: "",
        maintenanceProofUploads: "",
        fundHeld28days: tf.fundHeld28days ?? false,
        fundProofUpload: "",
      });
    }
  }, [applicationData]);

  const formik = useFormik({
    initialValues: {
      depositPaid: false,
      depositAmount: "",
      depositCurrency: "",
      depositPaymentDate: "",
      feeReceiptUpload: "",
      maintenanceProofUploads: "",
      fundHeld28days: false,
      fundProofUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      depositPaid: Yup.boolean().required(),
      depositAmount: Yup.string(),
      depositCurrency: Yup.string(),
      depositPaymentDate: Yup.string(),
      feeReceiptUpload: Yup.mixed(),
      maintenanceProofUploads: Yup.mixed(),
      fundHeld28days: Yup.boolean(),
      fundProofUpload: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUploads = false;

        const oldData =
          applicationData?.visaApplicationDetails?.tuitionAndFunds || {};

        if (
          oldData.depositPaid !== values.depositPaid ||
          oldData.depositAmount !== values.depositAmount ||
          oldData.depositCurrency !== (values.depositCurrency || "") ||
          oldData.depositPaymentDate !==
            (values.depositPaymentDate
              ? toISODate(parseDate(values.depositPaymentDate))
              : "") ||
          oldData.fundHeld28days !== values.fundHeld28days
        ) {
          hasJsonChanges = true;
        }

        const uploads = [
          { file: values.feeReceiptUpload, name: "Fee Receipt" },
          {
            file: values.maintenanceProofUploads,
            name: "Maintenance Funds Proof",
          },
          { file: values.fundProofUpload, name: "Fund Proof" },
        ];

        hasFileUploads = uploads?.some((u) => u.file);

        if (!hasJsonChanges && !hasFileUploads) {
          toast.info("No changes detected.");
          return;
        }

        if (hasJsonChanges) {
          const jsonData = {
            visaApplicationDetails: {
              tuitionAndFunds: {
                depositPaid: values.depositPaid,
                depositAmount: values.depositAmount,
                depositCurrency: values.depositCurrency || "",
                depositPaymentDate: values.depositPaymentDate
                  ? toISODate(parseDate(values.depositPaymentDate))
                  : "",
                fundHeld28days: values.fundHeld28days,
              },
            },
          };
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUploads) {
          for (const upload of uploads) {
            if (upload.file) {
              const formData = new FormData();
              formData.append("uploadedDocument", upload.file);
              formData.append("customDocumentName", upload.name);
              formData.append(
                "ref_module",
                applicationData?.visaApplicationDetails?._id
              );
              await dispatch(updateStudentApplication(formData, id));
            }
          }
        }

        await fetchData();
        toast.success(
          "Tuition & Maintenance fund details updated successfully!"
        );
        resetForm();
      } catch (error) {
        toast.error("Failed to update details.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event, fieldName) => {
    formik.setFieldValue(fieldName, event.target.files[0]);
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
      <h5>Tuition Fee & Maintenance Funds</h5>
      <div className="bg-white rounded mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Tuition Fee Deposit Paid?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    id="depositPaid-yes"
                    label="Yes"
                    checked={formik.values.depositPaid === true}
                    onChange={() => formik.setFieldValue("depositPaid", true)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="depositPaid-no"
                    label="No"
                    checked={formik.values.depositPaid === false}
                    onChange={() => formik.setFieldValue("depositPaid", false)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </div>
                {formik.touched.depositPaid && formik.errors.depositPaid && (
                  <div className="text-danger">{formik.errors.depositPaid}</div>
                )}
              </Form.Group>
            </Col>

            {formik.values.depositPaid === true && (
              <>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Deposit Currency</Form.Label>
                    <Select
                      name="depositCurrency"
                      options={[
                        { value: "GBP", label: "GBP" },
                        { value: "INR", label: "INR" },
                      ]}
                      value={[
                        { value: "GBP", label: "GBP" },
                        { value: "INR", label: "INR" },
                      ].find(
                        (option) =>
                          option.value === formik.values.depositCurrency
                      )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "depositCurrency",
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
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      placeholder="Select currency"
                      classNamePrefix="custom-select"
                      isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.touched.depositCurrency &&
                      formik.errors.depositCurrency && (
                        <div className="text-danger">
                          {formik.errors.depositCurrency}
                        </div>
                      )}
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Deposit Amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="depositAmount"
                      placeholder="Enter Deposit Amount"
                      value={formik.values.depositAmount}
                      onChange={formik.handleChange}
                      className="custom-select-height"
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Deposit Payment Date</Form.Label>
                    <div
                      style={{ position: "relative" }}
                      ref={depositDateCalendarRef}
                    >
                      <Form.Control
                        type="text"
                        name="depositPaymentDate"
                        placeholder="dd/mm/yyyy"
                        value={
                          formik.values.depositPaymentDate
                            ? formatDate(
                                parseDate(formik.values.depositPaymentDate)
                              )
                            : ""
                        }
                        readOnly
                        onClick={() => setShowDepositDateCalendar(true)}
                        className="custom-select-height"
                        style={{
                          cursor:
                            userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
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
                      {showDepositDateCalendar && (
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
                                "depositPaymentDate",
                                toISODate(date)
                              );
                              setShowDepositDateCalendar(false);
                            }}
                            value={
                              parseDate(formik.values.depositPaymentDate) ||
                              null
                            }
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Upload Fee Receipt</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => handleFileChange(e, "feeReceiptUpload")}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      className="custom-select-height"
                      disabled={
                        applicationData?.uploadedDocumentDetails?.some(
                          (doc) => doc.customDocumentName === "Fee Receipt"
                        ) || userRole === "Student" || userRole === "LeadStudent"
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Maintenance Funds Proof</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, "maintenanceProofUploads")
                      }
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      className="custom-select-height"
                      disabled={
                        applicationData?.uploadedDocumentDetails?.some(
                          (doc) =>
                            doc.customDocumentName === "Maintenance Funds Proof"
                        ) || userRole === "Student" || userRole === "LeadStudent"
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Fund Held for 28 Days?</Form.Label>
                    <Select
                      name="fundHeld28days"
                      options={yesNoOptions}
                      value={yesNoOptions.find(
                        (o) =>
                          (o.value === "Yes" &&
                            formik.values.fundHeld28days === true) ||
                          (o.value === "No" &&
                            formik.values.fundHeld28days === false)
                      )}
                      onChange={(selected) =>
                        formik.setFieldValue(
                          "fundHeld28days",
                          selected?.value === "Yes" ? true : false
                        )
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "8px",
                          borderColor: "#ced4da",
                          boxShadow: "none",
                          "&:hover": { borderColor: "#adb5bd" },
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#888",
                          fontSize: "14px",
                        }),
                      }}
                      classNamePrefix="custom-select"
                      placeholder="Select option"
                      isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Fund Proof Upload</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => handleFileChange(e, "fundProofUpload")}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      className="custom-select-height"
                      disabled={
                        applicationData?.uploadedDocumentDetails?.some(
                          (doc) => doc.customDocumentName === "Fund Proof"
                        ) || userRole === "Student" || userRole === "LeadStudent"
                      }
                    />
                  </Form.Group>
                </Col>
              </>
            )}
          </Row>
          {userRole !== "Student" &&  userRole !== "LeadStudent" &&(
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

export default UkTuitionFeeMaintenanceFunds;
