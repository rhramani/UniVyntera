import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
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

const UkTBTest = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTbTestDateCalendar, setShowTbTestDateCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const tbTestDateCalendarRef = useRef(null);
  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));
  const documentTypes = ["TB Certificate"];

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
    if (id) fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tbTestDateCalendarRef.current &&
        !tbTestDateCalendarRef.current.contains(event.target)
      ) {
        setShowTbTestDateCalendar(false);
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
  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.tbTestDetails) {
      const tbTest = applicationData?.visaApplicationDetails.tbTestDetails;
      formik.setValues({
        required: tbTest.required ?? false,
        testDate: tbTest.testDate ? toISODate(parseDate(tbTest.testDate)) : "",
        hospitalName: tbTest.hospitalName || "",
        certificateUpload: "",
      });
    }
  }, [applicationData]);

  const formik = useFormik({
    initialValues: {
      required:
        applicationData?.visaApplicationDetails?.tbTestDetails?.required ??
        false,
      testDate: applicationData?.visaApplicationDetails?.tbTestDetails?.testDate
        ? toISODate(
            parseDate(
              applicationData.visaApplicationDetails.tbTestDetails.testDate
            )
          )
        : "",
      hospitalName:
        applicationData?.visaApplicationDetails?.tbTestDetails?.hospitalName ||
        "",
      certificateUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      required: Yup.boolean().required("TB Test requirement is required"),
      testDate: Yup.string(),
      hospitalName: Yup.string(),
      certificateUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldTbTest =
          applicationData?.visaApplicationDetails?.tbTestDetails || {};

        const jsonData = {
          visaApplicationDetails: {
            tbTestDetails: {
              required: values.required,
              testDate: values.testDate,
              hospitalName: values.hospitalName,
            },
          },
        };

        if (
          oldTbTest.required !== values.required ||
          oldTbTest.testDate !== values.testDate ||
          oldTbTest.hospitalName !== values.hospitalName
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.certificateUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.certificateUpload);
          formData.append("customDocumentName", "TB Certificate");
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
        toast.success("TB Test details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Error updating TB Test details:", error);
        toast.error("Failed to update TB Test details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("certificateUpload", event.target.files[0]);
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
      <h5>TB Test (if applicable)</h5>
      <div className="bg-white rounded mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>TB Test Required?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    id="required-yes"
                    label="Yes"
                    name="required"
                    value="true"
                    checked={formik.values.required === true}
                    onChange={() => formik.setFieldValue("required", true)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="required-no"
                    label="No"
                    name="required"
                    value="false"
                    checked={formik.values.required === false}
                    onChange={() => formik.setFieldValue("required", false)}
                    className="custom-radio-border"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </div>
                {formik.touched.required && formik.errors.required && (
                  <div className="text-danger">{formik.errors.required}</div>
                )}
              </Form.Group>
            </Col>

            {formik.values.required === true && (
              <>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>TB Test Date</Form.Label>
                    <div
                      style={{ position: "relative" }}
                      ref={tbTestDateCalendarRef}
                    >
                      <Form.Control
                        type="text"
                        name="testDate"
                        placeholder="dd/mm/yyyy"
                        value={
                          formik.values.testDate
                            ? formatDate(parseDate(formik.values.testDate))
                            : ""
                        }
                        readOnly
                        onClick={() => setShowTbTestDateCalendar(true)}
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
                      {showTbTestDateCalendar && (
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
                              formik.setFieldValue("testDate", toISODate(date));
                              setShowTbTestDateCalendar(false);
                            }}
                            value={parseDate(formik.values.testDate) || null}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                    {formik.touched.testDate && formik.errors.testDate && (
                      <div className="text-danger">
                        {formik.errors.testDate}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Hospital/Clinic Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="hospitalName"
                      placeholder="Enter Hospital/Clinic Name"
                      value={formik.values.hospitalName}
                      onChange={formik.handleChange}
                      className="custom-select-height"
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.touched.hospitalName &&
                      formik.errors.hospitalName && (
                        <div className="text-danger">
                          {formik.errors.hospitalName}
                        </div>
                      )}
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Upload TB Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="certificateUpload"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      className="custom-select-height"
                      disabled={
                        applicationData?.uploadedDocumentDetails?.some(
                          (doc) => doc.customDocumentName === "TB Certificate"
                        ) || userRole === "Student" || userRole === "LeadStudent"
                      }
                    />
                    {formik.touched.certificateUpload &&
                      formik.errors.certificateUpload && (
                        <div className="text-danger">
                          {formik.errors.certificateUpload}
                        </div>
                      )}
                  </Form.Group>
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

export default UkTBTest;
