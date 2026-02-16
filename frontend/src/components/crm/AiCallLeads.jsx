import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { AiOutlineClose } from "react-icons/ai";
import { MdCalendarToday } from "react-icons/md";
import Pageheader from "../../layouts/Pageheader";
import Paginations from "../elements/Paginations";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  createAiCallLead,
  deleteAiCallLead,
  getAllAiCallLead,
  getOneAiCallLead,
  updateAiCallLead,
} from "../../redux/actions/AiCallLead.action";
import {
  downloadLeads,
  editHistory,
  getLeadByAssignUser,
  getLeadCountry,
  getLeadFrom,
  insertMany,
  sendWPMessage,
} from "../../redux/actions/Lead.action";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { getAllLeadStatus } from "../../redux/actions/Master/LeadStatus.action";
import { adminGetAll, memberGetAll } from "../../redux/actions/Admin.action";
import { getAllExam } from "../../redux/actions/Lead/Exam.action";
import { getAllDegree } from "../../redux/actions/Lead/Degree.action";
import Select from "react-select";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import { getAllCourseFinder } from "../../redux/actions/CourseFinder.action";
import { getAllInquiry } from "../../redux/actions/Lead/Inquiry.action";
import "react-phone-input-2/lib/bootstrap.css";
import usePermissions from "../commonComponents/usePermissions";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import ViewModal from "../commonComponents/ViewModal";
import WhatsappMessageModal from "./commonLeadForm/WhatsAppModal";
import FormModal from "./commonLeadForm/FormModal";
import { getBranchMemberByBranch } from "../../redux/actions/BranchMember.action";
import { decryptData } from "../../utils/encryptionUtils";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { BASEURL } from "../../baseUrl";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getAllFollowUpType } from "../../redux/actions/Lead/FollowUpType.action";
import WaDaddyWhatsAppModal from "./commonLeadForm/WaDaddyWhatsAppModal";
import ConvertToApplicationModal from "./allLeadsComponents/ConvertToApplicationModal";
import AllLeadsCard from "./allLeadsComponents/AllLeadsCard";
import { formatDate, parseDate, toISODate } from "../../utils/leadsUtils";

const createLeadValidation = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone number is required"),
  lead_status: Yup.string().default("New"),
  inquiry_for: Yup.string().nullable().required("Inquiry For is required"),
  remarks: Yup.string(),
});

const validationSchema = Yup.object({
  inquiry_for: Yup.string().nullable().required("Inquiry For is required"),
  name: Yup.string().required("Name is required"),
  intake: Yup.string(),
  email: Yup.string().email("Invalid email format"),
  phone: Yup.string().required("Phone number is required"),
  alternate_contact: Yup.string(),
  gender: Yup.string(),
  dateofbirth: Yup.date(),
  age: Yup.number(),
  address: Yup.string(),
  comments: Yup.string(),
  office_use_only: Yup.string(),
  remarks: Yup.string(),
  lead_status: Yup.string().default("New"),
  lead_form: Yup.string(),
  // lead_assign: Yup.string().nullable(),
  // lead_role: Yup.string().nullable(),
  lead_assign_Branch: Yup.string().nullable(),
  // lead_assign: Yup.string().when("userRole", {
  //   is: (userRole) => userRole !== "Branch Member",
  //   then: () => Yup.string().required("Lead Assign is required"),
  //   otherwise: () => Yup.string().nullable(),
  // }),
  // lead_role: Yup.string().when("userRole", {
  //   is: (userRole) => userRole !== "Branch" && userRole !== "Branch Member", // Not required for Branch or Branch Member
  //   then: () => Yup.string().required("Lead Role is required"),
  //   otherwise: () => Yup.string().nullable(),
  // }),
  // lead_assign: Yup.string().required("Lead Assign is required"),
  // lead_role: Yup.string().required("Lead Role is required"),
  country_interested: Yup.array().of(Yup.string()),
  course: Yup.string(),
  level: Yup.string(),
  budget: Yup.string(),
  how_much_in_bank: Yup.string(),
  english_proficiency: Yup.string(),
  passport: Yup.string(),
  occupation_father: Yup.string(),
  occupation_mother: Yup.string(),
  work_experience: Yup.string(),
  work_post: Yup.string(),
  work_year: Yup.number(),
  visited_countries: Yup.string(),
  visit_count: Yup.number(),
  visa_type: Yup.string(),
  visa_refused: Yup.string(),
  form_type: Yup.string(),
  refused_country: Yup.string(),
  refused_times: Yup.number(),
  refused_years: Yup.array().of(Yup.number()),
  refused_visa_type: Yup.string(),
  next_follow_up: Yup.date(),
  from: Yup.string(),
  to: Yup.string(),
  nationality: Yup.string(),
  pincode: Yup.string(),
  follow_up_type: Yup.string().nullable().notRequired(),
  lead_followup_remark: Yup.string(),
  lead_text_remark: Yup.string(),
  source_of_reference: Yup.string(),
  city: Yup.string().required("City is required"),
  country: Yup.string(),

  refer_friend: Yup.object({
    name: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email("Invalid email format"),
    suggested_countries: Yup.string(),
    courses: Yup.string(),
    response: Yup.string(),
  }),

  reviews: Yup.object({
    reception_greetings: Yup.string(),
    counsellor_explanation: Yup.string(),
    hospitality: Yup.string(),
    hygiene_cleanliness: Yup.string(),
    team_response: Yup.string(),
  }),

  education_evaluation: Yup.array().of(
    Yup.object({
      test_name: Yup.string(),
      scores: Yup.object({
        listen: Yup.number(),
        read: Yup.number(),
        write: Yup.number(),
        speak: Yup.number(),
        overall: Yup.number(),
        duolingoScore: Yup.number(),
      }),
    }),
  ),

  education_details: Yup.array().of(
    Yup.object({
      degree: Yup.string(),
      stream: Yup.string(),
      moi: Yup.string(),
      year: Yup.number(),
      score: Yup.string(),
      institution: Yup.string(),
      backlogs: Yup.number(),
    }),
  ),
});

