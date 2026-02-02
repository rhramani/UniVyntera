import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
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
} from "../../../../../redux/actions/Student/StudentApplication.action";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { decryptData } from "../../../../../utils/encryptionUtils";

const AusImmiAccountCreation = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showCredential, setShowCredential] = useState(false);

  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const dateCalendarRef = useRef(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      toast.error("Failed to fetch application data.");
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateCalendarRef.current &&
        !dateCalendarRef.current.contains(event.target)
      ) {
        setShowDateCalendar(false);
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
  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.immiAccount) {
      const immiAccount = applicationData?.visaApplicationDetails.immiAccount;
      formik.setValues({
        accountId: immiAccount.accountId || "",
        password: immiAccount.password || "",
        securityQuestion: immiAccount.securityQuestion || "",
        securityAnswer: immiAccount.securityAnswer || "",
        creationDate: immiAccount.creationDate
          ? toISODate(parseDate(immiAccount.creationDate))
          : "",
      });
    }
  }, [applicationData]);

  const formik = useFormik({
    initialValues: {
      creationDate: "",
      accountId: "",
      password: "",
      securityQuestion: "",
      securityAnswer: "",
    },
    validationSchema: Yup.object({
      creationDate: Yup.string(),
      accountId: Yup.string(),
      password: Yup.string(),
      securityQuestion: Yup.string(),
      securityAnswer: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const jsonData = {
          visaApplicationDetails: {
            immiAccount: {
              creationDate: values.creationDate,
              accountId: values.accountId,
              password: values.password,
              securityQuestion: values.securityQuestion,
              securityAnswer: values.securityAnswer,
            },
          },
        };

        await dispatch(updateStudentApplication(jsonData, id));
        await fetchData();
        toast.success("ImmiAccount details updated successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to update ImmiAccount details.");
      } finally {
        setIsLoading(false);
      }
    },
  });

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
      <h5>ImmiAccount Creation</h5>
      <div className="bg-white mt-3 p-3">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Account Creation Date</Form.Label>
                <div style={{ position: "relative" }} ref={dateCalendarRef}>
                  <Form.Control
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={
                      formik.values.creationDate
                        ? formatDate(parseDate(formik.values.creationDate))
                        : ""
                    }
                    readOnly
                    onClick={() => setShowDateCalendar(true)}
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
                  {showDateCalendar && (
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
                          formik.setFieldValue("creationDate", toISODate(date));
                          setShowDateCalendar(false);
                        }}
                        value={parseDate(formik.values.creationDate) || null}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>ImmiAccount ID / Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter ID / Username"
                  value={formik.values.accountId}
                  onChange={formik.handleChange}
                  name="accountId"
                  className="custom-select-height"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
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
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <span
                    onClick={() => setShowCredential(!showCredential)}
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                  >
                    {showCredential ? (
                      <Visibility sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityOff sx={{ fontSize: 18 }} />
                    )}
                  </span>
                </div>
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Security Question</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter security question"
                  value={formik.values.securityQuestion}
                  onChange={formik.handleChange}
                  name="securityQuestion"
                  className="custom-select-height"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Security Answer</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter security answer"
                  value={formik.values.securityAnswer}
                  onChange={formik.handleChange}
                  name="securityAnswer"
                  className="custom-select-height"
                  style={{
                    cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                  }}
                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                />
              </Form.Group>
            </Col>
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
    </div>
  );
};

export default AusImmiAccountCreation;
