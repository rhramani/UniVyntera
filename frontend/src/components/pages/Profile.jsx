import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Tab,
  Nav,
  Dropdown,
  Form,
  Button,
  Col,
  Row,
  FormGroup,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { Languageoptions, TimeZoneData } from "../../common/Select2data";
import Pageheader from "./../../layouts/Pageheader";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ALLImages from "../../common/Imagedata";
import { useDispatch } from "react-redux";
import {
  getOneB2BAdmin,
  updateB2BAdmin,
} from "../../redux/actions/B2BAdmin.action";
import { REACT_APP_API_URL } from "../../baseUrl";
import { useFormik } from "formik";
import {
  cityDropdown,
  countryDropdown,
  stateDropdown,
} from "../../redux/actions/Master/Institute.action";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  adminGetOne,
  adminRequestOTP,
  adminUpdate,
} from "../../redux/actions/Admin.action";
import { decryptData } from "../../utils/encryptionUtils";
import {
  getB2BMemberById,
  updateB2BMember,
} from "../../redux/actions/B2BMember.action";
import { getOneBranch, updateBranch } from "../../redux/actions/Branch.action";
import {
  getBranchMemberById,
  updateBranchMember,
} from "../../redux/actions/BranchMember.action";
import {
  getAllCoachingFaculty,
  getOneCoachingFaculty,
  updateCoachingFaculty,
} from "../../redux/actions/Master/CoachingFaculty.action";
import {
  getOneStudentApplication,
  updateStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [checkPreview, setCheckPreview] = useState(null);
  const [b2BAdminData, setB2BAdminData] = useState({});
  const [b2bMemberData, setB2BMemberData] = useState({});
  const [adminData, setAdminData] = useState({});
  const [branchLoginData, setbranchLoginData] = useState({});
  const [branchMemberLoginData, setbranchMemberLoginData] = useState({});
  const [coachingFaculty, setCoachingFaculty] = useState({});
  const [oneStudent, setOneStudent] = useState({});
  const [useOTP, setUseOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const id = decryptData(localStorage.getItem("userId"));
  const userRole = decryptData(localStorage.getItem("role"));

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

      if (countryIsoCode) {
        const res = await dispatch(stateDropdown(countryIsoCode));
        const data = res?.data?.data;
        setStateDropDown(data || []);
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

      if (countryIsoCode && stateIsoCode) {
        const res = await dispatch(cityDropdown(countryIsoCode, stateIsoCode));
        const data = res?.data?.data;
        setCityDropDownList(data || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const fetchB2BAdmin = async () => {
    try {
      const res = await dispatch(getOneB2BAdmin(id));
      setB2BAdminData(res?.data?.data || {});
    } catch (err) {
      toast.error("Failed to fetch B2B Admin data");
    }
  };

  const fetchB2BMember = async () => {
    try {
      const res = await dispatch(getB2BMemberById(id));
      setB2BMemberData(res?.data?.data || {});
    } catch (err) {
      toast.error("Failed to fetch B2B Admin data");
    }
  };

  const fetchAdmin = async () => {
    try {
      const res = await dispatch(adminGetOne(id));
      setAdminData(res?.data?.data || {});
    } catch (err) {
      console.error("Admin fetch error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch Admin data");
    }
  };
  const fetchBranch = async () => {
    try {
      const res = await dispatch(getOneBranch(id));
      setbranchLoginData(res?.data?.data || {});
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch Branch data");
    }
  };
  const fetchBranchMember = async () => {
    try {
      const res = await dispatch(getBranchMemberById(id));
      setbranchMemberLoginData(res?.data?.data || {});
    } catch (err) {
      console.error("branchMemberLoginData fetch error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch Branch Member data");
    }
  };
  const fetchCoachingFaculty = async () => {
    try {
      const res = await dispatch(getOneCoachingFaculty(id));
      setCoachingFaculty(res?.data?.data || {});
    } catch (err) {
      console.error("coachingFaculty fetch error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch Coaching Faculty data");
    }
  };

  const fetchOneStudent = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setOneStudent(res?.data?.data || {});
    } catch (err) {
      console.error("OneStudent fetch error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch Student data");
    }
  };

  useEffect(() => {
    if (userRole === "b2bAdmin" || userRole === "B2B Admin") {
      fetchB2BAdmin();
    } else if (userRole === "b2bMember" || userRole === "B2B Member") {
      fetchB2BMember();
    } else if (userRole === "Branch") {
      fetchBranch();
    } else if (userRole === "Branch Member") {
      fetchBranchMember();
    } else if (userRole === "Coaching Faculty") {
      fetchCoachingFaculty();
    } else if (userRole === "Student") {
      fetchOneStudent();
    } else {
      fetchAdmin();
    }
    fetchCountries();
  }, [userRole]);

  useEffect(() => {
    if (
      (userRole === "b2bAdmin" || userRole === "B2B Admin") &&
      b2BAdminData?.country &&
      !stateDropDown.length
    ) {
      const countryObj = countries.find((c) => c.name === b2BAdminData.country);
      const isoCode = countryObj ? countryObj.isoCode : b2BAdminData.country;
      handleCountryChange(isoCode);
    }
  }, [b2BAdminData?.country, stateDropDown.length, countries]);

  // const validationSchema = Yup.object({
  //   currentPassword: Yup.string().when([], {
  //     is: () => !useOTP,
  //     then: () => Yup.string().required("Current password is required"),
  //     otherwise: Yup.string(),
  //   }),
  //   newPassword: Yup.string()
  //     .min(6, "Password must be at least 6 characters")
  //     .required("New password is required"),
  //   confirmPassword: Yup.string()
  //     .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
  //     .required("Confirm password is required"),
  //   otp: Yup.string().when([], {
  //     is: () => useOTP && otpSent,
  //     then: () => Yup.string().required("OTP is required"),
  //     otherwise: Yup.string(),
  //   }),
  // });
  const [originalValues, setOriginalValues] = useState({});

  const getChangedFields = (original, current) => {
    const changed = {};
    Object.keys(current).forEach((key) => {
      if (
        (original[key] instanceof File &&
          current[key] instanceof File &&
          original[key] !== current[key]) ||
        (original[key] !== current[key] && !(original[key] instanceof File))
      ) {
        changed[key] = current[key];
      }
    });
    return changed;
  };

  const isFormChanged = () => {
    const changedFields = getChangedFields(originalValues, formik.values);
    return Object.keys(changedFields).length > 0;
  };

  const formik = useFormik({
    initialValues: {
      companyName: "",
      contactPerson: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      otp: "",
      // password: "",
      country: "",
      state: "",
      city: "",
      phone: "",
      contact: "",
      email: "",
      commission: 0,
      // memberLimit: 0,
      // status: "Active",
      websiteUrl: "",
      b2bAssignRole: "",
      assignTeam: "",
      bankName: "",
      branch: "",
      accountNumber: "",
      ifscCode: "",
      profileImage: "",
      cancelCheque: "",

      // Admin-specific fields
      name: "",

      batchTime: [],
      batchStatus: "",
    },
    // validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        // const payload = new FormData();
        const changedFields = getChangedFields(originalValues, values);

        if (userRole === "b2bAdmin" || userRole === "B2B Admin") {
          const payload = new FormData();
          const b2bFields = [
            "companyName",
            "contactPerson",
            "phone",
            "email",
            "country",
            "state",
            "city",
            "websiteUrl",
            "bankName",
            "branch",
            "accountNumber",
            "ifscCode",
          ];

          b2bFields.forEach((key) => {
            if (changedFields[key]) {
              payload.append(key, changedFields[key]);
            }
          });

          const { currentPassword, newPassword, confirmPassword, otp } = values;

          if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
              toast.error("New Password and Confirm Password must match!");
              return;
            }

            if (useOTP && otpSent) {
              if (!otp) {
                toast.error("Please enter OTP to reset password.");
                return;
              }
              payload.append("otp", otp);
              payload.append("password", newPassword);
            } else {
              if (!currentPassword) {
                toast.error("Please enter your current password.");
                return;
              }
              payload.append("currentPassword", currentPassword);
              payload.append("password", newPassword);
            }
          }

          // if (profilePreview && changedFields.profileImage) {
          //   payload.append("profileImage", changedFields.profileImage);
          // }

          if (checkPreview && changedFields.cancelCheque) {
            payload.append("cancelCheque", changedFields.cancelCheque);
          }

          await dispatch(updateB2BAdmin(payload, id));
          toast.success("B2B Profile updated successfully!");
          fetchB2BAdmin();
        } else if (userRole === "b2bMember" || userRole === "B2B Member") {
          const memberFields = ["firstName", "lastName", "phone", "email"];
          const payload = {};

          memberFields.forEach((key) => {
            if (changedFields[key]) payload[key] = changedFields[key];
          });

          if (changedFields.newPassword || changedFields.confirmPassword) {
            // Validation
            if (!values.newPassword || !values.confirmPassword) {
              toast.error(
                "Please enter both new password and confirm password."
              );
              return;
            }

            if (values.newPassword !== values.confirmPassword) {
              toast.error("New password and confirm password do not match.");
              return;
            }

            if (useOTP && otpSent) {
              if (!values.otp) {
                toast.error("Please enter the OTP.");
                return;
              }
              payload.otp = values.otp;
              payload.password = values.newPassword;
            } else {
              if (!values.currentPassword) {
                toast.error("Please enter your current password.");
                return;
              }
              payload.currentPassword = values.currentPassword;
              payload.password = values.newPassword;
            }
          }

          await dispatch(updateB2BMember(payload, id));
          toast.success("Member Profile updated successfully!");
          fetchB2BMember();
        } else if (userRole === "Branch Member") {
          const branchMemberFields = [
            "firstName",
            "lastName",
            "phone",
            "email",
          ];
          const payload = {};

          branchMemberFields.forEach((key) => {
            if (changedFields[key]) payload[key] = changedFields[key];
          });

          if (changedFields.newPassword || changedFields.confirmPassword) {
            if (values.newPassword !== values.confirmPassword) {
              toast.error("New password and confirm password do not match!");
              return;
            }

            if (!values.newPassword) {
              toast.error("New password cannot be empty!");
              return;
            }

            if (useOTP && otpSent) {
              if (!values.otp) {
                toast.error("Please enter OTP to update password!");
                return;
              }
              payload.otp = values.otp;
              payload.password = values.newPassword;
            } else {
              if (!values.currentPassword) {
                toast.error("Please enter your current password!");
                return;
              }
              payload.currentPassword = values.currentPassword;
              payload.password = values.newPassword;
            }
          }

          await dispatch(updateBranchMember(payload, id));
          toast.success("Branch Member Profile updated successfully!");
          fetchBranchMember();
        } else if (userRole === "Branch") {
          const branchFields = [
            "name",
            "email",
            "phone",
            "code",
            "address",
            "country",
            "state",
            "city",
          ];

          const payload = {};
          branchFields.forEach((key) => {
            if (changedFields[key] !== undefined)
              payload[key] = changedFields[key];
          });

          const isPasswordChangeRequested =
            values.newPassword && values.confirmPassword;

          if (isPasswordChangeRequested) {
            if (values.newPassword !== values.confirmPassword) {
              toast.error("New password and confirm password do not match!");
              return;
            }

            if (useOTP && otpSent) {
              if (!values.otp) {
                toast.error("OTP is required to update password!");
                return;
              }
              payload.otp = values.otp;
              payload.password = values.newPassword;
            } else {
              if (!values.currentPassword) {
                toast.error("Current password is required to update password!");
                return;
              }
              payload.currentPassword = values.currentPassword;
              payload.password = values.newPassword;
            }
          }

          try {
            await dispatch(updateBranch(payload, id));
            toast.success("Branch updated successfully!");
            fetchBranch();
          } catch (error) {
            toast.error(error?.message || "Failed to update branch!");
          }
        } else if (userRole === "Student") {
          const studentFields = ["name", "contact", "email", "country"];
          const payload = {};

          studentFields.forEach((key) => {
            if (changedFields[key] !== undefined) {
              payload[key] = changedFields[key];
            }
          });

          if (changedFields.newPassword || changedFields.confirmPassword) {
            if (!values.newPassword || !values.confirmPassword) {
              toast.error(
                "Please enter both new password and confirm password."
              );
              return;
            }

            if (values.newPassword !== values.confirmPassword) {
              toast.error("New password and confirm password do not match!");
              return;
            }

            if (oneStudent?.password) {
              if (useOTP && otpSent) {
                if (!values.otp) {
                  toast.error("Please enter OTP to update password!");
                  return;
                }
                payload.otp = values.otp;
                payload.password = values.newPassword;
              } else {
                if (!values.currentPassword) {
                  toast.error("Please enter your current password!");
                  return;
                }
                payload.currentPassword = values.currentPassword;
                payload.password = values.newPassword;
              }
            } else {
              // First-time password set
              payload.password = values.newPassword;
            }
          }

          await dispatch(updateStudentApplication(payload, id));
          toast.success("Student Profile updated successfully!");
          fetchOneStudent();
        } else if (userRole === "Coaching Faculty") {
          const changedFields = getChangedFields(originalValues, values);
          const payload = {};

          const coachingFacultyFields = [
            "name",
            "email",
            "phone",
            "batchStatus",
            "batchTime",
          ];
          coachingFacultyFields.forEach((key) => {
            if (changedFields[key] !== undefined) {
              if (key === "batchStatus") {
                payload.batchDetails = [
                  {
                    status: changedFields.batchStatus,
                    times: values.batchTime,
                  },
                ];
              } else if (key === "batchTime") {
                payload.batchDetails = [
                  {
                    status: values.batchStatus,
                    times: changedFields.batchTime,
                  },
                ];
              } else {
                payload[key] = changedFields[key];
              }
            }
          });

          if (changedFields.newPassword || changedFields.confirmPassword) {
            if (!values.newPassword || !values.confirmPassword) {
              toast.error(
                "Please enter both new password and confirm password."
              );
              return;
            }
            if (values.newPassword !== values.confirmPassword) {
              toast.error("New password and confirm password do not match!");
              return;
            }
            if (useOTP && otpSent) {
              if (!values.otp) {
                toast.error("Please enter OTP to update password!");
                return;
              }
              payload.otp = values.otp;
              payload.password = values.newPassword;
            } else {
              if (!values.currentPassword) {
                toast.error("Please enter your current password!");
                return;
              }
              payload.currentPassword = values.currentPassword;
              payload.password = values.newPassword;
            }
          }

          await dispatch(updateCoachingFaculty(payload, id));
          toast.success("Coaching Faculty Profile updated successfully!");
          fetchCoachingFaculty();
        } else {
          const changedFields = getChangedFields(originalValues, values);
          const payload = new FormData();

          Object.keys(changedFields).forEach((key) => {
            if (
              ![
                "currentPassword",
                "newPassword",
                "confirmPassword",
                "otp",
                "profileImage"
              ].includes(key)
            ) {
              payload.append(key, changedFields[key]);
            }
          });

          if (
            values.newPassword ||
            values.confirmPassword ||
            values.currentPassword
          ) {
            if (!values.newPassword || !values.confirmPassword) {
              toast.error("Please enter and confirm your new password.");
              return;
            }

            if (values.newPassword !== values.confirmPassword) {
              toast.error("New password and confirm password do not match!");
              return;
            }

            if (useOTP && otpSent) {
              if (!values.otp) {
                toast.error("Please enter the OTP.");
                return;
              }
              payload.append("otp", values.otp);
              payload.append("password", values.newPassword);
            } else {
              if (!values.currentPassword) {
                toast.error("Please enter your current password.");
                return;
              }
              payload.append("currentPassword", values.currentPassword);
              payload.append("password", values.newPassword);
            }
          }

          // Only send profile image if changed
          if (profilePreview && changedFields.profileImage) {
            payload.append("profileImage", changedFields.profileImage);
          }

          await dispatch(adminUpdate(payload, id));
          toast.success("Admin Profile updated successfully!");
          fetchAdmin();
        }

        setProfilePreview(null);
        setCheckPreview(null);
        setUseOTP(false);
        setOtpSent(false);
        formik.resetForm({
          values: {
            ...formik.values,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            otp: "",
          },
        });
        setOriginalValues(values);
      } catch (err) {
        console.error("Update failed:", err);
        toast.error(err?.response?.data?.message || "Update failed");
      }
    },
  });
  const handleSendOTP = async () => {
    try {
      const payload = {
        email:
          userRole === "b2bAdmin" || userRole === "B2B Admin"
            ? b2BAdminData.email
            : userRole === "b2bMember" || userRole === "B2B Member"
              ? b2bMemberData.email
              : userRole === "Branch Member"
                ? branchMemberLoginData.email
                : userRole === "Branch"
                  ? branchLoginData.email
                  : adminData.email,
      };
      await dispatch(adminRequestOTP(payload));
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    }
  };

  useEffect(() => {
    if (userRole === "b2bAdmin" || userRole === "B2B Admin") {
      if (b2BAdminData && Object.keys(b2BAdminData).length) {
        const values = {
          ...formik.initialValues,
          companyName: b2BAdminData.companyName || "",
          contactPerson: b2BAdminData.contactPerson || "",
          phone: b2BAdminData.phone || "",
          email: b2BAdminData.email || "",
          country: b2BAdminData.country || "",
          state: b2BAdminData.state || "",
          city: b2BAdminData.city || "",
          websiteUrl: b2BAdminData.websiteUrl || "",
          bankName: b2BAdminData.bankName || "",
          branch: b2BAdminData.branch || "",
          accountNumber: b2BAdminData.accountNumber || "",
          ifscCode: b2BAdminData.ifscCode || "",
        };

        formik.setValues({ ...formik.initialValues, ...values });
        setOriginalValues(values);
      }
    } else if (userRole === "b2bMember" || userRole === "B2B Member") {
      if (b2bMemberData && Object.keys(b2bMemberData).length) {
        const values = {
          ...formik.initialValues,
          firstName: b2bMemberData.firstName || "",
          lastName: b2bMemberData.lastName || "",
          phone: b2bMemberData.phone || "",
          email: b2bMemberData.email || "",
        };
        formik.setValues({ ...formik.initialValues, ...values });
        setOriginalValues(values);
      }
    } else if (userRole === "Branch Member") {
      if (branchMemberLoginData && Object.keys(branchMemberLoginData).length) {
        const values = {
          ...formik.initialValues,
          firstName: branchMemberLoginData.firstName || "",
          lastName: branchMemberLoginData.lastName || "",
          phone: branchMemberLoginData.phone || "",
          email: branchMemberLoginData.email || "",
        };
        formik.setValues({ ...formik.initialValues, ...values });
        setOriginalValues(values);
      }
    } else if (userRole === "Branch") {
      if (branchLoginData && Object.keys(branchLoginData).length) {
        const values = {
          ...formik.initialValues,
          name: branchLoginData.name || "",
          email: branchLoginData.email || "",
          phone: branchLoginData.phone || "",
          code: branchLoginData.code || "",
          address: branchLoginData.address || "",
          country: branchLoginData.country || "",
          state: branchLoginData.state || "",
          city: branchLoginData.city || "",
        };
        formik.setValues({ ...formik.initialValues, ...values });
        setOriginalValues(values);
      }
    } else if (userRole === "Student") {
      if (oneStudent && Object.keys(oneStudent).length) {
        const values = {
          ...formik.initialValues,
          name: oneStudent.name || "",
          contact: oneStudent.contact || "",
          email: oneStudent.email || "",
          country: oneStudent.country || "",
        };
        formik.setValues({ ...formik.initialValues, ...values });
        setOriginalValues(values);
      }
    } else if (userRole === "Coaching Faculty") {
      if (coachingFaculty && Object.keys(coachingFaculty).length) {
        const values = {
          ...formik.initialValues,
          name: coachingFaculty.name || "",
          email: coachingFaculty.email || "",
          phone: coachingFaculty.phone || "",
          batchStatus: coachingFaculty.batchDetails?.[0]?.status || "",
          batchTime: coachingFaculty.batchDetails?.[0]?.times || [""],
        };
        formik.setValues({ ...formik.initialValues, ...values });
        setOriginalValues(values);
      }
    } else {
      if (adminData && Object.keys(adminData).length) {
        const values = {
          ...formik.initialValues,
          name: adminData.name || "",
          email: adminData.email || "",
          phone: adminData.phone || "",
          country: adminData.country || "",
          state: adminData.state || "",
          city: adminData.city || "",
        };
        formik.setValues({ ...formik.initialValues, ...values });
        setOriginalValues(values);
      }
    }
  }, [
    b2BAdminData,
    adminData,
    b2bMemberData,
    branchLoginData,
    branchMemberLoginData,
    oneStudent,
    coachingFaculty,
  ]);

  // useEffect(() => {
  //   if (b2BAdminData) {
  //     formik.setValues({
  //       companyName: b2BAdminData.companyName || "",
  //       contactPerson: b2BAdminData.contactPerson || "",
  //       phone: b2BAdminData.phone || "",
  //       email: b2BAdminData.email || "",
  //       currentPassword: "",
  //       newPassword: "",
  //       confirmPassword: "",
  //       otp: "",
  //       // password: "",
  //       country: b2BAdminData.country || "",
  //       state: b2BAdminData.state || "",
  //       city: b2BAdminData.city || "",
  //       // memberLimit: b2BAdminData.memberLimit || 0,
  //       // status: b2BAdminData.status || "Active",
  //       websiteUrl: b2BAdminData.websiteUrl || "",
  //       bankName: b2BAdminData.bankName || "",
  //       branch: b2BAdminData.branch || "",
  //       accountNumber: b2BAdminData.accountNumber || "",
  //       ifscCode: b2BAdminData.ifscCode || "",
  //       logo: "",
  //       cancelCheque: "",
  //     });
  //   }
  // }, [b2BAdminData]);

  return (
    <Fragment>
      <Pageheader
        mainheading="Profile"
        parentfolder="Pages"
        activepage="Profile"
      />
      <Tab.Container id="center-tabs-example" defaultActiveKey="first">
        <Row className="square">
          <Col lg={12} md={12}>
            <Card className="custom-card">
              <Card.Body>
                <div className="panel profile-cover">
                  <div className="profile-cover__img">
                    <img
                      src={
                        profilePreview
                          ? profilePreview
                          : userRole === "b2bAdmin" || userRole === "B2B Admin"
                            ? b2BAdminData?.companyLogo
                              ? b2BAdminData?.companyLogo
                              : ALLImages("face1")
                            : adminData?.profileImage
                              ? `${REACT_APP_API_URL}${adminData?.profileImage}`
                              : ALLImages("face1")
                      }
                      alt={
                        userRole === "b2bAdmin" || userRole === "B2B Admin"
                          ? "Company Logo"
                          : "Profile Image"
                      }
                    />

                    <h3 className="h3">
                      {userRole === "b2bAdmin" || userRole === "B2B Admin"
                        ? b2BAdminData?.companyName
                          ? b2BAdminData.companyName
                            .toLowerCase()
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                          : "N/A"
                        : userRole === "b2bMember" || userRole === "B2B Member"
                          ? b2bMemberData?.firstName
                            ? `${b2bMemberData.firstName} ${b2bMemberData.lastName || ""
                              }`
                              .toLowerCase()
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                            : "N/A"
                          : userRole === "Branch Member"
                            ? branchMemberLoginData?.firstName
                              ? `${branchMemberLoginData.firstName} ${branchMemberLoginData.lastName || ""
                                }`
                                .toLowerCase()
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")
                              : "N/A"
                            : userRole === "Branch"
                              ? branchLoginData?.name
                                ? branchLoginData.name
                                  .toLowerCase()
                                  .split(" ")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                  )
                                  .join(" ")
                                : "N/A"
                              : userRole === "Student"
                                ? oneStudent?.name
                                  ? oneStudent.name
                                    .toLowerCase()
                                    .split(" ")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    )
                                    .join(" ")
                                  : "N/A"
                                : userRole === "Coaching Faculty"
                                  ? coachingFaculty?.name
                                    ? coachingFaculty.name
                                      .toLowerCase()
                                      .split(" ")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() + word.slice(1)
                                      )
                                      .join(" ")
                                    : "N/A"
                                  : adminData?.name
                                    ? adminData.name
                                    : "N/A"}
                    </h3>
                  </div>
                  {/* <div className="btn-list btn-profile">
                    <Button variant="danger" className="btn-rounded ">
                      <i className="fa fa-plus me-2"></i>
                      <span>Follow</span>
                    </Button>
                    <Button variant="success" className="btn-rounded">
                      <i className="fa fa-comment me-2"></i>
                      <span>Message</span>
                    </Button>
                  </div> */}
                  <div className="profile-cover__action bg-img"></div>
                  {/* <div className="profile-cover__info">
                    <ul className="nav">
                      <li>
                        {" "}
                        <strong>26</strong>Projects{" "}
                      </li>
                      <li>
                        {" "}
                        <strong>33</strong>Followers{" "}
                      </li>
                      <li>
                        {" "}
                        <strong>136</strong>Following{" "}
                      </li>
                    </ul>
                  </div> */}
                  <div className="profile-tab tab-menu-heading mt_large_space">
                    <Nav
                      variant="pills"
                      className="p-1 bg-primary-transparent rounded"
                    >
                      <Nav.Item>
                        {" "}
                        <Nav.Link eventKey="first">About</Nav.Link>{" "}
                      </Nav.Item>
                      <Nav.Item>
                        {" "}
                        <Nav.Link eventKey="editprofile">
                          Edit Profile{" "}
                        </Nav.Link>{" "}
                      </Nav.Item>
                      {/* <Nav.Item> <Nav.Link eventKey="timeline">Timeline</Nav.Link> </Nav.Item>
                      <Nav.Item> <Nav.Link eventKey="gallery">Gallery</Nav.Link> </Nav.Item>
                      <Nav.Item> <Nav.Link eventKey="friends">Friends </Nav.Link> </Nav.Item>
                      <Nav.Item> <Nav.Link eventKey="accountsetting"> Account Settings </Nav.Link> </Nav.Item> */}
                    </Nav>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-sm">
          <Col md={12} lg={12}>
            <Card className="custom-card main-content-body-profile">
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Col lg={12} md={12}>
                    <Card className="custom-card main-content-body-profile">
                      <div className="tab-content">
                        <div className="main-content-body tab-pane p-sm-4 p-0 border-top-0 active">
                          <div className="p-0 border rounded-10">
                            <div className="p-4">
                              <h4 className="fs-15 text-uppercase text-primary mb-3">
                                BIOdata
                              </h4>
                              {userRole === "b2bAdmin" ||
                                userRole === "B2B Admin" ? (
                                <p>
                                  Hi I'm{" "}
                                  <strong>
                                    {b2BAdminData?.companyName || "N/A"}
                                  </strong>
                                  , contact person of{" "}
                                  <strong>
                                    {b2BAdminData?.companyName || "N/A"}
                                  </strong>{" "}
                                  located in{" "}
                                  <strong>{b2BAdminData?.city || "N/A"}</strong>
                                  ,{" "}
                                  <strong>
                                    {b2BAdminData?.state
                                      ? stateDropDown.find(
                                        (s) =>
                                          s.isoCode === b2BAdminData.state
                                      )?.name || b2BAdminData.state
                                      : "N/A"}
                                  </strong>
                                  ,{" "}
                                  <strong>
                                    {b2BAdminData?.country
                                      ? countries.find(
                                        (c) =>
                                          c.isoCode === b2BAdminData.country
                                      )?.name || b2BAdminData.country
                                      : "N/A"}
                                  </strong>
                                  . Our company specializes in B2B services. You
                                  can reach us at{" "}
                                  <strong>
                                    {b2BAdminData?.email || "N/A"}
                                  </strong>
                                  .
                                </p>
                              ) : userRole === "b2bMember" ||
                                userRole === "B2B Member" ? (
                                <p>
                                  Hi I'm{" "}
                                  <strong>
                                    {b2bMemberData?.firstName}{" "}
                                    {b2bMemberData?.lastName || ""}
                                  </strong>
                                  , a B2B member. You can reach me at{" "}
                                  <strong>
                                    {b2bMemberData?.email || "N/A"}
                                  </strong>
                                  .
                                </p>
                              ) : userRole === "Branch Member" ? (
                                <p>
                                  Hi I'm{" "}
                                  <strong>
                                    {branchMemberLoginData?.firstName}{" "}
                                    {branchMemberLoginData?.lastName || ""}
                                  </strong>
                                  , a Branch member. You can reach me at{" "}
                                  <strong>
                                    {branchMemberLoginData?.email || "N/A"}
                                  </strong>
                                  .
                                </p>
                              ) : userRole === "Branch" ? (
                                <p>
                                  Hi I'm{" "}
                                  <strong>
                                    {branchLoginData?.name || "N/A"}
                                  </strong>
                                  , a branch located in{" "}
                                  <strong>
                                    {branchLoginData?.city || "N/A"}
                                  </strong>
                                  ,{" "}
                                  <strong>
                                    {branchLoginData?.state || "N/A"}
                                  </strong>
                                  ,{" "}
                                  <strong>
                                    {branchLoginData?.country || "N/A"}
                                  </strong>
                                  . You can reach us at{" "}
                                  <strong>
                                    {branchLoginData?.email || "N/A"}
                                  </strong>
                                  .
                                </p>
                              ) : userRole === "Coaching Faculty" ? (
                                <p>
                                  Hi I'm{" "}
                                  <strong>
                                    {coachingFaculty?.name || "N/A"}
                                  </strong>
                                  , a Coaching Faculty member. You can reach me
                                  at{" "}
                                  <strong>
                                    {coachingFaculty?.email || "N/A"}
                                  </strong>
                                  .
                                </p>
                              ) : userRole === "Student" ? (
                                <p>
                                  Hi, I'm{" "}
                                  <strong>{oneStudent?.name || "N/A"}</strong>,
                                  a Student. You can reach me at{" "}
                                  <strong>{oneStudent?.email || "N/A"}</strong>.
                                </p>
                              ) : (
                                <p>
                                  Hi I'm{" "}
                                  <strong>{adminData?.name || "N/A"}</strong>,
                                  an administrator located in{" "}
                                  <strong>
                                    {Array.isArray(adminData?.country)
                                      ? adminData.country
                                        .map(
                                          (isoCode) =>
                                            countries.find(
                                              (c) => c.isoCode === isoCode
                                            )?.name || isoCode
                                        )
                                        .join(", ") || "N/A"
                                      : adminData?.country || "N/A"}
                                  </strong>
                                  . You can reach me at{" "}
                                  <strong>{adminData?.email || "N/A"}</strong>.
                                </p>
                              )}

                              <div>
                                {/* <h4 className="fs-15 text-uppercase mt-3">
                                  Details
                                </h4> */}
                                <div className="pt-3">
                                  {userRole === "b2bAdmin" ||
                                    userRole === "B2B Admin" ? (
                                    <>
                                      <h5 className="text-uppercase text-primary mb-3 fs-14">
                                        Company Details
                                      </h5>
                                      <p>
                                        <strong>Company Name: </strong>
                                        {b2BAdminData?.companyName || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Member Limit: </strong>
                                        {b2BAdminData?.memberLimit || 0}
                                      </p>
                                      <p>
                                        <strong>Status: </strong>
                                        {b2BAdminData?.status || "N/A"}
                                      </p>
                                      <p>
                                        Website:
                                        {b2BAdminData?.websiteUrl ? (
                                          <a
                                            href={b2BAdminData?.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {b2BAdminData?.websiteUrl}
                                          </a>
                                        ) : (
                                          <span> N/A</span>
                                        )}
                                      </p>
                                    </>
                                  ) : userRole === "b2bMember" ||
                                    userRole === "B2B Member" ? (
                                    <>
                                      <h5 className="text-uppercase text-primary mb-3 fs-14">
                                        Member Details
                                      </h5>
                                      <p>
                                        <strong>Name: </strong>
                                        {b2bMemberData?.firstName}{" "}
                                        {b2bMemberData?.lastName || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Status: </strong>
                                        {b2bMemberData?.status || "N/A"}
                                      </p>
                                    </>
                                  ) : userRole === "Branch Member" ? (
                                    <>
                                      <h5 className="text-uppercase text-primary mb-3 fs-14">
                                        Branch Member Details
                                      </h5>
                                      <p>
                                        <strong>Name: </strong>
                                        {branchMemberLoginData?.firstName}{" "}
                                        {branchMemberLoginData?.lastName ||
                                          "N/A"}
                                      </p>
                                      <p>
                                        <strong>Status: </strong>
                                        {branchMemberLoginData?.status || "N/A"}
                                      </p>
                                    </>
                                  ) : userRole === "Branch" ? (
                                    <>
                                      <h5 className="text-uppercase text-primary mb-3 fs-14">
                                        Branch Details
                                      </h5>
                                      <p>
                                        <strong>Branch Name: </strong>
                                        {branchLoginData?.name || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Address: </strong>
                                        {branchLoginData?.address || "N/A"}
                                      </p>
                                    </>
                                  ) : userRole === "Coaching Faculty" ? (
                                    <>
                                      <h5 className="text-uppercase text-primary mb-3 fs-14">
                                        Coaching Faculty Details
                                      </h5>
                                      <p>
                                        <strong>Name: </strong>
                                        {coachingFaculty?.name || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Batch Times: </strong>
                                        {coachingFaculty?.batchDetails?.[0]
                                          ?.times?.length > 0 ? (
                                          <ul>
                                            {coachingFaculty.batchDetails[0].times.map(
                                              (time, index) => (
                                                <li key={index}>
                                                  {time} (
                                                  {
                                                    coachingFaculty
                                                      .batchDetails[0].status
                                                  }
                                                  )
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          "N/A"
                                        )}
                                      </p>
                                    </>
                                  ) : userRole === "Student" ? (
                                    <>
                                      <h5 className="text-uppercase text-primary mb-3 fs-14">
                                        Student Details
                                      </h5>
                                      {/* <p>
                                        <strong>Student Id: </strong>
                                        {oneStudent?.studentId || "N/A"}
                                      </p> */}
                                      <p>
                                        <strong>Name: </strong>
                                        {oneStudent?.name || "N/A"}
                                      </p>
                                      {/* <p>
                                        <strong>Email: </strong>
                                        {oneStudent?.email || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Phone: </strong>
                                        {oneStudent?.contact || "N/A"}
                                      </p> */}
                                    </>
                                  ) : (
                                    <>
                                      <h5 className="text-uppercase text-primary mb-3 fs-14">
                                        Admin Details
                                      </h5>
                                      <p>
                                        <strong>Name: </strong>
                                        {adminData?.name || "N/A"}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="border-top"></div>

                            <div className="p-4">
                              <label className="main-content-label fs-13 mg-b-20">
                                Contact
                              </label>
                              <div className="d-sm-flex">
                                <div className="mb-3 mb-sm-0">
                                  <div className="main-profile-contact-list">
                                    <div className="media">
                                      <div className="media-icon bg-primary-transparent text-primary">
                                        <i className="bi bi-telephone-forward"></i>
                                      </div>
                                      <div className="media-body">
                                        <span>Mobile</span>
                                        <div>
                                          {userRole === "Student"
                                            ? oneStudent?.contact || "N/A"
                                            : userRole === "b2bAdmin" ||
                                              userRole === "B2B Admin"
                                              ? b2BAdminData?.phone || "N/A"
                                              : userRole === "b2bMember" ||
                                                userRole === "B2B Member"
                                                ? b2bMemberData?.phone || "N/A"
                                                : userRole === "Branch Member"
                                                  ? branchMemberLoginData?.phone ||
                                                  "N/A"
                                                  : userRole === "Branch"
                                                    ? branchLoginData?.phone || "N/A"
                                                    : userRole === "Coaching Faculty"
                                                      ? coachingFaculty?.phone || "N/A"
                                                      : adminData?.phone || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="ms-0 ms-sm-3 mb-3 mb-sm-0">
                                  <div className="main-profile-contact-list">
                                    <div className="media">
                                      <div className="media-icon bg-success-transparent text-success">
                                        <i className="bi bi-envelope"></i>
                                      </div>
                                      <div className="media-body">
                                        <span>Email</span>
                                        <div>
                                          {userRole === "Student"
                                            ? oneStudent?.email || "N/A"
                                            : userRole === "b2bAdmin" ||
                                              userRole === "B2B Admin"
                                              ? b2BAdminData?.email || "N/A"
                                              : userRole === "b2bMember" ||
                                                userRole === "B2B Member"
                                                ? b2bMemberData?.email || "N/A"
                                                : userRole === "Branch Member"
                                                  ? branchMemberLoginData?.email ||
                                                  "N/A"
                                                  : userRole === "Branch"
                                                    ? branchLoginData?.email || "N/A"
                                                    : userRole === "Coaching Faculty"
                                                      ? coachingFaculty?.email || "N/A"
                                                      : adminData?.email || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {userRole !== "Coaching Faculty" &&
                                  userRole !== "B2B Member" && (
                                    <div className="ms-0 ms-sm-3 mb-3 mb-sm-0">
                                      <div className="main-profile-contact-list">
                                        <div className="media">
                                          <div className="media-icon bg-info-transparent text-info">
                                            <i className="bi bi-geo-alt"></i>
                                          </div>
                                          <div className="media-body">
                                            <span>Address</span>
                                            <div>
                                              {userRole === "Student"
                                                ? `${oneStudent?.address || "N/A"
                                                }, ${oneStudent?.city || "N/A"
                                                }, ${oneStudent?.state || "N/A"
                                                }, ${oneStudent?.country || "N/A"
                                                }`
                                                : userRole === "b2bAdmin" ||
                                                  userRole === "B2B Admin"
                                                  ? `${b2BAdminData?.city || "N/A"
                                                  }, ${b2BAdminData?.state
                                                    ? stateDropDown.find(
                                                      (s) =>
                                                        s.isoCode ===
                                                        b2BAdminData.state
                                                    )?.name ||
                                                    b2BAdminData.state
                                                    : "N/A"
                                                  }, ${b2BAdminData?.country
                                                    ? countries.find(
                                                      (c) =>
                                                        c.isoCode ===
                                                        b2BAdminData.country
                                                    )?.name ||
                                                    b2BAdminData.country
                                                    : "N/A"
                                                  }`
                                                  : userRole === "b2bMember" ||
                                                    userRole === "B2B Member"
                                                    ? "N/A"
                                                    : userRole === "Branch Member"
                                                      ? "N/A"
                                                      : userRole === "Branch"
                                                        ? `${branchLoginData?.address ||
                                                        "N/A"
                                                        }, ${branchLoginData?.city ||
                                                        "N/A"
                                                        }, ${branchLoginData?.state ||
                                                        "N/A"
                                                        }, ${branchLoginData?.country ||
                                                        "N/A"
                                                        }`
                                                        : Array.isArray(
                                                          adminData?.country
                                                        )
                                                          ? adminData.country
                                                            .map(
                                                              (isoCode) =>
                                                                countries.find(
                                                                  (c) =>
                                                                    c.isoCode ===
                                                                    isoCode
                                                                )?.name || isoCode
                                                            )
                                                            .join(", ") || "N/A"
                                                          : adminData?.country || "N/A"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>

                            {userRole === "b2bAdmin" ||
                              userRole === "B2B Admin" ? (
                              <>
                                <div className="border-top"></div>
                                <div className="p-3 p-sm-4">
                                  <label className="main-content-label fs-13 mg-b-20">
                                    Social
                                  </label>
                                  <div className="d-xl-flex">
                                    <div className="mb-3 mb-xl-0">
                                      <div className="main-profile-social-list">
                                        <div className="media">
                                          <div className="media-icon bg-primary-transparent text-primary">
                                            <i className="bi bi-globe"></i>
                                          </div>
                                          <div className="media-body">
                                            <span>Website</span>
                                            {b2BAdminData?.websiteUrl ? (
                                              <a
                                                href={b2BAdminData?.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                {b2BAdminData?.websiteUrl ||
                                                  "N/A"}
                                              </a>
                                            ) : (
                                              <span> N/A</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="ms-0 ms-xl-3 mb-3 mb-xl-0">
                                      <div className="main-profile-social-list">
                                        <div className="media">
                                          <div className="media-icon bg-danger-transparent text-danger">
                                            <i className="bi bi-person"></i>
                                          </div>
                                          <div className="media-body">
                                            <span>Company Name</span>
                                            <div>
                                              {b2BAdminData?.companyName || (
                                                <span>N/A</span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Tab.Pane>
                {/* <Tab.Pane eventKey="first">
                  <Col lg={12} md={12}>
                    <Card className="custom-card main-content-body-profile">
                      <div className="tab-content">
                        <div className="main-content-body tab-pane p-sm-4 p-0 border-top-0 active">
                          <div className=" p-0 border p-0 rounded-10">
                            <div className="p-4">
                              <h4 className="fs-15 text-uppercase mb-3">
                                BIOdata
                              </h4>
                              <p className="m-b-5">
                                Hi I'm Petey Cruiser,has been the industry's
                                standard dummy text ever since the 1500s, when
                                an unknown printer took Link galley of type.
                                Donec pede justo, fringilla vel, aliquet nec,
                                vulputate eget, arcu. In enim justo, rhoncus ut,
                                imperdiet a, venenatis vitae, justo. Nullam
                                dictum felis eu pede mollis pretium. Integer
                                tincidunt.Cras dapibus. Vivamus elementum semper
                                nisi. Aenean vulputate eleifend tellus. Aenean
                                leo ligula, porttitor eu, consequat vitae,
                                eleifend ac, enim.
                              </p>
                              <div className="m-t-30">
                                <h4 className="fs-15 text-uppercase mt-3">
                                  Experience
                                </h4>
                                <div className=" p-t-10">
                                  <h5 className="text-primary m-b-5 fs-14">
                                    Lead designer / Developer
                                  </h5>
                                  <p className="">websitename.com</p>
                                  <p>
                                    <b>2010-2015</b>
                                  </p>
                                  <p className="text-muted fs-13 mb-0">
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy
                                    text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled
                                    it to make a type specimen book.
                                  </p>
                                </div>

                                <Card.Body className="px-0 pb-0">
                                  <h5 className="text-primary m-b-5 fs-14">
                                    Senior Graphic Designer
                                  </h5>
                                  <p className="">coderthemes.com</p>
                                  <p>
                                    <b>2007-2009</b>
                                  </p>
                                  <p className="text-muted fs-13 mb-0">
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy
                                    text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled
                                    it to make a type specimen book.
                                  </p>
                                </Card.Body>
                              </div>
                            </div>
                            <div className="border-top"></div>
                            <div className="p-4">
                              <label className="main-content-label fs-13 mg-b-20">
                                Contact
                              </label>
                              <div className="d-sm-flex">
                                <div className="mb-3 mb-sm-0">
                                  <div className="main-profile-contact-list">
                                    <div className="media">
                                      <div className="media-icon bg-primary-transparent text-primary">
                                        {" "}
                                        <i className="bi bi-telephone-forward"></i>{" "}
                                      </div>
                                      <div className="media-body">
                                        {" "}
                                        <span>Mobile</span>
                                        <div> +245 354 654 </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="ms-0 ms-sm-3 mb-3 mb-sm-0">
                                  <div className="main-profile-contact-list">
                                    <div className="media">
                                      <div className="media-icon bg-success-transparent text-success">
                                        {" "}
                                        <i className="bi bi-lightning-charge"></i>{" "}
                                      </div>
                                      <div className="media-body">
                                        {" "}
                                        <span>Slack</span>
                                        <div> @spruko.w </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="ms-0 ms-sm-3 mb-3 mb-sm-0">
                                  <div className="main-profile-contact-list">
                                    <div className="media">
                                      <div className="media-icon bg-info-transparent text-info">
                                        {" "}
                                        <i className="bi bi-geo-alt"></i>{" "}
                                      </div>
                                      <div className="media-body">
                                        {" "}
                                        <span>Current Address</span>
                                        <div> San Francisco, CA </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-top"></div>
                            <div className="p-3 p-sm-4">
                              <label className="main-content-label fs-13 mg-b-20">
                                Social
                              </label>
                              <div className="d-xl-flex">
                                <div className="mb-3 mb-xl-0">
                                  <div className="main-profile-social-list">
                                    <div className="media">
                                      <div className="media-icon bg-primary-transparent text-primary">
                                        {" "}
                                        <i className="bi bi-github"></i>{" "}
                                      </div>
                                      <div className="media-body">
                                        {" "}
                                        <span>Github</span>{" "}
                                        <Link to="">github.com/spruko</Link>{" "}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="ms-0 ms-xl-3 mb-3 mb-xl-0">
                                  <div className="main-profile-social-list">
                                    <div className="media">
                                      <div className="media-icon bg-success-transparent text-success">
                                        {" "}
                                        <i className="ri-twitter-x-fill"></i>{" "}
                                      </div>
                                      <div className="media-body">
                                        {" "}
                                        <span>Twitter</span>{" "}
                                        <Link to="">twitter.com/spruko.me</Link>{" "}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="ms-0 ms-xl-3 mb-3 mb-xl-0">
                                  <div className="main-profile-social-list">
                                    <div className="media">
                                      <div className="media-icon bg-info-transparent text-info">
                                        {" "}
                                        <i className="bi bi-linkedin"></i>{" "}
                                      </div>
                                      <div className="media-body">
                                        {" "}
                                        <span>Linkedin</span>{" "}
                                        <Link to="">
                                          linkedin.com/in/spruko
                                        </Link>{" "}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="ms-0 ms-xl-3 mb-3 mb-xl-0">
                                  <div className="main-profile-social-list">
                                    <div className="media">
                                      <div className="media-icon bg-danger-transparent text-danger">
                                        {" "}
                                        <i className="bi bi-link-45deg"></i>{" "}
                                      </div>
                                      <div className="media-body">
                                        {" "}
                                        <span>My Portfolio</span>{" "}
                                        <Link to="">spruko.com/</Link>{" "}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Tab.Pane> */}

                <Tab.Pane eventKey="editprofile">
                  <div className="main-content-body tab-pane p-sm-4 p-0 border-top-0">
                    <Card.Body className="border">
                      <Form
                        className="form-horizontal"
                        onSubmit={formik.handleSubmit}
                      >
                        <div className="mb-4 main-content-label">
                          {userRole === "b2bAdmin" || userRole === "B2B Admin"
                            ? "Company Information"
                            : userRole === "b2bMember" ||
                              userRole === "B2B Member"
                              ? "Member Information"
                              : userRole === "Branch Member"
                                ? "Branch Member Information"
                                : "Personal Information"}
                        </div>

                        {userRole === "b2bAdmin" || userRole === "B2B Admin" ? (
                          <>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Company Name</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    className="custom-select-height"
                                    type="text"
                                    name="companyName"
                                    placeholder="Company Name"
                                    value={formik.values.companyName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Contact Person</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    className="custom-select-height"
                                    type="text"
                                    name="contactPerson"
                                    placeholder="Contact Person"
                                    value={formik.values.contactPerson}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        ) : userRole === "b2bMember" ||
                          userRole === "B2B Member" ||
                          userRole === "Branch Member" ? (
                          <>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>First Name</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    className="custom-select-height"
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Last Name</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    className="custom-select-height"
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        ) : (
                          <>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Name</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    className="custom-select-height"
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        )}

                        {userRole !== "Student" && (
                          <Form.Group className="my-2">
                            <Row className="row-sm">
                              <Col md={3}>
                                <Form.Label>Phone</Form.Label>
                              </Col>
                              <Col md={9}>
                                <Form.Control
                                  type="text"
                                  className="custom-select-height"
                                  placeholder="Enter Phone"
                                  name="phone"
                                  value={formik.values.phone}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                              </Col>
                            </Row>
                          </Form.Group>
                        )}

                        {userRole === "Student" && (
                          <Form.Group className="my-2">
                            <Row className="row-sm">
                              <Col md={3}>
                                <Form.Label>Phone</Form.Label>
                              </Col>
                              <Col md={9}>
                                <Form.Control
                                  type="text"
                                  className="custom-select-height"
                                  placeholder="Enter Phone"
                                  name="contact"
                                  value={formik.values.contact}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                />
                              </Col>
                            </Row>
                          </Form.Group>
                        )}

                        <Form.Group className="my-2">
                          <Row className="row-sm">
                            <Col md={3}>
                              <Form.Label>Email</Form.Label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Col>
                          </Row>
                        </Form.Group>

                        {userRole === "Branch" && (
                          <>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Address</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    type="text"
                                    className="custom-select-height"
                                    placeholder="Enter Address"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        )}

                        <hr className="mt-4" />

                        <div className="my-3 main-content-label">
                          Password Update
                        </div>

                        {userRole === "Student" && !oneStudent?.password ? (
                          <>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>New Password</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <div className="position-relative">
                                    <Form.Control
                                      type={
                                        showNewPassword ? "text" : "password"
                                      }
                                      className="custom-select-height"
                                      placeholder="New Password"
                                      name="newPassword"
                                      value={formik.values.newPassword}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />
                                    <span
                                      onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                      }
                                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {showNewPassword ? (
                                        <Visibility sx={{ fontSize: 18 }} />
                                      ) : (
                                        <VisibilityOff sx={{ fontSize: 18 }} />
                                      )}
                                    </span>
                                  </div>
                                  {formik.touched.newPassword &&
                                    formik.errors.newPassword && (
                                      <div className="text-danger">
                                        {formik.errors.newPassword}
                                      </div>
                                    )}
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Confirm Password</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <div className="position-relative">
                                    <Form.Control
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      className="custom-select-height"
                                      placeholder="Confirm Password"
                                      name="confirmPassword"
                                      value={formik.values.confirmPassword}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />
                                    <span
                                      onClick={() =>
                                        setShowConfirmPassword(
                                          !showConfirmPassword
                                        )
                                      }
                                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {showConfirmPassword ? (
                                        <Visibility sx={{ fontSize: 18 }} />
                                      ) : (
                                        <VisibilityOff sx={{ fontSize: 18 }} />
                                      )}
                                    </span>
                                  </div>
                                  {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword && (
                                      <div className="text-danger">
                                        {formik.errors.confirmPassword}
                                      </div>
                                    )}
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        ) : (
                          <>
                            {!useOTP && (
                              <Form.Group className="my-2">
                                <Row className="row-sm">
                                  <Col md={3}>
                                    <Form.Label>Current Password</Form.Label>
                                  </Col>
                                  <Col md={9}>
                                    <div className="position-relative">
                                      <Form.Control
                                        type={
                                          showCurrentPassword
                                            ? "text"
                                            : "password"
                                        }
                                        className="custom-select-height"
                                        placeholder="Enter Current Password"
                                        name="currentPassword"
                                        value={formik.values.currentPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      <span
                                        onClick={() =>
                                          setShowCurrentPassword(
                                            !showCurrentPassword
                                          )
                                        }
                                        className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                        style={{ cursor: "pointer" }}
                                      >
                                        {showCurrentPassword ? (
                                          <Visibility sx={{ fontSize: 18 }} />
                                        ) : (
                                          <VisibilityOff
                                            sx={{ fontSize: 18 }}
                                          />
                                        )}
                                      </span>
                                    </div>
                                    {formik.touched.currentPassword &&
                                      formik.errors.currentPassword && (
                                        <div className="text-danger">
                                          {formik.errors.currentPassword}
                                        </div>
                                      )}
                                  </Col>
                                </Row>
                              </Form.Group>
                            )}

                            {useOTP && (
                              <Form.Group className="my-2">
                                <Row className="row-sm">
                                  <Col md={3}>
                                    <Form.Label>Send OTP</Form.Label>
                                  </Col>
                                  <Col md={9}>
                                    <Button
                                      variant="primary"
                                      onClick={handleSendOTP}
                                      disabled={otpSent}
                                      className="custom-select-height"
                                    >
                                      {otpSent ? "OTP Sent" : "Send OTP"}
                                    </Button>
                                  </Col>
                                </Row>
                              </Form.Group>
                            )}

                            {useOTP && otpSent && (
                              <Form.Group className="my-2">
                                <Row className="row-sm">
                                  <Col md={3}>
                                    <Form.Label>Enter OTP</Form.Label>
                                  </Col>
                                  <Col md={9}>
                                    <Form.Control
                                      type="text"
                                      className="custom-select-height"
                                      placeholder="Enter OTP"
                                      name="otp"
                                      value={formik.values.otp}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.otp &&
                                      formik.errors.otp && (
                                        <div className="text-danger">
                                          {formik.errors.otp}
                                        </div>
                                      )}
                                  </Col>
                                </Row>
                              </Form.Group>
                            )}

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>New Password</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <div className="position-relative">
                                    <Form.Control
                                      type={
                                        showNewPassword ? "text" : "password"
                                      }
                                      className="custom-select-height"
                                      placeholder="New Password"
                                      name="newPassword"
                                      value={formik.values.newPassword}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />
                                    <span
                                      onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                      }
                                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {showNewPassword ? (
                                        <Visibility sx={{ fontSize: 18 }} />
                                      ) : (
                                        <VisibilityOff sx={{ fontSize: 18 }} />
                                      )}
                                    </span>
                                  </div>
                                  {formik.touched.newPassword &&
                                    formik.errors.newPassword && (
                                      <div className="text-danger">
                                        {formik.errors.newPassword}
                                      </div>
                                    )}
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Confirm Password</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <div className="position-relative">
                                    <Form.Control
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      className="custom-select-height"
                                      placeholder="Confirm Password"
                                      name="confirmPassword"
                                      value={formik.values.confirmPassword}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />
                                    <span
                                      onClick={() =>
                                        setShowConfirmPassword(
                                          !showConfirmPassword
                                        )
                                      }
                                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {showConfirmPassword ? (
                                        <Visibility sx={{ fontSize: 18 }} />
                                      ) : (
                                        <VisibilityOff sx={{ fontSize: 18 }} />
                                      )}
                                    </span>
                                  </div>
                                  {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword && (
                                      <div className="text-danger">
                                        {formik.errors.confirmPassword}
                                      </div>
                                    )}
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3} className="mt-2">
                                  <Form.Label>
                                    {useOTP
                                      ? "Update via OTP"
                                      : "Update via Password"}
                                  </Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Button
                                    className="profile-password"
                                    variant="link"
                                    onClick={() => {
                                      setUseOTP(!useOTP);
                                      setOtpSent(false);
                                      formik.setFieldValue(
                                        "currentPassword",
                                        ""
                                      );
                                      formik.setFieldValue("otp", "");
                                    }}
                                  >
                                    {useOTP
                                      ? "Use Current Password"
                                      : "Forgot Password? Use OTP"}
                                  </Button>
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        )}

                        <hr className="mb-4" />

                        {userRole === "b2bAdmin" ||
                          userRole === "B2B Admin" ||
                          userRole === "Branch" ? (
                          <>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Country</Form.Label>
                                </Col>
                                <Col md={9}>
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
                                              (c) =>
                                                c.isoCode ===
                                                formik.values.country
                                            )?.name || formik.values.country,
                                        }
                                        : null
                                    }
                                    onChange={(option) => {
                                      const countryIsoCode = option
                                        ? option.value
                                        : "";
                                      handleCountryChange(countryIsoCode);
                                      formik.setFieldValue(
                                        "country",
                                        countryIsoCode
                                      );
                                    }}
                                    onMenuOpen={() => setIsDropdownOpen(true)}
                                    onMenuClose={() => setIsDropdownOpen(false)}
                                    placeholder="Select Country"
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
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>State</Form.Label>
                                </Col>
                                <Col md={9}>
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
                                              (s) =>
                                                s.isoCode ===
                                                formik.values.state
                                            )?.name || formik.values.state,
                                        }
                                        : null
                                    }
                                    onChange={(option) => {
                                      const stateIsoCode = option
                                        ? option.value
                                        : "";
                                      handleStateChange(
                                        formik.values.country,
                                        stateIsoCode
                                      );
                                      formik.setFieldValue(
                                        "state",
                                        stateIsoCode
                                      );
                                    }}
                                    onMenuOpen={() => setIsDropdownOpen(true)}
                                    onMenuClose={() => setIsDropdownOpen(false)}
                                    placeholder="Select State"
                                    isClearable
                                    isDisabled={!formik.values.country}
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
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>City</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Select
                                    className="custom-select-height"
                                    options={cityDropDownList?.map((city) => {
                                      const cityName =
                                        typeof city === "string"
                                          ? city
                                          : city.name;
                                      return {
                                        value: cityName,
                                        label: cityName,
                                      };
                                    })}
                                    value={
                                      formik.values.city
                                        ? {
                                          value: formik.values.city,
                                          label: formik.values.city,
                                        }
                                        : null
                                    }
                                    onChange={(option) => {
                                      const cityName = option
                                        ? option.value
                                        : "";
                                      formik.setFieldValue("city", cityName);
                                    }}
                                    onMenuOpen={() => setIsDropdownOpen(true)}
                                    onMenuClose={() => setIsDropdownOpen(false)}
                                    placeholder="Select City"
                                    isClearable
                                    isSearchable
                                    isDisabled={!formik.values.state}
                                    noOptionsMessage={() =>
                                      "No cities available"
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
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        ) : (
                          <>
                            {userRole !== "b2bMember" &&
                              userRole !== "B2B Member" &&
                              userRole !== "Branch Member" &&
                              userRole !== "Student" &&
                              userRole !== "Coaching Faculty" && (
                                <Form.Group className="my-2">
                                  <Row className="row-sm">
                                    <Col md={3}>
                                      <Form.Label>Country</Form.Label>
                                    </Col>
                                    <Col md={9}>
                                      <Select
                                        className="custom-select-height"
                                        options={countries?.map((c) => ({
                                          value: c.isoCode,
                                          label: c.name,
                                        }))}
                                        value={
                                          formik.values.country
                                            ? {
                                              value: formik.values.country[0],
                                              label:
                                                countries.find(
                                                  (c) =>
                                                    c.isoCode ===
                                                    formik.values.country[0]
                                                )?.name ||
                                                formik.values.country[0],
                                            }
                                            : null
                                        }
                                        onChange={(option) => {
                                          const countryIsoCode = option
                                            ? option.value
                                            : "";
                                          handleCountryChange(countryIsoCode);
                                          formik.setFieldValue(
                                            "country",
                                            countryIsoCode
                                              ? [countryIsoCode]
                                              : []
                                          );
                                        }}
                                        onMenuOpen={() =>
                                          setIsDropdownOpen(true)
                                        }
                                        onMenuClose={() =>
                                          setIsDropdownOpen(false)
                                        }
                                        placeholder="Select Country"
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
                                    </Col>
                                  </Row>
                                </Form.Group>
                              )}
                          </>
                        )}

                        {userRole === "Student" && (
                          <Form.Group className="my-2">
                            <Row className="row-sm">
                              <Col md={3}>
                                <Form.Label>Country</Form.Label>
                              </Col>
                              <Col md={9}>
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
                                            (c) =>
                                              c.isoCode ===
                                              formik.values.country
                                          )?.name || formik.values.country,
                                      }
                                      : null
                                  }
                                  onChange={(option) => {
                                    const countryIsoCode = option
                                      ? option.value
                                      : "";
                                    handleCountryChange(countryIsoCode);
                                    formik.setFieldValue(
                                      "country",
                                      countryIsoCode
                                    );
                                  }}
                                  onMenuOpen={() => setIsDropdownOpen(true)}
                                  onMenuClose={() => setIsDropdownOpen(false)}
                                  placeholder="Select Country"
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
                                {formik.touched.country &&
                                  formik.errors.country && (
                                    <div className="text-danger">
                                      {formik.errors.country}
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </Form.Group>
                        )}

                        {userRole !== "b2bMember" &&
                          userRole !== "B2B Member" &&
                          userRole !== "Branch" &&
                          userRole !== "Branch Member" &&
                          userRole !== "Student" &&
                          userRole !== "Coaching Faculty" && (
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>
                                    {userRole === "b2bAdmin" ||
                                      userRole === "B2B Admin"
                                      ? "Company Logo"
                                      : "Profile Image"}
                                  </Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    type="file"
                                    name="profileImage"
                                    className="custom-select-height"
                                    accept="image/*"
                                    onChange={(event) => {
                                      const file = event.currentTarget.files[0];
                                      formik.setFieldValue("profileImage", file);
                                      setProfilePreview(
                                        file ? URL.createObjectURL(file) : null
                                      );
                                    }}
                                  />
                                  
                                  {(profilePreview ||
                                    (userRole === "b2bAdmin" ||
                                      userRole === "B2B Admin"
                                      ? b2BAdminData?.logo
                                      : b2bMemberData?.profileImage)) && (
                                      <div
                                        className="mb-2 mt-2"
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
                                          src={
                                            profilePreview
                                              ? profilePreview
                                              : userRole === "b2bAdmin" ||
                                                userRole === "B2B Admin"
                                                ? `${REACT_APP_API_URL}/${b2BAdminData?.logo?.replace(
                                                  /\\/g,
                                                  "/"
                                                )}`
                                                : `${REACT_APP_API_URL}/${b2bMemberData?.profileImage?.replace(
                                                  /\\/g,
                                                  "/"
                                                )}`
                                          }
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
                              </Row>
                            </Form.Group>
                          )}

                        {userRole === "b2bAdmin" || userRole === "B2B Admin" ? (
                          <>
                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Website URL</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    className="custom-select-height"
                                    type="text"
                                    placeholder="Website URL"
                                    name="websiteUrl"
                                    value={formik.values.websiteUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>

                            <hr className="my-4" />

                            <div className="mb-4 main-content-label">
                              Bank Details
                            </div>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Bank Name</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    className="custom-select-height"
                                    type="text"
                                    placeholder="Bank Name"
                                    name="bankName"
                                    value={formik.values.bankName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Branch</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    name="branch"
                                    placeholder="Enter Branch"
                                    type="text"
                                    className="custom-select-height"
                                    value={formik.values.branch}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Account Number</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    name="accountNumber"
                                    placeholder="Enter Account Number"
                                    type="text"
                                    className="custom-select-height"
                                    value={formik.values.accountNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>IFSC Code</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    name="ifscCode"
                                    placeholder="Enter IFSC Code"
                                    type="text"
                                    className="custom-select-height"
                                    value={formik.values.ifscCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>

                            <Form.Group className="my-2">
                              <Row className="row-sm">
                                <Col md={3}>
                                  <Form.Label>Cancelled Cheque</Form.Label>
                                </Col>
                                <Col md={9}>
                                  <Form.Control
                                    type="file"
                                    name="cancelCheque"
                                    className="custom-select-height"
                                    accept="image/*"
                                    onChange={(event) => {
                                      const file = event.currentTarget.files[0];
                                      formik.setFieldValue(
                                        "cancelCheque",
                                        file
                                      );
                                      setCheckPreview(
                                        file ? URL.createObjectURL(file) : null
                                      );
                                    }}
                                    onBlur={formik.handleBlur}
                                  />
                                  {(checkPreview ||
                                    b2BAdminData?.cancelChequeImage) && (
                                      <div
                                        className="mb-2 mt-2"
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
                                          src={
                                            checkPreview
                                              ? checkPreview
                                              : b2BAdminData?.cancelChequeImage
                                                ? `${REACT_APP_API_URL}/${b2BAdminData.cancelChequeImage.replace(
                                                  /\\/g,
                                                  "/"
                                                )}`
                                                : ""
                                          }
                                          alt="Cancelled Cheque Preview"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                          }}
                                        />
                                      </div>
                                    )}
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        ) : null}

                        <Form.Group className="mt-3">
                          <Row className="row-sm">
                            <Col md={12} className="text-end">
                              <Button
                                className="custom-select-height"
                                type="submit"
                                variant="primary"
                                disabled={
                                  !isFormChanged() || formik.isSubmitting
                                }
                              >
                                {formik.isSubmitting
                                  ? "Updating..."
                                  : "Update Profile"}
                              </Button>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="timeline">
                  <div className="main-content-body main-content-body-profile">
                    <div className="main-profile-body p-0">
                      <div className="row row-sm">
                        <div className="col-12">
                          <div className="card mg-b-20 border">
                            <div className="card-header p-4 d-block">
                              <div className="media">
                                <div className="media-user me-2">
                                  <div className="main-img-user avatar-md">
                                    <img
                                      alt=""
                                      className="rounded-circle"
                                      src={ALLImages("face6")}
                                    />
                                  </div>
                                </div>
                                <div className="media-body">
                                  <h6 className="mb-0 mg-t-2 ms-2">
                                    Mintrona Pechon Pechon
                                  </h6>
                                  <span className="text-primary ms-2">
                                    just now
                                  </span>{" "}
                                </div>
                                <div className="ms-auto">
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      as="a"
                                      className="new no-caret option-dots2"
                                      variant=""
                                      id="dropdown-basic"
                                    >
                                      <i className="fas fa-ellipsis-v"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu-end shadow">
                                      <Dropdown.Item>Edit Post</Dropdown.Item>
                                      <Dropdown.Item>Delete Post</Dropdown.Item>
                                      <Dropdown.Item>
                                        Personal Settings
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                            <div className="card-body">
                              <p className="mg-t-0">
                                There are many variations of passages of Lorem
                                Ipsum available, but the majority have suffered
                                alteration in some form, by injected humour, or
                                randomised words which don't look even slightly
                                believable.
                              </p>
                              <div className="row row-sm">
                                <div className="col">
                                  <img
                                    alt="img"
                                    className="wd-200 me-4 br-4"
                                    src={ALLImages("media4")}
                                  />
                                  <img
                                    alt="img"
                                    className="wd-200 br-4 mt-2 mt-sm-0"
                                    src={ALLImages("media5")}
                                  />
                                </div>
                              </div>
                              <div className="media mg-t-15 profile-footer">
                                <div className="media-user me-2">
                                  <div className="avatar-list-stacked">
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face1")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face3")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face2")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img
                                        src={ALLImages("face10")}
                                        alt="img"
                                      />
                                    </span>
                                    <Link
                                      className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                                      to="#"
                                    >
                                      +8
                                    </Link>
                                  </div>
                                </div>
                                <div className="media-body">
                                  <h6 className="mb-0 mg-t-10">
                                    28 people like your photo
                                  </h6>{" "}
                                </div>
                                <div className="ms-auto mt-1 mt-sm-0">
                                  <div className="dropdown show">
                                    <Link className="new" to="#">
                                      <i className="far fa-heart me-3"></i>
                                    </Link>
                                    <Link className="new" to="#">
                                      <i className="far fa-comment me-3"></i>
                                    </Link>
                                    <Link className="new" to="#">
                                      <i className="far fa-share-square"></i>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card mg-b-20 border">
                            <div className="card-header p-4 d-block">
                              <div className="media">
                                <div className="media-user me-2">
                                  <div className="main-img-user avatar-md">
                                    <img
                                      alt=""
                                      className="rounded-circle"
                                      src={ALLImages("face6")}
                                    />
                                  </div>
                                </div>
                                <div className="media-body">
                                  <h6 className="mb-0 ms-2 mg-t-3">
                                    Mintrona Pechon Pechon
                                  </h6>
                                  <span className="text-muted ms-2">
                                    Sep 26 2019, 10:14am
                                  </span>{" "}
                                </div>
                                <div className="ms-auto">
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      as="a"
                                      className="new no-caret option-dots2"
                                      variant=""
                                      id="dropdown-basic"
                                    >
                                      <i className="fas fa-ellipsis-v"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu-end shadow">
                                      <Dropdown.Item>Edit Post</Dropdown.Item>
                                      <Dropdown.Item>Delete Post</Dropdown.Item>
                                      <Dropdown.Item>
                                        Personal Settings
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                            <div className="card-body h-100">
                              <p className="mg-t-0">
                                There are many variations of passages of Lorem
                                Ipsum available, but the majority have suffered
                                alteration in some form, by injected humour, or
                                randomised words which don't look even slightly
                                believable.
                              </p>
                              <div className="row row-sm">
                                <div className="col">
                                  <img
                                    alt="img"
                                    className="wd-200 mt-2 mt-sm-0 me-4 br-4"
                                    src={ALLImages("media9")}
                                  />
                                  <img
                                    alt="img"
                                    className="wd-200 mt-2 mt-sm-0 br-4"
                                    src={ALLImages("media12")}
                                  />
                                </div>
                              </div>
                              <div className="media mg-t-15 profile-footer">
                                <div className="media-user me-2">
                                  <div className="avatar-list-stacked">
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face1")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face3")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face2")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img
                                        src={ALLImages("face10")}
                                        alt="img"
                                      />
                                    </span>
                                    <Link
                                      className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                                      to="#"
                                    >
                                      +8
                                    </Link>
                                  </div>
                                </div>
                                <div className="media-body">
                                  <h6 className="mb-0 mg-t-10">
                                    28 people like your photo
                                  </h6>{" "}
                                </div>
                                <div className="ms-auto mt-1 mt-sm-0">
                                  <div className="dropdown show">
                                    {" "}
                                    <Link className="new" to="#">
                                      <i className="far fa-heart me-3"></i>
                                    </Link>{" "}
                                    <Link className="new" to="#">
                                      <i className="far fa-comment me-3"></i>
                                    </Link>{" "}
                                    <Link className="new" to="#">
                                      <i className="far fa-share-square"></i>
                                    </Link>{" "}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card mg-b-20 border">
                            <div className="card-header p-4 d-block">
                              <div className="media">
                                <div className="media-user me-2">
                                  <div className="main-img-user avatar-md">
                                    <img
                                      alt=""
                                      className="rounded-circle"
                                      src={ALLImages("face6")}
                                    />
                                  </div>
                                </div>
                                <div className="media-body">
                                  <h6 className="mb-0 ms-2 mg-t-3">
                                    Mintrona Pechon Pechon
                                  </h6>
                                  <span className="text-muted ms-2">
                                    Sep 26 2019, 10:14am
                                  </span>{" "}
                                </div>
                                <div className="ms-auto">
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      as="a"
                                      className="new no-caret option-dots2"
                                      variant=""
                                      id="dropdown-basic"
                                    >
                                      <i className="fas fa-ellipsis-v"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu-end shadow">
                                      <Dropdown.Item>Edit Post</Dropdown.Item>
                                      <Dropdown.Item>Delete Post</Dropdown.Item>
                                      <Dropdown.Item>
                                        Personal Settings
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                            <div className="card-body h-100">
                              <p className="mg-t-0">
                                There are many variations of passages of Lorem
                                Ipsum available, but the majority have suffered
                                alteration in some form, by injected humour, or
                                randomised words which don't look even slightly
                                believable.
                              </p>
                              <div className="media mg-t-15 profile-footer">
                                <div className="media-user me-2">
                                  <div className="avatar-list-stacked">
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face1")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face3")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face2")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img
                                        src={ALLImages("face10")}
                                        alt="img"
                                      />
                                    </span>
                                    <Link
                                      className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                                      to="#"
                                    >
                                      +8
                                    </Link>
                                  </div>
                                </div>
                                <div className="media-body">
                                  <h6 className="mb-0 mg-t-10">
                                    28 people like your photo
                                  </h6>{" "}
                                </div>
                                <div className="ms-auto mt-1 mt-sm-0">
                                  <div className="dropdown show">
                                    <Link className="new" to="#">
                                      <i className="far fa-heart me-3"></i>
                                    </Link>
                                    <Link className="new" to="#">
                                      <i className="far fa-comment me-3"></i>
                                    </Link>
                                    <Link className="new" to="#">
                                      <i className="far fa-share-square"></i>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card border">
                            <div className="card-header p-4 d-block">
                              <div className="media">
                                <div className="media-user me-2">
                                  <div className="main-img-user avatar-md">
                                    <img
                                      alt=""
                                      className="rounded-circle"
                                      src={ALLImages("face2")}
                                    />
                                  </div>
                                </div>
                                <div className="media-body">
                                  <h6 className="mb-0 ms-2 mg-t-3">
                                    Mintrona Pechon Pechon
                                  </h6>
                                  <span className="text-muted ms-2">
                                    Sep 26 2019, 10:14am
                                  </span>{" "}
                                </div>
                                <div className="ms-auto">
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      as="a"
                                      className="new no-caret option-dots2"
                                      variant=""
                                      id="dropdown-basic"
                                    >
                                      <i className="fas fa-ellipsis-v"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu-end shadow">
                                      <Dropdown.Item>Edit Post</Dropdown.Item>
                                      <Dropdown.Item>Delete Post</Dropdown.Item>
                                      <Dropdown.Item>
                                        Personal Settings
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                            <div className="card-body h-100">
                              <p className="mg-t-0">
                                There are many variations of passages of Lorem
                                Ipsum available, but the majority have suffered
                                alteration in some form, by injected humour, or
                                randomised words which don't look even slightly
                                believable.
                              </p>
                              <div className="row row-sm">
                                <div className="col">
                                  <img
                                    alt="img"
                                    className="wd-200 me-3 br-4 mt-2 mt-sm-0"
                                    src={ALLImages("media9")}
                                  />
                                  <img
                                    alt="img"
                                    className="wd-200 br-4 mt-2 mt-sm-0"
                                    src={ALLImages("media17")}
                                  />
                                </div>
                              </div>
                              <div className="media mg-t-15 profile-footer">
                                <div className="media-user me-2">
                                  <div className="avatar-list-stacked">
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face1")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face3")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img src={ALLImages("face2")} alt="img" />
                                    </span>
                                    <span className="avatar avatar-sm avatar-rounded">
                                      <img
                                        src={ALLImages("face10")}
                                        alt="img"
                                      />
                                    </span>
                                    <Link
                                      className="avatar avatar-sm bg-primary avatar-rounded text-fixed-white"
                                      to="#"
                                    >
                                      +8
                                    </Link>
                                  </div>
                                </div>
                                <div className="media-body">
                                  <h6 className="mb-0 mg-t-10">
                                    28 people like your photo
                                  </h6>{" "}
                                </div>
                                <div className="ms-auto mt-1 mt-sm-0">
                                  <div className="dropdown show">
                                    <Link className="new" to="#">
                                      <i className="far fa-heart me-3"></i>
                                    </Link>
                                    <Link className="new" to="#">
                                      <i className="far fa-comment me-3"></i>
                                    </Link>
                                    <Link className="new" to="#">
                                      <i className="far fa-share-square"></i>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="gallery">
                  <Card.Body className="border">
                    <Row>
                      <Col lg={3} md={3} sm={6} col={12}>
                        <Link
                          to="#"
                          className="glightbox card"
                          onClick={() => setOpen(true)}
                        >
                          <img src={ALLImages("media4")} alt="image" />
                        </Link>
                      </Col>
                      <Col lg={3} md={3} sm={6} col={12}>
                        <Link
                          to="#"
                          className="glightbox card"
                          onClick={() => setOpen(true)}
                        >
                          <img src={ALLImages("media5")} alt="image" />
                        </Link>
                      </Col>
                      <Col lg={3} md={3} sm={6} col={12}>
                        <Link
                          to="#"
                          className="glightbox card"
                          onClick={() => setOpen(true)}
                        >
                          {" "}
                          <img src={ALLImages("media8")} alt="image" />
                        </Link>
                      </Col>
                      <Col lg={3} md={3} sm={6} col={12}>
                        <Link
                          to="#"
                          className="glightbox card"
                          onClick={() => setOpen(true)}
                        >
                          <img src={ALLImages("media9")} alt="image" />
                        </Link>
                      </Col>
                      <Col lg={3} md={3} sm={6} col={12}>
                        <Link
                          to="#"
                          className="glightbox card"
                          onClick={() => setOpen(true)}
                        >
                          <img src={ALLImages("media12")} alt="image" />
                        </Link>
                      </Col>
                      <Col lg={3} md={3} sm={6} col={12}>
                        <Link
                          to="#"
                          className="glightbox card"
                          onClick={() => setOpen(true)}
                        >
                          <img src={ALLImages("media15")} alt="image" />
                        </Link>
                      </Col>
                      <Col lg={3} md={3} sm={6} col={12}>
                        <Link
                          to="#"
                          className="glightbox card"
                          onClick={() => setOpen(true)}
                        >
                          <img src={ALLImages("media17")} alt="image" />
                        </Link>
                      </Col>
                      <Col lg={3} md={3} sm={6} col={12}>
                        <Link
                          to="#"
                          className="glightbox card"
                          onClick={() => setOpen(true)}
                        >
                          <img src={ALLImages("media5")} alt="image" />
                        </Link>
                      </Col>
                      <Lightbox
                        open={open}
                        close={() => setOpen(false)}
                        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                        zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
                        slides={[
                          { src: ALLImages("media4") },
                          { src: ALLImages("media5") },
                          { src: ALLImages("media8") },
                          { src: ALLImages("media9") },
                          { src: ALLImages("media12") },
                          { src: ALLImages("media15") },
                          { src: ALLImages("media17") },
                          { src: ALLImages("media5") },
                        ]}
                      />
                    </Row>
                  </Card.Body>
                </Tab.Pane>
                <Tab.Pane
                  eventKey="friends"
                  className="main-content-body tab-pane border-top-0"
                >
                  <Card.Body className="pd-b-10">
                    <Row className="row-sm">
                      <Col sm={12} md={6} xl={3}>
                        <Card className="custom-card border p-2">
                          <div className=" text-center card-body">
                            <div className="user-lock text-center">
                              <Dropdown className="text-end">
                                <Dropdown.Toggle
                                  as="a"
                                  variant=""
                                  className="no-caret"
                                >
                                  {" "}
                                  <i className="fe fe-more-vertical"></i>{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                  className=" dropdown-menu-end"
                                  style={{ marginTop: "0px" }}
                                >
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-message-square me-2"></i>{" "}
                                    Message
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-edit-2 me-2"></i> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-eye me-2"></i> View{" "}
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-trash-2 me-2"></i>{" "}
                                    Delete{" "}
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <Link to="#">
                                {" "}
                                <img
                                  alt="avatar"
                                  className="rounded-circle"
                                  src={ALLImages("face4")}
                                />{" "}
                              </Link>
                            </div>
                            <Link to="#">
                              {" "}
                              <h6 className=" mb-1 mt-3 main-content-label">
                                {" "}
                                Socrates Itumay{" "}
                              </h6>{" "}
                            </Link>
                            <p className="mb-2 mt-1"> Project Manager </p>
                            <p className="text-muted text-center mt-1">
                              Lorem Ipsum is not simply popular belief Contrary.
                            </p>
                          </div>
                        </Card>
                      </Col>
                      <Col sm={12} md={6} lg={6} xl={3}>
                        <Card className="custom-card border p-2">
                          <div className=" text-center card-body">
                            <div className="user-lock text-center">
                              <Dropdown className="text-end">
                                <Dropdown.Toggle
                                  as="a"
                                  className="no-caret"
                                  variant=""
                                >
                                  {" "}
                                  <i className="fe fe-more-vertical"></i>{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                  className=" dropdown-menu-end"
                                  style={{ marginTop: "0px" }}
                                >
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-message-square me-2"></i>{" "}
                                    Message
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-edit-2 me-2"></i> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-eye me-2"></i> View{" "}
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-trash-2 me-2"></i>{" "}
                                    Delete{" "}
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <Link to="#">
                                {" "}
                                <img
                                  alt="avatar"
                                  className="rounded-circle"
                                  src={ALLImages("face3")}
                                />{" "}
                              </Link>
                            </div>
                            <Link to="#">
                              {" "}
                              <h6 className="mb-1 mt-3  main-content-label">
                                {" "}
                                Reynante Labares{" "}
                              </h6>{" "}
                            </Link>
                            <p className="mb-2 mt-1"> Web Designer </p>
                            <p className="text-muted text-center mt-1">
                              Lorem Ipsum is not simply popular belief Contrary.
                            </p>
                          </div>
                        </Card>
                      </Col>
                      <Col sm={12} md={6} lg={6} xl={3}>
                        <Card className="custom-card border p-2">
                          <div className=" text-center card-body">
                            <div className="user-lock text-center">
                              <Dropdown className="text-end">
                                <Dropdown.Toggle
                                  as="a"
                                  className="no-caret"
                                  variant=""
                                >
                                  {" "}
                                  <i className="fe fe-more-vertical"></i>{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                  className=" dropdown-menu-end"
                                  style={{ marginTop: "0px" }}
                                >
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-message-square me-2"></i>{" "}
                                    Message
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-edit-2 me-2"></i> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-eye me-2"></i> View{" "}
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-trash-2 me-2"></i>{" "}
                                    Delete{" "}
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <Link to="#">
                                {" "}
                                <img
                                  alt="avatar"
                                  className="rounded-circle"
                                  src={ALLImages("face4")}
                                />{" "}
                              </Link>
                            </div>
                            <Link to="#">
                              {" "}
                              <h6 className="mb-1 mt-3 main-content-label">
                                {" "}
                                Owen Bongcaras{" "}
                              </h6>{" "}
                            </Link>
                            <p className="mb-2 mt-1"> App Developer </p>
                            <p className="text-muted text-center mt-1">
                              Lorem Ipsum is not simply popular belief Contrary.
                            </p>
                          </div>
                        </Card>
                      </Col>
                      <Col sm={12} md={6} lg={6} xl={3}>
                        <Card className="custom-card border p-2">
                          <div className=" text-center card-body">
                            <div className="text-center">
                              <div className="user-lock text-center">
                                <Dropdown className="text-end">
                                  <Dropdown.Toggle
                                    as="a"
                                    className="no-caret"
                                    variant=""
                                  >
                                    <i className="fe fe-more-vertical"></i>{" "}
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu
                                    className=" dropdown-menu-end"
                                    style={{ marginTop: "0px" }}
                                  >
                                    <Dropdown.Item>
                                      {" "}
                                      <i className="fe fe-message-square me-2"></i>{" "}
                                      Message
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      {" "}
                                      <i className="fe fe-edit-2 me-2"></i> Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      {" "}
                                      <i className="fe fe-eye me-2"></i> View{" "}
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      {" "}
                                      <i className="fe fe-trash-2 me-2"></i>{" "}
                                      Delete{" "}
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                                <Link to="#">
                                  {" "}
                                  <img
                                    alt="avatar"
                                    className="rounded-circle"
                                    src={ALLImages("face7")}
                                  />{" "}
                                </Link>
                              </div>
                              <Link to="#">
                                {" "}
                                <h6 className="mb-1 mt-3 main-content-label">
                                  {" "}
                                  Stephen Metcalfe{" "}
                                </h6>{" "}
                              </Link>
                              <p className="mb-2 mt-1"> Administrator </p>
                              <p className="text-muted text-center mt-1">
                                Lorem Ipsum is not simply popular belief
                                Contrary.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col sm={12} md={6} lg={6} xl={3}>
                        <Card className="custom-card border p-2">
                          <div className=" text-center card-body">
                            <div className="user-lock text-center">
                              <Dropdown className="text-end">
                                <Dropdown.Toggle
                                  as="a"
                                  className="no-caret"
                                  variant=""
                                >
                                  {" "}
                                  <i className="fe fe-more-vertical"></i>{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                  className=" dropdown-menu-end"
                                  style={{ marginTop: "0px" }}
                                >
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-message-square me-2"></i>{" "}
                                    Message
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-edit-2 me-2"></i> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-eye me-2"></i> View{" "}
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-trash-2 me-2"></i>{" "}
                                    Delete{" "}
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <Link to="#">
                                {" "}
                                <img
                                  alt="avatar"
                                  className="rounded-circle"
                                  src={ALLImages("face2")}
                                />{" "}
                              </Link>
                            </div>
                            <Link to="#">
                              {" "}
                              <h6 className=" mb-1 mt-3 main-content-label">
                                {" "}
                                Socrates Itumay{" "}
                              </h6>{" "}
                            </Link>
                            <p className="mb-2 mt-1"> Project Manager </p>
                            <p className="text-muted text-center mt-1">
                              Lorem Ipsum is not simply popular belief Contrary.
                            </p>
                          </div>
                        </Card>
                      </Col>
                      <Col sm={12} md={6} lg={6} xl={3}>
                        <Card className="custom-card border p-2">
                          <div className=" text-center card-body">
                            <div className="user-lock text-center">
                              <Dropdown className="text-end">
                                <Dropdown.Toggle
                                  as="a"
                                  className="no-caret"
                                  variant=""
                                >
                                  {" "}
                                  <i className="fe fe-more-vertical"></i>{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                  className=" dropdown-menu-end"
                                  style={{ marginTop: "0px" }}
                                >
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-message-square me-2"></i>{" "}
                                    Message
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-edit-2 me-2"></i> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-eye me-2"></i> View{" "}
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-trash-2 me-2"></i>{" "}
                                    Delete{" "}
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <Link to="#">
                                {" "}
                                <img
                                  className="rounded-circle"
                                  src={ALLImages("face1")}
                                  alt="img"
                                />{" "}
                              </Link>
                            </div>
                            <Link to="#">
                              {" "}
                              <h6 className="mb-1 mt-3  main-content-label">
                                {" "}
                                Reynante Labares{" "}
                              </h6>{" "}
                            </Link>
                            <p className="mb-2 mt-1"> Web Designer </p>
                            <p className="text-muted text-center mt-1">
                              Lorem Ipsum is not simply popular belief Contrary.
                            </p>
                          </div>
                        </Card>
                      </Col>
                      <Col sm={12} md={6} lg={6} xl={3}>
                        <Card className="custom-card border p-2">
                          <div className=" text-center card-body">
                            <div className="user-lock text-center">
                              <Dropdown className="text-end">
                                <Dropdown.Toggle
                                  as="a"
                                  className="no-caret"
                                  variant=""
                                >
                                  {" "}
                                  <i className="fe fe-more-vertical"></i>{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                  className=" dropdown-menu-end"
                                  style={{ marginTop: "0px" }}
                                >
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-message-square me-2"></i>{" "}
                                    Message
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-edit-2 me-2"></i> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-eye me-2"></i> View{" "}
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-trash-2 me-2"></i>{" "}
                                    Delete{" "}
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <Link to="#">
                                {" "}
                                <img
                                  alt="avatar"
                                  className="rounded-circle"
                                  src={ALLImages("face4")}
                                />{" "}
                              </Link>
                            </div>

                            <Link to="#">
                              {" "}
                              <h6 className="mb-1 mt-3 main-content-label">
                                {" "}
                                Owen Bongcaras{" "}
                              </h6>{" "}
                            </Link>
                            <p className="mb-2 mt-1"> App Developer </p>
                            <p className="text-muted text-center mt-1">
                              Lorem Ipsum is not simply popular belief Contrary.
                            </p>
                          </div>
                        </Card>
                      </Col>
                      <Col sm={12} md={6} lg={6} xl={3}>
                        <Card className="custom-card border p-2">
                          <div className=" text-center card-body">
                            <div className="user-lock text-center">
                              <Dropdown className="text-end">
                                <Dropdown.Toggle
                                  as="a"
                                  className="no-caret"
                                  variant=""
                                >
                                  {" "}
                                  <i className="fe fe-more-vertical"></i>{" "}
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                  className=" dropdown-menu-end"
                                  style={{ marginTop: "0px" }}
                                >
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-message-square me-2"></i>{" "}
                                    Message
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-edit-2 me-2"></i> Edit
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-eye me-2"></i> View{" "}
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    {" "}
                                    <i className="fe fe-trash-2 me-2"></i>{" "}
                                    Delete{" "}
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              <Link to="#">
                                {" "}
                                <img
                                  alt="avatar"
                                  className="rounded-circle"
                                  src={ALLImages("face9")}
                                />{" "}
                              </Link>
                            </div>
                            <Link to="#">
                              {" "}
                              <h6 className="mb-1 mt-3 main-content-label">
                                {" "}
                                Stephen Metcalfe{" "}
                              </h6>{" "}
                            </Link>
                            <p className="mb-2 mt-1"> Administrator </p>
                            <p className="text-muted text-center mt-1">
                              Lorem Ipsum is not simply popular belief Contrary.
                            </p>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                  {/* </div> */}
                </Tab.Pane>
                <Tab.Pane eventKey="accountsetting">
                  <div className="main-content-body tab-pane p-sm-4 p-0 border-top-0">
                    <Card.Body className="border" data-select2-id="12">
                      <Form className="form-horizontal" data-select2-id="11">
                        <div className="mb-4 main-content-label">Account</div>
                        <Form.Group className="my-2">
                          <Row className=" row-sm">
                            <Col md={3}>
                              <Form.Label>User Name</Form.Label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                placeholder="User Name"
                                defaultValue="User logout"
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                        <Form.Group className="my-2">
                          <Row className=" row-sm">
                            <Col md={3}>
                              <Form.Label>Email</Form.Label>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                placeholder="Email"
                                defaultValue="info@SoniaTaylor.in"
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                        <FormGroup className="my-2">
                          <Row>
                            <Col md={3}>
                              <Form.Label>Language</Form.Label>
                            </Col>
                            <Col md={9} data-select2-id="106">
                              <Select
                                options={Languageoptions}
                                classNamePrefix="Select2"
                                placeholder="US English"
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup className="my-2">
                          <Row>
                            <Col md={3}>
                              <Form.Label>Timezone</Form.Label>
                            </Col>
                            <Col md={9} data-select2-id="8">
                              <Select
                                options={TimeZoneData}
                                classNamePrefix="Select2"
                                placeholder="(GMT-11:00) Midway Island, Samoa"
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                        <Form.Group className="my-2">
                          <Row className="row-sm">
                            <Col md={3} className="col">
                              <Form.Label>Verification </Form.Label>
                            </Col>
                            <Col md={9} className="col">
                              <Form.Check
                                className=" mg-b-10-f"
                                type="checkbox"
                                label="Email"
                              />
                              <Form.Check
                                className=" mg-b-10-f"
                                defaultChecked
                                type="checkbox"
                                label="SMS"
                              />
                              <Form.Check
                                className=" mg-b-10-f"
                                type="checkbox"
                                label="PHONE"
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                        <div className="mb-4 main-content-label">
                          {" "}
                          Secuirity Settings{" "}
                        </div>
                        <Form.Group className="my-2">
                          <Row className="row-sm">
                            <Col md={2}>
                              <Form.Label> Login Verification </Form.Label>
                            </Col>
                            <Col md={10}>
                              <Link to="#" className="">
                                {" "}
                                Set up Verification{" "}
                              </Link>
                            </Col>
                          </Row>
                        </Form.Group>
                        <Form.Group className="my-2">
                          <Row className=" row-sm">
                            <Col md={2}>
                              <Form.Label> Password Verification </Form.Label>
                            </Col>
                            <Col md={10}>
                              <Form.Label className="mg-b-10-f">
                                <Form.Check
                                  type="checkbox"
                                  label="Require Personal Details"
                                />
                              </Form.Label>
                            </Col>
                          </Row>
                        </Form.Group>
                        <Form.Group className="my-2">
                          <Row className=" row-sm">
                            <Col md={2} />
                            <Col md={10} className="d-inline-flex">
                              <Link to="#" className="me-4">
                                {" "}
                                Deactivate Account{" "}
                              </Link>
                              <Link to="#" className="mx-2">
                                {" "}
                                Change Password{" "}
                              </Link>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Fragment>
  );
};

export default Profile;
