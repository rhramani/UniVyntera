 import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Select from "react-select";
import Pageheader from "../../layouts/Pageheader";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import { useNavigate, useLocation } from "react-router-dom";
import usePermissions from "../commonComponents/usePermissions";
import WhatsappMessageModal from "../crm/commonLeadForm/WhatsAppModal";
import { sendWPMessage } from "../../redux/actions/Lead.action";
import { decryptData } from "../../utils/encryptionUtils";
import ChatComponent from "./studentDetails/chat/ChatComponent";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { useNotification } from "../../context/NotificationContext";
import { leaveRoom, markNotificationsAsRead } from "../../socket";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSocket } from "../../context/SocketContext";
import {
  createVisitorApplication,
  deleteVisitorApplication,
  getAllVisitorApplication,
  getOneVisitorApplication,
  updateVisitorApplication,
  visitorApplicationClone,
} from "../../redux/actions/Visitor/VisitorApplication.action";
import { getAllVisitorMainStatus } from "../../redux/actions/Visitor/VisitorMainStatus.action";
import {
  getAllSubPlan,
  getOneSubPlan,
} from "../../redux/actions/Master/SubPlan.action";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import { getAllBankingDetails } from "../../redux/actions/Master/Banking.action";
import {
  cityDropdown,
  countryDropdown,
  stateDropdown,
} from "../../redux/actions/Master/Institute.action";
import WaDaddyWhatsAppModal from "../crm/commonLeadForm/WaDaddyWhatsAppModal";
import VisitorCard from "./visitorDetails/VisitorCard";
import VisitorFormModal from "./visitorDetails/VisitorFormModal";