const AiCallLeads = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [getLeadData, setGetLeadData] = useState([]);
  const [getLeadDataById, setGetLeadDataById] = useState();
  const [show, setShow] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [index, setIndex] = useState({
    // educationEvaluation: 0,
    // educationDetails: 0,
    leadAssignment: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeadLeadModal, setShowDeadLeadModal] = useState(false);
  const [selectedDeadLead, setSelectedDeadLead] = useState(null);
  const [editHistoryData, setEditHistoryData] = useState([]);
  const [allExamData, setAllExamData] = useState([]);
  const [allDegreeData, setAllDegreeData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allcourseData, setAllCourseData] = useState([]);
  const [allInquiry, setAllInquiry] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [allUser, setAllUser] = useState([]);
  const [allBranchs, setAllBranchs] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [leadCountries, setLeadCountries] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [selectedLeadName, setSelectedLeadName] = useState("");
  const [selectedMobileNumber, setSelectedMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadedRecords, setLoadedRecords] = useState(10);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const startDateCalenderRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const endDateCalenderRef = useRef(null);

  // const [subPlans, setSubPlans] = useState([]);

  const branchId = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userRoleBranch = decryptData(localStorage.getItem("userRole"));
  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));
  const B2BAdminid = decryptData(localStorage.getItem("userId"));
  const loggedInMemberId = decryptData(localStorage.getItem("userId"));

  const { canCreate, canRead } = usePermissions("AI Call Leads");

  // wa daddy
  const [isWaDaddyWhatsappModalOpen, setIsWaDaddyWhatsappModalOpen] =
    useState(false);
  const [selectedWaDaddyWhatsappData, setSelecteWaDaddyWhatsappdData] =
    useState(null);

  const [rolesByBranch, setRolesByBranch] = useState({});

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
      alert(error.message || "Failed to send WhatsApp message");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("openModal") === "true") {
      setShow(true);
      navigate(`${import.meta.env.BASE_URL}lead/allleads`, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showStartDateCalendar &&
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target) &&
        startDateCalenderRef.current &&
        !startDateCalenderRef.current.contains(event.target)
      ) {
        setShowStartDateCalendar(false);
      }
      if (
        showEndDateCalendar &&
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target) &&
        endDateCalenderRef.current &&
        !endDateCalenderRef.current.contains(event.target)
      ) {
        setShowEndDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartDateCalendar, showEndDateCalendar]);

  useEffect(() => {
    if (
      show ||
      showViewModal ||
      isWhatsappModalOpen ||
      showDeadLeadModal ||
      openModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, showViewModal, isWhatsappModalOpen, showDeadLeadModal, openModal]);

  const [formData, setFormData] = useState({
    inquiry_for: null,
    intake: "",
    source_of_reference: "",
    dateofbirth: "",
    age: "",
    gender: "",
    name: "",
    email: "",
    phone: "",
    alternate_contact: "",
    address: "",
    country_interested: [],
    course: "",
    level: "",
    budget: "",
    how_much_in_bank: "",
    english_proficiency: "",
    passport: "",
    occupation_father: "",
    occupation_mother: "",
    work_experience: "",
    work_post: "",
    work_year: "",
    visited_countries: "",
    visit_count: "",
    visa_type: "",
    visa_refused: "",
    form_type: "",
    refused_country: "",
    refused_times: "",
    refused_years: [],
    refused_visa_type: "",
    comments: "",
    office_use_only: "",
    remarks: "",
    lead_status: "New",
    lead_form: "",
    // lead_assign: "",
    // lead_role: "",
    lead_assign_Branch: null,
    lead_assign: [],
    refer_friend: {
      name: "",
      phone: "",
      email: "",
      suggested_countries: "",
      courses: "",
      response: "",
    },
    reviews: {
      reception_greetings: "",
      counsellor_explanation: "",
      hospitality: "",
      hygiene_cleanliness: "",
      team_response: "",
    },
    education_evaluation: [],
    education_details: [],
    next_follow_up: new Date().toISOString().split("T")[0],
    from: "",
    to: "",
    nationality: "",
    pincode: "",
    follow_up_type: null,
    lead_followup_remark: "",
    lead_text_remark: "",
    city: "",
    country: "",
  });

  const resetFormData = {
    city: "",
    country: "",
    inquiry_for: "",
    intake: "",
    source_of_reference: "",
    dateofbirth: "",
    age: "",
    gender: "",
    name: "",
    email: "",
    phone: "",
    alternate_contact: "",
    address: "",
    country_interested: [],
    course: "",
    level: "",
    budget: "",
    how_much_in_bank: "",
    english_proficiency: "",
    passport: "",
    occupation_father: "",
    occupation_mother: "",
    work_experience: "",
    work_post: "",
    work_year: "",
    visited_countries: "",
    visit_count: "",
    visa_type: "",
    visa_refused: "",
    form_type: "",
    refused_country: "",
    refused_times: "",
    refused_years: [],
    refused_visa_type: "",
    comments: "",
    office_use_only: "",
    remarks: "",
    lead_status: "New",
    lead_form: "",
    // lead_assign: "",
    // lead_role: "",
    lead_assign_Branch: null,
    lead_assign: [],
    refer_friend: {
      name: "",
      phone: "",
      email: "",
      suggested_countries: "",
      courses: "",
      response: "",
    },
    reviews: {
      reception_greetings: "",
      counsellor_explanation: "",
      hospitality: "",
      hygiene_cleanliness: "",
      team_response: "",
    },
    education_evaluation: [],
    education_details: [],
    next_follow_up: "",
    from: "",
    to: "",
    nationality: "",
    pincode: "",
    follow_up_type: null,
    lead_followup_remark: "",
    lead_text_remark: "",
  };

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    assignId: "",
    lead_from: "",
    branchId: "",
    showAll: false,
    leadActivity: "",
    country: "",
    followUpType: "",
  });
  const [getRoleList, setGetRoleList] = useState();
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState({
    educationEvaluation: false,
    educationEvaluationIndex: 0,
    educationDetails: false,
    educationDetailsIndex: 0,
    leadAssignment: false,
    leadAssignmentIndex: 0,
  });

  const [allFollowUpTypes, setAllFollowUpTypes] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [leadAssignUser, setleadAssignUser] = useState([]);
  const [leadFrom, setLeadFrom] = useState([]);

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

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const followUpTypeOptions =
    allFollowUpTypes?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || [];

  const leadStatusOptions =
    leadStatus?.map((item) => ({
      value: item.name,
      label: item.name,
    })) || [];

  const roleOptions =
    getRoleList?.data
      ?.filter((role) => role?.name !== "Super Admin")
      ?.map((data) => ({
        value: data._id,
        label: data.name,
      })) || [];

  const userOptions =
    allUser?.map((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      return {
        value: user._id,
        label: fullName || user.name,
      };
    }) || [];

  const allBranchOptions =
    allBranchs?.map((branch) => ({
      value: branch._id,
      label: branch.name,
    })) || [];

  const branchRoleOptions =
    memberList
      ?.filter((role) => role.name !== "Super Admin")
      ?.map((data) => ({
        value: data._id,
        label: data.firstName,
      })) || [];
  const leadFollowUpRemarkOptions =
    leadStatus?.map((item) => ({
      value: item.name,
      label: item.name,
    })) || [];

  const courseOptions =
    allcourseData
      ?.flatMap((course) =>
        course
          .split(",")
          .map((part) => part.trim())
          .filter((part) => part),
      )
      .map((course) => ({
        value: course,
        label: course,
      })) || [];

  const examOptions =
    allExamData?.map((exam) => ({
      value: exam.name,
      label: exam.name,
    })) || [];

  const degreeOptions =
    allDegreeData?.map((degree) => ({
      value: degree.name,
      label: degree.name,
    })) || [];

  const reviewOptions = [
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Average", label: "Average" },
  ];

  const leadStatusOption = [
    { value: "Active ", label: "Active " },
    { value: "Inactive", label: "Inactive" },
  ];

  useEffect(() => {
    const payload = {
      page: currentPage || 1,
      limit: itemsPerPage,
      search: searchTerm,
      status: filters.status,
      assignId: filters.assignId,
      lead_from: filters.lead_from,
      startDate: filters.startDate,
      endDate: filters.endDate,
      branchId: filters.branchId,
      showAll: filters.showAll,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
    };

    if (canRead) {
      // setIsLoading(true);
      dispatch(getAllAiCallLead(payload))
        .then((res) => {
          setGetLeadData(res?.data);
          setTotalPages(res?.data?.totalPages || 0);
          setTotalRecords(res?.data?.totalLeads || 0);
        })
        .catch((error) => {
          console.error("Error fetching leads:", error);
          toast.error("Failed to fetch leads");
        });
      // .finally(() => {
      //   setIsLoading(false);
      // });
    }
  }, [currentPage, itemsPerPage, searchTerm, filters, canRead]);

  const changePage = (page) => {
    if (isLoading || page < 1 || page > totalPages) return;

    setIsLoading(true);
    setCurrentPage(page);

    const payload = {
      page: page || 1,
      limit: itemsPerPage,
      status: filters.status,
      assignId: filters.assignId,
      lead_from: filters.lead_from,
      startDate: filters.startDate,
      endDate: filters.endDate,
      search: searchTerm,
      branchId: filters.branchId,
      showAll: filters.showAll,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
    };

    if (canRead) {
      dispatch(getAllAiCallLead(payload))
        .then((res) => {
          setGetLeadData(res?.data);
          setTotalPages(res?.data?.totalPages || 0);
          setTotalRecords(res?.data?.totalLeads || 0);
        })
        .catch((error) => {
          console.error("Error fetching leads:", error);
          toast.error("Failed to fetch leads");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleLoadMore = async () => {
    const newLoadedRecords = loadedRecords + 10;
    setIsLoading(true);

    try {
      const payload = {
        page: 1, // Fetch all records up to the new limit
        limit: newLoadedRecords,
        search: searchTerm,
        status: filters.status,
        assignId: filters.assignId,
        lead_from: filters.lead_from,
        startDate: filters.startDate,
        endDate: filters.endDate,
        branchId: filters.branchId,
        showAll: filters.showAll,
        leadActivity: filters.leadActivity,
        country: filters.country,
        followUpType: filters.followUpType,
      };

      if (canRead) {
        const res = await dispatch(getAllAiCallLead(payload));
        setGetLeadData(res?.data);
        setTotalPages(res?.data?.totalPages || 0);
        setTotalRecords(res?.data?.totalLeads || 0);
        setLoadedRecords(newLoadedRecords);
        setItemsPerPage(newLoadedRecords);
        // window.scrollTo(0, scrollPosition); // Restore scroll position
      }
    } catch (error) {
      console.error("Error fetching more leads:", error);
      toast.error("Failed to load more leads");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemsPerPageChange = async (newItemsPerPage) => {
    if (isLoading) return;

    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setIsLoading(true);

    const payload = {
      page: 1,
      limit: newItemsPerPage,
      search: searchTerm,
      status: filters.status,
      assignId: filters.assignId,
      lead_from: filters.lead_from,
      startDate: filters.startDate,
      endDate: filters.endDate,
      branchId: filters.branchId,
      showAll: filters.showAll,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
    };

    if (canRead) {
      try {
        const res = await dispatch(getAllAiCallLead(payload));
        setGetLeadData(res?.data);
        setTotalPages(res?.data?.totalPages || 0);
        setTotalRecords(res?.data?.totalLeads || 0);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads");
      } finally {
        setIsLoading(false);
      }
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

  const fetchLeadCountries = async () => {
    try {
      const res = await dispatch(getLeadCountry({ fromB2B: false }));
      if (res?.status === 200) {
        setLeadCountries(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching lead countries:", error);
      setLeadCountries([]);
    }
  };

  const handleClose = () => {
    setShow(false);
    setIsEdit(false);
    setFormData(resetFormData);
  };

  const handleShow = () => setShow(true);

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteAiCallLead(id?._id));
      if (response.status === 200) {
        toast.success("Lead deleted successfully!");
        const isLastItemOnPage =
          getLeadData?.data?.length === 1 && currentPage > 1;
        const newPage = isLastItemOnPage ? currentPage - 1 : currentPage;

        const payload = {
          page: newPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: filters.status,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startDate: filters.startDate,
          endDate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
        };

        if (canRead) {
          dispatch(getAllAiCallLead(payload)).then((res) => {
            setGetLeadData(res?.data);
            setTotalPages(res?.data?.totalPages || 0);
            setTotalRecords(res?.data?.totalLeads || 0);
          });
        }
        setCurrentPage(newPage);
        setShowDeleteModal(false);
      }
    } catch (error) {
      toast.error("Something went wrong 1");
      console.error("Error deleting lead", error);
    }
  };

  const handleMarkDeadLead = async () => {
    try {
      const updatedLeadData = {
        // ...item,
        deadLead: true,
      };
      const response = await dispatch(
        updateAiCallLead(selectedDeadLead._id, updatedLeadData),
      );
      if (response.status === 200) {
        toast.success("Lead marked as inactive successfully!");
        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          search: searchTerm,
          status: filters.status,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startDate: filters.startDate,
          endDate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
        };
        if (canRead) {
          dispatch(getAllAiCallLead(payload)).then((res) => {
            setGetLeadData(res?.data);
            setTotalPages(res?.data?.totalPages || 0);
            setTotalRecords(res?.data?.totalLeads || 0);
          });
        }
        setShowDeadLeadModal(false);
        setSelectedDeadLead(null);
      } else {
        toast.error("Failed to mark lead as inactive");
      }
    } catch (error) {
      toast.error("Something went wrong while marking lead as inactive");
      console.error("Error marking lead as inactive", error);
    }
  };

  const handleEducationSubmit = (values) => {
    const currentData = values?.education_evaluation || [];
    const currentIndex = edit.educationEvaluation
      ? edit.educationEvaluationIndex
      : index.educationEvaluation;
    const newEvaluation =
      values.education_evaluation[
        edit.educationEvaluation
          ? edit.educationEvaluationIndex
          : index.educationEvaluation
      ];

    const currentEntry = currentData[currentIndex];

    if (!currentEntry) {
      toast.error("Please select a test name before adding evaluation.");
      return;
    }

    const { test_name } = currentEntry;

    const isTestNameSelected = test_name && test_name.trim() !== "";

    if (isTestNameSelected) {
      setFormData((prevState) => ({
        ...values,
        education_evaluation: [
          ...prevState.education_evaluation,
          newEvaluation,
        ],
      }));
      setIndex((prev) => ({
        ...prev,
        educationEvaluation: prev.educationEvaluation + 1,
      }));
    } else {
      toast.error("Please select a test name before adding evaluation.");
    }
  };

  const handleEditEvaluation = (values) => {
    const updatedData = [...formData.education_evaluation];
    const updatedIndex = edit.educationEvaluationIndex;
    const updatedEntry = values.education_evaluation[updatedIndex];

    updatedData[updatedIndex] = updatedEntry;

    setFormData((prevState) => ({
      ...prevState,
      education_evaluation: updatedData,
    }));

    setEdit((prev) => ({
      ...prev,
      educationEvaluation: false,
      educationEvaluationIndex: 0,
    }));
  };

  const handleDeleteEvaluation = (indexToDelete) => {
    const updatedEvaluations = formData.education_evaluation.filter(
      (_, index) => index !== indexToDelete,
    );

    setFormData((prevState) => ({
      ...prevState,
      education_evaluation: updatedEvaluations,
    }));

    if (
      edit.educationEvaluation &&
      edit.educationEvaluationIndex === indexToDelete
    ) {
      setEdit({
        educationEvaluation: false,
        educationEvaluationIndex: 0,
      });
    }
  };

  const handleDeleteEvaluationDetail = (indexToDelete) => {
    const updatedEvaluations = formData.education_details.filter(
      (_, index) => index !== indexToDelete,
    );

    setFormData((prevState) => ({
      ...prevState,
      education_details: updatedEvaluations,
    }));

    if (edit.educationDetails && edit.educationDetailsIndex === indexToDelete) {
      setEdit({
        educationDetails: false,
        educationDetailsIndex: 0,
      });
    }
  };

  const handleEducationDetailedit = (values) => {
    const updatedData = [...formData.education_details];
    const updatedIndex = edit.educationDetailsIndex;
    const updatedEntry = values.education_details[updatedIndex];

    updatedData[updatedIndex] = updatedEntry;

    setFormData((prevState) => ({
      ...prevState,
      education_details: updatedData,
    }));

    setEdit((prev) => ({
      ...prev,
      educationDetails: false,
      educationDetailsIndex: 0,
    }));
  };

  const handleEducatiDetailonSubmit = (values) => {
    const currentData = values?.education_details || [];
    const currentIndex = edit.educationDetails
      ? edit.educationDetailsIndex
      : index.educationDetails;
    const newEvaluation =
      values.education_details[
        edit.educationDetails
          ? edit.educationDetailsIndex
          : index.educationDetails
      ];

    const currentEntry = currentData[currentIndex];

    if (!currentEntry) {
      toast.error("Please select a test name before adding evaluation.");
      return;
    }

    const { degree } = currentEntry;

    const isTestNameSelected = degree && degree.trim() !== "";

    if (isTestNameSelected) {
      setFormData((prevState) => ({
        ...values,
        education_details: [...prevState.education_details, newEvaluation],
      }));
      setIndex((prev) => ({
        ...prev,
        educationDetails: prev.educationDetails + 1,
      }));
    } else {
      toast.error("Please select a education before adding evaluation.");
    }
  };

  const handleLeadAssignmentSubmit = (values) => {
    const currentData = values?.lead_assign || [];
    const currentIndex = edit.leadAssignment
      ? edit.leadAssignmentIndex
      : index.leadAssignment;
    const newEntry =
      values.lead_assign[
        edit.leadAssignment ? edit.leadAssignmentIndex : index.leadAssignment
      ];
    const currentEntry = currentData[currentIndex];

    if (!currentEntry || !currentEntry.role || !currentEntry.user) {
      toast.error(
        "Please select both Role and User before adding Lead Assignment.",
      );
      return;
    }
    setFormData((prevState) => ({
      ...values,
      lead_assign: [...prevState.lead_assign, newEntry],
    }));
    setIndex((prev) => ({
      ...prev,
      leadAssignment: prev.leadAssignment + 1,
    }));
  };

  const handleLeadAssignmentEdit = (values) => {
    const updatedData = [...formData.lead_assign];
    const updatedIndex = edit.leadAssignmentIndex;
    const updatedEntry = values.lead_assign[updatedIndex];

    updatedData[updatedIndex] = updatedEntry;

    setFormData((prevState) => ({
      ...prevState,
      lead_assign: updatedData,
    }));

    setEdit((prev) => ({
      ...prev,
      leadAssignment: false,
      leadAssignmentIndex: 0,
    }));
  };

  const handleLeadAssignmentDelete = (indexToDelete) => {
    const updatedAssignments = formData.lead_assign.filter(
      (_, index) => index !== indexToDelete,
    );

    setFormData((prevState) => ({
      ...prevState,
      lead_assign: updatedAssignments,
    }));

    if (edit.leadAssignment && edit.leadAssignmentIndex === indexToDelete) {
      setEdit({
        leadAssignment: false,
        leadAssignmentIndex: 0,
      });
    }
  };

  const handelSubmitLead = async (values) => {
    const {
      education_evaluation,
      education_details,
      refused_years,
      reviews,
      refer_friend,
      ...restValues
    } = values;

    // Format lead_assign for create API
    const formattedLeadAssign = (values.lead_assign || [])
      .filter((item) => item && item.role && item.user)
      .map((item) => {
        let roleValue = item.role;
        let userValue = item.user;

        if (roleValue) {
          roleValue = String(roleValue)
            .replace(/^["']+|["']+$/g, "")
            .trim();
        }
        if (userValue) {
          userValue = String(userValue)
            .replace(/^["']+|["']+$/g, "")
            .trim();
        }

        return {
          role: roleValue,
          user: userValue,
        };
      })
      .filter((item) => item.role && item.user);

    // Remove old lead_assign and lead_role from formattedData
    const { lead_assign, ...restForPayload } = restValues;

    const formattedData = {
      ...restForPayload,
      lead_assign: formattedLeadAssign, // Send as array for create API
      visa_refused: values.visa_refused === "yes" ? true : false,
      refused_years: refused_years?.map((year) => Number(year)) || [],
      work_year: Number(values.work_year) || 0,
      education_evaluation: (education_evaluation || []).map((item) => ({
        test_name: item.test_name,
        scores: {
          listen: parseFloat(item.scores.listen),
          read: parseFloat(item.scores.read),
          write: parseFloat(item.scores.write),
          speak: parseFloat(item.scores.speak),
          overall: parseFloat(item.scores.overall),
        },
      })),
      education_details: (education_details || []).map((item) => ({
        degree: item.degree,
        stream: item.stream,
        moi: item.moi,
        year: Number(item.year) || null,
        score: Number(item.score),
        institution: item.institution,
        backlogs: Number(item.backlogs || 0),
      })),
      reviews: {
        ...reviews,
      },
      refer_friend: {
        ...refer_friend,
      },
    };
    setIsLoading(true);
    try {
      const response = await dispatch(createAiCallLead(formattedData));
      if (response.status === 201) {
        handleClose();
        setFormData(resetFormData);
        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          search: searchTerm,
          status: filters.status,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startDate: filters.startDate,
          endDate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
        };
        if (canRead) {
          dispatch(getAllAiCallLead(payload))
            .then((res) => {
              setGetLeadData(res?.data);
              setTotalPages(res?.data?.totalPages || 0);
              setTotalRecords(res?.data?.totalLeads || 0);
            })
            .catch((err) => {
              console.log(err, "err");
            });
        }
        toast.success("Lead Added successfully!");
      }
    } catch (error) {
      console.error("Error adding lead", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handelEditLead = async (values) => {
    const {
      education_evaluation,
      education_details,
      refused_years,
      reviews,
      refer_friend,
      ...restValues
    } = values;

    // Get original lead data to compare
    const originalLead = getLeadDataById?.data;
    const originalLeadAssign = Array.isArray(originalLead?.lead_assign)
      ? originalLead.lead_assign
      : [];

    // Remove old lead_assign, lead_role, and lead_assign from formattedData
    const { lead_assign, ...restForPayload } = restValues;

    // Prepare update payload
    const updatePayload = {
      ...restForPayload,
    };

    // Compare original and new to find changes
    // Get all original entry IDs
    const originalEntryIds = originalLeadAssign
      .map((item) => item._id?.toString())
      .filter(Boolean);

    // Get all new entry IDs (from values.lead_assign which may have _id preserved)
    const newEntryIds = (values.lead_assign || [])
      .map((item) => item._id?.toString())
      .filter(Boolean);

    // Find entries that were deleted (exist in original but not in new)
    const deletedEntryIds = originalEntryIds.filter(
      (id) => !newEntryIds.includes(id),
    );

    // Find new entries (no _id, meaning they're new additions)
    const newEntries = (values.lead_assign || [])
      .filter((item) => item && item.role && item.user && !item._id)
      .map((item) => {
        let roleValue = item.role;
        let userValue = item.user;

        if (roleValue) {
          roleValue = String(roleValue)
            .replace(/^["']+|["']+$/g, "")
            .trim();
        }
        if (userValue) {
          userValue = String(userValue)
            .replace(/^["']+|["']+$/g, "")
            .trim();
        }

        return {
          role: roleValue,
          user: userValue,
        };
      })
      .filter((item) => item.role && item.user);

    // Find existing entries that changed (have _id and role or user changed)
    const existingEntriesToUpdate = [];
    originalLeadAssign.forEach((orig) => {
      const origId = orig._id?.toString();
      if (!origId) return;

      // Find matching entry in new array by _id
      const matchingNewEntry = (values.lead_assign || []).find(
        (item) => item?._id?.toString() === origId,
      );

      if (!matchingNewEntry) return; // Entry was deleted, skip

      // Get original role and user IDs
      const origRoleId =
        typeof orig.role === "string"
          ? orig.role
          : orig.role?._id || orig.role?.toString() || "";
      const origUserId =
        typeof orig.user === "string"
          ? orig.user
          : orig.user?._id || orig.user?.toString() || "";

      // Get new role and user IDs
      const newRoleId = matchingNewEntry.role || "";
      const newUserId = matchingNewEntry.user || "";

      // Clean IDs for comparison
      const cleanOrigRoleId = String(origRoleId)
        .replace(/^["']+|["']+$/g, "")
        .trim();
      const cleanNewRoleId = String(newRoleId)
        .replace(/^["']+|["']+$/g, "")
        .trim();
      const cleanOrigUserId = String(origUserId)
        .replace(/^["']+|["']+$/g, "")
        .trim();
      const cleanNewUserId = String(newUserId)
        .replace(/^["']+|["']+$/g, "")
        .trim();

      // Check if role or user changed
      const roleChanged = cleanOrigRoleId !== cleanNewRoleId;
      const userChanged = cleanOrigUserId !== cleanNewUserId;

      if (roleChanged || userChanged) {
        const updateData = {
          _id: origId,
        };

        // Include role if it changed
        if (roleChanged) {
          updateData.role = cleanNewRoleId;
        }

        // Include user if it changed
        if (userChanged) {
          updateData.user = cleanNewUserId;
        }

        existingEntriesToUpdate.push(updateData);
      }
    });

    // Handle deletions: send lead_assignDeleteId to backend
    if (deletedEntryIds.length > 0) {
      updatePayload.lead_assignDeleteId = deletedEntryIds[0];
    }

    // For update API: send first new entry as lead_assign object if exists (PUSH)
    if (newEntries.length > 0) {
      updatePayload.lead_assign = {
        role: newEntries[0].role,
        user: newEntries[0].user,
      };
    }

    // For existing entries updates: send first update if exists (UPDATE)
    if (existingEntriesToUpdate.length > 0) {
      const entryToUpdate = existingEntriesToUpdate[0];
      updatePayload.lead_assignId = entryToUpdate._id;
      updatePayload.lead_assignUpdate = {};

      // Include role if it changed
      if (entryToUpdate.role !== undefined) {
        updatePayload.lead_assignUpdate.role = entryToUpdate.role;
      }

      // Include user if it changed
      if (entryToUpdate.user !== undefined) {
        updatePayload.lead_assignUpdate.user = entryToUpdate.user;
      }
    }

    const formattedData = {
      ...updatePayload,
      visa_refused: values.visa_refused === "yes" ? true : false,
      refused_years: refused_years?.map((year) => Number(year)) || [],
      work_year: Number(values.work_year) || 0,
      education_evaluation: (education_evaluation || []).map((item) => ({
        test_name: item.test_name,
        scores: {
          listen: parseFloat(item.scores.listen),
          read: parseFloat(item.scores.read),
          write: parseFloat(item.scores.write),
          speak: parseFloat(item.scores.speak),
          overall: parseFloat(item.scores.overall),
        },
      })),
      education_details: (education_details || []).map((item) => ({
        degree: item.degree,
        stream: item.stream,
        moi: item.moi,
        year: Number(item.year) || null,
        score: Number(item.score),
        institution: item.institution,
        backlogs: Number(item.backlogs || 0),
      })),
      reviews: {
        ...reviews,
      },
      refer_friend: {
        ...refer_friend,
      },
    };
    setIsLoading(true);
    try {
      const response = await dispatch(updateAiCallLead(editId, formattedData));
      if (response.status === 200) {
        handleClose();
        setFormData(resetFormData);

        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          search: searchTerm,
          status: filters.status,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startDate: filters.startDate,
          endDate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
        };
        if (canRead) {
          dispatch(getAllAiCallLead(payload)).then((res) => {
            setGetLeadData(res?.data);
            setTotalPages(res?.data?.totalPages || 0);
            setTotalRecords(res?.data?.totalLeads || 0);
          });
        }
        toast.success("Data Update successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong 2");
      console.error("Error updating lead", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setIsEdit(true);
    handleShow();

    dispatch(getOneAiCallLead(item?._id)).then((res) => {
      setGetLeadDataById(res?.data);
    });
  };

  useEffect(() => {
    if (userRole === "Branch") {
      dispatch(getAllRoleList(branchId)).then((res) => {
        setGetRoleList(res?.data);
      });
    } else if (userRoleBranch === "Branch User") {
      dispatch(getAllRoleList(branchUserId)).then((res) => {
        setGetRoleList(res?.data);
      });
    } else {
      dispatch(getAllRoleList("")).then((res) => {
        setGetRoleList(res?.data);
      });
    }
  }, []);

  useEffect(() => {
    if (getLeadDataById?.data) {
      const lead = getLeadDataById.data;
      const cleanedEducationEvaluation = Array.isArray(
        lead.education_evaluation,
      )
        ? lead.education_evaluation.filter((item) => {
            const scores = item.scores || {};
            return (
              item.test_name?.trim() ||
              scores.listen ||
              scores.read ||
              scores.write ||
              scores.speak ||
              scores.overall
            );
          })
        : [];

      const cleanedEducationDetails = Array.isArray(lead.education_details)
        ? lead.education_details.filter((item) => {
            return (
              item.degree?.trim() ||
              item.stream?.trim() ||
              item.moi?.trim() ||
              item.year ||
              item.score ||
              item.institution?.trim() ||
              item.backlogs
            );
          })
        : [];

      setFormData({
        inquiry_for: lead.inquiry_for || null,
        intake: lead.intake || "",
        source_of_reference: lead.source_of_reference || "",
        dateofbirth: lead.dateofbirth ? lead.dateofbirth.split("T")[0] : "",
        age: lead.age || "",
        gender: lead?.gender || "",
        name: lead.name || "",
        email: lead.email || "",
        city: lead.city || "",
        country: lead.country || "",
        phone: lead.phone || "",
        alternate_contact: lead.alternate_contact || "",
        address: lead.address || "",
        country_interested: lead.country_interested || "",
        course: lead.course || "",
        level: lead.level || "",
        budget: lead.budget || "",
        how_much_in_bank: lead.how_much_in_bank || "",
        english_proficiency: lead.english_proficiency || "",
        passport: lead.passport || "",
        occupation_father: lead.occupation_father || "",
        occupation_mother: lead.occupation_mother || "",
        work_experience: lead.work_experience || "",
        work_post: lead.work_post || "",
        work_year: lead.work_year || "",
        visited_countries: lead.visited_countries || "",
        visit_count: lead.visit_count || "",
        visa_type: lead.visa_type || "",
        visa_refused: lead.visa_refused === true ? "yes" : "no",
        refused_country: lead.refused_country || "",
        refused_times: lead.refused_times || "",
        refused_years: lead.refused_years || [],
        refused_visa_type: lead.refused_visa_type || "",
        comments: lead.comments || "",
        office_use_only: lead.office_use_only || "",
        remarks: lead.remarks || "",
        form_type: lead.form_type || "",
        lead_status: lead.lead_status || "New",
        lead_form: lead.lead_form || "",
        // lead_assign: lead.lead_assign || null,
        // lead_role: lead.lead_role || null,
        lead_assign_Branch: lead.lead_assign_Branch || null,
        lead_assign:
          Array.isArray(lead.lead_assign) && lead.lead_assign.length > 0
            ? lead.lead_assign.map((item) => {
                // Extract role and user IDs properly - handle both object and string formats
                let roleId = "";
                let userId = "";

                if (item.role) {
                  roleId =
                    typeof item.role === "string"
                      ? item.role
                      : item.role._id || item.role.toString();
                }

                if (item.user) {
                  userId =
                    typeof item.user === "string"
                      ? item.user
                      : item.user._id || item.user.toString();
                }

                // Clean any escaped quotes
                if (typeof roleId === "string") {
                  roleId = roleId.replace(/^"+|"+$/g, "");
                }
                if (typeof userId === "string") {
                  userId = userId.replace(/^"+|"+$/g, "");
                }

                return {
                  _id: item._id || null, // Preserve _id for tracking existing entries
                  role: roleId,
                  user: userId,
                };
              })
            : [],
        refer_friend: {
          name: lead.refer_friend?.name || "",
          phone: lead.refer_friend?.phone || "",
          email: lead.refer_friend?.email || "",
          suggested_countries: lead.refer_friend?.suggested_countries || "",
          courses: lead.refer_friend?.courses || "",
          response: lead.refer_friend?.response || "",
        },
        reviews: {
          reception_greetings: lead.reviews?.reception_greetings || "",
          counsellor_explanation: lead.reviews?.counsellor_explanation || "",
          hospitality: lead.reviews?.hospitality || "",
          hygiene_cleanliness: lead.reviews?.hygiene_cleanliness || "",
          team_response: lead.reviews?.team_response || "",
        },
        education_evaluation: cleanedEducationEvaluation,
        education_details: cleanedEducationDetails,
        next_follow_up: lead.next_follow_up
          ? new Date(lead.next_follow_up).toISOString().split("T")[0]
          : "",
        from: lead.from || "",
        to: lead.to || "",
        nationality: lead.nationality || "",
        pincode: lead.pincode || "",
        follow_up_type: lead.follow_up_type || null,
        lead_followup_remark: lead.lead_followup_remark || "",
        lead_text_remark: lead.lead_text_remark || "",
      });
    }
  }, [getLeadDataById]);

  const handleDownload = async () => {
    try {
      const leadIds = getLeadData?.data?.map((lead) => lead?._id);
      if (!leadIds || leadIds.length === 0) {
        toast.error("No leads available to download.");
        return;
      }
      const response = await dispatch(downloadLeads(leadIds));
      if (response?.status === 200 && response?.data?.fileUrl) {
        const fileUrl = `${BASEURL}${response.data.fileUrl}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "leads.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Leads downloaded successfully!");
      } else {
        toast.error("No file URL provided in the response.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while downloading leads.",
      );
      console.error("Error downloading leads:", error);
    }
  };

  const handleSampleFileDownload = () => {
    const link = document.createElement("a");
    link.href = `https://zokepconsultant.com/api/public/sampleleadfile/Sample_Lead_Upload.xlsx`;
    link.setAttribute("download", "LeadUpload.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowUploadModal = () => setShowUploadModal(true);
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return alert("Please select a file first.");
    }

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await dispatch(insertMany(formData));
      if (response?.status === 200) {
        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          search: searchTerm,
          status: filters.status,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startDate: filters.startDate,
          endDate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
        };
        if (canRead) {
          dispatch(getAllAiCallLead(payload)).then((res) => {
            setGetLeadData(res?.data);
            setTotalPages(res?.data?.totalPages || 0);
            setTotalRecords(res?.data?.totalLeads || 0);
          });
        }
        toast.success("Leads uploaded successfully!");
      }
      handleCloseUploadModal();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading file");
    }
  };

  const handleView = (id) => {
    dispatch(getOneAiCallLead(id))
      .then((response) => {
        if (response?.data) {
          setGetLeadDataById(response.data);
          setSelectedLead(response.data);
          setShowViewModal(true);
        } else {
          toast.error("Failed to fetch lead data");
        }
      })
      .catch((error) => {
        toast.error("Error fetching lead data");
        console.error("Error fetching lead by ID", error);
      });
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedLead(null);
  };

  const handleEditHistory = (id) => {
    if (id) {
      dispatch(editHistory(id?._id))
        .then((response) => {
          if (response?.data) {
            setEditHistoryData(response?.data?.data);
            setShowHistory(true);
          } else {
            toast.error("Failed to fetch lead data");
          }
        })
        .catch((error) => {
          console.error("Error fetching lead by ID", error);
        });
    }
  };

  const fetchAllExam = () => {
    dispatch(getAllExam(1, 100))
      .then((res) => {
        setAllExamData(res?.data?.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching", error);
      });
  };

  const fetchAllDegree = () => {
    dispatch(getAllDegree(1, 100))
      .then((res) => {
        setAllDegreeData(res?.data?.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching", error);
      });
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchAllCourse = async () => {
    const res = await dispatch(getAllCourseFinder(1, 100000));
    if (res?.status === 200) {
      const programNames =
        res?.data?.data?.data?.map((item) => item.programName) || [];
      const uniqueProgramNames = [...new Set(programNames)];
      setAllCourseData(uniqueProgramNames);
    }
  };

  const fetchInquirys = async () => {
    try {
      const res = await dispatch(getAllInquiry(1, 100000));
      const responseData = res?.data?.data;
      setAllInquiry(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Inquiry:", error);
      setAllInquiry([]);
    }
  };

  useEffect(() => {
    fetchLeadStatus();
    fetchLeadAssignUser();
    fetchLeadFrom();
    fetchAllUser();
    fetchAllBranchs();
    handleEditHistory();
    fetchAllExam();
    fetchAllDegree();
    fetchCountries();
    fetchAllCourse();
    fetchInquirys();
    fetchFollowUpTypes();
    fetchAllBranches();
    fetchLeadCountries();
  }, []);

  const fetchAllB2BMemberByBranch = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    branchId,
  ) => {
    try {
      const res = await dispatch(
        getBranchMemberByBranch(page, limit, search, branchId),
      );
      const responseData = res?.data?.data;
      setMemberList(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      console.log("Error fetching branch members:", error);
      setMemberList([]);
    }
  };

  useEffect(() => {
    if (
      (userRole === "branch" || userRole === "Branch") &&
      canRead &&
      branchId
    ) {
      fetchAllB2BMemberByBranch(
        currentPage,
        itemsPerPage,
        searchTerm,
        branchId,
      );
    }
  }, [currentPage, itemsPerPage, branchId, userRole, canRead]);

  const fetchFollowUpTypes = async () => {
    try {
      const res = await dispatch(getAllFollowUpType(1, 1000, ""));
      const responseData = res?.data?.data;
      setAllFollowUpTypes(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Follow Up Types:", error);
      setAllFollowUpTypes([]);
    }
  };

  const fetchLeadStatus = async () => {
    try {
      const res = await dispatch(getAllLeadStatus());
      if (res?.status === 200) {
        setLeadStatus(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchLeadAssignUser = async () => {
    try {
      const res = await dispatch(getLeadByAssignUser({ fromB2B: false }));
      if (res?.status === 200) {
        setleadAssignUser(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchLeadFrom = async () => {
    try {
      const res = await dispatch(getLeadFrom());
      if (res?.status === 200) {
        setLeadFrom(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchAllUser = async (id, roleName) => {
    try {
      let res;
      if (userRole === "B2B Admin") {
        res = await dispatch(memberGetAll(B2BAdminid, id));
      } else {
        res = await dispatch(adminGetAll(1, 100, "", roleName, "", false));
      }
      const responseData = res?.data?.data;
      setAllUser(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching users:", error);
      // setAllUser([]);
    }
  };

  const fetchFormUsers = (roleId, roleName, branchId, showAll = false) =>
    fetchAllUser(roleId, roleName, branchId, showAll, "form");

  // Helper to get branch name by ID
  const getBranchNameById = (branchId) => {
    const branch = branchList?.find((b) => b._id === branchId);
    return branch ? branch.name : "Head Office";
  };

  // Fetch roles for a given branch ID and cache them
  const fetchRolesForBranch = async (branchId) => {
    if (rolesByBranch[branchId || "head_office"]) {
      return rolesByBranch[branchId || "head_office"];
    }

    try {
      const res = await dispatch(getAllRoleList(branchId || "", false));
      const roleData = res?.data?.data || [];
      setRolesByBranch((prev) => ({
        ...prev,
        [branchId || "head_office"]: roleData,
      }));
      return roleData;
    } catch (error) {
      console.error("Error fetching roles for branch:", branchId, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchHeadOfficeRoles = async () => {
      try {
        // Empty string means Head Office roles
        const res = await dispatch(getAllRoleList("", false));
        setRolesByBranch((prev) => ({
          ...prev,
          HEAD_OFFICE: res?.data?.data || [],
        }));
      } catch (error) {
        console.error("Error fetching Head Office roles:", error);
      }
    };
    fetchHeadOfficeRoles();
  }, [dispatch]);

  const getRoleNameById = (roleId, branchId) => {
    if (!roleId) return "N/A";

    if (!branchId) {
      const role = getRoleList?.data?.find((r) => r._id === roleId);
      return role ? role.name : "N/A";
    }

    const branchRoles = rolesByBranch[branchId];
    const role = branchRoles?.find((r) => r._id === roleId);
    if (role) return role.name;

    const fallbackRole = getRoleList?.data?.find((r) => r._id === roleId);
    return fallbackRole ? fallbackRole.name : "N/A";
  };

  useEffect(() => {
    if (getLeadData?.data?.length > 0) {
      const uniqueBranchIds = [
        ...new Set(
          getLeadData.data.map(
            (lead) => lead.lead_assign_Branch || "head_office",
          ),
        ),
      ];

      uniqueBranchIds.forEach((bId) => {
        fetchRolesForBranch(bId);
      });
    }
  }, [getLeadData]);

  const fetchAllBranchs = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 10000));
      const responseData = res?.data?.data;
      setAllBranchs(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setAllBranchs([]);
    }
  };

  const leadSections = [
    {
      title: "Lead Details",
      fields: [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Country", key: "country" },
        { label: "City", key: "city" },
        { label: "Alternate Contact", key: "alternate_contact" },
        { label: "Gender", key: "gender" },
        {
          label: "Date of Birth",
          key: "dateofbirth",
          render: (data) =>
            data.dateofbirth
              ? new Date(data.dateofbirth).toLocaleDateString()
              : "N/A",
        },
        { label: "Age", key: "age" },
        { label: "Address", key: "address" },
        { label: "Nationality", key: "nationality" },
        { label: "Pincode", key: "pincode" },
        { label: "Comments", key: "comments" },
        { label: "Office Use Only", key: "office_use_only" },
      ],
    },
    {
      title: "Follow-up Details",
      fields: [
        {
          label: "Next Follow-up",
          key: "next_follow_up",
          render: (data) =>
            data.next_follow_up
              ? new Date(data.next_follow_up).toLocaleDateString()
              : "N/A",
        },
        { label: "From", key: "from" },
        { label: "To", key: "to" },
        { label: "Lead Follow-up Remark", key: "lead_followup_remark" },
        { label: "Lead Status", key: "lead_status" },
        { label: "Lead Form", key: "lead_form" },
        { label: "Lead Assign", key: "lead_assign_name" },
        { label: "Branch Lead Assign", key: "lead_assign_Branch" },
      ],
    },
    {
      title: "Inquiry Info",
      fields: [
        { label: "Inquiry For", key: "inquiry_for" },
        { label: "Source of Reference", key: "source_of_reference" },
        { label: "Form Type", key: "form_type" },
      ],
    },
    {
      title: "Education & Course Info",
      fields: [
        {
          label: "Country Interested",
          key: "country_interested",
          render: (data) =>
            data.country_interested?.length > 0
              ? data.country_interested.join(", ")
              : "N/A",
        },
        { label: "Course", key: "course" },
        { label: "Level", key: "level" },
        { label: "Budget", key: "budget" },
        { label: "How Much in Bank", key: "how_much_in_bank" },
        { label: "English Proficiency", key: "english_proficiency" },
        { label: "Passport", key: "passport" },
        { label: "Intake", key: "intake" },
      ],
    },
    {
      title: "Family & Work",
      fields: [
        { label: "Father's Occupation", key: "occupation_father" },
        { label: "Mother's Occupation", key: "occupation_mother" },
        { label: "Work Experience", key: "work_experience" },
        { label: "Work Post", key: "work_post" },
        { label: "Work Year", key: "work_year" },
      ],
    },
    {
      title: "Visa Info",
      fields: [
        { label: "Visited Countries", key: "visited_countries" },
        { label: "Visit Count", key: "visit_count" },
        { label: "Visa Type", key: "visa_type" },
        {
          label: "Visa Refused",
          key: "visa_refused",
          render: (data) => (data.visa_refused ? "Yes" : "No"),
        },
        { label: "Refused Country", key: "refused_country" },
        { label: "Refused Times", key: "refused_times" },
        {
          label: "Refused Years",
          key: "refused_years",
          render: (data) =>
            data.refused_years?.length > 0
              ? data.refused_years.join(", ")
              : "N/A",
        },
        { label: "Refused Visa Type", key: "refused_visa_type" },
      ],
    },
    {
      title: "Education Evaluation",
      type: "table",
      headers: [
        "Test Name",
        "Listening",
        "Reading",
        "Writing",
        "Speaking",
        "Overall",
        "Duolingo Score",
      ],
      data: getLeadDataById?.data?.education_evaluation || [],
      renderRow: (row) => [
        row.test_name,
        row.scores?.listen,
        row.scores?.read,
        row.scores?.write,
        row.scores?.speak,
        row.scores?.overall,
        row.scores?.duolingoScore,
      ],
    },
    {
      title: "Education Details",
      type: "table",
      headers: [
        "Degree",
        "Stream",
        "MOI",
        "Year",
        "Score",
        "Institution",
        "Backlogs",
      ],
      data: getLeadDataById?.data?.education_details || [],
      renderRow: (row) => [
        row.degree,
        row.stream,
        row.moi,
        row.year,
        row.score,
        row.institution,
        row.backlogs,
      ],
    },
    {
      title: "Refer a Friend",
      fields: [
        { label: "Name", key: "refer_friend.name" },
        { label: "Phone", key: "refer_friend.phone" },
        { label: "Email", key: "refer_friend.email" },
        {
          label: "Suggested Countries",
          key: "refer_friend.suggested_countries",
        },
        { label: "Courses", key: "refer_friend.courses" },
        { label: "Response", key: "refer_friend.response" },
      ],
    },
    {
      title: "Reviews",
      fields: [
        { label: "Reception Greetings", key: "reviews.reception_greetings" },
        {
          label: "Counsellor Explanation",
          key: "reviews.counsellor_explanation",
        },
        { label: "Hospitality", key: "reviews.hospitality" },
        { label: "Hygiene & Cleanliness", key: "reviews.hygiene_cleanliness" },
        { label: "Team Response", key: "reviews.team_response" },
      ],
    },
  ];

  return (
    <>
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
      <Pageheader
        mainheading="AI Call Leads"
        parentfolder="Home"
        activepage="AI Call Leads"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-between">
              <div className="card-title mb-0">AI Call Leads</div>
              {canRead && (
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <div className="position-relative search-container flex-grow-1">
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      className="custom-select-height ps-5 rounded-pill"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <i
                      className="bi bi-search position-absolute"
                      style={{
                        top: "50%",
                        left: "15px",
                        transform: "translateY(-50%)",
                      }}
                    />
                  </div>
                  <Button
                    variant="primary"
                    className="custom-select-height px-3"
                    onClick={() => handleDownload()}
                  >
                    Download
                  </Button>
                  {canCreate && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-3"
                      onClick={handleShow}
                    >
                      Add Lead
                    </Button>
                  )}
                  <div className="d-flex flex-column">
                    {canCreate && (
                      <Button
                        variant="primary"
                        className="custom-select-height px-3 mt-4"
                        onClick={handleShowUploadModal}
                      >
                        Upload
                      </Button>
                    )}
                    <Link
                      href="#"
                      className="mt-1 text-decoration-underline"
                      onClick={() => handleSampleFileDownload()}
                    >
                      Get Sample File
                    </Link>
                  </div>
                </div>
              )}
            </Card.Header>
            <Card.Body>
              {canRead && (
                <>
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                    <div className="filter-item">
                      <Form.Label>Start Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          className="filter-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            filters.startDate
                              ? formatDate(parseDate(filters.startDate))
                              : ""
                          }
                          readOnly
                          ref={startDateInputRef}
                          onClick={() => {
                            if (filters.startDate) {
                              setStartDateValue(parseDate(filters.startDate));
                            }
                            setShowStartDateCalendar((show) => !show);
                          }}
                          style={{ cursor: "pointer", backgroundColor: "#fff" }}
                        />
                        {filters.startDate ? (
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({ ...filters, startDate: "" });
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
                            ref={startDateCalenderRef}
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
                                setFilters({
                                  ...filters,
                                  startDate: toISODate(selectedDate),
                                });
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
                      <Form.Label>End Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          className="filter-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            filters.endDate
                              ? formatDate(parseDate(filters.endDate))
                              : ""
                          }
                          readOnly
                          ref={endDateInputRef}
                          onClick={() => {
                            if (filters.endDate) {
                              setEndDateValue(parseDate(filters.endDate));
                            }
                            setShowEndDateCalendar((show) => !show);
                          }}
                          style={{ cursor: "pointer", backgroundColor: "#fff" }}
                        />
                        {filters.endDate ? (
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({ ...filters, endDate: "" });
                              setEndDateValue(null);
                              setShowEndDateCalendar(false);
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
                        {showEndDateCalendar && (
                          <div
                            ref={endDateCalenderRef}
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
                                setEndDateValue(selectedDate);
                                setFilters({
                                  ...filters,
                                  endDate: toISODate(selectedDate),
                                });
                                setShowEndDateCalendar(false);
                                setCurrentPage(1);
                              }}
                              value={endDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {userRole === "Super Admin" && (
                      <div className="filter-item">
                        <Form.Label>Branch</Form.Label>
                        <Select
                          className="filter-height"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                              minHeight: "38px",
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
                                    return (
                                      branch.name && branch.name.trim() !== ""
                                    );
                                  })
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((branch) => ({
                                    value: branch._id,
                                    label: branch.name,
                                  }))
                              : []),
                          ]}
                          value={
                            selectedBranch !== null &&
                            selectedBranch !== undefined
                              ? {
                                  value: selectedBranch,
                                  label:
                                    selectedBranch === "all"
                                      ? "All"
                                      : selectedBranch === ""
                                        ? "Head Office"
                                        : branchList.find(
                                            (branch) =>
                                              branch._id === selectedBranch,
                                          )?.name || "Select Branch",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            setSelectedBranch(selectedOption?.value || "");
                            setFilters({
                              ...filters,
                              branchId:
                                selectedOption.value === "all"
                                  ? ""
                                  : selectedOption.value,
                              showAll:
                                selectedOption.value === "all" ? true : false,
                            });
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                    )}
                    <div className="filter-item">
                      <Form.Label>Country</Form.Label>
                      <Select
                        className="filter-height"
                        styles={selectStyles}
                        classNamePrefix="select"
                        value={
                          filters.country
                            ? {
                                value: filters.country,
                                label:
                                  leadCountries.find(
                                    (c) => c === filters.country,
                                  ) || filters.country,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          setFilters({
                            ...filters,
                            country: selected ? selected.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        options={leadCountries.map((country) => ({
                          value: country,
                          label: country,
                        }))}
                        placeholder="Select Country"
                        isClearable
                        isSearchable
                        noOptionsMessage={() => "No countries available"}
                      />
                    </div>
                    <div className="filter-item">
                      <Form.Label>Follow Up Type</Form.Label>
                      <Select
                        className="filter-height"
                        styles={selectStyles}
                        classNamePrefix="select"
                        value={
                          filters.followUpType
                            ? followUpTypeOptions.find(
                                (option) =>
                                  option.value === filters.followUpType,
                              )
                            : null
                        }
                        onChange={(selected) => {
                          setFilters({
                            ...filters,
                            followUpType: selected ? selected.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        options={followUpTypeOptions}
                        placeholder="Select Type"
                        isClearable
                        isSearchable
                        noOptionsMessage={() => "No countries available"}
                      />
                    </div>
                    <div className="filter-item">
                      <Form.Label>Status</Form.Label>
                      <Select
                        styles={selectStyles}
                        classNamePrefix="select"
                        value={
                          filters.status
                            ? {
                                value: filters.status,
                                label: filters.status,
                              }
                            : null
                        }
                        onChange={(option) => {
                          setFilters({
                            ...filters,
                            status: option ? option.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        options={leadStatus?.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        placeholder="Select Status"
                        isClearable
                      />
                    </div>
                    <div className="filter-item">
                      <Form.Label>Lead Assign</Form.Label>
                      <Select
                        className="filter-height"
                        value={
                          leadAssignUser?.find(
                            (item) => item._id === filters.assignId,
                          )
                            ? {
                                value: filters.assignId,
                                label: leadAssignUser.find(
                                  (item) => item._id === filters.assignId,
                                )?.name,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          setFilters({
                            ...filters,
                            assignId: selected ? selected.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        options={
                          leadAssignUser?.map((item) => ({
                            value: item._id,
                            label: item.name,
                          })) || []
                        }
                        placeholder="Select Assign"
                        isClearable
                        styles={selectStyles}
                      />
                    </div>
                    <div className="filter-item">
                      <Form.Label>Lead From</Form.Label>
                      <Select
                        className="filter-height"
                        value={
                          leadFrom?.includes(filters.lead_from)
                            ? {
                                value: filters.lead_from,
                                label: filters.lead_from,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          setFilters({
                            ...filters,
                            lead_from: selected ? selected.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        options={
                          leadFrom?.length > 0
                            ? leadFrom?.map((item) => ({
                                value: item,
                                label: item,
                              }))
                            : []
                        }
                        placeholder="Select From"
                        isClearable
                        styles={selectStyles}
                        noOptionsMessage={() => "No lead sources available"}
                      />
                    </div>
                    <div className="filter-item">
                      <Form.Label>Activity</Form.Label>
                      <Select
                        className="filter-height"
                        styles={selectStyles}
                        classNamePrefix="select"
                        value={
                          filters.leadActivity
                            ? {
                                value: filters.leadActivity,
                                label: filters.leadActivity,
                              }
                            : null
                        }
                        onChange={(option) => {
                          setFilters({
                            ...filters,
                            leadActivity: option ? option.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        options={leadStatusOption?.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        placeholder="Select Activity"
                        isClearable
                      />
                    </div>
                    <div className="flex-grow-1"></div>
                    <div className="filter-item-rows">
                      <ItemsPerPageSelect
                        itemsPerPage={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                        <span>
                          Total Records: <strong>{totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>Upload File</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Select a file to upload</Form.Label>
                      <Form.Control
                        type="file"
                        className="custom-select-height"
                        onChange={handleFileChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="link"
                    className="custom-select-height btn border-primary text-primary text-decoration-none"
                    onClick={handleCloseUploadModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleFileUpload}
                  >
                    Upload
                  </Button>
                </Modal.Footer>
              </Modal>
              <FormModal
                show={show}
                setShow={setShow}
                handleClose={handleClose}
                isEdit={isEdit}
                edit={edit}
                setEdit={setEdit}
                index={index}
                formData={formData}
                createLeadValidation={createLeadValidation}
                validationSchema={validationSchema}
                userRole={userRole}
                userType={userType}
                loggedInMemberId={loggedInMemberId}
                fetchAllUser={fetchAllUser}
                countries={countries}
                getRoleList={getRoleList}
                handelSubmitLead={handelSubmitLead}
                handelEditLead={handelEditLead}
                genderOptions={genderOptions}
                followUpTypeOptions={followUpTypeOptions}
                leadStatusOptions={leadStatusOptions}
                allInquiry={allInquiry}
                roleOptions={roleOptions}
                userOptions={userOptions}
                allBranchOptions={allBranchOptions}
                branchRoleOptions={branchRoleOptions}
                courseOptions={courseOptions}
                degreeOptions={degreeOptions}
                examOptions={examOptions}
                reviewOptions={reviewOptions}
                leadFollowUpRemarkOptions={leadFollowUpRemarkOptions}
                showHistory={showHistory}
                handleEducationSubmit={handleEducationSubmit}
                handleEditEvaluation={handleEditEvaluation}
                handleDeleteEvaluation={handleDeleteEvaluation}
                handleEducatiDetailonSubmit={handleEducatiDetailonSubmit}
                handleEducationDetailedit={handleEducationDetailedit}
                handleDeleteEvaluationDetail={handleDeleteEvaluationDetail}
                handleLeadAssignmentSubmit={handleLeadAssignmentSubmit}
                handleLeadAssignmentEdit={handleLeadAssignmentEdit}
                handleLeadAssignmentDelete={handleLeadAssignmentDelete}
                editHistoryData={editHistoryData}
                setShowHistory={setShowHistory}
                tabName="AiCallLead"
              />
              <ViewModal
                show={showViewModal}
                onHide={handleCloseViewModal}
                title="View Lead Details"
                data={getLeadDataById?.data}
                fields={leadSections}
              />

              <ConvertToApplicationModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                setIsLoading={setIsLoading}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                selectedLead={selectedLead}
                searchTerm={searchTerm}
                filters={filters}
                setGetLeadData={setGetLeadData}
                setTotalPages={setTotalPages}
                setTotalRecords={setTotalRecords}
                fetchLeadStatus={fetchLeadStatus}
                countries={countries}
                convertPage="aicallleads"
                canRead={canRead}
              />

              <AllLeadsCard
                getLeadData={getLeadData}
                leadStatus={leadStatus}
                handleEdit={handleEdit}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                handleDelete={handleDelete}
                handleView={handleView}
                setSelectedDeadLead={setSelectedDeadLead}
                setShowDeadLeadModal={setShowDeadLeadModal}
                handleEditHistory={handleEditHistory}
                setSelecteWaDaddyWhatsappdData={setSelecteWaDaddyWhatsappdData}
                setIsWaDaddyWhatsappModalOpen={setIsWaDaddyWhatsappModalOpen}
                setSelectedLeadName={setSelectedLeadName}
                setSelectedMobileNumber={setSelectedMobileNumber}
                setIsWhatsappModalOpen={setIsWhatsappModalOpen}
                setSelectedLead={setSelectedLead}
                setOpenModal={setOpenModal}
                aiCall={true}
                recordPDF={true}
                aiCallLead={true}
                getRoleNameById={getRoleNameById}
                getBranchNameById={getBranchNameById}
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
                className="leads-modal"
                show={showDeadLeadModal}
                onHide={() => {
                  setShowDeadLeadModal(false);
                  setSelectedDeadLead(null);
                }}
                centered
              >
                <Modal.Header
                  style={{
                    background: "linear-gradient(90deg, #dc2626, #ef4444)",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                >
                  <Modal.Title className="fw-semibold">
                    Confirm Mark as Inactive Lead
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => {
                      setShowDeadLeadModal(false);
                      setSelectedDeadLead(null);
                    }}
                  />
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                  <div className="text-danger fs-1 mb-3">
                    <DangerousIcon fontSize="large" />
                  </div>
                  <p className="mb-1 fw-semibold">
                    Are you sure you want to mark this lead as inactive?
                  </p>
                  <small className="text-muted">
                    This action will update the lead status to inactive.
                  </small>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
                  <Button
                    variant="light"
                    className="btn-cancel-delete px-4"
                    onClick={() => {
                      setShowDeadLeadModal(false);
                      setSelectedDeadLead(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="btn-delete-confirm"
                    onClick={() => handleMarkDeadLead(setSelectedDeadLead)}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>Yes
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* <LoadMoreButton
                isLoading={isLoading}
                loadedRecords={loadedRecords}
                totalRecords={totalRecords}
                onLoadMore={handleLoadMore}
              /> */}
              {totalPages > 1 && getLeadData?.data?.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => changePage(page)}
                  isLoading={isLoading}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AiCallLeads;
