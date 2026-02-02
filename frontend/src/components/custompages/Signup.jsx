import { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ALLImages from "../../common/Imagedata";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { adminRegister } from "../../redux/actions/Admin.action";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import {
  cityDropdown,
  countryDropdown,
  stateDropdown,
} from "../../redux/actions/Master/Institute.action";
import Select from "react-select";
import { getAllInquiry } from "../../redux/actions/Lead/Inquiry.action";
import { addLead } from "../../redux/actions/Lead.action";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showCredential, setShowCredential] = useState(false);
  const [countries, setCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [allInquiry, setAllInquiry] = useState([]);

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchInquirys = async () => {
    try {
      const res = await dispatch(getAllInquiry(1, 1000));
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

  useEffect(() => {
    if (allInquiry?.length > 0) {
      const studentVisa = allInquiry.find(
        (item) => item.name === "Student Visa"
      );

      if (studentVisa) {
        formik.setFieldValue("inquiry_for", studentVisa._id);
      }
    }
  }, [allInquiry]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Contact number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password id required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    inquiry_for: Yup.string().required("Inquiry type is required"),
    country_interested: Yup.array().min(1, "Select at least one country"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      country: "",
      state: "",
      city: "",
      inquiry_for: null,
      country_interested: [],
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
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

        const res = await dispatch(addLead(formattedValues));

        if (res?.data?.code === 201) {
          navigate(`${import.meta.env.BASE_URL}`);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    },
  });

  const handleCountryChange = async (countryIsoCode) => {
    try {
      formik.setFieldValue("country", countryIsoCode);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
      setStateDropDown([]);
      setCityDropDownList([]);
      const selectedCountry = countries.find(
        (c) => c.isoCode === countryIsoCode
      );

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

  return (
    <Fragment>
      <div className="page main-signin-wrapper min-vh-100 d-flex align-items-center">
        {/* <!-- Start::row-1 --> */}
        <Row className="signpages text-center align-items-center">
          <Col md={12}>
            <Card className="mb-0 shadow-lg border-0">
              <Row className="g-0">
                <Col
                  xs={12}
                  className="d-flex flex-column align-items-center justify-content-center text-center py-4"
                  style={{ backgroundColor: "#edf2f5" }}
                >
                  <img
                    src={ALLImages("logo3")}
                    className="header-brand-img mb-3"
                    style={{ maxWidth: "500px" }}
                    alt="logo"
                  />
                  {/* <div className="clearfix"></div> */}
                  {/* <img
                    src={ALLImages("svg12")}
                    className="ht-100 mb-0"
                    alt="user"
                  /> */}
                  {/* <h5 className="fw-bold text-black mt-4">
                    Signup Your Account
                  </h5>
                  <span className="text-white-50 fs-14 text-black">
                    Signup to create, discover and connect with the global
                    community
                  </span> */}
                </Col>
              </Row>
              <Row className="g-0 h-100 text-start">
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-center"
                >
                  <div
                    className="w-100 px-4"
                    style={{ maxHeight: "100%", overflow: "hidden" }}
                  >
                    <Row className="row-sm">
                      <Card.Body className="px-0">
                        <img
                          src={ALLImages("logo3")}
                          className="d-lg-none header-brand-img text-start float-start mb-4 error-logo-light"
                          alt="logo"
                        />
                        <img
                          src={ALLImages("logo3")}
                          className=" d-lg-none header-brand-img text-start float-start mb-4 error-logo"
                          alt="logo"
                        />
                        <div className="clearfix"></div>
                        <h5 className="mb-2 text-start fw-semibold">Sign Up</h5>
                        <p className="text-muted text-start mb-4 fs-14">
                          {/* It's free to signup and only takes a minute. */}
                          Register as a student to get started.
                        </p>
                        <Form onSubmit={formik.handleSubmit}>
                          <Row className="mb-3 mt-0">
                            <Col sm={12} md={6} lg={4} className="mb-3">
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                placeholder="Enter your name"
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="custom-select-height"
                              />
                              {formik.touched.name && formik.errors.name && (
                                <Form.Text className="text-danger">
                                  {formik.errors.name}
                                </Form.Text>
                              )}
                            </Col>
                            <Col sm={12} md={6} lg={4} className="mb-3">
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                placeholder="Enter your email"
                                type="text"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="custom-select-height"
                              />
                              {formik.touched.email && formik.errors.email && (
                                <Form.Text className="text-danger">
                                  {formik.errors.email}
                                </Form.Text>
                              )}
                            </Col>
                            <Col sm={12} md={6} lg={4} className="mb-3">
                              <Form.Label>Password</Form.Label>
                              <div className="position-relative">
                                <Form.Control
                                  type={showCredential ? "text" : "password"}
                                  name="password"
                                  placeholder="Enter your password"
                                  value={formik.values.password}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="custom-select-height py-2 rounded-pill"
                                />
                                <span
                                  onClick={() =>
                                    setShowCredential(!showCredential)
                                  }
                                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                  style={{ cursor: "pointer" }}
                                >
                                  {showCredential ? (
                                    <VisibilityOff sx={{ fontSize: 18 }} />
                                  ) : (
                                    <Visibility sx={{ fontSize: 18 }} />
                                  )}
                                </span>
                              </div>
                              {formik.touched.password &&
                                formik.errors.password && (
                                  <Form.Text className="text-danger">
                                    {formik.errors.password}
                                  </Form.Text>
                                )}
                            </Col>
                            <Col sm={12} md={6} lg={4} className="mb-3">
                              <Form.Label>Phone Number</Form.Label>
                              <PhoneInput
                                country={"in"}
                                value={formik.values.phone || ""}
                                onChange={(phone, data) => {
                                  if (!phone || phone === data.dialCode) {
                                    formik.setFieldValue("phone", "");
                                  } else {
                                    const dialCode = data.dialCode
                                      ? `+${data.dialCode}`
                                      : "";
                                    const formattedPhone =
                                      `${dialCode} ${phone.replace(
                                        data.dialCode,
                                        ""
                                      )}`.trim();
                                    formik.setFieldValue(
                                      "phone",
                                      formattedPhone
                                    );
                                  }
                                }}
                                inputProps={{
                                  name: "phone",
                                  required: true,
                                  className:
                                    "form-control custom-select-height",
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
                              {formik?.touched?.phone &&
                                formik.errors.phone && (
                                  <div className="text-danger">
                                    {formik.errors.phone}
                                  </div>
                                )}
                            </Col>
                            <Col sm={12} md={6} lg={4} className="mb-3">
                              <Form.Label>Country</Form.Label>
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
                                    .filter(
                                      (o) => o.value === formik.values.country
                                    )[0]
                                }
                                onChange={(selectedOption) => {
                                  if (selectedOption) {
                                    handleCountryChange(selectedOption.value);
                                    formik.setFieldValue(
                                      "country",
                                      selectedOption.value
                                    );
                                    formik.setFieldError("country", "");
                                  } else {
                                    formik.setFieldValue("country", "");
                                  }
                                }}
                                placeholder="Select Country"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
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
                              {formik.touched.country &&
                                formik.errors.country && (
                                  <Form.Text className="text-danger">
                                    {formik.errors.country}
                                  </Form.Text>
                                )}
                            </Col>
                            <Col sm={12} md={6} lg={4} className="mb-3">
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
                                    .filter(
                                      (s) => s.value === formik.values.state
                                    )[0]
                                }
                                onChange={(selectedOption) => {
                                  if (selectedOption) {
                                    formik.setFieldValue(
                                      "state",
                                      selectedOption.value
                                    );
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
                                isSearchable
                                isDisabled={!formik.values.country}
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    borderRadius: "30px",
                                    color: state.isDisabled
                                      ? "#6c757d"
                                      : "black",
                                    backgroundColor: state.isDisabled
                                      ? "#e9ecef"
                                      : "white",
                                    cursor: state.isDisabled
                                      ? "not-allowed"
                                      : "pointer",
                                  }),
                                  placeholder: (base, state) => ({
                                    ...base,
                                    color: state.isDisabled
                                      ? "#6c757d"
                                      : "black",
                                    fontSize: "13px",
                                  }),
                                  singleValue: (base, state) => ({
                                    ...base,
                                    color: state.isDisabled
                                      ? "#6c757d"
                                      : "black",
                                  }),
                                }}
                              />
                              {formik?.touched?.state &&
                                formik.errors.state && (
                                  <div className="text-danger">
                                    {formik.errors.state}
                                  </div>
                                )}
                            </Col>
                            <Col sm={12} md={6} lg={4} className="mb-3">
                              <Form.Label>Select City</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={cityDropDownList?.map((city) => {
                                  const name =
                                    typeof city === "string" ? city : city.name;
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
                                    formik.setFieldValue(
                                      "city",
                                      selectedOption.value
                                    );
                                    formik.setFieldError("city", "");
                                  } else {
                                    formik.setFieldValue("city", "");
                                  }
                                }}
                                placeholder="Select City"
                                isClearable
                                isSearchable
                                isDisabled={!formik.values.state}
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    borderRadius: "30px",
                                    color: state.isDisabled
                                      ? "#6c757d"
                                      : "black",
                                    backgroundColor: state.isDisabled
                                      ? "#e9ecef"
                                      : "white",
                                    cursor: state.isDisabled
                                      ? "not-allowed"
                                      : "pointer",
                                  }),
                                  placeholder: (base, state) => ({
                                    ...base,
                                    color: state.isDisabled
                                      ? "#6c757d"
                                      : "black",
                                    fontSize: "13px",
                                  }),
                                  singleValue: (base, state) => ({
                                    ...base,
                                    color: state.isDisabled
                                      ? "#6c757d"
                                      : "black",
                                  }),
                                }}
                              />

                              {formik?.touched?.city && formik.errors.city && (
                                <div className="text-danger">
                                  {formik.errors.city}
                                </div>
                              )}
                            </Col>
                            <Col sm={12} md={6} lg={4} className="mb-3">
                              <Form.Label>Inquiry For *</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={allInquiry?.map((type) => ({
                                  value: type._id,
                                  label: type.name,
                                }))}
                                value={
                                  formik.values.inquiry_for
                                    ? {
                                        value: formik.values.inquiry_for,
                                        label:
                                          allInquiry?.find(
                                            (type) =>
                                              type._id ===
                                              formik.values.inquiry_for
                                          )?.name || "",
                                      }
                                    : null
                                }
                                onChange={(selectedOption) => {
                                  formik.setFieldValue(
                                    "inquiry_for",
                                    selectedOption ? selectedOption.value : ""
                                  );
                                }}
                                placeholder="Select Inquiry Type"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                noOptionsMessage={() =>
                                  "No inquiry types available"
                                }
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
                              {formik?.touched.inquiry_for &&
                                formik?.errors.inquiry_for && (
                                  <div className="text-danger">
                                    {formik?.errors.inquiry_for}
                                  </div>
                                )}
                            </Col>
                            <Col sm={12} md={6} lg={4} className="mb-3">
                              <Form.Label>Preferred Country</Form.Label>
                              <Select
                                options={countries?.map((c) => ({
                                  value: c.name,
                                  label: c.name,
                                }))}
                                value={
                                  formik.values.country_interested
                                    ? (Array.isArray(
                                        formik.values.country_interested
                                      )
                                        ? formik.values.country_interested
                                        : [formik.values.country_interested]
                                      ).map((country) => ({
                                        value: country,
                                        label: country,
                                      }))
                                    : []
                                }
                                onChange={(selectedOptions) => {
                                  const selected = selectedOptions || [];
                                  const selectedValues = selected.map(
                                    (opt) => opt.value
                                  );
                                  formik.setFieldValue(
                                    "country_interested",
                                    selectedValues
                                  );
                                }}
                                placeholder="Select Country"
                                isClearable
                                isSearchable
                                isMulti
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                noOptionsMessage={() =>
                                  "No countries available"
                                }
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
                              {formik?.touched.country_interested &&
                                formik?.errors.country_interested && (
                                  <div className="text-danger">
                                    {formik?.errors.country_interested}
                                  </div>
                                )}
                            </Col>
                          </Row>
                          <div className="d-grid">
                            <div className="d-grid">
                              <Button
                                variant="primary"
                                className="custom-select-height"
                                type="submit"
                              >
                                Sign Up
                              </Button>
                            </div>
                          </div>
                          <div className="d-grid mt-3">
                            <p className="mb-0">
                              Already have an account?{" "}
                              <Link to={import.meta.env.BASE_URL}>Sign In</Link>
                            </p>
                          </div>
                        </Form>
                      </Card.Body>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {/* <!-- End::row-1 --> */}
      </div>
    </Fragment>
  );
};

export default Signup;
