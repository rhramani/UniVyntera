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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const UsaConfirmation = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const confirmationDateCalendarRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["DS-160 Confirmation Page"];

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
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
        confirmationDateCalendarRef.current &&
        !confirmationDateCalendarRef.current.contains(event.target)
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
      confirmed: "No",
      confirmationDate: "",
      documents: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      confirmed: Yup.string().required("Please select an option"),
      confirmationDate: Yup.string(),
      documents: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            ds160Confirmation: {
              confirmed: values.confirmed === "Yes",
              confirmationDate:
                values.confirmed === "Yes" ? values.confirmationDate : null,
            },
          },
        };

        const oldConfirmation =
          applicationData?.visaApplicationDetails?.ds160Confirmation || {};

        if (
          oldConfirmation.confirmed !== (values.confirmed === "Yes") ||
          oldConfirmation.confirmationDate !==
            (values.confirmed === "Yes" ? values.confirmationDate : null)
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.confirmed === "Yes" && values.documents) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.documents);
          formData.append("customDocumentName", "DS-160 Confirmation Page");
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
        toast.success("Confirmation updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update confirmation. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.ds160Confirmation) {
      const confirmation =
        applicationData.visaApplicationDetails.ds160Confirmation;
      formik.setValues({
        confirmed: confirmation.confirmed ? "Yes" : "No",
        confirmationDate:
          toISODate(parseDate(confirmation.confirmationDate)) || "",
        documents: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("documents", file);
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
          <h5>DS-160 Confirmation</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>DS-160 Confirmed?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      id="yesConfirmation"
                      name="confirmed"
                      value="Yes"
                      checked={formik.values.confirmed === "Yes"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      id="noConfirmation"
                      name="confirmed"
                      value="No"
                      checked={formik.values.confirmed === "No"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.errors.confirmed && formik.touched.confirmed && (
                      <div className="text-danger">
                        {formik.errors.confirmed}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              {formik.values.confirmed === "Yes" && (
                <>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Confirmation Date</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={confirmationDateCalendarRef}
                      >
                        <Form.Control
                          type="text"
                          name="confirmationDate"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.confirmationDate
                              ? formatDate(
                                  parseDate(formik.values.confirmationDate)
                                )
                              : ""
                          }
                          readOnly
                          onClick={(e) => {
                            e.preventDefault();
                            setShowCalendar(true);
                          }}
                          style={{
                            cursor:
                              userRole === "Student" || userRole === "LeadStudent"
                                ? "not-allowed"
                                : "pointer",
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
                                  "confirmationDate",
                                  toISODate(selectedDate)
                                );
                                setShowCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.confirmationDate) ||
                                null
                              }
                              locale="en-GB"
                              onClickOutside={() => setShowCalendar(false)}
                            />
                          </div>
                        )}
                        {formik.errors.confirmationDate &&
                          formik.touched.confirmationDate && (
                            <div className="text-danger">
                              {formik.errors.confirmationDate}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Upload DS-160 Confirmation Page</Form.Label>
                      <Form.Control
                        type="file"
                        name="documents"
                        className="custom-select-height"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        disabled={
                          applicationData?.uploadedDocumentDetails?.some(
                            (doc) =>
                              doc.customDocumentName ===
                              "DS-160 Confirmation Page"
                          ) || userRole === "Student" || userRole === "LeadStudent"
                        }
                      />
                      {formik.errors.documents && formik.touched.documents && (
                        <div className="text-danger">
                          {formik.errors.documents}
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

export default UsaConfirmation;
