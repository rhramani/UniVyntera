import { useEffect, useRef, useState } from "react";
import { Form, Row, Col, Card, Button, Modal } from "react-bootstrap";
import {
  MdAccessTime,
  MdCalendarToday,
  MdCall,
  MdChatBubble,
  MdDescription,
  MdEditNote,
  MdLocationOn,
  MdOutlineCalendarToday,
  MdPerson,
  MdPersonOutline,
  MdVerifiedUser,
} from "react-icons/md";
import { FaAppStore, FaBullseye } from "react-icons/fa";
import getSymbolFromCurrency from "currency-symbol-map";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DangerousIcon from "@mui/icons-material/Dangerous";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { AiOutlineClose } from "react-icons/ai";
import Pageheader from "../../layouts/Pageheader";
import Paginations from "../elements/Paginations";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  addLead,
  getLeadById,
  updateLead,
  getAllCounsellor,
  followUpLeads,
  editHistory,
  getLeadCountry,
  getLeadFrom,
} from "../../redux/actions/Lead.action";
import { useDispatch } from "react-redux";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { getAllLeadStatus } from "../../redux/actions/Master/LeadStatuses/LeadStatus.action";
import { adminGetAll, memberGetAll } from "../../redux/actions/Admin.action";
import { getAllInquiry } from "../../redux/actions/Lead/Inquiry.action";
import { getAllOther } from "../../redux/actions/Master/OtherService.action";
import "react-phone-input-2/lib/bootstrap.css";
import usePermissions from "../commonComponents/usePermissions";
import { getAllCourseFinder } from "../../redux/actions/CourseFinder.action";
import ViewModal from "../commonComponents/ViewModal";
import FormModal from "./commonLeadForm/FormModal";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import { getAllExam } from "../../redux/actions/Lead/Exam.action";
import { getAllDegree } from "../../redux/actions/Lead/Degree.action";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { decryptData } from "../../utils/encryptionUtils";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { IconButton, Menu, MenuItem } from "@mui/material";
import Select from "react-select";
import { getAllFollowUpType } from "../../redux/actions/Lead/FollowUpType.action";
import ConvertToApplicationModal from "./allLeadsComponents/ConvertToApplicationModal";
import { getOneLeadSubStatus } from "../../redux/actions/Master/LeadStatuses/LeadSubStatus.action";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SearchWithDropdown from "../commonComponents/SearchWithDropdown";

