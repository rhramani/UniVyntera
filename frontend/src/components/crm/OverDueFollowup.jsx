import { useEffect, useState, useRef } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { FaTable } from "react-icons/fa";
import { MdCalendarToday, MdViewAgenda } from "react-icons/md";
import Pageheader from "../../layouts/Pageheader";
import Paginations from "../elements/Paginations";
import { toast } from "react-toastify";
import {
  addLead,
  deleteLead,
  downloadLeads,
  getPendingFollowUpsLead,
  getLeadById,
  updateLead,
  insertMany,
  editHistory,
  getLeadFrom,
  getLeadCountry,
} from "../../redux/actions/Lead.action";
import { useDispatch } from "react-redux";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { getAllLeadStatus } from "../../redux/actions/Master/LeadStatuses/LeadStatus.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import { getAllExam } from "../../redux/actions/Lead/Exam.action";
import { getAllDegree } from "../../redux/actions/Lead/Degree.action";
import Select from "react-select";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import { getAllCourseFinder } from "../../redux/actions/CourseFinder.action";
import { getAllInquiry } from "../../redux/actions/Lead/Inquiry.action";
import { getAllOther } from "../../redux/actions/Master/OtherService.action";
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
import { getOneLeadSubStatus } from "../../redux/actions/Master/LeadStatuses/LeadSubStatus.action";
import SearchWithDropdown from "../commonComponents/SearchWithDropdown";
import LeadReportTable from "./allLeadsComponents/LeadReportTable";
import {
  formatDate,
  parseDate,
  toISODate,
  validationSchema,
} from "../../utils/leadsUtils";
import BulkLeadAssign from "./commonLeadForm/BulkLeadAssign";
import InactiveLeadModal from "./commonLeadForm/InactiveLeadModal";
import UploadLeadModal from "./commonLeadForm/UploadLeadModal";

