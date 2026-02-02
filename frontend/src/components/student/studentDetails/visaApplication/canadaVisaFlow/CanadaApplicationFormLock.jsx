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

const CanadaApplicationFormLock = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showLockDateCalendar, setShowLockDateCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const lockDateCalendarRef = useRef(null);
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
        lockDateCalendarRef.current &&
        !lockDateCalendarRef.current.contains(event.target)
      ) {
        setShowLockDateCalendar(false);
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
      locked: "No",
      lockDate: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      locked: Yup.string().required("Form locked status is required"),
      lockDate: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const jsonData = {
          visaApplicationDetails: {
            applicationFormLock: {
              locked: values.locked === "Yes",
              lockDate: values.locked === "Yes" ? values.lockDate || "" : null,
            },
          },
        };

        dispatch(updateStudentApplication(jsonData, id));

        await fetchData();
        toast.success("Application form lock details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update application form lock details:", error);
        toast.error(
          error.message ||
            "Failed to update application form lock details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.applicationFormLock) {
      const formLock =
        applicationData.visaApplicationDetails.applicationFormLock;
      formik.setValues({
        locked: formLock.locked ? "Yes" : "No",
        lockDate: formLock.lockDate
          ? toISODate(parseDate(formLock.lockDate))
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
          <h5>Application Form Lock</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Form Locked?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      name="locked"
                      value="Yes"
                      id="yesformLocked"
                      checked={formik.values.locked === "Yes"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      name="locked"
                      value="No"
                      id="noformLocked"
                      checked={formik.values.locked === "No"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </div>
                  {formik.touched.locked && formik.errors.locked && (
                    <div className="text-danger">{formik.errors.locked}</div>
                  )}
                </Form.Group>
              </Col>
              {formik.values.locked === "Yes" && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Lock Date</Form.Label>
                    <div
                      style={{ position: "relative" }}
                      ref={lockDateCalendarRef}
                    >
                      <Form.Control
                        type="text"
                        name="lockDate"
                        className="custom-select-height"
                        placeholder="dd/mm/yyyy"
                        value={
                          formik.values.lockDate
                            ? formatDate(parseDate(formik.values.lockDate))
                            : ""
                        }
                        readOnly
                        onClick={() => setShowLockDateCalendar(true)}
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
                      {showLockDateCalendar && (
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
                                "lockDate",
                                toISODate(selectedDate)
                              );
                              setShowLockDateCalendar(false);
                            }}
                            value={
                              parseDate(formik.values.lockDate) || new Date()
                            }
                            locale="en-GB"
                          />
                        </div>
                      )}
                      {formik.touched.lockDate && formik.errors.lockDate && (
                        <div className="text-danger">
                          {formik.errors.lockDate}
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>
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
      </div>
    </>
  );
};

export default CanadaApplicationFormLock;
