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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";

const UkVisaDecisionPassportCollection = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showDecisionDateCalendar, setShowDecisionDateCalendar] =
    useState(false);
  const [showPassportCollectionCalendar, setShowPassportCollectionCalendar] =
    useState(false);
  const [showVisaFromCalendar, setShowVisaFromCalendar] = useState(false);
  const [showVisaToCalendar, setShowVisaToCalendar] = useState(false);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const decisionDateRef = useRef(null);
  const passportCollectionRef = useRef(null);
  const visaFromRef = useRef(null);
  const visaToRef = useRef(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));
  const documentTypes = ["Visa Copy"];

  const visaDecisionOptions = [
    { value: "Approved", label: "Approved" },
    { value: "Refused", label: "Refused" },
    { value: "Pending", label: "Pending" },
  ];

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
    if (!date) return null;
    if (!(date instanceof Date)) date = new Date(date);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      if (res?.status === 200) {
        console.log("Fetched application data:", res?.data?.data);
        setApplicationData(res?.data?.data);
      } else {
        toast.error("Failed to fetch application data: Server error.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch application data: Network error.");
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      [decisionDateRef, passportCollectionRef, visaFromRef, visaToRef].forEach(
        (ref) => {
          if (ref.current && !ref.current.contains(event.target)) {
            if (ref === decisionDateRef) setShowDecisionDateCalendar(false);
            if (ref === passportCollectionRef)
              setShowPassportCollectionCalendar(false);
            if (ref === visaFromRef) setShowVisaFromCalendar(false);
            if (ref === visaToRef) setShowVisaToCalendar(false);
          }
        }
      );
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formik = useFormik({
    initialValues: {
      decision:
        applicationData?.visaApplicationDetails?.visaDecision?.decision || "",
      decisionDate: applicationData?.visaApplicationDetails?.visaDecision
        ?.decisionDate
        ? parseDate(
            applicationData.visaApplicationDetails.visaDecision.decisionDate
          )
        : null,
      visaNumber:
        applicationData?.visaApplicationDetails?.visaDecision?.visaNumber || "",
      visaStickerUpload: [],
      passportCollectionDate: applicationData?.visaApplicationDetails
        ?.visaDecision?.passportCollectionDate
        ? parseDate(
            applicationData.visaApplicationDetails.visaDecision
              .passportCollectionDate
          )
        : null,
      validity: {
        from: applicationData?.visaApplicationDetails?.visaDecision?.validity
          ?.from
          ? parseDate(
              applicationData.visaApplicationDetails.visaDecision.validity.from
            )
          : null,
        to: applicationData?.visaApplicationDetails?.visaDecision?.validity?.to
          ? parseDate(
              applicationData.visaApplicationDetails.visaDecision.validity.to
            )
          : null,
      },
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      decision: Yup.string(),
      decisionDate: Yup.string().nullable(),
      visaNumber: Yup.string(),
      visaStickerUpload: Yup.array().of(Yup.mixed()).nullable(),
      passportCollectionDate: Yup.string().nullable(),
      validity: Yup.object({
        from: Yup.string().nullable(),
        to: Yup.string().nullable(),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const formatISO = (date) => (date ? toISODate(date) : null);

        const jsonData = {
          visaApplicationDetails: {
            visaDecision: {
              decision: values.decision || null,
              decisionDate: formatISO(values.decisionDate),
              visaNumber: values.visaNumber || null,
              passportCollectionDate: formatISO(values.passportCollectionDate),
              validity: {
                from: formatISO(values.validity.from),
                to: formatISO(values.validity.to),
              },
            },
          },
        };

        const oldData =
          applicationData?.visaApplicationDetails?.visaDecision || {};
        let hasJsonChanges =
          oldData.decision !== values.decision ||
          formatISO(oldData.decisionDate) !== formatISO(values.decisionDate) ||
          oldData.visaNumber !== values.visaNumber ||
          formatISO(oldData.passportCollectionDate) !==
            formatISO(values.passportCollectionDate) ||
          formatISO(oldData.validity?.from) !==
            formatISO(values.validity.from) ||
          formatISO(oldData.validity?.to) !== formatISO(values.validity.to);

        let hasFileUpload = !!values.visaStickerUpload;
        let formData = null;
        if (hasFileUpload) {
          formData = new FormData();
          // formData.append("uploadedDocument", values.visaStickerUpload);
          values.visaStickerUpload.forEach((file) => {
            formData.append("uploadedDocument", file);
          });
          formData.append("customDocumentName", "Visa Copy");
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
        toast.success(
          "Visa decision & passport collection details updated successfully!"
        );
        resetForm();
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Failed to update details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      formik.setFieldValue("visaStickerUpload", files);
    }
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
        toast.update(toastId, {
          render:
            res?.data?.data || "Pending documents email sent successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setSelectedDocsIds([]);
        setSelectedDocumentNames([]);
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
  ) => {
    const getNestedValue = (key) => {
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        return formik.values[parent]?.[child] || null;
      }
      return formik.values[key] || null;
    };

    const value = getNestedValue(valueKey);
    const formattedValue = value ? formatDate(value) : "";

    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <div style={{ position: "relative" }} ref={ref}>
          <Form.Control
            type="text"
            placeholder="dd/mm/yyyy"
            value={formattedValue}
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
                  if (valueKey.includes(".")) {
                    const [parent, child] = valueKey.split(".");
                    formik.setFieldValue(parent, {
                      ...formik.values[parent],
                      [child]: date,
                    });
                  } else {
                    formik.setFieldValue(valueKey, date);
                  }
                  setShowCalendar(false);
                }}
                value={value || null}
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
  };

  if (!applicationData) {
    return <div>Loading application data...</div>;
  }

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
      <h5>Visa Decision & Passport Collection</h5>
      <div className="bg-white mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Visa Decision</Form.Label>
                <Select
                  options={visaDecisionOptions}
                  value={visaDecisionOptions.find(
                    (o) => o.value === formik.values.decision
                  )}
                  onChange={(selected) =>
                    formik.setFieldValue("decision", selected?.value || "")
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
                {formik.touched.decision && formik.errors.decision && (
                  <div className="text-danger">{formik.errors.decision}</div>
                )}
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              {renderDateInput(
                "Decision Date",
                "decisionDate",
                showDecisionDateCalendar,
                setShowDecisionDateCalendar,
                decisionDateRef
              )}
            </Col>

            {formik.values.decision === "Approved" && (
              <>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Visa Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter visa number"
                      value={formik.values.visaNumber}
                      onChange={formik.handleChange}
                      className="custom-select-height"
                      name="visaNumber"
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.visaNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Visa Copy Upload</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="custom-select-height"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.visaStickerUpload}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  {renderDateInput(
                    "Passport Collection Date",
                    "passportCollectionDate",
                    showPassportCollectionCalendar,
                    setShowPassportCollectionCalendar,
                    passportCollectionRef
                  )}
                </Col>

                <Col md={6} className="mb-3">
                  {renderDateInput(
                    "Visa Validity From",
                    "validity.from",
                    showVisaFromCalendar,
                    setShowVisaFromCalendar,
                    visaFromRef
                  )}
                </Col>

                <Col md={6} className="mb-3">
                  {renderDateInput(
                    "Visa Validity To",
                    "validity.to",
                    showVisaToCalendar,
                    setShowVisaToCalendar,
                    visaToRef
                  )}
                </Col>
              </>
            )}
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

export default UkVisaDecisionPassportCollection;
