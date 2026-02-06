import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { AiOutlineClose } from "react-icons/ai";
import { MdCalendarToday } from "react-icons/md";
import Pageheader from "../../layouts/Pageheader";
import Paginations from "../elements/Paginations";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  addLead,
  deleteLead,
  downloadLeads,
  // filterWiseLead,
  getB2BLead,
  getLeadById,
  updateLead,
  insertMany,
  editHistory,
  getLeadByAssignUser,
  sendWPMessage,
  getLeadFrom,
  getLeadCountry,
} from "../../redux/actions/Lead.action";
import { useDispatch } from "react-redux";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { getAllB2BLeadStatus } from "../../redux/actions/Master/LeadStatuses/LeadStatus.action";
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
import B2BLeadsCard from "./allLeadsComponents/B2BLeadsCard";
import { useNotification } from "../../context/NotificationContext";
import { markNotificationsAsRead } from "../../socket";
import { useSocket } from "../../context/SocketContext";
import ChatComponent from "../student/studentDetails/chat/ChatComponent";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import { getAllLeadSubStatus } from "../../redux/actions/Master/LeadStatuses/LeadSubStatus.action";
import SearchWithDropdown from "../commonComponents/SearchWithDropdown";
import { getAllProgramLevel } from "../../redux/actions/Master/ProgramLevel.action";

const validationSchema = Yup.object({
  // age: Yup.number(),
  b2b_lead_status: Yup.string(),
  country: Yup.string(),
  country_interested: Yup.array().of(Yup.string()),
  dateofbirth: Yup.date(),
  gender: Yup.string(),
  name: Yup.string().required("Name is required"),
  next_follow_up: Yup.date(),
  prefferedCourse: Yup.string(),
  prefferedDegree: Yup.string().nullable(),
  prefferedIntakeMonth: Yup.string(),
  prefferedIntakeYear: Yup.string(),
  remarks: Yup.string(),
  // inquiry_for: Yup.string().nullable(),
  // inquiry_for_other: Yup.string(),
  // intake: Yup.string(),
  // email: Yup.string().email("Invalid email format"),
  // phone: Yup.string(),
  // alternate_contact: Yup.string(),
  // address: Yup.string(),
  // comments: Yup.string(),
  // office_use_only: Yup.string(),
  // lead_status: Yup.string().default("New"),
  // lead_form: Yup.string(),
  // lead_assign: Yup.mixed().nullable(),
  // lead_role: Yup.string().nullable(),
  // lead_assign_Branch: Yup.string().nullable(),
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
  // course: Yup.string(),
  // level: Yup.string(),
  // budget: Yup.string(),
  // how_much_in_bank: Yup.string(),
  // english_proficiency: Yup.string(),
  // passport: Yup.string(),
  // occupation_father: Yup.string(),
  // occupation_mother: Yup.string(),
  // work_experience: Yup.string(),
  // work_post: Yup.string(),
  // work_year: Yup.number(),
  // visited_countries: Yup.string(),
  // visit_count: Yup.number(),
  // visa_type: Yup.string(),
  // visa_refused: Yup.string(),
  // form_type: Yup.string(),
  // refused_country: Yup.string(),
  // refused_times: Yup.number(),
  // refused_years: Yup.array().of(Yup.number()),
  // refused_visa_type: Yup.string(),
  // from: Yup.string(),
  // to: Yup.string(),
  // nationality: Yup.string(),
  // pincode: Yup.string(),
  // follow_up_type: Yup.string().nullable().notRequired(),
  // lead_followup_remark: Yup.string(),
  // lead_text_remark: Yup.string(),
  // source_of_reference: Yup.string(),
  // city: Yup.string(),

  // refer_friend: Yup.object({
  //   name: Yup.string(),
  //   phone: Yup.string(),
  //   email: Yup.string().email("Invalid email format"),
  //   suggested_countries: Yup.string(),
  //   courses: Yup.string(),
  //   response: Yup.string(),
  // }),

  // reviews: Yup.object({
  //   reception_greetings: Yup.string(),
  //   counsellor_explanation: Yup.string(),
  //   hospitality: Yup.string(),
  //   hygiene_cleanliness: Yup.string(),
  //   team_response: Yup.string(),
  // }),

  // education_evaluation: Yup.array().of(
  //   Yup.object({
  //     test_name: Yup.string(),
  //     scores: Yup.object({
  //       listen: Yup.number(),
  //       read: Yup.number(),
  //       write: Yup.number(),
  //       speak: Yup.number(),
  //       overall: Yup.number(),
  //       duolingoScore: Yup.number(),
  //     }),
  //   }),
  // ),

  // education_details: Yup.array().of(
  //   Yup.object({
  //     degree: Yup.string(),
  //     stream: Yup.string(),
  //     moi: Yup.string(),
  //     year: Yup.number(),
  //     score: Yup.string(),
  //     institution: Yup.string(),
  //     backlogs: Yup.number(),
  //   }),
  // ),
});

