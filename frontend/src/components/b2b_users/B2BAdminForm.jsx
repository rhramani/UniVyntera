import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  cityDropdown,
  countryDropdown,
  stateDropdown,
} from "../../redux/actions/Master/Institute.action";
import { createB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Confetti from "react-confetti";
import logo from "../../assets/images/brand-logos/sidebar_logo1.png";
import CreatableSelect from "react-select/creatable";

const B2BAdminForm = () => {
  const [countries, setCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [checkPreview, setCheckPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const handleCountryChange = async (countryIsoCode) => {
    try {
      formik.setFieldValue("country", countryIsoCode);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
      setStateDropDown([]);
      setCityDropDownList([]);

      const res = await dispatch(stateDropdown(countryIsoCode));
      const data = res?.data?.data;
      setStateDropDown(data || []);
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
      const data = res?.data?.data;
      setCityDropDownList(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      contactPerson: "",
      phone: "",
      email: "",
      password: "",
      country: "",
      state: "",
      city: "",
      memberLimit: 5,
      status: "Inactive",
      logo: "",
      websiteUrl: "",
      GST_VAT: "",
      bankName: "",
      branch: "",
      accountNumber: "",
      ifscCode: "",
      cancelCheque: "",
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Company Name is required"),
      contactPerson: Yup.string(),
      phone: Yup.string().required("Phone is required"),
      email: Yup.string().required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      country: Yup.string(),
      state: Yup.string(),
      city: Yup.string().required("City is required"),
      memberLimit: Yup.number(),
      status: Yup.string(),
      logo: Yup.string(),
      websiteUrl: Yup.string(),
      GST_VAT: Yup.string().required("GST/VAT is required"),
      bankName: Yup.string(),
      branch: Yup.string(),
      accountNumber: Yup.string(),
      ifscCode: Yup.string(),
      cancelCheque: Yup.string(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      try {
        toast.dismiss();
        const selectedCountry = countries.find(
          (c) => c.isoCode === values.country
        );
        const selectedState = stateDropDown.find(
          (s) => s.isoCode === values.state
        );

        const formattedValues = {
          ...values,
          country: selectedCountry?.name || values.country,
          state: selectedState?.name || values.state,
          city: values.city,
        };

        const payload = new FormData();
        Object.entries(formattedValues).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            key !== "logo" &&
            key !== "cancelCheque"
          ) {
            payload.append(key, value);
          }
        });

        if (formattedValues.logo && typeof formattedValues.logo === "object") {
          payload.append("logo", formattedValues.logo);
        }
        if (
          formattedValues.cancelCheque &&
          typeof formattedValues.cancelCheque === "object"
        ) {
          payload.append("cancelCheque", formattedValues.cancelCheque);
        }

        const res = await dispatch(createB2BAdmin(payload));
        if (res?.data?.code === 201) {
          toast.success("Form submitted successfully");
          resetForm();
          setProfilePreview(null);
          setCheckPreview(null);
          setIsSubmitted(true);
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Failed to submit form";
        if (errorMessage.includes("No token provided")) {
          toast.error("Please log in to submit the form");
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

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
              sx={{ width: "100%", fontSize: 60, color: "#28a745", marginBottom: "20px" }}
            />
            <h4 className="thank-you-title">Thank You!</h4>
            <p className="thank-you-message">
              Your form has been successfully submitted. We'll get back to you
              soon.
            </p>
            <Button
              className="thank-you-btn"
              onClick={() => {
                setIsSubmitted(false);
                formik.resetForm();
              }}
            >
              Submit Another Form
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="b2b-admin-form-container">
      <div className="logo-container mb-4">
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

      <Card className="b2b-admin-card">
        <Card.Header className="b2b-card-header">
          <h4 className="form-card-title">Create New Account</h4>
        </Card.Header>
        <Card.Body>
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <Form onSubmit={formik.handleSubmit}>
            <Row className="g-4">
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">
                    Company Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Company Name"
                    name="companyName"
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`rounded-30 ${
                      formik.touched.companyName && formik.errors.companyName
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <div className="invalid-feedback">
                      {formik.errors.companyName}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">
                    Contact Person
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="contactPerson"
                    className="rounded-30"
                    placeholder="Enter Contact Person"
                    value={formik.values.contactPerson}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">Phone</Form.Label>
                  <PhoneInput
                    country={"in"}
                    value={formik.values.phone}
                    onChange={(phone, data) => {
                      const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                      const formattedPhone = `${dialCode} ${phone.replace(
                        data.dialCode,
                        ""
                      )}`.trim();
                      formik.setFieldValue("phone", formattedPhone);
                    }}
                    onBlur={formik.handleBlur}
                    inputProps={{
                      name: "phone",
                      required: true,
                      className: "b2b-form-control",
                    }}
                    inputStyle={{
                      width: "100%",
                      paddingLeft: "65px",
                      borderRadius: "30px",
                    }}
                    buttonStyle={{
                      borderRadius: "8px 0 0 8px",
                    }}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.phone}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">
                    Company Logo
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="logo"
                    className="rounded-30"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("logo", file);
                      setProfilePreview(URL.createObjectURL(file));
                    }}
                  />
                  {profilePreview && (
                    <div className="image-preview">
                      <img src={profilePreview} alt="Logo Preview" />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`rounded-30 ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-30"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: 18 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 18 }} />
                      )}
                    </span>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.password}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">Country</Form.Label>
                  <Select
                    options={countries?.map((c) => ({
                      value: c.isoCode,
                      label: c.name,
                    }))}
                    value={countries
                      ?.map((c) => ({ value: c.isoCode, label: c.name }))
                      .filter((o) => o.value === formik.values.country)}
                    onChange={(option) => {
                      const selectedOption = Array.isArray(option)
                        ? option[0]
                        : option;
                      const isValid = countries?.some(
                        (c) => c.isoCode === selectedOption?.value
                      );
                      if (isValid) {
                        handleCountryChange(selectedOption.value);
                        formik.setFieldValue("country", selectedOption.value);
                        formik.setFieldError("country", "");
                      } else {
                        formik.setFieldValue("country", "");
                      }
                    }}
                    placeholder="Select Country"
                    isClearable
                    className={
                      formik.touched.country && formik.errors.country
                        ? "is-invalid"
                        : ""
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "30px",
                        borderColor:
                          formik.touched.country && formik.errors.country
                            ? "#dc3545"
                            : base.borderColor,
                        "&:hover": { borderColor: "#0052cc" },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#6c757d",
                        fontSize: "0.9rem",
                      }),
                      option: (base) => ({
                        ...base,
                        fontSize: "0.9rem",
                      }),
                    }}
                  />
                  {formik.touched.country && formik.errors.country && (
                    <div className="invalid-feedback">
                      {formik.errors.country}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">State</Form.Label>
                  <Select
                    options={stateDropDown?.map((state) => ({
                      value: state.isoCode,
                      label: state.name,
                    }))}
                    value={
                      formik.values.state
                        ? stateDropDown
                            ?.map((state) => ({
                              value: state.isoCode,
                              label: state.name,
                            }))
                            .filter((s) => s.value === formik.values.state)
                        : []
                    }
                    onChange={(option) => {
                      const selectedOption = Array.isArray(option)
                        ? option[0]
                        : option;
                      const isValid = stateDropDown?.some(
                        (s) => s.isoCode === selectedOption?.value
                      );
                      if (isValid) {
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
                    isDisabled={!formik.values.country}
                    className={
                      formik.touched.state && formik.errors.state
                        ? "is-invalid"
                        : ""
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "30px",
                        borderColor:
                          formik.touched.state && formik.errors.state
                            ? "#dc3545"
                            : base.borderColor,
                        "&:hover": { borderColor: "#0052cc" },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#6c757d",
                        fontSize: "0.9rem",
                      }),
                      option: (base) => ({
                        ...base,
                        fontSize: "0.9rem",
                      }),
                    }}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <div className="invalid-feedback">
                      {formik.errors.state}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">City</Form.Label>
                  <CreatableSelect
                    options={cityDropDownList?.map((city) => ({
                      value: typeof city === "string" ? city : city.name,
                      label: typeof city === "string" ? city : city.name,
                    }))}
                    value={
                      formik.values.city
                        ? [
                            {
                              value: formik.values.city,
                              label: formik.values.city,
                            },
                          ]
                        : []
                    }
                    onChange={(selectedOption) => {
                      const selected = Array.isArray(selectedOption)
                        ? selectedOption[0]
                        : selectedOption;
                      const cityName = selected?.value || "";
                      formik.setFieldValue("city", cityName);
                      formik.setFieldError("city", "");
                      const isValid = cityDropDownList?.some((c) => {
                        const name = typeof c === "string" ? c : c.name;
                        return name === cityName;
                      });
                      if (isValid) {
                        formik.setFieldValue("city", cityName);
                        formik.setFieldError("city", "");
                      } else {
                        formik.setFieldValue("city", "");
                      }
                    }}
                    onCreateOption={(inputValue) => {
                      formik.setFieldValue("city", inputValue);
                      formik.setFieldError("city", "");
                    }}
                    placeholder="Select City"
                    isClearable
                    isSearchable
                    isDisabled={!formik.values.state}
                    noOptionsMessage={() => "No cities available"}
                    className={
                      formik.touched.city && formik.errors.city
                        ? "is-invalid"
                        : ""
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "30px",
                        borderColor:
                          formik.touched.city && formik.errors.city
                            ? "#dc3545"
                            : base.borderColor,
                        "&:hover": { borderColor: "#0052cc" },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#6c757d",
                        fontSize: "0.9rem",
                      }),
                      option: (base) => ({
                        ...base,
                        fontSize: "0.9rem",
                      }),
                    }}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="invalid-feedback">{formik.errors.city}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">
                    Website URL
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="websiteUrl"
                    className="rounded-30"
                    placeholder="Enter Website URL"
                    value={formik.values.websiteUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group>
                  <Form.Label className="b2b-form-label">GST/VAT</Form.Label>
                  <Form.Control
                    type="text"
                    name="GST_VAT"
                    placeholder="Enter GST/VAT"
                    value={formik.values.GST_VAT}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`rounded-30 ${
                      formik.touched.GST_VAT && formik.errors.GST_VAT
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  {formik.touched.GST_VAT && formik.errors.GST_VAT && (
                    <div className="invalid-feedback">
                      {formik.errors.GST_VAT}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="account-details-section">
              <h5 className="account-details-toggle">Account Details</h5>
              <div className="account-details-content">
                <Row className="g-4">
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="b2b-form-label">
                        Bank Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="bankName"
                        className="rounded-30"
                        placeholder="Enter Bank Name"
                        value={formik.values.bankName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="b2b-form-label">
                        Account Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="accountNumber"
                        className="rounded-30"
                        placeholder="Enter Account Number"
                        value={formik.values.accountNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="b2b-form-label">
                        Branch Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="branch"
                        className="rounded-30"
                        placeholder="Enter Branch Address"
                        value={formik.values.branch}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={5}>
                    <Form.Group>
                      <Form.Label className="b2b-form-label">
                        IFSC/SWIFT Code (IFSC for India, SWIFT for Other Countries)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="ifscCode"
                        className="rounded-30"
                        placeholder="Enter IFSC Code"
                        value={formik.values.ifscCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} lg={4}>
                    <Form.Group>
                      <Form.Label className="b2b-form-label">
                        Cancelled Cheque
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="cancelCheque"
                        className="rounded-30"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue("cancelCheque", file);
                          setCheckPreview(URL.createObjectURL(file));
                        }}
                        onBlur={formik.handleBlur}
                      />
                      {checkPreview && (
                        <div className="image-preview">
                          <img src={checkPreview} alt="Cheque Preview" />
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="text-end mt-4">
              <Button type="submit" className="submit-btn">
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default B2BAdminForm;
