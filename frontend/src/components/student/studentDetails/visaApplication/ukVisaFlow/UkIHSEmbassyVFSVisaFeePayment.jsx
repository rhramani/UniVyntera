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
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";

const UkIHSEmbassyVFSVisaFeePayment = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const [showIhsPaymentDateCalendar, setShowIhsPaymentDateCalendar] =
    useState(false);
  const [showEmbassyPaymentDateCalendar, setShowEmbassyPaymentDateCalendar] =
    useState(false);
  const [showVfsPaymentDateCalendar, setShowVfsPaymentDateCalendar] =
    useState(false);

  const ihsPaymentDateRef = useRef(null);
  const embassyPaymentDateRef = useRef(null);
  const vfsPaymentDateRef = useRef(null);

  const dispatch = useDispatch();
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));
  const documentTypes = [
    "IHS Receipt",
    "Embassy Visa Fee Receipt",
    "VFS Visa Fee Receipt",
  ];

  const appointmentOptions = [
    { value: "Normal", label: "Normal" },
    { value: "Priority", label: "Priority" },
    { value: "Super Priority", label: "Super Priority" },
  ];

  const currencyOptions = [
    { value: "GBP", label: "GBP" },
    { value: "INR", label: "INR" },
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
        ihsPaymentDateRef.current &&
        !ihsPaymentDateRef.current.contains(event.target)
      ) {
        setShowIhsPaymentDateCalendar(false);
      }
      if (
        embassyPaymentDateRef.current &&
        !embassyPaymentDateRef.current.contains(event.target)
      ) {
        setShowEmbassyPaymentDateCalendar(false);
      }
      if (
        vfsPaymentDateRef.current &&
        !vfsPaymentDateRef.current.contains(event.target)
      ) {
        setShowVfsPaymentDateCalendar(false);
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
      appointmentType:
        applicationData?.visaApplicationDetails?.fees?.appointmentType || "",
      ihsReference:
        applicationData?.visaApplicationDetails?.fees?.ihsReference || "",
      ihsAmount: applicationData?.visaApplicationDetails?.fees?.ihsAmount || "",
      ihsCurrency:
        applicationData?.visaApplicationDetails?.fees?.ihsCurrency || "",
      ihsPaymentDate: applicationData?.visaApplicationDetails?.fees
        ?.ihsPaymentDate
        ? toISODate(
            parseDate(
              applicationData.visaApplicationDetails.fees.ihsPaymentDate
            )
          )
        : "",
      ihsReceiptUpload: "",
      embassyFeeAmount:
        applicationData?.visaApplicationDetails?.fees?.embassyFeeAmount || "",
      embassyCurrency:
        applicationData?.visaApplicationDetails?.fees?.embassyCurrency || "",
      embassyPaymentDate: applicationData?.visaApplicationDetails?.fees
        ?.embassyPaymentDate
        ? toISODate(
            parseDate(
              applicationData.visaApplicationDetails.fees.embassyPaymentDate
            )
          )
        : "",
      embassyFeeReceiptUpload: "",
      vfsFeeAmount:
        applicationData?.visaApplicationDetails?.fees?.vfsFeeAmount || "",
      vfsCurrency:
        applicationData?.visaApplicationDetails?.fees?.vfsCurrency || "",
      vfsPaymentDate: applicationData?.visaApplicationDetails?.fees
        ?.vfsPaymentDate
        ? toISODate(
            parseDate(
              applicationData.visaApplicationDetails.fees.vfsPaymentDate
            )
          )
        : "",
      vfsFeeReceiptUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      appointmentType: Yup.string().required("Appointment Type is required"),
      ihsReference: Yup.string().nullable(),
      ihsAmount: Yup.number().nullable(),
      ihsCurrency: Yup.string().nullable(),
      ihsPaymentDate: Yup.string().nullable(),
      ihsReceiptUpload: Yup.mixed(),
      embassyFeeAmount: Yup.number().nullable(),
      embassyCurrency: Yup.string().nullable(),
      embassyPaymentDate: Yup.string().nullable(),
      embassyFeeReceiptUpload: Yup.mixed(),
      vfsFeeAmount: Yup.number().nullable(),
      vfsCurrency: Yup.string().nullable(),
      vfsPaymentDate: Yup.string().nullable(),
      vfsFeeReceiptUpload: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUploads = false;

        const jsonData = {
          visaApplicationDetails: {
            fees: {
              appointmentType: values.appointmentType,
              ihsReference: values.ihsReference,
              ihsAmount: values.ihsAmount || 0,
              ihsCurrency: values.ihsCurrency || "",
              ihsPaymentDate: values.ihsPaymentDate,
              ihsReceiptUpload: "",
              embassyFeeAmount: values.embassyFeeAmount || 0,
              embassyCurrency: values.embassyCurrency || "",
              embassyPaymentDate: values.embassyPaymentDate,
              embassyFeeReceiptUpload: "",
              vfsFeeAmount: values.vfsFeeAmount || 0,
              vfsCurrency: values.vfsCurrency || "",
              vfsPaymentDate: values.vfsPaymentDate,
              vfsFeeReceiptUpload: "",
            },
          },
        };

        const oldFees = applicationData?.visaApplicationDetails?.fees || {};

        if (
          oldFees.appointmentType !== values.appointmentType ||
          oldFees.ihsReference !== values.ihsReference ||
          oldFees.ihsAmount !== values.ihsAmount ||
          oldFees.ihsCurrency !== values.ihsCurrency ||
          oldFees.ihsPaymentDate !== values.ihsPaymentDate ||
          oldFees.embassyFeeAmount !== values.embassyFeeAmount ||
          oldFees.embassyCurrency !== values.embassyCurrency ||
          oldFees.embassyPaymentDate !== values.embassyPaymentDate ||
          oldFees.vfsFeeAmount !== values.vfsFeeAmount ||
          oldFees.vfsCurrency !== values.vfsCurrency ||
          oldFees.vfsPaymentDate !== values.vfsPaymentDate
        ) {
          hasJsonChanges = true;
        }

        const uploads = [
          { file: values.ihsReceiptUpload, name: "IHS Receipt" },
          {
            file: values.embassyFeeReceiptUpload,
            name: "Embassy Visa Fee Receipt",
          },
          { file: values.vfsFeeReceiptUpload, name: "VFS Visa Fee Receipt" },
        ];

        hasFileUploads = uploads?.some((u) => u.file);

        if (!hasJsonChanges && !hasFileUploads) {
          toast.info("No changes detected.");
          return;
        }

        for (const upload of uploads) {
          if (upload.file) {
            let formData = new FormData();
            formData.append("uploadedDocument", upload.file);
            formData.append("customDocumentName", upload.name);
            formData.append(
              "ref_module",
              applicationData?.visaApplicationDetails?._id
            );
            await dispatch(updateStudentApplication(formData, id));
          }
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
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

  const renderDateInput = (
    label,
    valueKey,
    showCalendar,
    setShowCalendar,
    ref
  ) => (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <div style={{ position: "relative" }} ref={ref}>
        <Form.Control
          type="text"
          placeholder="dd/mm/yyyy"
          value={
            formik.values[valueKey]
              ? formatDate(parseDate(formik.values[valueKey])) // ✅ frontend view dd/mm/yyyy
              : ""
          }
          readOnly
          onClick={() => setShowCalendar(true)}
          className="custom-select-height"
          style={{
            cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
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
              onChange={(date) => {
                formik.setFieldValue(valueKey, toISODate(date));
                setShowCalendar(false);
              }}
              value={parseDate(formik.values[valueKey]) || null}
              locale="en-GB"
            />
          </div>
        )}
        <Form.Control.Feedback type="invalid">
          {formik.errors[valueKey]}
        </Form.Control.Feedback>
      </div>
    </Form.Group>
  );

  const renderCurrencySelect = (label, name) => (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Select
        name={name}
        options={currencyOptions}
        value={currencyOptions.find(
          (option) => option.value === formik.values[name]
        )}
        onChange={(selectedOption) =>
          formik.setFieldValue(name, selectedOption ? selectedOption.value : "")
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
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger">{formik.errors[name]}</div>
      )}
    </Form.Group>
  );

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
      <h5>IHS & Embassy + VFS Visa Fee Payment</h5>
      <div className="bg-white rounded mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Appointment Type</Form.Label>
                <Select
                  options={appointmentOptions}
                  value={appointmentOptions.find(
                    (o) => o.value === formik.values.appointmentType
                  )}
                  onChange={(selected) =>
                    formik.setFieldValue(
                      "appointmentType",
                      selected?.value || ""
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
                  isClearable
                  isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                />
                {formik.touched.appointmentType &&
                  formik.errors.appointmentType && (
                    <div className="text-danger">
                      {formik.errors.appointmentType}
                    </div>
                  )}
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>IHS Reference Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter IHS Reference Number"
                  value={formik.values.ihsReference}
                  onChange={formik.handleChange}
                  className="custom-select-height"
                  name="ihsReference"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ihsReference}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              {renderCurrencySelect("IHS Currency", "ihsCurrency")}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>IHS Amount Paid</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter IHS Amount Paid"
                  value={formik.values.ihsAmount}
                  onChange={formik.handleChange}
                  className="custom-select-height"
                  name="ihsAmount"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ihsAmount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              {renderDateInput(
                "IHS Payment Date",
                "ihsPaymentDate",
                showIhsPaymentDateCalendar,
                setShowIhsPaymentDateCalendar,
                ihsPaymentDateRef
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Upload IHS Receipt</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => handleFileChange(e, "ihsReceiptUpload")}
                  className="custom-select-height"
                  disabled={
                    applicationData?.uploadedDocumentDetails?.some(
                      (doc) => doc.customDocumentName === "IHS Receipt"
                    ) || userRole === "Student" || userRole === "LeadStudent"
                  }
                  name="ihsReceiptUpload"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ihsReceiptUpload}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              {renderCurrencySelect("Embassy Currency", "embassyCurrency")}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Embassy Visa Fee Amount Paid</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Embassy Visa Fee Amount Paid"
                  value={formik.values.embassyFeeAmount}
                  onChange={formik.handleChange}
                  className="custom-select-height"
                  name="embassyFeeAmount"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.embassyFeeAmount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              {renderDateInput(
                "Embassy Visa Fee Payment Date",
                "embassyPaymentDate",
                showEmbassyPaymentDateCalendar,
                setShowEmbassyPaymentDateCalendar,
                embassyPaymentDateRef
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Upload Embassy Visa Fee Receipt</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) =>
                    handleFileChange(e, "embassyFeeReceiptUpload")
                  }
                  className="custom-select-height"
                  disabled={
                    applicationData?.uploadedDocumentDetails?.some(
                      (doc) =>
                        doc.customDocumentName === "Embassy Visa Fee Receipt"
                    ) || userRole === "Student" || userRole === "LeadStudent"
                  }
                  name="embassyFeeReceiptUpload"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.embassyFeeReceiptUpload}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              {renderCurrencySelect("VFS Currency", "vfsCurrency")}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>VFS Visa Fee Amount Paid</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter VFS Visa Fee Amount Paid"
                  value={formik.values.vfsFeeAmount}
                  onChange={formik.handleChange}
                  className="custom-select-height"
                  name="vfsFeeAmount"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.vfsFeeAmount}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              {renderDateInput(
                "VFS Visa Fee Payment Date",
                "vfsPaymentDate",
                showVfsPaymentDateCalendar,
                setShowVfsPaymentDateCalendar,
                vfsPaymentDateRef
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Upload VFS Visa Fee Receipt</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => handleFileChange(e, "vfsFeeReceiptUpload")}
                  className="custom-select-height"
                  disabled={
                    applicationData?.uploadedDocumentDetails?.some(
                      (doc) => doc.customDocumentName === "VFS Visa Fee Receipt"
                    ) || userRole === "Student" || userRole === "LeadStudent"
                  }
                  name="vfsFeeReceiptUpload"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.vfsFeeReceiptUpload}
                </Form.Control.Feedback>
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

export default UkIHSEmbassyVFSVisaFeePayment;