const validationSchema = Yup.object({
  inquiry_for: Yup.string().nullable(),
  inquiry_for_other: Yup.string(),
  name: Yup.string().required("Name is required"),
  intake: Yup.string(),
  email: Yup.string(),
  phone: Yup.string().required("Phone number is required"),
  alternate_contact: Yup.string(),
  gender: Yup.string(),
  dateofbirth: Yup.date(),
  age: Yup.number(),
  address: Yup.string(),
  comments: Yup.string(),
  office_use_only: Yup.string(),
  remarks: Yup.string(),
  lead_status: Yup.string().default("new"),
  lead_sub_status: Yup.string(),
  lead_form: Yup.string(),
  // lead_assign: Yup.string(),
  // lead_role: Yup.string(),
  lead_assign_Branch: Yup.string().nullable(),
  country_interested: Yup.array().of(Yup.string()),
  course: Yup.string(),
  level: Yup.string(),
  budget: Yup.string(),
  how_much_in_bank: Yup.string(),
  english_proficiency: Yup.string(),
  passport: Yup.string(),
  // occupation_father: Yup.string(),
  // occupation_mother: Yup.string(),
  // work_experience: Yup.string(),
  // work_post: Yup.string(),
  // work_year: Yup.number(),
  family_work: Yup.array().of(
    Yup.object({
      occupation_father: Yup.string(),
      occupation: Yup.string(),
      work_experience: Yup.string().nullable(),
      work_post: Yup.string().nullable(),
      work_year: Yup.number().nullable(),
    }),
  ),
  visa_info: Yup.array().of(
    Yup.object({
      visitaed_countries: Yup.string(),
      visit_count: Yup.number(),
      visa_type: Yup.string(),
      visa_refused: Yup.string(),
      refused_country: Yup.string(),
      refused_times: Yup.number(),
      refused_years: Yup.array().of(Yup.number()),
      refused_visa_type: Yup.string(),
    }),
  ),
  // visited_countries: Yup.string(),
  // visit_count: Yup.number(),
  // visa_type: Yup.string(),
  // visa_refused: Yup.string(),
  form_type: Yup.string(),
  // refused_country: Yup.string(),
  // refused_times: Yup.number(),
  // refused_years: Yup.array().of(Yup.number()),
  // refused_visa_type: Yup.string(),
  next_follow_up: Yup.date(),
  from: Yup.string(),
  to: Yup.string(),
  nationality: Yup.string(),
  pincode: Yup.string(),
  lead_text_remark: Yup.string(),
  lead_followup_remark: Yup.string(),
  follow_up_type: Yup.string().nullable().notRequired(),
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

const AllFollowup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const branchId = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userRoleBranch = decryptData(localStorage.getItem("userRole"));

  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));
  const userId = decryptData(localStorage.getItem("userId"));
  const roleId = decryptData(localStorage.getItem("roleId"));
  const B2BAdminid = decryptData(localStorage.getItem("userId"));
  const loggedInMemberId = decryptData(localStorage.getItem("userId"));
  const [getLeadDataById, setGetLeadDataById] = useState();
  const [getAllCounsellorList, setgetAllCounsellorList] = useState();
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [index, setIndex] = useState({
    educationEvaluation: 0,
    educationDetails: 0,
    leadAssignment: 0,
    interestedCourse: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [editHistoryData, setEditHistoryData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showDeadLeadModal, setShowDeadLeadModal] = useState(false);
  const [selectedDeadLead, setSelectedDeadLead] = useState(null);

  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(searchOption[0]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [allBranchs, setAllBranchs] = useState([]);
  const [allcourseData, setAllCourseData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allExamData, setAllExamData] = useState([]);
  const [allDegreeData, setAllDegreeData] = useState([]);

  const [leadActivityFilter, setLeadActivityFilter] = useState("");
  const [allFollowUpTypes, setAllFollowUpTypes] = useState([]);
  const [leadCountries, setLeadCountries] = useState([]);
  const [leadFrom, setLeadFrom] = useState([]);
  const derivedBranchValue =
    userRole === "Branch"
      ? branchId
      : userType === "Branch User"
        ? branchUserId
        : null;

  const [formRoleList, setFormRoleList] = useState(null);
  const [formUserList, setFormUserList] = useState([]);
  const [fullLeadAssignments, setFullLeadAssignments] = useState([]);
  const [currentEditingAssignment, setCurrentEditingAssignment] =
    useState(null);
  const [filters, setFilters] = useState({
    country: "",
    followUpType: "",
    status: "",
    subStatus: "",
    lead_from: "",
    leadActivity: "",
    startDate: "",
    endDate: "",
    branchId:
      userType === "Branch User" || userRole === "Branch"
        ? branchUserId || branchId
        : "",
    showAll: userType === "Branch User" || userRole === "Branch" ? false : true,
    assignId: "",
    assignRole: "",
    updatedOn: "",
  });
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

  const [selectedLead, setSelectedLead] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [leadStatus, setLeadStatus] = useState([]);
  const [leadSubStatus, setLeadSubStatus] = useState([]);

  const [allInquiry, setAllInquiry] = useState([]);
  const [allOther, setAllOther] = useState([]);
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
    country_interested: "",
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
    lead_status: "new",
    lead_sub_status: "",
    lead_form: "",
    // lead_assign: "",
    // lead_role: "",
    lead_assign_Branch: null,
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
    next_follow_up: "",
    from: "",
    to: "",
    nationality: "",
    pincode: "",
    lead_text_remark: "",
    lead_followup_remark: "",
    follow_up_type: null,
    city: "",
    country: "",
  });

  const resetFormData = {
    city: "",
    country: "",
    inquiry_for: "",
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
    country_interested: "",
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
    visa_info: [],
    form_type: "",
    // refused_country: "",
    // refused_times: "",
    // refused_years: [],
    // refused_visa_type: "",
    comments: "",
    office_use_only: "",
    remarks: "",
    lead_status: "new",
    lead_sub_status: "",
    lead_form: "",
    // lead_assign: "",
    // lead_role: "",
    lead_assign_Branch: null,
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
    next_follow_up: "",
    from: "",
    to: "",
    nationality: "",
    pincode: "",
    lead_text_remark: "",
    lead_followup_remark: "",
    follow_up_type: null,
  };

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

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("All Followup");
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
      if (
        showUpdatedOnCalendar &&
        updatedOnInputRef.current &&
        !updatedOnInputRef.current.contains(event.target) &&
        updatedOnCalenderRef.current &&
        !updatedOnCalenderRef.current.contains(event.target)
      ) {
        setShowUpdatedOnCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartDateCalendar, showEndDateCalendar, showUpdatedOnCalendar]);
  useEffect(() => {
    if (show || showViewModal || showDeadLeadModal || openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, showViewModal, showDeadLeadModal, openModal]);

  const leadActivityOptions = [
    { value: "Active ", label: "Active " },
    { value: "Inactive", label: "Inactive" },
  ];

  const selectStyles = {
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
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const handleClose = () => {
    setShow(false);
    setIsEdit(false);
    setFormData(resetFormData);
    setFormRoleList(null);
    setFormUserList([]);
  };
  const handleShow = () => setShow(true);

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
        ...prevState,
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
        ...prevState,
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

  const handelSubmitLead = async (values) => {
    const {
      education_evaluation,
      education_details,
      family_work,
      interestedCourseDetails,
      visa_info,
      refused_years,
      reviews,
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

    const { lead_assign, ...restForPayload } = restValues;

    const formattedData = {
      ...restForPayload,
      lead_assign: formattedLeadAssign,
      visa_refused: values.visa_refused === "yes" ? false : true,
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
    };
    setIsLoading(true);
    try {
      const response = await dispatch(addLead(formattedData));
      if (response.status == 201) {
        handleClose();
        setFormData(resetFormData);
        const payload = {
          page: currentPage || 1,
          limit: 10,
        };
        if (canRead) {
          fetchAllFollowupLeads(
            currentPage,
            itemsPerPage,
            searchTerm,
            selectedFilter.value,
            filters.country,
            filters.followUpType,
            filters.status,
            filters.subStatus,
            filters.lead_from,
            filters.leadActivity,
            filters.startDate,
            filters.endDate,
            filters.branchId,
            filters.showAll,
            filters.assignRole,
            filters.assignId,
            filters.updatedOn,
          );
        }
        toast.success("Lead Update successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error adding lead", error);
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
        const updatedBool = updated[key] === "yes" || updated[key] === true;
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
      dateofbirth: originalData.dateofbirth
        ? originalData.dateofbirth.split("T")[0]
        : "",
      age: originalData.age || "",
      gender: originalData?.gender || "",
      name: originalData.name || "",
      email: originalData.email || "",
      city: originalData.city || "",
      country: originalData.country || "",
      phone: originalData.phone || "",
      alternate_contact: originalData.alternate_contact || "",
      address: originalData.address || "",
      country_interested: originalData.country_interested || [],
      course: originalData.course || "",
      level: originalData.level || "",
      budget: originalData.budget || "",
      how_much_in_bank: originalData.how_much_in_bank || "",
      english_proficiency: originalData.english_proficiency || "",
      passport: originalData.passport || "",
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
      comments: originalData.comments || "",
      office_use_only: originalData.office_use_only || "",
      remarks: originalData.remarks || "",
      form_type: originalData.form_type || "",
      lead_status: originalData.lead_status || "New",
      lead_sub_status: originalData.lead_sub_status || "",
      lead_form: originalData.lead_form || "",
      // lead_assign: originalData.lead_assign
      //   ? originalData.lead_assign._id || originalData.lead_assign
      //   : null,
      // lead_role: originalData.lead_role || null,
      lead_assign_Branch: originalData.lead_assign_Branch || null,
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

    // Get all new entry IDs (from values.lead_assign which may have _id preserved)
    const newEntryIds = (values.lead_assign || [])
      .map((item) => item._id?.toString())
      .filter(Boolean);

    // Find entries that were deleted (exist in original but not in new)
    const deletedEntryIds = originalEntryIds.filter(
      (id) => !newEntryIds.includes(id),
    );

    // Find new entries (no _id, meaning they're new additions)
    // Use formData.lead_assign instead of values.lead_assign for proper payload processing
    const currentLeadAssign = formData.lead_assign || [];
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
      family_work,
      interestedCourseDetails,
      visa_info,
      refused_years,
      reviews,
      ...restChangedValues
    } = restChangedFields;

    // Format only changed fields
    const formattedData = { ...restChangedValues };

    // Handle lead_assign changes (same as AllLeads.jsx - only ONE op per request)
    // Use formData.lead_assign instead of values.lead_assign for proper payload processing
    const normalizedOriginalAssign = Array.isArray(
      originalFormData?.lead_assign,
    )
      ? originalFormData.lead_assign
      : [];
    const normalizedCurrentAssign = Array.isArray(formData.lead_assign)
      ? formData.lead_assign
      : [];

    const deletedItem = normalizedOriginalAssign.find(
      (orig) =>
        orig?._id &&
        !normalizedCurrentAssign?.some(
          (curr) => String(curr?._id) === String(orig?._id),
        ),
    );

    const newItem = normalizedCurrentAssign?.find(
      (item) => item?.role && item?.user && !item?._id,
    );

    const updatedItem = normalizedCurrentAssign?.find((item) => {
      if (!item?._id) return false;
      const oldItem = normalizedOriginalAssign.find(
        (o) => String(o?._id) === String(item?._id),
      );
      if (!oldItem) return false;
      return String(oldItem.user) !== String(item.user);
    });

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

    // Only include these if they changed
    if (changedFields.visa_refused !== undefined) {
      formattedData.visa_refused = values.visa_refused === "yes" ? false : true;
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
    if (changedFields.visa_info !== undefined) {
      formattedData.visa_info = (visa_info || []).map((item) => ({
        visited_countries: item.visited_countries,
        visit_count: Number(item.visit_count),
        visa_type: item.visa_type,
        visa_refused: item.visa_refused,
        refused_country: item.refused_country,
        refused_times: Number(item.refused_times),
        refused_years: (item.refused_years || []).map((year) => Number(year)),
        refused_visa_type: item.refused_visa_type,
      }));
    }
    if (changedFields.interestedCourseDetails !== undefined) {
      formattedData.interestedCourseDetails = values.interestedCourseDetails;
    }
    if (changedFields.family_work !== undefined) {
      formattedData.family_work = values.family_work;
    }
    setIsLoading(true);
    try {
      const response = await dispatch(updateLead(editId, formattedData));
      if (response.status == 200) {
        handleClose();
        setFormData(resetFormData);
        const payload = {
          page: currentPage || 1,
          limit: 10,
        };
        if (canRead) {
          fetchAllFollowupLeads(
            currentPage,
            itemsPerPage,
            searchTerm,
            selectedFilter.value,
            filters.country,
            filters.followUpType,
            filters.status,
            filters.subStatus,
            filters.lead_from,
            filters.leadActivity,
            filters.startDate,
            filters.endDate,
            filters.branchId,
            filters.showAll,
            filters.assignRole,
            filters.assignId,
            filters.updatedOn,
          );
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

  const handleEdit = (id) => {
    setEditId(id);
    setIsEdit(true);
    handleShow();

    dispatch(getLeadById(id)).then((res) => {
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

  useEffect(() => {}, []);

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

  const handleRole = (roleId) => {
    dispatch(getAllCounsellor(roleId)).then((res) => {
      setgetAllCounsellorList(res?.data);
    });
  };

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
              item.remarks
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
        gender: lead.gender || "",
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
        // visa_refused: lead.visa_refused || false,
        // refused_country: lead.refused_country || "",
        // refused_times: lead.refused_times || "",
        // refused_years: lead.refused_years || [],
        // refused_visa_type: lead.refused_visa_type || "",
        comments: lead.comments || "",
        office_use_only: lead.office_use_only || "",
        remarks: lead.remarks || "",
        form_type: lead.form_type || "",
        lead_status: lead.lead_status || "new",
        lead_sub_status: lead.lead_sub_status || "",
        lead_form: lead.lead_form || "",
        // lead_assign: lead.lead_assign || "",
        // lead_role: lead.lead_role || "",
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
        interestedCourseDetails: cleanedInterestedCourseDetails,
        visa_info: cleanedVisaInfo,
        next_follow_up: lead.next_follow_up || "",
        from: lead.from || "",
        to: lead.to || "",
        nationality: lead.nationality || "",
        pincode: lead.pincode || "",
        lead_text_remark: lead.lead_text_remark || "",
        lead_followup_remark: lead.lead_followup_remark || "",
        follow_up_type: lead.follow_up_type || null,
      });
    }
  }, [getLeadDataById]);

  const handleView = (id) => {
    dispatch(getLeadById(id))
      .then((response) => {
        if (response?.data) {
          setGetLeadDataById(response.data);
          setSelectedLead(response.data);
          setShowViewModal(true);
          setOpenDropdown(null);
        } else {
          toast.error("Failed to fetch lead data");
        }
      })
      .catch((error) => {
        toast.error("Error fetching lead data");
        console.error("Error fetching lead by ID", error);
      });
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
        if (canRead) {
          fetchAllFollowupLeads(
            currentPage,
            itemsPerPage,
            searchTerm,
            selectedFilter.value,
            filters.country,
            filters.followUpType,
            filters.status,
            filters.subStatus,
            filters.lead_from,
            filters.leadActivity,
            filters.startDate,
            filters.endDate,
            filters.branchId,
            filters.showAll,
            filters.assignRole,
            filters.assignId,
            filters.updatedOn,
          );
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

  const [getLeadData, setGetLeadData] = useState([]);
  const fetchAllFollowupLeads = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    searchOnField,
    country = filters.country,
    followUpType = filters.followUpType,
    status = filters.status,
    subStatus = filters.subStatus,
    lead_from = filters.lead_from,
    leadActivity = filters.leadActivity,
    startDate = filters.startDate,
    endDate = filters.endDate,
    branchId = filters.branchId,
    showAll = filters.showAll,
    assignId = filters.assignId,
    assignRole = filters.assignRole,
    updatedOn = filters.updatedOn,
  ) => {
    try {
      const res = await dispatch(
        followUpLeads(
          page,
          limit,
          search,
          searchOnField,
          country,
          followUpType,
          status,
          subStatus,
          lead_from,
          leadActivity,
          startDate,
          endDate,
          branchId,
          showAll,
          assignId,
          assignRole,
          updatedOn,
        ),
      );
      if (res?.status === 200) {
        setGetLeadData(res?.data?.data);
        setTotalPages(res?.data?.data?.totalPages || 0);
        setTotalRecords(res?.data?.data?.totalLeads || 0);
      }
    } catch (error) {
      console.error("Error fetching leads", error);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchAllFollowupLeads(
        currentPage,
        itemsPerPage,
        searchTerm,
        selectedFilter.value,
        filters.country,
        filters.followUpType,
        filters.status,
        filters.subStatus,
        filters.lead_from,
        filters.leadActivity,
        filters.startDate,
        filters.endDate,
        filters.branchId,
        filters.showAll,
        filters.assignRole,
        filters.assignId,
        filters.updatedOn,
      );
    }
  }, [currentPage, searchTerm, selectedFilter, filters]);
  const fetchInquirys = async () => {
    try {
      const res = await dispatch(getAllInquiry(1, 100));
      const responseData = res?.data?.data;
      setAllInquiry(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Inquiry:", error);
      setAllInquiry([]);
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

  const fetchFollowUpTypes = async () => {
    try {
      const res = await dispatch(getAllFollowUpType(1, 100, ""));
      const responseData = res?.data?.data;
      setAllFollowUpTypes(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Follow Up Types:", error);
    }
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
  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
      setSelectedFilter(location.state.selectedFilter);
      setSearchTerm(location.state.searchTerm);
      setCurrentPage(location.state.currentPage);
      setItemsPerPage(location.state.itemsPerPage);
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
    fetchLeadStatus();
    fetchAllUser();
    fetchAllBranchs();
    fetchAllCourse();
    fetchInquirys();
    fetchCountries();
    fetchAllExam();
    fetchAllDegree();
    handleEditHistory();
    fetchLeadCountries();
    fetchFollowUpTypes();
    fetchOther();
    fetchLeadFrom();
  }, []);
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
  const fetchLeadSubStatus = async (mainTab) => {
    try {
      const res = await dispatch(getOneLeadSubStatus(mainTab));

      if (res?.status === 200) {
        setLeadSubStatus(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
      setLeadSubStatus([]);
    }
  };
  const getStatusColor = (statusName) => {
    const status = leadStatus.find(
      (item) => item.name.toLowerCase() === statusName?.toLowerCase(),
    );
    return status?.color || "#ccc";
  };
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchAllFollowupLeads(
        1,
        newItemsPerPage,
        searchTerm,
        selectedFilter.value,
        filters.country,
        filters.followUpType,
        filters.status,
        filters.subStatus,
        filters.lead_from,
        filters.leadActivity,
        filters.startDate,
        filters.endDate,
        filters.branchId,
        filters.showAll,
        filters.assignRole,
        filters.assignId,
        filters.updatedOn,
      );
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
  const fetchAllBranchs = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 100));
      const responseData = res?.data?.data;
      setAllBranchs(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching camouses:", error);
      setAllBranchs([]);
    }
  };
  const fetchAllCourse = async () => {
    const res = await dispatch(getAllCourseFinder(1, 1000));
    if (res?.status === 200) {
      const programNames =
        res?.data?.data?.data?.map((item) => item.programName) || [];
      const uniqueProgramNames = [...new Set(programNames)];
      setAllCourseData(uniqueProgramNames);
    }
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
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
    allBranchs?.map((branch) => ({
      value: branch._id,
      label: branch.name,
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

  const leadFollowUpRemarkOptions =
    leadStatus?.map((item) => ({
      value: item.name,
      label: item.name,
    })) || [];

  const [rolesByBranch, setRolesByBranch] = useState({});

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

  // Helper to get branch name by ID
  const getBranchNameById = (branchId) => {
    const branch = allBranchs?.find((b) => b._id === branchId);
    return branch ? branch.name : "Head Office";
  };

  // Fetch roles for a given branch ID and cache them
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

  const getRoleNameById = (roleId, branchId) => {
    const branchKey = branchId || "head_office";
    const roles = rolesByBranch[branchKey] || [];

    const found = roles.find((r) => r._id === roleId);
    return found ? found.name : "N/A";
  };

  const badgeThemes = [
    {
      bg: "#c7d2fe", // indigo-200 (quite visible)
      border: "#a5b4fc", // indigo-300
      role: "#4f46e5", // indigo-600 (brighter for role)
      user: "#1e1b4b", // indigo-950
    },
    {
      bg: "#a5f3fc", // cyan-200
      border: "#67e8f9", // cyan-300
      role: "#0891b2", // cyan-600
      user: "#083344",
    },
    {
      bg: "#bbf7d0", // green-200
      border: "#86efac", // green-300
      role: "#16a34a", // green-600
      user: "#052e16",
    },
  ];

  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

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
        mainheading="All Followup"
        parentfolder="Home"
        activepage="All Followup"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 mt-2">
              <div className="w-100 d-flex flex-wrap justify-content-end">
                {/* <div className="card-title">All Followup</div> */}
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <SearchWithDropdown
                    searchOption={searchOption}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    search={searchTerm}
                    setSearch={setSearchTerm}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {canRead && (
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
                          assignId: selectedOption ? selectedOption.value : "",
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
                              (option) => option.value === filters.followUpType,
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
                        !filters.status || leadSubStatus?.length === 0
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
                      classNamePrefix="custom-select"
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
                        // setLeadActivityFilter(option ? option.value : "");

                        setFilters({
                          ...filters,
                          leadActivity: option ? option.value : "",
                        });
                        setCurrentPage(1);
                      }}
                      options={leadActivityOptions?.map((item) => ({
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
                  {/* <div className="ms-auto">
                    <div className="contact-search3">
                      <button type="button" className="btn border-0">
                        <i
                          className="fe fe-search fw-semibold text-muted dark_theme"
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
                  </div> */}
                  <div className="flex-grow-1"></div>
                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />
                  <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                    <span>
                      Total Records :<strong>&nbsp;{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              )}
              <Row className="mb-3 align-items-end justify-content-between"></Row>

              <FormModal
                show={show}
                setShow={setShow}
                isLoading={isLoading}
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
                setLeadSubStatus={setLeadSubStatus}
                fetchLeadSubStatus={fetchLeadSubStatus}
                handleBranchChange={handleBranchChange}
                handelSubmitLead={handelSubmitLead}
                handelEditLead={handelEditLead}
                genderOptions={genderOptions}
                followUpTypeOptions={followUpTypeOptions}
                leadStatusOptions={leadStatusOptions}
                leadSubStatusOptions={leadSubStatusOptions}
                allInquiry={allInquiry}
                roleOptions={formRoleOptions}
                userOptions={formUserOptions}
                allBranchOptions={allBranchOptions}
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
                allOther={allOther}
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
              />

              <ViewModal
                show={showViewModal}
                onHide={handleCloseViewModal}
                title="Today Followup Details"
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
                // searchTerm={searchTerm}
                filters={filters}
                // setGetLeadData={setGetLeadData}
                setTotalPages={setTotalPages}
                setTotalRecords={setTotalRecords}
                fetchLeadStatus={fetchLeadStatus}
                countries={countries}
                convertPage="allfollowup"
                search={searchTerm}
                fetchAllFollowupLeads={fetchAllFollowupLeads}
                canRead={canRead}
                allOther={allOther}
              />

              <div className="application-card-container">
                {getLeadData?.leads?.length > 0 ? (
                  getLeadData?.leads?.map((item, index) => (
                    <div
                      key={item._id}
                      className="application-card rounded-lg mb-4 position-relative hover-shadow"
                      style={{
                        transition: "all 0.3s ease",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 8px",
                        padding: "10px",
                      }}
                    >
                      {/* --- HEADER SECTION --- */}
                      <div
                        className="px-4 py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
                        style={{ backgroundColor: "#fbfbff" }}
                      >
                        <div className="d-flex align-items-start gap-3">
                          <div>
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                              <span
                                className="badge border-0 fw-bold px-2 py-1 shadow-sm"
                                style={{
                                  fontSize: "0.7rem",
                                  letterSpacing: "0.8px",
                                  backgroundColor: "#5d54be",
                                  color: "#ffffff",
                                  borderRadius: "4px",
                                  textTransform: "uppercase",
                                }}
                              >
                                {item?.leadId}
                              </span>
                              <h5
                                className="mb-0 fw-bold"
                                style={{
                                  color: "#4B49AC",
                                  cursor: "pointer",
                                  letterSpacing: "-0.2px",
                                }}
                                onClick={() => {
                                  handleEdit(item?._id, item?.lead_role?.name);
                                  handleEditHistory(item);
                                }}
                              >
                                {item?.name || "-"}
                              </h5>
                              {item?.isDuplicate && (
                                <span
                                  className="duplicate-warning px-2 py-1"
                                  style={{
                                    fontSize: "0.7rem",
                                    borderRadius: "4px",
                                  }}
                                >
                                  Duplicate Lead
                                </span>
                              )}
                              {item?.deadLead && (
                                <span
                                  className="px-2 py-1 badge bg-danger text-white rounded-pill"
                                  style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  Inactive Lead
                                </span>
                              )}
                            </div>

                            {/* Metadata Row */}
                            {(item?.createdByName?.length > 0 ||
                              item?.updatedByName?.length > 0 ||
                              item?.created_by_type?.length > 0 ||
                              item?.b2bCompany?.length > 0) && (
                              <div className="d-flex flex-wrap gap-x-4 gap-y-1 align-items-center small mt-2">
                                {item?.created_by_type?.length > 0 && (
                                  <div
                                    className="d-flex align-items-center me-3"
                                    style={{ color: "#6366f1" }}
                                  >
                                    <AssignmentIndIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "15px",
                                        color: "#6366f1",
                                        opacity: 0.9,
                                      }}
                                    />
                                    <strong style={{ opacity: 0.8 }}>
                                      Type
                                    </strong>
                                    &nbsp;:&nbsp;
                                    <span className="fw-semibold">
                                      {item?.created_by_type === "B2B Admin" ||
                                      item?.created_by_type === "B2B Member" ? (
                                        <>
                                          B2B Partner
                                          {item?.b2bCompany &&
                                            ` (${item.b2bCompany})`}
                                        </>
                                      ) : item?.created_by_type === "user" ? (
                                        <>
                                          Head Office
                                          {item?.b2bCompany &&
                                            ` (${item.b2bCompany})`}
                                        </>
                                      ) : item?.created_by_type ===
                                          "Branch Member" ||
                                        item?.created_by_type ===
                                          "Branch member" ? (
                                        <>
                                          Branch Member
                                          {item?.branch && ` (${item.branch})`}
                                        </>
                                      ) : (
                                        item?.created_by_type
                                      )}
                                    </span>
                                  </div>
                                )}
                                {item?.createdByName?.length > 0 && (
                                  <div
                                    className="d-flex align-items-center me-3 border-start ps-3 d-none d-sm-flex"
                                    style={{ color: "#7c3aed" }}
                                  >
                                    <PersonIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "15px",
                                        color: "#7c3aed",
                                        opacity: 0.9,
                                      }}
                                    />
                                    <strong style={{ opacity: 0.8 }}>
                                      Created By
                                    </strong>
                                    &nbsp;:&nbsp;
                                    <span className="fw-semibold">
                                      {item?.createdByName}
                                    </span>
                                  </div>
                                )}
                                {item?.updatedByName?.length > 0 && (
                                  <div
                                    className="d-flex align-items-center border-start ps-3 d-none d-md-flex"
                                    style={{ color: "#4f46e5" }}
                                  >
                                    <CreateIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "15px",
                                        color: "#4f46e5",
                                        opacity: 0.9,
                                      }}
                                    />
                                    <strong style={{ opacity: 0.8 }}>
                                      Updated By
                                    </strong>
                                    &nbsp;:&nbsp;
                                    <span className="fw-semibold">
                                      {item?.updatedByName}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2 ms-auto">
                          {item?.dueAmount > 0 && (
                            <div className="px-3 py-1 bg-danger bg-opacity-10 border border-danger rounded-pill me-2">
                              <span className="text-danger fw-bold small">
                                <i className="bi bi-exclamation-circle me-1"></i>
                                Receivable:{" "}
                                {storedEncryptedCurrency
                                  ? getSymbolFromCurrency(
                                      storedEncryptedCurrency,
                                    )
                                  : "₹"}{" "}
                                {Math.floor(item?.dueAmount)}
                              </span>
                            </div>
                          )}

                          <div className="d-flex align-items-center gap-2">
                            <IconButton
                              aria-label="more"
                              className="ms-1 border shadow-sm"
                              style={{
                                backgroundColor: "#5d54be34",
                                borderColor: "#5d54be34",
                                width: "36px",
                                height: "36px",
                              }}
                              onClick={(e) => {
                                setOpenDropdown(
                                  openDropdown === index ? null : index,
                                );
                                setAnchorEl(e.currentTarget);
                              }}
                            >
                              <MoreVertIcon
                                className="three-dots-icon"
                                style={{ color: "#5d54be", fontSize: "20px" }}
                              />
                            </IconButton>
                            <Menu
                              id={`menu-${index}`}
                              anchorEl={anchorEl}
                              open={openDropdown === index}
                              onClose={() => setOpenDropdown(null)}
                              MenuListProps={{
                                "aria-labelledby": `menu-${index}`,
                              }}
                              sx={{
                                "& .MuiPaper-root": {
                                  minWidth: "150px",
                                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                },
                              }}
                            >
                              {canUpdate && (
                                <MenuItem
                                  onClick={() => {
                                    handleEdit(
                                      item?._id,
                                      item?.lead_role?.name,
                                    );
                                    handleEditHistory(item);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <EditIcon
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                    className="edit-icon"
                                  />
                                  <span className="edit-action-text">Edit</span>
                                </MenuItem>
                              )}
                              <MenuItem
                                onClick={() => {
                                  handleView(item?._id);
                                  setOpenDropdown(null);
                                }}
                              >
                                <VisibilityIcon
                                  fontSize="small"
                                  sx={{ mr: 1 }}
                                  className="view-icon"
                                />
                                <span className="view-action-text">View</span>
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setSelectedDeadLead(item);
                                  setShowDeadLeadModal(true);
                                  setOpenDropdown(null);
                                }}
                                disabled={item?.deadLead === true}
                              >
                                <DangerousIcon
                                  fontSize="small"
                                  sx={{ mr: 1 }}
                                  className="delete-icon"
                                />
                                <span className="delete-action-text">
                                  Inactive Lead
                                </span>
                              </MenuItem>
                              {(canCreate || canUpdate) &&
                                (item.lead_status === "Converted" ? (
                                  <MenuItem disabled>
                                    <FaAppStore
                                      fontSize="small"
                                      className="convert-icon"
                                      style={{ marginRight: "8px" }}
                                    />
                                    <span className="convert-action-text">
                                      Already Converted
                                    </span>
                                  </MenuItem>
                                ) : (
                                  <MenuItem
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      setSelectedLead(item);
                                      setOpenModal(true);
                                    }}
                                  >
                                    <FaAppStore
                                      fontSize="small"
                                      className="convert-icon"
                                      style={{ marginRight: "8px" }}
                                    />
                                    <span className="convert-action-text">
                                      Convert to Application
                                    </span>
                                  </MenuItem>
                                ))}
                              <MenuItem
                                onClick={() => {
                                  navigate(`/lead-track/${item._id}`, {
                                    state: {
                                      from: location.pathname,
                                      filters,
                                      search: searchTerm,
                                      currentPage,
                                      itemsPerPage,
                                    },
                                  });
                                  setOpenDropdown(null);
                                }}
                              >
                                <FaBullseye
                                  fontSize="small"
                                  style={{ marginRight: "8px" }}
                                  className="leadtrack-icon"
                                />
                                <span className="leadtrack-action-text">
                                  History
                                </span>
                              </MenuItem>
                            </Menu>
                          </div>
                        </div>
                      </div>

                      {/* --- CONTENT SECTION --- */}
                      <div className="px-4 py-4">
                        <div className="row g-4">
                          {/* Lead Status */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2">
                              <MdDescription
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#4285F4"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-1">
                                  Lead Status
                                </div>
                                <span
                                  className="badge border-0"
                                  onClick={() => {
                                    if (canUpdate) {
                                      handleEdit(
                                        item?._id,
                                        item?.lead_role?.name,
                                      );
                                      handleEditHistory(item);
                                    }
                                  }}
                                  style={{
                                    backgroundColor: getStatusColor(
                                      item.lead_status,
                                    ),
                                    color: "#fff",
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  {item.lead_status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Date (Next Followup) */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdOutlineCalendarToday
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#34A853"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Follow-up Date
                                </div>
                                <div className="fw-semibold">
                                  {new Date(
                                    item.next_follow_up,
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdAccessTime
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#FB8C00"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Time
                                </div>
                                <div className="fw-semibold">
                                  {new Date(item.createdAt).toLocaleString(
                                    "en-GB",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    },
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lead From */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <FaBullseye
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#A259FF"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Lead From
                                </div>
                                <div className="fw-semibold">
                                  {item?.lead_form || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdCall
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#4285F4"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Phone
                                </div>
                                <div
                                  className="fw-semibold text-primary"
                                  style={{ cursor: "pointer" }}
                                >
                                  {item.phone || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdLocationOn
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#EA4335"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Location
                                </div>
                                <div className="fw-semibold">
                                  {item.city || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Branch Lead Assign */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdPersonOutline
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#00796B"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Branch Assigned
                                </div>
                                <div className="fw-semibold">
                                  {getBranchNameById(
                                    item?.lead_assign_Branch?._id,
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Other Service */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdEditNote
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#2A48A0"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Other Service
                                </div>
                                <div
                                  className="fw-semibold overflow-hidden text-truncate"
                                  style={{ maxWidth: "200px" }}
                                >
                                  {item?.other_for?.length > 0
                                    ? item.other_for
                                        .map((serviceId) => {
                                          const foundService = allOther?.find(
                                            (service) =>
                                              service?._id === serviceId,
                                          );
                                          return foundService?.name || "";
                                        })
                                        .filter(Boolean)
                                        .join(", ")
                                    : "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row g-3">
                            {/* Counselor Assignment */}
                            <div className="col-12 col-lg-6">
                              <div
                                className="p-3 border rounded-4 h-100"
                                style={{
                                  backgroundColor: "#ffffff",
                                  border: "0.25px solid #e5e7eb",
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                                }}
                              >
                                {/* Header */}
                                <div className="d-flex align-items-center gap-2 mb-3">
                                  <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      backgroundColor: "#ffedd5",
                                      border: "1px solid #fed7aa",
                                    }}
                                  >
                                    <MdVerifiedUser
                                      size={18}
                                      style={{ color: "#f59e0b" }}
                                    />
                                  </div>

                                  <div
                                    className="fw-semibold text-uppercase"
                                    style={{
                                      fontSize: "0.75rem",
                                      letterSpacing: "0.08em",
                                      color: "#0f172a",
                                    }}
                                  >
                                    Counselor Assignment
                                  </div>
                                </div>

                                {/* Content */}
                                {item?.lead_assign?.length > 0 ? (
                                  <div className="d-flex flex-wrap gap-2">
                                    {item.lead_assign.map((assign, idx) => {
                                      const theme =
                                        badgeThemes[idx % badgeThemes.length];
                                      return (
                                        <div
                                          key={assign?._id || idx}
                                          className="d-inline-flex align-items-center gap-1 px-3 py-2 rounded-pill border"
                                          style={{
                                            backgroundColor: theme.bg,
                                            borderColor: theme.border,
                                            fontSize: "0.85rem",
                                          }}
                                        >
                                          <span
                                            className="fw-medium"
                                            style={{ color: theme.role }}
                                          >
                                            {assign?.role?.name}
                                          </span>
                                          <span style={{ opacity: 0.5 }}>
                                            •
                                          </span>
                                          <span
                                            className="fw-semibold"
                                            style={{ color: theme.user }}
                                          >
                                            {assign?.user?.name || "Unassigned"}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="small fst-italic text-muted">
                                    No active assignments available.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Remark */}
                            <div className="col-12 col-lg-6">
                              <div
                                className="p-3 rounded-4 h-100"
                                style={{
                                  backgroundColor: "#f8fafc",
                                  border: "0.25px solid #e5e7eb",
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.04) 0px 6px 20px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                                }}
                              >
                                {/* Header */}
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <MdChatBubble
                                    className="text-secondary"
                                    size={16}
                                    style={{ opacity: 0.7 }}
                                  />
                                  <span
                                    className="text-uppercase fw-bold text-muted small"
                                    style={{
                                      letterSpacing: "1px",
                                      fontSize: "0.65rem",
                                    }}
                                  >
                                    {" "}
                                    Remark{" "}
                                  </span>
                                </div>

                                {/* Content */}
                                <div
                                  style={{
                                    fontSize: "0.9rem",
                                    lineHeight: "1.6",
                                    color: "#1f2937",
                                  }}
                                >
                                  {item?.remarks ||
                                    "No additional remarks available."}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-6-600">
                    {!canRead
                      ? "You do not have permission to view this Data"
                      : "No data available"}
                  </div>
                )}
              </div>
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
                    onClick={() => handleMarkDeadLead(showDeadLeadModal)}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>Yes
                  </Button>
                </Modal.Footer>
              </Modal>

              {totalPages > 1 && getLeadData?.leads?.length > 0 && (
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

export default AllFollowup;
