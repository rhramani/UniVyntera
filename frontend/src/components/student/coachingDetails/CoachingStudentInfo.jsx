import { Col, Row, Button, Form, Modal } from "react-bootstrap";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import SportsScoreIcon from "@mui/icons-material/TrackChanges";
import BadgeIcon from "@mui/icons-material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import usePermissions from "../../commonComponents/usePermissions";
import "react-phone-input-2/lib/bootstrap.css";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  deleteStudentApplication,
  getOneStudentApplication,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import DataTable from "../../commonComponents/DataTable";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import PhoneInput from "react-phone-input-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import {
  cityDropdown,
  countryDropdown,
  stateDropdown,
} from "../../../redux/actions/Master/Institute.action";
import { BASEURL } from "../../../baseUrl";
import { countryCodeISO } from "../../../utils/countryISOCode";

const CoachingStudentInfo = ({ oneStudentData }) => {
  const dispatch = useDispatch();
  const [showExamModal, setShowExamModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    examDetails: [],
  });
  const [studentData, setStudentData] = useState(oneStudentData || {});
  const [edit, setEdit] = useState({
    examDetails: false,
    examDetailsIndex: 0,
    examDetailsObj: null,
  });
  const [show, setShow] = useState(false);
  const [showDOBCalendar, setShowDOBCalendar] = useState(false);
  const [dobValue, setDOBValue] = useState(null);
  const dobInputRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const { canUpdate, canCreate } = usePermissions("Student Applications");

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  // Helper for dd/mm/yyyy
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

  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const fetchStudentData = async (studentId) => {
    try {
      const res = await dispatch(getOneStudentApplication(studentId));
      const data = res?.data?.data || {};
      setFormData({
        examDetails: data?.coachingDetails?.examDetails || [],
      });
      setStudentData(data);
      formik.setValues({
        name: data?.name || "",
        contact: data?.contact || "",
        gender: data?.gender || "",
        email: data?.email || "",
        DOB: data?.DOB ? formatDate(parseDate(data.DOB)) : "",
        age: data?.DOB ? calculateAge(parseDate(data.DOB)) : "",
        address: data?.address || "",
        city: data?.city || "",
        state: data?.state || "",
        country: data?.country || "",
        coachingDetails: {
          ...data?.coachingDetails,
          targetedScore: data?.coachingDetails?.targetedScore || "",
        },
      });
      setDOBValue(data?.DOB ? parseDate(data.DOB) : null);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await dispatch(countryDropdown());
      const responseData = res?.data?.data || [];
      setCountries(responseData);

      if (studentData?.country) {
        const selectedCountry = responseData.find(
          (c) =>
            c.name === studentData.country || c.isoCode === studentData.country,
        );
        if (selectedCountry) {
          await handleCountryChange(selectedCountry.isoCode);
        }
      }
    } catch (error) {
      console.log("Error fetching countries:", error);
    }
  };

  const handleCountryChange = async (countryIsoCode) => {
    try {
      formik.setFieldValue("country", countryIsoCode);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
      setStateDropDown([]);
      setCityDropDownList([]);

      const selectedCountry = countries.find(
        (c) => c.isoCode === countryIsoCode,
      );
      if (!selectedCountry) return;

      const res = await dispatch(stateDropdown(countryIsoCode));
      const data = res?.data?.data || [];
      setStateDropDown(data);

      if (studentData?.state && countryIsoCode === formik.values.country) {
        const selectedState = data.find(
          (s) =>
            s.name === studentData.state || s.isoCode === studentData.state,
        );
        if (selectedState) {
          formik.setFieldValue("state", selectedState.isoCode);
          await handleStateChange(countryIsoCode, selectedState.isoCode);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleStateChange = async (countryIsoCode, stateIsoCode) => {
    try {
      formik.setFieldValue("state", stateIsoCode);
      formik.setFieldValue("city", "");
      setCityDropDownList([]);

      const res = await dispatch(cityDropdown(countryIsoCode, stateIsoCode));
      const data = res?.data?.data || [];
      setCityDropDownList(data);

      if (studentData?.city && stateIsoCode === formik.values.state) {
        const selectedCity = data.find(
          (c) => (typeof c === "string" ? c : c.name) === studentData.city,
        );
        if (selectedCity) {
          formik.setFieldValue(
            "city",
            typeof selectedCity === "string" ? selectedCity : selectedCity.name,
          );
        } else {
          formik.setFieldValue("city", studentData.city);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (oneStudentData?._id) {
      setStudentData(oneStudentData);
      fetchStudentData(oneStudentData._id);
    }
  }, [oneStudentData]);

  const formik = useFormik({
    initialValues: {
      name: studentData?.name || "",
      contact: studentData?.contact || "",
      gender: studentData?.gender || "",
      email: studentData?.email || "",
      DOB: studentData?.DOB ? formatDate(parseDate(studentData.DOB)) : "",
      age: studentData?.DOB ? calculateAge(parseDate(studentData.DOB)) : "",
      address: studentData?.address || "",
      city: studentData?.city || "",
      state: studentData?.state || "",
      country: studentData?.country || "",
      coachingDetails: {
        targetedScore: studentData?.coachingDetails?.targetedScore || null,
      },
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validationSchema: Yup.object({
      name: Yup.string(),
      contact: Yup.string(),
      gender: Yup.string(),
      email: Yup.string().email("Invalid email address"),
      DOB: Yup.string(),
      age: Yup.number().nullable(),
      address: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      coachingDetails: Yup.object({
        targetedScore: Yup.number(),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        toast.dismiss();
        const selectedCountry = countries.find(
          (c) => c.isoCode === values.country,
        );
        const selectedState = stateDropDown.find(
          (s) => s.isoCode === values.state,
        );

        if (canUpdate) {
          const payload = {
            ...values,
            country: selectedCountry?.name || values.country,
            state: selectedState?.name || values.state,
            city: values.city,
          };

          const res = await dispatch(
            updateStudentApplication(payload, studentData?._id),
          );

          if (res?.status === 200) {
            toast.success("Student updated successfully");
            await fetchStudentData(studentData?._id);
          }
        }

        handleClose();
        resetForm();
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const examFormik = useFormik({
    initialValues: {
      examName: "",
      scores: {
        reading: "",
        writing: "",
        speaking: "",
        listening: "",
        total: "",
      },
      scoreFile: null,
    },
    validationSchema: Yup.object({
      examName: Yup.string().required("Exam name is required"),
      scores: Yup.object({
        reading: Yup.number().nullable(),
        writing: Yup.number().nullable(),
        speaking: Yup.number().nullable(),
        listening: Yup.number().nullable(),
        total: Yup.number().nullable(),
      }),
      scoreFile: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const payload = new FormData();

        if (edit.examDetails) {
          const existingExam = edit.examDetailsObj;
          if (!existingExam || !existingExam._id) {
            toast.error("Exam ID not found. Cannot update.");
            return;
          }
          payload.append("coachingExamId", existingExam._id);
          payload.append("coachingExamUpdate[examName]", values.examName);
          payload.append(
            "coachingExamUpdate[scores][reading]",
            values.scores.reading || "",
          );
          payload.append(
            "coachingExamUpdate[scores][writing]",
            values.scores.writing || "",
          );
          payload.append(
            "coachingExamUpdate[scores][speaking]",
            values.scores.speaking || "",
          );
          payload.append(
            "coachingExamUpdate[scores][listening]",
            values.scores.listening || "",
          );
          payload.append(
            "coachingExamUpdate[scores][total]",
            values.scores.total || "",
          );
          if (values.scoreFile) {
            payload.append("coachingDoc", values.scoreFile);
          }
        } else {
          payload.append("coachingExamDetails[examName]", values.examName);
          payload.append(
            "coachingExamDetails[scores][reading]",
            values.scores.reading || "",
          );
          payload.append(
            "coachingExamDetails[scores][writing]",
            values.scores.writing || "",
          );
          payload.append(
            "coachingExamDetails[scores][speaking]",
            values.scores.speaking || "",
          );
          payload.append(
            "coachingExamDetails[scores][listening]",
            values.scores.listening || "",
          );
          payload.append(
            "coachingExamDetails[scores][total]",
            values.scores.total || "",
          );
          if (values.scoreFile) {
            payload.append("coachingDoc", values.scoreFile);
          }
        }

        const res = await dispatch(
          updateStudentApplication(payload, studentData?._id),
        );
        if (res?.status === 200) {
          toast.success(
            edit.examDetails
              ? "Exam updated successfully!"
              : "Exam added successfully!",
          );
          await fetchStudentData(studentData?._id);
          setShowExamModal(false);
          examFormik.resetForm();
          setEdit({
            examDetails: false,
            examDetailsIndex: 0,
            examDetailsObj: null,
          });
        }
      } catch (error) {
        console.error("Error updating exam details:", error);
        toast.error(
          error?.response?.data?.message || "Failed to update exam details",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteExam = async (coachingExamId) => {
    try {
      const payload = { coachingExamId };
      const res = await dispatch(
        deleteStudentApplication(payload, studentData?._id),
      );
      if (res?.status === 200) {
        toast.success("Exam deleted successfully!");
        await fetchStudentData(studentData?._id);
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error(error?.response?.data?.message || "Failed to delete exam");
    }
  };

  const examDocsColumns = [
    {
      label: "Exam Name",
      render: (item) => (item ? item?.examName || "-" : "-"),
    },
    {
      label: "Reading Score",
      render: (item) => (item ? item?.scores?.reading || "-" : "-"),
    },
    {
      label: "Writing Score",
      render: (item) => (item ? item?.scores?.writing || "-" : "-"),
    },
    {
      label: "Speaking Score",
      render: (item) => (item ? item?.scores?.speaking || "-" : "-"),
    },
    {
      label: "Listening Score",
      render: (item) => (item ? item?.scores?.listening || "-" : "-"),
    },
    {
      label: "Total Score",
      render: (item) => (item ? item?.scores?.total || "-" : "-"),
    },
    {
      label: "Document",
      render: (item) =>
        item?.document ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() =>
              window.open(
                `${BASEURL}/${item.document}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className="student-info-section">
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

      {/* Styled Student Info Card */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4 mt-2">
        <div className="form-main-heading d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center p-3 gap-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <h5 className="mb-0 text-white fw-bold">
              Coaching Student Information
            </h5>
            {studentData?.studentId && (
              <span
                className="badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm"
                style={{ fontSize: "0.8rem" }}
              >
                ID: {studentData.studentId}
              </span>
            )}
          </div>
          {(canUpdate || canCreate) && (
            <Button
              variant="white"
              className="btn-sm rounded-pill px-4 py-2 fw-bold text-primary shadow-sm bg-white border-0 hover-lift"
              onClick={() => setShow(true)}
              style={{ transition: "all 0.2s", whiteSpace: "nowrap" }}
            >
              <EditIcon style={{ fontSize: "16px" }} className="me-1 mb-1" />{" "}
              Edit Profile
            </Button>
          )}
        </div>

        <div className="card-body p-3 p-sm-4 bg-white">
          <Row className="g-4">
            <Col md={6} lg={4}>
              <div className="d-flex align-items-center p-2 p-sm-3 rounded-4 bg-light bg-opacity-50 border border-light h-100 transition-hover">
                <div
                  className="flex-shrink-0 p-3 rounded-4  shadow-sm me-3 text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#4b49ac31",
                    borderColor: "#4b49ac49",
                  }}
                >
                  <BadgeIcon style={{ fontSize: "24px", color: "#4B49AC" }} />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <div
                    className="text-muted small fw-bold text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Full Name
                  </div>
                  <div className="fw-bold text-dark text-truncate fs-6">
                    {studentData?.name || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="d-flex align-items-center p-2 p-sm-3 rounded-4 bg-light bg-opacity-50 border border-light h-100 transition-hover">
                <div
                  className="flex-shrink-0 p-3 rounded-4  shadow-sm me-3 text-warning d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#ff9b2127",
                    borderColor: "#ff9b213a",
                  }}
                >
                  <EmailIcon style={{ fontSize: "24px", color: "#ff9b21" }} />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <div
                    className="text-muted small fw-bold text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Email Address
                  </div>
                  <div
                    className="fw-bold text-dark text-truncate fs-6"
                    title={studentData?.email}
                  >
                    {studentData?.email || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="d-flex align-items-center p-2 p-sm-3 rounded-4 bg-light bg-opacity-50 border border-light h-100 transition-hover">
                <div
                  className="flex-shrink-0 p-3 rounded-4 shadow-sm me-3 text-success d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#5ac7883a",
                    borderColor: "#5ac7883a",
                  }}
                >
                  <PhoneIcon style={{ fontSize: "24px", color: "#5ac788" }} />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <div
                    className="text-muted small fw-bold text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Mobile Number
                  </div>
                  <div className="fw-bold text-dark fs-6">
                    {studentData?.contact || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="d-flex align-items-center p-2 p-sm-3 rounded-4 bg-light bg-opacity-50 border border-light h-100 transition-hover">
                <div
                  className="flex-shrink-0 p-3 rounded-4  shadow-sm me-3 text-info d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#01b7ff31",
                    borderColor: "#01b7ff31",
                  }}
                >
                  <CakeIcon style={{ fontSize: "24px", color: "#01b8ff" }} />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <div
                    className="text-muted small fw-bold text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Date of Birth
                  </div>
                  <div className="fw-bold text-dark fs-6">
                    {formatDate(parseDate(studentData?.DOB)) || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="d-flex align-items-center p-2 p-sm-3 rounded-4 bg-light bg-opacity-50 border border-light h-100 transition-hover">
                <div
                  className="flex-shrink-0 p-3 rounded-4 shadow-sm me-3 text-danger d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#ff47561a",
                    borderColor: "#ff47561a",
                  }}
                >
                  <PublicIcon style={{ fontSize: "24px", color: "#ff4757" }} />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <div
                    className="text-muted small fw-bold text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Country
                  </div>
                  <div className="fw-bold text-dark text-truncate fs-6">
                    {studentData?.country || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="d-flex align-items-center p-2 p-sm-3 rounded-4 bg-light bg-opacity-50 border border-light h-100 transition-hover">
                <div
                  className="flex-shrink-0 p-3 rounded-4  shadow-sm me-3 text-secondary d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#f1388b28",
                    borderColor: "#f1388b3a",
                  }}
                >
                  <LocationCityIcon
                    style={{ fontSize: "24px", color: "#f1388b" }}
                  />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <div
                    className="text-muted small fw-bold text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    City
                  </div>
                  <div className="fw-bold text-dark fs-6">
                    {studentData?.city || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="d-flex align-items-center p-2 p-sm-3 rounded-4 bg-light bg-opacity-50 border border-light h-100 transition-hover">
                <div
                  className="flex-shrink-0 p-3 rounded-4 shadow-sm me-3 text-dark d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#3b48632f",
                    borderColor: "#3b48632d",
                  }}
                >
                  <HomeIcon style={{ fontSize: "24px", color: "#3b4863" }} />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <div
                    className="text-muted small fw-bold text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Permanent Address
                  </div>
                  <div
                    className="fw-bold text-dark fs-6 text-truncate"
                    title={studentData?.address}
                  >
                    {studentData?.address || "N/A"}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} lg={4}>
              <div className="d-flex align-items-center p-2 p-sm-3 rounded-4 bg-light bg-opacity-50 border border-light h-100 transition-hover">
                <div
                  className="flex-shrink-0 p-3 rounded-4  shadow-sm me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#9b27b01e",
                    borderColor: "#9c27b02d",
                  }}
                >
                  <SportsScoreIcon
                    style={{ fontSize: "24px", color: "#9c27b0" }}
                  />
                </div>
                <div className="flex-grow-1 min-width-0">
                  <div
                    className="text-muted small fw-bold text-uppercase mb-1"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Targeted Score
                  </div>
                  <div className="fw-bold text-dark fs-6">
                    {studentData?.coachingDetails?.targetedScore || "N/A"}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="my-4 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Past Exam</h5>
          <Button
            variant="primary"
            className="px-4 py-2"
            style={{ borderRadius: "20px" }}
            onClick={() => {
              examFormik.resetForm();
              setEdit({
                examDetails: false,
                examDetailsIndex: 0,
                examDetailsObj: null,
              });
              setShowExamModal(true);
            }}
          >
            Add New
          </Button>
        </div>

        <Modal
          show={showExamModal}
          onHide={() => {
            setShowExamModal(false);
            examFormik.resetForm();
            setEdit({
              examDetails: false,
              examDetailsIndex: 0,
              examDetailsObj: null,
            });
          }}
          size="lg"
          centered
        >
          <Modal.Header className="form-main-heading">
            <Modal.Title>
              {edit.examDetails ? "Update Past Exam" : "Add Past Exam"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => {
                setShowExamModal(false);
                examFormik.resetForm();
                setEdit({
                  examDetails: false,
                  examDetailsIndex: 0,
                  examDetailsObj: null,
                });
              }}
            />
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={examFormik.handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Exam Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Exam Name"
                    className="rounded-pill"
                    name="examName"
                    value={examFormik.values.examName}
                    onChange={examFormik.handleChange}
                    onBlur={examFormik.handleBlur}
                  />
                  {examFormik.touched.examName &&
                    examFormik.errors.examName && (
                      <div className="text-danger">
                        {examFormik.errors.examName}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Upload Document</Form.Label>
                  <Form.Control
                    type="file"
                    name="scoreFile"
                    onChange={(event) => {
                      examFormik.setFieldValue(
                        "scoreFile",
                        event.currentTarget.files[0],
                      );
                    }}
                    onBlur={examFormik.handleBlur}
                    className="rounded-pill"
                  />
                  {examFormik.touched.scoreFile &&
                    examFormik.errors.scoreFile && (
                      <div className="text-danger">
                        {examFormik.errors.scoreFile}
                      </div>
                    )}
                </Col>
                {["reading", "writing", "speaking", "listening", "total"].map(
                  (scoreType) => (
                    <Col md={4} key={scoreType} className="mb-3">
                      <Form.Label>
                        {scoreType.charAt(0).toUpperCase() + scoreType.slice(1)}{" "}
                        Score
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={`Enter ${scoreType} score`}
                        className="rounded-pill"
                        name={`scores.${scoreType}`}
                        value={examFormik.values.scores[scoreType]}
                        onChange={examFormik.handleChange}
                        onBlur={examFormik.handleBlur}
                      />
                      {examFormik.touched.scores?.[scoreType] &&
                        examFormik.errors.scores?.[scoreType] && (
                          <div className="text-danger">
                            {examFormik.errors.scores[scoreType]}
                          </div>
                        )}
                    </Col>
                  ),
                )}
              </Row>
              <div className="text-end mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-pill px-4"
                  disabled={isLoading}
                >
                  {edit.examDetails ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <DataTable
          columns={examDocsColumns}
          data={formData.examDetails || []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          onEdit={(item, index) => {
            examFormik.setValues({
              examName: item.examName || "",
              scores: {
                reading: item.scores?.reading || "",
                writing: item.scores?.writing || "",
                speaking: item.scores?.speaking || "",
                listening: item.scores?.listening || "",
                total: item.scores?.total || "",
              },
              scoreFile: null,
            });
            setEdit({
              examDetails: true,
              examDetailsIndex: index,
              examDetailsObj: item,
            });
            setShowExamModal(true);
          }}
          onDelete={(item) => {
            handleDeleteExam(item?._id);
          }}
          section="Exam Details"
        />
      </div>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title>Update Coaching Student</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleClose}
          />
        </Modal.Header>
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
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-3">
              <Col md={6} className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  name="name"
                  placeholder="Enter Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  name="email"
                  placeholder="Enter Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  name="address"
                  placeholder="Enter Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Contact</Form.Label>
                <PhoneInput
                  country={countryCodeISO()}
                  value={formik.values.contact || ""}
                  onChange={(phone, data) => {
                    if (!phone || phone === data.dialCode) {
                      formik.setFieldValue("contact", "");
                    } else {
                      const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                      const formattedPhone = `${dialCode} ${phone.replace(
                        data.dialCode,
                        "",
                      )}`.trim();
                      formik.setFieldValue("contact", formattedPhone);
                    }
                  }}
                  inputProps={{
                    name: "phone",
                    required: true,
                    className: "form-control custom-select-height",
                  }}
                  inputStyle={{
                    width: "100%",
                    paddingLeft: "65px",
                    borderRadius: "4px",
                  }}
                  buttonStyle={{
                    marginRight: "10px",
                  }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>DOB</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="DOB"
                    placeholder="dd/mm/yyyy"
                    value={formik.values.DOB}
                    readOnly
                    ref={dobInputRef}
                    onClick={() => {
                      if (formik.values.DOB) {
                        setDOBValue(parseDate(formik.values.DOB));
                      }
                      setShowDOBCalendar((show) => !show);
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#fff",
                    }}
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
                  {showDOBCalendar && (
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
                          const formatted = formatDate(selectedDate);
                          formik.setFieldValue("DOB", formatted);
                          setDOBValue(selectedDate);
                          if (selectedDate) {
                            const age = calculateAge(selectedDate);
                            formik.setFieldValue("age", age);
                          } else {
                            formik.setFieldValue("age", "");
                          }
                          setShowDOBCalendar(false);
                        }}
                        value={dobValue}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Select
                  className="custom-select-height"
                  name="gender"
                  placeholder="Enter Gender"
                  value={
                    formik.values.gender
                      ? {
                          value: formik.values.gender,
                          label:
                            formik.values.gender.charAt(0).toUpperCase() +
                            formik.values.gender.slice(1),
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "gender",
                      selectedOption ? selectedOption.value : "",
                    );
                  }}
                  onBlur={formik.handleBlur}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "12px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  className="custom-select-height"
                  name="age"
                  placeholder="Enter Age"
                  value={formik.values.age}
                  readOnly
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Country</Form.Label>
                <Select
                  className="custom-select-height"
                  options={countries?.map((c) => ({
                    value: c.isoCode,
                    label: c.name,
                  }))}
                  value={
                    formik.values.country
                      ? {
                          value: formik.values.country,
                          label:
                            countries.find(
                              (c) => c.isoCode === formik.values.country,
                            )?.name ||
                            studentData?.country ||
                            "",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      handleCountryChange(selectedOption.value);
                      formik.setFieldValue("country", selectedOption.value);
                      formik.setFieldError("country", "");
                    } else {
                      formik.setFieldValue("country", "");
                      formik.setFieldValue("state", "");
                      formik.setFieldValue("city", "");
                      setStateDropDown([]);
                      setCityDropDownList([]);
                    }
                  }}
                  placeholder="Select Country"
                  isClearable
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "12px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>State</Form.Label>
                <Select
                  className="custom-select-height"
                  options={stateDropDown?.map((state) => ({
                    value: state.isoCode,
                    label: state.name,
                  }))}
                  value={
                    formik.values.state
                      ? {
                          value: formik.values.state,
                          label:
                            stateDropDown.find(
                              (s) => s.isoCode === formik.values.state,
                            )?.name ||
                            studentData?.state ||
                            "",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      formik.setFieldValue("state", selectedOption.value);
                      handleStateChange(
                        formik.values.country,
                        selectedOption.value,
                      );
                      formik.setFieldError("state", "");
                    } else {
                      formik.setFieldValue("state", "");
                      formik.setFieldValue("city", "");
                      setCityDropDownList([]);
                    }
                  }}
                  placeholder="Select State"
                  isClearable
                  isDisabled={!formik.values.country}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "12px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>City</Form.Label>
                <CreatableSelect
                  className="custom-select-height"
                  options={cityDropDownList?.map((city) => {
                    const name = typeof city === "string" ? city : city.name;
                    return { value: name, label: name };
                  })}
                  value={
                    formik.values.city
                      ? {
                          value: formik.values.city,
                          label: formik.values.city,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      formik.setFieldValue("city", selectedOption.value);
                      formik.setFieldError("city", "");
                    } else {
                      formik.setFieldValue("city", "");
                    }
                  }}
                  placeholder="Select or type to add city"
                  isClearable
                  isSearchable
                  isDisabled={!formik.values.state}
                  noOptionsMessage={() => "No cities available"}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "12px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                />
              </Col>
              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.targetedScore"
                  className="mb-3"
                >
                  <Form.Label>Targeted Score</Form.Label>
                  <Form.Control
                    type="number"
                    name="coachingDetails.targetedScore"
                    className="custom-select-height"
                    value={formik.values.coachingDetails?.targetedScore}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Targeted Score"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end mt-3">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
                disabled={isLoading}
              >
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CoachingStudentInfo;