const VisitorApplication = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { notificationCount, notifications } = useNotification();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Visitor Applications"
  );
  const userRole = decryptData(localStorage.getItem("role"));
  const userId = decryptData(localStorage.getItem("userId"));
  const branchId = decryptData(localStorage.getItem("userId"));

  const [show, setShow] = useState(false);
  const [allVisitorApplication, setAllVisitorApplication] = useState();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [countries, setCountries] = useState([]);
  const [preferredCountries, setPreferredCountries] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [instituteId, setInstituteId] = useState("");
  const [countryName, setCountryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visitorStatuses, setVisitorStatuses] = useState([]);
  const [mainStatus, setMainStatus] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  // Whatsapp state
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [selectedLeadName, setSelectedLeadName] = useState("");
  const [selectedMobileNumber, setSelectedMobileNumber] = useState("");
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatVisitor, setChatVisitor] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [
    showVisitorProcessRenewalDateCalendar,
    setShowVisitorProcessRenewalDateCalendar,
  ] = useState(false);
  const [
    showVisitorProcessRefusalDateCalendar,
    setShowVisitorProcessRefusalDateCalendar,
  ] = useState(false);
  const [visitorSubPlans, setVisitorSubPlans] = useState([]);
  const [mainPlans, setMainPlans] = useState([]);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [visitorSubPlan, setVisitorSubPlan] = useState("");
  const [isLoadingSubPlan, setIsLoadingSubPlan] = useState(false);
  // wa daddy
  const [isWaDaddyWhatsappModalOpen, setIsWaDaddyWhatsappModalOpen] =
    useState(false);
  const [selectedWaDaddyWhatsappData, setSelecteWaDaddyWhatsappdData] =
    useState(null);

  const startDateInputRef = useRef(null);
  const visitorProcessRenewalDateInputRef = useRef(null);
  const visitorProcessRenewalDateCalendarRef = useRef(null);
  const visitorProcessRefusalDateInputRef = useRef(null);
  const visitorProcessRefusalDateCalendarRef = useRef(null);

  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  const tagColors = [
    { bg: "#D1FAE5", text: "#047857" }, // green
    { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
    { bg: "#EDE9FE", text: "#6D28D9" }, // purple
    { bg: "#FEF3C7", text: "#B45309" }, // yellow
    { bg: "#F5D0FE", text: "#A21CAF" }, // pink
    { bg: "#C7D2FE", text: "#3730A3" }, // indigo
  ];

  const getColors = (name) => {
    const index =
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      tagColors?.length;
    return tagColors[index];
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchStates = async (country = "IN") => {
    const res = await dispatch(stateDropdown(country));
    setStateDropDown(res?.data?.data || []);
  };

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

  const fetchSubPlans = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    mainPlanId = visitorPlan._id,
    preferredCountry = ""
  ) => {
    if (!mainPlanId) return;
    try {
      const res = await dispatch(
        getAllSubPlan(page, limit, searchTerm, mainPlanId, preferredCountry)
      );
      const responseData = res?.data?.data || {};
      setVisitorSubPlans(responseData?.data);
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      return [];
    }
  };

  const fetchVisitorStatuses = async () => {
    try {
      const res = await dispatch(getAllVisitorMainStatus(""));
      if (res?.status === 200) {
        setVisitorStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching visitor statuses:", error);
    }
  };

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

  const fetchPreferredCountries = async () => {
    const res = await dispatch(countryDropdown());
    setPreferredCountries(res?.data?.data || []);
  };

  const fetchAllVisitorApplication = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    mainStatus = "",
    branchId = "",
    showAll = false,
    country = "",
    followUpDate = ""
  ) => {
    try {
      const res = await dispatch(
        getAllVisitorApplication(
          page,
          limit,
          search,
          mainStatus,
          branchId,
          showAll,
          country,
          followUpDate
        )
      );
      const responseData = res?.data?.data;
      setAllVisitorApplication(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.log("Error fetching visitor applications:", error);
      setAllVisitorApplication([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  };

  const fetchVisitorData = async (studentId) => {
    try {
      const res = await dispatch(getOneVisitorApplication(studentId));
      setStudentData(res?.data?.data || {});
    } catch (error) {
      console.error("Error fetching visitor data:", error);
      toast.error("Failed to load visitor data");
    }
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      email: "",
      address: "",
      contact: "",
      alternateContact: "",
      DOB: "",
      age: "",
      gender: "",
      country: "",
      state: "",
      city: "",
      passportNumber: "",
      preferredCountry: "",
      categoryDetails: {
        type: "",
        entries: [{ country: "", date: "", document: null, remarks: "" }],
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
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      address: Yup.string().required("Address is required"),
      contact: Yup.string().required("Contact is required"),
      alternateContact: Yup.string(),
      DOB: Yup.string().required("Date of Birth is required"),
      age: Yup.number().required("Age is required"),
      gender: Yup.string().required("Gender is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      passportNumber: Yup.string()
        .max(12, "Passport number must be at most 12 characters")
        .required("Passport Number is required"),
      preferredCountry: Yup.string(),
      categoryDetails: Yup.object({
        type: Yup.string(),
        entries: Yup.array()
          .of(
            Yup.object({
              country: Yup.string().required("Country is required"),
              date: Yup.date().required("Date is required"),
              document: Yup.mixed().required("Document is required"),
              remarks: Yup.string().nullable(),
            })
          )
          .when(["visitorApplication", "type"], {
            is: (visitorApplication, type) =>
              visitorApplication && (type === "Renewal" || type === "Refusal"),
            then: () => Yup.array().min(1, "At least one detail is required"),
            otherwise: () => Yup.array().nullable(),
          }),
        subPlan: Yup.string().when("visitorApplication", {
          is: true,
          then: () => Yup.string().required("Visitor Sub Plan is required"),
          otherwise: () => Yup.string().nullable(),
        }),
        amount: Yup.string(),
        discount: Yup.string().when("visitorApplication", {
          is: true,
          then: () => Yup.string(),
          otherwise: () => Yup.string().nullable(),
        }),
        discountAmount: Yup.string().when("visitorApplication", {
          is: true,
          then: () => Yup.string(),
          otherwise: () => Yup.string().nullable(),
        }),
        // discountAmount: Yup.string(),
        payableAmount: Yup.string(),
        paidAmount: Yup.array().when("visitorApplication", {
          is: true,
          then: () =>
            Yup.array().of(
              Yup.object().shape({
                amount: Yup.string(),
                date: Yup.string().nullable(),
                bank: Yup.string().nullable(),
                paymentMode: Yup.string(), // Added paymentMode validation
              })
            ),
          otherwise: () => Yup.array().nullable(),
        }),
        dueAmount: Yup.string(),
        paymentType: Yup.string().when("visitorApplication", {
          is: true,
          then: () => Yup.string(),
          otherwise: () => Yup.string().nullable(),
        }),
        invoiceRemarks: Yup.string(),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        toast.dismiss();
        const selectedCountry = countries?.find(
          (c) => c.isoCode === values.country
        );

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("contact", values.contact);
        formData.append("alternateContact", values.alternateContact || "");
        formData.append("gender", values.gender);
        formData.append("email", values.email);
        formData.append("DOB", toISODate(parseDate(values.DOB)));
        formData.append("age", values.age);
        formData.append("address", values.address);
        formData.append("city", values.city);
        formData.append("state", values.state);
        formData.append("country", selectedCountry?.name || values.country);
        formData.append("passportNumber", values.passportNumber);
        formData.append("preferredCountry", values.preferredCountry || []);

        const { type, entries } = values.categoryDetails;

        // Prepare categoryDetails as JSON array
        if (type === "Fresh") {
          formData.append("categoryDetails[0][type]", "Fresh");
        } else if (type === "Renewal" || type === "Refusal") {
          entries.forEach((entry, index) => {
            formData.append(`categoryDetails[${index}][type]`, type);
            formData.append(
              `categoryDetails[${index}][country]`,
              entry.country || ""
            );
            formData.append(
              `categoryDetails[${index}][date]`,
              entry.date ? toISODate(parseDate(entry.date)) : ""
            );
            formData.append(
              `categoryDetails[${index}][remarks]`,
              entry.remarks || ""
            );
            if (entry.document) {
              formData.append("categoryDoc", entry.document); // Append each document as part of categoryDoc array
            }
          });
        }

        const processedPaidAmount =
          values.categoryDetails.paidAmount?.map((entry) => ({
            ...entry,
            bank: entry.bank || values.categoryDetails.bank || null,
            date: entry.date || new Date().toISOString().split("T")[0],
            paymentMode: entry.paymentMode || "",
          })) || [];

        const visitorInvoiceData = {
          mainPlan:
            mainPlans.find((plan) => plan.name.toLowerCase() === "visitor")
              ?._id || "",
          subPlan: values.categoryDetails.subPlan || null,
          amount: values.categoryDetails.amount || "",
          discount: values.categoryDetails.discount || "",
          discountAmount: values.categoryDetails.discountAmount || "",
          payableAmount: values.categoryDetails.payableAmount || "",
          dueAmount: values.categoryDetails.dueAmount || "",
          paidAmount: processedPaidAmount,
          paymentType: values.categoryDetails.paymentType || "",
          remarks: values.categoryDetails.remarks || "",
        };
        formData.append("invoice", JSON.stringify(visitorInvoiceData));

        if (values.id && canUpdate) {
          formData.append("id", values.id);
          const res = await dispatch(
            updateVisitorApplication(formData, values.id)
          );
          if (res?.status === 200) {
            if (res?.data?.data?.data?.message) {
              toast.error(res?.data?.data?.data?.message);
              return;
            } else {
              toast.success("Visitor Application updated successfully");
            }
          }
        } else if (canCreate) {
          const res = await dispatch(createVisitorApplication(formData));
          if (res?.status === 201) {
            if (res?.data?.data?.data?.message) {
              toast.error(res?.data?.data?.message);
              return;
            } else {
              toast.success("Visitor Application added successfully");
            }
          }
        }

        handleClose();
        resetForm();
        if (canRead) {
          fetchAllVisitorApplication(
            currentPage,
            itemsPerPage,
            search,
            mainStatus?.value || "",
            selectedBranch === "all" ? "" : selectedBranch || "",
            showAll,
            selectedCountry?.value || "",
            followUpDate
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

  const visitorPlan = mainPlans.find(
    (plan) => plan.name.toLowerCase() === "visitor"
  );
  const visitorStatusOptions = visitorStatuses?.map((item) => ({
    value: item._id,
    label: item.name,
  }));
  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  useEffect(() => {
    if (visitorPlan?._id && formik.values.preferredCountry) {
      fetchSubPlans(
        1,
        itemsPerPage,
        "",
        visitorPlan._id,
        formik.values.preferredCountry
      );
      formik.setFieldValue("categoryDetails.subPlan", null);
      formik.setFieldValue("categoryDetails.amount", "");
      formik.setFieldValue("categoryDetails.payableAmount", "");
      formik.setFieldValue("categoryDetails.dueAmount", "");
      formik.setFieldValue("categoryDetails.paidAmount", [
        { amount: "", date: "", bank: null, paymentMode: "" },
      ]);
    }
  }, [formik.values.preferredCountry, visitorPlan?._id, itemsPerPage]);


  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };

  const handleClose = () => {
    setShow(false);
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

  const handleStateChange = async (countryIsoCode, stateIsoCode) => {
    try {
      formik.setFieldValue("city", "");
      setCityDropDownList([]);

      const res = await dispatch(cityDropdown(countryIsoCode, stateIsoCode));
      const data = res?.data?.data;
      setCityDropDownList(data || []);

      const selectedState = stateDropDown?.find(
        (state) => state.isoCode === stateIsoCode
      );
      formik.setFieldValue("state", selectedState ? selectedState.name : "");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleVisitorStatusChange = (selectedOption) => {
    setMainStatus(selectedOption);
    const isAllBranch = selectedBranch === "all";
    const newShowAll = isAllBranch ? true : false;
    setShowAll(newShowAll);

    fetchAllVisitorApplication(
      1,
      itemsPerPage,
      search,
      selectedOption?.value || "",
      selectedBranch === "all" ? "" : selectedBranch || "",
      newShowAll,
      selectedCountry?.value || "",
      followUpDate
    );
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
      const newShowAll = selectedBranch === "all" ? true : showAll;
      fetchAllVisitorApplication(
        1,
        newItemsPerPage,
        search,
        mainStatus?.value || "",
        branchId,
        newShowAll,
        selectedCountry?.value || "",
        followUpDate
      );
    }
  };

  const handleEdit = async (item) => {
    const countryName = item.country;
    const stateName = item.state;
    const cityName = item.city;

    const selectedCountry = countries?.find(
      (c) => c.name.trim() === countryName
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

    const selectedState = fetchedStates?.find(
      (s) => s.name.trim() === stateName
    );
    const stateIsoCode = selectedState?.isoCode;

    if (!stateIsoCode) {
      formik.setFieldValue("state", stateName);
    }

    let fetchedCities = [];
    if (stateIsoCode) {
      const cityRes = await dispatch(
        cityDropdown(countryIsoCode, stateIsoCode)
      );
      fetchedCities = cityRes?.data?.data || [];
      setCityDropDownList(fetchedCities);
    }

    if (!cityName) {
      formik.setFieldValue("city", cityName);
    }

    const selectedStatus = visitorStatusOptions?.find(
      (option) => option.value === item.mainStatus?._id
    );
    setMainStatus(selectedStatus || null);

    formik.setValues({
      ...formik.initialValues,
      ...item,
      id: item._id,
      country: countryIsoCode || countryName,
      state: stateIsoCode || stateName,
      city: cityName || "",
      categoryDetails: {
        type: item.categoryDetails?.type || "",
        document: "",
        date: item.categoryDetails?.date || "",
      },
    });
    setShow(true);
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteVisitorApplication({}, item._id));
      if (res?.status === 200) {
        toast.success("Visitor Application deleted successfully");
      }
      const updatedPage =
        allVisitorApplication?.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchAllVisitorApplication(
          currentPage,
          itemsPerPage,
          search,
          mainStatus?.value || "",
          selectedBranch === "all" ? "" : selectedBranch || "",
          selectedCountry?.value || "",
          followUpDate
        );
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
        visitorApplicationClone(selectedVisitor?._id, instituteId, countryName)
      );
      if (res?.status === 200) {
        toast.success("Visitor Application cloned successfully!");
        setCloneModalOpen(false);
        setInstituteId("");
        setCountryName("");
        setSelectedVisitor(null);
      }
      if (canRead) {
        fetchAllVisitorApplication(
          currentPage,
          itemsPerPage,
          search,
          mainStatus?.value || "",
          selectedBranch === "all" ? "" : selectedBranch || "",
          selectedCountry?.value || "",
          followUpDate
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to clone Visitor Application.");
    }
  };

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

  const handleChatOpen = (visitor) => {
    setChatVisitor(visitor);
    setShowChat(true);
    fetchVisitorData(visitor._id);

    const notificationIds = notifications
      ?.filter((n) => n.studentId === visitor._id && !n.isRead)
      ?.map((n) => n.messageId);
    if (notificationIds?.length > 0 && socket) {
      markNotificationsAsRead(socket, notificationIds);
    }
  };

  const handleChatClose = () => {
    setShowChat(false);
    setChatVisitor(null);
    setStudentData({});
  };

  const handleMarkAllNotificationsRead = () => {
    const unreadNotificationIds = notifications
      ?.filter((n) => !n.isRead)
      ?.map((n) => n.messageId);
    if (unreadNotificationIds?.length > 0 && socket) {
      markNotificationsAsRead(socket, unreadNotificationIds);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchVisitorStatuses();
    fetchAllBranches();
    fetchMainPlans();
    fetchBankingDetails();
    fetchPreferredCountries();
  }, []);

  useEffect(() => {
    if (visitorPlan?._id) {
      fetchSubPlans(1, itemsPerPage, "", visitorPlan._id);
    }
  }, [visitorPlan]);

  useEffect(() => {
    if (formik.values?.country === "IN") {
      handleCountryChange("IN");
    }
  }, []);

  useEffect(() => {
    if (formik.values?.country) {
      fetchStates();
    }
    if (canRead) {
      const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
      const newShowAll = selectedBranch === "all" ? true : false;
      fetchAllVisitorApplication(
        currentPage,
        itemsPerPage,
        search,
        mainStatus?.value || "",
        branchId,
        newShowAll,
        selectedCountry?.value || "",
        followUpDate
      );
    }
  }, [
    currentPage,
    search,
    mainStatus,
    canRead,
    selectedBranch,
    showAll,
    selectedCountry,
    followUpDate,
  ]);

  useEffect(() => {
    if (socket && chatVisitor) {
      socket.emit("joinRoom", { studentId: chatVisitor._id, role: userRole });
      return () => {
        leaveRoom(socket, { studentId: chatVisitor._id, role: userRole });
      };
    }
  }, [socket, chatVisitor, userRole]);

  useEffect(() => {
    if (location.state) {
      const {
        selectedBranch,
        mainStatus,
        search,
        currentPage,
        itemsPerPage,
        showAll,
        selectedCountry,
        followUpDate,
      } = location.state;

      if (selectedBranch !== undefined) setSelectedBranch(selectedBranch);
      if (mainStatus !== undefined) setMainStatus(mainStatus);
      if (selectedCountry !== undefined) setSelectedCountry(selectedCountry);
      if (search !== undefined) setSearch(search);
      if (currentPage !== undefined) setCurrentPage(currentPage);
      if (itemsPerPage !== undefined) setItemsPerPage(itemsPerPage);
      if (showAll !== undefined) setShowAll(showAll);
      if (followUpDate !== undefined) setFollowUpDate(followUpDate);

      if (canRead) {
        const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
        const newShowAll = selectedBranch === "all" ? true : showAll;

        fetchAllVisitorApplication(
          currentPage || 1,
          itemsPerPage || 10,
          search || "",
          mainStatus?.value || "",
          branchId,
          newShowAll,
          selectedCountry?.value || "",
          followUpDate
        );

        fetchAllVisitorApplication(
          currentPage || 1,
          itemsPerPage || 10,
          search || "",
          mainStatus?.value || "",
          branchId,
          newShowAll,
          selectedCountry?.value || "",
          followUpDate
        );
        setTimeout(() => {
          navigate(location.pathname, { replace: true });
        }, 100);
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showVisitorProcessRenewalDateCalendar &&
        visitorProcessRenewalDateCalendarRef.current &&
        !visitorProcessRenewalDateCalendarRef.current.contains(event.target) &&
        visitorProcessRenewalDateInputRef.current &&
        !visitorProcessRenewalDateInputRef.current.contains(event.target)
      ) {
        setShowVisitorProcessRenewalDateCalendar(false);
      }
      if (
        showVisitorProcessRefusalDateCalendar &&
        visitorProcessRefusalDateCalendarRef.current &&
        !visitorProcessRefusalDateCalendarRef.current.contains(event.target) &&
        visitorProcessRefusalDateInputRef.current &&
        !visitorProcessRefusalDateInputRef.current.contains(event.target)
      ) {
        setShowVisitorProcessRefusalDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showVisitorProcessRenewalDateCalendar,
    showVisitorProcessRefusalDateCalendar,
  ]);

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

    if (formik.values.categoryDetails.subPlan !== visitorSubPlan) {
      setVisitorSubPlan(formik.values.categoryDetails.subPlan);
      if (formik.values.categoryDetails.subPlan) {
        setAmountForSection(
          formik.values.categoryDetails.subPlan,
          "categoryDetails"
        );
      }
    }
  }, [
    formik.values.categoryDetails?.subPlan,
    visitorSubPlan,
    isLoadingSubPlan,
  ]);

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
          0
        ) || 0;
      const dueAmount = payableAmount - totalPaid;

      formik.setFieldValue(
        `${section}.payableAmount`,
        Math.max(0, payableAmount).toFixed(2)
      );
      formik.setFieldValue(
        `${section}.dueAmount`,
        Math.max(0, dueAmount).toFixed(2)
      );
    },
    [formik]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateAmounts("categoryDetails");
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    formik.values.categoryDetails.amount,
    formik.values.categoryDetails.discount,
    formik.values.categoryDetails.discountAmount,
    formik.values.categoryDetails.paidAmount,
  ]);

  useEffect(() => {
    if (visitorStatusOptions?.length > 0 && mainStatus) {
      const matchingOption = visitorStatusOptions?.find(
        (option) => option.value === mainStatus.value
      );
      if (!matchingOption) {
        setMainStatus(null);
      }
    }
  }, [visitorStatusOptions]);

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

  return (
    <>
      <Pageheader
        mainheading="Visitor Applications"
        parentfolder="Application"
        activepage="Visitor Applications"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex justify-content-end">
                {/* <div className="card-title">Visitor Applications</div> */}
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="filter-item">
                      <div className="contact-search3">
                        <button type="button" className="btn border-0">
                          <i
                            className="fe fe-search fw-semibold text-muted"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <Form.Control
                          type="text"
                          className="filter-height border-0"
                          id="typehead1"
                          placeholder="Search here..."
                          autoComplete="off"
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                    </div>
                  {canCreate && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={handleShow}
                    >
                      Add Visitor Application
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
                      {notifications?.length === 0 ? (
                        <p className="text-muted">No new notifications</p>
                      ) : (
                        notifications
                          ?.slice()
                          ?.reverse()
                          ?.map((notif, index) => {
                            const visitor = allVisitorApplication?.find(
                              (s) => s._id === notif.studentId
                            );
                            return (
                              <div
                                key={index}
                                className={`p-2 border-bottom ${
                                  notif.isRead ? "bg-light" : "bg-white"
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleChatOpen(visitor);
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
                                    {visitor?.name || "Unknown Visitor"}
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
              <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                {userRole === "Super Admin" && (
                  <div className="filter-item">
                    <Form.Label>Branch Filter</Form.Label>
                    <Select
                      className="filter-height"
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: "13px",
                        }),
                      }}
                      placeholder="Select Branch"
                      classNamePrefix="custom-select"
                      options={[
                        { value: "all", label: "All" },
                        { value: "", label: "Head Office" },
                        ...(Array.isArray(branchList)
                          ? branchList
                              .filter((branch) => {
                                if (userRole === "Branch") {
                                  return branch._id === branchId;
                                }
                                return branch.name && branch.name.trim() !== "";
                              })
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((branch) => ({
                                value: branch._id,
                                label: branch.name,
                              }))
                          : []),
                      ]}
                      // options={[
                      //   { value: "all", label: "All" },
                      //   { value: "", label: "Head Office" },
                      //   ...(Array.isArray(branchList)
                      //     ? branchList
                      //         ?.filter((branch) => {
                      //           if (userRole === "Branch") {
                      //             return branch._id === branchId;
                      //           }
                      //           return (
                      //             branch.name && branch.name?.trim() !== ""
                      //           );
                      //         })
                      //         ?.sort((a, b) => a.name.localeCompare(b.name))
                      //         ?.map((branch) => ({
                      //           value: branch._id,
                      //           label: branch.name,
                      //         }))
                      //     : []),
                      // ]}
                      value={
                        selectedBranch !== null && selectedBranch !== undefined
                          ? {
                              value: selectedBranch,
                              label:
                                selectedBranch === "all"
                                  ? "All"
                                  : selectedBranch === ""
                                  ? "Head Office"
                                  : branchList?.find(
                                      (branch) => branch._id === selectedBranch
                                    )?.name || "Select Branch",
                            }
                          : null
                      }
                      onChange={(selectedOption) => {
                        const branchValue = selectedOption?.value || "";
                        setSelectedBranch(branchValue);

                        let newShowAll = false;
                        let branchId = "";

                        if (branchValue === "all") {
                          newShowAll = true;
                          branchId = "";
                        } else if (branchValue === "") {
                          newShowAll = false;
                          branchId = "";
                        } else {
                          newShowAll = false;
                          branchId = branchValue;
                        }

                        setShowAll(newShowAll);

                        if (canRead) {
                          fetchAllVisitorApplication(
                            1,
                            itemsPerPage,
                            search,
                            mainStatus?.value || "",
                            branchId,
                            newShowAll,
                            selectedCountry?.value || "",
                            followUpDate
                          );
                        }
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                )}
                <div className="filter-item">
                  <Form.Label>Status</Form.Label>
                  <Select
                    className="filter-height"
                    options={visitorStatusOptions}
                    value={mainStatus}
                    onChange={handleVisitorStatusChange}
                    placeholder="Select Status"
                    classNamePrefix="custom-select"
                    isClearable
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Country</Form.Label>
                  <Select
                    className="filter-height"
                    options={preferredCountries?.map((c) => ({
                      value: c.name,
                      label: c.name,
                    }))}
                    placeholder="Select Country"
                    classNamePrefix="custom-select"
                    isClearable
                    value={selectedCountry}
                    onChange={(selectedOption) => {
                      setSelectedCountry(selectedOption);
                      setCurrentPage(1);
                      if (canRead) {
                        const branchId =
                          selectedBranch === "all" ? "" : selectedBranch || "";
                        const newShowAll =
                          selectedBranch === "all" ? true : showAll;
                        fetchAllVisitorApplication(
                          1,
                          itemsPerPage,
                          search,
                          mainStatus?.value || "",
                          branchId,
                          newShowAll,
                          selectedOption?.value || "",
                          followUpDate
                        );
                      }
                    }}
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Follow Up Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      className="filter-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        followUpDate ? formatDate(parseDate(followUpDate)) : ""
                      }
                      readOnly
                      ref={startDateInputRef}
                      onClick={() => {
                        if (followUpDate) {
                          setStartDateValue(parseDate(followUpDate));
                        }
                        setShowStartDateCalendar((show) => !show);
                      }}
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
                    />
                    {followUpDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFollowUpDate("");
                          setStartDateValue(null);
                          setShowStartDateCalendar(false);
                        }}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 16,
                          color: "#888",
                          padding: 0,
                          zIndex: 10000,
                        }}
                        aria-label="Clear date"
                      >
                        ×
                      </button>
                    ) : (
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
                    )}
                    {showStartDateCalendar && (
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
                            setStartDateValue(selectedDate);
                            setFollowUpDate(toISODate(selectedDate));
                            setShowStartDateCalendar(false);
                            setCurrentPage(1);
                          }}
                          value={startDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="filter-item">
                  {allVisitorApplication?.some((visitor) =>
                    isToday(
                      visitor.followUps?.personalDetails?.nextFollowUpDate
                    )
                  ) && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={() => {
                        const today = new Date();
                        setStartDateValue(today);
                        setFollowUpDate(toISODate(today));
                        setCurrentPage(1);
                      }}
                    >
                      Today Followup
                    </Button>
                  )}
                </div>

                <div className="flex-grow-1"></div>

                {canRead && (
                  <>

                    <div className="filter-item-rows">
                      <ItemsPerPageSelect
                        itemsPerPage={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                        <span>
                          Total Records :<strong>&nbsp;{totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <VisitorFormModal
                show={show}
                handleClose={handleClose}
                formik={formik}
                isLoading={isLoading}
                countries={countries}
                stateDropDown={stateDropDown}
                cityDropDownList={cityDropDownList}
                preferredCountries={preferredCountries}
                visitorSubPlans={visitorSubPlans}
                formatDate={formatDate}
                parseDate={parseDate}
                handleCountryChange={handleCountryChange}
                handleStateChange={handleStateChange}
                bankOptions={bankOptions}
                visitorProcessRenewalDateInputRef={
                  visitorProcessRenewalDateInputRef
                }
                showVisitorProcessRenewalDateCalendar={
                  showVisitorProcessRenewalDateCalendar
                }
                setShowVisitorProcessRenewalDateCalendar={
                  setShowVisitorProcessRenewalDateCalendar
                }
                visitorProcessRenewalDateCalendarRef={
                  visitorProcessRenewalDateCalendarRef
                }
                toISODate={toISODate}
              />

              <Modal
                show={cloneModalOpen}
                onHide={() => {
                  setCloneModalOpen(false);
                  setInstituteId("");
                  setCountryName("");
                }}
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>Clone Visitor Application</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => {
                      setCloneModalOpen(false);
                      setInstituteId("");
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
                            setInstituteId("");
                          }}
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
                      setInstituteId("");
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
                {showChat && chatVisitor && (
                  <div className="chat-card">
                    <div style={{ padding: "3px" }}>
                      <ChatComponent
                        studentId={chatVisitor._id}
                        senderId={userId}
                        role={userRole}
                        studentData={studentData}
                        handleChatClose={handleChatClose}
                      />
                    </div>
                  </div>
                )}
              </div>

              <VisitorCard
                allVisitorApplication={allVisitorApplication}
                formatDate={formatDate}
                parseDate={parseDate}
                getColors={getColors}
                handleChatOpen={handleChatOpen}
                setSelectedLeadName={setSelectedLeadName}
                setSelectedMobileNumber={setSelectedMobileNumber}
                setIsWhatsappModalOpen={setIsWhatsappModalOpen}
                setSelecteWaDaddyWhatsappdData={setSelecteWaDaddyWhatsappdData}
                setIsWaDaddyWhatsappModalOpen={setIsWaDaddyWhatsappModalOpen}
                handleEdit={handleEdit}
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
                setCloneModalOpen={setCloneModalOpen}
                setSelectedVisitor={setSelectedVisitor}
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

              <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title className="fw-semibold">
                    Confirm Deletion
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => setShowDeleteModal(false)}
                  />
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                  <div className="text-danger text-primary fs-1 mb-3">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                  </div>
                  <p className="mb-1 fw-semibold">
                    Are you sure you want to delete this item?
                  </p>
                  <small className="text-muted">
                    This action cannot be undone.
                  </small>
                </Modal.Body>

                <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
                  <Button
                    variant="light"
                    className="btn-cancel-delete px-4"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="btn-delete-confirm"
                    onClick={() => {
                      handleDelete(selectedItem);
                    }}
                  >
                    <i className="bi bi-trash-fill me-2"></i>Delete
                  </Button>
                </Modal.Footer>
              </Modal>

              {totalPages > 1 && allVisitorApplication?.length > 0 && (
                 <div className="d-flex justify-content-end mt-3">
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

export default VisitorApplication;