const searchOption = [
  { label: "Everything", value: "" },
  { label: "Lead Id", value: "leadId" },
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

const OverDueFollowup = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(searchOption[0]);
  const [showUploadModal, setShowUploadModal] = useState(false);
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
  const [allOther, setAllOther] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [allUser, setAllUser] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [leadCountries, setLeadCountries] = useState([]);
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
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);

  const [formRoleList, setFormRoleList] = useState(null);
  const [formUserList, setFormUserList] = useState([]);
    const [fullLeadAssignments, setFullLeadAssignments] = useState([]);
    const [currentEditingAssignment, setCurrentEditingAssignment] = useState(null);

  const [activeView, setActiveView] = useState("card");

  const branchId = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userRoleBranch = decryptData(localStorage.getItem("userRole"));
  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));
  const loggedInMemberId = decryptData(localStorage.getItem("userId"));
  const roleId = decryptData(localStorage.getItem("roleId"));

  const { canCreate, canRead, canUpdate, canDelete, canDownload, canUpload } =
    usePermissions("Over Due Followup");

  // wa daddy
  const [isWaDaddyWhatsappModalOpen, setIsWaDaddyWhatsappModalOpen] =
    useState(false);
  const [selectedWaDaddyWhatsappData, setSelecteWaDaddyWhatsappdData] =
    useState(null);

  const [showUpdatedOnCalendar, setShowUpdatedOnCalendar] = useState(false);
  const [updatedOnValue, setUpdatedOnValue] = useState(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!branchList?.length) return;

    const statusFromUrl = searchParams.get("status");
    const selectedBranchFromUrl = searchParams.get("selectedBranch");

    setFilters((prev) => {
      let updated = { ...prev };

      if (statusFromUrl) {
        updated.status = statusFromUrl;
        updated.subStatus = "";
      }

      if (selectedBranchFromUrl) {
        if (selectedBranchFromUrl === "All") {
          updated.branchId = "";
          updated.showAll = true;
        } else if (selectedBranchFromUrl === "Head Office") {
          updated.branchId = null;
          updated.showAll = false;
        } else {
          const matchedBranch = branchList?.find(
            (b) =>
              b._id === selectedBranchFromUrl ||
              b.name?.toLowerCase() === selectedBranchFromUrl.toLowerCase(),
          );

          if (matchedBranch) {
            updated.branchId = matchedBranch._id;
          } else {
            updated.branchId = selectedBranchFromUrl;
          }
          updated.showAll = false;
        }
      }
      return updated;
    });

    setCurrentPage(1);

    window.history.replaceState({}, "", "/lead/overduefollowup");
  }, [branchList, searchParams]);

  const [rolesByBranch, setRolesByBranch] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("openModal") === "true") {
      setShow(true);
      if (userType === "Branch User") {
        dispatch(getAllRoleList(branchUserId, false)).then((res) => {
          setFormRoleList(res?.data);

          if (roleId) {
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
      navigate(`${import.meta.env.BASE_URL}lead/overduefollowup`, {
        replace: true,
      });
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

  const derivedBranchValue =
    userRole === "Branch"
      ? branchId
      : userType === "Branch User"
        ? branchUserId
        : null;

  const [formData, setFormData] = useState({
    inquiry_for: null,
    inquiry_for_other: "",
    other_for: [],
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
    family_work: [],
    // occupation_father: "",
    // occupation_mother: "",
    // work_experience: "",
    // work_post: "",
    // work_year: "",
    // visited_countries: "",
    // visit_count: "",
    // visa_type: "",
    // visa_refused: "",
    form_type: "",
    // refused_country: "",
    // refused_times: "",
    // refused_years: [],
    // refused_visa_type: "",
    visa_info: [],
    comments: "",
    office_use_only: "",
    remarks: "",
    lead_status: "New",
    lead_sub_status: "",
    lead_form: "",
    // lead_assign: userType === "Branch User" ? loggedInMemberId : "",
    // lead_role: userType === "Branch User" ? roleId : "",
    // lead_assign: userType === "Branch User" ? branchUserId : derivedBranchValue,
    lead_assign: [],
    interestedCourseDetails: [],
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
    other_for: [],
    inquiry_for_other: "",
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
    family_work: [],
    interestedCourseDetails: [],
    // occupation_father: "",
    // occupation_mother: "",
    // work_experience: "",
    // work_post: "",
    // work_year: "",
    // visited_countries: "",
    // visit_count: "",
    // visa_type: "",
    // visa_refused: "",
    visa_info: [],
    form_type: "",
    // refused_country: "",
    // refused_times: "",
    // refused_years: [],
    // refused_visa_type: "",
    comments: "",
    office_use_only: "",
    remarks: "",
    lead_status: "New",
    lead_sub_status: "",
    lead_form: "",
    // lead_assign: userType === "Branch User" ? loggedInMemberId : "",
    // lead_role: userType === "Branch User" ? roleId : "",
    lead_assign_Branch:
      userType === "Branch User" ? branchUserId : derivedBranchValue,
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
    subStatus: "",
    assignId: "",
    lead_from: "",
    branchId:
      userType === "Branch User" || userRole === "Branch"
        ? branchUserId || branchId
        : "",
    showAll: userType === "Branch User" || userRole === "Branch" ? false : true,
    leadActivity: "",
    country: "",
    followUpType: "",
    assignRole: "",
    updatedOn: "",
  });
  const [getRoleList, setGetRoleList] = useState();
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState({
    educationEvaluation: false,
    educationEvaluationIndex: 0,
    educationDetails: false,
    educationDetailsIndex: 0,
    familyWork: false,
    familyWorkIndex: 0,
    visaInfo: false,
    visaInfoIndex: 0,
        leadAssignment: false,
        leadAssignmentIndex: 0,
        interestedCourse: false,
        interestedCourseIndex: 0,
  });

  const [allFollowUpTypes, setAllFollowUpTypes] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [leadSubStatus, setLeadSubStatus] = useState([]);
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
    menuList: (base) => ({
      ...base,
      maxHeight: "160px",
      overflowY: "auto",
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

  const filterRoleOptions =
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
    branchList?.map((branch) => ({
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
      status: filters.status,
      subStatus: filters.subStatus,
      assignId: filters.assignId,
      lead_from: filters.lead_from,
      startdate: filters.startDate,
      enddate: filters.endDate,
      branchId: filters.branchId,
      showAll: filters.showAll,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
      assignRole: filters.assignRole || "",
      updatedOn: filters.updatedOn || "",
    };

    if (canRead) {
      dispatch(getPendingFollowUpsLead(payload))
        .then((res) => {
          setGetLeadData(res?.data);
          setTotalPages(res?.data?.totalPages || 0);
          setTotalRecords(res?.data?.totalLeads || 0);
        })
        .catch((error) => {
          console.error("Error fetching leads:", error);
          toast.error("Failed to fetch leads");
        });
    }
  }, [currentPage, itemsPerPage, searchTerm, selectedFilter, filters, canRead]);

  useEffect(() => {
    setSelectedLeads([]);
  }, [filters, searchTerm]);

  const changePage = (page) => {
    if (isLoading || page < 1 || page > totalPages) return;

    setIsLoading(true);
    setCurrentPage(page);

    const payload = {
      page: page || 1,
      limit: itemsPerPage,
      searchOnField: selectedFilter.value,
      search: searchTerm,
      status: filters.status,
      subStatus: filters.subStatus,
      assignId: filters.assignId,
      lead_from: filters.lead_from,
      startdate: filters.startDate,
      enddate: filters.endDate,
      branchId: filters.branchId,
      showAll: filters.showAll,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
      assignRole: filters.assignRole || "",
      updatedOn: filters.updatedOn || "",
    };

    if (canRead) {
      dispatch(getPendingFollowUpsLead(payload))
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
      status: filters.status,
      subStatus: filters.subStatus,
      assignId: filters.assignId,
      lead_from: filters.lead_from,
      startdate: filters.startDate,
      enddate: filters.endDate,
      branchId: filters.branchId,
      showAll: filters.showAll,
      leadActivity: filters.leadActivity,
      country: filters.country,
      followUpType: filters.followUpType,
      assignRole: filters.assignRole || "",
      updatedOn: filters.updatedOn || "",
    };

    if (canRead) {
      try {
        const res = await dispatch(getPendingFollowUpsLead(payload));
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
          page: newPage,
          limit: itemsPerPage,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          status: filters.status,
          subStatus: filters.subStatus,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startdate: filters.startDate,
          enddate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
        };

        if (canRead) {
          dispatch(getPendingFollowUpsLead(payload)).then((res) => {
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
      const roleObj = getRoleList?.data?.find(r => r._id === newEntryWithoutId.role);
      const userObj = formUserList?.find(u => u._id === newEntryWithoutId.user);
      const userFullName = userObj
        ? `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim() || userObj.name
        : null;
  
      const fullAssignmentObject = {
        _id: null, // New assignments don't have _id yet
        role: roleObj ? { _id: roleObj._id, name: roleObj.name } : null,
        user: userObj ? { _id: userObj._id, name: userFullName, email: userObj.email } : null,
      };
  
      setFormData((prevState) => ({
        ...values,
        lead_assign: [...prevState.lead_assign, newEntryWithoutId],
      }));
  
      setFullLeadAssignments(prev => [...prev, fullAssignmentObject]);
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
      const roleObj = getRoleList?.data?.find(r => r._id === updatedEntry.role);
      const userObj = formUserList?.find(u => u._id === updatedEntry.user);
  
      // Construct user name properly like in formUserOptions
      const userFullName = userObj
        ? `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim() || userObj.name
        : null;
  
      updatedFullAssignments[updatedIndex] = {
        _id: updatedEntry._id,
        role: roleObj ? { _id: roleObj._id, name: roleObj.name } : null,
        user: userObj ? { _id: userObj._id, name: userFullName, email: userObj.email } : null,
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
      }
    };

  const handleFamilyWorkDetailEdit = (values) => {
    const updatedData = [...formData.family_work];
    const updatedIndex = edit.familyWorkIndex;
    const updatedEntry = values.family_work[updatedIndex];

    updatedData[updatedIndex] = updatedEntry;

    setFormData((prevState) => ({
      ...prevState,
      family_work: updatedData,
    }));

    setEdit((prev) => ({
      ...prev,
      familyWork: false,
      familyWorkIndex: 0,
    }));
  };

  const handleFamilyWorkSubmit = (values) => {
    const currentData = values?.family_work || [];
    const currentIndex = edit.familyWork
      ? edit.familyWorkIndex
      : index.familyWork;
    const newEntry =
      values.family_work[
        edit.familyWork ? edit.familyWorkIndex : index.familyWork
      ];
    const currentEntry = currentData[currentIndex];

    if (!currentEntry) {
      toast.error("Please select a Occupation before adding Work Experience.");
      return;
    }
    setFormData((prevState) => ({
      ...values,
      family_work: [...prevState.family_work, newEntry],
    }));
    setIndex((prev) => ({
      ...prev,
      familyWork: prev.familyWork + 1,
    }));
  };

  const handleFamilyWorkDelete = (indexToDelete) => {
    const updatedFamilyWork = formData.family_work.filter(
      (_, index) => index !== indexToDelete,
    );

    setFormData((prevState) => ({
      ...prevState,
      family_work: updatedFamilyWork,
    }));

    if (edit.familyWork && edit.familyWorkIndex === indexToDelete) {
      setEdit({
        familyWork: false,
        familyWorkIndex: 0,
      });
    }
  };
  
  const handleInterestedCourseDetailEdit = (
    values,
    instituteOptions,
    campusOptions,
    programLevelData,
    allcourseData
  ) => {
    const updatedData = [...formData.interestedCourseDetails];
    const updatedIndex = edit.interestedCourseIndex;
    const updatedEntry = values.interestedCourseDetails[0]; // Form now uses index 0 for editing

    // Create entry with updated display names
    const entryWithNames = {
      ...updatedEntry,
      instituteName: instituteOptions.find(opt => opt.value === updatedEntry.institute)?.label || updatedEntry.institute,
      campusName: campusOptions.find(opt => opt.value === updatedEntry.campus)?.label || updatedEntry.campus,
      programLevelName: programLevelData.find(pl => pl._id === updatedEntry.programLevel)?.name || updatedEntry.programLevel,
      courseName: allcourseData.find(c => c._id === updatedEntry.course)?.programName || updatedEntry.course,
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
    allcourseData
  ) => {
    const newEntry = values.interestedCourseDetails[index.interestedCourse];

    if (!newEntry || !newEntry.institute || !newEntry.course) {
      toast.error("Please fill institute and course before adding interested course.");
      return false;
    }

    // Create entry with display names for table display
    const entryWithNames = {
      ...newEntry,
      instituteName: instituteOptions.find(opt => opt.value === newEntry.institute)?.label || newEntry.institute,
      campusName: campusOptions.find(opt => opt.value === newEntry.campus)?.label || newEntry.campus,
      programLevelName: programLevelData.find(pl => pl._id === newEntry.programLevel)?.name || newEntry.programLevel,
      courseName: allcourseData.find(c => c._id === newEntry.course)?.programName || newEntry.course,
    };

    setFormData((prevState) => ({
      ...prevState,
      interestedCourseDetails: [...prevState.interestedCourseDetails, entryWithNames],
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

  const handleVisaInfoEdit = (values) => {
    const updatedData = [...formData.visa_info];
    const updatedIndex = edit.visaInfoIndex;
    const updatedEntry = values.visa_info[updatedIndex];

    updatedData[updatedIndex] = updatedEntry;

    setFormData((prevState) => ({
      ...prevState,
      visa_info: updatedData,
    }));

    setEdit((prev) => ({
      ...prev,
      visaInfo: false,
      visaInfoIndex: 0,
    }));
  };

  const handleVisaInfoSubmit = (values) => {
    const currentData = values?.visa_info || [];
    const currentIndex = edit.visaInfo ? edit.visaInfoIndex : index.visaInfo;
    const newEntry =
      values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo];
    const currentEntry = currentData[currentIndex];

    if (!currentEntry) {
      toast.error("Please select a Occupation before adding Work Experience.");
      return;
    }
    setFormData((prevState) => ({
      ...values,
      visa_info: [...prevState.visa_info, newEntry],
    }));
    setIndex((prev) => ({
      ...prev,
      visaInfo: prev.visaInfo + 1,
    }));
  };

  const handleVisaInfoDelete = (indexToDelete) => {
    const updatedVisaInfo = formData.visa_info.filter(
      (_, index) => index !== indexToDelete,
    );

    setFormData((prevState) => ({
      ...prevState,
      visa_info: updatedVisaInfo,
    }));

    if (edit.visaInfo && edit.visaInfoIndex === indexToDelete) {
      setEdit({
        visaInfo: false,
        visaInfoIndex: 0,
      });
    }
  };

  const handelSubmitLead = async (values) => {
    const {
      education_evaluation,
      education_details,
      family_work,
      interestedCourseDetails,
      visa_info,
      refused_years,
      reviews,
      refer_friend,
      ...restValues
    } = values;

    if (!values.lead_assign_Branch) {
      values.lead_assign_Branch = derivedBranchValue;
    }

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
      ...restValues,
      lead_assign: formattedLeadAssign,
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
      family_work: (family_work || []).map((item) => ({
        occupation_father: item.occupation_father,
        occupation: item.occupation,
        work_experience: item.work_experience,
        work_post: item.work_post,
        work_year: Number(item.work_year),
      })),
      interestedCourseDetails: (interestedCourseDetails || []).map((item) => ({
        institute: item.institute,
        campus: item.campus,
        programLevel: item.programLevel,
        course: item.course,
        intakeMonth: item.intakeMonth,
        intakeYear: item.intakeYear,
        remarks: item.remarks,
      })),
      visa_info: (visa_info || []).map((item) => ({
        visited_countries: item.visited_countries,
        visit_count: Number(item.visit_count),
        visa_type: item.visa_type,
        visa_refused: item.visa_refused,
        refused_country: item.refused_country,
        refused_times: Number(item.refused_times),
        refused_years: (item.refused_years || []).map((year) => Number(year)),
        refused_visa_type: item.refused_visa_type,
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
      const response = await dispatch(addLead(formattedData));
      if (response.status === 201) {
        handleClose();
        setFormData(resetFormData);
        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          status: filters.status,
          subStatus: filters.subStatus,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startdate: filters.startDate,
          enddate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
        };
        if (canRead) {
          dispatch(getPendingFollowUpsLead(payload))
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
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getChangedFields = (original, updated) => {
    const changedFields = {};

    const normalizeValue = (val) => {
      if (val === null || val === undefined) return "";
      if (typeof val === "string") return val.trim();
      if (Array.isArray(val)) return JSON.stringify(val);
      if (typeof val === "object") return JSON.stringify(val);
      return val;
    };

    const arraysEqual = (arr1, arr2) => {
      if (!arr1 && !arr2) return true;
      if (!arr1 || !arr2) return false;
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    };

    const objectsEqual = (obj1, obj2) => {
      return JSON.stringify(obj1 || {}) === JSON.stringify(obj2 || {});
    };

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
      } else if (key === "visa_info") {
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
        inquiry_for: originalData.inquiry_for || null,
        inquiry_for_other: originalData.inquiry_for_other || "",
        intake: originalData.intake || "",
        source_of_reference: originalData.source_of_reference || "",
        counsellor: originalData.counsellor || "",
        dateofbirth: originalData.dateofbirth
          ? originalData.dateofbirth.split("T")[0]
          : "",
        age: originalData.age || "",
        gender: originalData.gender || "",
        name: originalData.name || "",
        email: originalData.email || "",
        city: originalData.city || "",
        country: originalData.country || "",
        phone: originalData.phone || "",
        alternate_contact: originalData.alternate_contact || "",
        address: originalData.address || "",
        country_interested: originalData.country_interested || [],
        comments: originalData.comments || "",
        office_use_only: originalData.office_use_only || "",
        remarks: originalData.remarks || "",
        form_type: originalData.form_type || "",
        lead_status: originalData.lead_status || "New",
        lead_sub_status: originalData.lead_sub_status || "",
        lead_form: originalData.lead_form || "",
        lead_assign_Branch: originalData.lead_assign_Branch || null,
  
        lead_assign:
          Array.isArray(originalData.lead_assign) &&
          originalData.lead_assign.length
            ? originalData.lead_assign.map((item) => ({
                _id: item._id,
                role: typeof item.role === "string" ? item.role : item.role?._id,
                user: typeof item.user === "string" ? item.user : item.user?._id,
              }))
            : [],
  
        refer_friend: {
          name: originalData.refer_friend?.name || "",
          phone: originalData.refer_friend?.phone || "",
          email: originalData.refer_friend?.email || "",
          suggested_countries:
            originalData.refer_friend?.suggested_countries || "",
          courses: originalData.refer_friend?.courses || "",
          response: originalData.refer_friend?.response || "",
        },
  
        reviews: {
          reception_greetings: originalData.reviews?.reception_greetings || "",
          counsellor_explanation:
            originalData.reviews?.counsellor_explanation || "",
          hospitality: originalData.reviews?.hospitality || "",
          hygiene_cleanliness: originalData.reviews?.hygiene_cleanliness || "",
          team_response: originalData.reviews?.team_response || "",
        },
  
        education_evaluation: originalData.education_evaluation || [],
        education_details: originalData.education_details || [],
        family_work: originalData.family_work || [],
        interestedCourseDetails: originalData.interestedCourseDetails || [],
        visa_info: originalData.visa_info || [],
        next_follow_up: originalData.next_follow_up
          ? new Date(originalData.next_follow_up).toISOString().split("T")[0]
          : "",
        from: originalData.from || "",
        to: originalData.to || "",
        nationality: originalData.nationality || "",
        pincode: originalData.pincode || "",
        follow_up_type: originalData.follow_up_type || null,
        lead_followup_remark: originalData.lead_followup_remark || "",
        lead_text_remark: originalData.lead_text_remark || "",
      };
  
      const originalLeadAssign = Array.isArray(originalFormData?.lead_assign)
        ? originalFormData.lead_assign
        : [];

      // Get only changed fields (lead_assign will be handled like AllLeads.jsx)
    const changedFields = getChangedFields(originalFormData, values);
    const { lead_assign: formLeadAssign, ...restChangedFields } = changedFields;

    // ---------- lead_assign handling (same as AllLeads.jsx) ----------
    // Use formData.lead_assign instead of values.lead_assign for proper payload processing
    const currentLeadAssign = Array.isArray(formData.lead_assign)
      ? formData.lead_assign
      : [];

      const deletedItem = originalLeadAssign.find(
        (orig) =>
          orig?._id &&
          !currentLeadAssign?.some(
            (curr) => String(curr?._id) === String(orig?._id),
          ),
      );

      const newItem = currentLeadAssign?.find(
        (item) => item?.role && item?.user && !item?._id,
      );

      const updatedItem = currentLeadAssign?.find((item) => {
        if (!item?._id) return false;
        const oldItem = originalLeadAssign.find(
          (o) => String(o?._id) === String(item?._id),
        );
        if (!oldItem) return false;
        return String(oldItem.user) !== String(item.user);
      });

      // No change
      if (
        Object.keys(restChangedFields).length === 0 &&
        !deletedItem &&
        !newItem &&
        !updatedItem
      ) {
        toast.info("No changes detected");
        return;
      }

      const formattedData = { ...restChangedFields };

      // Apply ONLY ONE lead_assign operation
      if (deletedItem) {
        formattedData.lead_assignDeleteId = deletedItem._id;
      } else if (newItem) {
        formattedData.lead_assign = {
          role: String(newItem.role).trim(),
          user: String(newItem.user).trim(),
        };
      } else if (updatedItem) {
        formattedData.lead_assignId = updatedItem._id;
        formattedData.lead_assignUpdate = {
          user: String(updatedItem.user).trim(),
        role: String(updatedItem.role).trim(),
        };
      }
  
      // ---------- existing formatting (unchanged) ----------
      if (changedFields.visa_refused !== undefined) {
        formattedData.visa_refused = values.visa_refused === "yes";
      }
      if (changedFields.refused_years !== undefined) {
        formattedData.refused_years = values.refused_years?.map(Number) || [];
      }
      if (changedFields.education_evaluation !== undefined) {
        formattedData.education_evaluation = values.education_evaluation;
      }
      if (changedFields.education_details !== undefined) {
        formattedData.education_details = values.education_details;
      }
      if (changedFields.reviews !== undefined) {
        formattedData.reviews = values.reviews;
      }
      if (changedFields.refer_friend !== undefined) {
        formattedData.refer_friend = values.refer_friend;
      }
      if (changedFields.visa_info !== undefined) {
        formattedData.visa_info = values.visa_info;
      }
          if (changedFields.interestedCourseDetails !== undefined) {
            formattedData.interestedCourseDetails = values.interestedCourseDetails;
          }
          if (changedFields.family_work !== undefined) {
            formattedData.family_work = values.family_work;
          }
  
      // ---------- API CALL ----------
    setIsLoading(true);
    try {
      const response = await dispatch(updateLead(editId, formattedData));
      if (response.status == 200) {
        handleClose();
        setFormData(resetFormData);

        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          status: filters.status,
          subStatus: filters.subStatus,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startdate: filters.startDate,
          enddate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
        };
        if (canRead) {
          dispatch(getPendingFollowUpsLead(payload)).then((res) => {
            setGetLeadData(res?.data);
            setTotalPages(res?.data?.totalPages || 0);
            setTotalRecords(res?.data?.totalLeads || 0);
          });
        }
        toast.success("Data Update successfully!");
      }
    } catch (error) {
      toast.error("Somthing went wrong");
      console.error("Error adding lead", error);
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

          fetchFormUsers(null, roleToUse, branchIdToUse);
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

      const cleanedFamilyWork = Array.isArray(lead.family_work)
        ? lead.family_work.filter((item) => {
            return (
              item.occupation_father?.trim() ||
              item.occupation?.trim() ||
              // item.occupation_mother?.trim() ||
              item.work_experience ||
              item.work_post ||
              item.work_year
            );
          })
        : [];

      const cleanedVisaInfo = Array.isArray(lead.visa_info)
        ? lead.visa_info.filter((item) => {
            return (
              item.visited_countries?.trim() ||
              item.visit_count ||
              item.visa_type?.trim() ||
              item.visa_refused ||
              item.refused_country?.trim() ||
              item.refused_times ||
              (item.refused_years && item.refused_years.length > 0) ||
              item.refused_visa_type?.trim()
            );
          })
        : [];

      setFormData({
        inquiry_for: lead.inquiry_for || null,
        inquiry_for_other: lead.inquiry_for_other || "",
        other_for: lead.other_for || [],
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
        comments: lead.comments || "",
        office_use_only: lead.office_use_only || "",
        remarks: lead.remarks || "",
        form_type: lead.form_type || "",
        lead_status: lead.lead_status || "New",
        lead_sub_status: lead.lead_sub_status || "",
        lead_form: lead.lead_form || "",
        // lead_assign: lead.lead_assign
        //   ? lead.lead_assign
        //   : userType === "Branch User"
        //     ? loggedInMemberId
        //     : null,
        // lead_role: lead.lead_role
        //   ? lead.lead_role
        //   : userType === "Branch User"
        //     ? roleId
        //     : null,
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
        family_work: cleanedFamilyWork,
        visa_info: cleanedVisaInfo,
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

      // Store full lead assignments data for display purposes
      setFullLeadAssignments(
        Array.isArray(lead.lead_assign) ? lead.lead_assign : []
      );
    }
  }, [getLeadDataById]);

  const handleDownload = async () => {
    try {
      const payload = {
        searchOnField: selectedFilter.value,
        search: searchTerm,
        status: filters.status,
        subStatus: filters.subStatus,
        assignId: filters.assignId,
        lead_from: filters.lead_from,
        startdate: filters.startDate,
        enddate: filters.endDate,
        branchId: filters.branchId,
        showAll: filters.showAll,
        leadActivity: filters.leadActivity,
        country: filters.country,
        followUpType: filters.followUpType,
        assignRole: filters.assignRole || "",
        updatedOn: filters.updatedOn || "",
      };

      const response = await dispatch(downloadLeads(payload));

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

  const handleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId],
    );
  };

  const handleSelectAll = async (checked) => {
    if (checked) {
      setIsLoading(true);
      try {
        const payload = {
          page: 1,
          limit: 1000000,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          status: filters.status,
          subStatus: filters.subStatus,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startdate: filters.startDate,
          enddate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
        };

        if (canRead) {
          const res = await dispatch(getPendingFollowUpsLead(payload));
          const allLeadIds = res?.data?.data?.map((lead) => lead._id) || [];
          setSelectedLeads(allLeadIds);
        }
      } catch (error) {
        console.error("Error fetching over due followup:", error);
        toast.error("Failed to select over due followup");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSelectedLeads([]);
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

  const fetchOther = async () => {
    try {
      const res = await dispatch(getAllOther(1, 100000));
      const responseData = res?.data?.data;
      setAllOther(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Other:", error);
      setAllOther([]);
    }
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
    fetchLeadFrom();
    fetchAllUser();
    handleEditHistory();
    fetchAllExam();
    fetchAllDegree();
    fetchCountries();
    fetchAllCourse();
    fetchInquirys();
    fetchFollowUpTypes();
    fetchAllBranches();
    fetchOther();
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

  const fetchLeadSubStatus = async (statusName) => {
    try {
      const res = await dispatch(getOneLeadSubStatus(statusName));
      if (res?.status === 200) {
        setLeadSubStatus(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
      setLeadSubStatus([]);
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
      // If no roleId provided and target is form, clear the user list
      if (target === "form" && !roleId) {
        setFormUserList([]);
        return;
      }

      let res;
      const effectiveBranchId = branchId === "head_office" ? null : branchId;

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

      const responseData = res?.data?.data;
      if (target === "form") {
        // Replace the user list with new users for the selected role
        setFormUserList(responseData?.data || []);
      } else {
        setAllUser(responseData?.data || []);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      // Don't clear formUserList on error to preserve existing selections
      // Only clear allUser for filter targets
      if (target !== "form") {
        setAllUser([]);
      }
    }
  };

  const fetchFormUsers = (roleId, roleName, branchId, showAll = false) =>
    fetchAllUser(roleId, roleName, branchId, showAll, "form");

  const getBranchNameById = (branchId) => {
    const branch = branchList?.find((b) => b._id === branchId);
    return branch ? branch.name : "Head Office";
  };

  const fetchRolesForBranch = async (branchId) => {
    if (rolesByBranch[branchId?._id || "head_office"]) {
      return rolesByBranch[branchId?._id || "head_office"];
    }

    try {
      const res = await dispatch(getAllRoleList(branchId?._id || "", false));
      const roleData = res?.data?.data || [];
      setRolesByBranch((prev) => ({
        ...prev,
        [branchId?._id || "head_office"]: roleData,
      }));
      return roleData;
    } catch (error) {
      console.error("Error fetching roles for branch:", branchId?._id, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchHeadOfficeRoles = async () => {
      try {
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

  const getStatusColor = (statusName) => {
    const status = leadStatus.find(
      (item) => item.name.toLowerCase() === statusName?.toLowerCase(),
    );
    return status?.color || "#ccc";
  };

  const columns = [
    {
      label: "",
      key: "select",
      render: (item) => (
        <Form.Check
          type="checkbox"
          checked={selectedLeads.includes(item._id)}
          onChange={() => handleSelectLead(item._id)}
          className="custom-checkbox"
        />
      ),
    },
    {
      label: "Lead ID",
      key: "leadId",
    },
    {
      label: "Name",
      key: "name",
      render: (item) => (
        <span style={{ fontWeight: "600" }}>{item.name || "-"}</span>
      ),
    },
    {
      label: "Phone",
      key: "phone",
    },
    {
      label: "City",
      key: "city",
    },
    {
      label: "Lead Status",
      key: "lead_status",
      render: (item) => (
        <span
          onClick={() => {
            handleEdit(item);
            handleEditHistory(item);
          }}
          style={{
            backgroundColor: getStatusColor(item.lead_status),
            color: "#fff",
            padding: "2px 8px",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          {item.lead_status}
        </span>
      ),
    },
    {
      label: "Date",
      key: "createdAt",
      render: (item) =>
        new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      label: "Time",
      key: "createdAt",
      render: (item) =>
        new Date(item.createdAt).toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
    },
    {
      label: "Lead From",
      key: "lead_form",
    },
    {
      label: "Branch Lead Assign",
      key: "lead_assign_Branch",
      render: (item) => getBranchNameById(item.lead_assign_Branch?._id),
    },
    // {
    //   label: "Role",
    //   key: "lead_assign_role",
    //   render: (item) => {
    //     const assigns = item.lead_assign || [];
    //     if (!assigns.length) return "-";

    //     return (
    //       <div>
    //         {assigns.map((la) => (
    //           <div key={la._id}>{la.role?.name || "-"}</div>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    {
      label: "Lead Assign",
      key: "lead_assign",
      render: (item) => {
        const assigns = item.lead_assign || [];

        if (!assigns.length) return "-";

        return (
          <div>
            {assigns.map((la) => (
              <div
                key={la._id}
                style={{
                  fontSize: "13px",
                  lineHeight: "1.4",
                  marginBottom: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                <strong>{la.role?.name || "-"}</strong>{" "}
                <span style={{ color: "#555" }}>({la.user?.name || "-"})</span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      label: "Remark",
      key: "remarks",
      render: (item) => {
        const remark = item.remarks || "-";
        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${item._id}`}>{remark}</Tooltip>}
          >
            <div
              style={{
                maxWidth: "200px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
            >
              {remark}
            </div>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Created By",
      key: "createdByName",
    },
    {
      label: "Created By",
      key: "updatedByName",
    },
  ];

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
        { label: "Lead Sub Status", key: "lead_sub_status" },
        { label: "Lead Form", key: "lead_form" },
        // { label: "Lead Assign", key: "lead_assign_name" },
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

        // { label: "Branch Lead Assign", key: "lead_assign_Branch" },
        {
          label: "Branch Lead Assign",
          key: "lead_assign_Branch",
          render: (data) =>
            getBranchNameById?.(data.lead_assign_Branch?._id) || "N/A",
        },
      ],
    },
    {
      title: "Inquiry Info",
      fields: [
        { label: "Inquiry For", key: "inquiry_for" },
        { label: "Inquiry For Other", key: "inquiry_for_other" },
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
        mainheading="Over Due Followup"
        parentfolder="Home"
        activepage="Over Due Followup"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-end">
              {/* <div className="card-title mb-0">Over Due Followup</div> */}
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
                  {/* {canDownload && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-3"
                      onClick={() => handleDownload()}
                    >
                      Download
                    </Button>
                  )}
                  {canCreate && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-3"
                      onClick={handleShow}
                    >
                      Add Lead
                    </Button>
                  )}
                  {canUpload && (
                    <div className="d-flex flex-column">
                      <Button
                        variant="primary"
                        className="custom-select-height px-3 mt-4"
                        onClick={handleShowUploadModal}
                      >
                        Upload
                      </Button>
                      <Link
                        href="#"
                        className="mt-1 text-decoration-underline"
                        onClick={() => handleSampleFileDownload()}
                      >
                        Get Sample File
                      </Link>
                    </div>
                  )} */}
                </div>
              )}
            </Card.Header>
            <Card.Body>
              {canRead && (
                <>
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                    {/* <div className="filter-item">
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
                    </div> */}
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

                            setFilters((prev) => ({
                              ...prev,
                              branchId,
                              showAll,
                              assignRole: "",
                              assignId: "",
                            }));

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
                            showAllUsers = true;
                            selectedBranchId = "";
                          } else if (filters.branchId === null) {
                            selectedBranchId = null;
                            showAllUsers = false;
                          } else if (filters.branchId) {
                            selectedBranchId = filters.branchId;
                            showAllUsers = false;
                          } else {
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
                                label: filters.status,
                              }
                            : null
                        }
                        onChange={(option) => {
                          const statusValue = option ? option.value : "";
                          setFilters({
                            ...filters,
                            status: statusValue,
                            subStatus: "",
                          });
                          setCurrentPage(1);

                          if (statusValue) {
                            fetchLeadSubStatus(statusValue);
                          } else {
                            setLeadSubStatus([]);
                          }
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
                      <Form.Label>Sub status</Form.Label>
                      <Select
                        styles={selectStyles}
                        classNamePrefix="custom-select"
                        value={
                          filters.subStatus
                            ? {
                                value: filters.subStatus,
                                label: filters.subStatus,
                              }
                            : null
                        }
                        onChange={(option) => {
                          setFilters({
                            ...filters,
                            subStatus: option ? option.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        options={leadSubStatusOptions}
                        placeholder="Select Sub Status"
                        isClearable
                        isDisabled={
                          !filters.status || leadSubStatus.length === 0
                        }
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
              {/* {canDownload && (
                <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                  <div>
                    <Form.Check
                      type="checkbox"
                      label={`Select All${
                        selectedLeads.length > 0
                          ? ` (${selectedLeads.length} selected)`
                          : ""
                      }`}
                      checked={
                        totalRecords > 0 &&
                        selectedLeads.length === totalRecords
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="custom-checkbox mb-0"
                    />
                    {selectedLeads.length > 0 && (
                      <Button
                        variant="primary"
                        className="custom-select-height px-3"
                        onClick={() => setShowBulkAssignModal(true)}
                      >
                        Bulk Lead Assign ({selectedLeads.length})
                      </Button>
                    )}
                  </div>
                  <div className="d-flex gap-2 mb-3">
                    <button
                      className={`custom-select-height btn d-flex align-items-center justify-content-center ${
                        activeView === "card"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setActiveView("card")}
                      style={{ width: "40px" }}
                    >
                      <MdViewAgenda />
                    </button>

                    <button
                      className={`custom-select-height btn d-flex align-items-center justify-content-center ${
                        activeView === "table"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setActiveView("table")}
                      style={{ width: "40px" }}
                    >
                      <FaTable />
                    </button>
                  </div>
                </div>
              )} */}

              <UploadLeadModal
                setShowUploadModal={setShowUploadModal}
                showUploadModal={showUploadModal}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                searchTerm={searchTerm}
                filters={filters}
                selectedFilter={selectedFilter}
                canRead={canRead}
                setGetLeadData={setGetLeadData}
                setTotalPages={setTotalPages}
                setTotalRecords={setTotalRecords}
              />

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
                branchId={
                  userRole === "Branch"
                    ? branchId
                    : userType === "Branch User"
                      ? branchUserId
                      : null
                }
                branchUserId={branchUserId}
                roleId={roleId}
                countries={countries}
                getRoleList={formRoleList}
                handleBranchChange={handleBranchChange}
                setLeadSubStatus={setLeadSubStatus}
                fetchLeadSubStatus={fetchLeadSubStatus}
                handelSubmitLead={handelSubmitLead}
                handelEditLead={handelEditLead}
                genderOptions={genderOptions}
                followUpTypeOptions={followUpTypeOptions}
                leadStatusOptions={leadStatusOptions}
                leadSubStatusOptions={leadSubStatusOptions}
                allInquiry={allInquiry}
                allOther={allOther}
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
                editHistoryData={editHistoryData}
                setShowHistory={setShowHistory}
                handleFamilyWorkDetailEdit={handleFamilyWorkDetailEdit}
                handleFamilyWorkSubmit={handleFamilyWorkSubmit}
                handleFamilyWorkDelete={handleFamilyWorkDelete}
                handleVisaInfoEdit={handleVisaInfoEdit}
                handleVisaInfoSubmit={handleVisaInfoSubmit}
                handleVisaInfoDelete={handleVisaInfoDelete}
                handleLeadAssignmentSubmit={handleLeadAssignmentSubmit}
                handleLeadAssignmentEdit={handleLeadAssignmentEdit}
                handleLeadAssignmentDelete={handleLeadAssignmentDelete}
                                handleInterestedCourseDetailEdit={(
                                                  values,
                                                  instituteOptions,
                                                  campusOptions,
                                                  programLevelData,
                                                  allcourseData
                                                ) => handleInterestedCourseDetailEdit(
                                                  values,
                                                  instituteOptions,
                                                  campusOptions,
                                                  programLevelData,
                                                  allcourseData
                                                )}
                                                handleInterestedCourseSubmit={(
                                                  values,
                                                  instituteOptions,
                                                  campusOptions,
                                                  programLevelData,
                                                  allcourseData
                                                ) => handleInterestedCourseSubmit(
                                                  values,
                                                  instituteOptions,
                                                  campusOptions,
                                                  programLevelData,
                                                  allcourseData
                                                )}
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
                convertPage="overduefollowup"
                selectedFilter={selectedFilter}
                canRead={canRead}
                allOther={allOther}
              />

              {activeView === "card" ? (
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
                  setSelecteWaDaddyWhatsappdData={
                    setSelecteWaDaddyWhatsappdData
                  }
                  setIsWaDaddyWhatsappModalOpen={setIsWaDaddyWhatsappModalOpen}
                  setSelectedLeadName={setSelectedLeadName}
                  setSelectedMobileNumber={setSelectedMobileNumber}
                  setIsWhatsappModalOpen={setIsWhatsappModalOpen}
                  setSelectedLead={setSelectedLead}
                  setOpenModal={setOpenModal}
                  getBranchNameById={getBranchNameById}
                  getRoleNameById={getRoleNameById}
                  permissionName="Over Due Followup"
                  selectedLeads={selectedLeads}
                  handleSelectLead={handleSelectLead}
                  filters={filters}
                  selectedFilter={selectedFilter}
                  searchTerm={searchTerm}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  activeView={activeView}
                  allOther={allOther}
                />
              ) : (
                <LeadReportTable
                  columns={columns}
                  leadReports={getLeadData?.data}
                  canRead={canRead}
                  canCreate={canCreate}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                  canDownload={canDownload}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleView={handleView}
                  handleEditHistory={handleEditHistory}
                  setSelectedDeadLead={setSelectedDeadLead}
                  setShowDeadLeadModal={setShowDeadLeadModal}
                  setSelecteWaDaddyWhatsappdData={
                    setSelecteWaDaddyWhatsappdData
                  }
                  setIsWaDaddyWhatsappModalOpen={setIsWaDaddyWhatsappModalOpen}
                  setSelectedLeadName={setSelectedLeadName}
                  setSelectedMobileNumber={setSelectedMobileNumber}
                  setIsWhatsappModalOpen={setIsWhatsappModalOpen}
                  setSelectedLead={setSelectedLead}
                  setOpenModal={setOpenModal}
                  selectedLeads={selectedLeads}
                  handleSelectLead={handleSelectLead}
                  permissionName="Over Due Followup"
                  filters={filters}
                  selectedFilter={selectedFilter}
                  searchTerm={searchTerm}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  activeView={activeView}
                />
              )}

              <WhatsappMessageModal
                isWhatsappModalOpen={isWhatsappModalOpen}
                closeWhatsappModal={() => setIsWhatsappModalOpen(false)}
                selectedLeadName={selectedLeadName}
                selectedMobileNumber={selectedMobileNumber}
              />

              <WaDaddyWhatsAppModal
                show={isWaDaddyWhatsappModalOpen}
                onClose={() => setIsWaDaddyWhatsappModalOpen(false)}
                data={selectedWaDaddyWhatsappData}
              />

              <BulkLeadAssign
                showBulkAssignModal={showBulkAssignModal}
                allBranchOptions={allBranchOptions}
                selectStyles={selectStyles}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                selectedLeads={selectedLeads}
                setSelectedLeads={setSelectedLeads}
                setShowBulkAssignModal={setShowBulkAssignModal}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                searchTerm={searchTerm}
                filters={filters}
                selectedFilter={selectedFilter}
                canRead={canRead}
                setGetLeadData={setGetLeadData}
                setTotalPages={setTotalPages}
                setTotalRecords={setTotalRecords}
              />

              <InactiveLeadModal
                setShowDeadLeadModal={setShowDeadLeadModal}
                showDeadLeadModal={showDeadLeadModal}
                setSelectedDeadLead={setSelectedDeadLead}
                selectedDeadLead={selectedDeadLead}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                selectedFilter={selectedFilter}
                searchTerm={searchTerm}
                filters={filters}
                canRead={canRead}
                setGetLeadData={setGetLeadData}
                setTotalPages={setTotalPages}
                setTotalRecords={setTotalRecords}
              />

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

export default OverDueFollowup;
