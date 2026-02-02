import { Fragment, useEffect, useState } from "react";
import { Card, Col, Form, Row, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ALLImages from "../../common/Imagedata";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { adminLogin, adminRequestOTP } from "../../redux/actions/Admin.action";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getAllSetting } from "../../redux/actions/Setting.action";
import { encryptData } from "../../utils/encryptionUtils";
import Axios from "../../api";
import { getAllCrmSettings } from "../../redux/actions/CrmSettings.action";
import { rawMenuItems } from "../../common/Sidemenu";
// import { useGoogleLogin } from "@react-oauth/google";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCredential, setShowCredential] = useState(false);
  const [loginMode, setLoginMode] = useState("password");
  const [loginLogo, setLoginLogo] = useState(ALLImages("logo3"));
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [deviceIP, setDeviceIP] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const code = import.meta.env.VITE_APP_CODE;

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setDeviceIP(data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIP();
  }, []);

  useEffect(() => {
    const currentDomain = window.location.origin;

    const fetchDomainData = async () => {
      const startTime = performance.now();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const res = await Axios.get(
          `https://admin.educacrm.in/api//accounts/get?domain=${currentDomain}&id=`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        const data = res?.data;

        // ✅ Check account validity
        if (data?.data?.code === code && data?.data?.status === "active") {
          const endDate = data?.data?.endDate
            ? new Date(data.data.endDate)
            : null;
          const today = new Date();

          if (endDate && endDate <= today) {
            // expired → inactive
            setAccountStatus("inactive");
          } else {
            setAccountStatus("active");
          }
        } else {
          setAccountStatus("inactive");
        }

        if (data?.data?.companyLogo) {
          setLoginLogo(data.data.companyLogo);
        }
      } catch (error) {
        const duration = performance.now() - startTime;
        console.warn(
          `⚠️ Account API failed or timed out after ${Math.round(duration)} ms`,
          error
        );

        // Fallback → allow login UI
        setAccountStatus("active");
      }
    };

    if (currentDomain) {
      fetchDomainData();
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await dispatch(getAllSetting());
        if (res?.status === 200) {
          const logo = res.data.data[0].loginPageLogo;
          setLoginLogo(`${logo}`);
        }
      } catch (error) {
        console.error("Fetch settings error:", error);
      }
    };
    fetchSettings();

    // Request user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.warn(
            "Unable to retrieve location. Proceeding without location data."
          );
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast.warn("Geolocation is not supported by your browser.");
    }
  }, [dispatch]);

  const fetchAllCrmSettings = async () => {
    try {
      const response = await dispatch(getAllCrmSettings());
      const settings = response?.data?.data?.[0];

      if (settings) {
        const crmCurrency = settings?.crmCurrency;
        const countryCode = settings?.countryCode;

        if (crmCurrency) {
          const encryptedCurrency = encryptData(crmCurrency);
          localStorage.setItem("crmCurrency", encryptedCurrency);
        }

        if (countryCode) {
          const encryptedCountryCode = encryptData(countryCode);
          localStorage.setItem("countryISOCode", encryptedCountryCode);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // Handle successful login response (shared logic for both regular and Google login)
  const handleLoginSuccess = async (res) => {
    if (res?.data?.code === 200) {
      toast.success("Login successfully");
      localStorage.setItem("token", res?.data?.data?.token);
      localStorage.setItem(
        "tokenExpiry",
        encryptData(res?.data?.data?.tokenExpiry)
      );
      localStorage.setItem("userId", encryptData(res?.data?.data?.user?._id));
      localStorage.setItem(
        "role",
        encryptData(res?.data?.data?.user?.role?.name)
      );
      localStorage.setItem(
        "roleId",
        encryptData(res?.data?.data?.user?.role?._id)
      );
      localStorage.setItem(
        "userRole",
        encryptData(
          res?.data?.data?.user?.userRole?.name ||
            res?.data?.data?.user?.role?.name
        )
      );
      localStorage.setItem(
        "userName",
        encryptData(res?.data?.data?.user?.username)
      );
      localStorage.setItem(
        "userType",
        encryptData(res?.data?.data?.user?.userType)
      );
      localStorage.setItem(
        "branchId",
        encryptData(res?.data?.data?.user?.branch?._id)
      );
      localStorage.setItem(
        "rolePermissions",
        encryptData(res?.data?.data?.user?.rolePermissions)
      );
      localStorage.setItem("loginTimestamp", Date.now().toString());

      if (res?.data?.data?.companyLogo) {
        localStorage.setItem("companyLogo", `${res?.data?.data?.companyLogo}`);
      }
      if (res?.data?.data?.user?.role?.name === "Super Admin") {
        window.location.href = `${import.meta.env.BASE_URL}dashboard`;
      } else if (res?.data?.data?.user?.role?.name === "Student") {
        window.location.href = `${
          import.meta.env.BASE_URL
        }student/studentapplication`;
      } else if (res?.data?.data?.user?.role?.name === "LeadStudent") {
        window.location.href = `${import.meta.env.BASE_URL}coursefinder`;
        return;
      }
      if (res?.data?.data?.user?.role?.name === "Student") {
        fetchAllCrmSettings();
        return;
      }

      // Permission-based redirect logic
      const rolePermissions = res?.data?.data?.user?.rolePermissions || [];
      const allowedTabs = [];
      const extractTabs = (tabs) => {
        tabs.forEach((perm) => {
          if (perm.show && perm.tabName)
            allowedTabs.push(perm.tabName.toLowerCase());
          if (perm.children?.length) extractTabs(perm.children);
        });
      };
      extractTabs(rolePermissions);

      if (allowedTabs.length === 0) {
        window.location.href = `${import.meta.env.BASE_URL}nopermission`;
        return;
      }

      const allMenuPaths = [];
      const extractMenuPaths = (menu) => {
        menu.forEach((item) => {
          if (item.title && item.path) {
            allMenuPaths.push({
              title: item.title.toLowerCase().replace(/\s+/g, ""),
              path: item.path,
            });
          }
          if (item.children?.length) extractMenuPaths(item.children);
        });
      };
      extractMenuPaths(rawMenuItems);

      let redirectPath = null;
      for (const tab of allowedTabs) {
        const cleanTab = tab.toLowerCase().replace(/\s+/g, "");
        const match = allMenuPaths.find(
          (m) => cleanTab.includes(m.title) || m.title.includes(cleanTab)
        );
        if (match) {
          redirectPath = match.path;
          break;
        }
      }

      if (redirectPath) {
        window.location.href = redirectPath;
      } else {
        window.location.href = `${import.meta.env.BASE_URL}nopermission`;
      }

      fetchAllCrmSettings();
    } else {
      toast.error(res?.data?.message || "Login failed");
    }
  };

  // Google Login Handler
  const handleGoogleLoginSuccess = async (tokenResponse) => {
    try {
      // Fetch user info from Google
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      const userInfo = await userInfoResponse.json();

      if (!userInfo.email) {
        toast.error("Unable to retrieve email from Google account");
        return;
      }

      if (!userInfo.sub) {
        toast.error("Unable to retrieve Google ID from Google account");
        return;
      }

      // Prepare payload for login API - only sending email and googleId (backend will handle the rest)
      const payload = {
        email: userInfo.email,
        googleId: userInfo.sub,
        location:
          location.latitude && location.longitude ? location : undefined,
        ipAddress: deviceIP || undefined,
      };

      const res = await dispatch(adminLogin(payload));
      await handleLoginSuccess(res);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Google login failed. Please try again."
      );
      console.error("Google Login Error", error);
    }
  };

  // const googleLogin = useGoogleLogin({
  //   onSuccess: handleGoogleLoginSuccess,
  //   onError: (error) => {
  //     console.error("Google Login Error:", error);
  //     toast.error("Google login failed. Please try again.");
  //   },
  // });

  const formik = useFormik({
    initialValues: {
      email: "",
      credential: "", // Single field for password or OTP
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      credential: Yup.string().required("Password or OTP is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      const payload = {
        email: values.email,
        ...(loginMode === "otp"
          ? { otp: values.credential }
          : { password: values.credential }),
        location:
          location.latitude && location.longitude ? location : undefined, // Include location if available
        ipAddress: deviceIP || undefined,
      };

      try {
        const res = await dispatch(adminLogin(payload));
        await handleLoginSuccess(res);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            (loginMode === "otp"
              ? "Invalid or Expired OTP"
              : "Invalid credentials")
        );
        console.error("Login Error", error);
        formik.setFieldValue("credential", "");
      }
    },
  });

  const handleSendOTP = async () => {
    if (!formik.values.email || formik.errors.email) {
      formik.setFieldTouched("email", true);
      return;
    }

    const toastId = toast.loading("OTP is sending...");
    try {
      const res = await dispatch(
        adminRequestOTP({ email: formik.values.email })
      );
      if (res?.data?.code === 200) {
        toast.update(toastId, {
          render: "OTP sent successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        formik.setFieldValue("credential", "");
      } else {
        toast.update(toastId, {
          render: res?.data?.message || "Failed to send OTP",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to send OTP",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("OTP Request Error", error);
    }
  };

  // Inactive Account UI
  const renderInactiveUI = () => (
    <div
      style={{
        backgroundColor: "#EAEDF7", // Light background for the page
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} sm={10}>
            <Card
              className="text-center p-4 shadow-sm"
              style={{
                borderRadius: "15px",
                backgroundColor: "#FFFFFF", // Clean white card background
                border: "none",
              }}
            >
              <Card.Body>
                <div className="text-danger text-primary fs-1 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                </div>
                <Card.Title
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#ff0000ff", // Deep blue for title
                    marginBottom: "15px",
                  }}
                >
                  Your Account is Inactive
                </Card.Title>
                <Card.Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#1A1A1A", // Near-black for body text
                    marginBottom: "25px",
                    lineHeight: "1.6",
                  }}
                >
                  It looks like your account is currently inactive. Please
                  contact our support team to reactivate your account and regain
                  access.
                </Card.Text>
                <Button
                  href="mailto:support@smartxcrm.com"
                  style={{
                    backgroundColor: "#053880", // Deep blue button
                    borderColor: "#053880",
                    fontSize: "16px",
                    fontWeight: "500",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={
                    (e) => (e.target.style.backgroundColor = "#042B66") // Darker blue on hover
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#053880")
                  }
                >
                  Contact Support
                </Button>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#1A1A1A",
                    marginTop: "20px",
                  }}
                >
                  📞 Need help? Reach out at{" "}
                  <a
                    href="mailto:support@smartxcrm.com"
                    style={{
                      color: "#053880",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    support@smartxcrm.com
                  </a>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );

  // Active Account UI (Original Login UI)
  const renderActiveUI = () => (
    <div className="page main-signin-wrapper">
      <Row className="signpages text-center align-items-center">
        <Col md={12}>
          <Card className="mb-0 shadow-lg border-0">
            <Row className="row-sm">
              <Col
                lg={6}
                xl={5}
                className="d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5"
                style={{ backgroundColor: "#edf2f5" }}
              >
                <div className="text-center d-flex flex-column align-items-center">
                  <img
                    src={loginLogo || ALLImages("logo3")}
                    className="header-brand-img mb-4"
                    alt="logo"
                    style={{ height: "100px", width: "auto" }}
                  />
                  {/* {accountData?.data?.companyName && (
                    <h5 className="fw-bold text-black">
                      Welcome to {accountData.data.companyName}
                    </h5>
                  )} */}
                  <img
                    src={ALLImages("svg12")}
                    className="ht-100 mb-4"
                    alt="user"
                  />
                  <h5 className="fw-bold text-black">Welcome Back!</h5>
                  <p className="text-white-50 fs-14 text-black">
                    Manage your leads, sales, and customer relationships with
                    SmartX CRM.
                  </p>
                </div>
              </Col>

              <Col
                lg={6}
                xl={7}
                xs={12}
                sm={12}
                className="login_form d-flex align-items-center"
              >
                <div className="w-100 px-4 py-5">
                  <Card.Body className="px-0">
                    <div className="d-lg-none mb-4">
                      <img
                        src={loginLogo || ALLImages("logo3")}
                        className="me-2"
                        alt="logo-light"
                        style={{ height: "70px", width: "auto" }}
                      />
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                      <h4 className="mb-2 text-start fw-semibold">
                        Sign in to Your Account
                      </h4>
                      <p className="text-muted text-start mb-4 fs-14">
                        Connect with the global community
                      </p>

                      <Form.Group className="mb-3 text-start">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="text"
                          name="email"
                          placeholder="Enter your email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="custom-select-height py-2 rounded-pill"
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="text-danger">
                            {formik.errors.email}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3 text-start">
                        <Form.Label>Password or OTP</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={
                              showCredential
                                ? "text"
                                : loginMode === "otp"
                                ? "text"
                                : "password"
                            }
                            name="credential"
                            placeholder="Enter your password or OTP"
                            value={formik.values.credential}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="custom-select-height py-2 rounded-pill"
                          />
                          <span
                            onClick={() => setShowCredential(!showCredential)}
                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                            style={{ cursor: "pointer" }}
                          >
                            {showCredential ? (
                              <Visibility sx={{ fontSize: 18 }} />
                            ) : (
                              <VisibilityOff sx={{ fontSize: 18 }} />
                            )}
                          </span>
                        </div>
                        {formik.touched.credential &&
                          formik.errors.credential && (
                            <div className="text-danger">
                              {formik.errors.credential}
                            </div>
                          )}
                        <div className="mt-2">
                          <Button
                            variant="link"
                            className="fs-13 text-primary p-0"
                            onClick={() => {
                              handleSendOTP();
                              setLoginMode("otp");
                            }}
                          >
                            Send OTP
                          </Button>
                        </div>
                      </Form.Group>

                      <div className="d-grid mb-3">
                        <Button
                          type="submit"
                          variant="primary"
                          className="py-2"
                          style={{ borderRadius: "30px" }}
                        >
                          Sign In
                        </Button>
                      </div>

                      {/* <div className="text-center mb-3">
                        <span className="text-muted">or</span>
                      </div>

                      <div className="d-grid mb-3">
                        <Button
                          type="button"
                          variant="outline-danger"
                          className="py-2 d-flex align-items-center justify-content-center"
                          style={{ borderRadius: "30px" }}
                          onClick={() => googleLogin()}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="me-2"
                          >
                            <path
                              d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z"
                              fill="#4285F4"
                            />
                            <path
                              d="M9 18C11.43 18 13.467 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65454 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
                              fill="#34A853"
                            />
                            <path
                              d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40681 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65454 3.57955 9 3.57955Z"
                              fill="#EA4335"
                            />
                          </svg>
                          Sign in with Google
                        </Button>
                      </div> */}
                    </form>
                    <p className="text-white-50 fs-14 text-black">
                      📞 Need help? Contact{" "}
                      <a href="mailto:support@smartxcrm.com">
                        support@smartxcrm.com
                      </a>
                    </p>
                    <div className="d-grid">
                      <div>
                        Are you a student?{" "}
                        <Link to={`${import.meta.env.BASE_URL}signup`}>
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <Fragment>
      {accountStatus === null ? (
        <div></div>
      ) : accountStatus === "active" ? (
        renderActiveUI()
      ) : (
        renderInactiveUI()
      )}
    </Fragment>
  );
};

export default Signin;
