import { useEffect, useRef, useState } from "react";
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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const UsaReceived = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const documentTypes = ["I-20 Document"];
  const userRole = decryptData(localStorage.getItem("role"));
  const receivedDateCalendarRef = useRef(null);

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
        receivedDateCalendarRef.current &&
        !receivedDateCalendarRef.current.contains(event.target)
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
      received: "No",
      receivedDate: "",
      documents: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      received: Yup.string().required("Please select an option"),
      receivedDate: Yup.string(),
      documents: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            i20Received: {
              received: values.received === "Yes",
              receivedDate:
                values.received === "Yes" ? values.receivedDate : "",
            },
          },
        };

        const oldReceived =
          applicationData?.visaApplicationDetails?.i20Received || {};
        if (
          oldReceived.received !== (values.received === "Yes") ||
          oldReceived.receivedDate !==
            (values.received === "Yes" ? values.receivedDate : "")
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.received === "Yes" && values.documents) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.documents);
          formData.append("customDocumentName", "I-20 Document");
          formData.append(
            "ref_module",
            applicationData?.visaApplicationDetails?._id
          );
        }

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          setIsLoading(false);
          return;
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload && formData) {
          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Application updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update application:", error);
        toast.error("Failed to update application. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.i20Received) {
      const received = applicationData.visaApplicationDetails.i20Received;
      formik.setValues({
        received: received.received ? "Yes" : "No",
        receivedDate: toISODate(parseDate(received.receivedDate)) || "",
        documents: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("documents", file);
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
          <h5>I-20 Received</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>I-20 Received?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      id="yesReceived"
                      name="received"
                      value="Yes"
                      checked={formik.values.received === "Yes"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      id="noReceived"
                      name="received"
                      value="No"
                      checked={formik.values.received === "No"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.errors.received && formik.touched.received && (
                      <div className="text-danger">
                        {formik.errors.received}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              {formik.values.received === "Yes" && (
                <>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Received Date</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={receivedDateCalendarRef}
                      >
                        <Form.Control
                          type="text"
                          name="receivedDate"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.receivedDate
                              ? formatDate(
                                  parseDate(formik.values.receivedDate)
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
                                  "receivedDate",
                                  toISODate(selectedDate)
                                );
                                setShowCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.receivedDate) || null
                              }
                              locale="en-GB"
                              onClickOutside={() => setShowCalendar(false)}
                            />
                          </div>
                        )}
                        {formik.errors.receivedDate &&
                          formik.touched.receivedDate && (
                            <div className="text-danger">
                              {formik.errors.receivedDate}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Upload I-20 Document</Form.Label>
                      <Form.Control
                        type="file"
                        name="documents"
                        className="custom-select-height"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        disabled={
                          applicationData?.uploadedDocumentDetails?.some(
                            (doc) => doc.customDocumentName === "I-20 Document"
                          ) || userRole === "Student" || userRole === "LeadStudent"
                        }
                      />
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

export default UsaReceived;
