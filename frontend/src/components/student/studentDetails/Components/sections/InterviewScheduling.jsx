import { useState } from "react";
import {
  getOneStudentApplication,
  updateStudentApplication,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Select from "react-select";
import { Form, InputGroup, Row, Col, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const interviewValidationSchema = Yup.object({
  interviewType: Yup.string().required("Interview type is required"),
});

const InterviewScheduling = ({
  id,
  editState,
  formData,
  isRestrictedRole,
  userRole,
  setLocalCourses,
  setFormData,
  setIsLoading,
  handleUpdateApplicationStatus,
  localCourses,
  canCreate,
  dispatch,
  interestedCourseFormik,
}) => {
  const [interviewSchedulingStatus, setInterviewSchedulingStatus] =
    useState("");
  const [interviewType, setInterviewType] = useState("single");
  const interviewSchedulingStatusOptions = [
    { value: "Passed", label: "Passed" },
    { value: "Rejected", label: "Rejected" },
  ];

  const modeOptions = [
    { value: "Zoom", label: "Zoom" },
    { value: "Google Meet", label: "Google Meet" },
  ];

  const fetchStudentData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      if (res?.status === 200) {
        const studentData = res.data.data;
        setFormData(studentData);
        const courseData =
          studentData.interestedCourseDetails?.[
            editState.interestedCourseIndex
          ] || {};
        setLocalCourses(
          editState.interestedCourseDetails && courseData
            ? [
                {
                  ...courseData,
                  institute: {
                    _id: courseData.institute?._id || "",
                    instituteName:
                      courseData.institute?.instituteName ||
                      "Unknown Institute",
                  },
                  course: {
                    _id: courseData.course?._id || "",
                    programName:
                      courseData.course?.programName || "Unknown Course",
                  },
                },
              ]
            : []
        );

        if (courseData.interviewScheduling) {
          const fetchedInterviewType =
            courseData.interviewScheduling.type || "single";
          setInterviewType(fetchedInterviewType);
          if (fetchedInterviewType === "single") {
            interviewFormik.setValues({
              interviewType: "single",
              interviewDetails: {
                dateTime:
                  courseData.interviewScheduling.singleInterview?.dateTime ||
                  "",
                mode:
                  courseData.interviewScheduling.singleInterview?.mode || "",
                meetingLink:
                  courseData.interviewScheduling.singleInterview?.meetingLink ||
                  "",
                remarks:
                  courseData.interviewScheduling.singleInterview?.remarks || "",
                rounds: [
                  { dateTime: "", mode: "", meetingLink: "", remarks: "" },
                  { dateTime: "", mode: "", meetingLink: "", remarks: "" },
                ],
              },
            });
          } else {
            interviewFormik.setValues({
              interviewType: "multi",
              interviewDetails: {
                dateTime: "",
                mode: "",
                meetingLink: "",
                remarks: "",
                rounds: courseData.interviewScheduling.multiRoundInterview?.map(
                  (round) => ({
                    dateTime: round.dateTime || "",
                    mode: round.mode || "",
                    meetingLink: round.meetingLink || "",
                    remarks: round.remarks || "",
                  })
                ) || [
                  { dateTime: "", mode: "", meetingLink: "", remarks: "" },
                  { dateTime: "", mode: "", meetingLink: "", remarks: "" },
                ],
              },
            });
          }
        } else {
          setInterviewType("single");
          interviewFormik.setValues({
            interviewType: "single",
            interviewDetails: {
              dateTime: "",
              mode: "",
              meetingLink: "",
              remarks: "",
              rounds: [
                { dateTime: "", mode: "", meetingLink: "", remarks: "" },
                { dateTime: "", mode: "", meetingLink: "", remarks: "" },
              ],
            },
          });
        }
      } else {
        toast.error(res?.data?.message || "Error fetching student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error(
        error?.response?.data?.message || "Error fetching student data"
      );
    }
  };

  const interviewFormik = useFormik({
    initialValues: {
      interviewType: "single",
      interviewDetails: {
        dateTime: "",
        mode: "",
        meetingLink: "",
        remarks: "",
        rounds: [],
      },
    },
    validationSchema: interviewValidationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleInterviewSubmit(values);
    },
  });

  const handleInterviewSubmit = async (values) => {
    const updatedIndex = editState.interestedCourseIndex;
    const courseId = formData.interestedCourseDetails[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID. Cannot schedule interview.");
      return;
    }

    setIsLoading(true);
    try {
      let payload;
      if (values.interviewType === "single") {
        payload = {
          interestedCourseId: courseId,
          interestedCourseUpdate: {
            interviewScheduling: {
              type: "single",
              singleInterview: {
                dateTime: values.interviewDetails.dateTime,
                mode: values.interviewDetails.mode,
                meetingLink: values.interviewDetails.meetingLink,
                remarks: values.interviewDetails.remarks,
              },
              multiRoundInterview: [],
            },
          },
        };
      } else {
        payload = {
          interestedCourseId: courseId,
          interestedCourseUpdate: {
            interviewScheduling: {
              type: "multi",
              multiRoundInterview: values.interviewDetails.rounds.map(
                (round, index) => ({
                  round:
                    index === 0
                      ? "Technical Interview"
                      : "HR/General Interview",
                  dateTime: round.dateTime,
                  mode: round.mode,
                  meetingLink: round.meetingLink,
                  remarks: round.remarks,
                })
              ),
              singleInterview: null,
            },
          },
        };
      }

      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Interview scheduled successfully");

        const updatedCourse = {
          ...localCourses[0],
          interviewScheduling:
            payload.interestedCourseUpdate.interviewScheduling,
        };

        setLocalCourses([updatedCourse]);
        setFormData((prev) => ({
          ...prev,
          interestedCourseDetails: prev.interestedCourseDetails.map(
            (item, idx) => (idx === updatedIndex ? updatedCourse : item)
          ),
        }));

        interviewFormik.resetForm({
          values: {
            interviewType: "single",
            interviewDetails: {
              dateTime: "",
              mode: "",
              meetingLink: "",
              remarks: "",
              rounds: [],
            },
          },
        });
        setInterviewType("single");
        await fetchStudentData();
      } else {
        toast.error(res?.data?.message || "Error scheduling interview");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error(
        error?.response?.data?.message || "Error scheduling interview"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  useEffect(() => {
    if (localCourses[0]) {
      const currentInterviewStatus = localCourses[0]?.interviewResult || "";
      // Interview Result
      const interviewOption =
        interviewSchedulingStatusOptions?.find(
          (opt) => opt.value === currentInterviewStatus
        ) || null;
      setInterviewSchedulingStatus(interviewOption);
      interestedCourseFormik.setFieldValue(
        "interviewResult",
        currentInterviewStatus
      );
    }
  }, [localCourses]);
  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <div className="d-flex justify-content-between">
        <h5>Interview Scheduling</h5>
        <div className="d-flex justify-content-end gap-3">
          {userRole !== "Student" && userRole !== "LeadStudent" && (
            <Select
              options={interviewSchedulingStatusOptions}
              value={interviewSchedulingStatus}
              onChange={(selectedOption) => {
                const option =
                  selectedOption || interviewSchedulingStatusOptions[0];
                setInterviewSchedulingStatus(option);
                interestedCourseFormik.setFieldValue(
                  "interviewResult",
                  option.value
                );
                handleUpdateApplicationStatus("interviewResult", option.value);
              }}
              placeholder="Select Status"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "30px",
                  color: "black",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "black",
                  fontSize: "13px",
                }),
              }}
              isDisabled={isRestrictedRole}
            />
          )}
        </div>
      </div>
      <div className="bg-white mt-3 p-3 rounded">
        <Form onSubmit={interviewFormik.handleSubmit}>
          <div className="mb-3">
            <Form.Check
              inline
              label="Single Round"
              name="interviewType"
              className="custom-radio-border"
              type="radio"
              value="single"
              id="single"
              checked={interviewFormik.values.interviewType === "single"}
              onChange={(e) => {
                setInterviewType(e.target.value);
                interviewFormik.setFieldValue("interviewType", e.target.value);
                interviewFormik.setFieldValue("interviewDetails.rounds", []);
              }}
              disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
            />
            <Form.Check
              inline
              label="Multi Round"
              name="interviewType"
              className="custom-radio-border"
              type="radio"
              value="multi"
              id="multi"
              checked={interviewFormik.values.interviewType === "multi"}
              onChange={(e) => {
                setInterviewType(e.target.value);
                interviewFormik.setFieldValue("interviewType", e.target.value);
                interviewFormik.setFieldValue("interviewDetails.dateTime", "");
                interviewFormik.setFieldValue("interviewDetails.mode", "");
                interviewFormik.setFieldValue(
                  "interviewDetails.meetingLink",
                  ""
                );
                interviewFormik.setFieldValue("interviewDetails.remarks", "");
              }}
              disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
            />
          </div>

          {interviewType === "single" && (
            <div className="p-3 rounded">
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Date & Time</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1" className="text-muted">
                      <i className="ri-calendar-line"></i>
                    </InputGroup.Text>
                    <div className="form-control">
                      <DatePicker
                        className="border-0"
                        selected={
                          interviewFormik.values.interviewDetails.dateTime
                            ? new Date(
                                interviewFormik.values.interviewDetails.dateTime
                              )
                            : null
                        }
                        onChange={(date) => {
                          const dateString = date ? date.toISOString() : "";
                          interviewFormik.setFieldValue(
                            "interviewDetails.dateTime",
                            dateString
                          );
                        }}
                        timeInputLabel="Time:"
                        dateFormat="dd/MM/yyyy h:mm aa"
                        showTimeInput
                        placeholderText="Select Date & Time"
                        onBlur={() =>
                          interviewFormik.setFieldTouched(
                            "interviewDetails.dateTime",
                            true
                          )
                        }
                        disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                      />
                    </div>
                  </InputGroup>
                  {interviewFormik.errors.interviewDetails?.dateTime &&
                    interviewFormik.touched.interviewDetails?.dateTime && (
                      <div
                        className="text-danger"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {interviewFormik.errors.interviewDetails.dateTime}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Mode</Form.Label>
                  <Select
                    name="interviewDetails.mode"
                    options={modeOptions}
                    value={modeOptions.find(
                      (option) =>
                        option.value ===
                        interviewFormik.values.interviewDetails.mode
                    )}
                    onChange={(selectedOption) =>
                      interviewFormik.setFieldValue(
                        "interviewDetails.mode",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    onBlur={() =>
                      interviewFormik.handleBlur("interviewDetails.mode")
                    }
                    placeholder="Select Mode"
                    className="custom-select-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "30px",
                        color: "black",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                    isDisabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {interviewFormik.errors.interviewDetails?.mode &&
                    interviewFormik.touched.interviewDetails?.mode && (
                      <div
                        className="text-danger"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {interviewFormik.errors.interviewDetails.mode}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Meeting Link</Form.Label>
                  <Form.Control
                    type="text"
                    name="interviewDetails.meetingLink"
                    value={interviewFormik.values.interviewDetails.meetingLink}
                    onChange={interviewFormik.handleChange}
                    onBlur={interviewFormik.handleBlur}
                    placeholder="Enter meeting link"
                    className="custom-select-height"
                    disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {interviewFormik.errors.interviewDetails?.meetingLink &&
                    interviewFormik.touched.interviewDetails?.meetingLink && (
                      <div
                        className="text-danger"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {interviewFormik.errors.interviewDetails.meetingLink}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    name="interviewDetails.remarks"
                    value={interviewFormik.values.interviewDetails.remarks}
                    onChange={interviewFormik.handleChange}
                    onBlur={interviewFormik.handleBlur}
                    placeholder="Enter remarks"
                    className="custom-select-height"
                    disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {interviewFormik.errors.interviewDetails?.remarks &&
                    interviewFormik.touched.interviewDetails?.remarks && (
                      <div
                        className="text-danger"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {interviewFormik.errors.interviewDetails.remarks}
                      </div>
                    )}
                </Col>
              </Row>
            </div>
          )}

          {interviewType === "multi" && (
            <>
              <div className="mb-4 p-3 border rounded">
                <h5>Technical Interview</h5>
                <Row className="mt-3">
                  <Col md={6} className="mb-3">
                    <Form.Label>Date & Time</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1" className="text-muted">
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>
                      <div className="form-control">
                        <DatePicker
                          className="border-0"
                          selected={
                            interviewFormik.values.interviewDetails.rounds[0]
                              ?.dateTime
                              ? new Date(
                                  interviewFormik.values.interviewDetails.rounds[0].dateTime
                                )
                              : null
                          }
                          onChange={(date) => {
                            const dateString = date ? date.toISOString() : "";
                            interviewFormik.setFieldValue(
                              "interviewDetails.rounds[0].dateTime",
                              dateString
                            );
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy h:mm aa"
                          showTimeInput
                          placeholderText="Select Date & Time"
                          onBlur={() =>
                            interviewFormik.setFieldTouched(
                              "interviewDetails.rounds[0].dateTime",
                              true
                            )
                          }
                          disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                        />
                      </div>
                    </InputGroup>
                    {interviewFormik.errors.interviewDetails?.rounds?.[0]
                      ?.dateTime &&
                      interviewFormik.touched.interviewDetails?.rounds?.[0]
                        ?.dateTime && (
                        <div
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {
                            interviewFormik.errors.interviewDetails.rounds[0]
                              .dateTime
                          }
                        </div>
                      )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Mode</Form.Label>
                    <Select
                      name="interviewDetails.rounds[0].mode"
                      options={modeOptions}
                      value={modeOptions.find(
                        (option) =>
                          option.value ===
                          interviewFormik.values.interviewDetails.rounds[0]
                            ?.mode
                      )}
                      onChange={(selectedOption) =>
                        interviewFormik.setFieldValue(
                          "interviewDetails.rounds[0].mode",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      onBlur={() =>
                        interviewFormik.handleBlur(
                          "interviewDetails.rounds[0].mode"
                        )
                      }
                      placeholder="Select Mode"
                      className="custom-select-height"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "30px",
                          color: "black",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "black",
                          fontSize: "13px",
                        }),
                      }}
                      isDisabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {interviewFormik.errors.interviewDetails?.rounds?.[0]
                      ?.mode &&
                      interviewFormik.touched.interviewDetails?.rounds?.[0]
                        ?.mode && (
                        <div
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {
                            interviewFormik.errors.interviewDetails.rounds[0]
                              .mode
                          }
                        </div>
                      )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Meeting Link</Form.Label>
                    <Form.Control
                      type="text"
                      name="interviewDetails.rounds[0].meetingLink"
                      value={
                        interviewFormik.values.interviewDetails.rounds[0]
                          ?.meetingLink || ""
                      }
                      onChange={interviewFormik.handleChange}
                      onBlur={interviewFormik.handleBlur}
                      placeholder="Enter meeting link"
                      className="custom-select-height"
                      disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {interviewFormik.errors.interviewDetails?.rounds?.[0]
                      ?.meetingLink &&
                      interviewFormik.touched.interviewDetails?.rounds?.[0]
                        ?.meetingLink && (
                        <div
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {
                            interviewFormik.errors.interviewDetails.rounds[0]
                              .meetingLink
                          }
                        </div>
                      )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      type="text"
                      name="interviewDetails.rounds[0].remarks"
                      value={
                        interviewFormik.values.interviewDetails.rounds[0]
                          ?.remarks || ""
                      }
                      onChange={interviewFormik.handleChange}
                      onBlur={interviewFormik.handleBlur}
                      placeholder="Enter remarks"
                      className="custom-select-height"
                      disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {interviewFormik.errors.interviewDetails?.rounds?.[0]
                      ?.remarks &&
                      interviewFormik.touched.interviewDetails?.rounds?.[0]
                        ?.remarks && (
                        <div
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {
                            interviewFormik.errors.interviewDetails.rounds[0]
                              .remarks
                          }
                        </div>
                      )}
                  </Col>
                </Row>
              </div>

              <div className="mb-4 p-3 border rounded">
                <h5>HR/General Interview</h5>
                <Row className="mt-3">
                  <Col md={6} className="mb-3">
                    <Form.Label>Date & Time</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1" className="text-muted">
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>
                      <div className="form-control">
                        <DatePicker
                          className="border-0"
                          selected={
                            interviewFormik.values.interviewDetails.rounds[1]
                              ?.dateTime
                              ? new Date(
                                  interviewFormik.values.interviewDetails.rounds[1].dateTime
                                )
                              : null
                          }
                          onChange={(date) => {
                            const dateString = date ? date.toISOString() : "";
                            interviewFormik.setFieldValue(
                              "interviewDetails.rounds[1].dateTime",
                              dateString
                            );
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd/MM/yyyy h:mm aa"
                          showTimeInput
                          placeholderText="Select Date & Time"
                          onBlur={() =>
                            interviewFormik.setFieldTouched(
                              "interviewDetails.rounds[1].dateTime",
                              true
                            )
                          }
                          disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                        />
                      </div>
                    </InputGroup>
                    {interviewFormik.errors.interviewDetails?.rounds?.[1]
                      ?.dateTime &&
                      interviewFormik.touched.interviewDetails?.rounds?.[1]
                        ?.dateTime && (
                        <div
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {
                            interviewFormik.errors.interviewDetails.rounds[1]
                              .dateTime
                          }
                        </div>
                      )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Mode</Form.Label>
                    <Select
                      name="interviewDetails.rounds[1].mode"
                      options={modeOptions}
                      value={modeOptions.find(
                        (option) =>
                          option.value ===
                          interviewFormik.values.interviewDetails.rounds[1]
                            ?.mode
                      )}
                      onChange={(selectedOption) =>
                        interviewFormik.setFieldValue(
                          "interviewDetails.rounds[1].mode",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      onBlur={() =>
                        interviewFormik.handleBlur(
                          "interviewDetails.rounds[1].mode"
                        )
                      }
                      placeholder="Select Mode"
                      className="custom-select-height"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "30px",
                          color: "black",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "black",
                          fontSize: "13px",
                        }),
                      }}
                      isDisabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {interviewFormik.errors.interviewDetails?.rounds?.[1]
                      ?.mode &&
                      interviewFormik.touched.interviewDetails?.rounds?.[1]
                        ?.mode && (
                        <div
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {
                            interviewFormik.errors.interviewDetails.rounds[1]
                              .mode
                          }
                        </div>
                      )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Meeting Link</Form.Label>
                    <Form.Control
                      type="text"
                      name="interviewDetails.rounds[1].meetingLink"
                      value={
                        interviewFormik.values.interviewDetails.rounds[1]
                          ?.meetingLink || ""
                      }
                      onChange={interviewFormik.handleChange}
                      onBlur={interviewFormik.handleBlur}
                      placeholder="Enter meeting link"
                      className="custom-select-height"
                      disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {interviewFormik.errors.interviewDetails?.rounds?.[1]
                      ?.meetingLink &&
                      interviewFormik.touched.interviewDetails?.rounds?.[1]
                        ?.meetingLink && (
                        <div
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {
                            interviewFormik.errors.interviewDetails.rounds[1]
                              .meetingLink
                          }
                        </div>
                      )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      type="text"
                      name="interviewDetails.rounds[1].remarks"
                      value={
                        interviewFormik.values.interviewDetails.rounds[1]
                          ?.remarks || ""
                      }
                      onChange={interviewFormik.handleChange}
                      onBlur={interviewFormik.handleBlur}
                      placeholder="Enter remarks"
                      className="custom-select-height"
                      disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {interviewFormik.errors.interviewDetails?.rounds?.[1]
                      ?.remarks &&
                      interviewFormik.touched.interviewDetails?.rounds?.[1]
                        ?.remarks && (
                        <div
                          className="text-danger"
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                          }}
                        >
                          {
                            interviewFormik.errors.interviewDetails.rounds[1]
                              .remarks
                          }
                        </div>
                      )}
                  </Col>
                </Row>
              </div>
            </>
          )}
          {userRole !== "Student" && userRole !== "LeadStudent" && (canCreate || canUpdate) && (
            <div className="d-flex justify-content-end me-3">
              <Button
                variant="primary"
                type="submit"
                className="custom-select-height"
                disabled={isRestrictedRole}
              >
                Submit
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default InterviewScheduling;
