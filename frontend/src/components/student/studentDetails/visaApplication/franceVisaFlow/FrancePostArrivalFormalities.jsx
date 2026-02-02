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
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const FrancePostArrivalFormalities = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showArrivalCalendar, setShowArrivalCalendar] = useState(false);
  const [showOfiiCalendar, setShowOfiiCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const dispatch = useDispatch();
  const arrivalDateRef = useRef(null);
  const ofiiDateRef = useRef(null);

  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["OFII Document"];
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
        arrivalDateRef.current &&
        !arrivalDateRef.current.contains(event.target)
      ) {
        setShowArrivalCalendar(false);
      }
      if (ofiiDateRef.current && !ofiiDateRef.current.contains(event.target)) {
        setShowOfiiCalendar(false);
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
      arrivalDate: "",
      ofiiRegistrationDate: "",
      ofiiDocUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      arrivalDate: Yup.string().required("Arrival date is required"),
      ofiiRegistrationDate: Yup.string(),
      ofiiDocUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            postArrivalFormalities: {
              arrivalDate: values.arrivalDate,
              ofiiRegistrationDate: values.ofiiRegistrationDate,
            },
          },
        };

        const oldPostArrival =
          applicationData?.visaApplicationDetails?.postArrivalFormalities || {};
        if (
          oldPostArrival.arrivalDate !== values.arrivalDate ||
          oldPostArrival.ofiiRegistrationDate !== values.ofiiRegistrationDate
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.ofiiDocUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.ofiiDocUpload);
          formData.append("customDocumentName", "OFII Document");
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
        toast.success("Post-Arrival Formalities updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update post-arrival formalities:", error);
        toast.error(
          error.message ||
            "Failed to update post-arrival formalities. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.postArrivalFormalities) {
      const postArrival =
        applicationData.visaApplicationDetails.postArrivalFormalities;
      formik.setValues({
        arrivalDate: postArrival.arrivalDate
          ? toISODate(parseDate(postArrival.arrivalDate))
          : "",
        ofiiRegistrationDate: postArrival.ofiiRegistrationDate
          ? toISODate(parseDate(postArrival.ofiiRegistrationDate))
          : "",
        ofiiDocUpload: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("ofiiDocUpload", file);
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
          <h5>Post-Arrival Formalities</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Arrival Date in France</Form.Label>
                  <div style={{ position: "relative" }} ref={arrivalDateRef}>
                    <Form.Control
                      type="text"
                      name="arrivalDate"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.arrivalDate
                          ? formatDate(parseDate(formik.values.arrivalDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowArrivalCalendar(true)}
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
                    {showArrivalCalendar && (
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
                              "arrivalDate",
                              toISODate(date)
                            );
                            setShowArrivalCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.arrivalDate) || new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.arrivalDate &&
                      formik.errors.arrivalDate && (
                        <div className="text-danger">
                          {formik.errors.arrivalDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>OFII Registration Date</Form.Label>
                  <div style={{ position: "relative" }} ref={ofiiDateRef}>
                    <Form.Control
                      type="text"
                      name="ofiiRegistrationDate"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.ofiiRegistrationDate
                          ? formatDate(
                              parseDate(formik.values.ofiiRegistrationDate)
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowOfiiCalendar(true)}
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
                    {showOfiiCalendar && (
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
                              "ofiiRegistrationDate",
                              toISODate(date)
                            );
                            setShowOfiiCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.ofiiRegistrationDate) ||
                            new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.ofiiRegistrationDate &&
                      formik.errors.ofiiRegistrationDate && (
                        <div className="text-danger">
                          {formik.errors.ofiiRegistrationDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Upload OFII Validation / Residence Permit (PDF/JPG/PNG)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="ofiiDocUpload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="custom-select-height"
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) => doc.customDocumentName === "OFII Document"
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

export default FrancePostArrivalFormalities;
