import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import PhoneInput from "react-phone-input-2";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useRef, useState } from "react";
import { decryptData } from "../../../utils/encryptionUtils";
import { countryCodeISO } from "../../../utils/countryISOCode";

const VisitorFormModal = ({
  show,
  handleClose,
  formik,
  isLoading,
  countries,
  stateDropDown,
  cityDropDownList,
  preferredCountries,
  visitorSubPlans,
  formatDate,
  parseDate,
  handleCountryChange,
  handleStateChange,
  bankOptions,
  visitorProcessRenewalDateInputRef,
  showVisitorProcessRenewalDateCalendar,
  setShowVisitorProcessRenewalDateCalendar,
  visitorProcessRenewalDateCalendarRef,
  toISODate
}) => {
  const [showDOBCalendar, setShowDOBCalendar] = useState(false);
  const [dobValue, setDOBValue] = useState(null);
  const dobInputRef = useRef(null);

  const userRole = decryptData(localStorage.getItem("role"));

  const selectStyles = {
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

  const visitorProcessOptions = [
    { value: "Fresh", label: "Fresh" },
    { value: "Renewal", label: "Renewal" },
    { value: "Refusal", label: "Refusal" },
  ];

  const handlePaidAmountChange = (index, field, value, section) => {
    const updatedPaidAmount = [...formik.values[section].paidAmount];
    updatedPaidAmount[index] = {
      ...updatedPaidAmount[index],
      [field]: value,
    };
    formik.setFieldValue(`${section}.paidAmount`, updatedPaidAmount);
  };

  const addVisitorEntry = () => {
    formik.setFieldValue("categoryDetails.entries", [
      ...formik.values.categoryDetails.entries,
      { country: "", date: "", document: null, remarks: "" },
    ]);
  };

  const removeVisitorEntry = (index) => {
    const newEntries = [...formik.values.categoryDetails.entries];
    newEntries.splice(index, 1);
    formik.setFieldValue("categoryDetails.entries", newEntries);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {formik?.values?.id
              ? "Update Visitor Application"
              : "Add Visitor Application"}
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
                  value={formik.values?.name}
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
                  value={formik.values?.email}
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
                  value={formik.values?.address}
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
                  value={formik.values?.contact || ""}
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
                  value={formik.values?.alternateContact || ""}
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
                      formik.values?.DOB
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
                    ].find(
                      (option) => option.value === formik.values?.gender
                    ) || null
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
                  value={formik.values?.age}
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
                    formik.values?.country
                      ? countries
                          ?.map((c) => ({
                            value: c.isoCode,
                            label: c.name,
                          }))
                          ?.find((o) => o.value === formik.values?.country)
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
                      ?.filter((s) => s.value === formik.values?.state)[0]
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
                    formik.values?.city
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
                <Form.Label>Passport Number</Form.Label>
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  name="passportNumber"
                  maxLength={12}
                  placeholder="Enter Passport Number"
                  value={formik.values?.passportNumber}
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
              <Col md={6} className="mb-3">
                <Form.Label>Preferred Country</Form.Label>
                <Select
                  options={preferredCountries?.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  value={
                    formik.values?.preferredCountry
                      ? {
                          value: formik.values.preferredCountry,
                          label: formik.values.preferredCountry,
                        }
                      : ""
                  }
                  onChange={(selectedOption) => {
                    const selectedValue = selectedOption
                      ? selectedOption.value
                      : "";
                    formik.setFieldValue("preferredCountry", selectedValue);
                    formik.setFieldError("preferredCountry", "");
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
                      borderRadius: "12px",
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
                {formik.touched?.preferredCountry &&
                  formik.errors?.preferredCountry && (
                    <div className="text-danger">
                      {formik.errors.preferredCountry}
                    </div>
                  )}
              </Col>
              {!formik?.values?.id &&
                userRole !== "B2B Admin" &&
                userRole !== "B2B Member" && (
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
                        <strong>Visitor Plan</strong>
                      </Card.Body>
                    </Card>

                    <Col md={6} className="mb-3">
                      <Form.Label>Visitor Sub Plan</Form.Label>
                      <Select
                        options={
                          visitorSubPlans?.map((sp) => ({
                            value: sp._id,
                            label: sp.name,
                          })) || []
                        }
                        value={
                          formik.values.categoryDetails.subPlan
                            ? {
                                value: formik.values.categoryDetails.subPlan,
                                label:
                                  visitorSubPlans.find(
                                    (sp) =>
                                      sp._id ===
                                      formik.values.categoryDetails.subPlan
                                  )?.name || null,
                              }
                            : null
                        }
                        onChange={(option) => {
                          const subPlanValue = option?.value || null;
                          formik.setFieldValue(
                            "categoryDetails.subPlan",
                            subPlanValue
                          );
                          // Ensure at least one paidAmount entry exists
                          if (
                            subPlanValue &&
                            !formik.values.categoryDetails.paidAmount.length
                          ) {
                            formik.setFieldValue("categoryDetails.paidAmount", [
                              {
                                amount: "",
                                date: "",
                                bank: null,
                                paymentMode: "",
                              },
                            ]);
                          }
                          // Clear amount fields if sub plan is cleared
                          if (!subPlanValue) {
                            formik.setFieldValue("categoryDetails.amount", "");
                            formik.setFieldValue(
                              "categoryDetails.payableAmount",
                              ""
                            );
                            formik.setFieldValue(
                              "categoryDetails.dueAmount",
                              ""
                            );
                            formik.setFieldValue(
                              "categoryDetails.paidAmount",
                              []
                            );
                          }
                        }}
                        placeholder="Select Visitor Sub Plan"
                        styles={selectStyles}
                        isClearable
                      />
                      {formik.touched.categoryDetails?.subPlan &&
                        formik.errors.categoryDetails?.subPlan && (
                          <div className="text-danger">
                            {formik.errors.categoryDetails?.subPlan}
                          </div>
                        )}
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Plan Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="categoryDetails.amount"
                          value={formik.values.categoryDetails.amount}
                          onChange={formik.handleChange}
                          className="custom-select-height"
                          disabled
                          readOnly
                        />
                        {formik.touched.categoryDetails?.amount &&
                          formik.errors.categoryDetails?.amount && (
                            <div className="text-danger">
                              {formik.errors.categoryDetails?.amount}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Discount</Form.Label>
                        <Form.Control
                          type="text"
                          name="categoryDetails.discount"
                          value={formik.values.categoryDetails.discount}
                          onChange={formik.handleChange}
                          className="custom-select-height"
                          // placeholder="e.g., 10%"
                        />
                        {formik.touched.categoryDetails?.discount &&
                          formik.errors.categoryDetails?.discount && (
                            <div className="text-danger">
                              {formik.errors.categoryDetails?.discount}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Discount Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="categoryDetails.discountAmount"
                          value={formik.values.categoryDetails.discountAmount}
                          onChange={formik.handleChange}
                          className="custom-select-height"
                          placeholder="e.g., 10"
                        />
                        {formik.touched.categoryDetails?.discountAmount &&
                          formik.errors.categoryDetails?.discountAmount && (
                            <div className="text-danger">
                              {formik.errors.categoryDetails?.discountAmount}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Payable Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="categoryDetails.payableAmount"
                          value={formik.values.categoryDetails.payableAmount}
                          onChange={formik.handleChange}
                          className="custom-select-height"
                          disabled
                          readOnly
                        />
                        {formik.touched.categoryDetails?.payableAmount &&
                          formik.errors.categoryDetails?.payableAmount && (
                            <div className="text-danger">
                              {formik.errors.categoryDetails?.payableAmount}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Receive Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="categoryDetails.paidAmount[0].amount"
                          value={
                            formik.values.categoryDetails.paidAmount[0]
                              ?.amount || ""
                          }
                          onChange={(e) =>
                            handlePaidAmountChange(
                              0,
                              "amount",
                              e.target.value,
                              "categoryDetails"
                            )
                          }
                          className="custom-select-height"
                          placeholder="Enter Receive Amount"
                        />
                        {formik.touched.categoryDetails?.paidAmount?.[0]
                          ?.amount &&
                          formik.errors.categoryDetails?.paidAmount?.[0]
                            ?.amount && (
                            <div className="text-danger">
                              {
                                formik.errors.categoryDetails.paidAmount[0]
                                  .amount
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
                          name="categoryDetails.dueAmount"
                          value={formik.values.categoryDetails.dueAmount}
                          onChange={formik.handleChange}
                          className="custom-select-height"
                          disabled
                          readOnly
                        />
                        {formik.touched.categoryDetails?.dueAmount &&
                          formik.errors.categoryDetails?.dueAmount && (
                            <div className="text-danger">
                              {formik.errors.categoryDetails?.dueAmount}
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
                            formik.values.categoryDetails.paidAmount[0]
                              ?.paymentMode
                              ? paymentModeOptions.find(
                                  (option) =>
                                    option.value ===
                                    formik.values.categoryDetails.paidAmount[0]
                                      .paymentMode
                                )
                              : null
                          }
                          onChange={(option) =>
                            handlePaidAmountChange(
                              0,
                              "paymentMode",
                              option ? option.value : "",
                              "categoryDetails"
                            )
                          }
                          placeholder="Select payment mode"
                          styles={selectStyles}
                          isClearable
                        />
                        {formik.touched.categoryDetails?.paidAmount?.[0]
                          ?.paymentMode &&
                          formik.errors.categoryDetails?.paidAmount?.[0]
                            ?.paymentMode && (
                            <div className="text-danger">
                              {
                                formik.errors.categoryDetails.paidAmount[0]
                                  .paymentMode
                              }
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                    {(formik.values.categoryDetails.paidAmount[0]
                      ?.paymentMode === "GPay" ||
                      formik.values.categoryDetails.paidAmount[0]
                        ?.paymentMode === "Bank" ||
                      formik.values.categoryDetails.paidAmount[0]
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
                                  formik.values.categoryDetails.paidAmount[0]
                                    ?.bank
                              ) || null
                            }
                            onChange={(option) =>
                              handlePaidAmountChange(
                                0,
                                "bank",
                                option ? option.value : null,
                                "categoryDetails"
                              )
                            }
                            placeholder="Select bank"
                            styles={selectStyles}
                          />
                          {formik.touched.categoryDetails?.paidAmount?.[0]
                            ?.bank &&
                            formik.errors.categoryDetails?.paidAmount?.[0]
                              ?.bank && (
                              <div className="text-danger">
                                {
                                  formik.errors.categoryDetails.paidAmount[0]
                                    .bank
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                )}
              {!formik?.values?.id && (
                <>
                  <hr />
                  <Col md={6} className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Select
                      options={visitorProcessOptions}
                      value={
                        formik.values.categoryDetails?.type
                          ? visitorProcessOptions.find(
                              (option) =>
                                option.value ===
                                formik.values.categoryDetails.type
                            )
                          : null
                      }
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "categoryDetails.type",
                          selectedOption?.value || ""
                        )
                      }
                      placeholder="Select Category"
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
                    {formik.touched.categoryDetails?.type &&
                      formik.errors.categoryDetails?.type && (
                        <div className="text-danger">
                          {formik.errors.categoryDetails.type}
                        </div>
                      )}
                  </Col>
                  {(formik.values?.categoryDetails?.type === "Renewal" ||
                    formik.values?.categoryDetails?.type === "Refusal") && (
                    <>
                      <Col md={12} className="mb-3">
                        <Form.Label>
                          {formik.values.categoryDetails.type} Details
                        </Form.Label>

                        {formik.values.categoryDetails.entries.map(
                          (entry, index) => (
                            <Row
                              key={index}
                              className="mb-3 border py-2 rounded"
                            >
                              <Col md={6} className="mb-3">
                                <Form.Group>
                                  <Form.Label>Country</Form.Label>
                                  <Select
                                    options={countries?.map((c) => ({
                                      value: c.name,
                                      label: c.name,
                                    }))}
                                    value={
                                      entry.country
                                        ? {
                                            value: entry.country,
                                            label: entry.country,
                                          }
                                        : null
                                    }
                                    onChange={(option) =>
                                      formik.setFieldValue(
                                        `categoryDetails.entries[${index}].country`,
                                        option ? option.value : ""
                                      )
                                    }
                                    placeholder="Select Country"
                                    classNamePrefix="custom-select"
                                    isSearchable
                                  />
                                  {formik.touched.categoryDetails?.entries?.[
                                    index
                                  ]?.country &&
                                    formik.errors.categoryDetails?.entries?.[
                                      index
                                    ]?.country && (
                                      <div className="text-danger">
                                        {
                                          formik.errors.categoryDetails.entries[
                                            index
                                          ].country
                                        }
                                      </div>
                                    )}
                                </Form.Group>
                              </Col>
                              <Col md={6} className="mb-3">
                                <Form.Label>
                                  {formik.values.categoryDetails.type} Date
                                </Form.Label>
                                <div style={{ position: "relative" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="dd/mm/yyyy"
                                    className="custom-select-height"
                                    value={
                                      entry.date
                                        ? formatDate(parseDate(entry.date))
                                        : ""
                                    }
                                    readOnly
                                    onClick={() =>
                                      setShowVisitorProcessRenewalDateCalendar(
                                        (prev) => ({
                                          ...prev,
                                          [index]: !prev[index],
                                        })
                                      )
                                    }
                                    ref={visitorProcessRenewalDateInputRef}
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
                                  {showVisitorProcessRenewalDateCalendar[
                                    index
                                  ] && (
                                    <div
                                      ref={visitorProcessRenewalDateCalendarRef}
                                      style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "0",
                                        zIndex: 9999,
                                        background: "#fff",
                                        boxShadow:
                                          "0 4px 16px rgba(0,0,0,0.15)",
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
                                          formik.setFieldValue(
                                            `categoryDetails.entries[${index}].date`,
                                            toISODate(selectedDate)
                                          );
                                          setShowVisitorProcessRenewalDateCalendar(
                                            (prev) => ({
                                              ...prev,
                                              [index]: false,
                                            })
                                          );
                                        }}
                                        value={
                                          entry.date
                                            ? parseDate(entry.date)
                                            : new Date()
                                        }
                                        locale="en-GB"
                                      />
                                    </div>
                                  )}
                                </div>
                                {formik.touched.categoryDetails?.entries?.[
                                  index
                                ]?.date &&
                                  formik.errors.categoryDetails?.entries?.[
                                    index
                                  ]?.date && (
                                    <div className="text-danger">
                                      {
                                        formik.errors.categoryDetails.entries?.[
                                          index
                                        ]?.date
                                      }
                                    </div>
                                  )}
                              </Col>
                              <Col md={6} className="mb-3">
                                <Form.Label>
                                  Upload {formik.values?.categoryDetails.type}{" "}
                                  Document
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  name="categoryDetails.document"
                                  onChange={(event) =>
                                    formik.setFieldValue(
                                      `categoryDetails.entries[${index}].document`,
                                      event.currentTarget.files[0]
                                    )
                                  }
                                  onBlur={formik.handleBlur}
                                  className="custom-select-height"
                                />
                                {formik.touched.categoryDetails?.entries?.[
                                  index
                                ]?.document &&
                                  formik.errors.categoryDetails?.entries?.[
                                    index
                                  ]?.document && (
                                    <div className="text-danger">
                                      {
                                        formik.errors.categoryDetails.entries?.[
                                          index
                                        ]?.document
                                      }
                                    </div>
                                  )}
                              </Col>
                              <Col md={6} className="mb-3">
                                <Form.Group>
                                  <Form.Label>Remarks</Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    name={`categoryDetails.entries[${index}].remarks`}
                                    value={entry.remarks}
                                    onChange={formik.handleChange}
                                    rows={1}
                                    className="custom-select-height"
                                  />
                                </Form.Group>
                              </Col>
                              {formik.values.categoryDetails.entries.length >
                                1 && (
                                <Col md={12} className="text-end">
                                  <Button
                                    variant="link"
                                    className="p-0"
                                    onClick={() => removeVisitorEntry(index)}
                                  >
                                    <i className="bi bi-trash text-danger"></i>
                                  </Button>
                                </Col>
                              )}
                            </Row>
                          )
                        )}

                        <Row>
                          <Button
                            variant="link"
                            className="d-flex justify-content-end"
                            onClick={addVisitorEntry}
                          >
                            <i className="bi bi-plus-circle fs-4"></i>
                          </Button>
                        </Row>
                      </Col>
                    </>
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

export default VisitorFormModal;
