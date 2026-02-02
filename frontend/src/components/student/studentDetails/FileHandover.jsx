import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch } from "react-redux";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { updateStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";
import { toast } from "react-toastify";
import usePermissions from "../../commonComponents/usePermissions";

const FileHandover = ({
  formData,
  formatDate,
  parseDate,
  fetchOneStudentDetails,
  id,
  userRole,
}) => {
  const { canCreate, canUpdate } = usePermissions(
    "Student Applications",
    "Visa Application"
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showFileHandoverDateCalendar, setShowFileHandoverDateCalendar] =
    useState(false);
  const [fileHandoverDateValue, setFileHandoverDateValue] = useState(null);
  const fileHandoverDateInputRef = useRef(null);
  const fileHandoverFormik = useFormik({
    initialValues: {
      visaFileHandover: {
        date: formData?.visaApplicationDetails?.visaFileHandover?.date || "",
      },
    },
    onSubmit: (values, { resetForm }) => {
      handleFileHandoverSubmit(values, resetForm, fileHandoverFormik);
    },
  });
  useEffect(() => {
    fileHandoverFormik.setValues({
      visaFileHandover: {
        date: formData?.visaApplicationDetails?.visaFileHandover?.date || "",
      },
    });
  }, [formData]);
  const handleFileHandoverSubmit = async (values, resetForm) => {
    if (!values.visaFileHandover.date) {
      toast.error("Please provide a date.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        visaApplicationDetails: {
          visaFileHandover: {
            date: values.visaFileHandover.date,
          },
        },
      };

      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating file handover date"
        );
        return;
      }

      toast.success("File handover date updated successfully");
      resetForm({
        values: {
          date: formData?.visaApplicationDetails?.visaFileHandover?.date || "",
        },
      });
      fetchOneStudentDetails();
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5>File Handover</h5>
        </div>

        <div className="bg-white mt-3 p-3">
          <Form onSubmit={fileHandoverFormik.handleSubmit}>
            <Row className="d-flex">
              <Col md={4} className="mb-4">
                <Form.Group>
                  <Form.Label>File Handover Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="visaFileHandover.date"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        fileHandoverFormik.values.visaFileHandover?.date
                          ? formatDate(
                              parseDate(
                                fileHandoverFormik.values.visaFileHandover?.date
                              )
                            )
                          : ""
                      }
                      readOnly
                      ref={fileHandoverDateInputRef}
                      onClick={() => {
                        if (fileHandoverFormik.values.visaFileHandover?.date) {
                          setFileHandoverDateValue(
                            parseDate(
                              fileHandoverFormik.values.visaFileHandover?.date
                            )
                          );
                        }
                        setShowFileHandoverDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                        backgroundColor: "#fff",
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
                    {showFileHandoverDateCalendar && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: 300,
                          minWidth: 300,
                          maxWidth: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            setFileHandoverDateValue(selectedDate);
                            fileHandoverFormik.setFieldValue(
                              "visaFileHandover.date",
                              formatDate(selectedDate)
                            );
                            setShowFileHandoverDateCalendar(false);
                          }}
                          value={fileHandoverDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {userRole !== "Student" && userRole !== "LeadStudent" && (canCreate || canUpdate) && (
              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  type="submit"
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
    </>
  );
};

export default FileHandover;
