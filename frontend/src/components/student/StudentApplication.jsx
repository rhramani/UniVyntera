import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  createStudentApplication,
  updateStudentApplication,
  getAllStudentApplication,
  deleteStudentApplication,
  studentApplicationClone,
  getOneStudentApplication,
  downloadStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";
import Paginations from "../elements/Paginations";
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
import { useSocket } from "../../context/SocketContext";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import {
  getAllSubPlan,
  getOneSubPlan,
} from "../../redux/actions/Master/SubPlan.action";
import WaDaddyWhatsAppModal from "../crm/commonLeadForm/WaDaddyWhatsAppModal";
import StudentApplicationForm from "./studentDetails/StudentApplicationForm";
import StudentApplicationCard from "./studentDetails/StudentApplicationCard";
import CloneStudentApplication from "./studentDetails/CloneStudentApplication";
import { BASEURL } from "../../baseUrl";
import SearchWithDropdown from "../commonComponents/SearchWithDropdown";
import StudentApplicationFilters from "./StudentApplicationFilters";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const searchOption = [
  { label: "Everything", value: "" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Preferred Country", value: "purposeDetails.preferredCountry" },
  { label: "Student Id", value: "studentId" },
];

const StudentApplication = () => {
  const { socket } = useSocket();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { notificationCount, notifications } = useNotification();

  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [oneCourseData, setOneCourseData] = useState();
  const [show, setShow] = useState(false);
  const [allStudentApplication, selAllStudentApplication] = useState();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(searchOption[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
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
  const [mainStatus, setMainStatus] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [selectedB2BAdmin, setSelectedB2BAdmin] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [interestedCourseStatus, setInterestedCourseStatus] = useState([]);

  // Role and User filter states
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [mainPlans, setMainPlans] = useState([]);
  const [studentSubPlans, setStudentSubPlans] = useState([]);

  // Whatsapp state
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [selectedLeadName, setSelectedLeadName] = useState("");
  const [selectedMobileNumber, setSelectedMobileNumber] = useState("");
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatStudent, setChatStudent] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  const [showAll, setShowAll] = useState(true);

  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));
  const userId = decryptData(localStorage.getItem("userId"));
  const branchId = decryptData(localStorage.getItem("userId"));
  const { canCreate, canRead, canUpdate, canDelete, canDownload } =
    usePermissions("Student Applications");

  // wa daddy
  const [isWaDaddyWhatsappModalOpen, setIsWaDaddyWhatsappModalOpen] =
    useState(false);
  const [selectedWaDaddyWhatsappData, setSelecteWaDaddyWhatsappdData] =
    useState(null);

  const [updatedOnDate, setUpdatedOnDate] = useState("");

  useEffect(() => {
    if (!branchList?.length) return;

    const selectedBranchFromUrl = searchParams.get("selectedBranch");
    if (!selectedBranchFromUrl) return;

    let branchValue = "";
    let showAllFlag = false;

    if (selectedBranchFromUrl === "All") {
      branchValue = "all";
      showAllFlag = true;
    } else if (selectedBranchFromUrl === "Head Office") {
      branchValue = "";
      showAllFlag = false;
    } else {
      const matchedBranch = branchList.find(
        (b) =>
          b._id === selectedBranchFromUrl ||
          b.name?.toLowerCase() === selectedBranchFromUrl.toLowerCase(),
      );
      if (matchedBranch) {
        branchValue = matchedBranch._id;
      } else {
        branchValue = selectedBranchFromUrl;
      }
      showAllFlag = false;
    }

    setSelectedBranch(branchValue);
    setShowAll(showAllFlag);
    setCurrentPage(1);

    if (canRead) {
      const branchIdToFetch = branchValue === "all" ? "" : branchValue || "";
      fetchAllStudentApplication(
        1,
        itemsPerPage,
        selectedFilter?.value || "",
        search,
        mainStatus?.value || "",
        branchIdToFetch,
        showAllFlag,
        selectedCountry?.value || "",
        followUpDate,
        selectedB2BAdmin?.value || "",
        updatedOnDate,
        selectedRole,
        selectedUser || "",
        startDate,
        endDate,
      );
    }

    window.history.replaceState({}, "", "/student/studentapplication");
  }, [branchList, searchParams]);

  // New start
  useEffect(() => {
    if (socket && chatStudent) {
      socket.emit("joinRoom", { studentId: chatStudent._id, role: userRole });
      return () => {
        leaveRoom(socket, { studentId: chatStudent._id, role: userRole });
      };
    }
  }, [socket, chatStudent, userRole]);
  // New end

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
  }, [cloneModalOpen, isWhatsappModalOpen || show]);

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
      handleShow();
      fetchOneCourse(courseId);
    }
  }, [courseId]);

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

  useEffect(() => {
    if (location.state) {
      const {
        selectedBranch,
        mainStatus,
        selectedFilter,
        search,
        currentPage,
        itemsPerPage,
        showAll,
        selectedCountry,
        followUpDate,
        selectedB2BAdmin,
        updatedOnDate,
        selectedRole,
        selectedUser,
        startDate,
        endDate,
      } = location.state;

      if (selectedBranch !== undefined) setSelectedBranch(selectedBranch);
      if (mainStatus !== undefined) setMainStatus(mainStatus);
      if (selectedCountry !== undefined) setSelectedCountry(selectedCountry);
      if (selectedFilter !== undefined) setSelectedCountry(selectedFilter);
      if (search !== undefined) setSearch(search);
      if (currentPage !== undefined) setCurrentPage(currentPage);
      if (itemsPerPage !== undefined) setItemsPerPage(itemsPerPage);
      if (showAll !== undefined) setShowAll(showAll);
      if (followUpDate !== undefined) setFollowUpDate(followUpDate);
      if (selectedB2BAdmin !== undefined) setSelectedB2BAdmin(selectedB2BAdmin);
      if (updatedOnDate !== undefined) setUpdatedOnDate(updatedOnDate);
      if (selectedRole !== undefined) setSelectedRole(selectedRole);
      if (selectedUser !== undefined) setSelectedUser(selectedUser);
      if (startDate !== undefined) setStartDate(startDate);
      if (endDate !== undefined) setEndDate(endDate);

      if (canRead) {
        const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
        const newShowAll = selectedBranch === "all" ? true : showAll;

        fetchAllStudentApplication(
          currentPage || 1,
          itemsPerPage || 10,
          selectedFilter?.value || "",
          search || "",
          mainStatus?.value || "",
          branchId,
          newShowAll,
          selectedCountry?.value || "",
          followUpDate,
          selectedB2BAdmin?.value || "",
          updatedOnDate,
          selectedRole,
          selectedUser || "",
          startDate,
          endDate,
        );

        setTimeout(() => {
          navigate(location.pathname, { replace: true });
        }, 100);
      }
    }
  }, [location.state, navigate]);

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
      console.error("Error fetching student statuses:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchPreferredCountries();
    fetchStudentStatuses();
    fetchAllBranches();
    fetchInterestedCourseStatuses();
  }, []);

  const fetchAllStudentApplication = async (
    page = 1,
    limit = itemsPerPage,
    searchOnField = "",
    search = "",
    mainStatus = "",
    branchId = "",
    showAll = false,
    country = "",
    followUpDate = "",
    b2bId = "",
    updatedOnDate = "",
    role = "",
    user = "",
    startDate = "",
    endDate = "",
  ) => {
    try {
      let res;
      if (userRole === "Student") {
        res = await dispatch(getOneStudentApplication(userId));
      } else {
        res = await dispatch(
          getAllStudentApplication(
            page,
            limit,
            searchOnField,
            search,
            mainStatus,
            branchId,
            showAll,
            country,
            followUpDate,
            b2bId,
            updatedOnDate,
            role,
            user,
            startDate,
            endDate,
          ),
        );
      }
      if (userRole === "Student") {
        selAllStudentApplication(res?.data?.data || []);
      } else {
        const responseData = res?.data?.data;
        selAllStudentApplication(responseData?.data || []);
        setTotalPages(responseData?.totalPages || 0);
        setTotalRecords(responseData?.totalRecords || 0);
      }
    } catch (error) {
      console.log("Error fetching student applications:", error);
      selAllStudentApplication([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  };
  const fetchStates = async (country = "IN") => {
    const res = await dispatch(stateDropdown(country));
    setStateDropDown(res?.data?.data || []);
  };

  useEffect(() => {
    if (formik.values.country) {
      fetchStates();
    }
    if (canRead) {
      if (selectedRole && !selectedUser) {
        return;
      }

      const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
      const newShowAll = selectedBranch === "all" ? true : false;
      fetchAllStudentApplication(
        currentPage,
        itemsPerPage,
        selectedFilter?.value || "",
        search,
        mainStatus?.value || "",
        branchId,
        newShowAll,
        selectedCountry?.value || "",
        followUpDate,
        selectedB2BAdmin?.value || "",
        updatedOnDate,
        selectedRole,
        selectedUser || "",
        startDate,
        endDate,
      );
    }
  }, [
    currentPage,
    selectedFilter,
    search,
    mainStatus,
    canRead,
    selectedBranch,
    showAll,
    selectedCountry,
    followUpDate,
    selectedB2BAdmin,
    updatedOnDate,
    selectedRole,
    selectedUser,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    if (studentStatusOptions.length > 0 && mainStatus) {
      const matchingOption = studentStatusOptions.find(
        (option) => option.value === mainStatus.value,
      );
      if (!matchingOption) {
        setMainStatus(null);
      }
    }
  }, [studentStatusOptions]);

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
    limit = itemsPerPage,
    searchTerm = "",
    mainPlanId = studentPlan._id,
    preferredCountry = "",
  ) => {
    if (!mainPlanId) return;
    try {
      const res = await dispatch(
        getAllSubPlan(page, limit, searchTerm, mainPlanId, preferredCountry),
      );
      const responseData = res?.data?.data || {};
      setStudentSubPlans(responseData?.data);
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      return [];
    }
  };

  useEffect(() => {
    if (studentPlan?._id) {
      fetchSubPlans(1, itemsPerPage, "", studentPlan._id);
    }
  }, [studentPlan]);

  useEffect(() => {
    if (oneCourseData?.university?.country && preferredCountries.length > 0) {
      const countryName = oneCourseData.university.country;
      const matchingCountry = preferredCountries.find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase(),
      );

      if (matchingCountry) {
        formik.setFieldValue("purposeDetails.preferredCountry", [
          matchingCountry.name,
        ]);

        if (studentPlan?._id) {
          fetchSubPlans(
            1,
            itemsPerPage,
            "",
            studentPlan._id,
            matchingCountry.name,
          );
        }
      }
    }
  }, [oneCourseData, preferredCountries, studentPlan?._id, itemsPerPage]);

  const formik = useFormik({
    initialValues: {
      name: "",
      contact: "",
      alternateContact: "",
      isSubmit: false,
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
      isSubmit: Yup.boolean(),
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
          then: () => Yup.string().required("Admission Sub Plan is required"),
          otherwise: () => Yup.string().nullable(),
        }),
        subPlan: Yup.string().when("admissionProcessRequired", {
          is: true,
          then: () => Yup.string().required("Admission Sub Plan is required"),
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

        const interestedCourseDetails = oneCourseData
          ? [
              {
                institute: oneCourseData?.university?._id || null,
                campus: oneCourseData?.university?.campus?._id || null,
                programLevel: oneCourseData?.studyLevel?.[0]?._id || null,
                course: oneCourseData?._id,
              },
            ]
          : undefined;

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
          ...(interestedCourseDetails && { interestedCourseDetails }),
          ...(userRole === "Super Admin" && { isSubmit: true }),
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
        } else if (canCreate || userRole === "LeadStudent") {
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
        if (canRead) {
          fetchAllStudentApplication(
            currentPage,
            itemsPerPage,
            selectedFilter?.value || "",
            search,
            mainStatus?.value || "",
            selectedBranch === "all" ? "" : selectedBranch || "",
            selectedBranch === "all" ? true : false,
            selectedCountry?.value || "",
            followUpDate,
            selectedB2BAdmin?.value || "",
            updatedOnDate,
            selectedRole,
            selectedUser || "",
            startDate,
            endDate,
          );
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
      fetchSubPlans(1, itemsPerPage, "", studentPlan._id, selectedCountry);

      formik.setFieldValue("invoice.subPlan", null);
      formik.setFieldValue("invoice.amount", "");
      formik.setFieldValue("invoice.payableAmount", "");
      formik.setFieldValue("invoice.dueAmount", "");
      formik.setFieldValue("invoice.paidAmount", [
        { amount: "", date: "", bank: null, paymentMode: "" },
      ]);
    }
  }, [
    formik.values.purposeDetails.preferredCountry,
    studentPlan?._id,
    itemsPerPage,
  ]);

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

      // -------- % Discount ----------
      let discountPercent = 0;
      if (values.discount) {
        const discountStr = values.discount.toString().replace("%", "").trim();
        discountPercent = parseFloat(discountStr) || 0;
      }
      const discountFromPercent = (amount * discountPercent) / 100;

      // -------- Fixed Discount Amount ----------
      const discountFromAmount = parseFloat(values.discountAmount) || 0;

      // -------- Total Discount (both work together) ----------
      const totalDiscount = discountFromPercent + discountFromAmount;

      // -------- Payable & Due ----------
      const payableAmount = amount - totalDiscount;

      const totalPaid =
        values.paidAmount?.reduce(
          (sum, entry) => sum + (parseFloat(entry.amount) || 0),
          0,
        ) || 0;

      const dueAmount = payableAmount - totalPaid;

      // -------- Update Formik --------
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

    const selectedStatus = studentStatusOptions.find(
      (option) => option.value === item.mainStatus?._id,
    );
    setMainStatus(selectedStatus || null);

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
      const updatedPage =
        allStudentApplication.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchAllStudentApplication(
          currentPage,
          itemsPerPage,
          selectedFilter?.value || "",
          search,
          mainStatus?.value || "",
          selectedBranch === "all" ? "" : selectedBranch || "",
          selectedBranch === "all" ? true : false,
          selectedCountry?.value || "",
          followUpDate,
          selectedB2BAdmin?.value || "",
          updatedOnDate,
          selectedRole,
          selectedUser || "",
          startDate,
          endDate,
        );
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDownload = async () => {
    try {
      const payload = {
        page: 1,
        limit: 1000000,
        search: search,
        mainStatus: mainStatus?.value || "",
        branchId: selectedBranch === "all" ? "" : selectedBranch || "",
        showAll: selectedBranch === "all" ? true : showAll,
        country: selectedCountry?.value || "",
        followUpDate: followUpDate || "",
        b2bId: selectedB2BAdmin?.value || "",
        updatedOnDate: updatedOnDate || "",
        role: selectedRole || "",
        user: selectedUser || "",
        startDate: startDate || "",
        endDate: endDate || "",
      };
      const response = await dispatch(downloadStudentApplication(payload));

      if (response?.status === 200 && response?.data?.fileUrl) {
        const fileUrl = `${BASEURL}${response.data.fileUrl}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "studentapplications.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Student Applications downloaded successfully!");
      } else {
        toast.error("No file URL provided in the response.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while downloading applications.",
      );
      console.error("Error downloading applications:", error);
    }
  };

  const handleCloneSubmit = async () => {
    if (!countryName) {
      toast.error("Please select a country.");
      return;
    }

    try {
      toast.dismiss();

      const values = formik.values;

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
        invoice: {
          ...admissionInvoiceData,
        },
      };

      const res = await dispatch(
        studentApplicationClone(
          selectedStudent?._id,
          countryName,
          formattedValues,
        ),
      );

      if (res?.status === 200) {
        toast.success("Student application cloned successfully!");
        formik.resetForm();
        setCloneModalOpen(false);
        setCountryName("");
        setSelectedStudent(null);
      }

      if (canRead) {
        fetchAllStudentApplication(
          currentPage,
          itemsPerPage,
          selectedFilter?.value || "",
          search,
          mainStatus?.value || "",
          selectedBranch === "all" ? "" : selectedBranch || "",
          selectedBranch === "all" ? true : false,
          selectedCountry?.value || "",
          followUpDate,
          selectedB2BAdmin?.value || "",
          updatedOnDate,
          selectedRole,
          selectedUser || "",
          startDate,
          endDate,
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to clone student application.",
      );
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
              <div className="w-100 d-flex flex-wrap justify-content-end">
                {/* <div className="card-title">Student Application</div> */}

                <div className="d-flex flex-wrap align-items-center gap-2">
                  {userRole !== "LeadStudent" && (
                    <SearchWithDropdown
                      searchOption={searchOption}
                      selectedFilter={selectedFilter}
                      setSelectedFilter={setSelectedFilter}
                      search={search}
                      setSearch={setSearch}
                      setCurrentPage={setCurrentPage}
                    />
                  )}
                  {canDownload && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={handleDownload}
                    >
                      Download
                    </Button>
                  )}
                  {canCreate && (
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
              <StudentApplicationFilters
                selectedBranch={selectedBranch}
                userRole={userRole}
                userType={userType}
                branchList={branchList}
                selectedRole={selectedRole}
                selectedB2BAdmin={selectedB2BAdmin}
                studentStatusOptions={studentStatusOptions}
                mainStatus={mainStatus}
                preferredCountries={preferredCountries}
                selectedCountry={selectedCountry}
                followUpDate={followUpDate}
                updatedOnDate={updatedOnDate}
                allStudentApplication={allStudentApplication}
                canRead={canRead}
                itemsPerPage={itemsPerPage}
                totalRecords={totalRecords}
                dispatch={dispatch}
                setItemsPerPage={setItemsPerPage}
                fetchAllStudentApplication={fetchAllStudentApplication}
                selectedFilter={selectedFilter}
                search={search}
                selectedUser={selectedUser}
                setMainStatus={setMainStatus}
                setShowAll={setShowAll}
                setSelectedRole={setSelectedRole}
                setSelectedUser={setSelectedUser}
                setSelectedBranch={setSelectedBranch}
                setCurrentPage={setCurrentPage}
                setSelectedCountry={setSelectedCountry}
                setFollowUpDate={setFollowUpDate}
                setSelectedB2BAdmin={setSelectedB2BAdmin}
                setUpdatedOnDate={setUpdatedOnDate}
                formatDate={formatDate}
                parseDate={parseDate}
                branchId={branchId}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />

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

              <CloneStudentApplication
                setCloneModalOpen={setCloneModalOpen}
                setCountryName={setCountryName}
                cloneModalOpen={cloneModalOpen}
                preferredCountries={preferredCountries}
                handleCloneSubmit={handleCloneSubmit}
                countryName={countryName}
                formik={formik}
                studentSubPlans={studentSubPlans}
                fetchSubPlans={fetchSubPlans}
                studentPlan={studentPlan}
                selectedStudent={selectedStudent}
                userRole={userRole}
              />

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
                selectedBranch={selectedBranch}
                mainStatus={mainStatus}
                search={search}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                showAll={showAll}
                selectedCountry={selectedCountry}
                followUpDate={followUpDate}
                selectedB2BAdmin={selectedB2BAdmin}
                updatedOnDate={updatedOnDate}
                selectedRole={selectedRole}
                selectedUser={selectedUser}
                startDate={startDate}
                endDate={endDate}
                setCloneModalOpen={setCloneModalOpen}
                setSelectedStudent={setSelectedStudent}
                setIsLoading={setIsLoading}
                dispatch={dispatch}
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

              {totalPages > 1 && allStudentApplication.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StudentApplication;
