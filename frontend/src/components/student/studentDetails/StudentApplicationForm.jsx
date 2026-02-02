import { Col, Form, Modal, Row, Card, Button } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { useEffect, useRef, useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { decryptData } from "../../../utils/encryptionUtils";
import { getAllInquiry } from "../../../redux/actions/Lead/Inquiry.action";
import { useDispatch } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getAllBankingDetails } from "../../../redux/actions/Master/Banking.action";
import { getAllApplicationType } from "../../../redux/actions/Master/ApplicationType.action";
import { countryCodeISO } from "../../../utils/countryISOCode";

const StudentApplicationForm = ({
  show,
  handleClose,
  formik,
  isLoading,
  countries,
  stateDropDown,
  cityDropDownList,
  showAccountDetails,
  preferredCountries,
  studentSubPlans,
  formatDate,
  parseDate,
  handleStateChange,
  handleCountryChange,
  oneCourseData,
}) => {
  const dispatch = useDispatch();
  const dobInputRef = useRef(null);
  const [showDOBCalendar, setShowDOBCalendar] = useState(false);
  const [dobValue, setDOBValue] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [applicationTypes, setApplicationTypes] = useState([]);

  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));
  const [allInquiry, setAllInquiry] = useState([]);
  const handlePaidAmountChange = (index, field, value, section) => {
    const updatedPaidAmount = [...formik.values[section].paidAmount];
    updatedPaidAmount[index] = {
      ...updatedPaidAmount[index],
      [field]: value,
    };
    formik.setFieldValue(`${section}.paidAmount`, updatedPaidAmount);
  };

  const fetchInquirys = async () => {
    try {
      const res = await dispatch(getAllInquiry(1, 10000));
      const responseData = res?.data?.data;
      setAllInquiry(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Inquiry:", error);
      setAllInquiry([]);
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

  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  const fetchApplicationTypes = async () => {
    try {
      const res = await dispatch(getAllApplicationType(1, 10000, ""));
      const responseData = res?.data?.data?.data || [];
      setApplicationTypes(responseData);
    } catch (error) {
      console.error("Error fetching application types:", error);
      setApplicationTypes([]);
    }
  };

  const applicationTypeOptions = applicationTypes
    ?.sort((a, b) => a.name.localeCompare(b.name))
    ?.map((type) => ({
      value: type._id,
      label: type.name,
    }));

  useEffect(() => {
    fetchInquirys();
    fetchBankingDetails();
    fetchApplicationTypes();
  }, []);
  const yearOptions = Array.from({ length: 20 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year, label: year.toString() };
  });

  const monthOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];
  const selectStyles = {
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
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {formik?.values?.id
              ? "Update Student Application"
              : "Add Student Application"}
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
                        ? formatDate(parseDate(formik.values.DOB))
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
                      borderRadius: "30px",
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
                      borderRadius: "30px",
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
                      borderRadius: " 30px",
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
                      borderRadius: "30px",
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
                <Form.Label>Passport Number</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  name="passportNumber"
                  maxLength={12}
                  placeholder="Enter Passport Number"
                  value={formik.values.passportNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.passportNumber &&
                  formik.errors.passportNumber && (
                    <div className="text-danger">
                      {formik.errors.passportNumber}
                    </div>
                  )}
              </Col>
            </Row>

            <div
              className={`section-wrapper ${
                isDropdownOpen ? "dropdown-open" : ""
              }`}
            >
              <h5
                className="form-heading p-2 d-flex justify-content-between"
                style={{ cursor: "pointer" }}
                onClick={() => setShowAccountDetails(!showAccountDetails)}
              >
                Purpose
                {showAccountDetails ? <FaChevronUp /> : <FaChevronDown />}
              </h5>
              {showAccountDetails && (
                <div className="section-content mt-4 mb-5">
                  <Row className="mb-3">
                    <Col md={6} className="mb-3">
                      <Form.Label>Preferred Country</Form.Label>
                      <Select
                        options={
                          oneCourseData?.university?.country
                            ? [
                                {
                                  value: oneCourseData?.university?.country,
                                  label: oneCourseData?.university?.country,
                                },
                              ]
                            : preferredCountries?.map((c) => ({
                                value: c.name,
                                label: c.name,
                              }))
                        }
                        value={
                          oneCourseData?.university?.country
                            ? {
                                value: oneCourseData.cuniversity?.ountry,
                                label: oneCourseData?.university?.country,
                              }
                            : formik.values.purposeDetails?.preferredCountry
                                ?.length > 0
                            ? {
                                value:
                                  formik.values.purposeDetails
                                    .preferredCountry[0],
                                label:
                                  formik.values.purposeDetails
                                    .preferredCountry[0],
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const selectedValue = selectedOption
                            ? [selectedOption.value]
                            : [];
                          formik.setFieldValue(
                            "purposeDetails.preferredCountry",
                            selectedValue
                          );
                          formik.setFieldError(
                            "purposeDetails.preferredCountry",
                            ""
                          );
                        }}
                        placeholder="Select Country"
                        isClearable
                        isSearchable
                        classNamePrefix="custom-select"
                        noOptionsMessage={() => "No countries available"}
                        menuPortalTarget={document.body}
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
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                      {formik.touched.purposeDetails?.preferredCountry &&
                        formik.errors.purposeDetails?.preferredCountry && (
                          <div className="text-danger">
                            {formik.errors.purposeDetails.preferredCountry}
                          </div>
                        )}
                    </Col>
                    {userRole !== "B2B Admin" &&
                      userRole !== "B2B Member" &&
                      userRole !== "Branch" &&
                      userType !== "Branch User" && (
                        <Col md={6} className="mb-3">
                          <Form.Label>Inquiry For</Form.Label>
                          <Select
                            options={allInquiry
                              ?.sort((a, b) => a.name.localeCompare(b.name))
                              ?.map((inq) => ({
                                value: inq._id,
                                label: inq.name,
                              }))}
                            value={
                              allInquiry
                                ?.map((inq) => ({
                                  value: inq._id,
                                  label: inq.name,
                                }))
                                .find(
                                  (option) =>
                                    option.value ===
                                    formik.values?.purposeDetails?.inquiryFor
                                ) || null
                            }
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "purposeDetails.inquiryFor",
                                selectedOption ? selectedOption.value : ""
                              )
                            }
                            placeholder="Select inquiry for"
                            classNamePrefix="custom-select"
                            isClearable
                            menuPortalTarget={document.body}
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
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                            }}
                          />
                          {formik?.touched?.purposeDetails?.inquiryFor &&
                            formik?.errors?.purposeDetails?.inquiryFor && (
                              <div className="text-danger">
                                {formik?.errors?.purposeDetails?.inquiryFor}
                              </div>
                            )}
                        </Col>
                      )}
                    <Col md={6} className="mb-3">
                      <Form.Label>Intake year</Form.Label>
                      <Select
                        options={yearOptions}
                        value={yearOptions?.filter((option) =>
                          formik.values?.purposeDetails?.intakeYear?.includes(
                            option.value.toString()
                          )
                        )}
                        onChange={(selectedOptions) =>
                          formik.setFieldValue(
                            "purposeDetails.intakeYear",
                            selectedOptions?.map((option) =>
                              option.value.toString()
                            ) || []
                          )
                        }
                        placeholder="Select intake year"
                        classNamePrefix="custom-select"
                        isClearable
                        isMulti
                        menuPortalTarget={document.body}
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
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                      {formik?.touched?.purposeDetails?.intakeYear &&
                        formik?.errors?.purposeDetails?.intakeYear && (
                          <div className="text-danger">
                            {formik?.errors?.purposeDetails?.intakeYear}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Intake Month</Form.Label>
                      <Select
                        options={monthOptions}
                        value={monthOptions?.filter((option) =>
                          formik.values?.purposeDetails?.intakeMonth?.includes(
                            option.value
                          )
                        )}
                        onChange={(selectedOptions) =>
                          formik.setFieldValue(
                            "purposeDetails.intakeMonth",
                            selectedOptions?.map((option) => option.value) || []
                          )
                        }
                        placeholder="Select intake month"
                        classNamePrefix="custom-select"
                        isClearable
                        isMulti
                        menuPortalTarget={document.body}
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
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                      {formik?.touched?.purposeDetails?.intakeMonth &&
                        formik?.errors?.purposeDetails?.intakeMonth && (
                          <div className="text-danger">
                            {formik?.errors?.purposeDetails?.intakeMonth}
                          </div>
                        )}
                    </Col>
                  </Row>
                </div>
              )}
            </div>
            {!formik?.values?.id &&
              userRole !== "B2B Admin" &&
              userRole !== "B2B Member" &&
              userRole !== "Student" && userRole !== "LeadStudent" && (
                <Row>
                  <Card
                    className="rounded-pill shadow-sm my-3"
                    style={{
                      backgroundColor: "#E9ECEF",
                      border: "1px solid #D3D3D3",
                    }}
                  >
                    <Card.Body
                      className="py-2 px-1"
                      style={{ fontSize: "16px" }}
                    >
                      <strong>Student Admission Plan</strong>
                    </Card.Body>
                  </Card>

                  <Col md={6} className="mb-3">
                    <Form.Label>Admission Sub Plan</Form.Label>
                    <Select
                      options={
                        studentSubPlans?.map((sp) => ({
                          value: sp._id,
                          label: sp.name,
                        })) || []
                      }
                      value={studentSubPlans
                        ?.map((sp) => ({
                          value: sp._id,
                          label: sp.name,
                        }))
                        .find(
                          (option) =>
                            option.value === formik.values.invoice.subPlan
                        )}
                      onChange={(option) => {
                        const subPlanValue = option?.value || null;
                        formik.setFieldValue("invoice.subPlan", subPlanValue);

                        // If a sub plan is selected, ensure at least one paidAmount row exists
                        if (subPlanValue) {
                          const currentPaid =
                            formik.values.invoice.paidAmount || [];
                          if (currentPaid.length === 0) {
                            formik.setFieldValue("invoice.paidAmount", [
                              { amount: "", date: "", bank: "" },
                            ]);
                          }
                        }

                        // Clear amount fields if sub plan is cleared
                        if (!subPlanValue) {
                          formik.setFieldValue("invoice.amount", "");
                          formik.setFieldValue("invoice.payableAmount", "");
                          formik.setFieldValue("invoice.dueAmount", "");
                          formik.setFieldValue("invoice.paidAmount", []);
                        }
                      }}
                      placeholder="Select Admission Sub Plan"
                      styles={selectStyles}
                      isClearable
                    />
                    {formik.touched.invoice?.subPlan &&
                      formik.errors.invoice?.subPlan && (
                        <div className="text-danger">
                          {formik.errors.invoice?.subPlan}
                        </div>
                      )}
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Plan Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="invoice.amount"
                        value={formik.values.invoice.amount}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                        disabled
                        readOnly
                      />
                      {formik.touched.invoice?.amount &&
                        formik.errors.invoice?.amount && (
                          <div className="text-danger">
                            {formik.errors.invoice?.amount}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Discount</Form.Label>
                      <Form.Control
                        type="text"
                        name="invoice.discount"
                        value={formik.values.invoice.discount}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                      />
                      {formik.touched.invoice?.discount &&
                        formik.errors.invoice?.discount && (
                          <div className="text-danger">
                            {formik.errors.invoice?.discount}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Discount Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="invoice.discountAmount"
                        value={formik.values.invoice.discountAmount}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                        placeholder="e.g., 10"
                      />
                      {formik.touched.invoice?.discountAmount &&
                        formik.errors.invoice?.discountAmount && (
                          <div className="text-danger">
                            {formik.errors.invoice?.discountAmount}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payable Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="invoice.payableAmount"
                        value={formik.values.invoice.payableAmount}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                        disabled
                        readOnly
                      />
                      {formik.touched.invoice?.payableAmount &&
                        formik.errors.invoice?.payableAmount && (
                          <div className="text-danger">
                            {formik.errors.invoice?.payableAmount}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Receive Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="invoice.paidAmount[0].amount"
                        value={
                          formik.values.invoice.paidAmount[0]?.amount || ""
                        }
                        onChange={(e) =>
                          handlePaidAmountChange(
                            0,
                            "amount",
                            e.target.value,
                            "invoice"
                          )
                        }
                        className="custom-select-height"
                        placeholder="Enter Receive Amount"
                      />
                      {formik.touched.invoice?.paidAmount?.[0]?.amount &&
                        formik.errors.invoice?.paidAmount?.[0]?.amount && (
                          <div className="text-danger">
                            {formik.errors.invoice.paidAmount[0].amount}
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
                              formik.values.invoice.paidAmount[0]?.paymentMode
                          ) || null
                        }
                        onChange={(option) =>
                          handlePaidAmountChange(
                            0,
                            "paymentMode",
                            option ? option.value : "",
                            "invoice"
                          )
                        }
                        placeholder="Select payment mode"
                        styles={selectStyles}
                      />
                      {formik.touched.invoice?.paidAmount?.[0]?.paymentMode &&
                        formik.errors.invoice?.paidAmount?.[0]?.paymentMode && (
                          <div className="text-danger">
                            {formik.errors.invoice.paidAmount[0].paymentMode}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Receivable Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="invoice.dueAmount"
                        value={formik.values.invoice.dueAmount}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                        disabled
                        readOnly
                      />
                      {formik.touched.invoice?.dueAmount &&
                        formik.errors.invoice?.dueAmount && (
                          <div className="text-danger">
                            {formik.errors.invoice?.dueAmount}
                          </div>
                        )}
                    </Form.Group>
                  </Col>

                  {(formik.values.invoice.paidAmount[0]?.paymentMode ===
                    "GPay" ||
                    formik.values.invoice.paidAmount[0]?.paymentMode ===
                      "Bank" ||
                    formik.values.invoice.paidAmount[0]?.paymentMode ===
                      "UPI") && (
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Bank</Form.Label>
                        <Select
                          options={bankOptions}
                          value={
                            bankOptions.find(
                              (option) =>
                                option.value ===
                                formik.values.invoice.paidAmount[0]?.bank
                            ) || null
                          }
                          onChange={(option) =>
                            handlePaidAmountChange(
                              0,
                              "bank",
                              option ? option.value : null,
                              "invoice"
                            )
                          }
                          placeholder="Select bank"
                          styles={selectStyles}
                        />
                        {formik.touched.invoice?.paidAmount?.[0]?.bank &&
                          formik.errors.invoice?.paidAmount?.[0]?.bank && (
                            <div className="text-danger">
                              {formik.errors.invoice.paidAmount[0].bank}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                  )}
                </Row>
              )}

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
export default StudentApplicationForm;
