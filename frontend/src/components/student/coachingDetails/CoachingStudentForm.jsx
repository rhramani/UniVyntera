import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { AiOutlineClose } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import { useEffect, useRef, useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { getAllStudentRegisterFor } from "../../../redux/actions/Master/StudentRegisterFor.action";
import { getAllCoachingRequirement } from "../../../redux/actions/Master/CoachingRequirement.action";
import { getAllSubPlan } from "../../../redux/actions/Master/SubPlan.action";
import { useDispatch } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getAllBankingDetails } from "../../../redux/actions/Master/Banking.action";
import { countryCodeISO } from "../../../utils/countryISOCode";

const CoachingStudentForm = ({
  show,
  handleClose,
  formik,
  isLoading,
  countries,
  stateDropDown,
  cityDropDownList,
  coachingFaculties,
  batchTimes,
  userRole,
  mainPlans,
  selectStyles,
  formatDate,
  parseDate,
  toISODate,
  handleCountryChange,
  handleStateChange,
  fetchCoachingFaculties,
  fetchBatchTimes,
  branchList,
  selectedBranch,
  setSelectedBranch,
  handleBranchSelection,
  endDateInputRef,
  startDateInputRef,
}) => {
  const dispatch = useDispatch();
  const dobInputRef = useRef(null);
  const [showDOBCalendar, setShowDOBCalendar] = useState(false);
  const coachingStartDateInputRef = useRef(null);
  const coachingEndDateInputRef = useRef(null);
  const [showCoachingStartDateCalendar, setShowCoachingStartDateCalendar] =
    useState(false);
  const [showCoachingEndDateCalendar, setShowCoachingEndDateCalendar] =
    useState(false);
  const coachingStartDateCalenderRef = useRef(null);
  const coachingEndDateCalenderRef = useRef(null);
  const examDateInputRef = useRef(null);
  const examDateCalenderRef = useRef(null);
  const [showExamDateCalendar, setShowExamDateCalendar] = useState(false);

  const [allStudentRegisterFor, setAllStudentRegisterFor] = useState([]);

  const [allCoachingRequirements, setAllCoachingRequirements] = useState([]);
  const [coachingSubPlans, setCoachingSubPlans] = useState([]);

  const [dobValue, setDOBValue] = useState(null);
  const [bankingDetails, setBankingDetails] = useState([]);

  const branchOptions = [
    { value: "HeadOffice", label: "Head Office" },
    ...branchList.map((branch) => ({
      value: branch._id,
      label: branch.branchName || branch.name,
    })),
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCoachingStartDateCalendar &&
        coachingStartDateCalenderRef.current &&
        !coachingStartDateCalenderRef.current.contains(event.target) &&
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target)
      ) {
        setShowCoachingStartDateCalendar(false);
      }
      if (
        showCoachingEndDateCalendar &&
        coachingEndDateCalenderRef.current &&
        !coachingEndDateCalenderRef.current.contains(event.target) &&
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target)
      ) {
        setShowCoachingEndDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCoachingStartDateCalendar, showCoachingEndDateCalendar]);

  const fetchStudentRegisterFor = async () => {
    try {
      const res = await dispatch(getAllStudentRegisterFor(1, 1000, ""));
      if (res?.status === 200) {
        setAllStudentRegisterFor(res?.data?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching lead sources:", error);
    }
  };
  const fetchCoachingRequirements = async () => {
    try {
      const res = await dispatch(getAllCoachingRequirement(1, 1000, ""));
      const responseData = res?.data?.data;
      setAllCoachingRequirements(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching coaching requirements:", error);
    }
  };

  const fetchBankingDetails = async () => {
    try {
      const res = await dispatch(getAllBankingDetails(1, 1000, ""));
      const responseData = res?.data?.data?.data || [];
      setBankingDetails(responseData);
    } catch (error) {
      console.error("Error fetching banking details:", error);
      setBankingDetails([]);
    }
  };

  useEffect(() => {
    fetchStudentRegisterFor();
    fetchBankingDetails();
    fetchCoachingRequirements();
  }, []);

  const coachingPlan = mainPlans?.find(
    (plan) => plan.name.toLowerCase() === "coaching"
  );

  const fetchSubPlans = async (
    page = 1,
    limit = 1000,
    searchTerm = "",
    mainPlanId = coachingPlan._id
  ) => {
    if (!mainPlanId) return;
    try {
      const res = await dispatch(getAllSubPlan(1, 1000, "", mainPlanId));
      const responseData = res?.data?.data || {};
      setCoachingSubPlans(responseData?.data);
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      return [];
    }
  };

  useEffect(() => {
    if (coachingPlan?._id) {
      fetchSubPlans(1, 1000, "", coachingPlan._id);
    }
  }, [coachingPlan]);

  const handlePaidAmountChange = (index, field, value, section) => {
    const updatedPaidAmount = [...formik.values[section].paidAmount];
    updatedPaidAmount[index] = {
      ...updatedPaidAmount[index],
      [field]: value,
    };
    formik.setFieldValue(`${section}.paidAmount`, updatedPaidAmount);
  };

  const studentRegisterForOptions = allStudentRegisterFor?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const coachingRequirementsOptions = allCoachingRequirements?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const hasClientLanguage = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const batchStatusOptions = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  const coachingFacultiesOptions = coachingFaculties?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const batchTimesOptions = batchTimes?.map((item) => ({
    value: item,
    label: item,
  }));

  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  const addNewExam = () => {
    const newExam = {
      examName: "",
      scores: {
        reading: "",
        writing: "",
        speaking: "",
        listening: "",
        total: "",
      },
    };
    formik.setFieldValue("coachingDetails.examDetails", [
      ...formik.values.coachingDetails.examDetails,
      newExam,
    ]);
  };
  useEffect(() => {
    const startDate = formik.values.coachingDetails?.startDate;
    const registerFor = formik.values.coachingDetails?.registerFor;

    if (startDate && registerFor) {
      const selectedItem = allStudentRegisterFor.find(
        (item) => item._id === registerFor
      );
      const label = selectedItem?.name?.toLowerCase() || "";

      const start = new Date(startDate);
      let end = new Date(start);
      let duration = 1;

      const numberMatch = label.match(/\d+/);
      if (numberMatch) duration = parseInt(numberMatch[0]);

      if (label.includes("year")) {
        end.setFullYear(start.getFullYear() + duration);
      } else if (label.includes("month")) {
        end.setMonth(start.getMonth() + duration);
      } else {
        end.setMonth(start.getMonth() + 1);
      }

      const newEndDate = end.toISOString().split("T")[0];

      if (formik.values.coachingDetails.endDate !== newEndDate) {
        formik.setFieldValue("coachingDetails.endDate", newEndDate);
      }
    }
  }, [
    formik.values.coachingDetails.startDate,
    formik.values.coachingDetails.registerFor,
    allStudentRegisterFor,
  ]);

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {formik?.values?.id
              ? "Update Coaching Student"
              : "Add Coaching Student"}
          </Modal.Title>
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
                {formik?.touched?.name && formik.errors.name && (
                  <div className="text-danger">{formik.errors.name}</div>
                )}
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
                {formik?.touched?.email && formik.errors.email && (
                  <div className="text-danger">{formik.errors.email}</div>
                )}
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
                {formik?.touched?.address && formik.errors.address && (
                  <div className="text-danger">{formik.errors.address}</div>
                )}
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
                        ""
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
                {formik?.touched?.contact && formik.errors.contact && (
                  <div className="text-danger">{formik.errors.contact}</div>
                )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Alternate Contact</Form.Label>
                <PhoneInput
                  country={countryCodeISO()}
                  value={formik.values.alternateContact || ""}
                  onChange={(phone, data) => {
                    const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                    const formattedPhone = `${dialCode} ${phone.replace(
                      data.dialCode,
                      ""
                    )}`.trim();
                    formik.setFieldValue("alternateContact", formattedPhone);
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
                {formik?.touched?.alternateContact &&
                  formik.errors.alternateContact && (
                    <div className="text-danger">
                      {formik.errors.alternateContact}
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>DOB</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="DOB"
                    placeholder="dd/mm/yyyy"
                    value={
                      formik.values.DOB
                        ? formatDate(parseDate(formik.values.DOB)) || ""
                        : ""
                    }
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
                          setDOBValue(selectedDate);
                          const formatted = formatDate(selectedDate);
                          formik.setFieldValue("DOB", formatted);
                          // Calculate age
                          if (selectedDate) {
                            const today = new Date();
                            let age =
                              today.getFullYear() - selectedDate.getFullYear();
                            const m =
                              today.getMonth() - selectedDate.getMonth();
                            if (
                              m < 0 ||
                              (m === 0 &&
                                today.getDate() < selectedDate.getDate())
                            ) {
                              age--;
                            }
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
                {formik?.touched?.DOB && formik.errors.DOB && (
                  <div className="text-danger">{formik.errors.DOB}</div>
                )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Select
                  className="custom-select-height"
                  name="gender"
                  placeholder="Enter Gender"
                  value={
                    [
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ].find((option) => option.value === formik.values.gender) ||
                    null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "gender",
                      selectedOption ? selectedOption.value : ""
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
                {formik?.touched?.gender && formik.errors.gender && (
                  <div className="text-danger">{formik.errors.gender}</div>
                )}
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
                {formik?.touched?.age && formik.errors.age && (
                  <div className="text-danger">{formik.errors.age}</div>
                )}
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
                      ? countries
                          ?.map((c) => ({
                            value: c.isoCode,
                            label: c.name,
                          }))
                          .find((o) => o.value === formik.values.country)
                      : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      handleCountryChange(selectedOption.value);
                      formik.setFieldValue("country", selectedOption.value);
                      formik.setFieldError("country", "");
                    } else {
                      formik.setFieldValue("country", "");
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
                {formik?.touched?.country && formik.errors.country && (
                  <div className="text-danger">{formik.errors.country}</div>
                )}
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
                    stateDropDown
                      ?.map((state) => ({
                        value: state.isoCode,
                        label: state.name,
                      }))
                      .filter((s) => s.value === formik.values.state)[0]
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      formik.setFieldValue("state", selectedOption.value);
                      handleStateChange(
                        formik.values.country,
                        selectedOption.value
                      );
                      formik.setFieldError("state", "");
                    } else {
                      formik.setFieldValue("state", "");
                    }
                  }}
                  placeholder="Select State"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: " 12px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                />
                {formik?.touched?.state && formik.errors.state && (
                  <div className="text-danger">{formik.errors.state}</div>
                )}
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
                {formik?.touched?.city && formik.errors.city && (
                  <div className="text-danger">{formik.errors.city}</div>
                )}
              </Col>
              <Col md={6}>
                <Form.Group controlId="coachingDetails.city" className="mb-3">
                  <Form.Label>Student Resident City</Form.Label>
                  <Form.Control
                    type="text"
                    name="coachingDetails.city"
                    value={formik.values.coachingDetails?.city}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    placeholder="Enter Resident City"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.startDate"
                  className="mb-3"
                >
                  <Form.Label>Coaching Start Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="custom-select-height"
                      value={
                        formik.values.coachingDetails?.startDate
                          ? formatDate(
                              parseDate(formik.values.coachingDetails.startDate)
                            )
                          : ""
                      }
                      readOnly
                      ref={coachingStartDateInputRef}
                      onClick={() =>
                        setShowCoachingStartDateCalendar(
                          !showCoachingStartDateCalendar
                        )
                      }
                      style={{ cursor: "pointer" }}
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
                    {showCoachingStartDateCalendar && (
                      <div
                        ref={coachingStartDateCalenderRef}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "10px",
                          marginBottom: "100px",
                          width: 300,
                          minWidth: 300,
                          maxWidth: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            formik.setFieldValue(
                              "coachingDetails.startDate",
                              toISODate(selectedDate)
                            );
                            setShowCoachingStartDateCalendar(false);
                          }}
                          value={
                            formik.values.coachingDetails.startDate
                              ? parseDate(
                                  formik.values.coachingDetails.startDate
                                )
                              : new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.registerFor"
                  className="mb-3"
                >
                  <Form.Label>Student Register For</Form.Label>
                  <Select
                    options={studentRegisterForOptions}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "coachingDetails.registerFor",
                        selectedOption?.value || null
                      )
                    }
                    value={studentRegisterForOptions.find(
                      (option) =>
                        option.value ===
                        formik.values.coachingDetails?.registerFor
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Register For"
                    isClearable
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.endDate"
                  className="mb-3"
                >
                  <Form.Label>Coaching End Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="custom-select-height"
                      value={
                        formik.values.coachingDetails?.endDate
                          ? formatDate(
                              parseDate(formik.values.coachingDetails.endDate)
                            )
                          : ""
                      }
                      readOnly
                      ref={coachingEndDateInputRef}
                      onClick={() =>
                        setShowCoachingEndDateCalendar(
                          !showCoachingEndDateCalendar
                        )
                      }
                      style={{ cursor: "pointer" }}
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
                    {showCoachingEndDateCalendar && (
                      <div
                        ref={coachingEndDateCalenderRef}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "10px",
                          marginBottom: "100px",
                          width: 300,
                          minWidth: 300,
                          maxWidth: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            formik.setFieldValue(
                              "coachingDetails.endDate",
                              toISODate(selectedDate)
                            );
                            setShowCoachingEndDateCalendar(false);
                          }}
                          value={
                            formik.values.coachingDetails.endDate
                              ? parseDate(formik.values.coachingDetails.endDate)
                              : new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.coachingRequirement"
                  className="mb-3"
                >
                  <Form.Label>Coaching Requirement</Form.Label>
                  <Select
                    options={coachingRequirementsOptions}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "coachingDetails.coachingRequirement",
                        selectedOption?.value || null
                      )
                    }
                    value={coachingRequirementsOptions.find(
                      (option) =>
                        option.value ===
                        formik.values.coachingDetails?.coachingRequirement
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Requirement"
                    isClearable
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.batchStatus"
                  className="mb-3"
                >
                  <Form.Label>Coaching Batches Status</Form.Label>
                  <Select
                    options={batchStatusOptions}
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "coachingDetails.batchStatus",
                        selectedOption?.value || null
                      );
                      fetchCoachingFaculties(selectedOption?.value || "", false, 
                          formik.values.coachingDetails.registerFor || "");
                      fetchBatchTimes(
                        formik.values.coachingDetails.batchFaculty || "",
                        selectedOption?.value || ""
                      );
                    }}
                    value={batchStatusOptions.find(
                      (option) =>
                        option.value ===
                        formik.values.coachingDetails?.batchStatus
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Batches Status"
                    isClearable
                  />
                </Form.Group>
              </Col>

              {userRole === "Super Admin" && (
                <Col md={6}>
                  <Form.Group controlId="branchSelection" className="mb-3">
                    <Form.Label>Branch</Form.Label>
                    <Select
                      options={[
                        // { value: "All", label: "All" },
                        { value: "HeadOffice", label: "Head Office" },
                        ...branchList.map((branch) => ({
                          value: branch._id,
                          label: branch.branchName || branch.name,
                        })),
                      ]}
                      onChange={(selectedOption) => {
                        setSelectedBranch(selectedOption);

                        const branchValue =
                          selectedOption?.value === "HeadOffice"
                            ? null
                            : selectedOption?.value;

                        formik.setFieldValue(
                          "coachingDetails.branch",
                          branchValue
                        );

                        fetchCoachingFaculties(
                          formik.values.coachingDetails.batchStatus || "",
                          branchValue || ""
                        );

                        formik.setFieldValue(
                          "coachingDetails.batchFaculty",
                          null
                        );
                        formik.setFieldValue("coachingDetails.batchTiming", "");
                      }}
                      value={
                        formik.values.coachingDetails.branch === null
                          ? branchOptions.find(
                              (opt) => opt.value === "HeadOffice"
                            )
                          : branchOptions.find(
                              (opt) =>
                                opt.value ===
                                formik.values.coachingDetails.branch
                            )
                      }
                      classNamePrefix="custom-select"
                      placeholder="Select Branch"
                      isClearable={false}
                    />
                  </Form.Group>
                </Col>
              )}
              {userRole !== "Coaching Faculty" && (
              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.batchFaculty"
                  className="mb-3"
                >
                  <Form.Label>Batch Faculty</Form.Label>
                  <Select
                    options={coachingFacultiesOptions}
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "coachingDetails.batchFaculty",
                        selectedOption?.value || null
                      );
                      fetchBatchTimes(
                        selectedOption?.value || "",
                        formik.values.coachingDetails.batchStatus || ""
                      );
                    }}
                    value={coachingFacultiesOptions.find(
                      (option) =>
                        option.value ===
                        formik.values.coachingDetails?.batchFaculty
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Faculty"
                    isClearable
                  />
                </Form.Group>
              </Col>)}

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.batchTiming"
                  className="mb-3"
                >
                  <Form.Label>Batch Timing</Form.Label>
                  <Select
                    options={batchTimesOptions}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "coachingDetails.batchTiming",
                        selectedOption?.value || null
                      )
                    }
                    value={batchTimesOptions?.find(
                      (option) =>
                        option.value ===
                        formik.values.coachingDetails?.batchTiming
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Timing"
                    isClearable
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.examRegistrationDate"
                  className="mb-3"
                >
                  <Form.Label>Exam Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="custom-select-height"
                      value={
                        formik.values.coachingDetails?.examRegistrationDate
                          ? formatDate(
                              parseDate(
                                formik.values.coachingDetails
                                  .examRegistrationDate
                              )
                            )
                          : ""
                      }
                      readOnly
                      ref={examDateInputRef}
                      onClick={() =>
                        setShowExamDateCalendar(!showExamDateCalendar)
                      }
                      style={{ cursor: "pointer" }}
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
                    {showExamDateCalendar && (
                      <div
                        ref={examDateCalenderRef}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "10px",
                          marginBottom: "100px",
                          width: 300,
                          minWidth: 300,
                          maxWidth: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            formik.setFieldValue(
                              "coachingDetails.examRegistrationDate",
                              toISODate(selectedDate)
                            );
                            setShowExamDateCalendar(false);
                          }}
                          value={
                            formik.values.coachingDetails?.examRegistrationDate
                              ? parseDate(
                                  formik.values.coachingDetails
                                    .examRegistrationDate
                                )
                              : new Date()
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group
                  controlId="coachingDetails.remarks"
                  className="mb-3"
                >
                  <Form.Label>Counsellor Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="coachingDetails.remarks"
                    value={formik.values.coachingDetails?.remarks}
                    onChange={formik.handleChange}
                    className="rounded-4"
                  />
                </Form.Group>
              </Col>
              {!formik?.values?.id &&
                userRole !== "B2B Admin" &&
                userRole !== "B2B Member" && (
                  <>
                    <hr />

                    <Row>
                      <Card
                        className="rounded-pill shadow-sm m-3"
                        style={{
                          backgroundColor: "#E9ECEF",
                          border: "1px solid #D3D3D3",
                        }}
                      >
                        <Card.Body
                          className="py-2 px-1"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Coaching Plan</strong>
                        </Card.Body>
                      </Card>

                      <Col md={6} className="mb-3">
                        <Form.Label>Coaching Sub Plan</Form.Label>
                        <Select
                          options={
                            coachingSubPlans?.map((sp) => ({
                              value: sp._id,
                              label: sp.name,
                            })) || []
                          }
                          value={coachingSubPlans
                            ?.map((sp) => ({
                              value: sp._id,
                              label: sp.name,
                            }))
                            .find(
                              (option) =>
                                option.value ===
                                formik.values.coachingDetails.subPlan
                            )}
                          onChange={(option) => {
                            const subPlanValue = option?.value || null;
                            formik.setFieldValue(
                              "coachingDetails.subPlan",
                              subPlanValue
                            );

                            // If a sub plan is selected, ensure at least one paidAmount row exists
                            if (subPlanValue) {
                              const currentPaid =
                                formik.values.coachingDetails.paidAmount || [];
                              if (currentPaid.length === 0) {
                                formik.setFieldValue(
                                  "coachingDetails.paidAmount",
                                  [{ amount: "", date: "", bank: "" }]
                                );
                              }
                            }

                            // Clear amount fields if sub plan is cleared
                            if (!subPlanValue) {
                              formik.setFieldValue(
                                "coachingDetails.amount",
                                ""
                              );
                              formik.setFieldValue(
                                "coachingDetails.payableAmount",
                                ""
                              );
                              formik.setFieldValue(
                                "coachingDetails.dueAmount",
                                ""
                              );
                              formik.setFieldValue(
                                "coachingDetails.paidAmount",
                                []
                              );
                            }
                          }}
                          placeholder="Select Coaching Sub Plan"
                          styles={selectStyles}
                          isClearable
                        />
                        {formik.touched.coachingDetails?.subPlan &&
                          formik.errors.coachingDetails?.subPlan && (
                            <div className="text-danger">
                              {formik.errors.coachingDetails?.subPlan}
                            </div>
                          )}
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Plan Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingDetails.amount"
                            value={formik.values.coachingDetails.amount}
                            onChange={formik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {formik.touched.coachingDetails?.amount &&
                            formik.errors.coachingDetails?.amount && (
                              <div className="text-danger">
                                {formik.errors.coachingDetails?.amount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Discount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingDetails.discount"
                            value={formik.values.coachingDetails.discount}
                            onChange={formik.handleChange}
                            className="custom-select-height"
                            // placeholder="e.g., 10%"
                          />
                          {formik.touched.coachingDetails?.discount &&
                            formik.errors.coachingDetails?.discount && (
                              <div className="text-danger">
                                {formik.errors.coachingDetails?.discount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Discount Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingDetails.discountAmount"
                            value={formik.values.coachingDetails.discountAmount}
                            onChange={formik.handleChange}
                            className="custom-select-height"
                            placeholder="e.g., 10"
                          />
                          {formik.touched.coachingDetails?.discountAmount &&
                            formik.errors.coachingDetails?.discountAmount && (
                              <div className="text-danger">
                                {formik.errors.coachingDetails?.discountAmount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingDetails.payableAmount"
                            value={formik.values.coachingDetails.payableAmount}
                            onChange={formik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {formik.touched.coachingDetails?.payableAmount &&
                            formik.errors.coachingDetails?.payableAmount && (
                              <div className="text-danger">
                                {formik.errors.coachingDetails?.payableAmount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receive Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingDetails.paidAmount[0].amount"
                            value={
                              formik.values.coachingDetails.paidAmount[0]
                                ?.amount || ""
                            }
                            onChange={(e) =>
                              handlePaidAmountChange(
                                0,
                                "amount",
                                e.target.value,
                                "coachingDetails"
                              )
                            }
                            className="custom-select-height"
                            placeholder="Enter Receive Amount"
                          />
                          {formik.touched.coachingDetails?.paidAmount?.[0]
                            ?.amount &&
                            formik.errors.coachingDetails?.paidAmount?.[0]
                              ?.amount && (
                              <div className="text-danger">
                                {
                                  formik.errors.coachingDetails.paidAmount[0]
                                    .amount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Mode</Form.Label>
                          <Select
                            options={paymentModeOptions}
                            value={
                              paymentModeOptions.find(
                                (option) =>
                                  option.value ===
                                  formik.values.coachingDetails.paidAmount[0]
                                    ?.paymentMode
                              ) || null
                            }
                            onChange={(option) =>
                              handlePaidAmountChange(
                                0,
                                "paymentMode",
                                option ? option.value : "",
                                "coachingDetails"
                              )
                            }
                            placeholder="Select payment mode"
                            styles={selectStyles}
                          />
                          {formik.touched.coachingDetails?.paidAmount?.[0]
                            ?.paymentMode &&
                            formik.errors.coachingDetails?.paidAmount?.[0]
                              ?.paymentMode && (
                              <div className="text-danger">
                                {
                                  formik.errors.coachingDetails.paidAmount[0]
                                    .paymentMode
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receivable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingDetails.dueAmount"
                            value={formik.values.coachingDetails.dueAmount}
                            onChange={formik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {formik.touched.coachingDetails?.dueAmount &&
                            formik.errors.coachingDetails?.dueAmount && (
                              <div className="text-danger">
                                {formik.errors.coachingDetails?.dueAmount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      {/* <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Payment Type</Form.Label>
                                  <Select
                                    options={paymentTypeOptions}
                                    value={
                                      paymentTypeOptions.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.coachingDetails
                                            .paymentType
                                      ) || null
                                    }
                                    onChange={(option) =>
                                      formik.setFieldValue(
                                        "coachingDetails.paymentType",
                                        option ? option.value : ""
                                      )
                                    }
                                    placeholder="Select payment type"
                                    styles={selectStyles}
                                  />
                                  {formik.touched.coachingDetails
                                    ?.paymentType &&
                                    formik.errors.coachingDetails
                                      ?.paymentType && (
                                      <div className="text-danger">
                                        {
                                          formik.errors.coachingDetails
                                            ?.paymentType
                                        }
                                      </div>
                                    )}
                                </Form.Group>
                              </Col> */}
                      {/* <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Payment Mode</Form.Label>
                            <Select
                              options={paymentModeOptions}
                              value={
                                paymentModeOptions.find(
                                  (option) =>
                                    option.value ===
                                    formik.values.coachingDetails.paymentMode
                                ) || null
                              }
                              onChange={(option) =>
                                formik.setFieldValue(
                                  "coachingDetails.paymentMode",
                                  option ? option.value : ""
                                )
                              }
                              placeholder="Select payment mode"
                              styles={selectStyles}
                            />
                            {formik.touched.coachingDetails?.paymentMode &&
                              formik.errors.coachingDetails?.paymentMode && (
                                <div className="text-danger">
                                  {formik.errors.coachingDetails?.paymentMode}
                                </div>
                              )}
                          </Form.Group>
                        </Col> */}
                      {/* Bank dropdown - only show when GPay, Bank, or UPI is selected */}
                      {(formik.values.coachingDetails.paidAmount[0]
                        ?.paymentMode === "GPay" ||
                        formik.values.coachingDetails.paidAmount[0]
                          ?.paymentMode === "Bank" ||
                        formik.values.coachingDetails.paidAmount[0]
                          ?.paymentMode === "UPI") && (
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bank</Form.Label>
                            <Select
                              options={bankOptions}
                              value={
                                bankOptions.find(
                                  (option) =>
                                    option.value ===
                                    formik.values.coachingDetails.paidAmount[0]
                                      ?.bank
                                ) || null
                              }
                              onChange={(option) =>
                                handlePaidAmountChange(
                                  0,
                                  "bank",
                                  option ? option.value : null,
                                  "coachingDetails"
                                )
                              }
                              placeholder="Select bank"
                              styles={selectStyles}
                            />
                            {formik.touched.coachingDetails?.paidAmount?.[0]
                              ?.bank &&
                              formik.errors.coachingDetails?.paidAmount?.[0]
                                ?.bank && (
                                <div className="text-danger">
                                  {
                                    formik.errors.coachingDetails.paidAmount[0]
                                      .bank
                                  }
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  </>
                )}

              <hr />

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

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.hasGivenExam"
                  className="mb-4"
                >
                  <Form.Label>Has Client Given any Language Exam</Form.Label>
                  <Select
                    options={hasClientLanguage}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "coachingDetails.hasGivenExam",
                        selectedOption?.value === true
                      )
                    }
                    value={hasClientLanguage.find(
                      (option) =>
                        option.value ===
                        (formik.values.coachingDetails?.hasGivenExam
                          ? true
                          : false)
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Language Exam"
                    isClearable
                  />
                </Form.Group>
              </Col>

              {formik.values.coachingDetails?.hasGivenExam && (
                <>
                  {formik.values.coachingDetails.examDetails?.map(
                    (exam, index) => (
                      <div key={index} className="mb-3">
                        <Row>
                          <Col md={12} className="mb-2">
                            <div
                              className="bg-light px-3 py-2 rounded-5"
                              style={{
                                fontSize: "16px",
                                fontWeight: "500",
                              }}
                            >
                              Exam {index + 1}
                            </div>
                          </Col>
                        </Row>
                        <Row className="px-3">
                          <Col md={6}>
                            <Form.Group
                              controlId={`coachingDetails.examDetails[${index}].examName`}
                              className=""
                            >
                              <Form.Label>Exam Name</Form.Label>
                              <Form.Control
                                type="text"
                                name={`coachingDetails.examDetails[${index}].examName`}
                                value={
                                  formik.values.coachingDetails.examDetails[
                                    index
                                  ].examName
                                }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="custom-select-height"
                                placeholder="Enter Exam Name"
                              />
                              {formik.touched.coachingDetails?.examDetails?.[
                                index
                              ]?.examName &&
                                formik.errors.coachingDetails?.examDetails?.[
                                  index
                                ]?.examName && (
                                  <div className="text-danger">
                                    {
                                      formik.errors.coachingDetails.examDetails[
                                        index
                                      ].examName
                                    }
                                  </div>
                                )}
                            </Form.Group>
                          </Col>
                          {!formik.values.id && (
                            <Col md={6}>
                              <Form.Group
                                controlId={`coachingDetails.examDetails[${index}].scoreFile`}
                                className="mb-3"
                              >
                                <Form.Label>Upload Document</Form.Label>
                                <Form.Control
                                  type="file"
                                  name={`coachingDetails.examDetails[${index}].scoreFile`}
                                  onChange={(event) => {
                                    formik.setFieldValue(
                                      `coachingDetails.examDetails[${index}].scoreFile`,
                                      event.currentTarget.files[0]
                                    );
                                  }}
                                  onBlur={formik.handleBlur}
                                  className="custom-select-height"
                                />
                                {formik.touched.coachingDetails?.examDetails?.[
                                  index
                                ]?.scoreFile &&
                                  formik.errors.coachingDetails?.examDetails?.[
                                    index
                                  ]?.scoreFile && (
                                    <div className="text-danger">
                                      {
                                        formik.errors.coachingDetails
                                          .examDetails[index].scoreFile
                                      }
                                    </div>
                                  )}
                              </Form.Group>
                            </Col>
                          )}
                          {[
                            "reading",
                            "writing",
                            "speaking",
                            "listening",
                            "total",
                          ]?.map((scoreType) => (
                            <Col md={3} key={scoreType}>
                              <Form.Group
                                controlId={`coachingDetails.examDetails[${index}].scores.${scoreType}`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  {scoreType.charAt(0).toUpperCase() +
                                    scoreType.slice(1)}{" "}
                                  Score
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  name={`coachingDetails.examDetails[${index}].scores.${scoreType}`}
                                  value={
                                    formik.values.coachingDetails.examDetails[
                                      index
                                    ].scores[scoreType]
                                  }
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                    // Calculate total score when any score changes
                                    // const scores =
                                    //   formik.values.coachingDetails
                                    //     .examDetails[index].scores;
                                    // const updatedScores = {
                                    //   ...scores,
                                    //   [scoreType]: e.target.value,
                                    // };
                                    // const total = [
                                    //   "reading",
                                    //   "writing",
                                    //   "speaking",
                                    //   "listening",
                                    // ].reduce((sum, key) => {
                                    //   const value =
                                    //     parseInt(updatedScores[key]) ||
                                    //     0;
                                    //   return sum + value;
                                    // }, 0);
                                    // formik.setFieldValue(
                                    //   `coachingDetails.examDetails[${index}].scores.total`,
                                    //   total
                                    // );
                                  }}
                                  onBlur={formik.handleBlur}
                                  className="custom-select-height"
                                  placeholder={`Enter ${scoreType} score`}
                                />
                                {formik.touched.coachingDetails?.examDetails?.[
                                  index
                                ]?.scores?.[scoreType] &&
                                  formik.errors.coachingDetails?.examDetails?.[
                                    index
                                  ]?.scores?.[scoreType] && (
                                    <div className="text-danger">
                                      {
                                        formik.errors.coachingDetails
                                          .examDetails[index].scores[scoreType]
                                      }
                                    </div>
                                  )}
                              </Form.Group>
                            </Col>
                          ))}
                          {/* <Col md={3}>
                                    <Form.Group
                                      controlId={`coachingDetails.examDetails[${index}].scores.total`}
                                      className="mb-3"
                                    >
                                      <Form.Label>Total Score</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name={`coachingDetails.examDetails[${index}].scores.total`}
                                        value={
                                          formik.values.coachingDetails
                                            .examDetails[index].scores.total
                                        }
                                        className="custom-select-height"
                                        placeholder="Total Score"
                                        readOnly
                                      />
                                    </Form.Group>
                                  </Col> */}
                          {formik.values.coachingDetails.examDetails.length >
                            1 && (
                            <Col md={12} className="mb-3">
                              <Button
                                variant="outline-danger"
                                className="custom-select-height"
                                onClick={() => {
                                  const updatedExams = [
                                    ...formik.values.coachingDetails
                                      .examDetails,
                                  ];
                                  updatedExams.splice(index, 1);
                                  formik.setFieldValue(
                                    "coachingDetails.examDetails",
                                    updatedExams
                                  );
                                }}
                              >
                                Remove Exam
                              </Button>
                            </Col>
                          )}
                        </Row>
                      </div>
                    )
                  )}
                  {!formik?.values?.id && (
                    <Col md={12} className="mb-3">
                      <Button
                        variant="outline-primary"
                        onClick={addNewExam}
                        className="custom-select-height"
                      >
                        Add Another Exam
                      </Button>
                    </Col>
                  )}
                </>
              )}
            </Row>

            <div className="text-end mt-3">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
              >
                {formik?.values?.id ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CoachingStudentForm;
