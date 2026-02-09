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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const CanadaBvlPpr = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showBvlCalendar, setShowBvlCalendar] = useState(false);
  const [showPprCalendar, setShowPprCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const bvlCalendarRef = useRef(null);
  const pprCalendarRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));
  const documentTypes = ["BVL Document", "PPR Document"];
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
    } else {
      toast.error("Invalid application ID. Please provide a valid ID.");
    }
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        bvlCalendarRef.current &&
        !bvlCalendarRef.current.contains(event.target)
      ) {
        setShowBvlCalendar(false);
      }
      if (
        pprCalendarRef.current &&
        !pprCalendarRef.current.contains(event.target)
      ) {
        setShowPprCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (isNaN(parsedDate)) return "";
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateStr);
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
      bvlReceivedDate: "",
      bvlDocuments: "",
      pprReceivedDate: "",
      pprDocuments: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      bvlReceivedDate: Yup.string(),
      pprReceivedDate: Yup.string(),
      bvlDocuments: Yup.string(),
      pprDocuments: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasBvlFile = false;
        let hasPprFile = false;

        const jsonData = {
          visaApplicationDetails: {
            bvlAndPpr: {
              bvlReceivedDate: values.bvlReceivedDate || "",
              pprReceivedDate: values.pprReceivedDate || "",
            },
          },
        };

        const oldData =
          applicationData?.visaApplicationDetails?.bvlAndPpr || {};
        if (
          oldData.bvlReceivedDate !== values.bvlReceivedDate ||
          oldData.pprReceivedDate !== values.pprReceivedDate
        ) {
          hasJsonChanges = true;
        }

        let bvlFormData = null;
        if (values.bvlDocuments) {
          hasBvlFile = true;
          bvlFormData = new FormData();
          bvlFormData.append("uploadedDocument", values.bvlDocuments);
          bvlFormData.append("customDocumentName", "BVL Document");
          bvlFormData.append(
            "ref_module",
            applicationData?.visaApplicationDetails?._id
          );
        }

        let pprFormData = null;
        if (values.pprDocuments) {
          hasPprFile = true;
          pprFormData = new FormData();
          pprFormData.append("uploadedDocument", values.pprDocuments);
          pprFormData.append("customDocumentName", "PPR Document");
          pprFormData.append(
            "ref_module",
            applicationData?.visaApplicationDetails?._id
          );
        }

        if (!hasJsonChanges && !hasBvlFile && !hasPprFile) {
          toast.info("No changes detected.");
          return;
        }

        if (hasBvlFile && bvlFormData) {
          await dispatch(updateStudentApplication(bvlFormData, id));
        }

        if (hasPprFile && pprFormData) {
          await dispatch(updateStudentApplication(pprFormData, id));
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        await fetchData();
        toast.success("BVL and PPR details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update BVL and PPR details:", error);
        toast.error(
          error.message ||
            "Failed to update BVL and PPR details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.bvlAndPpr) {
      const bvlPpr = applicationData.visaApplicationDetails.bvlAndPpr;
      formik.setValues({
        bvlReceivedDate: bvlPpr.bvlReceivedDate
          ? toISODate(parseDate(bvlPpr.bvlReceivedDate))
          : "",
        bvlDocuments: "",
        pprReceivedDate: bvlPpr.pprReceivedDate
          ? toISODate(parseDate(bvlPpr.pprReceivedDate))
          : "",
        pprDocuments: "",
      });
    }
  }, [applicationData]);

  const handleBvlFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("bvlDocuments", file);
  };

  const handlePprFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("pprDocuments", file);
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
          <h5>BVL & PPR</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>BVL Letter Received Date</Form.Label>
                  <div style={{ position: "relative" }} ref={bvlCalendarRef}>
                    <Form.Control
                      type="text"
                      name="bvlReceivedDate"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.bvlReceivedDate
                          ? formatDate(parseDate(formik.values.bvlReceivedDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowBvlCalendar(true)}
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
                    {showBvlCalendar && (
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
                              "bvlReceivedDate",
                              toISODate(selectedDate)
                            );
                            setShowBvlCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.bvlReceivedDate) ||
                            new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.bvlReceivedDate &&
                      formik.errors.bvlReceivedDate && (
                        <div className="text-danger">
                          {formik.errors.bvlReceivedDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload BVL Document</Form.Label>
                  <Form.Control
                    type="file"
                    name="bvlDocuments"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    className="custom-select-height"
                    onChange={handleBvlFileChange}
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) => doc.customDocumentName === "BVL Document"
                      ) || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>PPR Received Date</Form.Label>
                  <div style={{ position: "relative" }} ref={pprCalendarRef}>
                    <Form.Control
                      type="text"
                      name="pprReceivedDate"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.pprReceivedDate
                          ? formatDate(parseDate(formik.values.pprReceivedDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowPprCalendar(true)}
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
                    {showPprCalendar && (
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
                              "pprReceivedDate",
                              toISODate(selectedDate)
                            );
                            setShowPprCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.pprReceivedDate) ||
                            new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.pprReceivedDate &&
                      formik.errors.pprReceivedDate && (
                        <div className="text-danger">
                          {formik.errors.pprReceivedDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload PPR Document (PDF/JPG)</Form.Label>
                  <Form.Control
                    type="file"
                    name="pprDocuments"
                    accept=".pdf,.jpg,.jpeg"
                    className="custom-select-height"
                    onChange={handlePprFileChange}
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) => doc.customDocumentName === "PPR Document"
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

export default CanadaBvlPpr;