const searchOption = [
  { label: "Everything", value: "" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Alternate Contact", value: "alternate_contact" },
  { label: "Address", value: "address" },
  { label: "Country Interested", value: "country_interested" },
  { label: "Course", value: "course" },
  { label: "Level", value: "level" },
  { label: "Budget", value: "budget" },
  { label: "English Proficiency", value: "english_proficiency" },
  { label: "Passport", value: "passport" },
];

const B2BLeads = () => {
  const { socket } = useSocket();

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { notificationCount, notifications } = useNotification();

  const [getLeadData, setGetLeadData] = useState([]);
  const [getLeadDataById, setGetLeadDataById] = useState();
  const [show, setShow] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [index, setIndex] = useState({
    educationEvaluation: 0,
    educationDetails: 0,
    leadAssignment: 0,
    interestedCourse: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(searchOption[0]);
  const [totalRecords, setTotalRecords] = useState(0);
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
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const startDateCalenderRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const endDateCalenderRef = useRef(null);

  const [showUpdatedOnCalendar, setShowUpdatedOnCalendar] = useState(false);
  const [updatedOnValue, setUpdatedOnValue] = useState(null);
  const updatedOnInputRef = useRef(null);
  const updatedOnCalenderRef = useRef(null);

  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatStudent, setChatStudent] = useState(null);
  const [studentData, setStudentData] = useState({});

  // const [subPlans, setSubPlans] = useState([]);

  const branchId = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userRoleBranch = decryptData(localStorage.getItem("userRole"));
  const userId = decryptData(localStorage.getItem("userId"));
  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));
  const B2BAdminid = decryptData(localStorage.getItem("userId"));
  const loggedInMemberId = decryptData(localStorage.getItem("userId"));

  const { canCreate, canRead } = usePermissions("B2B Leads");

  // wa daddy
  const [isWaDaddyWhatsappModalOpen, setIsWaDaddyWhatsappModalOpen] =
    useState(false);
  const [selectedWaDaddyWhatsappData, setSelecteWaDaddyWhatsappdData] =
    useState(null);
  const [b2BAdminList, setB2BAdminList] = useState([]);
  const [rolesByBranch, setRolesByBranch] = useState({});
  const [programLevels, setProgramLevels] = useState([]);

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

  // Helper to get yyyy-mm-dd for API/backend
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
    b2b_lead_status: "New",
    country: "",
    country_interested: [],
    dateofbirth: "",
    gender: "",
    lead_assign: [],
    name: "",
    next_follow_up: new Date().toISOString().split("T")[0],
    prefferedCourse: "",
    prefferedDegree: null,
    prefferedIntakeMonth: "",
    prefferedIntakeYear: "",
    remarks: "",
    interestedCourseDetails: [],
    // age: "",
    // inquiry_for: null,
    // inquiry_for_other: "",
    // intake: "",
    // source_of_reference: "",
    // email: "",
    // phone: "",
    // alternate_contact: "",
    // address: "",
    // course: "",
    // level: "",
    // budget: "",
    // how_much_in_bank: "",
    // english_proficiency: "",
    // passport: "",
    // occupation_father: "",
    // occupation_mother: "",
    // work_experience: "",
    // work_post: "",
    // work_year: "",
    // visited_countries: "",
    // visit_count: "",
    // visa_type: "",
    // visa_refused: "",
    // form_type: "",
    // refused_country: "",
    // refused_times: "",
    // refused_years: [],
    // refused_visa_type: "",
    // comments: "",
    // office_use_only: "",
    // lead_status: "New",
    // lead_form: "",
    // lead_assign: "",
    // lead_role: "",
    lead_assign_Branch: null,
    // refer_friend: {
    //   name: "",
    //   phone: "",
    //   email: "",
    //   suggested_countries: "",
    //   courses: "",
    //   response: "",
    // },
    // reviews: {
    //   reception_greetings: "",
    //   counsellor_explanation: "",
    //   hospitality: "",
    //   hygiene_cleanliness: "",
    //   team_response: "",
    // },
    // education_evaluation: [],
    // education_details: [],
    // from: "",
    // to: "",
    // nationality: "",
    // pincode: "",
    // follow_up_type: null,
    // lead_followup_remark: "",
    // lead_text_remark: "",
    // city: "",
  });

  const resetFormData = {
    // age: "",
    b2b_lead_status: "New",
    country: "",
    country_interested: [],
    dateofbirth: "",
    gender: "",
    lead_assign: [],
    name: "",
    next_follow_up: new Date().toISOString().split("T")[0],
    prefferedCourse: "",
    prefferedDegree: null,
    prefferedIntakeMonth: "",
    prefferedIntakeYear: "",
    remarks: "",
    interestedCourseDetails: [],
    // inquiry_for: null,
    // inquiry_for_other: "",
    // intake: "",
    // source_of_reference: "",
    // email: "",
    // phone: "",
    // alternate_contact: "",
    // address: "",
    // course: "",
    // level: "",
    // budget: "",
    // how_much_in_bank: "",
    // english_proficiency: "",
    // passport: "",
    // occupation_father: "",
    // occupation_mother: "",
    // work_experience: "",
    // work_post: "",
    // work_year: "",
    // visited_countries: "",
    // visit_count: "",
    // visa_type: "",
    // visa_refused: "",
    // form_type: "",
    // refused_country: "",
    // refused_times: "",
    // refused_years: [],
    // refused_visa_type: "",
    // comments: "",
    // office_use_only: "",
    // lead_status: "New",
    // lead_form: "",
    // lead_assign: "",
    // lead_role: "",
    lead_assign_Branch: null,
    // refer_friend: {
    //   name: "",
    //   phone: "",
    //   email: "",
    //   suggested_countries: "",
    //   courses: "",
    //   response: "",
    // },
    // reviews: {
    //   reception_greetings: "",
    //   counsellor_explanation: "",
    //   hospitality: "",
    //   hygiene_cleanliness: "",
    //   team_response: "",
    // },
    // education_evaluation: [],
    // education_details: [],
    // from: "",
    // to: "",
    // nationality: "",
    // pincode: "",
    // follow_up_type: null,
    // lead_followup_remark: "",
    // lead_text_remark: "",
    // city: "",
  };

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    subStatus: "",
    lead_from: "",
    leadActivity: "",
    country: "",
    followUpType: "",
    branchId:
      userType === "Branch User" || userRole === "Branch"
        ? branchUserId || branchId
        : "",
    showAll: userType === "Branch User" || userRole === "Branch" ? false : true,
    assignRole: "",
    assignId: "",
    updatedOn: "",
    b2bId: "",
  });
  const [getRoleList, setGetRoleList] = useState();
  const [formRoleList, setFormRoleList] = useState(null);
  const [formUserList, setFormUserList] = useState([]);
  const [fullLeadAssignments, setFullLeadAssignments] = useState([]);
  const [currentEditingAssignment, setCurrentEditingAssignment] =
    useState(null);
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
  const [leadSubStatus, setLeadSubStatus] = useState([]);
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

  const leadSubStatusOptions =
    leadSubStatus?.map((item) => ({
      value: item.name,
      label: item.name,
    })) || [];

  const b2BLeadStatusOptions =
    leadStatus?.map((item) => ({
      value: item.name, // ✅ For Non-B2B: _id
      label: item.name,
    })) || [];

  const roleOptions =
    getRoleList?.data
      ?.filter((role) => role?.name !== "Super Admin")
      ?.map((data) => ({
        value: data._id,
        label: data.name,
      })) || [];

  const handleBranchChange = async (branchId) => {
    try {
      const branchIdToUse = branchId === null ? "" : branchId;
      const res = await dispatch(getAllRoleList(branchIdToUse, false));
      setFormRoleList(res?.data);
      setFormUserList([]);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setFormRoleList(null);
      setFormUserList([]);
    }
  };

  const userOptions =
    allUser?.map((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      return {
        value: user._id,
        label: fullName || user.name,
      };
    }) || [];
  const formRoleOptions =
    formRoleList?.data
      ?.filter((role) => role?.name !== "Super Admin")
      ?.map((data) => ({
        value: data._id,
        label: data.name,
      })) || [];

  const formUserOptions =
    formUserList?.map((user) => {
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
    if (location.state?.filters) {
      setFilters(location.state.filters);
      setSelectedFilter(location.state.selectedFilter);
      setSearchTerm(location.state.searchTerm);
      setCurrentPage(location.state.currentPage);
      setItemsPerPage(location.state.itemsPerPage);
      setActiveView(location.state.activeView);

      const { assignRole, assignId, branchId, showAll } =
        location.state.filters || {};

      if (assignRole || assignId || branchId || showAll) {
        const branchIdToUse = branchId || "";

        dispatch(getAllRoleList(branchIdToUse, showAll)).then((roleRes) => {
          setGetRoleList(roleRes?.data);

          const selectedRole = roleRes?.data?.data?.find(
            (r) => r._id === assignRole,
          );

          const roleToUse =
            assignRole && selectedRole
              ? selectedRole.name
              : userType === "Branch User"
                ? userRole
                : "";

          fetchAllUser(null, roleToUse, branchIdToUse, showAll);
        });
      }
    }
  }, [location.state]);

  useEffect(() => {
    const payload = {
      page: currentPage || 1,
      limit: itemsPerPage,
      searchOnField: selectedFilter.value,
      search: searchTerm,
      startdate: filters.startDate,
      enddate: filters.endDate,
      status: filters.status,
      subStatus: filters.subStatus,
      lead_from: filters.lead_from,
      userId: userId,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
      assignId: filters.assignId,
      branchId: filters.branchId,
      showAll: filters.showAll,
      assignRole: filters.assignRole || "",
      updatedOn: filters.updatedOn || "",
      b2bId: filters.b2bId,
    };

    if (canRead) {
      // setIsLoading(true);
      dispatch(getB2BLead(payload))
        .then((res) => {
          setGetLeadData(res?.data?.data);
          setTotalPages(res?.data?.data?.totalPages || 0);
          setTotalRecords(res?.data?.data?.totalLeads || 0);
        })
        .catch((error) => {
          console.error("Error fetching leads:", error);
          toast.error("Failed to fetch leads");
        });
      // .finally(() => {
      //   setIsLoading(false);
      // });
    }
  }, [currentPage, itemsPerPage, searchTerm, selectedFilter, filters, canRead]);

  const changePage = (page) => {
    if (isLoading || page < 1 || page > totalPages) return;

    setIsLoading(true);
    setCurrentPage(page);

    const payload = {
      page: page || 1,
      limit: itemsPerPage,
      searchOnField: selectedFilter.value,
      search: searchTerm,
      startdate: filters.startDate,
      enddate: filters.endDate,
      status: filters.status,
      subStatus: filters.subStatus,
      lead_from: filters.lead_from,
      userId: userId,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
      assignId: filters.assignId,
      branchId: filters.branchId,
      showAll: filters.showAll,
      assignRole: filters.assignRole || "",
      updatedOn: filters.updatedOn || "",
      b2bId: filters.b2bId,
    };

    if (canRead) {
      dispatch(getB2BLead(payload))
        .then((res) => {
          setGetLeadData(res?.data?.data);
          setTotalPages(res?.data?.data?.totalPages || 0);
          setTotalRecords(res?.data?.data?.totalLeads || 0);
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

  const handleItemsPerPageChange = async (newItemsPerPage) => {
    if (isLoading) return;

    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setIsLoading(true);

    const payload = {
      page: 1,
      limit: newItemsPerPage,
      searchOnField: selectedFilter.value,
      search: searchTerm,
      startdate: filters.startDate,
      enddate: filters.endDate,
      status: filters.status,
      subStatus: filters.subStatus,
      lead_from: filters.lead_from,
      userId: userId,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
      assignId: filters.assignId,
      branchId: filters.branchId,
      showAll: filters.showAll,
      assignRole: filters.assignRole || "",
      updatedOn: filters.updatedOn || "",
      b2bId: filters.b2bId,
    };

    if (canRead) {
      try {
        const res = await dispatch(getB2BLead(payload));
        setGetLeadData(res?.data?.data);
        setTotalPages(res?.data?.data?.totalPages || 0);
        setTotalRecords(res?.data?.data?.totalLeads || 0);
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
      const res = await dispatch(getLeadCountry({ fromB2B: true }));
      if (res?.status === 200) {
        setLeadCountries(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching lead countries:", error);
      setLeadCountries([]);
    }
  };

  const fetchStudentData = async (leadId) => {
    try {
      const res = await dispatch(getLeadById(leadId));
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

    // Mark notifications as read for this student
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

  const handleClose = () => {
    setShow(false);
    setIsEdit(false);
    setFormData(resetFormData);
    setFormRoleList(null);
    setFormUserList([]);
  };

  const handleShow = () => {
    setShow(true);
    if (userType === "Branch User") {
      dispatch(getAllRoleList(branchUserId, false)).then((res) => {
        setFormRoleList(res?.data);

        if (userRole) {
          fetchFormUsers(roleId, userRole, branchUserId, false);
        }
      });
    } else if (userRole === "Branch") {
      dispatch(getAllRoleList(branchId, false)).then((res) => {
        setFormRoleList(res?.data);
      });
    } else {
      dispatch(getAllRoleList("", false)).then((res) => {
        setFormRoleList(res?.data);
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteLead(id?._id));
      if (response.status === 200) {
        toast.success("Lead deleted successfully!");
        const isLastItemOnPage =
          getLeadData?.data?.length === 1 && currentPage > 1;
        const newPage = isLastItemOnPage ? currentPage - 1 : currentPage;

        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          startdate: filters.startDate,
          enddate: filters.endDate,
          status: filters.status,
          subStatus: filters.subStatus,
          lead_from: filters.lead_from,
          userId: userId,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignId: filters.assignId,
          branchId: filters.branchId,
          showAll: filters.showAll,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
          b2bId: filters.b2bId,
        };

        if (canRead) {
          dispatch(getB2BLead(payload)).then((res) => {
            setGetLeadData(res?.data?.data);
            setTotalPages(res?.data?.data?.totalPages || 0);
            setTotalRecords(res?.data?.data?.totalLeads || 0);
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
        updateLead(selectedDeadLead._id, updatedLeadData),
      );
      if (response.status === 200) {
        toast.success("Lead marked as inactive successfully!");
        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          startdate: filters.startDate,
          enddate: filters.endDate,
          status: filters.status,
          subStatus: filters.subStatus,
          lead_from: filters.lead_from,
          userId: userId,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignId: filters.assignId,
          branchId: filters.branchId,
          showAll: filters.showAll,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
          b2bId: filters.b2bId,
        };
        if (canRead) {
          dispatch(getB2BLead(payload)).then((res) => {
            setGetLeadData(res?.data?.data);
            setTotalPages(res?.data?.data?.totalPages || 0);
            setTotalRecords(res?.data?.data?.totalLeads || 0);
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
    const updatedIndex = edit.educationDetails;
    const updatedEntry = values.education_details[updatedIndex];

    updatedData[updatedIndex] = updatedEntry;

    setFormData((prevState) => ({
      ...prevState,
      education_details: updatedData,
    }));

    setEdit((prev) => ({
      ...prev,
      educationEvaluation: false,
      educationDetails: 0,
    }));
  };

  const handleEducatiDetailonSubmit = (values) => {
    const currentData = values?.education_details || [];
    const currentIndex = edit.educationDetails
      ? edit.educationDetailsIndex
      : edit.educationDetails
        ? edit.educationDetailsIndex
        : index.educationDetails;
    const newEvaluation =
      values.education_details[
        edit.educationDetails
          ? edit.educationDetailsIndex
          : edit.educationDetails
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
    // IMPORTANT: while editing a lead, formik may hold existing `_id` entries.
    // For a NEW push, we must not carry `_id`, otherwise backend treats it like update.
    const { _id, ...newEntryWithoutId } = newEntry || {};

    // Also create the full assignment object for display
    const roleObj = getRoleList?.data?.find(
      (r) => r._id === newEntryWithoutId.role,
    );
    const userObj = formUserList?.find((u) => u._id === newEntryWithoutId.user);
    const userFullName = userObj
      ? `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim() ||
        userObj.name
      : null;

    const fullAssignmentObject = {
      _id: null, // New assignments don't have _id yet
      role: roleObj ? { _id: roleObj._id, name: roleObj.name } : null,
      user: userObj
        ? { _id: userObj._id, name: userFullName, email: userObj.email }
        : null,
    };

    setFormData((prevState) => ({
      ...values,
      lead_assign: [...prevState.lead_assign, newEntryWithoutId],
    }));

    setFullLeadAssignments((prev) => [...prev, fullAssignmentObject]);
    setIndex((prev) => ({
      ...prev,
      leadAssignment: prev.leadAssignment + 1,
    }));
  };

  const handleLeadAssignmentEdit = (values) => {
    if (!currentEditingAssignment) {
      console.error("No current editing assignment found");
      return;
    }

    const updatedData = [...formData.lead_assign];
    const updatedIndex = currentEditingAssignment.index;
    // Use the current form values for the update
    const updatedEntry = values.lead_assign[0];

    updatedData[updatedIndex] = updatedEntry;

    // Also update fullLeadAssignments with the complete objects
    const updatedFullAssignments = [...fullLeadAssignments];
    const roleObj = getRoleList?.data?.find((r) => r._id === updatedEntry.role);
    const userObj = formUserList?.find((u) => u._id === updatedEntry.user);

    // Construct user name properly like in formUserOptions
    const userFullName = userObj
      ? `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim() ||
        userObj.name
      : null;

    updatedFullAssignments[updatedIndex] = {
      _id: updatedEntry._id,
      role: roleObj ? { _id: roleObj._id, name: roleObj.name } : null,
      user: userObj
        ? { _id: userObj._id, name: userFullName, email: userObj.email }
        : null,
    };

    setFormData((prevState) => ({
      ...prevState,
      lead_assign: updatedData,
    }));

    setFullLeadAssignments(updatedFullAssignments);

    setEdit((prev) => ({
      ...prev,
      leadAssignment: false,
      leadAssignmentIndex: 0,
    }));

    // Clear the current editing assignment
    setCurrentEditingAssignment(null);
  };

  const handleLeadAssignmentDelete = (indexToDelete) => {
    const updatedAssignments = formData.lead_assign.filter(
      (_, index) => index !== indexToDelete,
    );

    const updatedFullAssignments = fullLeadAssignments.filter(
      (_, index) => index !== indexToDelete,
    );

    setFormData((prevState) => ({
      ...prevState,
      lead_assign: updatedAssignments,
    }));

    setFullLeadAssignments(updatedFullAssignments);

    if (edit.leadAssignment && edit.leadAssignmentIndex === indexToDelete) {
      setEdit({
        leadAssignment: false,
        leadAssignmentIndex: 0,
      });
      setCurrentEditingAssignment(null);
    }
  };

  const handleInterestedCourseDetailEdit = (
    values,
    instituteOptions,
    campusOptions,
    programLevelData,
    allcourseData,
  ) => {
    const updatedData = [...formData.interestedCourseDetails];
    const updatedIndex = edit.interestedCourseIndex;
    const updatedEntry = values.interestedCourseDetails[0]; // Form now uses index 0 for editing

    // Create entry with updated display names
    const entryWithNames = {
      ...updatedEntry,
      instituteName:
        instituteOptions.find((opt) => opt.value === updatedEntry.institute)
          ?.label || updatedEntry.institute,
      campusName:
        campusOptions.find((opt) => opt.value === updatedEntry.campus)?.label ||
        updatedEntry.campus,
      programLevelName:
        programLevelData.find((pl) => pl._id === updatedEntry.programLevel)
          ?.name || updatedEntry.programLevel,
      courseName:
        allcourseData.find((c) => c._id === updatedEntry.course)?.programName ||
        updatedEntry.course,
    };

    updatedData[updatedIndex] = entryWithNames;

    setFormData((prevState) => ({
      ...prevState,
      interestedCourseDetails: updatedData,
    }));

    setEdit((prev) => ({
      ...prev,
      interestedCourse: false,
      interestedCourseIndex: 0,
    }));

    return true;
  };

  const handleInterestedCourseSubmit = (
    values,
    instituteOptions,
    campusOptions,
    programLevelData,
    allcourseData,
  ) => {
    const newEntry = values.interestedCourseDetails[index.interestedCourse];

    if (!newEntry || !newEntry.institute || !newEntry.course) {
      toast.error(
        "Please fill institute and course before adding interested course.",
      );
      return false;
    }

    // Create entry with display names for table display
    const entryWithNames = {
      ...newEntry,
      instituteName:
        instituteOptions.find((opt) => opt.value === newEntry.institute)
          ?.label || newEntry.institute,
      campusName:
        campusOptions.find((opt) => opt.value === newEntry.campus)?.label ||
        newEntry.campus,
      programLevelName:
        programLevelData.find((pl) => pl._id === newEntry.programLevel)?.name ||
        newEntry.programLevel,
      courseName:
        allcourseData.find((c) => c._id === newEntry.course)?.programName ||
        newEntry.course,
    };

    setFormData((prevState) => ({
      ...prevState,
      interestedCourseDetails: [
        ...prevState.interestedCourseDetails,
        entryWithNames,
      ],
    }));

    setIndex((prev) => ({
      ...prev,
      interestedCourse: prev.interestedCourse + 1,
    }));

    return true;
  };
  const handleInterestedCourseDelete = (indexToDelete) => {
    const updatedInterestedCourse = formData.interestedCourseDetails.filter(
      (_, index) => index !== indexToDelete,
    );

    setFormData((prevState) => ({
      ...prevState,
      interestedCourseDetails: updatedInterestedCourse,
    }));

    if (edit.interestedCourse && edit.interestedCourseIndex === indexToDelete) {
      setEdit({
        interestedCourse: false,
        interestedCourseIndex: 0,
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
      interestedCourseDetails,
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
      fromB2B: true,
      lead_assign: formattedLeadAssign,
      interestedCourseDetails: (interestedCourseDetails || []).map((item) => ({
        institute: item.institute,
        campus: item.campus,
        programLevel: item.programLevel,
        course: item.course,
        intakeMonth: item.intakeMonth,
        intakeYear: item.intakeYear,
        remarks: item.remarks,
        acceptedByUs: item.acceptedByUs,
      })),
      // visa_refused: values.visa_refused === "yes" ? true : false,
      // refused_years: refused_years?.map((year) => Number(year)) || [],
      // work_year: Number(values.work_year) || 0,
      // education_evaluation: (education_evaluation || []).map((item) => ({
      //   test_name: item.test_name,
      //   scores: {
      //     listen: parseFloat(item.scores.listen),
      //     read: parseFloat(item.scores.read),
      //     write: parseFloat(item.scores.write),
      //     speak: parseFloat(item.scores.speak),
      //     overall: parseFloat(item.scores.overall),
      //   },
      // })),
      // education_details: (education_details || []).map((item) => ({
      //   degree: item.degree,
      //   stream: item.stream,
      //   moi: item.moi,
      //   year: Number(item.year) || null,
      //   score: Number(item.score),
      //   institution: item.institution,
      //   backlogs: Number(item.backlogs || 0),
      // })),
      // reviews: {
      //   ...reviews,
      // },
      // refer_friend: {
      //   ...refer_friend,
      // },
    };
    setIsLoading(true);
    try {
      const response = await dispatch(addLead(formattedData));
      if (response.status === 201) {
        handleClose();
        setFormData(resetFormData);
        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          startdate: filters.startDate,
          enddate: filters.endDate,
          status: filters.status,
          subStatus: filters.subStatus,
          lead_from: filters.lead_from,
          userId: userId,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignId: filters.assignId,
          branchId: filters.branchId,
          showAll: filters.showAll,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
          b2bId: filters.b2bId,
        };
        if (canRead) {
          dispatch(getB2BLead(payload))
            .then((res) => {
              setGetLeadData(res?.data?.data);
              setTotalPages(res?.data?.data?.totalPages || 0);
              setTotalRecords(res?.data?.data?.totalLeads || 0);
            })
            .catch((err) => {
              console.log(err, "err");
            });
        }
        toast.success("Lead Added successfully!");
      }
    } catch (error) {
      console.error("Error adding lead", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to compare and get only changed fields
  const getChangedFields = (original, updated) => {
    const changedFields = {};

    // Helper to normalize values for comparison
    const normalizeValue = (val) => {
      if (val === null || val === undefined) return "";
      if (typeof val === "string") return val.trim();
      if (Array.isArray(val)) return JSON.stringify(val);
      if (typeof val === "object") return JSON.stringify(val);
      return val;
    };

    // Helper to compare arrays
    const arraysEqual = (arr1, arr2) => {
      if (!arr1 && !arr2) return true;
      if (!arr1 || !arr2) return false;
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    };

    // Helper to compare objects
    const objectsEqual = (obj1, obj2) => {
      return JSON.stringify(obj1 || {}) === JSON.stringify(obj2 || {});
    };

    // Compare all fields
    Object.keys(updated).forEach((key) => {
      if (key === "education_evaluation" || key === "education_details") {
        // Compare arrays
        if (!arraysEqual(original[key], updated[key])) {
          changedFields[key] = updated[key];
        }
      } else if (key === "reviews" || key === "refer_friend") {
        // Compare nested objects
        if (!objectsEqual(original[key], updated[key])) {
          changedFields[key] = updated[key];
        }
      } else if (key === "visa_refused") {
        // Special handling for visa_refused
        const originalBool = original[key] === true || original[key] === "yes";
        const updatedBool = updated[key] === "yes";
        if (originalBool !== updatedBool) {
          changedFields[key] = updated[key];
        }
      } else if (key === "dateofbirth" || key === "next_follow_up") {
        // Compare dates (normalize to YYYY-MM-DD format)
        const originalDate = original[key]
          ? new Date(original[key]).toISOString().split("T")[0]
          : "";
        const updatedDate = updated[key] || "";
        if (originalDate !== updatedDate) {
          changedFields[key] = updated[key];
        }
      } else if (key === "country_interested" || key === "refused_years") {
        // Compare arrays
        if (!arraysEqual(original[key], updated[key])) {
          changedFields[key] = updated[key];
        }
      } else if (key === "interestedCourseDetails") {
        if (!arraysEqual(original[key], updated[key])) {
          changedFields[key] = updated[key];
        }
      } else if (key === "lead_assign") {
        if (!arraysEqual(original[key], updated[key])) {
          changedFields[key] = updated[key];
        }
      } else {
        // Compare simple fields
        const originalVal = normalizeValue(original[key]);
        const updatedVal = normalizeValue(updated[key]);
        if (originalVal !== updatedVal) {
          changedFields[key] = updated[key];
        }
      }
    });

    return changedFields;
  };

  const handelEditLead = async (values) => {
    // Get original data
    const originalData = getLeadDataById?.data;
    if (!originalData) {
      toast.error("Original data not found");
      return;
    }

    // Prepare original data in same format as form values
    const originalFormData = {
      // age: originalData.age || "",
      dateofbirth: originalData.dateofbirth
        ? originalData.dateofbirth.split("T")[0]
        : "",
      name: originalData.name || "",
      gender: originalData?.gender || "",
      country: originalData.country || "",
      country_interested: Array.isArray(originalData.country_interested)
        ? originalData.country_interested
        : originalData.country_interested
          ? [originalData.country_interested]
          : [],
      prefferedDegree: originalData.prefferedDegree || null,
      prefferedCourse: originalData.prefferedCourse || "",
      prefferedIntakeYear: originalData.prefferedIntakeYear || "",
      prefferedIntakeMonth: originalData.prefferedIntakeMonth || "",
      b2b_lead_status: originalData.b2b_lead_status || "New",
      lead_assign:
        Array.isArray(originalData.lead_assign) &&
        originalData.lead_assign.length > 0
          ? originalData.lead_assign.map((item) => {
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
      next_follow_up: originalData.next_follow_up
        ? new Date(originalData.next_follow_up).toISOString().split("T")[0]
        : "",
      remarks: originalData.remarks || "",
      interestedCourseDetails: originalData.interestedCourseDetails || [],
      // inquiry_for: originalData.inquiry_for || null,
      // inquiry_for_other: originalData.inquiry_for_other || "",
      // intake: originalData.intake || "",
      // source_of_reference: originalData.source_of_reference || "",

      // email: originalData.email || "",
      // city: originalData.city || "",
      // phone: originalData.phone || "",
      // alternate_contact: originalData.alternate_contact || "",
      // address: originalData.address || "",
      // course: originalData.course || "",
      // level: originalData.level || "",
      // budget: originalData.budget || "",
      // how_much_in_bank: originalData.how_much_in_bank || "",
      // english_proficiency: originalData.english_proficiency || "",
      // passport: originalData.passport || "",
      // occupation_father: originalData.occupation_father || "",
      // occupation_mother: originalData.occupation_mother || "",
      // work_experience: originalData.work_experience || "",
      // work_post: originalData.work_post || "",
      // work_year: originalData.work_year || "",
      // visited_countries: originalData.visited_countries || "",
      // visit_count: originalData.visit_count || "",
      // visa_type: originalData.visa_type || "",
      // visa_refused: originalData.visa_refused === true ? "yes" : "no",
      // refused_country: originalData.refused_country || "",
      // refused_times: originalData.refused_times || "",
      // refused_years: originalData.refused_years || [],
      // refused_visa_type: originalData.refused_visa_type || "",
      // comments: originalData.comments || "",
      // office_use_only: originalData.office_use_only || "",
      // form_type: originalData.form_type || "",
      // lead_form: originalData.lead_form || "",
      // lead_assign: originalData.lead_assign
      //   ? originalData.lead_assign._id || originalData.lead_assign
      //   : null,
      // lead_role: originalData.lead_role || null,
      lead_assign_Branch: originalData.lead_assign_Branch || null,

      // refer_friend: {
      //   name: originalData.refer_friend?.name || "",
      //   phone: originalData.refer_friend?.phone || "",
      //   email: originalData.refer_friend?.email || "",
      //   suggested_countries:
      //     originalData.refer_friend?.suggested_countries || "",
      //   courses: originalData.refer_friend?.courses || "",
      //   response: originalData.refer_friend?.response || "",
      // },
      // reviews: {
      //   reception_greetings: originalData.reviews?.reception_greetings || "",
      //   counsellor_explanation:
      //     originalData.reviews?.counsellor_explanation || "",
      //   hospitality: originalData.reviews?.hospitality || "",
      //   hygiene_cleanliness: originalData.reviews?.hygiene_cleanliness || "",
      //   team_response: originalData.reviews?.team_response || "",
      // },
      // education_evaluation: originalData.education_evaluation || [],
      // education_details: originalData.education_details || [],
      // from: originalData.from || "",
      // to: originalData.to || "",
      // nationality: originalData.nationality || "",
      // pincode: originalData.pincode || "",
      // follow_up_type: originalData.follow_up_type || null,
      // lead_followup_remark: originalData.lead_followup_remark || "",
      // lead_text_remark: originalData.lead_text_remark || "",
    };

    // Get original lead data to compare
    const originalLeadAssign = Array.isArray(originalData?.lead_assign)
      ? originalData.lead_assign
      : [];

    // Get only changed fields
    const changedFields = getChangedFields(originalFormData, values);

    // Remove lead_assign from changedFields as we'll handle it separately
    const { lead_assign, ...restChangedFields } = changedFields;

    // Compare original and new to find changes
    // Get all original entry IDs
    const originalEntryIds = originalLeadAssign
      .map((item) => item._id?.toString())
      .filter(Boolean);

    // Get all new entry IDs (from formData.lead_assign which has the complete data)
    // Use formData.lead_assign instead of values.lead_assign for proper payload processing
    const currentLeadAssign = formData.lead_assign || [];
    const newEntryIds = currentLeadAssign
      .map((item) => item._id?.toString())
      .filter(Boolean);

    // Find entries that were deleted (exist in original but not in new)
    const deletedEntryIds = originalEntryIds.filter(
      (id) => !newEntryIds.includes(id),
    );

    // Find new entries (no _id, meaning they're new additions)
    const newEntries = currentLeadAssign
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
      const matchingNewEntry = currentLeadAssign.find(
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

    // If no changes, return early
    if (
      Object.keys(restChangedFields).length === 0 &&
      deletedEntryIds.length === 0 &&
      newEntries.length === 0 &&
      existingEntriesToUpdate.length === 0
    ) {
      toast.info("No changes detected");
      return;
    }

    const {
      education_evaluation,
      education_details,
      refused_years,
      reviews,
      refer_friend,
      ...restChangedValues
    } = restChangedFields;

    // Format only changed fields
    const formattedData = { ...restChangedValues };

    // Handle lead_assign changes (✅ only ONE operation per request)
    if (deletedEntryIds.length > 0) {
      formattedData.lead_assignDeleteId = deletedEntryIds[0];
    } else if (newEntries.length > 0) {
      formattedData.lead_assign = {
        role: newEntries[0].role,
        user: newEntries[0].user,
      };
    } else if (existingEntriesToUpdate.length > 0) {
      const entryToUpdate = existingEntriesToUpdate[0];
      formattedData.lead_assignId = entryToUpdate._id;
      formattedData.lead_assignUpdate = {};

      // Include role if it changed
      if (entryToUpdate.role !== undefined) {
        formattedData.lead_assignUpdate.role = entryToUpdate.role;
      }

      // Include user if it changed
      if (entryToUpdate.user !== undefined) {
        formattedData.lead_assignUpdate.user = entryToUpdate.user;
      }
    }

    // Only include these if they changed
    if (changedFields.visa_refused !== undefined) {
      formattedData.visa_refused = values.visa_refused === "yes" ? true : false;
    }
    if (changedFields.refused_years !== undefined) {
      formattedData.refused_years =
        refused_years?.map((year) => Number(year)) || [];
    }
    if (changedFields.work_year !== undefined) {
      formattedData.work_year = Number(values.work_year) || 0;
    }
    if (changedFields.education_evaluation !== undefined) {
      formattedData.education_evaluation = (education_evaluation || []).map(
        (item) => ({
          test_name: item.test_name,
          scores: {
            listen: parseFloat(item.scores?.listen) || 0,
            read: parseFloat(item.scores?.read) || 0,
            write: parseFloat(item.scores?.write) || 0,
            speak: parseFloat(item.scores?.speak) || 0,
            overall: parseFloat(item.scores?.overall) || 0,
            duolingoScore: parseFloat(item.scores?.duolingoScore) || 0,
          },
        }),
      );
    }
    if (changedFields.education_details !== undefined) {
      formattedData.education_details = (education_details || []).map(
        (item) => ({
          degree: item.degree,
          stream: item.stream,
          moi: item.moi,
          year: Number(item.year) || null,
          score: Number(item.score) || null,
          institution: item.institution,
          backlogs: Number(item.backlogs || 0),
        }),
      );
    }
    if (changedFields.reviews !== undefined) {
      formattedData.reviews = { ...reviews };
    }
    if (changedFields.refer_friend !== undefined) {
      formattedData.refer_friend = { ...refer_friend };
    }
    if (changedFields.interestedCourseDetails !== undefined) {
      formattedData.interestedCourseDetails = values.interestedCourseDetails;
    }
    setIsLoading(true);
    try {
      const response = await dispatch(updateLead(editId, formattedData));
      if (response.status === 200) {
        handleClose();
        setFormData(resetFormData);

        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          startdate: filters.startDate,
          enddate: filters.endDate,
          status: filters.status,
          subStatus: filters.subStatus,
          lead_from: filters.lead_from,
          userId: userId,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignId: filters.assignId,
          branchId: filters.branchId,
          showAll: filters.showAll,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
          b2bId: filters.b2bId,
        };
        if (canRead) {
          dispatch(getB2BLead(payload)).then((res) => {
            setGetLeadData(res?.data?.data);
            setTotalPages(res?.data?.data?.totalPages || 0);
            setTotalRecords(res?.data?.data?.totalLeads || 0);
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

    dispatch(getLeadById(item._id)).then((res) => {
      const leadData = res?.data?.data;
      setGetLeadDataById(res?.data);

      if (leadData) {
        const branchIdToUse = leadData.lead_assign_Branch?._id || "";

        dispatch(getAllRoleList(branchIdToUse, false)).then((roleRes) => {
          setFormRoleList(roleRes?.data);

          const selectedRole = roleRes?.data?.data?.find(
            (r) => r._id === leadData.lead_role,
          );
          const roleToUse =
            leadData.lead_role && selectedRole
              ? selectedRole.name
              : userType === "Branch User"
                ? userRole
                : "";

          // if (selectedRole) {
          fetchFormUsers(null, roleToUse, branchIdToUse);
          // }
        });
      }
    });
  };

  useEffect(() => {
    const initializeRoles = async () => {
      try {
        if (userRole === "Branch") {
          const res = await dispatch(getAllRoleList(branchId, false));
          setGetRoleList(res?.data);
        } else if (userRoleBranch === "Branch User") {
          const res = await dispatch(getAllRoleList(branchUserId, false));
          setGetRoleList(res?.data);
        } else {
          const res = await dispatch(getAllRoleList("", true));
          setGetRoleList(res?.data);
        }
      } catch (error) {
        console.error("Error initializing roles:", error);
        setGetRoleList([]);
      }
    };
    initializeRoles();
  }, []);

  const filterRoleOptions =
    getRoleList?.data
      ?.filter((role) => role?.name !== "Super Admin")
      ?.map((data) => ({
        value: data._id,
        label: data.name,
      })) || [];

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

      const cleanedInterestedCourseDetails = Array.isArray(
        lead.interestedCourseDetails,
      )
        ? lead.interestedCourseDetails.filter((item) => {
            return (
              item.institute ||
              item.campus ||
              item.programLevel ||
              item.course ||
              item.intakeMonth ||
              item.intakeYear ||
              item.remarks ||
              item.acceptedByUs
            );
          })
        : [];

      setFormData({
        next_follow_up: lead.next_follow_up
          ? new Date(lead.next_follow_up).toISOString().split("T")[0]
          : "",
        dateofbirth: lead.dateofbirth ? lead.dateofbirth.split("T")[0] : "",
        // age: lead.age || "",
        gender: lead?.gender || "",
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
        name: lead.name || "",
        country: lead.country || "",
        country_interested: lead.country_interested || "",
        prefferedDegree: lead.prefferedDegree || null,
        prefferedCourse: lead.prefferedCourse || "",
        prefferedIntakeYear: lead.prefferedIntakeYear || "",
        prefferedIntakeMonth: lead.prefferedIntakeMonth || "",
        b2b_lead_status: lead.b2b_lead_status || "New",
        remarks: lead.remarks || "",
        interestedCourseDetails: cleanedInterestedCourseDetails,
        // inquiry_for: lead.inquiry_for || null,
        // inquiry_for_other: lead.inquiry_for_other || "",
        // intake: lead.intake || "",
        // source_of_reference: lead.source_of_reference || "",
        // email: lead.email || "",
        // city: lead.city || "",
        // phone: lead.phone || "",
        // alternate_contact: lead.alternate_contact || "",
        // address: lead.address || "",
        // course: lead.course || "",
        // level: lead.level || "",
        // budget: lead.budget || "",
        // how_much_in_bank: lead.how_much_in_bank || "",
        // english_proficiency: lead.english_proficiency || "",
        // passport: lead.passport || "",
        // occupation_father: lead.occupation_father || "",
        // occupation_mother: lead.occupation_mother || "",
        // work_experience: lead.work_experience || "",
        // work_post: lead.work_post || "",
        // work_year: lead.work_year || "",
        // visited_countries: lead.visited_countries || "",
        // visit_count: lead.visit_count || "",
        // visa_type: lead.visa_type || "",
        // visa_refused: lead.visa_refused === true ? "yes" : "no",
        // refused_country: lead.refused_country || "",
        // refused_times: lead.refused_times || "",
        // refused_years: lead.refused_years || [],
        // refused_visa_type: lead.refused_visa_type || "",
        // comments: lead.comments || "",
        // office_use_only: lead.office_use_only || "",
        // form_type: lead.form_type || "",
        // lead_status: lead.lead_status || "New",
        // lead_form: lead.lead_form || "",
        // lead_assign: lead.lead_assign || null,
        // lead_role: lead.lead_role || null,
        lead_assign_Branch: lead.lead_assign_Branch || null,
        // refer_friend: {
        //   name: lead.refer_friend?.name || "",
        //   phone: lead.refer_friend?.phone || "",
        //   email: lead.refer_friend?.email || "",
        //   suggested_countries: lead.refer_friend?.suggested_countries || "",
        //   courses: lead.refer_friend?.courses || "",
        //   response: lead.refer_friend?.response || "",
        // },
        // reviews: {
        //   reception_greetings: lead.reviews?.reception_greetings || "",
        //   counsellor_explanation: lead.reviews?.counsellor_explanation || "",
        //   hospitality: lead.reviews?.hospitality || "",
        //   hygiene_cleanliness: lead.reviews?.hygiene_cleanliness || "",
        //   team_response: lead.reviews?.team_response || "",
        // },
        // education_evaluation: cleanedEducationEvaluation,
        // education_details: cleanedEducationDetails,
        // from: lead.from || "",
        // to: lead.to || "",
        // nationality: lead.nationality || "",
        // pincode: lead.pincode || "",
        // follow_up_type: lead.follow_up_type || null,
        // lead_followup_remark: lead.lead_followup_remark || "",
        // lead_text_remark: lead.lead_text_remark || "",
      });

      // Store full lead assignments data for display purposes
      setFullLeadAssignments(
        Array.isArray(lead.lead_assign) ? lead.lead_assign : [],
      );
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
    link.href = `https://studyvisaconsultant.com/api/public/sampleleadfile/Sample_Lead_Upload.xlsx`;
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
          searchOnField: selectedFilter.value,
          search: searchTerm,
          startdate: filters.startDate,
          enddate: filters.endDate,
          status: filters.status,
          subStatus: filters.subStatus,
          lead_from: filters.lead_from,
          userId: userId,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignId: filters.assignId,
          branchId: filters.branchId,
          showAll: filters.showAll,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
          b2bId: filters.b2bId,
        };
        if (canRead) {
          dispatch(getB2BLead(payload)).then((res) => {
            setGetLeadData(res?.data?.data);
            setTotalPages(res?.data?.data?.totalPages || 0);
            setTotalRecords(res?.data?.data?.totalLeads || 0);
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
    dispatch(getLeadById(id))
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

  const fetchAllB2BAdmin = async () => {
    try {
      const res = await dispatch(getAllB2BAdmin(1, 10000, "", "", "", ""));
      const responseData = res?.data?.data;
      setB2BAdminList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setB2BAdminList([]);
    }
  };

  useEffect(() => {
    fetchLeadStatus();
    fetchLeadSubStatus();
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
    fetchAllB2BAdmin();
  }, []);

  const fetchAllB2BMemberByBranch = async (branchId) => {
    try {
      const res = await dispatch(
        getBranchMemberByBranch(1, 10000, "", branchId),
      );
      const responseData = res?.data?.data;
      setMemberList(responseData?.data || []);
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
      fetchAllB2BMemberByBranch(1, 10000, "", branchId);
    }
  }, [branchId, userRole, canRead]);

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
      const res = await dispatch(getAllB2BLeadStatus());
      if (res?.status === 200) {
        setLeadStatus(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchLeadSubStatus = async () => {
    try {
      const res = await dispatch(getAllLeadSubStatus(1, 100, ""));
      if (res?.status === 200) {
        setLeadSubStatus(res?.data?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
      setLeadSubStatus([]);
    }
  };

  const fetchLeadAssignUser = async () => {
    try {
      const res = await dispatch(getLeadByAssignUser({ fromB2B: true }));
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

  const fetchAllUser = async (
    roleId,
    roleName,
    branchId,
    showAll = false,
    target = "filter",
  ) => {
    try {
      let res;
      const effectiveBranchId = branchId === "head_office" ? null : branchId;
      if (userRole === "B2B Admin") {
        res = await dispatch(memberGetAll(B2BAdminid, id));
      } else {
        res = await dispatch(
          adminGetAll(
            1,
            100,
            "",
            roleName || "",
            effectiveBranchId || "",
            showAll,
          ),
        );
      }
      const responseData = res?.data?.data;
      if (target === "form") {
        setFormUserList((prevList) => {
          const newUsers = responseData?.data || [];
          // Create a map of existing users by ID to avoid duplicates
          const existingUsersMap = new Map(
            prevList.map((user) => [user._id, user]),
          );
          // Add new users to the map (new users will overwrite if same ID)
          newUsers.forEach((user) => existingUsersMap.set(user._id, user));
          // Convert back to array
          return Array.from(existingUsersMap.values());
        });
      } else {
        setAllUser(responseData?.data || []);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      if (target === "form") {
        setFormUserList([]);
      } else {
        setAllUser([]);
      }
    }
  };

  const fetchFormUsers = (roleId, roleName, branchId, showAll = false) =>
    fetchAllUser(roleId, roleName, branchId, showAll, "form");
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
    const fetchProgramLevels = async () => {
      try {
        const res = await dispatch(getAllProgramLevel(1, 1000, ""));
        setProgramLevels(res?.data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching program levels:", error);
      }
    };
    fetchProgramLevels();
  }, [dispatch]);

  const getProgramLevelName = (levelId) => {
    const level = programLevels.find((lvl) => lvl._id === levelId);
    return level ? level.name : "N/A";
  };

  const leadSections = [
    {
      title: "Lead Details",
      fields: [
        { label: "Name", key: "name" },
        // { label: "Email", key: "email" },
        // { label: "Phone", key: "phone" },
        { label: "Country", key: "country" },
        // { label: "City", key: "city" },
        // { label: "Alternate Contact", key: "alternate_contact" },
        { label: "Gender", key: "gender" },
        {
          label: "Date of Birth",
          key: "dateofbirth",
          render: (data) =>
            data.dateofbirth
              ? new Date(data.dateofbirth).toLocaleDateString()
              : "N/A",
        },
        { label: "Prefer Country", key: "country_interested" },
        // { label: "Age", key: "age" },
        // { label: "Address", key: "address" },
        // { label: "Nationality", key: "nationality" },
        // { label: "Pincode", key: "pincode" },
        // { label: "Comments", key: "comments" },
        // { label: "Office Use Only", key: "office_use_only" },
        { label: "Remarks", key: "remarks" },
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
        { label: "B2B Lead Status", key: "b2b_lead_status" },
        {
          label: "Lead Assign",
          key: "lead_assign",
          render: (data) => {
            const assigns = data.lead_assign || [];

            if (!assigns.length) return "N/A";

            return (
              <div>
                {assigns.map((la) => (
                  <div
                    key={la._id}
                    style={{
                      fontSize: "13px",
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <strong>{la.role?.name || "-"}</strong>{" "}
                    <span style={{ color: "#555" }}>
                      ({la.user?.name || "-"})
                    </span>
                  </div>
                ))}
              </div>
            );
          },
        },
      ],
    },
    {
      title: "Degree Details",
      fields: [
        {
          label: "Degree",
          key: "prefferedDegree",
          render: (item) => getProgramLevelName(item.prefferedDegree),
        },
        { label: "Course", key: "prefferedCourse" },
        { label: "Intake Year", key: "prefferedIntakeYear" },
        { label: "Intake Month", key: "prefferedIntakeMonth" },
      ],
    },
    // {
    //   title: "Follow-up Details",
    //   fields: [
    //     {
    //       label: "Next Follow-up",
    //       key: "next_follow_up",
    //       render: (data) =>
    //         data.next_follow_up
    //           ? new Date(data.next_follow_up).toLocaleDateString()
    //           : "N/A",
    //     },
    //     { label: "From", key: "from" },
    //     { label: "To", key: "to" },
    //     { label: "Lead Follow-up Remark", key: "lead_followup_remark" },
    //     { label: "Lead Status", key: "lead_status" },
    //     { label: "Lead Form", key: "lead_form" },
    //     { label: "Lead Assign", key: "lead_assign_name" },
    //     { label: "Branch Lead Assign", key: "lead_assign_Branch" },
    //   ],
    // },
    // {
    //   title: "Inquiry Info",
    //   fields: [
    //     { label: "Inquiry For", key: "inquiry_for" },
    //     { label: "Source of Reference", key: "source_of_reference" },
    //     { label: "Form Type", key: "form_type" },
    //   ],
    // },
    // {
    //   title: "Education & Course Info",
    //   fields: [
    //     {
    //       label: "Country Interested",
    //       key: "country_interested",
    //       render: (data) =>
    //         data.country_interested?.length > 0
    //           ? data.country_interested.join(", ")
    //           : "N/A",
    //     },
    //     { label: "Course", key: "course" },
    //     { label: "Level", key: "level" },
    //     { label: "Budget", key: "budget" },
    //     { label: "How Much in Bank", key: "how_much_in_bank" },
    //     { label: "English Proficiency", key: "english_proficiency" },
    //     { label: "Passport", key: "passport" },
    //     { label: "Intake", key: "intake" },
    //   ],
    // },
    // {
    //   title: "Family & Work",
    //   fields: [
    //     { label: "Father's Occupation", key: "occupation_father" },
    //     { label: "Mother's Occupation", key: "occupation_mother" },
    //     { label: "Work Experience", key: "work_experience" },
    //     { label: "Work Post", key: "work_post" },
    //     { label: "Work Year", key: "work_year" },
    //   ],
    // },
    // {
    //   title: "Visa Info",
    //   fields: [
    //     { label: "Visited Countries", key: "visited_countries" },
    //     { label: "Visit Count", key: "visit_count" },
    //     { label: "Visa Type", key: "visa_type" },
    //     {
    //       label: "Visa Refused",
    //       key: "visa_refused",
    //       render: (data) => (data.visa_refused ? "Yes" : "No"),
    //     },
    //     { label: "Refused Country", key: "refused_country" },
    //     { label: "Refused Times", key: "refused_times" },
    //     {
    //       label: "Refused Years",
    //       key: "refused_years",
    //       render: (data) =>
    //         data.refused_years?.length > 0
    //           ? data.refused_years.join(", ")
    //           : "N/A",
    //     },
    //     { label: "Refused Visa Type", key: "refused_visa_type" },
    //   ],
    // },
    // {
    //   title: "Education Evaluation",
    //   type: "table",
    //   headers: [
    //     "Test Name",
    //     "Listening",
    //     "Reading",
    //     "Writing",
    //     "Speaking",
    //     "Overall",
    //     "Duolingo Score",
    //   ],
    //   data: getLeadDataById?.data?.education_evaluation || [],
    //   renderRow: (row) => [
    //     row.test_name,
    //     row.scores?.listen,
    //     row.scores?.read,
    //     row.scores?.write,
    //     row.scores?.speak,
    //     row.scores?.overall,
    //     row.scores?.duolingoScore,
    //   ],
    // },
    // {
    //   title: "Education Details",
    //   type: "table",
    //   headers: [
    //     "Degree",
    //     "Stream",
    //     "MOI",
    //     "Year",
    //     "Score",
    //     "Institution",
    //     "Backlogs",
    //   ],
    //   data: getLeadDataById?.data?.education_details || [],
    //   renderRow: (row) => [
    //     row.degree,
    //     row.stream,
    //     row.moi,
    //     row.year,
    //     row.score,
    //     row.institution,
    //     row.backlogs,
    //   ],
    // },
    // {
    //   title: "Refer a Friend",
    //   fields: [
    //     { label: "Name", key: "refer_friend.name" },
    //     { label: "Phone", key: "refer_friend.phone" },
    //     { label: "Email", key: "refer_friend.email" },
    //     {
    //       label: "Suggested Countries",
    //       key: "refer_friend.suggested_countries",
    //     },
    //     { label: "Courses", key: "refer_friend.courses" },
    //     { label: "Response", key: "refer_friend.response" },
    //   ],
    // },
    // {
    //   title: "Reviews",
    //   fields: [
    //     { label: "Reception Greetings", key: "reviews.reception_greetings" },
    //     {
    //       label: "Counsellor Explanation",
    //       key: "reviews.counsellor_explanation",
    //     },
    //     { label: "Hospitality", key: "reviews.hospitality" },
    //     { label: "Hygiene & Cleanliness", key: "reviews.hygiene_cleanliness" },
    //     { label: "Team Response", key: "reviews.team_response" },
    //   ],
    // },
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
        mainheading="B2B Leads"
        parentfolder="Home"
        activepage="B2B Leads"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-between">
              <div className="card-title mb-0">B2B Leads</div>
              {canRead && (
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <SearchWithDropdown
                    searchOption={searchOption}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    search={searchTerm}
                    setSearch={setSearchTerm}
                    setCurrentPage={setCurrentPage}
                  />
                  {/* <div className="position-relative search-container flex-grow-1">
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
                  </div> */}
                  {/* <Button
                    variant="primary"
                    className="custom-select-height px-3"
                    onClick={() => handleDownload()}
                  >
                    Download
                  </Button> */}
                  {canCreate && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-3"
                      onClick={handleShow}
                    >
                      Add Lead
                    </Button>
                  )}
                  {/* <div className="d-flex flex-column">
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
                  </div> */}
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
                              // zIndex: 10000,
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
                              // zIndex: 10000,
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
                    {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
                      <div className="filter-item">
                        <Form.Label>Branch</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={[
                            { value: "All", label: "All" },
                            { value: "head_office", label: "Head Office" },
                            ...allBranchOptions,
                          ]}
                          value={
                            [
                              { value: "All", label: "All" },
                              { value: "head_office", label: "Head Office" },
                              ...allBranchOptions,
                            ].find(
                              (option) =>
                                option.value ===
                                (filters.branchId === ""
                                  ? "All"
                                  : filters.branchId === null
                                    ? "head_office"
                                    : filters.branchId),
                            ) || null
                          }
                          onChange={async (selectedOption) => {
                            let branchId = null;
                            let showAll = false;

                            if (
                              !selectedOption ||
                              selectedOption.value === "All"
                            ) {
                              showAll = true;
                              branchId = "";
                            } else if (selectedOption.value === "head_office") {
                              showAll = false;
                              branchId = null;
                            } else {
                              showAll = false;
                              branchId = selectedOption.value;
                            }

                            // Update filters
                            setFilters((prev) => ({
                              ...prev,
                              branchId,
                              showAll,
                              assignRole: "",
                              assignId: "",
                            }));

                            // Fetch role list based on branch selection
                            try {
                              const res = await dispatch(
                                getAllRoleList(branchId || "", showAll),
                              );
                              setGetRoleList(res?.data);
                              setAllUser([]);
                            } catch (err) {
                              console.error("Error fetching roles:", err);
                              setGetRoleList([]);
                              setAllUser([]);
                            }
                          }}
                          placeholder="Select Branch"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          styles={selectStyles}
                          noOptionsMessage={() => "No branches available"}
                        />
                      </div>
                    )}
                    <div className="filter-item">
                      <Form.Label>Lead Assign Role</Form.Label>
                      <Select
                        className="custom-select-height"
                        options={filterRoleOptions}
                        value={
                          filterRoleOptions.find(
                            (option) => option.value === filters.assignRole,
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          const selectedRoleId = selectedOption
                            ? selectedOption.value
                            : null;
                          const selectedRoleName = selectedOption
                            ? selectedOption.label
                            : "";

                          setFilters((prev) => ({
                            ...prev,
                            assignRole: selectedRoleId,
                            assignId: "",
                          }));

                          let selectedBranchId = null;
                          let showAllUsers = false;

                          if (filters.showAll) {
                            // If "All" branches selected, fetch all users
                            showAllUsers = true;
                            selectedBranchId = "";
                          } else if (filters.branchId === null) {
                            // Head office selected
                            selectedBranchId = null;
                            showAllUsers = false;
                          } else if (filters.branchId) {
                            // Specific branch selected
                            selectedBranchId = filters.branchId;
                            showAllUsers = false;
                          } else {
                            // No branch selected, use user's branch if Branch role
                            selectedBranchId =
                              userRole === "Branch" ? branchId : null;
                            showAllUsers = false;
                          }

                          if (selectedRoleId && selectedRoleName) {
                            fetchAllUser(
                              selectedRoleId,
                              selectedRoleName,
                              selectedBranchId,
                              showAllUsers,
                            );
                          } else {
                            setAllUser([]);
                          }
                        }}
                        placeholder="Select Lead Assign Role"
                        isClearable
                        isSearchable
                        classNamePrefix="custom-select"
                        styles={selectStyles}
                        noOptionsMessage={() => "No roles available"}
                      />
                    </div>
                    <div className="filter-item">
                      <Form.Label>Lead Assign</Form.Label>
                      <Select
                        className="custom-select-height"
                        options={userOptions}
                        value={
                          userOptions.find(
                            (option) => option.value === filters.assignId,
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFilters((prev) => ({
                            ...prev,
                            assignId: selectedOption
                              ? selectedOption.value
                              : "",
                          }))
                        }
                        placeholder="Select Lead Assign"
                        isClearable
                        isSearchable
                        isDisabled={!filters.assignRole}
                        classNamePrefix="custom-select"
                        styles={selectStyles}
                        noOptionsMessage={() => "No users available"}
                      />
                    </div>
                    {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
                      <div className="filter-item">
                        <Form.Label>B2B Admin</Form.Label>
                        <Select
                          className="filter-height"
                          styles={selectStyles}
                          classNamePrefix="custom-select"
                          value={
                            filters.b2bId
                              ? {
                                  value: filters.b2bId,
                                  label:
                                    b2BAdminList.find(
                                      (admin) => admin._id === filters.b2bId,
                                    )?.companyName || filters.b2bId,
                                }
                              : null
                          }
                          onChange={(option) => {
                            setFilters({
                              ...filters,
                              b2bId: option ? option.value : "",
                            });
                            setCurrentPage(1);
                          }}
                          options={b2BAdminList.map((admin) => ({
                            value: admin._id,
                            label: admin.companyName,
                          }))}
                          placeholder="Select B2B Admin"
                          isClearable
                          isSearchable
                        />
                      </div>
                    )}
                    <div className="filter-item">
                      <Form.Label>Country</Form.Label>
                      <Select
                        className="filter-height"
                        styles={selectStyles}
                        classNamePrefix="custom-select"
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
                        classNamePrefix="custom-select"
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
                        classNamePrefix="custom-select"
                        value={
                          filters.status
                            ? {
                                value: filters.status,
                                label:
                                  leadStatus?.find(
                                    (item) => item._id === filters.status,
                                  )?.name || filters.status,
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
                        classNamePrefix="custom-select"
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
                    <div className="filter-item">
                      <Form.Label>Updated On</Form.Label>

                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          className="filter-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            filters.updatedOn
                              ? formatDate(parseDate(filters.updatedOn))
                              : ""
                          }
                          ref={updatedOnInputRef}
                          readOnly
                          onClick={() => {
                            if (filters.updatedOn) {
                              setUpdatedOnValue(parseDate(filters.updatedOn));
                            }
                            setShowUpdatedOnCalendar((prev) => !prev);
                          }}
                          style={{ cursor: "pointer", backgroundColor: "#fff" }}
                        />

                        {filters.updatedOn ? (
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({ ...filters, updatedOn: "" });
                              setUpdatedOnValue(null);
                              setShowUpdatedOnCalendar(false);
                              setCurrentPage(1);
                            }}
                            style={{
                              position: "absolute",
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              fontSize: 16,
                              cursor: "pointer",
                              color: "#888",
                            }}
                          >
                            ×
                          </button>
                        ) : (
                          <MdCalendarToday
                            size={20}
                            style={{
                              position: "absolute",
                              right: 10,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#888",
                              pointerEvents: "none",
                            }}
                          />
                        )}

                        {showUpdatedOnCalendar && (
                          <div
                            ref={updatedOnCalenderRef}
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "4px",
                              width: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              locale="en-GB"
                              value={updatedOnValue}
                              onChange={(date) => {
                                setFilters({
                                  ...filters,
                                  updatedOn: toISODate(date),
                                });
                                setUpdatedOnValue(date);
                                setShowUpdatedOnCalendar(false);
                                setCurrentPage(1);
                              }}
                            />
                          </div>
                        )}
                      </div>
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
                validationSchema={validationSchema}
                userRole={userRole}
                userType={userType}
                loggedInMemberId={loggedInMemberId}
                fetchAllUser={fetchFormUsers}
                branchId={branchId}
                countries={countries}
                getRoleList={formRoleList}
                handleBranchChange={handleBranchChange}
                handelSubmitLead={handelSubmitLead}
                handelEditLead={handelEditLead}
                genderOptions={genderOptions}
                followUpTypeOptions={followUpTypeOptions}
                leadStatusOptions={leadStatusOptions}
                leadSubStatusOptions={leadSubStatusOptions}
                b2BLeadStatusOptions={b2BLeadStatusOptions}
                allInquiry={allInquiry}
                roleOptions={formRoleOptions}
                userOptions={formUserOptions}
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
                isB2B={true}
                studentId={chatStudent?._id}
                senderId={userId}
                studentData={studentData}
                handleChatClose={handleChatClose}
                handleInterestedCourseDetailEdit={(
                  values,
                  instituteOptions,
                  campusOptions,
                  programLevelData,
                  allcourseData,
                ) =>
                  handleInterestedCourseDetailEdit(
                    values,
                    instituteOptions,
                    campusOptions,
                    programLevelData,
                    allcourseData,
                  )
                }
                handleInterestedCourseSubmit={(
                  values,
                  instituteOptions,
                  campusOptions,
                  programLevelData,
                  allcourseData,
                ) =>
                  handleInterestedCourseSubmit(
                    values,
                    instituteOptions,
                    campusOptions,
                    programLevelData,
                    allcourseData,
                  )
                }
                handleInterestedCourseDelete={handleInterestedCourseDelete}
                fullLeadAssignments={fullLeadAssignments}
                setCurrentEditingAssignment={setCurrentEditingAssignment}
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
                convertPage="b2bLeads"
                isB2B={true}
                canRead={canRead}
              />

              {/* <div className="studentApplicationChat">
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
              </div> */}

              <B2BLeadsCard
                getLeadData={getLeadData}
                leadStatus={leadStatus}
                handleEdit={handleEdit}
                handleChatOpen={handleChatOpen}
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
                isB2B={true}
                getRoleNameById={getRoleNameById}
                filters={filters}
                searchTerm={searchTerm}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
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
                <Modal.Header className="form-main-heading">
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

              {totalPages > 1 && getLeadData?.data?.length > 0 && (
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

export default B2BLeads;
