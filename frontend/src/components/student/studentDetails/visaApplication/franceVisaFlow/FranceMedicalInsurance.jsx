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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const FranceMedicalInsurance = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showValidFromCalendar, setShowValidFromCalendar] = useState(false);
  const [showValidToCalendar, setShowValidToCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const dispatch = useDispatch();
  const validFromRef = useRef(null);
  const validToRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Medical Insurance Certificate"];
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
        validFromRef.current &&
        !validFromRef.current.contains(event.target)
      ) {
        setShowValidFromCalendar(false);
      }
      if (validToRef.current && !validToRef.current.contains(event.target)) {
        setShowValidToCalendar(false);
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
      providerName: "",
      policyNumber: "",
      validFrom: "",
      validTo: "",
      certificateUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      providerName: Yup.string(),
      policyNumber: Yup.string(),
      validFrom: Yup.string(),
      validTo: Yup.string(),
      certificateUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldInsurance =
          applicationData?.visaApplicationDetails?.medicalInsurance || {};

        const jsonData = {
          visaApplicationDetails: {
            medicalInsurance: {
              providerName: values.providerName,
              policyNumber: values.policyNumber,
              validity: {
                from: values.validFrom,
                to: values.validTo,
              },
            },
          },
        };

        if (
          oldInsurance.providerName !== values.providerName ||
          oldInsurance.policyNumber !== values.policyNumber ||
          oldInsurance?.validity?.from !== values.validFrom ||
          oldInsurance?.validity?.to !== values.validTo
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.certificateUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.certificateUpload);
          formData.append(
            "customDocumentName",
            "Medical Insurance Certificate"
          );
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
        toast.success("Medical insurance details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update medical insurance details:", error);
        toast.error(
          error.message ||
            "Failed to update medical insurance details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.medicalInsurance) {
      const medicalInsurance =
        applicationData.visaApplicationDetails.medicalInsurance;
      formik.setValues({
        providerName: medicalInsurance.providerName || "",
        policyNumber: medicalInsurance.policyNumber || "",
        validFrom: medicalInsurance.validity?.from
          ? toISODate(parseDate(medicalInsurance.validity.from))
          : "",
        validTo: medicalInsurance.validity?.to
          ? toISODate(parseDate(medicalInsurance.validity.to))
          : "",
        certificateUpload: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("certificateUpload", file);
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
          <h5>Medical Insurance</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Insurance Provider Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="providerName"
                    placeholder="Enter provider name"
                    value={formik.values.providerName}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.providerName &&
                    formik.errors.providerName && (
                      <div className="text-danger">
                        {formik.errors.providerName}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Policy Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="policyNumber"
                    placeholder="Enter policy number"
                    value={formik.values.policyNumber}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.policyNumber &&
                    formik.errors.policyNumber && (
                      <div className="text-danger">
                        {formik.errors.policyNumber}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Valid From</Form.Label>
                  <div style={{ position: "relative" }} ref={validFromRef}>
                    <Form.Control
                      type="text"
                      name="validFrom"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.validFrom
                          ? formatDate(parseDate(formik.values.validFrom))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowValidFromCalendar(true)}
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
                    {showValidFromCalendar && (
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
                            formik.setFieldValue("validFrom", toISODate(date));
                            setShowValidFromCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.validFrom) || new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.validFrom && formik.errors.validFrom && (
                      <div className="text-danger">
                        {formik.errors.validFrom}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Valid To</Form.Label>
                  <div style={{ position: "relative" }} ref={validToRef}>
                    <Form.Control
                      type="text"
                      name="validTo"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.validTo
                          ? formatDate(parseDate(formik.values.validTo))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowValidToCalendar(true)}
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
                    {showValidToCalendar && (
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
                            formik.setFieldValue("validTo", toISODate(date));
                            setShowValidToCalendar(false);
                          }}
                          value={parseDate(formik.values.validTo) || new Date()}
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.validTo && formik.errors.validTo && (
                      <div className="text-danger">{formik.errors.validTo}</div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Insurance Certificate</Form.Label>
                  <Form.Control
                    type="file"
                    name="certificateUpload"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="custom-select-height"
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) =>
                          doc.customDocumentName ===
                          "Medical Insurance Certificate"
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

export default FranceMedicalInsurance;
