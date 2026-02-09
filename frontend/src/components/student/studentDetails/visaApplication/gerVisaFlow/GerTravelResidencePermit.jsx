import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
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
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const GerTravelResidencePermit = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showArrivalCalendar, setShowArrivalCalendar] = useState(false);
  const [showPermitAppCalendar, setShowPermitAppCalendar] = useState(false);
  const [showPermitFromCalendar, setShowPermitFromCalendar] = useState(false);
  const [showPermitToCalendar, setShowPermitToCalendar] = useState(false);
  const arrivalRef = useRef(null);
  const permitAppRef = useRef(null);
  const permitFromRef = useRef(null);
  const permitToRef = useRef(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Residence Permit Document", "Travel Flight Ticket"];
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      toast.error("Failed to fetch application data.");
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
      [arrivalRef, permitAppRef, permitFromRef, permitToRef].forEach((ref) => {
        if (ref.current && !ref.current.contains(event.target)) {
          if (ref === arrivalRef) setShowArrivalCalendar(false);
          if (ref === permitAppRef) setShowPermitAppCalendar(false);
          if (ref === permitFromRef) setShowPermitFromCalendar(false);
          if (ref === permitToRef) setShowPermitToCalendar(false);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
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

  const isDocumentUploaded = (documentType) => {
    return applicationData?.uploadedDocumentDetails?.some(
      (doc) => doc.customDocumentName === documentType
    );
  };

  const formik = useFormik({
    initialValues: {
      flightTicketUpload: "",
      arrivalDate: "",
      rpApplicationDate: "",
      residencePermitFrom: "",
      residencePermitTo: "",
      residencePermitUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      arrivalDate: Yup.string(),
      rpApplicationDate: Yup.string(),
      residencePermitFrom: Yup.string(),
      residencePermitTo: Yup.string(),
      flightTicketUpload: Yup.string(),
      residencePermitUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const oldData =
          applicationData?.visaApplicationDetails?.travelResidencePermit || {};
        let hasJsonChanges = false;
        let hasFileUpload = false;

        if (
          oldData.arrivalDate !== values.arrivalDate ||
          oldData.rpApplicationDate !== values.rpApplicationDate ||
          oldData.validity?.from !== values.residencePermitFrom ||
          oldData.validity?.to !== values.residencePermitTo
        ) {
          hasJsonChanges = true;
        }

        if (values.flightTicketUpload || values.residencePermitUpload) {
          hasFileUpload = true;
        }

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          return;
        }

        const jsonData = {
          visaApplicationDetails: {
            travelResidencePermit: {
              arrivalDate: values.arrivalDate,
              rpApplicationDate: values.rpApplicationDate,
              validity: {
                from: values.residencePermitFrom,
                to: values.residencePermitTo,
              },
            },
          },
        };

        const refModuleId = applicationData?.visaApplicationDetails?._id;

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload) {
          const uploadPromises = [];

          if (values.flightTicketUpload) {
            const formData = new FormData();
            formData.append("uploadedDocument", values.flightTicketUpload);
            formData.append("customDocumentName", "Travel Flight Ticket");
            formData.append("ref_module", refModuleId);
            uploadPromises.push(
              dispatch(updateStudentApplication(formData, id))
            );
          }

          if (values.residencePermitUpload) {
            const formData = new FormData();
            formData.append("uploadedDocument", values.residencePermitUpload);
            formData.append("customDocumentName", "Residence Permit Document");
            formData.append("ref_module", refModuleId);
            uploadPromises.push(
              dispatch(updateStudentApplication(formData, id))
            );
          }

          await Promise.all(uploadPromises);
        }

        await fetchData();
        toast.success(
          "Travel & Residence Permit details updated successfully!"
        );
        resetForm();
      } catch (error) {
        console.error(
          "Failed to update travel and residence permit details:",
          error
        );
        toast.error(
          error.message ||
            "Failed to update travel and residence permit details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.travelResidencePermit) {
      const travelResidencePermit =
        applicationData.visaApplicationDetails.travelResidencePermit;
      formik.setValues({
        flightTicketUpload: "",
        arrivalDate: travelResidencePermit.arrivalDate
          ? toISODate(parseDate(travelResidencePermit.arrivalDate))
          : "",
        rpApplicationDate: travelResidencePermit.rpApplicationDate
          ? toISODate(parseDate(travelResidencePermit.rpApplicationDate))
          : "",
        residencePermitFrom: travelResidencePermit.validity?.from
          ? toISODate(parseDate(travelResidencePermit.validity.from))
          : "",
        residencePermitTo: travelResidencePermit.validity?.to
          ? toISODate(parseDate(travelResidencePermit.validity.to))
          : "",
        residencePermitUpload: "",
      });
    }
  }, [applicationData]);

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
        <h5>Travel & Residence Permit</h5>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Flight Ticket Upload</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "flightTicketUpload",
                        event.currentTarget.files[0]
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      isDocumentUploaded("Travel Flight Ticket") ||
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.flightTicketUpload &&
                    formik.errors.flightTicketUpload && (
                      <div className="text-danger small">
                        {formik.errors.flightTicketUpload}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Arrival Date in Germany</Form.Label>
                  <div style={{ position: "relative" }} ref={arrivalRef}>
                    <Form.Control
                      type="text"
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
                            const formattedDate = toISODate(date);
                            formik.setFieldValue("arrivalDate", formattedDate);
                            setShowArrivalCalendar(false);
                          }}
                          value={parseDate(formik.values.arrivalDate) || null}
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.arrivalDate &&
                      formik.errors.arrivalDate && (
                        <div className="text-danger small">
                          {formik.errors.arrivalDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Residence Permit Application Date</Form.Label>
                  <div style={{ position: "relative" }} ref={permitAppRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.rpApplicationDate
                          ? formatDate(
                              parseDate(formik.values.rpApplicationDate)
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowPermitAppCalendar(true)}
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
                    {showPermitAppCalendar && (
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
                            const formattedDate = toISODate(date);
                            formik.setFieldValue(
                              "rpApplicationDate",
                              formattedDate
                            );
                            setShowPermitAppCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.rpApplicationDate) || null
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.rpApplicationDate &&
                      formik.errors.rpApplicationDate && (
                        <div className="text-danger small">
                          {formik.errors.rpApplicationDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Residence Permit Valid From</Form.Label>
                  <div style={{ position: "relative" }} ref={permitFromRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.residencePermitFrom
                          ? formatDate(
                              parseDate(formik.values.residencePermitFrom)
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowPermitFromCalendar(true)}
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
                    {showPermitFromCalendar && (
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
                            const formattedDate = toISODate(date);
                            formik.setFieldValue(
                              "residencePermitFrom",
                              formattedDate
                            );
                            setShowPermitFromCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.residencePermitFrom) || null
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.residencePermitFrom &&
                      formik.errors.residencePermitFrom && (
                        <div className="text-danger small">
                          {formik.errors.residencePermitFrom}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Residence Permit Valid To</Form.Label>
                  <div style={{ position: "relative" }} ref={permitToRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.residencePermitTo
                          ? formatDate(
                              parseDate(formik.values.residencePermitTo)
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowPermitToCalendar(true)}
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
                    {showPermitToCalendar && (
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
                            const formattedDate = toISODate(date);
                            formik.setFieldValue(
                              "residencePermitTo",
                              formattedDate
                            );
                            setShowPermitToCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.residencePermitTo) || null
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.residencePermitTo &&
                      formik.errors.residencePermitTo && (
                        <div className="text-danger small">
                          {formik.errors.residencePermitTo}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Residence Permit Card/Document</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "residencePermitUpload",
                        event.currentTarget.files[0]
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      isDocumentUploaded("Residence Permit Document") ||
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.residencePermitUpload &&
                    formik.errors.residencePermitUpload && (
                      <div className="text-danger small">
                        {formik.errors.residencePermitUpload}
                      </div>
                    )}
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

export default GerTravelResidencePermit;
