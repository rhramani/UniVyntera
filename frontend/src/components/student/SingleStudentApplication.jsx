import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState, useRef, useCallback } from "react";
import { MdCalendarToday } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  createStudentApplication,
  updateStudentApplication,
  deleteStudentApplication,
  studentApplicationClone,
  getOneStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";
import Select from "react-select";
import {
  cityDropdown,
  countryDropdown,
  stateDropdown,
} from "../../redux/actions/Master/Institute.action";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import usePermissions from "../commonComponents/usePermissions";
import WhatsappMessageModal from "../crm/commonLeadForm/WhatsAppModal";
import { sendWPMessage } from "../../redux/actions/Lead.action";
import {
  countryDropDownCourse,
  getOneCourseFinder,
} from "../../redux/actions/CourseFinder.action";
import { decryptData } from "../../utils/encryptionUtils";
import { getAllStudentStatus } from "../../redux/actions/Student/StudentStatus.action";
import ChatComponent from "./studentDetails/chat/ChatComponent";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { getAllInterestedCourseStatus } from "../../redux/actions/Master/InterestedCourseStatus.action";
import { useNotification } from "../../context/NotificationContext";
import { leaveRoom, markNotificationsAsRead } from "../../socket";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSocket } from "../../context/SocketContext";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import {
  getAllSubPlan,
  getOneSubPlan,
} from "../../redux/actions/Master/SubPlan.action";
import WaDaddyWhatsAppModal from "../crm/commonLeadForm/WaDaddyWhatsAppModal";
import StudentApplicationForm from "./studentDetails/StudentApplicationForm";
import StudentApplicationCard from "./studentDetails/StudentApplicationCard";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const SingleStudentApplication = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const { notificationCount, notifications } = useNotification();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [oneCourseData, setOneCourseData] = useState();

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [allStudentApplication, setAllStudentApplication] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [showAccountDetails, setShowAccountDetails] = useState(true);
  const [countries, setCountries] = useState([]);
  const [preferredCountries, setPreferredCountries] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [studentStatuses, setStudentStatuses] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [interestedCourseStatus, setInterestedCourseStatus] = useState([]);
  const [mainPlans, setMainPlans] = useState([]);
  const [studentSubPlans, setStudentSubPlans] = useState([]);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [selectedLeadName, setSelectedLeadName] = useState("");
  const [selectedMobileNumber, setSelectedMobileNumber] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatStudent, setChatStudent] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [isWaDaddyWhatsappModalOpen, setIsWaDaddyWhatsappModalOpen] =
    useState(false);
  const [selectedWaDaddyWhatsappData, setSelecteWaDaddyWhatsappdData] =
    useState(null);

  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));
  const userId = decryptData(localStorage.getItem("userId"));
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Student Applications",
  );

  // course
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [selectedIntakeMonth, setSelectedIntakeMonth] = useState("");
  const [selectedIntakeYear, setSelectedIntakeYear] = useState("");

  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (socket && chatStudent) {
      socket.emit("joinRoom", { studentId: chatStudent._id, role: userRole });
      return () => {
        leaveRoom(socket, { studentId: chatStudent._id, role: userRole });
      };
    }
  }, [socket, chatStudent, userRole]);

  const handleSendMessage = async (payload) => {
    try {
      const apiPayload = {
        phoneNumber: payload.mobileNumber,
        categoryId: payload.categoryId,
        customMessage: payload.customMessage,
      };
      const response = await dispatch(sendWPMessage(apiPayload));
      const whatsappUrl = response.data;
      window.open(whatsappUrl?.data, "_blank");
    } catch (error) {
      console.error("Failed to send WhatsApp message:", error);
      toast.error(error.message || "Failed to send WhatsApp message");
    }
  };

  useEffect(() => {
    if (cloneModalOpen || isWhatsappModalOpen || show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [cloneModalOpen, isWhatsappModalOpen, show]);

  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };

  const handleClose = () => {
    setShow(false);
    if (courseId) {
      setOneCourseData(null);
      navigate(location.pathname, { replace: true });
    }
  };

  const fetchOneCourse = async (courseId) => {
    const res = await dispatch(getOneCourseFinder(courseId));
    setOneCourseData(res?.data?.data);
  };

  useEffect(() => {
    if (courseId) {
      // handleShow();
      fetchOneCourse(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (oneCourseData && courseId) {
      // ✅ Open the intake selection modal first
      setShowIntakeModal(true);
    }
  }, [oneCourseData]);

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchPreferredCountries = async () => {
    const res = await dispatch(countryDropDownCourse());
    setPreferredCountries(res?.data?.data || []);
  };

  const handleCountryChange = async (countryIsoCode) => {
    try {
      if (!countryIsoCode || countryIsoCode.trim() === "") {
        return;
      }
      formik.setFieldValue("country", countryIsoCode);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
      setStateDropDown([]);
      setCityDropDownList([]);

      const res = await dispatch(stateDropdown(countryIsoCode || "IN"));
      const data = res?.data?.data;
      setStateDropDown(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (formik.values.country === "IN") {
      handleCountryChange("IN");
    }
  }, []);

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

  const fetchStudentStatuses = async () => {
    try {
      const res = await dispatch(getAllStudentStatus());
      if (res?.status === 200) {
        setStudentStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const studentStatusOptions = studentStatuses.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 100, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };

  const fetchInterestedCourseStatuses = async () => {
    try {
      const res = await dispatch(getAllInterestedCourseStatus(""));
      if (res?.status === 200) {
        setInterestedCourseStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching interested course statuses:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchPreferredCountries();
    fetchStudentStatuses();
    fetchAllBranches();
    fetchInterestedCourseStatuses();
  }, []);

  const fetchAllStudentApplication = async () => {
    try {
      if ((userRole === "Student" || userRole === "LeadStudent") && canRead) {
        const res = await dispatch(getOneStudentApplication(userId));
        setAllStudentApplication([res?.data?.data] || []);
      } else {
        setAllStudentApplication([]);
      }
    } catch (error) {
      console.log("Error fetching student application:", error);
      setAllStudentApplication([]);
    }
  };

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const fetchStates = async (country = "IN") => {
    const res = await dispatch(stateDropdown(country));
    setStateDropDown(res?.data?.data || []);
  };

  useEffect(() => {
    if (formik.values.country) {
      fetchStates();
    }
    if (canRead && (userRole === "Student" || userRole === "LeadStudent")) {
      fetchAllStudentApplication();
    }
  }, [canRead]);

  const studentPlan = mainPlans.find(
    (plan) => plan.name.toLowerCase() === "student admission",
  );

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan());
      setMainPlans(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching main plans:", error);
      setMainPlans([]);
      toast.error("Failed to fetch main plans.");
    }
  };

  useEffect(() => {
    fetchMainPlans();
  }, []);

  const fetchSubPlans = async (
    page = 1,
    limit = 10,
    searchTerm = "",
    mainPlanId = studentPlan?._id,
    preferredCountry = "",
  ) => {
    if (!mainPlanId) return;
    try {
      const res = await dispatch(
        getAllSubPlan(page, limit, searchTerm, mainPlanId, preferredCountry),
      );
      const responseData = res?.data?.data || {};
      setStudentSubPlans(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      toast.error("Failed to fetch sub plans.");
    }
  };

  useEffect(() => {
    if (studentPlan?._id) {
      fetchSubPlans(1, 10, "", studentPlan._id);
    }
  }, [studentPlan]);

  const formik = useFormik({
    initialValues: {
      name: "",
      contact: "",
      alternateContact: "",
      gender: "",
      email: "",
      DOB: "",
      age: "",
      address: "",
      city: "",
      state: "",
      country: "IN",
      passportNumber: "",
      purposeDetails: {
        inquiryFor: "",
        preferredCountry: [],
        intakeYear: [],
        intakeMonth: [],
      },
      invoice: {
        mainPlan: null,
        subPlan: null,
        amount: "",
        discount: "",
        discountAmount: "",
        payableAmount: "",
        paidAmount: [{ amount: "", date: "", bank: null, paymentMode: "" }],
        dueAmount: "",
        paymentType: "",
        invoiceRemarks: "",
      },
      admissionProcessRequired: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      contact:
        userRole !== "B2B Admin" &&
        Yup.string().required("Contact is required"),
      alternateContact: Yup.string(),
      gender: Yup.string().required("Gender is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      DOB: Yup.string().required("Date of Birth is required"),
      age: Yup.string().required("Age is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      passportNumber: Yup.string()
        .matches(/^[A-Za-z0-9]*$/, "Only letters and numbers are allowed")
        .max(12, "Passport Number cannot exceed 12 characters")
        .required("Passport Number is required"),
      purposeDetails: Yup.object({
        inquiryFor:
          userRole === "B2B Admin" ||
          userRole === "B2B Member" ||
          userRole === "Branch" ||
          userType === "Branch User"
            ? Yup.string().notRequired()
            : Yup.string().required("Inquiry For is required"),
        preferredCountry: Yup.array()
          .of(Yup.string())
          .min(1, "At least one Preferred Country is required")
          .required("Preferred Country is required"),
        intakeYear: Yup.array()
          .of(Yup.string())
          .min(1, "At least one Intake Year is required")
          .required("Intake Year is required"),
        intakeMonth: Yup.array()
          .of(Yup.string())
          .min(1, "At least one Intake Month is required")
          .required("Intake Month is required"),
      }),
      admissionProcessRequired: Yup.boolean().nullable(),
      invoice: Yup.object({
        mainPlan: Yup.string().when("admissionProcessRequired", {
          is: true,
          then: () => Yup.string().required("Main Plan is required"),
          otherwise: () => Yup.string().nullable(),
        }),
        subPlan: Yup.string().when("admissionProcessRequired", {
          is: true,
          then: () => Yup.string().required("Sub Plan is required"),
          otherwise: () => Yup.string().nullable(),
        }),
        amount: Yup.string(),
        discount: Yup.string().when("admissionProcessRequired", {
          is: true,
          then: () => Yup.string(),
          otherwise: () => Yup.string().nullable(),
        }),
        discountAmount: Yup.string().when("admissionProcessRequired", {
          is: true,
          then: () => Yup.string(),
          otherwise: () => Yup.string().nullable(),
        }),
        payableAmount: Yup.string(),
        paidAmount: Yup.array().when("admissionProcessRequired", {
          is: true,
          then: () =>
            Yup.array().of(
              Yup.object().shape({
                amount: Yup.string(),
                date: Yup.string().nullable(),
                bank: Yup.string().nullable(),
                paymentMode: Yup.string(),
              }),
            ),
          otherwise: () => Yup.array().nullable(),
        }),
        dueAmount: Yup.string(),
        paymentType: Yup.string().when("admissionProcessRequired", {
          is: true,
          then: () => Yup.string(),
          otherwise: () => Yup.string().nullable(),
        }),
        invoiceRemarks: Yup.string(),
      }),
    }),
    validateOnBlur: false,
    validateOnChange: true,
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

        const processedPaidAmount =
          values.invoice.paidAmount?.map((entry) => ({
            ...entry,
            bank: entry.bank || values.invoice.bank || null,
            date: entry.date || new Date().toISOString().split("T")[0],
            paymentMode: entry.paymentMode || "",
          })) || [];

        const admissionInvoiceData = {
          mainPlan:
            mainPlans.find(
              (plan) => plan.name.toLowerCase() === "student admission",
            )?._id || null,
          subPlan: values.invoice.subPlan || null,
          amount: values.invoice.amount || "",
          discount: values.invoice.discount || "",
          discountAmount: values.invoice.discountAmount || "",
          payableAmount: values.invoice.payableAmount || "",
          dueAmount: values.invoice.dueAmount || "",
          paidAmount: processedPaidAmount,
          paymentType: values.invoice.paymentType || "",
          remarks: values.invoice.remarks || "",
        };

        const formattedValues = {
          ...values,
          country: selectedCountry?.name || values.country,
          state: selectedState?.name || values.state,
          city: values.city,
          purposeDetails: {
            ...values.purposeDetails,
            inquiryFor: values.purposeDetails.inquiryFor || null,
          },
          invoice: {
            ...admissionInvoiceData,
          },
        };

        if ("submittedTabs" in formattedValues) {
          delete formattedValues.submittedTabs;
        }

        if (values.id && canUpdate) {
          const res = await dispatch(
            updateStudentApplication(formattedValues, values.id),
          );
          if (res?.status === 200) {
            if (res?.data?.data?.data?.message) {
              toast.error(res?.data?.data?.data?.message);
              return;
            } else {
              toast.success("Student Application updated successfully");
            }
          }
        } else if (canCreate) {
          const res = await dispatch(createStudentApplication(formattedValues));
          if (res?.status === 201) {
            if (res?.data?.data?.data?.message) {
              toast.error(res?.data?.data?.data?.message);
              return;
            } else {
              toast.success("Student Application added successfully");
            }
          }
        }
        setShowAccountDetails(false);
        handleClose();
        resetForm();
        if (canRead && (userRole === "Student" || userRole === "LeadStudent")) {
          fetchAllStudentApplication();
        }
      } catch (error) {
        toast.dismiss();
        console.log("Error submitting form:", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (
      studentPlan?._id &&
      formik.values.purposeDetails.preferredCountry?.length > 0
    ) {
      const selectedCountry = formik.values.purposeDetails.preferredCountry[0];
      fetchSubPlans(1, 10, "", studentPlan._id, selectedCountry);
      formik.setFieldValue("invoice.subPlan", null);
      formik.setFieldValue("invoice.amount", "");
      formik.setFieldValue("invoice.payableAmount", "");
      formik.setFieldValue("invoice.dueAmount", "");
      formik.setFieldValue("invoice.paidAmount", [
        { amount: "", date: "", bank: null, paymentMode: "" },
      ]);
    }
  }, [formik.values.purposeDetails.preferredCountry, studentPlan?._id]);

  const [admissionSubPlan, setAdmissionSubPlan] = useState("");
  const [isLoadingSubPlan, setIsLoadingSubPlan] = useState(false);

  useEffect(() => {
    const setAmountForSection = async (subPlanId, section) => {
      if (!subPlanId || isLoadingSubPlan) return;
      setIsLoadingSubPlan(true);
      try {
        const subPlan = await dispatch(getOneSubPlan(subPlanId));
        const totalAmount = subPlan?.data?.data?.totalAmount || "";
        formik.setFieldValue(`${section}.amount`, totalAmount.toString());
      } catch (error) {
        console.error(`Error fetching sub-plan for ${section}:`, error);
        toast.error(`Failed to fetch sub-plan details for ${section}.`);
      } finally {
        setIsLoadingSubPlan(false);
      }
    };

    if (formik.values.invoice.subPlan !== admissionSubPlan) {
      setAdmissionSubPlan(formik.values.invoice.subPlan);
      if (formik.values.invoice.subPlan) {
        setAmountForSection(formik.values.invoice.subPlan, "invoice");
      }
    }
  }, [formik.values.invoice?.subPlan, admissionSubPlan, isLoadingSubPlan]);

  const calculateAmounts = useCallback(
    (section) => {
      const values = formik.values[section];
      const amount = parseFloat(values.amount) || 0;
      let discountPercent = 0;
      if (values.discount) {
        const discountStr = values.discount.toString().replace("%", "").trim();
        discountPercent = parseFloat(discountStr) || 0;
      }
      const discountFromPercent = (amount * discountPercent) / 100;
      const discountFromAmount = parseFloat(values.discountAmount) || 0;
      const totalDiscount = discountFromPercent + discountFromAmount;
      const payableAmount = amount - totalDiscount;
      const totalPaid =
        values.paidAmount?.reduce(
          (sum, entry) => sum + (parseFloat(entry.amount) || 0),
          0,
        ) || 0;
      const dueAmount = payableAmount - totalPaid;

      formik.setFieldValue(
        `${section}.payableAmount`,
        Math.max(0, payableAmount).toFixed(2),
      );
      formik.setFieldValue(
        `${section}.dueAmount`,
        Math.max(0, dueAmount).toFixed(2),
      );
    },
    [formik],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formik.values.admissionProcessRequired) {
        calculateAmounts("invoice");
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    formik.values.invoice.amount,
    formik.values.invoice.discount,
    formik.values.invoice.discountAmount,
    formik.values.invoice.paidAmount,
  ]);

  const handleEdit = async (item) => {
    setShowAccountDetails(true);
    const countryName = item.country;
    const stateName = item.state;
    const cityName = item.city;

    const selectedCountry = countries.find(
      (c) => c.name.trim() === countryName,
    );
    const countryIsoCode = selectedCountry?.isoCode;

    if (!countryIsoCode) {
      formik.setFieldValue("country", countryName);
    }

    let fetchedStates = [];
    if (countryIsoCode) {
      const stateRes = await dispatch(stateDropdown(countryIsoCode));
      fetchedStates = stateRes?.data?.data || [];
      setStateDropDown(fetchedStates);
    }

    const selectedState = fetchedStates.find(
      (s) => s.name.trim() === stateName,
    );
    const stateIsoCode = selectedState?.isoCode;

    if (!stateIsoCode) {
      formik.setFieldValue("state", stateName);
    }

    let fetchedCities = [];
    if (stateIsoCode) {
      const cityRes = await dispatch(
        cityDropdown(countryIsoCode, stateIsoCode),
      );
      fetchedCities = cityRes?.data?.data || [];
      setCityDropDownList(fetchedCities);
    }

    if (!cityName) {
      formik.setFieldValue("city", cityName);
    }

    formik.setValues({
      ...formik.initialValues,
      ...item,
      id: item._id,
      country: countryIsoCode || countryName,
      state: stateIsoCode || stateName,
      city: cityName || "",
      purposeDetails: {
        ...item.purposeDetails,
        inquiryFor: item.purposeDetails?.inquiryFor?._id || "",
      },
      created_by: item.created_by?._id || null,
    });
    setShow(true);
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteStudentApplication({}, item._id));
      if (res?.status === 200) {
        toast.success("Student Application deleted successfully");
      }
      if (canRead && (userRole === "Student" || userRole === "LeadStudent")) {
        fetchAllStudentApplication();
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleCloneSubmit = async () => {
    if (!countryName) {
      toast.error("Please select a country.");
      return;
    }

    try {
      const res = await dispatch(
        studentApplicationClone(selectedStudent?._id, "", countryName),
      );

      if (res?.status === 200) {
        toast.success("Student application cloned successfully!");
        setCloneModalOpen(false);
        setCountryName("");
        setSelectedStudent(null);
      }
      if (canRead && (userRole === "Student" || userRole === "LeadStudent")) {
        fetchAllStudentApplication();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to clone student application.");
    }
  };

  const fetchStudentData = async (studentId) => {
    try {
      const res = await dispatch(getOneStudentApplication(studentId));
      setStudentData(res?.data?.data || {});
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
    }
  };

  const handleChatOpen = (student) => {
    setChatStudent(student);
    setShowChat(true);
    fetchStudentData(student._id);

    const notificationIds = notifications
      .filter((n) => n.studentId === student._id && !n.isRead)
      .map((n) => n.messageId);
    if (notificationIds.length > 0 && socket) {
      markNotificationsAsRead(socket, notificationIds);
    }
  };

  const handleChatClose = () => {
    setShowChat(false);
    setChatStudent(null);
    setStudentData({});
  };

  const handleMarkAllNotificationsRead = () => {
    const unreadNotificationIds = notifications
      .filter((n) => !n.isRead)
      .map((n) => n.messageId);
    if (unreadNotificationIds.length > 0 && socket) {
      markNotificationsAsRead(socket, unreadNotificationIds);
    }
  };

  useEffect(() => {
    if (cloneModalOpen || isWhatsappModalOpen || showChat) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [cloneModalOpen, isWhatsappModalOpen, showChat]);

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

  return (
    <>
      <Pageheader
        mainheading="Student Application"
        parentfolder="Application"
        activepage="Student Application"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex justify-content-between">
                <div className="card-title">Student Application</div>
                <div>
                  {canCreate &&
                    (userRole === "Student" || userRole === "LeadStudent") && (
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        onClick={handleShow}
                      >
                        Add Student Application
                      </Button>
                    )}
                  {showNotifications && (
                    <div
                      className="position-absolute bg-white border rounded shadow-sm p-3"
                      style={{
                        zIndex: 1000,
                        width: "300px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        right: "20px",
                        top: "60px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Notifications</h6>
                        {notificationCount > 0 && (
                          <Button
                            variant="link"
                            className="p-0 text-primary"
                            onClick={handleMarkAllNotificationsRead}
                          >
                            Mark All as Read
                          </Button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p className="text-muted">No new notifications</p>
                      ) : (
                        notifications
                          .slice()
                          .reverse()
                          .map((notif, index) => {
                            const student = allStudentApplication?.find(
                              (s) => s._id === notif.studentId,
                            );
                            return (
                              <div
                                key={index}
                                className={`p-2 border-bottom ${
                                  notif.isRead ? "bg-light" : "bg-white"
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleChatOpen(student);
                                  setShowNotifications(false);
                                  if (!notif.isRead && socket) {
                                    markNotificationsAsRead(socket, [
                                      notif.messageId,
                                    ]);
                                  }
                                }}
                              >
                                <div className="d-flex justify-content-between">
                                  <strong>
                                    {student?.name || "Unknown Student"}
                                  </strong>
                                  <small className="text-muted">
                                    {moment(notif.timestamp).fromNow()}
                                  </small>
                                </div>
                                <p className="mb-0 text-truncate">
                                  {notif.message}
                                </p>
                              </div>
                            );
                          })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <StudentApplicationForm
                show={show}
                handleClose={handleClose}
                formik={formik}
                isLoading={isLoading}
                countries={countries}
                stateDropDown={stateDropDown}
                cityDropDownList={cityDropDownList}
                showAccountDetails={showAccountDetails}
                preferredCountries={preferredCountries}
                studentSubPlans={studentSubPlans}
                formatDate={formatDate}
                parseDate={parseDate}
                handleStateChange={handleStateChange}
                handleCountryChange={handleCountryChange}
                oneCourseData={oneCourseData}
              />

              <Modal
                show={cloneModalOpen}
                onHide={() => {
                  setCloneModalOpen(false);
                  setCountryName("");
                }}
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>Clone Student Application</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => {
                      setCloneModalOpen(false);
                      setCountryName("");
                    }}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Select
                          name="countryName"
                          className="custom-select-height"
                          options={preferredCountries?.map((country) => ({
                            label: country.name,
                            value: country.name,
                          }))}
                          value={
                            countryName
                              ? { label: countryName, value: countryName }
                              : null
                          }
                          onChange={async (selectedOption) => {
                            const selectedCountry = selectedOption
                              ? selectedOption.value
                              : "";
                            setCountryName(selectedCountry);
                          }}
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
                          placeholder="Select Country"
                          isClearable
                        />
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="link"
                    className="custom-select-height btn border-primary text-primary text-decoration-none"
                    onClick={() => {
                      setCloneModalOpen(false);
                      setCountryName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleCloneSubmit}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>

              <div className="studentApplicationChat">
                {showChat && chatStudent && (
                  <div className="chat-card">
                    <div style={{ padding: "3px" }}>
                      <ChatComponent
                        studentId={chatStudent._id}
                        senderId={userId}
                        role={userRole}
                        studentData={studentData}
                        handleChatClose={handleChatClose}
                      />
                    </div>
                  </div>
                )}
              </div>
              <StudentApplicationCard
                allStudentApplication={allStudentApplication}
                canRead={canRead}
                canUpdate={canUpdate}
                canDelete={canDelete}
                canCreate={canCreate}
                formatDate={formatDate}
                parseDate={parseDate}
                handleChatOpen={handleChatOpen}
                setSelecteWaDaddyWhatsappdData={setSelecteWaDaddyWhatsappdData}
                setIsWaDaddyWhatsappModalOpen={setIsWaDaddyWhatsappModalOpen}
                setSelectedLeadName={setSelectedLeadName}
                setSelectedMobileNumber={setSelectedMobileNumber}
                setIsWhatsappModalOpen={setIsWhatsappModalOpen}
                handleEdit={handleEdit}
                interestedCourseStatus={interestedCourseStatus}
                setSelectedItem={setSelectedItem}
                setShowDeleteModal={setShowDeleteModal}
                setCloneModalOpen={setCloneModalOpen}
                setSelectedStudent={setSelectedStudent}
              />

              <WhatsappMessageModal
                isWhatsappModalOpen={isWhatsappModalOpen}
                closeWhatsappModal={() => setIsWhatsappModalOpen(false)}
                selectedLeadName={selectedLeadName}
                selectedMobileNumber={selectedMobileNumber}
                handleSendMessage={handleSendMessage}
              />

              <WaDaddyWhatsAppModal
                show={isWaDaddyWhatsappModalOpen}
                onClose={() => setIsWaDaddyWhatsappModalOpen(false)}
                data={selectedWaDaddyWhatsappData}
              />

              <DeleteConfirmModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={() => handleDelete(selectedItem)}
              />

              <Modal
                show={showIntakeModal}
                onHide={() => setShowIntakeModal(false)}
                centered
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>Select Intake Details</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowIntakeModal(false)}
                  />
                </Modal.Header>

                <Modal.Body>
                  {/* Intake Month */}
                  <Form.Group className="mb-3">
                    <Form.Label>Intake Month</Form.Label>
                    <Select
                      classNamePrefix="custom-select"
                      placeholder="Select Month"
                      value={
                        selectedIntakeMonth
                          ? {
                              value: selectedIntakeMonth,
                              label: selectedIntakeMonth,
                            }
                          : null
                      }
                      onChange={(selected) =>
                        setSelectedIntakeMonth(selected ? selected.value : "")
                      }
                      options={
                        (oneCourseData?.intakes || [])
                          ?.filter((m) => m.status === "Active")
                          ?.map((m) => ({
                            value: m.month,
                            label: m.month,
                          })) || []
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#ced4da",
                          fontSize: "14px",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#999",
                        }),
                      }}
                      isClearable
                    />
                  </Form.Group>

                  {/* Intake Year */}
                  <Form.Group className="mb-3">
                    <Form.Label>Intake Year</Form.Label>
                    <Select
                      classNamePrefix="custom-select"
                      placeholder="Select Year"
                      value={
                        selectedIntakeYear
                          ? {
                              value: selectedIntakeYear,
                              label: selectedIntakeYear,
                            }
                          : null
                      }
                      onChange={(selected) =>
                        setSelectedIntakeYear(selected ? selected.value : "")
                      }
                      options={
                        oneCourseData?.intakeYear?.map((year) => ({
                          value: year,
                          label: year,
                        })) || []
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#ced4da",
                          fontSize: "14px",
                        }),
                      }}
                      isClearable
                    />
                  </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    variant="outline-primary"
                    className="custom-select-height"
                    onClick={() => setShowIntakeModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    disabled={!selectedIntakeMonth || !selectedIntakeYear}
                    onClick={async () => {
                      const interestedCourseDetails = [
                        {
                          institute: oneCourseData?.university?._id || null,
                          campus:
                            oneCourseData?.university?.campus?._id || null,
                          programLevel:
                            oneCourseData?.studyLevel?.[0]?._id || null,
                          course: oneCourseData?._id,
                          intakeMonth: selectedIntakeMonth,
                          intakeYear: selectedIntakeYear,
                        },
                      ];

                      const formattedValues = { interestedCourseDetails };

                      try {
                        const res = await dispatch(
                          updateStudentApplication(formattedValues, userId),
                        );
                        if (res?.status === 200) {
                          toast.success(
                            "Student Application updated successfully",
                          );
                          fetchAllStudentApplication();
                        }
                      } catch (err) {
                        console.error("Auto-update failed:", err);
                        toast.error(
                          error?.response?.data?.message ||
                            "Failed to update with course details",
                        );
                      } finally {
                        setShowIntakeModal(false);
                        navigate(location.pathname, { replace: true });
                      }
                    }}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SingleStudentApplication;
