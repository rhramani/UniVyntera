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
} from "../../../../../redux/actions/Student/StudentApplication.action";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { decryptData } from "../../../../../utils/encryptionUtils";

const UsaRegistration = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const registrationDateRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));

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
        registrationDateRef.current &&
        !registrationDateRef.current.contains(event.target)
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
      started: "No",
      registrationDate: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      started: Yup.string().required("Please select an option"),
      registrationDate: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;

        const jsonData = {
          visaApplicationDetails: {
            ds160Registration: {
              started: values.started === "Yes",
              registrationDate:
                values.started === "Yes" ? values.registrationDate : null,
            },
          },
        };

        const oldData =
          applicationData?.visaApplicationDetails?.ds160Registration || {};
        if (
          oldData.started !== (values.started === "Yes") ||
          oldData.registrationDate !==
            (values.started === "Yes" ? values.registrationDate : null)
        ) {
          hasJsonChanges = true;
        }

        if (!hasJsonChanges) {
          toast.info("No changes detected.");
          return;
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        await fetchData();
        toast.success("Registration updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update registration:", error);
        toast.error("Failed to update registration. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.ds160Registration) {
      const registration =
        applicationData.visaApplicationDetails.ds160Registration;
      formik.setValues({
        started: registration.started ? "Yes" : "No",
        registrationDate:
          toISODate(parseDate(registration.registrationDate)) || "",
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
          <h5>DS-160 Registration</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>DS-160 Registration?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      id="yesRegistration"
                      name="started"
                      value="Yes"
                      checked={formik.values.started === "Yes"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      id="noRegistration"
                      name="started"
                      value="No"
                      checked={formik.values.started === "No"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.errors.started && formik.touched.started && (
                      <div className="text-danger">{formik.errors.started}</div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              {formik.values.started === "Yes" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Registration Date</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={registrationDateRef}
                      >
                        <Form.Control
                          type="text"
                          name="registrationDate"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.registrationDate
                              ? formatDate(
                                  parseDate(formik.values.registrationDate)
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
                                  "registrationDate",
                                  toISODate(selectedDate)
                                );
                                setShowCalendar(false);
                              }}
                              value={
                                parseDate(formik.values.registrationDate) ||
                                null
                              }
                              locale="en-GB"
                              onClickOutside={() => setShowCalendar(false)}
                            />
                          </div>
                        )}
                      </div>
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
      </div>
    </>
  );
};

export default UsaRegistration;
