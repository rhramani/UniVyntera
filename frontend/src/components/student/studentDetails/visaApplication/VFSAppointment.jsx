import { useFormik } from "formik";
import { updateStudentApplication } from "../../../../redux/actions/Student/StudentApplication.action";
import { updateVisitorApplication } from "../../../../redux/actions/Visitor/VisitorApplication.action";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import { Button, Col, Form, Row } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import usePermissions from "../../../commonComponents/usePermissions";

const VFSAppointment = ({
  id,
  formatDate,
  parseDate,
  toISODate,
  formData,
  fetchOneStudentDetails,
  fetchOneVisitorDetails,
  mode,
  userRole
}) => {
  const { canCreate, canUpdate } = usePermissions(
    "Student Applications",
    "Visa Application"
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const appointmentCalendarRef = useRef(null);
  const [showAppointmentDateCalendar, setShowAppointmentDateCalendar] =
    useState(false);

  const vfsAppointmentFormik = useFormik({
    initialValues: {
      VFSAppointmentDateTime:
        formData?.visaApplicationDetails?.VFSAppointmentDateTime || "",
    },
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleVFSAppointmentSubmit(values, resetForm);
    },
  });

  // Close calendar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appointmentCalendarRef.current &&
        !appointmentCalendarRef.current.contains(event.target)
      ) {
        setShowAppointmentDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Populate formik values if data exists
  useEffect(() => {
    if (formData?.visaApplicationDetails?.VFSAppointmentDateTime) {
      vfsAppointmentFormik.setValues({
        VFSAppointmentDateTime: toISODate(
          parseDate(formData.visaApplicationDetails.VFSAppointmentDateTime)
        ),
      });
    }
  }, [formData]);

  const handleVFSAppointmentSubmit = async (values, resetForm) => {
    const isDateProvided = values.VFSAppointmentDateTime;

    if (!isDateProvided) {
      toast.error(
        "Please provide an appointment date or upload an appointment letter."
      );
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        visaApplicationDetails: {
          VFSAppointmentDateTime: isDateProvided,
        },
      };

      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id)
      );
      if (res?.status !== 200) {
        toast.error(res?.data?.message || "Error updating appointment date");
        return;
      }

      toast.success("VFS appointment details updated successfully");

      resetForm({
        values: {
          VFSAppointmentDateTime: isDateProvided,
        },
      });

      if (mode === "student") {
        await fetchOneStudentDetails();
      } else if (mode === "visitor") {
        await fetchOneVisitorDetails();
      }
    } catch (error) {
      console.error("Submission error:", error?.response?.data || error);
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
          <h5>VFS Appointment</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={vfsAppointmentFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Appointment Date</Form.Label>
                  <div
                    style={{ position: "relative" }}
                    ref={appointmentCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      name="VFSAppointmentDateTime"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        vfsAppointmentFormik.values.VFSAppointmentDateTime
                          ? formatDate(
                              parseDate(
                                vfsAppointmentFormik.values
                                  .VFSAppointmentDateTime
                              )
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowAppointmentDateCalendar(true)}
                      style={{
                        cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
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
                    {showAppointmentDateCalendar && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
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
                            vfsAppointmentFormik.setFieldValue(
                              "VFSAppointmentDateTime",
                              toISODate(selectedDate)
                            );
                            setShowAppointmentDateCalendar(false);
                          }}
                          value={
                            parseDate(
                              vfsAppointmentFormik.values.VFSAppointmentDateTime
                            ) || new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {userRole !== "Student" && userRole !== "LeadStudent" && (canCreate || canUpdate) && (
            <div className="d-flex justify-content-end me-3">
              <Button
                variant="primary"
                type="submit"
                className="custom-select-height"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>)}
          </Form>
        </div>
      </div>
    </>
  );
};

export default VFSAppointment;
