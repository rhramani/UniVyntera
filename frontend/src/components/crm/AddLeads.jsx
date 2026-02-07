import { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
// import { FaEdit, FaTrash } from "react-icons/fa";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { AiOutlineClose } from "react-icons/ai";
import { FaAppStore, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import Pageheader from "../../layouts/Pageheader";
import Paginations from "../elements/Paginations";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  addLead,
  deleteLead,
  downloadLeads,
  filterWiseLead,
  getLead,
  getLeadById,
  updateLead,
  insertMany,
  deleteManyLead,
  getAllCounsellor,
  editHistory,
  convertToApplication,
} from "../../redux/actions/Lead.action";
import { useDispatch } from "react-redux";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import {
  createLeadStatus,
  getAllLeadStatus,
  updateLeadStatus,
} from "../../redux/actions/Master/LeadStatuses/LeadStatus.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getAllExam } from "../../redux/actions/Lead/Exam.action";
import { getAllDegree } from "../../redux/actions/Lead/Degree.action";
import Select from "react-select";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import { getAllCourseFinder } from "../../redux/actions/CourseFinder.action";
import { getAllInquiry } from "../../redux/actions/Lead/Inquiry.action";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import usePermissions from "../commonComponents/usePermissions";

const validationSchema = Yup.object({
  inquiry_for: Yup.string().nullable(),
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
  lead_status: Yup.string().default("New"),
  lead_form: Yup.string(),
  lead_assign: Yup.string().required("Lead Assign is required"),
  lead_role: Yup.string().required("Lead Role is required"),
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
  lead_followup_remark: Yup.string(),
  source_of_reference: Yup.string(),
  city: Yup.string().required("City is required"),

  // Nested fields
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

const AddLeads = () => {
  const dispatch = useDispatch();
  const [getLeadData, setGetLeadData] = useState([]);
  const [getLeadDataById, setGetLeadDataById] = useState();
  const [getAllCounsellorList, setgetAllCounsellorList] = useState();
  // const { getLeadData, getLeadDataById, getAllCounsellorList } = useSelector(
  //   (state) => state.leadData
  // );
  // const theme = useSelector((state) => state.theme.theme.theme);
  const [show, setShow] = useState(false);
  const [showEducationCourseInfo, setShowEducationCourseInfo] = useState(false);
  const [showFamilyWork, setShowFamilyWork] = useState(false);
  const [showInquiryInfo, setShowInquiryInfo] = useState(false);
  const [showVisaInfo, setShowVisaInfo] = useState(false);
  const [showEducationEvaluation, setShowEducationEvaluation] = useState(false);
  const [showEducationDetails, setShowEducationDetails] = useState(false);
  const [showReferFriend, setShowReferFriend] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [index, setIndex] = useState({
    educationEvaluation: 0,
    educationDetails: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editHistoryData, setEditHistoryData] = useState([]);
  const [allExamData, setAllExamData] = useState([]);
  const [allDegreeData, setAllDegreeData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allcourseData, setAllCourseData] = useState([]);
  const [allInquiry, setAllInquiry] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [preferredCountry, setPreferredCountry] = useState("");
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("All Lead");

  useEffect(() => {
    if (show || showViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, showViewModal]);

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
    lead_status: "New",
    lead_form: "",
    lead_assign: "",
    lead_role: "",
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
    lead_followup_remark: "",
    city: "",
  });
  const [allUser, setAllUser] = useState([]);
  const resetFormData = {
    city: "",
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
    lead_status: "New",
    lead_form: "",
    lead_assign: "",
    lead_role: "",
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
    lead_followup_remark: "",
  };

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });
  const [getAllRollList, setGetAllRoleList] = useState();
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState({
    educationEvaluation: false,
    educationEvaluationIndex: 0,
    educationDetails: false,
    educationDetailsIndex: 0,
  });
  const [leadStatus, setLeadStatus] = useState([]);
  useEffect(() => {
    const payload = {
      page: currentPage || 1,
      limit: 10,
      startdate: filters.startDate,
      enddate: filters.endDate,
      status: filters.status,
    };
    const isFilterApplied =
      filters.startDate || filters.endDate || filters.status;

    if (isFilterApplied) {
      const filterPayload = {
        page: currentPage || 1,
        limit: 10,
        startdate: filters.startDate,
        enddate: filters.endDate,
        status: filters.status,
      };
      if (canRead) {
        dispatch(filterWiseLead(filterPayload)).then((res) => {
          setGetLeadData(res?.data);
        });
      }
    } else {
      if (canRead) {
        dispatch(getLead(payload)).then((res) => {
          setGetLeadData(res?.data);
        });
      }
    }
  }, [currentPage, filters]);

  useEffect(() => {
    const payload = {
      page: currentPage || 1,
      limit: 10,
      search: searchTerm,
      status: filters.status,
    };
    if (canRead) {
      dispatch(getLead(payload)).then((res) => {
        setGetLeadData(res?.data);
      });
    }
  }, [currentPage, searchTerm]);

  const changePage = (page) => {
    setCurrentPage(page);

    const isFilterApplied =
      filters.startDate || filters.endDate || filters.status;

    if (isFilterApplied) {
      const filterPayload = {
        page: page || 1,
        limit: 10,
        startdate: filters.startDate,
        enddate: filters.endDate,
        status: filters.status,
      };
      if (canRead) {
        dispatch(filterWiseLead(filterPayload)).then((res) => {
          setGetLeadData(res?.data);
        });
      }
    } else {
      const payload = {
        page: page || 1,
        limit: 10,
        search: searchTerm,
        status: filters.status,
      };
      if (canRead) {
        dispatch(getLead(payload)).then((res) => {
          setGetLeadData(res?.data);
        });
      }
    }
  };

  useEffect(() => {
    if (getLeadData) {
      (setCurrentPage(getLeadData.currentPage),
        setTotalPages(getLeadData.totalPages));
    }
  }, [getLeadData]);

  const handleClose = () => {
    setShowEducationCourseInfo(false);
    setShowFamilyWork(false);
    setShowInquiryInfo(false);
    setShowVisaInfo(false);
    setShowEducationEvaluation(false);
    setShowReferFriend(false);
    setShowEducationDetails(false);
    setShowReviews(false);
    setShow(false);
    setIsEdit(false);
    setFormData(resetFormData);
  };
  const handleShow = () => setShow(true);

  const handleDelete = async (id) => {
    try {
      const response = await dispatch(deleteLead(id?._id));

      if (response.status == 200) {
        toast.success("Lead deleted successfully!");

        const isLastItemOnPage =
          getLeadData?.data?.length === 1 && currentPage > 1;

        const newPage = isLastItemOnPage ? currentPage - 1 : currentPage;

        const payload = {
          page: newPage,
          limit: 10,
        };
        if (canRead) {
          dispatch(getLead(payload)).then((res) => {
            setGetLeadData(res?.data);
          });
        }
        setCurrentPage(newPage);
        setShowDeleteModal(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
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

  const handelSubmitLead = async (values) => {
    const {
      education_evaluation,
      education_details,
      refused_years,
      visited_countries,
      reviews,
      refer_friend,
      ...restValues
    } = values;

    const formattedData = {
      ...restValues,
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
          dispatch(getLead(payload))
            .then((res) => {
              setGetLeadData(res?.data);
            })
            .catch((err) => {
              console.log(err, "err");
            });
        }
        toast.success("Lead Added successfully!");
      }
    } catch (error) {
      console.error("Error adding lead", error);
    }
  };

  const handelEditLead = async (values) => {
    const {
      education_evaluation,
      education_details,
      refused_years,
      visited_countries,
      reviews,
      refer_friend,
      ...restValues
    } = values;

    const formattedData = {
      ...restValues,
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

    try {
      const response = await dispatch(updateLead(editId?._id, formattedData));
      if (response.status == 200) {
        handleClose();
        setFormData(resetFormData);
        const payload = {
          page: currentPage || 1,
          limit: 10,
        };
        if (canRead) {
          dispatch(getLead(payload)).then((res) => {
            setGetLeadData(res?.data);
          });
        }
        toast.success("Data Update successfully!");
      }
    } catch (error) {
      toast.error("Somthing went wrong");
      console.error("Error adding lead", error);
    }
  };

  const handleEdit = (id, roleId) => {
    setEditId(id);
    setIsEdit(true);
    handleShow();

    dispatch(getAllCounsellor(roleId)).then((res) => {
      setgetAllCounsellorList(res?.data);
    });

    dispatch(getLeadById(id?._id)).then((res) => {
      setGetLeadDataById(res?.data);
    });
  };

  useEffect(() => {}, []);

  useEffect(() => {
    dispatch(getAllRoleList()).then((res) => {
      setGetAllRoleList(res?.data);
    });
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
        form_type: lead.form_type || "",
        lead_status: lead.lead_status || "New",
        lead_form: lead.lead_form || "",
        lead_assign: lead.lead_assign || "",
        lead_role: lead.lead_role || "",
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
        lead_followup_remark: lead.lead_followup_remark || "",
      });
    }
  }, [getLeadDataById]);

  const handleDownload = async () => {
    try {
      const payload = {
        page: currentPage || 1,
        limit: 10,
        startdate: filters.startDate,
        enddate: filters.endDate,
        status: filters.status,
      };
      const response = await dispatch(downloadLeads(payload));
      if (response?.status === 200 && response?.data) {
        const blob = new Blob([response.data], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        link.setAttribute(
          "download",
          `Leads-${new Date().toISOString().slice(0, 10)}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Lead downloaded successfully!");
      } else {
        toast.error("No data found to download.");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error downloading lead", error);
    }
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
    formData.append("file", selectedFile);

    try {
      const response = await dispatch(insertMany(formData));

      if (response?.status === 200) {
        const payload = {
          page: currentPage || 1,
          limit: 10,
        };
        if (canRead) {
          dispatch(getLead(payload)).then((res) => {
            setGetLeadData(res?.data);
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
    const res = await dispatch(getAllCourseFinder(1, 1000));
    if (res?.status === 200) {
      const programNames =
        res?.data?.data?.data?.map((item) => item.programName) || [];
      const uniqueProgramNames = [...new Set(programNames)];
      setAllCourseData(uniqueProgramNames);
    }
  };

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

  useEffect(() => {
    fetchLeadStatus();
    fetchAllUser();
    handleEditHistory();
    fetchAllExam();
    fetchAllDegree();
    fetchCountries();
    fetchAllCourse();
    fetchInquirys();
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
  const getStatusColor = (statusName) => {
    const status = leadStatus.find(
      (item) => item.name.toLowerCase() === statusName?.toLowerCase(),
    );
    return status?.color || "#ccc";
  };
  const fetchAllUser = async (roleName) => {
    try {
      const res = await dispatch(adminGetAll(1, 100, "", roleName, "", false));
      const responseData = res?.data?.data;
      setAllUser(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching camouses:", error);
      setAllUser([]);
    }
  };
  const handleConvertToApplication = async (item, country) => {
    try {
      const convertResponse = await dispatch(
        convertToApplication(item?._id, country),
      );

      if (convertResponse?.status === 200) {
        toast.success("Lead converted successfully");

        const statusRes = await dispatch(getAllLeadStatus());
        const statusList = statusRes?.data?.data || [];

        const convertedStatus = statusList.find(
          (status) => status?.name?.toLowerCase() === "converted",
        );
        if (!convertedStatus) {
          const createStatusRes = await dispatch(
            createLeadStatus({
              name: "Converted",
            }),
          );

          if (createStatusRes?.status === 200) {
            toast.success("Converted status created");
          }
        } else {
          const updateStatusRes = await dispatch(
            updateLeadStatus(
              {
                name: "Converted",
              },
              convertedStatus?._id,
            ),
          );

          if (updateStatusRes?.status === 200) {
            toast.success("Converted status updated");
          }
        }

        const updatedLeadData = {
          ...item,
          lead_status: "Converted",
          country_interested: Array.isArray(item.country_interested)
            ? item.country_interested
            : [item.country_interested],
        };

        const updateResponse = await dispatch(
          updateLead(item?._id, updatedLeadData),
        );

        if (updateResponse?.status === 200) {
          const payload = {
            page: currentPage || 1,
            limit: 10,
          };
          if (canRead) {
            dispatch(getLead(payload)).then((res) => {
              setGetLeadData(res?.data);
            });
          }
        } else {
          toast.error("Failed to update lead status");
        }

        setPreferredCountry("");
        fetchLeadStatus();
      } else {
        toast.error(convertResponse?.data?.message || "Failed to convert lead");
      }
    } catch (error) {
      console.error("Error in convert to application:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Pageheader mainheading="Leads" parentfolder="Home" activepage="Leads" />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 mt-2">
              <div>
                <div className="card-title">Add Leads</div>
              </div>
            </Card.Header>
            <Card.Body>
              {canRead && (
                <Row className="mb-3 align-items-end justify-content-between">
                  <Col sm={12} md={2}>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      className="custom-select-height"
                      value={filters.startDate}
                      onChange={(e) => {
                        setFilters({ ...filters, startDate: e.target.value });
                        setCurrentPage(1);
                      }}
                    />
                  </Col>

                  <Col sm={12} md={2}>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      className="custom-select-height"
                      value={filters.endDate}
                      onChange={(e) => {
                        setFilters({ ...filters, endDate: e.target.value });
                        setCurrentPage(1);
                      }}
                    />
                  </Col>

                  <Col sm={12} md={2}>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      className="custom-select-height"
                      value={filters.status}
                      onChange={(e) => {
                        setFilters({ ...filters, status: e.target.value });
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">Select option</option>
                      {leadStatus?.map((item) => (
                        <option key={item._id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col sm={12} md={6}>
                    <div className="d-flex justify-content-end align-items-end gap-2">
                      <div className="position-relative me-2">
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

                      {/* Buttons */}
                      <Button
                        variant="primary"
                        className="custom-btn custom-select-height px-3"
                        onClick={() => handleDownload()}
                      >
                        Download
                      </Button>
                      {canCreate && (
                        <>
                          <Button
                            variant="primary"
                            className="custom-btn custom-select-height px-3"
                            onClick={handleShow}
                          >
                            Add Lead
                          </Button>
                          <Button
                            variant="primary"
                            className="custom-btn custom-select-height px-3"
                            onClick={handleShowUploadModal}
                          >
                            Upload
                          </Button>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
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
                      <Form.Control type="file" onChange={handleFileChange} />
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

              <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>{isEdit ? "Update" : "Add"} Lead</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleClose}
                  />
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <Formik
                    initialValues={formData}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                      if (!isEdit) {
                        handelSubmitLead(values);
                      } else {
                        handelEditLead(values);
                      }
                    }}
                  >
                    {({ handleSubmit, setFieldValue, values }) => (
                      <Form onSubmit={handleSubmit}>
                        <div className="mb-5">
                          <h5 className="mb-3">Lead Details</h5>
                          <Row className="mb-3">
                            <Col md={3}>
                              <Form.Label>Name *</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("name", e.target.value)
                                }
                                value={values.name}
                                className="custom-select-height"
                                placeholder="Enter name"
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>City</Form.Label>
                              <Form.Control
                                type="text"
                                name="city"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("city", e.target.value)
                                }
                                value={values.city}
                                className="custom-select-height"
                                placeholder="Enter city"
                              />
                              <ErrorMessage
                                name="city"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Phone</Form.Label>
                              <PhoneInput
                                country={"in"}
                                value={values.phone}
                                onChange={(phone, data) => {
                                  const dialCode = data.dialCode
                                    ? `+${data.dialCode}`
                                    : "";
                                  const formattedPhone =
                                    `${dialCode} ${phone.replace(
                                      data.dialCode,
                                      "",
                                    )}`.trim();
                                  setFieldValue("phone", formattedPhone);
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
                              <ErrorMessage
                                name="phone"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Alternate Contact</Form.Label>
                              <PhoneInput
                                country={"in"}
                                value={values.alternate_contact}
                                onChange={(phone, data) => {
                                  const dialCode = data.dialCode
                                    ? `+${data.dialCode}`
                                    : "";
                                  const formattedPhone =
                                    `${dialCode} ${phone.replace(
                                      data.dialCode,
                                      "",
                                    )}`.trim();
                                  setFieldValue(
                                    "alternate_contact",
                                    formattedPhone,
                                  );
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
                              <ErrorMessage
                                name="alternate_contact"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Gender</Form.Label>
                              <Form.Select
                                className="custom-select-height"
                                name="gender"
                                value={values.gender}
                                onChange={(e) =>
                                  setFieldValue("gender", e.target.value)
                                }
                              >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </Form.Select>
                              <ErrorMessage
                                name="gender"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Date of Birth</Form.Label>
                              <Form.Control
                                type="date"
                                name="dateofbirth"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("dateofbirth", e.target.value)
                                }
                                value={values.dateofbirth}
                                className="custom-select-height"
                              />
                              <ErrorMessage
                                name="dateofbirth"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Age</Form.Label>
                              <Form.Control
                                type="number"
                                name="age"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("age", e.target.value)
                                }
                                value={values.age}
                                className="custom-select-height"
                                placeholder="Enter age"
                              />
                              <ErrorMessage
                                name="age"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Comments</Form.Label>
                              <Form.Control
                                name="comments"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("comments", e.target.value)
                                }
                                value={values.comments}
                                className="custom-select-height"
                                placeholder="Add comment"
                                rows={2}
                              />
                              <ErrorMessage
                                name="comments"
                                component="div"
                                className="text-danger"
                              />
                            </Col>

                            {/* <h5 className="mt-4 mb-2">Notes & Status</h5> */}
                            <Col md={3}>
                              <Form.Label>Lead Status</Form.Label>
                              <Form.Select
                                className="custom-select-height"
                                name="lead_status"
                                value={values.lead_status}
                                onChange={(e) =>
                                  setFieldValue("lead_status", e.target.value)
                                }
                              >
                                <option value="">Select option</option>
                                {leadStatus?.map((item) => (
                                  <option key={item._id} value={item.name}>
                                    {item.name}
                                  </option>
                                ))}
                              </Form.Select>
                              <ErrorMessage
                                name="lead_status"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Lead from</Form.Label>
                              <Form.Control
                                type="text"
                                name="lead_form"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("lead_form", e.target.value)
                                }
                                placeholder="Add Lead From"
                                value={values.lead_form}
                                className="custom-select-height"
                              />
                              <ErrorMessage
                                name="lead_form"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Lead Assign Role</Form.Label>
                              <Form.Select
                                className="custom-select-height"
                                name="lead_role"
                                as={Form.Control}
                                onChange={(e) => {
                                  const selectedRoleId = e.target.value;
                                  setFieldValue("lead_role", selectedRoleId);
                                  // if (selectedRoleId) {
                                  //   handleRole(selectedRoleId);
                                  // }
                                  const selectedRole =
                                    getAllRollList?.data?.find(
                                      (role) => role._id === selectedRoleId,
                                    );
                                  if (selectedRole) {
                                    fetchAllUser(selectedRole.name);
                                  }
                                }}
                                value={values.lead_role}
                              >
                                <option value="">Select option</option>
                                {getAllRollList?.data
                                  ?.filter(
                                    (role) => role.name !== "Super Admin",
                                  )
                                  .map((data, i) => (
                                    <option key={i} value={data?._id}>
                                      {data?.name}
                                    </option>
                                  ))}
                              </Form.Select>
                              <ErrorMessage
                                name="lead_role"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Lead Assign</Form.Label>
                              <Form.Select
                                className="custom-select-height"
                                name="lead_assign"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("lead_assign", e.target.value)
                                }
                                value={values.lead_assign}
                                disabled={!values.lead_role}
                              >
                                <option value="">Select option</option>
                                {/* {getAllCounsellorList?.data?.map((data, i) => {
                                return (
                                  <option key={i} value={data?._id}>
                                    {data?.name}
                                  </option>
                                );
                              })} */}
                                {allUser.map((user) => (
                                  <option key={user._id} value={user._id}>
                                    {user.name}
                                  </option>
                                ))}
                              </Form.Select>
                              <ErrorMessage
                                name="lead_assign"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Inquiry For</Form.Label>
                              <Form.Select
                                className="custom-select-height"
                                name="inquiry_for"
                                as={Form.Control}
                                value={values.inquiry_for}
                                onChange={(e) => {
                                  const selectedId = e.target.value;
                                  setFieldValue("inquiry_for", selectedId);
                                }}
                              >
                                <option value="">Select option</option>
                                {allInquiry?.map((data, i) => (
                                  <option key={i} value={data?._id}>
                                    {data?.name}
                                  </option>
                                ))}
                              </Form.Select>
                              <ErrorMessage
                                name="inquiry_for"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Source of Reference</Form.Label>
                              <Form.Control
                                name="source_of_reference"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    "source_of_reference",
                                    e.target.value,
                                  )
                                }
                                value={values.source_of_reference}
                                type="text"
                                className="custom-select-height"
                              />
                              <ErrorMessage
                                name="source_of_refrence"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Office Use Only</Form.Label>
                              <Form.Control
                                name="office_use_only"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    "office_use_only",
                                    e.target.value,
                                  )
                                }
                                value={values.office_use_only}
                                className="custom-select-height"
                                rows={2}
                              />
                            </Col>
                          </Row>
                        </div>

                        <h5 className="form-heading p-2 rounded-5">
                          Follow-up Details
                        </h5>
                        <div className="mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={3}>
                              <Form.Label>Next Followup Date</Form.Label>
                              <Form.Control
                                type="date"
                                name="next_follow_up"
                                value={values.next_follow_up}
                                onChange={(e) =>
                                  setFieldValue(
                                    "next_follow_up",
                                    e.target.value,
                                  )
                                }
                                className="custom-select-height"
                              />
                              <ErrorMessage
                                name="next_follow_up"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>From</Form.Label>
                              <Form.Control
                                name="from"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("from", e.target.value)
                                }
                                value={values.from}
                                type="time"
                                className="custom-select-height"
                              />
                              <ErrorMessage
                                name="from"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>To</Form.Label>
                              <Form.Control
                                name="to"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("to", e.target.value)
                                }
                                value={values.to}
                                type="time"
                                className="custom-select-height"
                              />
                              <ErrorMessage
                                name="to"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Nationality</Form.Label>
                              <Form.Control
                                name="nationality"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("nationality", e.target.value)
                                }
                                value={values.nationality}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Nationality"
                              />
                              <ErrorMessage
                                name="nationality"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col md={3}>
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                name="email"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("email", e.target.value)
                                }
                                value={values.email}
                                type="email"
                                className="custom-select-height"
                                placeholder="Enter Email"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Address</Form.Label>
                              <Form.Control
                                name="address"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("address", e.target.value)
                                }
                                value={values.address}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Address"
                              />
                              <ErrorMessage
                                name="address"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Pincode</Form.Label>
                              <Form.Control
                                name="pincode"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue("pincode", e.target.value)
                                }
                                value={values.pincode}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Pincode"
                              />
                              <ErrorMessage
                                name="pincode"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Label>Lead FollowUp Remark</Form.Label>
                              <Form.Select
                                className="custom-select-height"
                                name="lead_followup_remark"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    "lead_followup_remark",
                                    e.target.value,
                                  )
                                }
                                value={values.lead_followup_remark}
                              >
                                <option value="">
                                  Select Lead FollowUp Remark
                                </option>
                                {/* <option value="Interested">Interested</option>
                                <option value="Not Interested">
                                  Not Interested
                                </option>
                                <option value="Call Later">Call Later</option> */}
                                {leadStatus?.map((item) => (
                                  <option key={item._id} value={item.name}>
                                    {item.name}
                                  </option>
                                ))}
                              </Form.Select>
                              <ErrorMessage
                                name="lead_follwup_remark"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                          </Row>
                        </div>

                        <div className="section-wrapper">
                          <h5
                            className="form-heading p-2 d-flex justify-content-between"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setShowEducationCourseInfo(
                                !showEducationCourseInfo,
                              )
                            }
                          >
                            Education & Course Info
                            {showEducationCourseInfo ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </h5>
                          {showEducationCourseInfo && (
                            <div className="section-content mt-4 mb-5">
                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Country Interested</Form.Label>
                                  <Select
                                    className="custom-select-height"
                                    options={countries?.map((c) => ({
                                      value: c.name,
                                      label: c.name,
                                    }))}
                                    value={
                                      values.country_interested
                                        ? (Array.isArray(
                                            values.country_interested,
                                          )
                                            ? values.country_interested
                                            : [values.country_interested]
                                          ).map((country) => ({
                                            value: country,
                                            label: country,
                                          }))
                                        : []
                                    }
                                    onChange={(selectedOptions) => {
                                      const selected = selectedOptions || [];
                                      const selectedValues = selected.map(
                                        (opt) => opt.value,
                                      );
                                      setFieldValue(
                                        "country_interested",
                                        selectedValues,
                                      );
                                    }}
                                    placeholder="Select Country"
                                    isClearable
                                    isSearchable
                                    isMulti
                                    classNamePrefix="custom-select"
                                    noOptionsMessage={() =>
                                      "No countries available"
                                    }
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
                                  />
                                  {/* <Form.Control
                                    name="country_interested"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "country_interested",
                                        e.target.value
                                      )
                                    }
                                    value={values.country_interested}
                                    type="text"
                                    className="custom-select-height"
                                  /> */}
                                  <ErrorMessage
                                    name="country_intrested"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Course</Form.Label>
                                  <Form.Select
                                    className="custom-select-height"
                                    name="course"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue("course", e.target.value)
                                    }
                                    value={values.course || ""}
                                  >
                                    <option value="">Select</option>
                                    {allcourseData
                                      ?.flatMap((course) =>
                                        course
                                          .split(",")
                                          .map((part) => part.trim()),
                                      )
                                      .map((course, i) => (
                                        <option key={i} value={course}>
                                          {course}
                                        </option>
                                      ))}
                                  </Form.Select>
                                  <ErrorMessage
                                    name="course"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Level</Form.Label>
                                  <Form.Control
                                    name="level"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue("level", e.target.value)
                                    }
                                    value={values.level}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="level"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Budget</Form.Label>
                                  <Form.Control
                                    name="budget"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue("budget", e.target.value)
                                    }
                                    value={values.budget}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="budget"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>

                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Intake</Form.Label>
                                  <Form.Control
                                    name="intake"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue("intake", e.target.value)
                                    }
                                    value={values.intake}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="intake"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>English Proficiency</Form.Label>
                                  <Form.Control
                                    name="english_proficiency"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "english_proficiency",
                                        e.target.value,
                                      )
                                    }
                                    value={values.english_proficiency}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="english_proficiency"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Passport</Form.Label>
                                  <Form.Control
                                    name="passport"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue("passport", e.target.value)
                                    }
                                    value={values.passport}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="passport"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>How Much in Bank</Form.Label>
                                  <Form.Control
                                    name="how_much_in_bank"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "how_much_in_bank",
                                        e.target.value,
                                      )
                                    }
                                    value={values.how_much_in_bank}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="how_much_in_bank"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>

                        <div className="section-wrapper">
                          <h5
                            className="form-heading p-2 d-flex justify-content-between mb-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowFamilyWork(!showFamilyWork)}
                          >
                            Family & Work
                            {showFamilyWork ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </h5>
                          {showFamilyWork && (
                            <div className="section-content mt-4 mb-5">
                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Occupation Father</Form.Label>
                                  <Form.Control
                                    name="occupation_father"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "occupation_father",
                                        e.target.value,
                                      )
                                    }
                                    value={values.occupation_father}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="occupation_father"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Occupation Mother</Form.Label>
                                  <Form.Control
                                    name="occupation_mother"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "occupation_mother",
                                        e.target.value,
                                      )
                                    }
                                    value={values.occupation_mother}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="occupation_mother"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Work Experience</Form.Label>
                                  <Form.Control
                                    name="work_experience"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "work_experience",
                                        e.target.value,
                                      )
                                    }
                                    value={values.work_experience}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="work_experience"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Work Post</Form.Label>
                                  <Form.Control
                                    name="work_post"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue("work_post", e.target.value)
                                    }
                                    value={values.work_post}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="work_post"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>

                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Work Year</Form.Label>
                                  <Form.Control
                                    name="work_year"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue("work_year", e.target.value)
                                    }
                                    value={values.work_year}
                                    type="number"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="work_year"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>

                        <div className="section-wrapper">
                          <h5
                            className="form-heading p-2 d-flex justify-content-between mb-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowVisaInfo(!showVisaInfo)}
                          >
                            Visa Info
                            {showVisaInfo ? <FaChevronUp /> : <FaChevronDown />}
                          </h5>
                          {showVisaInfo && (
                            <div className="section-content mt-4 mb-5">
                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Visited Countries</Form.Label>
                                  <Form.Control
                                    name="visited_countries"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "visited_countries",
                                        e.target.value,
                                      )
                                    }
                                    value={values.visited_countries}
                                    type="text"
                                    placeholder="Comma-separated"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="visited_countries"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Visit Count</Form.Label>
                                  <Form.Control
                                    name="visit_count"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "visit_count",
                                        e.target.value,
                                      )
                                    }
                                    value={values.visit_count}
                                    type="number"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="visit_count"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Visa Type</Form.Label>
                                  <Form.Control
                                    name="visa_type"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue("visa_type", e.target.value)
                                    }
                                    value={values.visa_type}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="visa_type"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Visa Refused</Form.Label>
                                  <div className="d-flex gap-3">
                                    <Form.Check
                                      type="radio"
                                      name="visa_refused"
                                      id="visa_refusedYes"
                                      label="Yes"
                                      value="yes"
                                      onChange={(e) =>
                                        setFieldValue(
                                          "visa_refused",
                                          e.target.value,
                                        )
                                      }
                                      checked={values.visa_refused === "yes"}
                                      className="custom-select-height"
                                    />
                                    <Form.Check
                                      type="radio"
                                      name="visa_refused"
                                      id="visa_refusedNo"
                                      label="No"
                                      value="no"
                                      onChange={(e) =>
                                        setFieldValue(
                                          "visa_refused",
                                          e.target.value,
                                        )
                                      }
                                      checked={values.visa_refused === "no"}
                                      className="custom-select-height"
                                    />
                                  </div>
                                  <ErrorMessage
                                    name="visa_refused"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>

                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Refused Country</Form.Label>
                                  <Form.Control
                                    name="refused_country"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refused_country",
                                        e.target.value,
                                      )
                                    }
                                    value={values.refused_country}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="refused_country"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Refused Times</Form.Label>
                                  <Form.Control
                                    name="refused_times"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refused_times",
                                        e.target.value,
                                      )
                                    }
                                    value={values.refused_times}
                                    type="number"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="refused_times"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Refused Years</Form.Label>
                                  <Form.Control
                                    name="refused_years"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refused_years",
                                        e.target.value.split(","),
                                      )
                                    }
                                    value={values.refused_years}
                                    type="text"
                                    className="custom-select-height"
                                    placeholder="e.g., 2020, 2022"
                                  />
                                  <ErrorMessage
                                    name="refused_years"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Refused Visa Type</Form.Label>
                                  <Form.Control
                                    name="refused_visa_type"
                                    as={Form.Control}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refused_visa_type",
                                        e.target.value,
                                      )
                                    }
                                    value={values.refused_visa_type}
                                    type="text"
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="refused_visa_type"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>

                        <div className="section-wrapper">
                          <h5
                            className="form-heading p-2 d-flex justify-content-between mb-3"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setShowEducationEvaluation(
                                !showEducationEvaluation,
                              )
                            }
                          >
                            Education Evaluation
                            <div className="d-flex gap-3">
                              {showEducationEvaluation ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </div>
                          </h5>
                          {showEducationEvaluation && (
                            <div className="section-content mt-4 mb-5">
                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Select Exam</Form.Label>
                                  <Form.Select
                                    name={`education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].test_name`}
                                    className="custom-select-height"
                                    value={
                                      values.education_evaluation[
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      ]?.test_name || ""
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_evaluation[${
                                          edit.educationEvaluation
                                            ? edit.educationEvaluationIndex
                                            : index.educationEvaluation
                                        }].test_name`,
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Select Exam</option>
                                    {allExamData?.map((c, i) => (
                                      <option key={i} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Listening Score</Form.Label>
                                  <Form.Control
                                    type="number"
                                    as={Form.Control}
                                    name={`education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.listen`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_evaluation[${
                                          edit.educationEvaluation
                                            ? edit.educationEvaluationIndex
                                            : index.educationEvaluation
                                        }].scores.listen`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_evaluation[
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      ]?.scores?.listen || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Reading Score</Form.Label>
                                  <Form.Control
                                    type="number"
                                    as={Form.Control}
                                    name={`education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.read`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_evaluation[${
                                          edit.educationEvaluation
                                            ? edit.educationEvaluationIndex
                                            : index.educationEvaluation
                                        }].scores.read`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_evaluation[
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      ]?.scores?.read || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Writing Score</Form.Label>
                                  <Form.Control
                                    type="number"
                                    as={Form.Control}
                                    name={`education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.write`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_evaluation[${
                                          edit.educationEvaluation
                                            ? edit.educationEvaluationIndex
                                            : index.educationEvaluation
                                        }].scores.write`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_evaluation[
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      ]?.scores?.write || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                <Col md={3} className="mt-3">
                                  <Form.Label>Speaking Score</Form.Label>
                                  <Form.Control
                                    type="number"
                                    as={Form.Control}
                                    name={`education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.speak`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_evaluation[${
                                          edit.educationEvaluation
                                            ? edit.educationEvaluationIndex
                                            : index.educationEvaluation
                                        }].scores.speak`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_evaluation[
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      ]?.scores?.speak || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                <Col md={3} className="mt-3">
                                  <Form.Label>Overall Score</Form.Label>
                                  <Form.Control
                                    type="number"
                                    as={Form.Control}
                                    name={`education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.overall`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_evaluation[${
                                          edit.educationEvaluation
                                            ? edit.educationEvaluationIndex
                                            : index.educationEvaluation
                                        }].scores.overall`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_evaluation[
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      ]?.scores?.overall || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                {values?.education_evaluation[
                                  edit.educationEvaluation
                                    ? edit.educationEvaluationIndex
                                    : index.educationEvaluation
                                ]?.test_name === "P.T.E." && (
                                  <Col md={3} className="mt-3">
                                    <Form.Label>DUOLINGO Score</Form.Label>
                                    <Form.Control
                                      type="number"
                                      as={Form.Control}
                                      name={`education_evaluation[${
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      }].scores.duolingoScore`}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `education_evaluation[${
                                            edit.educationEvaluation
                                              ? edit.educationEvaluationIndex
                                              : index.educationEvaluation
                                          }].scores.duolingoScore`,
                                          e.target.value,
                                        )
                                      }
                                      value={
                                        values.education_evaluation[
                                          edit.educationEvaluation
                                            ? edit.educationEvaluationIndex
                                            : index.educationEvaluation
                                        ]?.scores?.duolingoScore || ""
                                      }
                                      className="custom-select-height"
                                    />
                                  </Col>
                                )}
                                <Col md={3} className="mt-auto">
                                  <button
                                    type="button"
                                    className="w-100 custom-select-height text-white"
                                    style={{ backgroundColor: "#3b3665" }}
                                    onClick={() => {
                                      if (edit.educationEvaluation) {
                                        handleEditEvaluation(values);
                                      } else {
                                        handleEducationSubmit(values);
                                      }
                                    }}
                                  >
                                    <FaPlus className="plus-button mx-2" />
                                    {edit.educationEvaluation
                                      ? "Update"
                                      : "Add"}{" "}
                                    Education Evaluation
                                  </button>
                                </Col>
                                {formData?.education_evaluation?.length > 0 && (
                                  <div className="mt-5">
                                    <h5>Education Evaluation Data :</h5>
                                    <div className="table-responsive">
                                      <Table className="text-nowrap border">
                                        <thead>
                                          <tr>
                                            <th scope="col">NO.</th>
                                            <th scope="col">Test Name</th>
                                            <th scope="col">Listening</th>
                                            <th scope="col">Reading</th>
                                            <th scope="col">Writing</th>
                                            <th scope="col">Speaking</th>
                                            <th scope="col">Overall</th>
                                            <th scope="col">DUOLINGO</th>
                                            <th scope="col">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {formData?.education_evaluation?.map(
                                            (data, i) => (
                                              <tr
                                                key={i}
                                                className="custom-table-row"
                                              >
                                                <td>{i + 1}</td>
                                                <td>
                                                  {data?.test_name || "N/A"}
                                                </td>
                                                <td>
                                                  {data?.scores?.listen ||
                                                    "N/A"}
                                                </td>
                                                <td>
                                                  {data?.scores?.read || "N/A"}
                                                </td>
                                                <td>
                                                  {data?.scores?.write || "N/A"}
                                                </td>
                                                <td>
                                                  {data?.scores?.speak || "N/A"}
                                                </td>
                                                <td>
                                                  {data?.scores?.overall ||
                                                    "N/A"}
                                                </td>
                                                <td>
                                                  {data?.scores
                                                    ?.duolingoScore || "N/A"}
                                                </td>
                                                <td>
                                                  <div className="d-flex">
                                                    <span className="icon-border edit-icon">
                                                      <EditIcon
                                                        onClick={() =>
                                                          setEdit((prev) => ({
                                                            ...prev,
                                                            educationEvaluation: true,
                                                            educationEvaluationIndex:
                                                              i || 0,
                                                          }))
                                                        }
                                                      />
                                                    </span>
                                                    <span className="icon-border delete-icon ms-2">
                                                      <DeleteIcon
                                                        onClick={() =>
                                                          handleDeleteEvaluation(
                                                            i,
                                                          )
                                                        }
                                                      />
                                                    </span>
                                                  </div>
                                                </td>
                                              </tr>
                                            ),
                                          )}
                                        </tbody>
                                      </Table>
                                    </div>
                                  </div>
                                )}
                              </Row>
                            </div>
                          )}
                        </div>

                        <div className="section-wrapper">
                          <h5
                            className="form-heading p-2 d-flex justify-content-between mb-3"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setShowEducationDetails(!showEducationDetails)
                            }
                          >
                            Education Details
                            <div className="d-flex gap-3">
                              {showEducationDetails ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </div>
                          </h5>
                          {showEducationDetails && (
                            <div className="section-content mt-4 mb-5">
                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Select Degree</Form.Label>
                                  <Form.Select
                                    as={Form.Control}
                                    name={`education_details[${
                                      edit.educationDetails
                                        ? edit.educationDetailsIndex
                                        : index.educationDetails
                                    }].degree`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_details[${
                                          edit.educationDetails
                                            ? edit.educationDetailsIndex
                                            : index.educationDetails
                                        }].degree`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_details[
                                        edit.educationDetails
                                          ? edit.educationDetailsIndex
                                          : index.educationDetails
                                      ]?.degree || ""
                                    }
                                    className="custom-select-height"
                                  >
                                    <option value="">Select Degree</option>
                                    {allDegreeData?.map((c, i) => (
                                      <option key={i} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Stream</Form.Label>
                                  <Form.Control
                                    type="text"
                                    as={Form.Control}
                                    name={`education_details[${
                                      edit.educationDetails
                                        ? edit.educationDetailsIndex
                                        : index.educationDetails
                                    }].stream`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_details[${
                                          edit.educationDetails
                                            ? edit.educationDetailsIndex
                                            : index.educationDetails
                                        }].stream`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_details[
                                        edit.educationDetails
                                          ? edit.educationDetailsIndex
                                          : index.educationDetails
                                      ]?.stream || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>
                                    Medium of Instruction (MOI)
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    as={Form.Control}
                                    name={`education_details[${
                                      edit.educationDetails
                                        ? edit.educationDetailsIndex
                                        : index.educationDetails
                                    }].moi`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_details[${
                                          edit.educationDetails
                                            ? edit.educationDetailsIndex
                                            : index.educationDetails
                                        }].moi`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_details[
                                        edit.educationDetails
                                          ? edit.educationDetailsIndex
                                          : index.educationDetails
                                      ]?.moi || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Year</Form.Label>
                                  <Form.Control
                                    type="number"
                                    as={Form.Control}
                                    name={`education_details[${
                                      edit.educationDetails
                                        ? edit.educationDetailsIndex
                                        : index.educationDetails
                                    }].year`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_details[${
                                          edit.educationDetails
                                            ? edit.educationDetailsIndex
                                            : index.educationDetails
                                        }].year`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_details[
                                        edit.educationDetails
                                          ? edit.educationDetailsIndex
                                          : index.educationDetails
                                      ]?.year || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                <Col md={3} className="mt-3">
                                  <Form.Label>Score</Form.Label>
                                  <Form.Control
                                    type="text"
                                    as={Form.Control}
                                    name={`education_details[${
                                      edit.educationDetails
                                        ? edit.educationDetailsIndex
                                        : index.educationDetails
                                    }].score`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_details[${
                                          edit.educationDetails
                                            ? edit.educationDetailsIndex
                                            : index.educationDetails
                                        }].score`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_details[
                                        edit.educationDetails
                                          ? edit.educationDetailsIndex
                                          : index.educationDetails
                                      ]?.score || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                <Col md={3} className="mt-3">
                                  <Form.Label>Institution</Form.Label>
                                  <Form.Control
                                    type="text"
                                    as={Form.Control}
                                    name={`education_details[${
                                      edit.educationDetails
                                        ? edit.educationDetailsIndex
                                        : index.educationDetails
                                    }].institution`}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `education_details[${
                                          edit.educationDetails
                                            ? edit.educationDetailsIndex
                                            : index.educationDetails
                                        }].institution`,
                                        e.target.value,
                                      )
                                    }
                                    value={
                                      values.education_details[
                                        edit.educationDetails
                                          ? edit.educationDetailsIndex
                                          : index.educationDetails
                                      ]?.institution || ""
                                    }
                                    className="custom-select-height"
                                  />
                                </Col>
                                {values?.education_details[
                                  edit.educationDetails
                                    ? edit.educationDetailsIndex
                                    : index.educationDetails
                                ]?.degree === "BACHELOR'S" && (
                                  <Col md={3} className="mt-3">
                                    <Form.Label>Backlogs</Form.Label>
                                    <Form.Control
                                      type="number"
                                      as={Form.Control}
                                      name={`education_details[${
                                        edit.educationDetails
                                          ? edit.educationDetailsIndex
                                          : index.educationDetails
                                      }].backlogs`}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `education_details[${
                                            edit.educationDetails
                                              ? edit.educationDetailsIndex
                                              : index.educationDetails
                                          }].backlogs`,
                                          e.target.value,
                                        )
                                      }
                                      value={
                                        values.education_details[
                                          edit.educationDetails
                                            ? edit.educationDetailsIndex
                                            : index.educationDetails
                                        ]?.backlogs || ""
                                      }
                                      className="custom-select-height"
                                    />
                                  </Col>
                                )}
                                <Col md={3} className="mt-auto">
                                  <button
                                    type="button"
                                    className="w-100 custom-select-height text-white"
                                    style={{ backgroundColor: "#3b3665" }}
                                    onClick={() => {
                                      if (edit.educationEvaluation) {
                                        handleEducationDetailedit(values);
                                      } else {
                                        handleEducatiDetailonSubmit(values);
                                      }
                                    }}
                                  >
                                    <FaPlus className="plus-button mx-2" /> Add
                                    Education Details
                                  </button>
                                </Col>
                              </Row>
                              {formData?.education_details?.length > 0 && (
                                <div className="mt-5">
                                  <h5>Education Evaluation Data:</h5>
                                  <div className="table-responsive">
                                    <Table className="text-nowrap border">
                                      <thead>
                                        <tr>
                                          <th scope="col">NO.</th>
                                          <th scope="col">Degree</th>
                                          <th scope="col">Stream</th>
                                          <th scope="col">MOI</th>
                                          <th scope="col">Year</th>
                                          <th scope="col">Score</th>
                                          <th scope="col">Institution</th>
                                          <th scope="col">Backlogs</th>
                                          <th scope="col">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {formData?.education_details?.map(
                                          (data, i) => (
                                            <tr
                                              key={i}
                                              className="custom-table-row"
                                            >
                                              <td>{i + 1}</td>
                                              <td>{data?.degree || "N/A"}</td>
                                              <td>
                                                {data?.institution || "N/A"}
                                              </td>
                                              <td>{data?.year || "N/A"}</td>
                                              <td>{data?.stream || "N/A"}</td>
                                              <td>{data?.score || "N/A"}</td>
                                              <td>
                                                {data?.institution || "N/A"}
                                              </td>
                                              <td>{data?.backlogs || "N/A"}</td>
                                              <td>
                                                <div className="d-flex">
                                                  <span className="icon-border edit-icon">
                                                    <EditIcon
                                                      onClick={() =>
                                                        setEdit((prev) => ({
                                                          ...prev,
                                                          educationDetails: true,
                                                          educationDetailsIndex:
                                                            i || 0,
                                                        }))
                                                      }
                                                    />
                                                  </span>
                                                  <span className="icon-border delete-icon ms-2">
                                                    <DeleteIcon
                                                      onClick={() =>
                                                        handleDeleteEvaluationDetail(
                                                          i,
                                                        )
                                                      }
                                                    />
                                                  </span>
                                                </div>
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                      </tbody>
                                    </Table>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="section-wrapper">
                          <h5
                            className="form-heading p-2 d-flex justify-content-between mb-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowReferFriend(!showReferFriend)}
                          >
                            Refer a Friend
                            {showReferFriend ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </h5>
                          {showReferFriend && (
                            <div className="section-content mt-4 mb-5">
                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Friend Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="refer_friend.name"
                                    value={values.refer_friend?.name || ""}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refer_friend.name",
                                        e.target.value,
                                      )
                                    }
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="refer_friend.name"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Friend Phone</Form.Label>
                                  <PhoneInput
                                    country={"in"}
                                    value={values.refer_friend?.phone || ""}
                                    onChange={(phone, data) => {
                                      const dialCode = data.dialCode
                                        ? `+${data.dialCode}`
                                        : "";
                                      const formattedPhone =
                                        `${dialCode} ${phone.replace(
                                          data.dialCode,
                                          "",
                                        )}`.trim();
                                      setFieldValue(
                                        "refer_friend.phone",
                                        formattedPhone,
                                      );
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
                                  <ErrorMessage
                                    name="refer_friend.phone"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Friend Email</Form.Label>
                                  <Form.Control
                                    type="email"
                                    name="refer_friend.email"
                                    value={values.refer_friend?.email || ""}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refer_friend.email",
                                        e.target.value,
                                      )
                                    }
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="refer_friend.email"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Label>Suggested Countries</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="refer_friend.suggested_countries"
                                    value={
                                      values.refer_friend
                                        ?.suggested_countries || ""
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refer_friend.suggested_countries",
                                        e.target.value,
                                      )
                                    }
                                    className="custom-select-height"
                                    placeholder="Comma-separated"
                                  />
                                  <ErrorMessage
                                    name="refer_friend.suggested_countries"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3} className="mt-3">
                                  <Form.Label>Suggested Courses</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="refer_friend.courses"
                                    value={values.refer_friend?.courses || ""}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refer_friend.courses",
                                        e.target.value,
                                      )
                                    }
                                    className="custom-select-height"
                                    placeholder="Comma-separated"
                                  />
                                  <ErrorMessage
                                    name="refer_friend.courses"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                                <Col md={3} className="mt-3">
                                  <Form.Label>Response</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="refer_friend.response"
                                    value={values.refer_friend?.response || ""}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "refer_friend.response",
                                        e.target.value,
                                      )
                                    }
                                    className="custom-select-height"
                                  />
                                  <ErrorMessage
                                    name="refer_friend.response"
                                    component="div"
                                    className="text-danger"
                                  />
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>

                        <div className="section-wrapper">
                          <h5
                            className="form-heading p-2 d-flex justify-content-between mb-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowReviews(!showReviews)}
                          >
                            Reviews
                            {showReviews ? <FaChevronUp /> : <FaChevronDown />}
                          </h5>

                          {showReviews && (
                            <div className="section-content mt-4 mb-5">
                              <Row className="mb-3">
                                <Col md={3}>
                                  <Form.Label>Reception Greetings</Form.Label>
                                  <Form.Select
                                    as={Form.Control}
                                    name="reviews.reception_greetings"
                                    className="custom-select-height"
                                    value={
                                      values.reviews?.reception_greetings || ""
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        "reviews.reception_greetings",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Average</option>
                                  </Form.Select>
                                </Col>

                                <Col md={3}>
                                  <Form.Label>
                                    Counsellor Explanation
                                  </Form.Label>
                                  <Form.Select
                                    as={Form.Control}
                                    name="reviews.counsellor_explanation"
                                    className="custom-select-height"
                                    value={
                                      values.reviews?.counsellor_explanation ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        "reviews.counsellor_explanation",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Average</option>
                                  </Form.Select>
                                </Col>

                                <Col md={3}>
                                  <Form.Label>Hospitality</Form.Label>
                                  <Form.Select
                                    as={Form.Control}
                                    name="reviews.hospitality"
                                    className="custom-select-height"
                                    value={values.reviews?.hospitality || ""}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "reviews.hospitality",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Average</option>
                                  </Form.Select>
                                </Col>

                                <Col md={3}>
                                  <Form.Label>Hygiene & Cleanliness</Form.Label>
                                  <Form.Select
                                    as={Form.Control}
                                    name="reviews.hygiene_cleanliness"
                                    className="custom-select-height"
                                    value={
                                      values.reviews?.hygiene_cleanliness || ""
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        "reviews.hygiene_cleanliness",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Average</option>
                                  </Form.Select>
                                </Col>

                                <Col md={3} className="mt-3">
                                  <Form.Label>Team Response</Form.Label>
                                  <Form.Select
                                    as={Form.Control}
                                    name="reviews.team_response"
                                    className="custom-select-height"
                                    value={values.reviews?.team_response || ""}
                                    onChange={(e) =>
                                      setFieldValue(
                                        "reviews.team_response",
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Average</option>
                                  </Form.Select>
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>

                        {isEdit && (
                          <div className="mt-4 mb-4 section-wrapper">
                            <h5
                              className="form-heading p-2 d-flex justify-content-between mt-4 mb-3"
                              style={{ cursor: "pointer" }}
                              onClick={() => setShowHistory(!showHistory)}
                            >
                              History
                              {showHistory ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </h5>
                            {showHistory && (
                              <div className="table-responsive lead-table">
                                <Table className="text-nowrap border">
                                  <thead>
                                    <tr>
                                      <th scope="col">Created Date</th>
                                      <th scope="col">Name</th>
                                      <th scope="col">Phone</th>
                                      <th scope="col">City</th>
                                      <th scope="col">Lead Form</th>
                                      <th scope="col">Lead Assign</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {editHistoryData?.length > 0 ? (
                                      editHistoryData?.map((item, index) => (
                                        <tr key={index}>
                                          <td className="fw-semibold">
                                            {new Date(
                                              item.createdAt,
                                            ).toLocaleDateString(`en-GB`, {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                              timeZone: "UTC",
                                            })}
                                          </td>
                                          <td>
                                            {item?.name ? item?.name : "-"}
                                          </td>
                                          <td>
                                            {item?.phone ? item?.phone : "-"}
                                          </td>
                                          <td>
                                            {item?.city ? item?.city : "-"}
                                          </td>
                                          <td>
                                            {item?.lead_form
                                              ? item?.lead_form
                                              : "-"}
                                          </td>
                                          <td>
                                            {item?.lead_assign
                                              ? item?.lead_assign?.name
                                              : "-"}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="8" className="text-center">
                                          No Data Found
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Footer Buttons */}
                        <div className="text-end mt-4">
                          <Button
                            variant="primary"
                            className="custom-select-height"
                            type="submit"
                          >
                            {isEdit ? "Update" : "Add"}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Modal.Body>
              </Modal>

              <Modal
                show={showViewModal}
                onHide={handleCloseViewModal}
                size="xl"
                centered
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>View Lead Details</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseViewModal}
                  />
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {getLeadDataById?.data ? (
                    <div>
                      <h5 className="mb-3">Lead Details</h5>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Name:</strong>{" "}
                          {getLeadDataById?.data?.name || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Email:</strong>{" "}
                          {getLeadDataById?.data?.email || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Phone:</strong>{" "}
                          {getLeadDataById?.data?.phone || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>City:</strong>{" "}
                          {getLeadDataById?.data?.city || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Alternate Contact:</strong>{" "}
                          {getLeadDataById?.data?.alternate_contact || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Gender:</strong>{" "}
                          {getLeadDataById?.data?.gender || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Date of Birth:</strong>{" "}
                          {getLeadDataById?.data?.dateofbirth
                            ? new Date(
                                getLeadDataById?.data?.dateofbirth,
                              ).toLocaleDateString()
                            : "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Age:</strong>{" "}
                          {getLeadDataById?.data?.age || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Address:</strong>{" "}
                          {getLeadDataById?.data?.address || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Nationality:</strong>{" "}
                          {getLeadDataById?.data?.nationality || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Pincode:</strong>{" "}
                          {getLeadDataById?.data?.pincode || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Comments:</strong>{" "}
                          {getLeadDataById?.data?.comments || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Office Use Only:</strong>{" "}
                          {getLeadDataById?.data?.office_use_only || "N/A"}
                        </Col>
                      </Row>

                      <h5 className="mt-4 mb-3">Follow-up Details</h5>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Next Follow-up:</strong>{" "}
                          {getLeadDataById?.data?.next_follow_up
                            ? new Date(
                                getLeadDataById?.data?.next_follow_up,
                              ).toLocaleDateString()
                            : "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>From:</strong>{" "}
                          {getLeadDataById?.data?.from || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>To:</strong>{" "}
                          {getLeadDataById?.data?.to || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Lead Follow-up Remark:</strong>{" "}
                          {getLeadDataById?.data?.lead_followup_remark || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Lead Status:</strong>{" "}
                          {getLeadDataById?.data?.lead_status || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Lead Form:</strong>{" "}
                          {getLeadDataById?.data?.lead_form || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Lead Assign:</strong>{" "}
                          {getLeadDataById?.data?.lead_assign_name || "N/A"}
                        </Col>
                      </Row>

                      <h5 className="mt-4 mb-3">Inquiry Info</h5>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Inquiry For:</strong>{" "}
                          {getLeadDataById?.data?.inquiry_for || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Source of Reference:</strong>{" "}
                          {getLeadDataById?.data?.source_of_reference || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Form Type:</strong>{" "}
                          {getLeadDataById?.data?.form_type || "N/A"}
                        </Col>
                      </Row>

                      <h5 className="mt-4 mb-3">Education & Course Info</h5>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Country Interested:</strong>{" "}
                          {getLeadDataById?.data?.country_interested
                            ? getLeadDataById.data.country_interested
                                .map((country) => country)
                                .join(", ")
                            : "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Course:</strong>{" "}
                          {getLeadDataById?.data?.course || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Level:</strong>{" "}
                          {getLeadDataById?.data?.level || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Budget:</strong>{" "}
                          {getLeadDataById?.data?.budget || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>How Much in Bank:</strong>{" "}
                          {getLeadDataById?.data?.how_much_in_bank || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>English Proficiency:</strong>{" "}
                          {getLeadDataById?.data?.english_proficiency || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Passport:</strong>{" "}
                          {getLeadDataById?.data?.passport || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Intake:</strong>{" "}
                          {getLeadDataById?.data?.intake || "N/A"}
                        </Col>
                      </Row>

                      <h5 className="mt-4 mb-3">Family & Work</h5>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Father's Occupation:</strong>{" "}
                          {getLeadDataById?.data?.occupation_father || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Mother's Occupation:</strong>{" "}
                          {getLeadDataById?.data?.occupation_mother || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Work Experience:</strong>{" "}
                          {getLeadDataById?.data?.work_experience || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Work Post:</strong>{" "}
                          {getLeadDataById?.data?.work_post || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Work Year:</strong>{" "}
                          {getLeadDataById?.data?.work_year || "N/A"}
                        </Col>
                      </Row>

                      <h5 className="mt-4 mb-3">Visa Info</h5>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Visited Countries:</strong>{" "}
                          {getLeadDataById?.data?.visited_countries || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Visit Count:</strong>{" "}
                          {getLeadDataById?.data?.visit_count || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Visa Type:</strong>{" "}
                          {getLeadDataById?.data?.visa_type || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Visa Refused:</strong>{" "}
                          {getLeadDataById?.data?.visa_refused ? "Yes" : "No"}
                        </Col>
                        <Col md={4}>
                          <strong>Refused Country:</strong>{" "}
                          {getLeadDataById?.data?.refused_country || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Refused Times:</strong>{" "}
                          {getLeadDataById?.data?.refused_times || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Refused Years:</strong>{" "}
                          {getLeadDataById?.data?.refused_years?.length > 0
                            ? getLeadDataById?.data?.refused_years.join(", ")
                            : "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Refused Visa Type:</strong>{" "}
                          {getLeadDataById?.data?.refused_visa_type || "N/A"}
                        </Col>
                      </Row>

                      <h5 className="mt-4 mb-3">Education Evaluation</h5>
                      {getLeadDataById?.data?.education_evaluation?.length >
                      0 ? (
                        <Table className="text-nowrap border">
                          <thead>
                            <tr>
                              <th>Test Name</th>
                              <th>Listening</th>
                              <th>Reading</th>
                              <th>Writing</th>
                              <th>Speaking</th>
                              <th>Overall</th>
                              <th>Duolingo Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getLeadDataById?.data?.education_evaluation?.map(
                              (data, index) => (
                                <tr key={index}>
                                  <td>{data.test_name || "N/A"}</td>
                                  <td>{data.scores?.listen || "N/A"}</td>
                                  <td>{data.scores?.read || "N/A"}</td>
                                  <td>{data.scores?.write || "N/A"}</td>
                                  <td>{data.scores?.speak || "N/A"}</td>
                                  <td>{data.scores?.overall || "N/A"}</td>
                                  <td>{data.scores?.duolingoScore || "N/A"}</td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </Table>
                      ) : (
                        <p>No education evaluation data available.</p>
                      )}

                      <h5 className="mt-4 mb-3">Education Details</h5>
                      {getLeadDataById?.data?.education_details?.length > 0 ? (
                        <Table className="text-nowrap border">
                          <thead>
                            <tr>
                              <th>Degree</th>
                              <th>Stream</th>
                              <th>MOI</th>
                              <th>Year</th>
                              <th>Score</th>
                              <th>Institution</th>
                              <th>Backlogs</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getLeadDataById?.data?.education_details.map(
                              (detail, index) => (
                                <tr key={index}>
                                  <td>{detail.degree || "N/A"}</td>
                                  <td>{detail.stream || "N/A"}</td>
                                  <td>{detail.moi || "N/A"}</td>
                                  <td>{detail.year || "N/A"}</td>
                                  <td>{detail.score || "N/A"}</td>
                                  <td>{detail.institution || "N/A"}</td>
                                  <td>{detail.backlogs || "N/A"}</td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </Table>
                      ) : (
                        <p>No education details available.</p>
                      )}

                      <h5 className="mt-4 mb-3">Refer a Friend</h5>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Name:</strong>{" "}
                          {getLeadDataById?.data?.refer_friend?.name || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Phone:</strong>{" "}
                          {getLeadDataById?.data?.refer_friend?.phone || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Email:</strong>{" "}
                          {getLeadDataById?.data?.refer_friend?.email || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Suggested Countries:</strong>{" "}
                          {getLeadDataById?.data?.refer_friend
                            ?.suggested_countries || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Courses:</strong>{" "}
                          {getLeadDataById?.data?.refer_friend?.courses ||
                            "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Response:</strong>{" "}
                          {getLeadDataById?.data?.refer_friend?.response ||
                            "N/A"}
                        </Col>
                      </Row>

                      <h5 className="mt-4 mb-3">Reviews</h5>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Reception Greetings:</strong>{" "}
                          {getLeadDataById?.data?.reviews
                            ?.reception_greetings || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Counsellor Explanation:</strong>{" "}
                          {getLeadDataById?.data?.reviews
                            ?.counsellor_explanation || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Hospitality:</strong>{" "}
                          {getLeadDataById?.data?.reviews?.hospitality || "N/A"}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col md={4}>
                          <strong>Hygiene & Cleanliness:</strong>{" "}
                          {getLeadDataById?.data?.reviews
                            ?.hygiene_cleanliness || "N/A"}
                        </Col>
                        <Col md={4}>
                          <strong>Team Response:</strong>{" "}
                          {getLeadDataById?.data?.reviews?.team_response ||
                            "N/A"}
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <p>Loading lead data...</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="link"
                    className="btn border-primary text-primary text-decoration-none"
                    onClick={handleCloseViewModal}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              {openModal && (
                <Modal
                  show={openModal}
                  onHide={() => {
                    setOpenModal(false);
                    setPreferredCountry("");
                  }}
                >
                  <Modal.Header className="form-main-heading">
                    <Modal.Title>Convert to Application</Modal.Title>
                    <AiOutlineClose
                      size={20}
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => setOpenModal(false)}
                    />
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group controlId="preferredCountry">
                      <Form.Label>Preferred Country</Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        value={preferredCountry}
                        onChange={(e) => setPreferredCountry(e.target.value)}
                        placeholder="Enter preferred country"
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="link"
                      className="btn border-primary text-primary text-decoration-none"
                      onClick={() => {
                        setOpenModal(false);
                        setPreferredCountry("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleConvertToApplication(
                          selectedLead,
                          preferredCountry,
                        );
                        setOpenModal(false);
                      }}
                    >
                      Confirm
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}

              <div className="table-responsive lead-table">
                <Table className="text-nowrap border">
                  <thead>
                    <tr>
                      {/* <th scope="col" style={{ minWidth: 'auto' }}></th> */}
                      <th scope="col" className="dynamic-width">
                        Created date
                      </th>
                      <th scope="col" className="dynamic-width">
                        Created time
                      </th>
                      <th scope="col" className="dynamic-width">
                        Name
                      </th>
                      <th scope="col" className="dynamic-width">
                        Phone
                      </th>
                      <th scope="col" className="dynamic-width">
                        City
                      </th>
                      <th scope="col" className="dynamic-width">
                        Lead Form
                      </th>
                      <th scope="col" className="dynamic-width">
                        Lead Assign
                      </th>
                      <th scope="col" className="text-center dynamic-width">
                        Lead Status
                      </th>
                      <th scope="col" className="dynamic-width">
                        CREATED BY
                      </th>
                      <th scope="col" className="dynamic-width">
                        UPDATED BY
                      </th>
                      {/* <th scope="col">Action</th> */}
                      {(canUpdate || canDelete) && (
                        <th
                          scope="col"
                          className="sticky-col-right-last dynamic-width"
                        >
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getLeadData?.data?.length > 0 ? (
                      getLeadData.data?.map((item, index) => (
                        <tr className="custom-table-row" key={item._id}>
                          <td className="fw-semibold dynamic-width">
                            {new Date(item.createdAt).toLocaleDateString(
                              `en-GB`,
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC",
                              },
                            )}
                          </td>
                          <td className="fw-semibold dynamic-width">
                            {new Date(item.createdAt).toLocaleString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true, // Use false if you prefer 24-hour format
                              //   timeZone: "UTC",
                            })}
                          </td>
                          <td className="dynamic-width">{item.name}</td>
                          <td className="dynamic-width">{item.phone}</td>
                          <td className="dynamic-width">{item.city || "-"}</td>
                          <td className="dynamic-width">
                            {item?.lead_form || "-"}
                          </td>
                          <td className="dynamic-width">
                            {item?.lead_assign_name ||
                              item?.lead_assign?.name ||
                              "-"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span
                              style={{
                                backgroundColor: getStatusColor(
                                  item.lead_status,
                                ),
                                color: "#fff",
                              }}
                              className={`lead-status-data ${item.lead_status.toLowerCase()}`}
                              onClick={() => {
                                if (canUpdate) {
                                  handleEdit(item);
                                }
                              }}
                            >
                              {item.lead_status}
                            </span>
                          </td>
                          {/* <td
                            className="lead-status-data"
                            style={{
                              backgroundColor: getStatusColor(item.lead_status),
                              color: "#fff",
                            }}
                            onClick={() => handleEdit(item)}
                          >
                            {item.lead_status}
                          </td> */}
                          {/* <div className="lead-status">
                            <td
                              className="lead-status-data"
                              style={{
                                backgroundColor: getStatusColor(
                                  item.lead_status
                                ),
                                color: "#fff",
                                borderRadius: "4px",
                                textAlign: "center",
                                padding: "8px",
                              }}
                              onClick={() => handleEdit(item)}
                            >
                              {item.lead_status}
                            </td>
                          </div> */}
                          <td className="dynamic-width">
                            {item?.createdByName ? item?.createdByName : "-"}
                          </td>
                          <td className="dynamic-width">
                            {item?.updatedByName ? item?.updatedByName : "-"}
                          </td>
                          <td className="sticky-col-right-last dynamic-width-data">
                            <div className="d-flex">
                              <IconButton
                                aria-label="more"
                                aria-controls={`menu-${index}`}
                                aria-haspopup="true"
                                onClick={(e) => {
                                  setOpenDropdown(
                                    openDropdown === index ? null : index,
                                  );
                                  setAnchorEl(e.currentTarget);
                                }}
                              >
                                <MoreVertIcon className="three-dots-icon" />
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
                                    boxShadow:
                                      "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                  },
                                }}
                                style={{ marginLeft: "-15px" }}
                              >
                                {canUpdate && (
                                  <MenuItem
                                    onClick={() => {
                                      handleEdit(item);
                                      setOpenDropdown(null);
                                      handleEditHistory(item);
                                    }}
                                  >
                                    <EditIcon
                                      fontSize="small"
                                      sx={{ mr: 1 }}
                                      className="edit-icon"
                                    />
                                    <span className="edit-action-text">
                                      Edit
                                    </span>
                                  </MenuItem>
                                )}
                                {canDelete && (
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setShowDeleteModal(true);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <DeleteIcon
                                      fontSize="small"
                                      sx={{ mr: 1 }}
                                      className="delete-icon"
                                    />
                                    <span className="delete-action-text">
                                      Delete
                                    </span>
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
                                        setPreferredCountry("");
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
                              </Menu>
                            </div>
                          </td>

                          <Modal
                            className="leads-modal"
                            show={showDeleteModal}
                            onHide={() => setShowDeleteModal(false)}
                            centered
                          >
                            <Modal.Header
                              // style={{
                              //   backgroundColor: "#f16d75",
                              //   color: "white",
                              //   borderBottom: "none",
                              // }}
                              className="form-main-heading"
                            >
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
                                <i className="bi bi-exclamation-triangle-fill"></i>{" "}
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
                          {/* <td className="sticky-col-right-last">
                            <div className="d-flex">
                              <span
                                className="icon-border edit-icon"
                                onClick={() =>
                                  handleEdit(item?._id, item?.lead_role)
                                }
                              >
                                <EditIcon />
                              </span>
                              <span
                                className="icon-border view-icon ms-2"
                                onClick={() => handleView(item?._id)}
                              >
                                <VisibilityIcon />
                              </span>
                              <span
                                className="icon-border delete-icon ms-2"
                                onClick={() => handleDelete(item?._id)}
                              >
                                <DeleteIcon />
                              </span>
                            </div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr className="no-data-row">
                        <td>
                          <div className="no-data-text">
                            {!canRead
                              ? "You do not have permission to view this Data"
                              : "No data available"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && getLeadData?.data?.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => changePage(page)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddLeads;
