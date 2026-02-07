import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import { countryCodeISO } from "../../utils/countryISOCode";

const InstituteModelForm = ({
  show,
  handleClose,
  formik,
  isLoading,
  countries,
  stateDropDown,
  removeContactPerson,
  addContactPerson,
  canCreate,
  canUpdate,
  setProfilePreview,
  profilePreview,
  handleCountryChange,
  handleStateChange,
  cityDropDownList,
  campusByCountry,
  admissionTypeOptions,
  agreementStatusOptions,
  commissionPeriodOptions,
  valueOptions,
  unitOptions,
}) => {
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target)
      ) {
        setShowStartDateCalendar(false);
      }
      if (
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target)
      ) {
        setShowEndDateCalendar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>
          {formik.values.id ? "Update Institute" : "Add Institute"}
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
        {(canCreate || (canUpdate && formik.values.id)) && (
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-3 mt-0">
              <Col md={3} className="mb-3">
                <Form.Label>Profile</Form.Label>
                <Form.Control
                  type="file"
                  name="profile"
                  className="custom-select-height"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("profile", file);
                    setProfilePreview(URL.createObjectURL(file));
                  }}
                />
                {formik?.touched?.profile && formik.errors.profile && (
                  <div className="text-danger">{formik.errors.profile}</div>
                )}
                {profilePreview && (
                  <div
                    className="mb-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      overflow: "hidden",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: "#f9f9f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={profilePreview}
                      alt="Profile Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Select Country</Form.Label>
                <Select
                  options={countries?.map((c) => ({
                    value: c.isoCode,
                    label: c.name,
                  }))}
                  value={
                    countries
                      ?.map((c) => ({
                        value: c.isoCode,
                        label: c.name,
                      }))
                      .filter((o) => o.value === formik.values.country)[0]
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
                {formik?.touched?.country && formik.errors.country && (
                  <div className="text-danger">{formik.errors.country}</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Select State</Form.Label>
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
                        selectedOption.value,
                      );
                      formik.setFieldError("state", "");
                    } else {
                      formik.setFieldValue("state", "");
                    }
                  }}
                  placeholder="Select State"
                  isClearable
                  isSearchable
                  isDisabled={!formik.values.country}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "12px",
                      color: state.isDisabled ? "#6c757d" : "black",
                      backgroundColor: state.isDisabled ? "#e9ecef" : "white",
                      cursor: state.isDisabled ? "not-allowed" : "pointer",
                    }),
                    placeholder: (base, state) => ({
                      ...base,
                      color: state.isDisabled ? "#6c757d" : "black",
                      fontSize: "13px",
                    }),
                    singleValue: (base, state) => ({
                      ...base,
                      color: state.isDisabled ? "#6c757d" : "black",
                    }),
                  }}
                />
                {formik?.touched?.state && formik.errors.state && (
                  <div className="text-danger">{formik.errors.state}</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Select City</Form.Label>
                <Select
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
                  placeholder="Select City"
                  isClearable
                  isSearchable
                  isDisabled={!formik.values.state}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "12px",
                      color: state.isDisabled ? "#6c757d" : "black",
                      backgroundColor: state.isDisabled ? "#e9ecef" : "white",
                      cursor: state.isDisabled ? "not-allowed" : "pointer",
                    }),
                    placeholder: (base, state) => ({
                      ...base,
                      color: state.isDisabled ? "#6c757d" : "black",
                      fontSize: "13px",
                    }),
                    singleValue: (base, state) => ({
                      ...base,
                      color: state.isDisabled ? "#6c757d" : "black",
                    }),
                  }}
                />

                {formik?.touched?.city && formik.errors.city && (
                  <div className="text-danger">{formik.errors.city}</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Institute</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter institute name"
                  name="instituteName"
                  value={formik.values.instituteName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.instituteName &&
                  formik.errors.instituteName && (
                    <div className="text-danger">
                      {formik.errors.instituteName}
                    </div>
                  )}
              </Col>

              <Col md={3} className="mb-3">
                <Form.Label>Select Campus</Form.Label>
                <Select
                  options={campusByCountry
                    ?.sort((a, b) => a.campus.localeCompare(b.campus))
                    ?.map((c) => ({
                      value: c._id,
                      label: c.campus,
                    }))}
                  value={
                    formik.values.campus
                      ? {
                          value: formik.values.campus,
                          label:
                            campusByCountry.find(
                              (c) => c._id === formik.values.campus,
                            )?.campus || "",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      formik.setFieldValue("campus", selectedOption.value);
                      formik.setFieldError("campus", "");
                    } else {
                      formik.setFieldValue("campus", "");
                    }
                  }}
                  placeholder="Select Campus"
                  isClearable
                  isSearchable
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
              </Col>

              <Col md={3} className="mb-3">
                <Form.Label>Offer Letter Email</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter offer letter email"
                  name="offerLetterEmail"
                  value={formik.values.offerLetterEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.offerLetterEmail &&
                  formik.errors.offerLetterEmail && (
                    <div className="text-danger">
                      {formik.errors.offerLetterEmail}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Offer Letter Email CC</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter offer letter email cc"
                  name="offerLetterEmailCC"
                  value={formik.values.offerLetterEmailCC}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.offerLetterEmailCC &&
                  formik.errors.offerLetterEmailCC && (
                    <div className="text-danger">
                      {formik.errors.offerLetterEmailCC}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>TT Email</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter tt email"
                  name="ttEmail"
                  value={formik.values.ttEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.ttEmail && formik.errors.ttEmail && (
                  <div className="text-danger">{formik.errors.ttEmail}</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>TT Email CC</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter tt email cc"
                  name="ttEmailCC"
                  value={formik.values.ttEmailCC}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.ttEmailCC && formik.errors.ttEmailCC && (
                  <div className="text-danger">{formik.errors.ttEmailCC}</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Refund Email</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter refund email"
                  name="refundEmail"
                  value={formik.values.refundEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.refundEmail && formik.errors.refundEmail && (
                  <div className="text-danger">{formik.errors.refundEmail}</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Refund Email CC</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter refund email cc"
                  name="refundEmailCC"
                  value={formik.values.refundEmailCC}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.refundEmailCC &&
                  formik.errors.refundEmailCC && (
                    <div className="text-danger">
                      {formik.errors.refundEmailCC}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Contact 1</Form.Label>
                <PhoneInput
                  country={countryCodeISO()}
                  value={formik.values.contact1 || ""}
                  onChange={(phone, data) => {
                    const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                    const formattedPhone = `${dialCode} ${phone.replace(
                      data.dialCode,
                      "",
                    )}`.trim();
                    formik.setFieldValue("contact1", formattedPhone);
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
                {formik.touched.contact1 && formik.errors.contact1 && (
                  <div className="text-danger">{formik.errors.contact1}</div>
                )}
              </Col>

              <Col md={3} className="mb-3">
                <Form.Label>Contact 2</Form.Label>
                <PhoneInput
                  country={countryCodeISO()}
                  value={formik.values.contact2 || ""}
                  onChange={(phone, data) => {
                    const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                    const formattedPhone = `${dialCode} ${phone.replace(
                      data.dialCode,
                      "",
                    )}`.trim();
                    formik.setFieldValue("contact2", formattedPhone);
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
                {formik.touched.contact2 && formik.errors.contact2 && (
                  <div className="text-danger">{formik.errors.contact2}</div>
                )}
              </Col>

              <Col md={3} className="mb-3">
                <Form.Label>Admission Type</Form.Label>
                <Select
                  name="admissionType"
                  classNamePrefix="custom-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      fontSize: "13px",
                    }),
                  }}
                  value={
                    formik.values.admissionType
                      ? {
                          value: formik.values.admissionType,
                          label:
                            admissionTypeOptions.find(
                              (option) =>
                                option.value === formik.values.admissionType,
                            )?.label || "Select Admission Type",
                        }
                      : null
                  }
                  onChange={(option) =>
                    formik.setFieldValue(
                      "admissionType",
                      option ? option.value : "",
                    )
                  }
                  onBlur={() => formik.setFieldTouched("admissionType", true)}
                  options={admissionTypeOptions}
                  placeholder="Select Admission Type"
                  clearable
                />
                {formik.touched.admissionType &&
                  formik.errors.admissionType && (
                    <div className="text-danger">
                      {formik.errors.admissionType}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Portal</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter portal"
                  name="portal"
                  value={formik.values.portal}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.portal && formik.errors.portal && (
                  <div className="text-danger">{formik.errors.portal}</div>
                )}
              </Col>
              {/* <Col md={3} className="mb-3">
                        <Form.Label>Contact Person</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter person"
                          name="contactPerson"
                          value={formik.values.contactPerson}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.contactPerson &&
                          formik.errors.contactPerson && (
                            <div className="text-danger">
                              {formik.errors.contactPerson}
                            </div>
                          )}
                      </Col> */}
              {formik.values.contactPerson.map((person, index) => (
                <Col md={12} className="mb-3" key={index}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <Form.Label>Contact Person {index + 1}</Form.Label>
                    {index > 0 && (
                      <Button
                        variant="outline-danger"
                        className="custom-select-height"
                        onClick={() => removeContactPerson(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <Row>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        className="custom-select-height"
                        name={`contactPerson[${index}].name`}
                        value={person.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.contactPerson?.[index]?.name &&
                        formik.errors.contactPerson?.[index]?.name && (
                          <div className="text-danger">
                            {formik.errors.contactPerson[index].name}
                          </div>
                        )}
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="Designation"
                        className="custom-select-height"
                        name={`contactPerson[${index}].designation`}
                        value={person.designation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        className="custom-select-height"
                        name={`contactPerson[${index}].email`}
                        value={person.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.contactPerson?.[index]?.email &&
                        formik.errors.contactPerson?.[index]?.email && (
                          <div className="text-danger">
                            {formik.errors.contactPerson[index].email}
                          </div>
                        )}
                    </Col>
                    <Col md={3}>
                      <PhoneInput
                        country={countryCodeISO()}
                        value={person.phone || ""}
                        onChange={(phone, data) => {
                          const dialCode = data.dialCode
                            ? `+${data.dialCode}`
                            : "";
                          const formattedPhone = `${dialCode} ${phone.replace(
                            data.dialCode,
                            "",
                          )}`.trim();
                          formik.setFieldValue(
                            `contactPerson[${index}].phone`,
                            formattedPhone,
                          );
                        }}
                        inputProps={{
                          name: `contactPerson[${index}].phone`,
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
                  </Row>
                </Col>
              ))}
              <Col md={12} className="mb-3">
                <Button
                  variant="outline-primary"
                  className="custom-select-height"
                  onClick={addContactPerson}
                >
                  Add Another Contact Person
                </Button>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Recruitment Territory Rights</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter countries or 'Global Rights'"
                  name="recruitmentTerritoryRights"
                  value={formik.values.recruitmentTerritoryRights}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.recruitmentTerritoryRights &&
                  formik.errors.recruitmentTerritoryRights && (
                    <div className="text-danger">
                      {formik.errors.recruitmentTerritoryRights}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Start Date of Agreement</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="agreementStartDate"
                    placeholder="dd/mm/yyyy"
                    value={
                      formik.values.agreementStartDate
                        ? formatDate(
                            parseDate(formik.values.agreementStartDate),
                          )
                        : ""
                    }
                    readOnly
                    ref={startDateInputRef}
                    onClick={() => setShowStartDateCalendar(true)}
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
                  {showStartDateCalendar && (
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
                        className="form-control m-0 p-0 border-0"
                        onChange={(selectedDate) => {
                          formik.setFieldValue(
                            "agreementStartDate",
                            toISODate(selectedDate),
                          );
                          setShowStartDateCalendar(false);
                        }}
                        value={
                          parseDate(formik.values.agreementStartDate) ||
                          new Date()
                        }
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
                {formik?.touched?.agreementStartDate &&
                  formik.errors.agreementStartDate && (
                    <div className="text-danger">
                      {formik.errors.agreementStartDate}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>End Date of Agreement</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="agreementEndDate"
                    placeholder="dd/mm/yyyy"
                    value={
                      formik.values.agreementEndDate
                        ? formatDate(parseDate(formik.values.agreementEndDate))
                        : ""
                    }
                    readOnly
                    ref={endDateInputRef}
                    onClick={() => setShowEndDateCalendar(true)}
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
                  {showEndDateCalendar && (
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
                        className="form-control m-0 p-0 border-0"
                        onChange={(selectedDate) => {
                          formik.setFieldValue(
                            "agreementEndDate",
                            toISODate(selectedDate),
                          );
                          setShowEndDateCalendar(false);
                        }}
                        value={
                          parseDate(formik.values.agreementEndDate) ||
                          new Date()
                        }
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
                {formik?.touched?.agreementEndDate &&
                  formik.errors.agreementEndDate && (
                    <div className="text-danger">
                      {formik.errors.agreementEndDate}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Current Status of Agreement</Form.Label>
                <Select
                  name="agreementStatus"
                  classNamePrefix="custom-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      fontSize: "13px",
                    }),
                  }}
                  value={
                    formik.values.agreementStatus
                      ? {
                          value: formik.values.agreementStatus,
                          label: formik.values.agreementStatus,
                        }
                      : null
                  }
                  onChange={(option) =>
                    formik.setFieldValue(
                      "agreementStatus",
                      option ? option.value : "",
                    )
                  }
                  onBlur={() => formik.setFieldTouched("agreementStatus", true)}
                  options={agreementStatusOptions}
                  placeholder="Select Agreement Status"
                  isClearable
                />
                {formik.touched.agreementStatus &&
                  formik.errors.agreementStatus && (
                    <div className="text-danger">
                      {formik.errors.agreementStatus}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Type of Association</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter association type (e.g., Direct, GUS, SIUK)"
                  name="typeOfAssociation"
                  value={formik.values.typeOfAssociation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.typeOfAssociation &&
                  formik.errors.typeOfAssociation && (
                    <div className="text-danger">
                      {formik.errors.typeOfAssociation}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Upload Agreement</Form.Label>
                <Form.Control
                  type="file"
                  name="agreementDoc"
                  className="custom-select-height"
                  accept="application/pdf"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("agreementDoc", file);
                  }}
                />
                {formik.touched.agreementDoc && formik.errors.agreementDoc && (
                  <div className="text-danger">
                    {formik.errors.agreementDoc}
                  </div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Fax</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter fax"
                  name="fax"
                  value={formik.values.fax}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.fax && formik.errors.fax && (
                  <div className="text-danger">{formik.errors.fax}</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Web Address</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter web address"
                  name="webAddress"
                  value={formik.values.webAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.webAddress && formik.errors.webAddress && (
                  <div className="text-danger">{formik.errors.webAddress}</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Portal Address</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter portal address"
                  name="postalAddress"
                  value={formik.values.postalAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.postalAddress &&
                  formik.errors.postalAddress && (
                    <div className="text-danger">
                      {formik.errors.postalAddress}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Commission Period</Form.Label>
                <Select
                  name="commissionPeriod"
                  classNamePrefix="custom-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      fontSize: "13px",
                    }),
                  }}
                  value={
                    formik.values.commissionPeriod
                      ? {
                          value: formik.values.commissionPeriod,
                          label: formik.values.commissionPeriod,
                        }
                      : null
                  }
                  onChange={(option) =>
                    formik.setFieldValue(
                      "commissionPeriod",
                      option ? option.value : "",
                    )
                  }
                  onBlur={() =>
                    formik.setFieldTouched("commissionPeriod", true)
                  }
                  options={commissionPeriodOptions}
                  placeholder="Select Commission Period"
                  clearable
                />
                {formik.touched.commissionPeriod &&
                  formik.errors.commissionPeriod && (
                    <div className="text-danger">
                      {formik.errors.commissionPeriod}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Comission Percentage</Form.Label>
                <Form.Control
                  type="number"
                  className="custom-select-height"
                  placeholder="Enter comission percentage"
                  name="commissionPercentage"
                  value={formik.values.commissionPercentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik?.touched?.commissionPercentage &&
                  formik.errors.commissionPercentage && (
                    <div className="text-danger">
                      {formik.errors.commissionPercentage}
                    </div>
                  )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>OL TAT Period</Form.Label>
                <div className="d-flex gap-2">
                  <Select
                    name="olTATPeriod.value"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        width: "120px",
                      }),
                    }}
                    value={
                      formik.values.olTATPeriod?.value
                        ? {
                            value: formik.values.olTATPeriod.value,
                            label: `${formik.values.olTATPeriod.value}`,
                          }
                        : null
                    }
                    onChange={(option) =>
                      formik.setFieldValue(
                        "olTATPeriod.value",
                        option ? option.value : "",
                      )
                    }
                    onBlur={() =>
                      formik.setFieldTouched("olTATPeriod.value", true)
                    }
                    options={valueOptions}
                    placeholder="Select OL TAT Period"
                    clearable
                  />
                  <Select
                    name="olTATPeriod.unit"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        width: "120px",
                      }),
                    }}
                    value={
                      formik.values.olTATPeriod?.unit
                        ? {
                            value: formik.values.olTATPeriod.unit,
                            label: formik.values.olTATPeriod.unit,
                          }
                        : null
                    }
                    onChange={(option) =>
                      formik.setFieldValue(
                        "olTATPeriod.unit",
                        option ? option.value : "",
                      )
                    }
                    onBlur={() =>
                      formik.setFieldTouched("olTATPeriod.unit", true)
                    }
                    options={unitOptions}
                    placeholder="Select Duration"
                    clearable
                  />
                </div>
                {((formik.touched?.olTATPeriod?.value &&
                  formik.errors?.olTATPeriod?.value) ||
                  (formik.touched?.olTATPeriod?.unit &&
                    formik.errors?.olTATPeriod?.unit)) && (
                  <div className="text-danger">OL TAT Period is required</div>
                )}
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Upload Brochure</Form.Label>
                <Form.Control
                  type="file"
                  name="brochure"
                  className="custom-select-height"
                  accept="application/pdf"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("brochure", file);
                  }}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Other</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter other"
                  name="otherInfo"
                  value={formik.values.otherInfo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Backlog</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter backlog"
                  name="backlog"
                  value={formik.values.backlog}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Youtube Link</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter youtube url"
                  name="youtubeLink"
                  value={formik.values.youtubeLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label>Gallery Link</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Enter gallery url"
                  name="galleryLink"
                  value={formik.values.galleryLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
            </Row>

            <div className="text-end">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
              >
                {formik.values.id ? "Update Institute" : "Add Institute"}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default InstituteModelForm;
