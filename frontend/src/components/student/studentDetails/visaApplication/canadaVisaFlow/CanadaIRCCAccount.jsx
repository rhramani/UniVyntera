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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { decryptData } from "../../../../../utils/encryptionUtils";

const CanadaIRCCAccount = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCredential, setShowCredential] = useState(false);
  const [showAccountOpenDateCalendar, setShowAccountOpenDateCalendar] =
    useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const dispatch = useDispatch();
  const accountOpenDateCalendarRef = useRef(null);
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
    } else {
      toast.error("Invalid application ID. Please provide a valid ID.");
    }
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountOpenDateCalendarRef.current &&
        !accountOpenDateCalendarRef.current.contains(event.target)
      ) {
        setShowAccountOpenDateCalendar(false);
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
      accountOpenDate: "",
      gckeyId: "",
      password: "",
      securityQuestion: "",
      securityAnswer: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      accountOpenDate: Yup.string().required("Account open date is required"),
      gckeyId: Yup.string().required("IRCC/GCKey ID is required"),
      password: Yup.string().required("Password is required"),
      securityQuestion: Yup.string().required("Security question is required"),
      securityAnswer: Yup.string().required("Security answer is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const jsonData = {
          visaApplicationDetails: {
            gckeyAccount: {
              accountOpenDate: values.accountOpenDate || "",
              gckeyId: values.gckeyId,
              password: values.password,
              securityQuestion: values.securityQuestion,
              securityAnswer: values.securityAnswer,
            },
          },
        };

        await dispatch(updateStudentApplication(jsonData, id));
        await fetchData();
        toast.success("IRCC/GCKey account details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update IRCC/GCKey account details:", error);
        toast.error(
          error.message ||
            "Failed to update IRCC/GCKey account details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.gckeyAccount) {
      const gckey = applicationData.visaApplicationDetails.gckeyAccount;
      formik.setValues({
        accountOpenDate: gckey.accountOpenDate
          ? toISODate(parseDate(gckey.accountOpenDate))
          : "",
        gckeyId: gckey.gckeyId || "",
        password: gckey.password || "",
        securityQuestion: gckey.securityQuestion || "",
        securityAnswer: gckey.securityAnswer || "",
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
          <h5>IRCC / GCKey Account</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Account Open Date</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={accountOpenDateCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      name="accountOpenDate"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.accountOpenDate
                          ? formatDate(parseDate(formik.values.accountOpenDate))
                          : ""
                      }
                      readOnly
                      onClick={() => setShowAccountOpenDateCalendar(true)}
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
                    {showAccountOpenDateCalendar && (
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
                              "accountOpenDate",
                              toISODate(selectedDate)
                            );
                            setShowAccountOpenDateCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.accountOpenDate) ||
                            new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.accountOpenDate &&
                      formik.errors.accountOpenDate && (
                        <div className="text-danger">
                          {formik.errors.accountOpenDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>IRCC / GCKey ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="gckeyId"
                    className="custom-select-height"
                    placeholder="Enter IRCC / GCKey ID"
                    value={formik.values.gckeyId}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.gckeyId && formik.errors.gckeyId && (
                    <div className="text-danger">{formik.errors.gckeyId}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showCredential ? "text" : "password"}
                      placeholder="Enter password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      name="password"
                      className="custom-select-height"
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <span
                      onClick={() => setShowCredential(!showCredential)}
                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                      style={{ cursor: "pointer" }}
                    >
                      {showCredential ? (
                        <VisibilityOff sx={{ fontSize: 18 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 18 }} />
                      )}
                    </span>
                  </div>
                  {formik.touched.password && 
                    formik.errors.password && (
                      <div className="text-danger">
                        {formik.errors.password}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Security Question</Form.Label>
                  <Form.Control
                    type="text"
                    name="securityQuestion"
                    className="custom-select-height"
                    placeholder="Enter Security Question"
                    value={formik.values.securityQuestion}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.securityQuestion &&
                    formik.errors.securityQuestion && (
                      <div className="text-danger">
                        {formik.errors.securityQuestion}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Security Answer</Form.Label>
                  <Form.Control
                    type="text"
                    name="securityAnswer"
                    className="custom-select-height"
                    placeholder="Enter Security Answer"
                    value={formik.values.securityAnswer}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.securityAnswer &&
                    formik.errors.securityAnswer && (
                      <div className="text-danger">
                        {formik.errors.securityAnswer}
                      </div>
                    )}
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

export default CanadaIRCCAccount;
