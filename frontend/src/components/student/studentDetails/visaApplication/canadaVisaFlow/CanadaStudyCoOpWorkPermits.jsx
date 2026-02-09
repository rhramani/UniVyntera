import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  updateStudentApplication,
  getOneStudentApplication,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { decryptData } from "../../../../../utils/encryptionUtils";

const CanadaStudyCoOpWorkPermits = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showStudyFromCalendar, setShowStudyFromCalendar] = useState(false);
  const [showStudyToCalendar, setShowStudyToCalendar] = useState(false);
  const [showCoOpFromCalendar, setShowCoOpFromCalendar] = useState(false);
  const [showCoOpToCalendar, setShowCoOpToCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const dispatch = useDispatch();
  const studyFromRef = useRef(null);
  const studyToRef = useRef(null);
  const coOpFromRef = useRef(null);
  const coOpToRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));

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
        studyFromRef.current &&
        !studyFromRef.current.contains(event.target)
      ) {
        setShowStudyFromCalendar(false);
      }
      if (studyToRef.current && !studyToRef.current.contains(event.target)) {
        setShowStudyToCalendar(false);
      }
      if (coOpFromRef.current && !coOpFromRef.current.contains(event.target)) {
        setShowCoOpFromCalendar(false);
      }
      if (coOpToRef.current && !coOpToRef.current.contains(event.target)) {
        setShowCoOpToCalendar(false);
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
      studyPermitFrom: "",
      studyPermitTo: "",
      coOpPermitFrom: "",
      coOpPermitTo: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      studyPermitFrom: Yup.string(),
      studyPermitTo: Yup.string(),
      coOpPermitFrom: Yup.string(),
      coOpPermitTo: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const jsonData = {
          visaApplicationDetails: {
            permits: {
              studyPermitFrom: values.studyPermitFrom || "",
              studyPermitTo: values.studyPermitTo || "",
              coOpPermitFrom: values.coOpPermitFrom || "",
              coOpPermitTo: values.coOpPermitTo || "",
            },
          },
        };

        await dispatch(updateStudentApplication(jsonData, id));

        await fetchData();
        toast.success("Permit details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update permit details:", error);
        toast.error(
          error.message || "Failed to update permit details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.permits) {
      const permits = applicationData.visaApplicationDetails.permits;
      formik.setValues({
        studyPermitFrom: permits.studyPermitFrom
          ? toISODate(parseDate(permits.studyPermitFrom))
          : "",
        studyPermitTo: permits.studyPermitTo
          ? toISODate(parseDate(permits.studyPermitTo))
          : "",
        coOpPermitFrom: permits.coOpPermitFrom
          ? toISODate(parseDate(permits.coOpPermitFrom))
          : "",
        coOpPermitTo: permits.coOpPermitTo
          ? toISODate(parseDate(permits.coOpPermitTo))
          : "",
      });
    }
  }, [applicationData]);

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
          <h5>Study / Co-op Work Permits</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Study Permit Valid From → To</Form.Label>
                  <div style={{ position: "relative" }} ref={studyFromRef}>
                    <Form.Control
                      type="text"
                      name="studyPermitFrom"
                      className="custom-select-height"
                      placeholder="From (dd/mm/yyyy)"
                      value={
                        formik.values.studyPermitFrom
                          ? formatDate(parseDate(formik.values.studyPermitFrom))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowStudyFromCalendar(true)}
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
                    {showStudyFromCalendar && (
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
                              "studyPermitFrom",
                              toISODate(selectedDate)
                            );
                            setShowStudyFromCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.studyPermitFrom) ||
                            new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.studyPermitFrom &&
                      formik.errors.studyPermitFrom && (
                        <div className="text-danger">
                          {formik.errors.studyPermitFrom}
                        </div>
                      )}
                  </div>
                  <div
                    style={{ position: "relative", marginTop: "8px" }}
                    ref={studyToRef}
                  >
                    <Form.Control
                      type="text"
                      name="studyPermitTo"
                      className="custom-select-height"
                      placeholder="To (dd/mm/yyyy)"
                      value={
                        formik.values.studyPermitTo
                          ? formatDate(parseDate(formik.values.studyPermitTo))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowStudyToCalendar(true)}
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
                    {showStudyToCalendar && (
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
                              "studyPermitTo",
                              toISODate(selectedDate)
                            );
                            setShowStudyToCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.studyPermitTo) || new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.studyPermitTo &&
                      formik.errors.studyPermitTo && (
                        <div className="text-danger">
                          {formik.errors.studyPermitTo}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Co-op Work Permit Valid From → To</Form.Label>
                  <div style={{ position: "relative" }} ref={coOpFromRef}>
                    <Form.Control
                      type="text"
                      name="coOpPermitFrom"
                      className="custom-select-height"
                      placeholder="From (dd/mm/yyyy)"
                      value={
                        formik.values.coOpPermitFrom
                          ? formatDate(parseDate(formik.values.coOpPermitFrom))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowCoOpFromCalendar(true)}
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
                    {showCoOpFromCalendar && (
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
                              "coOpPermitFrom",
                              toISODate(selectedDate)
                            );
                            setShowCoOpFromCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.coOpPermitFrom) ||
                            new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.coOpPermitFrom &&
                      formik.errors.coOpPermitFrom && (
                        <div className="text-danger">
                          {formik.errors.coOpPermitFrom}
                        </div>
                      )}
                  </div>
                  <div
                    style={{ position: "relative", marginTop: "8px" }}
                    ref={coOpToRef}
                  >
                    <Form.Control
                      type="text"
                      name="coOpPermitTo"
                      className="custom-select-height"
                      placeholder="To (dd/mm/yyyy)"
                      value={
                        formik.values.coOpPermitTo
                          ? formatDate(parseDate(formik.values.coOpPermitTo))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowCoOpToCalendar(true)}
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
                    {showCoOpToCalendar && (
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
                              "coOpPermitTo",
                              toISODate(selectedDate)
                            );
                            setShowCoOpToCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.coOpPermitTo) || new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.coOpPermitTo &&
                      formik.errors.coOpPermitTo && (
                        <div className="text-danger">
                          {formik.errors.coOpPermitTo}
                        </div>
                      )}
                  </div>
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
      </div>
    </>
  );
};

export default CanadaStudyCoOpWorkPermits;
