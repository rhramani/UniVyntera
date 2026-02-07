import { ErrorMessage, Formik } from "formik";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import logo from "../../../assets/images/brand-logos/sidebar_logo1.png";
import * as Yup from "yup";
import { decryptData } from "../../../utils/encryptionUtils";
import { countryDropdown } from "../../../redux/actions/Master/Institute.action";
import { getAllInquiry } from "../../../redux/actions/Lead/Inquiry.action";
import { useDispatch } from "react-redux";
import { addLead } from "../../../redux/actions/Lead.action";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSearchParams } from "react-router-dom";

const PublicLeadForm = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userNameFromUrl = searchParams.get("userName");
  const userTypeFromUrl = searchParams.get("userType");
  const branchIdFromUrl = searchParams.get("branchId");
  const userIdFromUrl = searchParams.get("userId");

  const [showEducationCourseInfo, setShowEducationCourseInfo] = useState(false);
  const [showFamilyWork, setShowFamilyWork] = useState(false);
  const [showVisaInfo, setShowVisaInfo] = useState(false);
  const [showEducationEvaluation, setShowEducationEvaluation] = useState(false);
  const [showEducationDetails, setShowEducationDetails] = useState(false);
  const [showReferFriend, setShowReferFriend] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showDobCalendar, setShowDobCalendar] = useState(false);
  const [dobValue, setDobValue] = useState(null);
  const [showNextFollowupCalendar, setShowNextFollowupCalendar] =
    useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [allInquiry, setAllInquiry] = useState([]);

  const leadDetailsRef = useRef(null);
  const followUpDetailsRef = useRef(null);
  const educationCourseInfoRef = useRef(null);
  const familyWorkRef = useRef(null);
  const visaInfoRef = useRef(null);
  const educationEvaluationRef = useRef(null);
  const educationDetailsRef = useRef(null);
  const referFriendRef = useRef(null);
  const reviewsRef = useRef(null);
  const dobInputRef = useRef(null);
  const nextFollowupInputRef = useRef(null);
  const dobCalendarRef = useRef(null);
  const nextFollowupCalendarRef = useRef(null);

  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));

  const loggedInMemberId = decryptData(localStorage.getItem("userId"));

  const [formData, setFormData] = useState({
    inquiry_for: null,
    intake: "",
    source_of_reference: "",
    dateofbirth: "",
    age: "",
    gender: "",
    name: "",
    email: "",
    phone: "",
    alternate_contact: "",
    address: "",
    country_interested: [],
    course: "",
    level: "",
    budget: "",
    how_much_in_bank: "",
    english_proficiency: "",
    passport: "",
    occupation_father: "",
    occupation_mother: "",
    work_experience: "",
    work_post: "",
    work_year: "",
    visited_countries: "",
    visit_count: "",
    visa_type: "",
    visa_refused: "",
    form_type: "",
    refused_country: "",
    refused_times: "",
    refused_years: [],
    refused_visa_type: "",
    comments: "",
    office_use_only: "",
    remarks: "",
    lead_status: "New",
    lead_form: "",
    lead_assign: "",
    lead_role: "",
    lead_assign_Branch: null,
    refer_friend: {
      name: "",
      phone: "",
      email: "",
      suggested_countries: "",
      courses: "",
      response: "",
    },
    reviews: {
      reception_greetings: "",
      counsellor_explanation: "",
      hospitality: "",
      hygiene_cleanliness: "",
      team_response: "",
    },
    education_evaluation: [],
    education_details: [],
    next_follow_up: new Date().toISOString().split("T")[0],
    from: "",
    to: "",
    nationality: "",
    pincode: "",
    follow_up_type: null,
    lead_followup_remark: "",
    lead_text_remark: "",
    city: "",
    country: "",
  });

  const resetFormData = { ...formData };

  const validationSchema = Yup.object({
    inquiry_for: Yup.string().nullable().required("Inquiry For is required"),
    name: Yup.string().required("Name is required"),
    intake: Yup.string(),
    email: Yup.string().email("Invalid email format"),
    phone: Yup.string().required("Phone number is required"),
    alternate_contact: Yup.string(),
    gender: Yup.string(),
    dateofbirth: Yup.date(),
    age: Yup.number(),
    address: Yup.string(),
    comments: Yup.string(),
    office_use_only: Yup.string(),
    remarks: Yup.string(),
    lead_status: Yup.string().default("New"),
    lead_form: Yup.string(),
    lead_assign: Yup.string().nullable(),
    lead_role: Yup.string().nullable(),
    lead_assign_Branch: Yup.string().nullable(),
    country_interested: Yup.array().of(Yup.string()),
    course: Yup.string(),
    level: Yup.string(),
    budget: Yup.string(),
    how_much_in_bank: Yup.string(),
    english_proficiency: Yup.string(),
    passport: Yup.string(),
    occupation_father: Yup.string(),
    occupation_mother: Yup.string(),
    work_experience: Yup.string(),
    work_post: Yup.string(),
    work_year: Yup.number(),
    visited_countries: Yup.string(),
    visit_count: Yup.number(),
    visa_type: Yup.string(),
    visa_refused: Yup.string(),
    form_type: Yup.string(),
    refused_country: Yup.string(),
    refused_times: Yup.number(),
    refused_years: Yup.array().of(Yup.number()),
    refused_visa_type: Yup.string(),
    next_follow_up: Yup.date(),
    from: Yup.string(),
    to: Yup.string(),
    nationality: Yup.string(),
    pincode: Yup.string(),
    follow_up_type: Yup.string().nullable().notRequired(),
    lead_followup_remark: Yup.string(),
    lead_text_remark: Yup.string(),
    source_of_reference: Yup.string(),
    city: Yup.string().required("City is required"),
    country: Yup.string(),
    refer_friend: Yup.object({
      name: Yup.string(),
      phone: Yup.string(),
      email: Yup.string(),
      suggested_countries: Yup.string(),
      courses: Yup.string(),
      response: Yup.string(),
    }),
    reviews: Yup.object({
      reception_greetings: Yup.string(),
      counsellor_explanation: Yup.string(),
      hospitality: Yup.string(),
      hygiene_cleanliness: Yup.string(),
      team_response: Yup.string(),
    }),
    education_evaluation: Yup.array().of(
      Yup.object({
        test_name: Yup.string(),
        scores: Yup.object({
          listen: Yup.number(),
          read: Yup.number(),
          write: Yup.number(),
          speak: Yup.number(),
          overall: Yup.number(),
          duolingoScore: Yup.number(),
        }),
      }),
    ),
    education_details: Yup.array().of(
      Yup.object({
        degree: Yup.string(),
        stream: Yup.string(),
        moi: Yup.string(),
        year: Yup.number(),
        score: Yup.string(),
        institution: Yup.string(),
        backlogs: Yup.number(),
      }),
    ),
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dobInputRef.current &&
        !dobInputRef.current.contains(event.target) &&
        dobCalendarRef.current &&
        !dobCalendarRef.current.contains(event.target)
      ) {
        setShowDobCalendar(false);
      }
      if (
        nextFollowupInputRef.current &&
        !nextFollowupInputRef.current.contains(event.target) &&
        nextFollowupCalendarRef.current &&
        !nextFollowupCalendarRef.current.contains(event.target)
      ) {
        setShowNextFollowupCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fieldToSectionMap = {
    name: leadDetailsRef,
    city: leadDetailsRef,
    phone: leadDetailsRef,
    alternate_contact: leadDetailsRef,
    gender: leadDetailsRef,
    dateofbirth: leadDetailsRef,
    age: leadDetailsRef,
    comments: leadDetailsRef,
    lead_status: leadDetailsRef,
    lead_form: leadDetailsRef,
    lead_role: leadDetailsRef,
    lead_assign: leadDetailsRef,
    inquiry_for: leadDetailsRef,
    source_of_reference: leadDetailsRef,
    office_use_only: leadDetailsRef,
    next_follow_up: followUpDetailsRef,
    follow_up_type: followUpDetailsRef,
    from: followUpDetailsRef,
    to: followUpDetailsRef,
    nationality: followUpDetailsRef,
    email: followUpDetailsRef,
    address: followUpDetailsRef,
    pincode: followUpDetailsRef,
    lead_followup_remark: followUpDetailsRef,
    country_interested: educationCourseInfoRef,
    course: educationCourseInfoRef,
    level: educationCourseInfoRef,
    budget: educationCourseInfoRef,
    intake: educationCourseInfoRef,
    english_proficiency: educationCourseInfoRef,
    passport: educationCourseInfoRef,
    how_much_in_bank: educationCourseInfoRef,
    occupation_father: familyWorkRef,
    occupation_mother: familyWorkRef,
    work_experience: familyWorkRef,
    work_post: familyWorkRef,
    work_year: familyWorkRef,
    visited_countries: visaInfoRef,
    visit_count: visaInfoRef,
    visa_type: visaInfoRef,
    visa_refused: visaInfoRef,
    refused_country: visaInfoRef,
    refused_times: visaInfoRef,
    refused_years: visaInfoRef,
    refused_visa_type: visaInfoRef,
    reviews: reviewsRef,
    education_evaluation: educationEvaluationRef,
    education_details: educationDetailsRef,
  };

  const scrollToFirstError = (errors) => {
    const errorFields = Object.keys(errors);
    for (let field of errorFields) {
      let fieldKey = field;
      if (field.includes(".")) {
        fieldKey = field.split(".").slice(0, 2).join(".");
      }
      const sectionRef =
        fieldToSectionMap[field] || fieldToSectionMap[fieldKey];
      if (sectionRef?.current) {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        if (sectionRef === educationCourseInfoRef && !showEducationCourseInfo) {
          setShowEducationCourseInfo(true);
        } else if (sectionRef === familyWorkRef && !showFamilyWork) {
          setShowFamilyWork(true);
        } else if (sectionRef === visaInfoRef && !showVisaInfo) {
          setShowVisaInfo(true);
        } else if (
          sectionRef === educationEvaluationRef &&
          !showEducationEvaluation
        ) {
          setShowEducationEvaluation(true);
        } else if (
          sectionRef === educationDetailsRef &&
          !showEducationDetails
        ) {
          setShowEducationDetails(true);
        } else if (sectionRef === referFriendRef && !showReferFriend) {
          setShowReferFriend(true);
        } else if (sectionRef === reviewsRef && !showReviews) {
          setShowReviews(true);
        }
        break;
      }
    }
  };

  const handelSubmitLead = async (values) => {
    const urlParams = new URLSearchParams(window.location.search);
    const isFromQR = urlParams.get("from") === "qr";

    // QR se aaya hai → userName & userType add kar do
    let finalValues = { ...values };

    if (isFromQR) {
      if (userNameFromUrl && userTypeFromUrl && userIdFromUrl) {
        finalValues = {
          ...finalValues,
          userName: userNameFromUrl,
          userType: userTypeFromUrl,
          created_by: userIdFromUrl,
          // lead_assign_Branch:
          //   userRole === "Super Admin"
          //     ? null
          //     : userIdFromUrl || branchIdFromUrl,
        };
        // Use userTypeFromUrl from URL params instead of localStorage values
        // because when QR is scanned, user might not be logged in
        switch (userTypeFromUrl) {
          case "Super Admin":
            finalValues.lead_assign_Branch = null;
            break;

          case "user":
            finalValues.lead_assign = userIdFromUrl;
            break;

          case "Branch":
            finalValues.lead_assign_Branch = userIdFromUrl || branchIdFromUrl;
            break;

          case "Branch User":
            // Ensure branchIdFromUrl is set (can be empty string from URL, but should be valid)
            finalValues.lead_assign_Branch =
              branchIdFromUrl && branchIdFromUrl.trim() !== ""
                ? branchIdFromUrl
                : null;
            finalValues.lead_assign = userIdFromUrl;
            break;

          default:
            finalValues.created_by = userIdFromUrl;
        }
      } else {
        console.error("Login session expired. Please login again.");
        return;
      }
    }

    const {
      education_evaluation,
      education_details,
      refused_years,
      reviews,
      refer_friend,
      ...restValues
    } = finalValues;

    const formattedData = {
      ...restValues,
      visa_refused: values.visa_refused === "yes" ? true : false,
      refused_years: refused_years?.map((year) => Number(year)) || [],
      work_year: Number(values.work_year) || 0,
      education_evaluation: (education_evaluation || []).map((item) => ({
        test_name: item.test_name,
        scores: {
          listen: parseFloat(item.scores.listen),
          read: parseFloat(item.scores.read),
          write: parseFloat(item.scores.write),
          speak: parseFloat(item.scores.speak),
          overall: parseFloat(item.scores.overall),
        },
      })),
      education_details: (education_details || []).map((item) => ({
        degree: item.degree,
        stream: item.stream,
        moi: item.moi,
        year: Number(item.year) || null,
        score: Number(item.score),
        institution: item.institution,
        backlogs: Number(item.backlogs || 0),
      })),
      reviews: {
        ...reviews,
      },
      refer_friend: {
        ...refer_friend,
      },
    };
    setIsLoading(true);
    try {
      const response = await dispatch(addLead(formattedData));
      if (response.status === 201) {
        setFormData(resetFormData);
        toast.success("Lead Submitted successfully!");
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error adding lead", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await dispatch(countryDropdown());
      const responseData = res?.data?.data || [];
      setCountries(responseData);
    } catch (error) {
      console.log("Error fetching countries:", error);
    }
  };

  const fetchInquirys = async () => {
    try {
      const res = await dispatch(getAllInquiry(1, 100000));
      const responseData = res?.data?.data;
      setAllInquiry(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Inquiry:", error);
      setAllInquiry([]);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchInquirys();
  }, []);

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      borderColor: "#ced4da",
      "&:hover": { borderColor: "#0052cc" },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
      fontSize: "0.9rem",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") {
      const d = new Date(date);
      if (!isNaN(d)) date = d;
      else return "";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    let d = new Date(dateStr);
    if (!isNaN(d)) return d;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      d = new Date(`${year}-${month}-${day}`);
      if (!isNaN(d)) return d;
    }
    return null;
  };

  if (isSubmitted) {
    return (
      <div className="thank-you-container">
        <div className="thank-you-logo mb-4">
          <img
            src={logo}
            alt="Company Logo"
            style={{
              width: "150px",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          tweenDuration={5000}
        />
        <Card className="thank-you-card animate__animated animate__fadeIn">
          <Card.Body className="text-center">
            <CheckCircleOutlineIcon
              sx={{
                width: "100%",
                fontSize: 60,
                color: "#28a745",
                marginBottom: "20px",
              }}
            />
            <h4 className="thank-you-title">Thank You!</h4>
            <p className="thank-you-message">
              Your lead has been successfully submitted . We'll get back to you
              soon.
            </p>
            <Button
              className="thank-you-btn"
              onClick={() => {
                setIsSubmitted(false);
              }}
            >
              Submit Another Lead
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="b2b-admin-form-container">
      {/* <div className="logo-container mb-4">
        <img
          src={logo}
          alt="Company Logo"
          style={{
            width: "150px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div> */}
      <Card className="b2b-admin-card">
        <Card.Header className="b2b-card-header">
          <h4 className="form-card-title">Create Lead</h4>
        </Card.Header>
        <Card.Body>
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <Formik
            initialValues={{
              ...formData,
              dateofbirth:
                formData.dateofbirth && parseDate(formData.dateofbirth)
                  ? parseDate(formData.dateofbirth).toISOString().slice(0, 10)
                  : "",
              next_follow_up:
                formData.next_follow_up && parseDate(formData.next_follow_up)
                  ? parseDate(formData.next_follow_up)
                      .toISOString()
                      .slice(0, 10)
                  : "",
            }}
            validationSchema={validationSchema}
            context={{ userRole }}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              //   setShow(false);
              handelSubmitLead(values).finally(() => setSubmitting(false));
            }}
          >
            {({ handleSubmit, setFieldValue, values, errors }) => {
              useEffect(() => {
                if (userRole === "Branch Member") {
                  setFieldValue("lead_assign", loggedInMemberId);
                }
              }, [userRole, loggedInMemberId, setFieldValue]);
              return (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                    if (Object.keys(errors).length > 0) {
                      scrollToFirstError(errors);
                    }
                  }}
                >
                  <div className="mb-5" ref={leadDetailsRef}>
                    <Row className="mb-3">
                      <Col md={3} className="mt-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          as={Form.Control}
                          onChange={(e) =>
                            setFieldValue("name", e.target.value)
                          }
                          value={values.name}
                          className="custom-select-height"
                          placeholder="Enter name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col md={3} className="mt-3">
                        <Form.Label>Country</Form.Label>
                        <Select
                          options={countries?.map((c) => ({
                            value: c.name,
                            label: c.name,
                          }))}
                          value={
                            values.country
                              ? { value: values.country, label: values.country }
                              : ""
                          }
                          onChange={(selectedOption) => {
                            setFieldValue(
                              "country",
                              selectedOption ? selectedOption.value : "",
                            );
                          }}
                          placeholder="Select Country"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          noOptionsMessage={() => "No countries available"}
                          styles={selectStyles}
                        />
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col md={3} className="mt-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          as={Form.Control}
                          onChange={(e) =>
                            setFieldValue("city", e.target.value)
                          }
                          value={values.city}
                          className="custom-select-height"
                          placeholder="Enter city"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-danger"
                        />
                      </Col>

                      <Col md={3} className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          as={Form.Control}
                          onChange={(e) =>
                            setFieldValue("email", e.target.value)
                          }
                          value={values.email}
                          type="email"
                          className="custom-select-height"
                          placeholder="Enter Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col md={3} className="mt-3">
                        <Form.Label>Phone</Form.Label>
                        <PhoneInput
                          country={"in"}
                          value={values.phone}
                          onChange={(phone, data) => {
                            const dialCode = data.dialCode
                              ? `+${data.dialCode}`
                              : "";
                            const formattedPhone = `${dialCode} ${phone.replace(
                              data.dialCode,
                              "",
                            )}`.trim();
                            setFieldValue("phone", formattedPhone);
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
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col md={3} className="mt-3">
                        <Form.Label>Gender</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={genderOptions}
                          value={
                            genderOptions.find(
                              (option) => option.value === values.gender,
                            ) || null
                          }
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "gender",
                              selectedOption ? selectedOption.value : "",
                            )
                          }
                          placeholder="Select Gender"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          noOptionsMessage={() => "No gender options available"}
                          styles={selectStyles}
                        />
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-danger  "
                        />
                      </Col>
                      <Col md={3} className="mt-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            name="dateofbirth"
                            className="custom-select-height"
                            placeholder="dd/mm/yyyy"
                            value={
                              values.dateofbirth
                                ? formatDate(parseDate(values.dateofbirth))
                                : ""
                            }
                            readOnly
                            ref={dobInputRef}
                            onClick={() => {
                              setDobValue(
                                parseDate(values.dateofbirth) || new Date(),
                              );
                              setShowDobCalendar((show) => !show);
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
                          {showDobCalendar && (
                            <div
                              ref={dobCalendarRef}
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: "0",
                                zIndex: 9999,
                                background: "#fff",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                borderRadius: "8px",
                                marginTop: "4px",
                                width: dobInputRef.current
                                  ? dobInputRef.current.offsetWidth
                                  : "auto",
                                minWidth: 180,
                              }}
                            >
                              <Calendar
                                className="form-control m-0 p-0 border-0"
                                onChange={(selectedDate) => {
                                  setDobValue(selectedDate);
                                  const yyyy = selectedDate.getFullYear();
                                  const mm = String(
                                    selectedDate.getMonth() + 1,
                                  ).padStart(2, "0");
                                  const dd = String(
                                    selectedDate.getDate(),
                                  ).padStart(2, "0");
                                  const dobString = `${yyyy}-${mm}-${dd}`;
                                  setFieldValue("dateofbirth", dobString);

                                  // ✅ Calculate Age
                                  const today = new Date();
                                  let age = today.getFullYear() - yyyy;
                                  const m =
                                    today.getMonth() - selectedDate.getMonth();
                                  if (
                                    m < 0 ||
                                    (m === 0 &&
                                      today.getDate() < selectedDate.getDate())
                                  ) {
                                    age--;
                                  }
                                  setFieldValue("age", age);

                                  setShowDobCalendar(false);
                                }}
                                value={dobValue || new Date()}
                                locale="en-GB"
                              />
                            </div>
                          )}
                        </div>
                        <ErrorMessage
                          name="dateofbirth"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col md={3} className="mt-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          as={Form.Control}
                          onChange={(e) => setFieldValue("age", e.target.value)}
                          value={values.age}
                          className="custom-select-height"
                          placeholder="Enter age"
                          readOnly
                        />
                        <ErrorMessage
                          name="age"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col md={3} className="mt-3">
                        <Form.Label>Inquiry For *</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={allInquiry?.map((type) => ({
                            value: type._id,
                            label: type.name,
                          }))}
                          value={
                            values.inquiry_for
                              ? {
                                  value: values.inquiry_for,
                                  label:
                                    allInquiry?.find(
                                      (type) => type._id === values.inquiry_for,
                                    )?.name || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            setFieldValue(
                              "inquiry_for",
                              selectedOption ? selectedOption.value : "",
                            );
                          }}
                          placeholder="Select Inquiry Type"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          noOptionsMessage={() => "No inquiry types available"}
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
                        <ErrorMessage
                          name="inquiry_for"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                      <Col md={3} className="mt-3">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                          className="rounded-4"
                          as="textarea"
                          name="remarks"
                          onChange={(e) =>
                            setFieldValue("remarks", e.target.value)
                          }
                          value={values.remarks}
                          rows={4}
                          placeholder="Enter remarks"
                        />
                        <ErrorMessage
                          name="remarks"
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="text-end mt-4">
                    <Button
                      variant="primary"
                      className="submit-btn"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PublicLeadForm;
