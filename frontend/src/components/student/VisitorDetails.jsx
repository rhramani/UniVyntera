import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import { FaCheck } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FaTrashAlt } from "react-icons/fa";

import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import { getAllProgressbar } from "../../redux/actions/Master/Progressbar.action";
import { getOneApplicationStatus } from "../../redux/actions/Student/ApplicationStatus.action";

import EducationSection from "./studentDetails/EducationSection";
import LanguageEntranceExam from "./studentDetails/LanguageEntranceExam";
import AptitudeExamSection from "./studentDetails/AptitudeExamSection";
import WorkExperience from "./studentDetails/WorkExperience";
import DocumentSection from "./studentDetails/DocumentSection";
import VisaUserAllocationSection from "./studentDetails/visaApplication/VisaUserAllocationSection";
import DVisaApply from "./studentDetails/visaApplication/DVisaApply";
import BiometricsSection from "./studentDetails/visaApplication/BiometricsSection";
import VisaFeePayment from "./studentDetails/visaApplication/VisaFeePayment";
import SupplementaryAdditionalRequirement from "./studentDetails/visaApplication/SupplementaryAdditionalRequirement";
import VisaOutcomeTracking from "./studentDetails/visaApplication/VisaOutcomeTracking";
import RpDecision from "./studentDetails/visaApplication/RpDecision";
import ReapplicationAppeal from "./studentDetails/visaApplication/ReapplicationAppeal";

import LoadMoreButton from "../commonComponents/LoadMoreButton";

import { decryptData, encryptData } from "../../utils/encryptionUtils";
import { BASEURL, REACT_APP_API_URL } from "../../baseUrl";
import usePermissions from "../commonComponents/usePermissions";
import VisaApplicationOnlineSub from "./studentDetails/VisaApplicationOnlineSub";
import ProgressSteps from "./studentDetails/ProgressSteps";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import VisitorInfo from "./visitorDetails/VisitorInfo";
import VisitorTabs from "./visitorDetails/VisitorTabs";
import {
  deleteVisitorApplication,
  downloadVisitorDocument,
  getCountryWiseVisitorDocuments,
  getOneVisitorApplication,
  pendingVisitorDocList,
  pendingVisitorDocMail,
  updateVisitorApplication,
} from "../../redux/actions/Visitor/VisitorApplication.action";
import { getAllVisitorMainStatus } from "../../redux/actions/Visitor/VisitorMainStatus.action";
import { getOneVisitorSubStatus } from "../../redux/actions/Visitor/VisitorSubStatus.action";
import DataTable from "../commonComponents/DataTable";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import { getAccountant } from "../../redux/actions/Student/StudentApplication.action";
import CategoryDetails from "./CategoryDetails";
import ApplicationAccountant from "./ApplicationAccountant";
import VFSAppointment from "./studentDetails/visaApplication/VFSAppointment";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const workExperienceValidationSchema = Yup.object({
  company: Yup.string(),
  companyAddress: Yup.string(),
  designation: Yup.string(),
  jobType: Yup.string(),
});

const aptitudeExamValidationSchema = Yup.object({
  testName: Yup.string(),
  testDate: Yup.string(),
  expireDate: Yup.string(),
  verbalReasoningScore: Yup.string(),
  quantitiveReasoningScore: Yup.string(),
  analyticalWritingScore: Yup.string(),
  overallScore: Yup.string(),
});

const PersonalDetailsFollowupValidationSchema = Yup.object({
  nextFollowUpDate: Yup.string(),
  status: Yup.string(),
  remarks: Yup.string(),
});

const DocumentDetailsFollowupValidationSchema = Yup.object({
  nextFollowUpDate: Yup.string(),
  status: Yup.string(),
  remarks: Yup.string(),
});

const VisaApplicationFollowupValidationSchema = Yup.object({
  nextFollowUpDate: Yup.string(),
  status: Yup.string(),
  remarks: Yup.string(),
});

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

const toISODate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const statusOptions = [
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
  { value: "Reupload", label: "Reupload" },
];

const visaFeePaymentStatusOptions = [
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Failed", label: "Failed" },
];

const visaOutcomeTrackingStatusOptions = [
  { value: "Under Process", label: "Under Process" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Passport Requested", label: "Passport Requested" },
];

const VisitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userRole"));
  const currentUserId = decryptData(localStorage.getItem("userId"));
  const branchId = decryptData(localStorage.getItem("userId"));

  const [visitor, setVisitor] = useState(null);
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "personal",
  );
  const [selectedPersonalSection, setSelectedPersonalSection] = useState("");
  const [selectedVisaSection, setSelectedVisaSection] = useState("");
  const [selectedAccountantSection, setSelectedAccountantSection] =
    useState("");
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showAptitudeModal, setShowAptitudeModal] = useState(false);
  const [oneStudentData, setOneStudentData] = useState(null);
  const [countryDocuments, setCountryDocuments] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAllByType, setSelectAllByType] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const [showVisitorInfoModal, setShowVisitorInfoModal] = useState(false);
  const [showVisaAllocationModal, setShowVisaAllocationModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [pendingDocCount, setPendingDocCount] = useState(null);
  const [allUser, setAllUser] = useState([]);
  const [getAllRollList, setGetAllRoleList] = useState();
  const [showOtherDocModal, setShowOtherDocModal] = useState(false);
  const [otherDocName, setOtherDocName] = useState("");
  const [otherDocFile, setOtherDocFile] = useState(null);
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [reuploadDocIndex, setReuploadDocIndex] = useState(null);
  const [progressSteps, setProgressSteps] = useState([]);
  const [applicationstatus, setApplicationstatus] = useState([]);
  const [selectedApplicationStatus, setSelectedApplicationStatus] =
    useState(null);
  const [followUpStates, setFollowUpStates] = useState({
    personal: false,
    document: false,
    visaApplication: false,
  });
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [activeTabForModal, setActiveTabForModal] = useState(null);
  const [visitorStatuses, setVisitorStatuses] = useState([]);
  const [selectedVisitorStatus, setSelectedVisitorStatus] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState("");
  const [customDocName, setCustomDocName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUserAllocationSection, setShowUserAllocationSection] = useState(
    () => {
      const encryptedValue = localStorage.getItem("showUserAllocationSection");

      const storedValue = decryptData(encryptedValue);

      return storedValue === null ? true : storedValue === "true";
    },
  );
  // Calendar states for custom date pickers
  const [showAppointmentDateCalendar, setShowAppointmentDateCalendar] =
    useState(false);
  const [appointmentDateValue, setAppointmentDateValue] = useState(null);
  const appointmentDateInputRef = useRef(null);
  const [showFileHandoverDateCalendar, setShowFileHandoverDateCalendar] =
    useState(false);
  const [fileHandoverDateValue, setFileHandoverDateValue] = useState(null);
  const fileHandoverDateInputRef = useRef(null);
  const [showRPIssueDateCalendar, setShowRPIssueDateCalendar] = useState(false);
  const [rpIssueDateValue, setRPIssueDateValue] = useState(null);
  const rpIssueDateInputRef = useRef(null);
  const [showRPEndDateCalendar, setShowRPEndDateCalendar] = useState(false);
  const [rpEndDateValue, setRPEndDateValue] = useState(null);
  const rpEndDateInputRef = useRef(null);

  const [accountantData, setAccountantData] = useState([]);
  const [totalData, setTotalData] = useState([]);

  useEffect(() => {
    const encryptedValue = encryptData(String(showUserAllocationSection));

    localStorage.setItem("showUserAllocationSection", encryptedValue);
  }, [showUserAllocationSection]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (
      location.state &&
      Object.keys(location.state)?.some((key) =>
        [
          "selectedBranch",
          "mainStatus",
          "search",
          "currentPage",
          "itemsPerPage",
          "showAll",
          "selectedCountry",
        ]?.includes(key),
      )
    ) {
      // Filter state is present, preserve it for when we navigate back to VisitorApplication
      // The state will be passed through the back button navigation
    }
  }, [location.state]);

  const handleCheckboxChangeId = (id, documentName) => {
    setSelectedDocsIds((prev) => {
      const updatedIds = prev?.includes(id)
        ? prev?.filter((item) => item !== id)
        : [...prev, id];
      setSelectedDocumentNames((prevNames) => {
        if (updatedIds?.includes(id)) {
          return prevNames?.includes(documentName)
            ? prevNames
            : [...prevNames, documentName];
        } else {
          return prevNames?.filter((name) => name !== documentName);
        }
      });
      return updatedIds;
    });
  };

  const visitorStatusOptions = visitorStatuses?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const applicationstatusoptions = applicationstatus?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  useEffect(() => {
    if (activeTab === "personal" && !selectedPersonalSection) {
      setSelectedPersonalSection("education");
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "visaApplication" && !selectedVisaSection) {
      setSelectedVisaSection("visaStageInitiation");
    }
  }, [activeTab]);

  useEffect(() => {
    if (
      activeTab === "document" &&
      countryDocuments?.data?.[0]?.documents?.length > 0 &&
      !selectedDocType
    ) {
      const firstDocType =
        countryDocuments?.data[0].documents[0]?.type?.name || `UnnamedType_0`;
      setSelectedDocType(firstDocType);
    }
  }, [activeTab]);

  const handleDocumentTypeSelect = (typeKey) => {
    setSelectedDocType(typeKey);
  };

  const handlePersonalSectionSelect = (sectionKey) => {
    setSelectedPersonalSection(sectionKey);
  };

  const handleVisaSectionSelect = (sectionKey) => {
    setSelectedVisaSection(sectionKey);
  };

  const handleAccountantSelect = (sectionKey) => {
    setSelectedAccountantSection(sectionKey);
  };

  const handleFollowUpToggle = (tab) => {
    setActiveTabForModal(tab);
    setFollowUpStates((prev) => ({ ...prev, [tab]: !prev[tab] }));
    setShowFollowUpModal(true);
  };

  const handleModalClose = () => {
    setShowFollowUpModal(false);
    setPersonalDetailsCalendar(false);
    setDocumentCalendar(false);
    setVisaApplicationCalendar(false);
  };

  const handleDateChange = (selectedDate, formik) => {
    const formatted = formatDate(selectedDate);
    if (activeTabForModal === "personal") {
      personalDetailsFollowupFormik.setFieldValue(
        "nextFollowUpDate",
        formatted,
      );
    } else if (activeTabForModal === "document") {
      documentsFollowupFormik.setFieldValue("nextFollowUpDate", formatted);
    } else if (activeTabForModal === "visaApplication") {
      visaApplicationFollowupFormik.setFieldValue(
        "nextFollowUpDate",
        formatted,
      );
    }
    setPersonalDetailsCalendar(false);
    setDocumentCalendar(false);
    setVisaApplicationCalendar(false);
  };

  const getFormikForTab = () => {
    switch (activeTabForModal) {
      case "personal":
        return personalDetailsFollowupFormik;
      case "document":
        return documentsFollowupFormik;
      case "visaApplication":
        return visaApplicationFollowupFormik;
      default:
        return null;
    }
  };

  const handleOtherDocSubmit = async (e) => {
    e.preventDefault();
    if (otherDocName) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (otherDocFile && otherDocFile.length > 0) {
        for (let i = 0; i < otherDocFile.length; i++) {
          if (otherDocFile[i].size > maxSizeInBytes) {
            toast.error("File size must be less than 5MB");
            return;
          }
        }
      }
      setIsLoading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("customDocumentName", otherDocName);
        uploadFormData.append("status", "unverified");

        if (otherDocFile && otherDocFile.length > 0) {
          for (let i = 0; i < otherDocFile.length; i++) {
            uploadFormData.append("uploadedDocument", otherDocFile[i]);
          }
        }

        if (reuploadDocIndex !== null) {
          const existingDoc = otherDocuments[reuploadDocIndex];
          uploadFormData.append("documentId", existingDoc._id);
        }

        const res = await dispatch(
          updateVisitorApplication(uploadFormData, id),
        );

        if (res?.status === 200) {
          if (res?.data?.data?.message) {
            toast.error(res?.data?.data?.message);
            return;
          }

          const newDocs =
            res.data.data.uploadedDocumentDetails?.slice(
              -(otherDocFile?.length || 1),
            ) || [];
          const newDocumentEntries = newDocs?.map((doc) => ({
            _id: doc._id,
            customDocumentName: doc.customDocumentName || otherDocName,
            filePath: doc.filePath,
            fileUrl: doc.filePath ? `${REACT_APP_API_URL}/${doc.filePath}` : "",
            status: doc.status || "unverified",
            createdByName: doc.createdByName || "Unknown",
            createdAt: doc.createdAt,
            remarks: doc.remarks || "",
          }));

          if (reuploadDocIndex !== null) {
            setOtherDocuments((prev) => {
              const updatedDocs = [...prev];
              updatedDocs[reuploadDocIndex] = newDocumentEntries[0];
              return updatedDocs;
            });
          } else {
            setOtherDocuments((prev) => [...prev, ...newDocumentEntries]);
          }

          toast.success("Documents uploaded successfully");
          setOtherDocName("");
          setOtherDocFile(null);
          setShowOtherDocModal(false);
          setReuploadDocIndex(null);
          await fetchOneVisitorDetails();
        } else {
          toast.error(res?.data?.message || "Error uploading documents");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error uploading");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please provide document name and at least one file");
    }
  };

  const closePreviewModal = () => {
    setPreviewFile(null);
  };

  const [edit, setEdit] = useState({
    educationDetails: false,
    educationDetailsIndex: 0,
    entranceExam: false,
    entranceExamIndex: 0,
    workExperience: false,
    workExperienceIndex: 0,
    aptitudeExamDetails: false,
    aptitudeExamIndex: 0,
    categoryDetails: false,
    categoryDetailsIndex: 0,
    userAllocationDetails: false,
    userAllocationIndex: 0,
    visaAllocationDetails: false,
    visaVisaAllocationIndex: 0,
    visaApplicationDetails: false,
    visaApplicationDetailsIndex: 0,
  });

  const [index, setIndex] = useState({
    educationDetails: 0,
    entranceExam: 0,
    workExperience: 0,
    aptitudeExamDetails: 0,
    categoryDetails: 0,
    userAllocationDetails: 0,
    visaAllocationDetails: 0,
    visaApplicationDetails: 0,
  });

  const [formData, setFormData] = useState({
    educationDetails: [],
    entranceExamDetails: [],
    workExperience: [],
    aptitudeExamDetails: [],
    userAllocationDetails: [],
    visaAllocationDetails: [],
    uploadedDocumentDetails: [],
    visaApplicationDetails: {},
    loanRequired: false,
    visaByRG: false,
    categoryDetails: [],
  });

  const [personalDetailsCalendar, setPersonalDetailsCalendar] = useState(false);
  const personalDetailsRef = useRef(null);
  const [documentCalendar, setDocumentCalendar] = useState(false);
  const documentRef = useRef(null);
  const [visaApplicationCalendar, setVisaApplicationCalendar] = useState(false);
  const visaApplicationRef = useRef(null);

  useEffect(() => {
    if (userRole === "Branch") {
      dispatch(getAllRoleList(branchId)).then((res) => {
        setGetAllRoleList(res?.data);
      });
    } else {
      dispatch(getAllRoleList("")).then((res) => {
        setGetAllRoleList(res?.data);
      });
    }
  }, []);

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan());
      const plans = res?.data?.data?.data || [];

      const admissionPlan = plans.find(
        (plan) => plan.name.toLowerCase() === "visitor",
      );

      if (admissionPlan?._id && id) {
        await fetchAccountant(admissionPlan._id);
      }
    } catch (error) {
      console.error("Error fetching main plans:", error);
    }
  };

  const fetchAccountant = async (mainPlanId) => {
    try {
      const res = await dispatch(getAccountant(id, mainPlanId));
      setAccountantData(res?.data?.data?.data);
      setTotalData(res?.data?.data?.totals);
    } catch (error) {
      console.log("Error fetching in get Accountant Data : ", error);
    }
  };

  useEffect(() => {
    fetchMainPlans();
  }, [id]);

  const fetchAllUser = async (roleName) => {
    try {
      const res = await dispatch(adminGetAll(1, 100, "", roleName, "", false));
      const responseData = res?.data?.data;
      setAllUser(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching users:", error);
      setAllUser([]);
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

  const fetchApplicatonStatus = async () => {
    try {
      const res = await dispatch(getOneVisitorSubStatus(activeTab));
      await setApplicationstatus(res?.data?.data || []);
      await fetchOneVisitorDetails();
    } catch (error) {
      console.error("Error fetching application status:", error);
      setApplicationstatus([]);
    }
  };

  useEffect(() => {
    fetchApplicatonStatus();
    fetchVisitorStatuses();
  }, [activeTab]);

  const fetchOneVisitorDetails = async () => {
    setIsLoading(true);

    try {
      const res = await dispatch(getOneVisitorApplication(id));
      const visitorData = res?.data?.data;
      setOneStudentData(visitorData);

      if (visitorData?.mainStatus?._id) {
        setSelectedVisitorStatus({
          value: visitorData.mainStatus._id,
          label: visitorData.mainStatus.name,
        });
      }

      let statusId;
      if (activeTab === "personal") {
        statusId = visitorData?.personalDetailStatus?._id;
      } else if (activeTab === "document") {
        statusId = visitorData?.documentDetailStatus?._id;
      }
      const selectedStatus = applicationstatus?.find(
        (status) => status._id === statusId,
      );
      setSelectedApplicationStatus(
        selectedStatus
          ? { value: selectedStatus._id, label: selectedStatus.name }
          : null,
      );
      setVisitor(visitorData);

      const educationDetailsWithFiles = (
        visitorData?.educationDetails || []
      )?.map((edu) => {
        const matchingDoc = visitorData?.uploadedDocumentDetails?.find(
          (doc) => doc?.ref_module === edu?._id,
        );
        return {
          ...edu,
          fileUrl: matchingDoc ? `${matchingDoc.filePath}` : null,
          filePath: matchingDoc ? matchingDoc.filePath : null,
        };
      });

      const entranceExamDetailsWithFiles = (
        visitorData?.entranceExamDetails || []
      )?.map((edu) => {
        const matchingDoc = visitorData?.uploadedDocumentDetails?.find(
          (doc) => doc?.ref_module === edu?._id,
        );
        return {
          ...edu,
          fileUrl: matchingDoc ? `${matchingDoc.filePath}` : null,
          filePath: matchingDoc ? matchingDoc.filePath : null,
        };
      });

      const aptitudeExamDetailsWithFiles = (
        visitorData?.aptitudeExamDetails || []
      )?.map((edu) => {
        const matchingDoc = visitorData?.uploadedDocumentDetails?.find(
          (doc) => doc?.ref_module === edu?._id,
        );
        return {
          ...edu,
          fileUrl: matchingDoc ? `${matchingDoc.filePath}` : null,
          filePath: matchingDoc ? matchingDoc.filePath : null,
        };
      });

      const workExperienceWithFiles = (visitorData?.workExperience || [])?.map(
        (edu) => {
          const matchingDoc = visitorData?.uploadedDocumentDetails?.find(
            (doc) => doc?.ref_module === edu?._id,
          );
          return {
            ...edu,
            fileUrl: matchingDoc ? `${matchingDoc.filePath}` : null,
            filePath: matchingDoc ? matchingDoc.filePath : null,
          };
        },
      );

      setFormData({
        educationDetails: educationDetailsWithFiles || [],
        entranceExamDetails: entranceExamDetailsWithFiles || [],
        workExperience: workExperienceWithFiles || [],
        aptitudeExamDetails: aptitudeExamDetailsWithFiles || [],
        userAllocationDetails: visitorData?.userAllocationDetails || [],
        visaAllocationDetails: visitorData?.visaAllocationDetails || [],
        visaApplicationDetails: visitorData?.visaApplicationDetails || [],
        uploadedDocumentDetails: visitorData?.uploadedDocumentDetails || [],
        loanRequired: visitorData?.loanRequired ?? false,
        visaByRG: visitorData?.visaByRG ?? false,
        categoryDetails: visitorData?.categoryDetails || [],
      });
      const customDocs = visitorData?.uploadedDocumentDetails
        ?.filter((doc) => doc.customDocumentName)
        ?.map((doc) => ({
          _id: doc._id,
          customDocumentName: doc.customDocumentName,
          filePath: doc.filePath,
          fileUrl: `${REACT_APP_API_URL}/${doc.filePath}`,
          status: doc.status || "unverified",
          createdByName: doc.createdByName || "Unknown",
          createdAt: doc.createdAt,
          remarks: doc.remarks || "",
        }));
      setOtherDocuments(customDocs || []);
      if (visitorData?.uploadedDocumentDetails) {
        setOneStudentData((prev) => ({
          ...prev,
          uploadedDocumentDetails: visitorData?.uploadedDocumentDetails?.map(
            (doc) => ({
              ...doc,
              fileUrl: `${REACT_APP_API_URL}/${doc.filePath}`,
            }),
          ),
        }));
      }
      const preferredCountry = visitorData?.preferredCountry || "";
      if (preferredCountry) {
        await fetchProgressSteps(preferredCountry);
      }
    } catch (error) {
      console.log("Error fetching visitor details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountryWiseDocuments = async (preferredCountry) => {
    try {
      const res = await dispatch(
        getCountryWiseVisitorDocuments(preferredCountry),
      );
      if (res?.data?.code === 200) {
        setCountryDocuments(res.data.data || []);
      } else {
        toast.error("Error fetching country documents");
      }
    } catch (error) {
      console.log("Error fetching country documents:", error);
      setCountryDocuments([]);
    }
  };

  useEffect(() => {
    fetchOneVisitorDetails();
  }, [id, applicationstatus]);

  const fetchProgressSteps = async (country) => {
    try {
      const res = await dispatch(getAllProgressbar(1, 100, "", country));
      if (res?.status === 200 && res.data?.data?.data?.[0]?.steps) {
        const rawSteps = res?.data?.data?.data[0]?.steps;
        const steps = rawSteps?.map((step) => ({
          name: step,
          completed: false,
          completedDate: "",
        }));
        setProgressSteps(steps);
      }
    } catch (error) {
      console.error("Error fetching progress steps:", error);
    }
  };

  useEffect(() => {
    const preferredCountryArray = oneStudentData?.preferredCountry || "";
    if (preferredCountryArray) {
      fetchCountryWiseDocuments(preferredCountryArray);
    }
  }, [oneStudentData?.preferredCountry]);

  const handleDocumentUploadEducation = async (payload) => {
    try {
      const formData = new FormData();
      if (payload.educationDetailId) {
        formData.append("educationDetailId", payload.educationDetailId);
      } else if (payload.entranceExamId) {
        formData.append("entranceExamId", payload.entranceExamId);
      }
      formData.append("documentType", payload.documentType);
      formData.append("documentName", payload.documentName);
      formData.append("uploadedDocument", payload.uploadedDocument);

      const res = await dispatch(updateVisitorApplication(formData, id));
      await dispatch(fetchOneVisitorDetails(id));
      if (res.payload?.success) {
        toast.success("Document uploaded successfully!");

        await dispatch(fetchOneVisitorDetails(id));
      } else {
        throw new Error("API response unsuccessful");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleWorkExperienceSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newWork = values.workExperience[currentIndex];

    if (
      !newWork ||
      Object.values(newWork)?.every(
        (val) => !val || val.toString().trim() === "",
      )
    ) {
      toast.error("Please fill at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const tempId = "temp123";

      const workExperienceDetails = {
        tempId: tempId,
        company: newWork.company,
        companyAddress: newWork.companyAddress,
        designation: newWork.designation,
        jobType: newWork.jobType,
      };

      let payload;
      if (selectedDocType?.value === "others") {
        payload = {
          workExperience: [workExperienceDetails],
          customDocumentName: customDocName || "Others",
          workTempId: tempId,
          status: "unverified",
        };
      } else {
        payload = {
          workExperience: [workExperienceDetails],
          documentType: selectedDocType?.value || "",
          documentName:
            selectedDocumentName?.value === "others"
              ? customDocName || "Others"
              : selectedDocumentName?.value || "",
          status: "unverified",
          workTempId: tempId,
        };
      }

      const formData = new FormData();
      if (selectedFile) {
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (selectedFile.size > maxSizeInBytes) {
          toast.error("File size must be less than 5MB");
          setIsLoading(false);
          return;
        }
        formData.append("uploadedDocument", selectedFile);
      }

      formData.append("updateData", JSON.stringify(payload));

      const res = await dispatch(updateVisitorApplication(formData, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Work experience added successfully");
        setFormData((prev) => ({
          ...prev,
          workExperience: [
            ...prev.workExperience,
            res.data.data.workExperience[0],
          ],
        }));
        setIndex((prev) => ({
          ...prev,
          workExperience: prev.workExperience + 1,
        }));
        setShowWorkModal(false);
        workExperienceFormik.resetForm();
        fetchOneVisitorDetails();
      } else {
        toast.error(res?.data?.message || "Error adding work experience");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error adding work experience",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWorkExperience = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.workExperienceIndex;
    const updatedEntry = values.workExperience[0];
    const workId = formData.workExperience[updatedIndex]?._id;

    try {
      const payload = {
        workExperienceId: workId,
        workExperienceUpdate: updatedEntry,
      };
      const res = await dispatch(updateVisitorApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Work experience updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.workExperience];
          updatedData[updatedIndex] =
            res.data.data.workExperience[updatedIndex];
          return { ...prev, workExperience: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          workExperience: false,
          workExperienceIndex: 0,
        }));
        setShowWorkModal(false);
        workExperienceFormik.resetForm();
      } else {
        toast.error(res?.data?.message || "Error updating work experience");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating work experience",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkExperience = async (indexToDelete) => {
    const workExperienceId = formData.workExperience[indexToDelete]?._id;

    if (!workExperienceId) {
      toast.error("Invalid work experience detail. Cannot delete.");
      return;
    }

    const payload = {
      workExperienceId,
    };

    try {
      const res = await dispatch(deleteVisitorApplication(payload, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Work experience deleted successfully");
        setFormData((prev) => ({
          ...prev,
          workExperience: prev.workExperience.filter(
            (_, i) => i !== indexToDelete,
          ),
        }));
        if (edit.workExperience && edit.workExperienceIndex === indexToDelete) {
          setEdit((prev) => ({
            ...prev,
            workExperience: false,
            workExperienceIndex: 0,
          }));
        }
        fetchOneVisitorDetails();
      } else {
        toast.error(res?.data?.message || "Error deleting work experience");
      }
    } catch (error) {
      console.error("Error deleting work experience:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting work experience",
      );
    }
  };

  const handleAptitudeExamSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newAptitude = values.aptitudeExamDetails[currentIndex];

    if (
      !newAptitude ||
      Object.values(newAptitude)?.every(
        (val) => !val || val.toString().trim() === "",
      )
    ) {
      toast.error("Please fill at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const tempId = "temp123";

      const aptitudeExamDetail = {
        tempId: tempId,
        testName: newAptitude.testName,
        expireDate: newAptitude.expireDate,
        verbalReasoningScore: newAptitude.verbalReasoningScore,
        quantitiveReasoningScore: newAptitude.quantitiveReasoningScore,
        analyticalWritingScore: newAptitude.analyticalWritingScore,
        overallScore: newAptitude.overallScore,
      };

      let payload;
      if (selectedDocType?.value === "others") {
        payload = {
          aptitudeExamDetails: [aptitudeExamDetail],
          customDocumentName:
            customDocName ||
            aptitudeExamFormik.values.aptitudeExamDetails[0].testName ||
            "Others",
          aptitudeExamTempId: tempId,
          status: "unverified",
        };
      } else {
        payload = {
          aptitudeExamDetails: [aptitudeExamDetail],
          documentType: selectedDocType?.value || "",
          documentName:
            selectedDocumentName?.value === "others"
              ? customDocName ||
                (Array.isArray(aptitudeExamFormik?.values?.educationDetails) &&
                aptitudeExamFormik.values.educationDetails.length > 0
                  ? aptitudeExamFormik.values.aptitudeExamDetails[0].testName ||
                    "Others"
                  : "Others")
              : selectedDocumentName?.value || "",
          status: "unverified",
          aptitudeExamTempId: tempId,
        };
      }

      const formData = new FormData();
      if (selectedFile) {
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (selectedFile.size > maxSizeInBytes) {
          toast.error("File size must be less than 5MB");
          setIsLoading(false);
          return;
        }
        formData.append("uploadedDocument", selectedFile);
      }

      formData.append("updateData", JSON.stringify(payload));

      const res = await dispatch(updateVisitorApplication(formData, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Aptitude exam added successfully");
        setFormData((prev) => ({
          ...prev,
          aptitudeExamDetails: [
            ...prev.aptitudeExamDetails,
            res.data.data.aptitudeExamDetails[0],
          ],
        }));
        setIndex((prev) => ({
          ...prev,
          aptitudeExamDetails: prev.aptitudeExamDetails + 1,
        }));
        setShowAptitudeModal(false);
        aptitudeExamFormik.resetForm();
        fetchOneVisitorDetails();
      } else {
        toast.error(res?.data?.message || "Error adding aptitude exam");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error adding aptitude exam",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAptitudeExam = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.aptitudeExamIndex;
    const updatedEntry = values.aptitudeExamDetails[0];
    const examId = formData.aptitudeExamDetails[updatedIndex]?._id;

    try {
      const payload = {
        aptitudeExamId: examId,
        aptitudeExamUpdate: updatedEntry,
      };
      const res = await dispatch(updateVisitorApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Aptitude exam updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.aptitudeExamDetails];
          updatedData[updatedIndex] =
            res.data.data.aptitudeExamDetails[updatedIndex];
          return { ...prev, aptitudeExamDetails: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          aptitudeExamDetails: false,
          aptitudeExamIndex: 0,
        }));
        setShowAptitudeModal(false);
        aptitudeExamFormik.resetForm();
      } else {
        toast.error(res?.data?.message || "Error updating aptitude exam");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating aptitude exam",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAptitudeExam = async (indexToDelete) => {
    const aptitudeExamId = formData.aptitudeExamDetails[indexToDelete]?._id;

    if (!aptitudeExamId) {
      toast.error("Invalid aptitude exam detail. Cannot delete.");
      return;
    }

    const payload = {
      aptitudeExamId,
    };

    try {
      const res = await dispatch(deleteVisitorApplication(payload, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Aptitude exam deleted successfully");
        setFormData((prev) => ({
          ...prev,
          aptitudeExamDetails: prev.aptitudeExamDetails.filter(
            (_, i) => i !== indexToDelete,
          ),
        }));
        if (
          edit.aptitudeExamDetails &&
          edit.aptitudeExamIndex === indexToDelete
        ) {
          setEdit((prev) => ({
            ...prev,
            aptitudeExamDetails: false,
            aptitudeExamIndex: 0,
          }));
        }
        fetchOneVisitorDetails();
      } else {
        toast.error(res?.data?.message || "Error deleting aptitude exam");
      }
    } catch (error) {
      console.error("Error deleting aptitude exam:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting aptitude exam",
      );
    }
  };

  const workExperienceFormik = useFormik({
    initialValues: {
      workExperience: [
        {
          company: "",
          companyAddress: "",
          designation: "",
          jobType: "",
        },
      ],
    },
    validationSchema: Yup.object({
      workExperience: Yup.array().of(workExperienceValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.workExperience) {
        handleEditWorkExperience(values);
      } else {
        handleWorkExperienceSubmit(values);
      }
    },
  });

  const aptitudeExamFormik = useFormik({
    initialValues: {
      aptitudeExamDetails: [
        {
          testName: "",
          testDate: "",
          expireDate: "",
          verbalReasoningScore: "",
          quantitiveReasoningScore: "",
          analyticalWritingScore: "",
          overallScore: "",
        },
      ],
    },
    validationSchema: Yup.object({
      aptitudeExamDetails: Yup.array().of(aptitudeExamValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.aptitudeExamDetails) {
        handleEditAptitudeExam(values);
      } else {
        handleAptitudeExamSubmit(values);
      }
    },
  });

  const handleVisaFlowDocumentUpload = async (
    docName,
    files,
    resetForm,
    formikInstance,
  ) => {
    if (!docName || !files || files.length === 0) {
      toast.error("Please provide document name and at least one file.");
      return { success: false };
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (files?.some((file) => file.size > maxSizeInBytes)) {
      toast.error("One or more files exceed the 5MB size limit.");
      return { success: false };
    }

    setIsLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("customDocumentName", docName);
      files?.forEach((file) => {
        uploadFormData.append("uploadedDocument", file);
      });
      uploadFormData.append(
        "ref_module",
        formData?.visaApplicationDetails?._id,
      );

      const res = await dispatch(updateVisitorApplication(uploadFormData, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          console.error("API response error:", res.data.data.message);
          toast.error(res.data.data.message);
          return { success: false };
        }

        const newDocs = res.data?.data?.uploadedDocumentDetails || [];
        const documentDetails = newDocs?.map((doc) => ({
          _id: doc._id,
          customDocumentName: doc.customDocumentName || docName,
          filePath: doc.filePath,
          fileUrl: doc.filePath ? `${REACT_APP_API_URL}/${doc.filePath}` : "",
          status: doc.status || "unverified",
          createdByName: doc.createdByName || "Unknown",
          createdAt: doc.createdAt,
          remarks: doc.remarks || "",
        }));

        toast.success(`${docName} uploaded successfully`);
        if (resetForm) resetForm();
        formikInstance.setFieldValue("file", null);
        formikInstance.setFieldValue("biometricsReceipt", null);
        formikInstance.setFieldValue("appointmentLetter", null);
        formikInstance.setFieldValue("picUpload", null);
        formikInstance.setFieldValue("dVisaDocument", null);
        formikInstance.setFieldValue("supplementaryAdditional", null);
        formikInstance.setFieldValue("applicationSubmission", null);
        const input = document.querySelector(
          `input[name="${
            formikInstance.values.file ? "file" : "appointmentLetter"
          }"]`,
        );
        if (input) input.value = "";

        await fetchOneVisitorDetails();
        return { success: true, documentDetails };
      } else {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.message || `Error uploading ${docName.toLowerCase()}`,
        );
        return { success: false };
      }
    } catch (error) {
      console.error("Document upload error:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message ||
          `Error uploading ${docName.toLowerCase()}`,
      );
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event, formikInstance) => {
    const files = Array.from(event.target.files);
    const fieldName = event.target.name;

    if (files.length > 0) {
      const maxSizeInBytes = 5 * 1024 * 1024;

      // Allowed file types
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      ];

      // Validate files
      for (let file of files) {
        if (!allowedTypes.includes(file.type)) {
          toast.error(`File ${file.name} is not a valid supported format.`);
          return;
        }

        if (file.size > maxSizeInBytes) {
          toast.error(`File ${file.name} exceeds the 5MB size limit.`);
          return;
        }
      }

      // Set file array into Formik
      formikInstance.setFieldValue(fieldName, files);

      // Existing flows (unchanged)
      if (fieldName === "biometricsReceipt") {
        await handleVisaFlowDocumentUpload(
          "Biometrics Receipt",
          files,
          formikInstance.resetForm,
          formikInstance,
        );
      }

      if (fieldName === "appointmentLetter") {
        await handleVisaFlowDocumentUpload(
          "Appointment Letter",
          files,
          formikInstance.resetForm,
          formikInstance,
        );
      }
    }
  };

  const visaFeePaymentFormik = useFormik({
    initialValues: {
      file: null,
      paymentDetails: formData?.visaApplicationDetails?.paymentDetails || "",
      status: formData?.visaApplicationDetails?.feeStatus || "",
    },
    onSubmit: (values, { resetForm }) => {
      handleVisaFeePaymentSubmit(values, resetForm, visaFeePaymentFormik);
    },
  });
  const handleVisaFeePaymentSubmit = async (
    values,
    resetForm,
    formikInstance,
  ) => {
    const isFileUploaded = !!values.file;
    const isPaymentInfoProvided = values.paymentDetails || values.status;

    if (!isFileUploaded && !isPaymentInfoProvided) {
      toast.error("Please upload a payment proof or provide payment details.");
      return;
    }

    setIsLoading(true);
    try {
      let uploadSuccess = true;
      let documentDetails = null;

      if (isFileUploaded) {
        const uploadResult = await handleVisaFlowDocumentUpload(
          "Visa Fee Payment",
          values.file,
          resetForm,
          formikInstance,
        );
        uploadSuccess = uploadResult.success;
        documentDetails = uploadResult.documentDetails;
        if (!uploadSuccess) {
          return;
        }
      }

      let paymentSuccess = true;
      if (isPaymentInfoProvided) {
        const payload = {
          visaApplicationDetails: {
            paymentDetails: values.paymentDetails,
            feeStatus: values.status,
          },
        };

        const res = await dispatch(updateVisitorApplication(payload, id));
        if (res?.status !== 200) {
          toast.error(res?.data?.message || "Error updating payment details");
          paymentSuccess = false;
        }
      }

      if (uploadSuccess && paymentSuccess) {
        toast.success("Visa fee payment details updated successfully");
        resetForm({
          values: {
            file: null,
            paymentDetails:
              formData?.visaApplicationDetails?.paymentDetails || "",
            status: formData?.visaApplicationDetails?.feeStatus || "",
          },
        });
        await fetchOneVisitorDetails();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisaOutcomeSubmit = async (values, formikInstance, resetForm) => {
    const isFileUploaded = !!values.visaOutcomeProof;
    setIsLoading(true);
    try {
      const payload = {
        visaApplicationDetails: {
          visaOutcomeStatus: values.visaOutcomeStatus,
        },
      };

      let uploadSuccess = true;
      let documentDetails = null;

      if (isFileUploaded) {
        const uploadResult = await handleVisaFlowDocumentUpload(
          "Visa Outcome Proof",
          values.visaOutcomeProof,
          resetForm,
          formikInstance,
        );
        uploadSuccess = uploadResult.success;
        documentDetails = uploadResult.documentDetails;
        if (!uploadSuccess) {
          console.error("Document upload failed:", uploadResult);
          return;
        }
      }

      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status !== 200) {
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating visa outcome",
        );
        return;
      }

      toast.success("Visa outcome updated successfully");
      await fetchOneVisitorDetails();
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message,
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisaFileSubmissionSubmit = async (
    values,
    resetForm,
    formikInstance,
  ) => {
    const isFormChanged =
      values.finalChecklistConfirmed ||
      values.submissionDateRecorded ||
      values.fileSubmission.isSubmitted ||
      values.fileSubmission.mode ||
      values.fileSubmission.link;

    if (!isFormChanged) {
      toast.error("Please provide at least one field to submit.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        visaApplicationDetails: {
          visaFileSubmission: {
            finalChecklistConfirmed: values.finalChecklistConfirmed,
            submissionDateRecorded: values.submissionDateRecorded,
            fileSubmission: {
              isSubmitted: values.fileSubmission.isSubmitted,
              mode: values.fileSubmission.mode,
              link: values.fileSubmission.link,
            },
          },
        },
      };

      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message || "Error updating visa file submission",
        );
        return;
      }

      toast.success("Visa file submission updated successfully");
      resetForm({
        values: {
          finalChecklistConfirmed:
            formData?.visaApplicationDetails?.visaFileSubmission
              ?.finalChecklistConfirmed || false,
          submissionDateTime:
            formData?.visaApplicationDetails?.visaFileSubmission
              ?.submissionDateTime || false,
          fileSubmission: {
            isSubmitted:
              formData?.visaApplicationDetails?.visaFileSubmission
                ?.fileSubmission?.isSubmitted || false,
            mode:
              formData?.visaApplicationDetails?.visaFileSubmission
                ?.fileSubmission?.mode || "",
            link:
              formData?.visaApplicationDetails?.visaFileSubmission
                ?.fileSubmission?.link || "",
          },
        },
      });
      await fetchOneVisitorDetails();
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message,
      );
      toast.error(
        error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          "Failed to process request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileHandoverSubmit = async (values, resetForm) => {
    if (!values.visaFileHandover.date) {
      toast.error("Please provide a date.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        visaApplicationDetails: {
          visaFileHandover: {
            date: values.visaFileHandover.date,
          },
        },
      };

      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating file handover date",
        );
        return;
      }

      toast.success("File handover date updated successfully");
      resetForm({
        values: {
          date: formData?.visaApplicationDetails?.visaFileHandover?.date || "",
        },
      });
      fetchOneVisitorDetails();
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message,
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDVisaApplySubmit = async (values, formikInstance, resetForm) => {
    const isFileUploaded = !!values.dVisaDocument;
    if (
      values.d_visa_apply.apply === "yes" &&
      (!values.d_visa_apply.startDate || !values.d_visa_apply.endDate)
    ) {
      toast.error("Please provide both start and end dates for D Visa.");
      return;
    }

    setIsLoading(true);
    try {
      let payload = {};
      if (values.d_visa_apply.apply === "yes") {
        payload = {
          visaApplicationDetails: {
            d_visa_apply: {
              startDate: values.d_visa_apply.startDate,
              endDate: values.d_visa_apply.endDate,
              apply: values.d_visa_apply.apply,
            },
          },
        };

        let uploadSuccess = true;
        let documentDetails = null;

        if (isFileUploaded) {
          const uploadResult = await handleVisaFlowDocumentUpload(
            "D Visa Document",
            values.dVisaDocument,
            resetForm,
            formikInstance,
          );
          uploadSuccess = uploadResult.success;
          documentDetails = uploadResult.documentDetails;
          if (!uploadSuccess) {
            console.error("Document upload failed:", uploadResult);
            return;
          }
        }
      } else {
        payload = {
          visaApplicationDetails: {
            d_visa_apply: null,
          },
        };
      }

      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating D Visa details",
        );
        return;
      }

      toast.success("D Visa details updated successfully");
      resetForm({
        values: {
          d_visa_apply: {
            apply: formData?.visaApplicationDetails?.d_visa_apply?.apply || "",
            startDate:
              formData?.visaApplicationDetails?.d_visa_apply?.startDate || "",
            endDate:
              formData?.visaApplicationDetails?.d_visa_apply?.endDate || "",
          },
        },
      });
      fetchOneVisitorDetails();
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message,
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisaApplicationSubmit = async (
    values,
    formikInstance,
    resetForm,
  ) => {
    const isFileUploaded = !!values.applicationSubmission;

    if (!values.visaOnlineSubmission.date) {
      toast.error("Please provide a date.");
      return;
    }
    setIsLoading(true);

    try {
      const paylaod = {
        visaApplicationDetails: {
          visaOnlineSubmission: {
            date: values.visaOnlineSubmission.date,
          },
        },
      };

      let uploadSuccess = true;
      let documentDetails = null;

      if (isFileUploaded) {
        const uploadResult = await handleVisaFlowDocumentUpload(
          "Visa Application Submission",
          values.applicationSubmission,
          resetForm,
          formikInstance,
        );
        uploadSuccess = uploadResult.success;
        documentDetails = uploadResult.documentDetails;
        if (!uploadSuccess) {
          console.error("Document upload failed:", uploadResult);
          return;
        }
      }

      const res = await dispatch(updateVisitorApplication(paylaod, id));
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating D Visa details",
        );
        return;
      }

      toast.success("Visa Application Submission updated successfully");
      resetForm({
        values: {
          visaOnlineSubmission: {
            date:
              formData?.visaApplicationDetails?.visaOnlineSubmission?.date ||
              "",
          },
        },
      });
      fetchOneVisitorDetails();
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message,
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemarksSubmit = async (values, formikInstance, resetForm) => {
    const isFileUploaded =
      !!values.supplementaryAdditional &&
      values.supplementaryAdditional.length > 0;
    setIsLoading(true);
    try {
      let payload = {
        visaApplicationDetails: {
          remarks: {
            text: values.remarks.text,
          },
        },
      };

      let uploadSuccess = true;
      let documentDetails = null;

      if (isFileUploaded) {
        const uploadResult = await handleVisaFlowDocumentUpload(
          "Supplementary Additional",
          values.supplementaryAdditional,
          resetForm,
          formikInstance,
        );
        uploadSuccess = uploadResult.success;
        documentDetails = uploadResult.documentDetails;
        if (!uploadSuccess) {
          console.error("Document upload failed:", uploadResult);
          return;
        }
      }

      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating remarks",
        );
        return;
      }

      toast.success("Remarks updated successfully");
      if (typeof resetForm === "function") resetForm();
      await fetchOneVisitorDetails();
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message,
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const biometricsFormik = useFormik({
    initialValues: {
      biometricsReceipt: null,
    },
  });

  const visaApplicationSubmissionFormik = useFormik({
    initialValues: {
      visaOnlineSubmission:
        formData?.visaApplicationDetails?.visaOnlineSubmission?.date || "",
      applicationSubmission: null,
    },
    onSubmit: (values, { resetForm }) => {
      handleVisaApplicationSubmit(
        values,
        visaApplicationSubmissionFormik,
        resetForm,
      );
    },
    enableReinitialize: true,
  });

  const visaFileSubmissionFormik = useFormik({
    initialValues: {
      finalChecklistConfirmed:
        formData?.visaApplicationDetails?.visaFileSubmission
          ?.finalChecklistConfirmed || false,
      submissionDateRecorded:
        formData?.visaApplicationDetails?.visaFileSubmission
          ?.submissionDateRecorded || false,
      fileSubmission: {
        isSubmitted:
          formData?.visaApplicationDetails?.visaFileSubmission?.fileSubmission
            ?.isSubmitted || false,
        mode:
          formData?.visaApplicationDetails?.visaFileSubmission?.fileSubmission
            ?.mode || "",
        link:
          formData?.visaApplicationDetails?.visaFileSubmission?.fileSubmission
            ?.link || "",
      },
    },
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleVisaFileSubmissionSubmit(
        values,
        resetForm,
        visaFileSubmissionFormik,
      );
    },
  });

  const visaOutcomeFormik = useFormik({
    initialValues: {
      visaOutcomeStatus:
        formData?.visaApplicationDetails?.visaOutcomeStatus || "",
      visaOutcomeProof: null,
    },
    onSubmit: (values, { resetForm }) => {
      handleVisaOutcomeSubmit(values, visaOutcomeFormik, resetForm);
    },
  });

  const fileHandoverFormik = useFormik({
    initialValues: {
      visaFileHandover: {
        date: formData?.visaApplicationDetails?.visaFileHandover?.date || "",
      },
    },
    onSubmit: (values, { resetForm }) => {
      handleFileHandoverSubmit(values, resetForm, fileHandoverFormik);
    },
  });

  const remarksFormik = useFormik({
    initialValues: {
      remarks: {
        text: formData?.visaApplicationDetails?.remarks?.text || "",
      },
      supplementaryAdditional: null,
    },
    onSubmit: (values, { resetForm }) => {
      handleRemarksSubmit(values, remarksFormik, resetForm);
    },
    enableReinitialize: true,
  });

  const dVisaApplyFormik = useFormik({
    initialValues: {
      d_visa_apply: {
        apply: formData?.visaApplicationDetails?.d_visa_apply?.apply || "no",
        startDate:
          formData?.visaApplicationDetails?.d_visa_apply?.startDate || "",
        endDate: formData?.visaApplicationDetails?.d_visa_apply?.endDate || "",
      },
      dVisaDocument: null,
    },
    onSubmit: (values, { resetForm }) => {
      handleDVisaApplySubmit(values, dVisaApplyFormik, resetForm);
    },
    enableReinitialize: true,
  });

  const loanFormik = useFormik({
    initialValues: {
      loanRequired: formData?.loanRequired ?? false,
    },
    validationSchema: Yup.object({
      loanRequired: Yup.boolean(),
    }),
  });
  useEffect(() => {
    loanFormik.setValues({
      loanRequired: formData?.loanRequired ?? false,
    });
  }, [formData?.loanRequired]);

  const visaByRGFormik = useFormik({
    initialValues: {
      visaByRG: formData?.visaByRG ?? false,
    },
    validationSchema: Yup.object({
      visaByRG: Yup.boolean(),
    }),
  });

  useEffect(() => {
    visaByRGFormik.setValues({
      visaByRG: formData?.visaByRG ?? false,
    });
  }, [formData?.visaByRG]);

  const getFilePathsForCourse = (courseId, documents, documentType) => {
    return documents
      ?.filter(
        (doc) =>
          doc.ref_module === courseId &&
          documentType?.includes(doc.customDocumentName),
      )
      .map((doc) => {
        const filePath = doc?.filePath
          ? doc.filePath
          : `${BASEURL}${doc.filePath}`; // safely prepend base URL if not absolute

        return {
          filePath,
          customDocumentName: doc?.customDocumentName || "Unknown Document",
        };
      });
  };
  const [visaFeePaymentFilePaths, setVisaFeePaymentFilePaths] = useState([]);
  const [biometricsPaths, setBiometricsPaths] = useState([]);
  const [vfsAppointmentFilePaths, setVfsAppointmentFilePaths] = useState([]);
  const [rpDecisionFilePaths, setRpDecisionFilePaths] = useState([]);
  const [dVisaDocsFilePaths, setDVisaDocsFilePaths] = useState([]);
  const [visaApplicationFilePaths, setVisaApplicationFilePaths] = useState([]);
  const [visaOutcomeFilePaths, setVisaOutcomeFilePaths] = useState([]);
  const [
    supplementaryAdditionalFilePaths,
    setSupplementaryAdditionalFilePaths,
  ] = useState([]);

  useEffect(() => {
    if (formData?.visaApplicationDetails) {
      visaFeePaymentFormik.setValues({
        file: null,
        paymentDetails: formData.visaApplicationDetails.paymentDetails || "",
        status: formData.visaApplicationDetails.feeStatus || "",
      });

      visaOutcomeFormik.setValues({
        visaOutcomeStatus:
          formData?.visaApplicationDetails?.visaOutcomeStatus || "",
      });

      loanFormik.setValues({
        loanRequired: formData?.loanRequired || false,
      });
      visaByRGFormik.setValues({
        visaByRG: formData?.visaByRG || false,
      });

      visaApplicationSubmissionFormik.setValues({
        visaOnlineSubmission: {
          date:
            formData?.visaApplicationDetails?.visaOnlineSubmission?.date || "",
        },
      });

      fileHandoverFormik.setValues({
        visaFileHandover: {
          date: formData?.visaApplicationDetails?.visaFileHandover?.date || "",
        },
      });

      remarksFormik.setValues({
        remarks: {
          text: formData?.visaApplicationDetails?.remarks?.text || "",
        },
      });
    }

    const courseId = formData?.visaApplicationDetails?._id;
    if (courseId) {
      // Fee payment documents
      const feePayment = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Visa Fee Payment"],
      );
      setVisaFeePaymentFilePaths(feePayment);

      // Biometrics
      const biometrictsAndAppointment = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Biometrics Receipt"],
      );
      setBiometricsPaths(biometrictsAndAppointment);

      // VFS
      const vfsLetter = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Appointment Letter"],
      );
      setVfsAppointmentFilePaths(vfsLetter);

      // PIC
      const picDocument = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["PIC Decision"],
      );
      setRpDecisionFilePaths(picDocument);

      // D Visa
      const dVisaDocument = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["D Visa Document"],
      );
      setDVisaDocsFilePaths(dVisaDocument);

      // D Visa
      const supplementaryAdditionalDocument = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Supplementary Additional"],
      );
      setSupplementaryAdditionalFilePaths(supplementaryAdditionalDocument);

      // Visa Application
      const visaApplicationDocument = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Visa Application Submission"],
      );
      setVisaApplicationFilePaths(visaApplicationDocument);

      // Visa Outcome
      const visaOutcomeDocument = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Visa Outcome Proof"],
      );
      setVisaOutcomeFilePaths(visaOutcomeDocument);
    }
  }, [formData]);

  const personalDetailsFollowupFormik = useFormik({
    initialValues: {
      nextFollowUpDate: oneStudentData?.followUps?.personalDetails
        ?.nextFollowUpDate
        ? formatDate(
            parseDate(
              oneStudentData.followUps.personalDetails.nextFollowUpDate,
            ),
          )
        : "",
      status: oneStudentData?.followUps?.personalDetails?.status || "Pending",
      remarks: oneStudentData?.followUps?.personalDetails?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: PersonalDetailsFollowupValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const parsedDate = parseDate(values.nextFollowUpDate);
      const formattedDate = parsedDate ? toISODate(parsedDate) : "";
      const payload = {
        followUps: {
          personalDetails: {
            nextFollowUpDate: formattedDate,
            remarks: values.remarks,
            status: values.status,
          },
        },
      };
      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Follow-up updated successfully");
        fetchOneVisitorDetails();
      }
    },
  });

  const documentsFollowupFormik = useFormik({
    initialValues: {
      nextFollowUpDate: oneStudentData?.followUps?.documentDetails
        ?.nextFollowUpDate
        ? formatDate(
            parseDate(
              oneStudentData.followUps.documentDetails.nextFollowUpDate,
            ),
          )
        : "",
      status: oneStudentData?.followUps?.documentDetails?.status || "Pending",
      remarks: oneStudentData?.followUps?.documentDetails?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: DocumentDetailsFollowupValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const parsedDate = parseDate(values.nextFollowUpDate);
      const formattedDate = parsedDate ? toISODate(parsedDate) : "";
      const payload = {
        followUps: {
          documentDetails: {
            nextFollowUpDate: formattedDate,
            remarks: values.remarks,
            status: values.status,
          },
        },
      };
      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Follow-up updated successfully");
        fetchOneVisitorDetails();
      }
    },
  });

  const visaApplicationFollowupFormik = useFormik({
    initialValues: {
      nextFollowUpDate: oneStudentData?.followUps?.visaApplication
        ?.nextFollowUpDate
        ? formatDate(
            parseDate(
              oneStudentData.followUps.visaApplication.nextFollowUpDate,
            ),
          )
        : "",
      status: oneStudentData?.followUps?.visaApplication?.status || "Pending",
      remarks: oneStudentData?.followUps?.visaApplication?.remarks || "",
    },
    enableReinitialize: true,
    validationSchema: VisaApplicationFollowupValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const parsedDate = parseDate(values.nextFollowUpDate);
      const formattedDate = parsedDate ? toISODate(parsedDate) : "";
      const payload = {
        followUps: {
          visaApplication: {
            nextFollowUpDate: formattedDate,
            remarks: values.remarks,
            status: values.status,
          },
        },
      };
      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Follow-up updated successfully");
        fetchOneVisitorDetails();
      }
    },
  });

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchPendingDocCountList = async (id) => {
    try {
      const res = await dispatch(pendingVisitorDocList(id));
      if (res?.status === 200) {
        setPendingDocCount(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching pending doc count:", error);
    }
  };

  const sendPendingDocumentMain = (id, selectedDocumentNames) => {
    const toastId = toast.loading("Sending the pending documents email");

    try {
      dispatch(pendingVisitorDocMail(id, selectedDocumentNames))
        .then((res) => {
          if (res?.status === 200) {
            toast.update(toastId, {
              render:
                res?.data?.data || "Pending documents email sent successfully",
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
            setSelectedDocsIds([]);
            setSelectedDocumentNames([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching pending doc count:", error);
        });
    } catch (error) {
      console.error("Error fetching pending doc count:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPendingDocCountList(id);
    }
  }, [id]);

  const visitorInfoFormik = useFormik({
    initialValues: {
      name: oneStudentData?.name || "",
      email: oneStudentData?.email || "",
      contact: oneStudentData?.contact || "",
      DOB: oneStudentData?.DOB || "",
      country: oneStudentData?.country || "",
      city: oneStudentData?.city || "",
      preferredCountry: oneStudentData?.preferredCountry || [],

      address: oneStudentData?.address || "",
      passportNumber: oneStudentData?.passportNumber || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string(),
      email: Yup.string().email("Invalid email"),
      contact: Yup.string(),
      DOB: Yup.string(),
      country: Yup.string(),
      city: Yup.string(),
      preferredCountry: Yup.string(),
      address: Yup.string(),
      passportNumber: Yup.string()
        .matches(/^[A-Za-z0-9]*$/, "Only letters and numbers are allowed")
        .max(12, "Passport Number cannot exceed 12 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
          preferredCountry: values.preferredCountry,
        };
        const res = await dispatch(updateVisitorApplication(payload, id));
        if (res?.status === 200) {
          toast.success("Visitor information updated successfully");
          resetForm();
          setShowVisitorInfoModal(false);
          fetchOneVisitorDetails();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Error updating visitor information",
        );
      }
    },
  });

  if (!visitor || !oneStudentData) {
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
      </>
    );
  }

  const languageExamColumns = [
    { label: "Test Name", render: (item) => item?.testName || "-" },
    {
      label: "Test Date",
      render: (item) =>
        item?.testDate ? formatDate(parseDate(item?.testDate)) : "-",
    },
    {
      label: "Expire Date",
      render: (item) =>
        item?.expireDate ? formatDate(parseDate(item?.expireDate)) : "-",
    },
    { label: "Read Score", render: (item) => item?.readScore || "-" },
    { label: "Write Score", render: (item) => item?.writeScore || "-" },
    { label: "Speak Score", render: (item) => item?.speakScore || "-" },
    { label: "Listen Score", render: (item) => item?.listenScore || "-" },
    { label: "Overall Score", render: (item) => item?.OverallScore || "-" },
    {
      label: "Uploaded Document",
      render: (item) =>
        item?.fileUrl ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() =>
              window.open(
                `${BASEURL}/${item.fileUrl}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
    { label: "Created by", render: (item) => item?.createdByName || "-" },
    { label: "Updated by", render: (item) => item?.updatedByName || "-" },
  ];

  const workExperienceColumns = [
    { label: "Company", render: (item) => item?.company || "-" },
    { label: "Company Address", render: (item) => item?.companyAddress || "-" },
    { label: "Designation", render: (item) => item?.designation || "-" },
    { label: "Job Type", render: (item) => item?.jobType || "-" },
    {
      label: "Uploaded Document",
      render: (item) =>
        item?.fileUrl ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() =>
              window.open(
                `${BASEURL}/${item.fileUrl}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
    { label: "Created by", render: (item) => item?.createdByName || "-" },
    { label: "Updated by", render: (item) => item?.updatedByName || "-" },
  ];

  const aptitudeExamColumns = [
    { label: "Test Name", render: (item) => item.testName || "-" },
    {
      label: "Test Date",
      render: (item) =>
        item?.testDate ? formatDate(parseDate(item?.testDate)) : "-",
    },
    {
      label: "Expire Date",
      render: (item) =>
        item?.expireDate ? formatDate(parseDate(item?.expireDate)) : "-",
    },
    {
      label: "Verbal Reasoning Score",
      render: (item) => item.verbalReasoningScore || "-",
    },
    {
      label: "Quantitive Reasoning Score",
      render: (item) => item.quantitiveReasoningScore || "-",
    },
    {
      label: "Analytical Writing Score",
      render: (item) => item.analyticalWritingScore || "-",
    },
    { label: "Overall Score", render: (item) => item.overallScore || "-" },
    {
      label: "Uploaded Document",
      render: (item) =>
        item?.fileUrl ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() =>
              window.open(
                `${BASEURL}/${item.fileUrl}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
    { label: "Created by", render: (item) => item?.createdByName || "-" },
    { label: "Updated by", render: (item) => item?.updatedByName || "-" },
  ];

  const userAllocation = [
    {
      label: "Role",
      render: (item) => (item.role ? item.role?.name : "-"),
    },
    {
      label: "User",
      render: (item) => (item.user ? item.user?.name : "-"),
    },
    {
      label: "Created by",
      render: (item) => {
        return item ? item.createdByName || "-" : "-";
      },
    },
    {
      label: "Updated by",
      render: (item) => {
        return item ? item.updatedByName || "-" : "-";
      },
    },
  ];
  const visaUserAllocation = [
    {
      label: "Role",
      render: (item) => (item.role ? item.role?.name : "-"),
    },
    {
      label: "User",
      render: (item) => (item.user ? item.user?.name : "-"),
    },
    {
      label: "Created by",
      render: (item) => {
        return item ? item.createdByName || "-" : "-";
      },
    },
    {
      label: "Updated by",
      render: (item) => {
        return item ? item.updatedByName || "-" : "-";
      },
    },
  ];

  // const formatDate = (dateString) => {
  //   if (!dateString) return "-";
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  const AccountantColumns = [
    { label: "Name", key: "name" },
    { label: "Contact No", key: "contactNo" },
    {
      label: "Main Plan",
      key: "mainPlan",
      render: (item) => item.mainPlan?.name,
    },
    { label: "Sub Plan", key: "subPlan", render: (item) => item.subPlan?.name },
    { label: "Amount", key: "amount" },
    { label: "Discount", key: "discount" },
    { label: "Payable Amount", key: "payableAmount" },
    {
      label: "Receive Amount",
      key: "paidAmount",
      render: (item) =>
        item.paidAmount?.length ? (
          <ul className="mb-0">
            {item.paidAmount.map((p) => (
              <li key={p._id}>
                {p.amount} ({formatDate(p.date)})
              </li>
            ))}
          </ul>
        ) : (
          "-"
        ),
    },
    { label: "Receivable Amount", key: "dueAmount" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Payment Mode", key: "paymentMode" },
    { label: "Created By", key: "createdByName" },
    {
      label: "Created At",
      key: "createdAt",
      render: (item) => formatDate(item.createdAt),
    },
  ];

  const handleDocumentUpload = async (
    e,
    docIndex,
    documentIndex,
    documentName,
  ) => {
    setIsLoading(true);
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error("No files selected");
      setIsLoading(false);
      return;
    }

    for (const file of files) {
      const allowedTypes = [
        "image/",
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      ];

      if (!allowedTypes.some((type) => file.type.startsWith(type))) {
        toast.error("Only images, PDFs, Word, and Excel files are allowed");
        setIsLoading(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        setIsLoading(false);
        return;
      }
    }

    try {
      const uploadFormData = new FormData();
      const documentId =
        countryDocuments?.data?.[0]?.documents?.[docIndex]?.documentList?.[
          documentIndex
        ]?.document?._id;
      const documentTypeId =
        countryDocuments?.data?.[0]?.documents?.[docIndex]?.type?._id;

      if (!documentId || !documentTypeId) {
        toast.error("Document ID or Document Type ID not found");
        setIsLoading(false);
        return;
      }

      const existingDoc = oneStudentData?.uploadedDocumentDetails?.find(
        (uploaded) => uploaded.documentName === documentId,
      );

      if (existingDoc) {
        uploadFormData.append("documentId", existingDoc._id);
        uploadFormData.append("customDocumentName", documentName);
      } else {
        uploadFormData.append("documentType", documentTypeId);
        uploadFormData.append("documentName", documentId);
        uploadFormData.append("status", "unverified");
      }

      for (const file of files) {
        uploadFormData.append("uploadedDocument", file);
      }
      const res = await dispatch(updateVisitorApplication(uploadFormData, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
        } else {
          toast.success("Documents uploaded successfully");
          await fetchOneVisitorDetails();
          await fetchPendingDocCountList(id);
        }
      } else {
        toast.error(res?.data?.message || "Only 5 files will be accepted.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Only 5 files will be accepted.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleRemoveDocument = async (documentId) => {
    if (!documentId) {
      toast.error("Invalid document detail. Cannot delete.");
      return;
    }

    try {
      const res = await dispatch(deleteVisitorApplication({ documentId }, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Document deleted successfully");
        setOneStudentData((prev) => ({
          ...prev,
          uploadedDocumentDetails: prev.uploadedDocumentDetails.filter(
            (doc) => doc?._id !== documentId,
          ),
        }));
        setOtherDocuments((prev) =>
          prev.filter((doc) => doc?._id !== documentId),
        );
        await fetchOneVisitorDetails();
        await fetchPendingDocCountList(id);
      } else {
        toast.error(res?.data?.message || "Error deleting document");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting document");
    }
  };

  const handleCheckboxChange = (
    docIndex,
    index,
    typeKey,
    uploadedDocId,
    rowKey,
  ) => {
    setSelectedRows((prev) => {
      const newRowKey =
        typeKey === "other"
          ? `other--1-${index}`
          : typeKey === "rgdocument"
            ? `rgdocument--1-${index}`
            : typeKey === "visadocuments"
              ? `visadocuments--1-${index}`
              : rowKey;

      const newSelected = { ...prev, [newRowKey]: !prev[newRowKey] };

      const currentIds = prev[typeKey] ? [...prev[typeKey]] : [];
      let newSelectedIdsForType;

      if (uploadedDocId) {
        if (newSelected[newRowKey]) {
          newSelectedIdsForType = [...currentIds, uploadedDocId];
        } else {
          newSelectedIdsForType = currentIds.filter(
            (id) => id !== uploadedDocId,
          );
        }
      } else {
        newSelectedIdsForType = currentIds;
      }

      const newSelectedIds = {
        ...prev,
        [typeKey]: newSelectedIdsForType,
      };

      let allCheckedForType;
      if (docIndex === -1 && typeKey === "other") {
        const excludedDocuments = [
          "Application Submission Form",
          "Fee Payment Proof",
          "Conditional Offer Letter",
          "Unconditional Offer Letter",
          "Compulsory Agreement Document",
          "Visa Fee Payment",
          "Appointment Letter",
          "Biometrics Receipt",
          "PIC Decision",
          "D Visa Document",
          "Supplementary Additional",
          "Visa Application Submission",
          "Visa Outcome Proof",
        ];
        const otherDocs =
          oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
            const isCategorized = countryDocuments?.data?.[0]?.documents?.some(
              (catDoc) =>
                catDoc.documentList?.some((d) => d?._id === doc.documentName),
            );
            return (
              (doc.customDocumentName || !isCategorized) &&
              !excludedDocuments?.includes(doc.customDocumentName)
            );
          }) || [];

        allCheckedForType = otherDocs?.every((doc, idx) => {
          if (!doc?._id || doc.status === "Reupload") return true;
          return newSelected[`other--1-${idx}`];
        });
      } else if (docIndex === -1 && typeKey === "rgdocument") {
        const allowedDocuments = [
          "Application Submission Form",
          "Fee Payment Proof",
          "Conditional Offer Letter",
          "Unconditional Offer Letter",
          "Compulsory Agreement Document",
        ];
        const rgDocs =
          oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
            return (
              doc.customDocumentName &&
              allowedDocuments?.includes(doc.customDocumentName)
            );
          }) || [];
        allCheckedForType = rgDocs?.every((doc, idx) => {
          if (!doc?._id || doc.status === "Reupload") return true;
          return newSelected[`rgdocument--1-${idx}`];
        });
      } else if (docIndex === -1 && typeKey === "visadocuments") {
        const allowedDocuments = [
          "Visa Fee Payment",
          "Appointment Letter",
          "Biometrics Receipt",
          "PIC Decision",
          "D Visa Document",
          "Supplementary Additional",
          "Visa Application Submission",
          "Visa Outcome Proof",
        ];
        const visaDocs =
          oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
            return (
              doc.customDocumentName &&
              allowedDocuments?.includes(doc.customDocumentName)
            );
          }) || [];
        allCheckedForType = visaDocs?.every((doc, idx) => {
          if (!doc?._id || doc.status === "Reupload") return true;
          return newSelected[`visadocuments--1-${idx}`];
        });
      } else {
        const typeDocuments =
          countryDocuments?.data?.[0]?.documents?.[docIndex]?.documentList ||
          [];
        allCheckedForType = typeDocuments?.every((document, idx) => {
          const uploadedDocs =
            oneStudentData?.uploadedDocumentDetails?.filter(
              (uploaded) => uploaded.documentName === document?.document?._id,
            ) || [];
          if (!uploadedDocs || uploadedDocs.length === 0) return true;
          return uploadedDocs?.every((doc, uploadIdx) => {
            if (!doc?._id || doc.status === "Reupload") return true;
            return newSelected[`${docIndex}-${idx}-${uploadIdx}`];
          });
        });
      }

      setSelectAllByType((prev) => ({
        ...prev,
        [typeKey]: allCheckedForType,
      }));

      setSelectedIds(newSelectedIds);

      return newSelected;
    });
  };

  const handleSelectAllChange = (docIndex, typeKey) => {
    const newSelectAll = !selectAllByType[typeKey];

    setSelectAllByType((prev) => ({
      ...prev,
      [typeKey]: newSelectAll,
    }));

    const newSelectedRows = { ...selectedRows };
    let newSelectedIdsForType = [];

    if (docIndex === -1 && typeKey === "other") {
      const excludedDocuments = [
        "Application Submission Form",
        "Fee Payment Proof",
        "Conditional Offer Letter",
        "Unconditional Offer Letter",
        "Compulsory Agreement Document",
        "Visa Fee Payment",
        "Appointment Letter",
        "Biometrics Receipt",
        "PIC Decision",
        "D Visa Document",
        "Supplementary Additional",
        "Visa Application Submission",
        "Visa Outcome Proof",
      ];
      const otherDocs =
        oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
          const isCategorized = countryDocuments?.data?.[0]?.documents?.some(
            (catDoc) =>
              catDoc.documentList?.some((d) => d?._id === doc.documentName),
          );
          return (
            (doc.customDocumentName || !isCategorized) &&
            !excludedDocuments?.includes(doc.customDocumentName)
          );
        }) || [];

      otherDocs?.forEach((doc, index) => {
        const key = `other--1-${index}`;
        if (doc?._id && doc.status !== "Reupload") {
          newSelectedRows[key] = newSelectAll;
          if (newSelectAll) {
            newSelectedIdsForType.push(doc?._id);
          }
        } else {
          newSelectedRows[key] = false;
        }
      });
    } else if (docIndex === -1 && typeKey === "rgdocument") {
      const allowedDocuments = [
        "Application Submission Form",
        "Fee Payment Proof",
        "Conditional Offer Letter",
        "Unconditional Offer Letter",
        "Compulsory Agreement Document",
      ];
      const rgDocs =
        oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
          return (
            doc.customDocumentName &&
            allowedDocuments?.includes(doc.customDocumentName)
          );
        }) || [];

      rgDocs?.forEach((doc, index) => {
        const key = `rgdocument--1-${index}`;
        if (doc?._id && doc.status !== "Reupload") {
          newSelectedRows[key] = newSelectAll;
          if (newSelectAll) {
            newSelectedIdsForType.push(doc?._id);
          }
        } else {
          newSelectedRows[key] = false;
        }
      });
    } else if (docIndex === -1 && typeKey === "visadocuments") {
      const allowedDocuments = [
        "Visa Fee Payment",
        "Appointment Letter",
        "Biometrics Receipt",
        "PIC Decision",
        "D Visa Document",
        "Supplementary Additional",
        "Visa Application Submission",
        "Visa Outcome Proof",
      ];
      const visaDocs =
        oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
          return (
            doc.customDocumentName &&
            allowedDocuments?.includes(doc.customDocumentName)
          );
        }) || [];

      visaDocs?.forEach((doc, index) => {
        const key = `visadocuments--1-${index}`;
        if (doc?._id && doc.status !== "Reupload") {
          newSelectedRows[key] = newSelectAll;
          if (newSelectAll) {
            newSelectedIdsForType.push(doc?._id);
          }
        } else {
          newSelectedRows[key] = false;
        }
      });
    } else {
      countryDocuments?.data?.[0]?.documents?.[docIndex]?.documentList?.forEach(
        (document, index) => {
          const uploadedDocs = oneStudentData?.uploadedDocumentDetails?.filter(
            (uploaded) => uploaded.documentName === document?.document._id,
          );

          if (uploadedDocs && uploadedDocs?.length > 0) {
            uploadedDocs?.forEach((uploadedDoc, uploadIndex) => {
              const key = `${docIndex}-${index}-${uploadIndex}`;
              if (uploadedDoc?._id && uploadedDoc?.status !== "Reupload") {
                newSelectedRows[key] = newSelectAll;
                if (newSelectAll) {
                  newSelectedIdsForType.push(uploadedDoc?._id);
                }
              } else {
                newSelectedRows[key] = false;
              }
            });
          } else {
            const key = `${docIndex}-${index}`;
            newSelectedRows[key] = false;
          }
        },
      );
    }
    setSelectedRows(newSelectedRows);
    setSelectedIds((prev) => ({
      ...prev,
      [typeKey]: newSelectAll ? newSelectedIdsForType : [],
    }));
  };
  // const handleSingleDocumentDownload = async (uploadedDoc, fileName) => {
  //   try {
  //     let downloadUrl = uploadedDoc?.filePath;
  //     let downloadFileName = fileName;

  //     // Validate URL
  //     if (!downloadUrl || !downloadUrl.startsWith("http")) {
  //       throw new Error("Invalid or missing file URL");
  //     }

  //     // Check if fileName has an extension
  //     const hasExtension = /\.[^/.]+$/.test(fileName);
  //     const fileExtension = hasExtension
  //       ? fileName.split(".").pop().toLowerCase()
  //       : "";

  //     // Determine if the file is an image based on extension
  //     const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtension);

  //     if (isImage) {
  //       // Handle image and force download as PNG
  //       downloadFileName = hasExtension
  //         ? fileName.replace(/\.[^/.]+$/, "") + ".png"
  //         : fileName + ".png";
  //       const response = await fetch(downloadUrl, {
  //         method: "GET",
  //         headers: { Accept: "image/*" },
  //       });
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch image");
  //       }
  //       const blob = await response.blob();
  //       downloadUrl = window.URL.createObjectURL(blob);
  //     } else {
  //       // Handle non-image files (e.g., PDF) as their original type
  //       downloadFileName = hasExtension ? fileName : fileName + ".pdf";
  //       const response = await fetch(downloadUrl, {
  //         method: "GET",
  //         headers: { Accept: "*/*" },
  //       });
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch file");
  //       }
  //       const blob = await response.blob();
  //       downloadUrl = window.URL.createObjectURL(blob);
  //     }

  //     // Fallback file name if none provided
  //     if (!fileName) {
  //       downloadFileName = isImage
  //         ? "downloaded_image.png"
  //         : "downloaded_document.pdf";
  //     }

  //     const link = document.createElement("a");
  //     link.href = downloadUrl;
  //     link.setAttribute("download", downloadFileName);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     // Clean up
  //     window.URL.revokeObjectURL(downloadUrl);

  //     toast.success("File downloaded successfully");
  //   } catch (error) {
  //     toast.error("Error downloading file");
  //     console.error("Download error:", error);
  //   }
  // };
  // const handleSingleDocumentDownload = async (
  //   visitorId,
  //   documentId,
  //   fileName
  // ) => {
  //   setIsLoading(true);

  //   try {
  //     const res = await dispatch(
  //       downloadVisitorDocument(visitorId, documentId)
  //     );

  //     if (res?.status === 200) {
  //       const contentType =
  //         res.headers["content-type"] || "application/octet-stream";
  //       const blob = new Blob([res.data], { type: contentType });
  //       const url = window.URL.createObjectURL(blob);

  //       const link = document.createElement("a");
  //       link.href = url;

  //       let downloadFileName = fileName || "document";
  //       const contentDisposition = res.headers["content-disposition"];
  //       if (!fileName && contentDisposition) {
  //         const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
  //         if (fileNameMatch && fileNameMatch[1]) {
  //           downloadFileName = fileNameMatch[1];
  //         }
  //       } else if (!fileName) {
  //         if (contentType.includes("image/jpeg")) {
  //           downloadFileName = "downloaded_image.jpg";
  //         } else if (contentType.includes("image/png")) {
  //           downloadFileName = "downloaded_image.png";
  //         } else if (contentType.includes("image/gif")) {
  //           downloadFileName = "downloaded_image.gif";
  //         } else {
  //           downloadFileName = "downloaded_image.unknown";
  //         }
  //       }

  //       link.setAttribute("download", downloadFileName);
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(url);

  //       toast.success("Image downloaded successfully");
  //     } else {
  //       toast.error(res?.data?.message || "Error downloading image");
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "No valid documents found");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSingleDocumentDownload = async (filePath, fileName) => {
    try {
      if (!filePath) {
        toast.error("File path not found");
        return;
      }

      // ✅ Ensure the file URL is absolute (important!)
      let fileUrl = filePath;
      if (!fileUrl.startsWith("http") && !fileUrl.startsWith("https")) {
        // 👉 Replace with your backend/server base URL
        // Example for local:
        fileUrl = `${BASEURL}/${filePath}`;
        // Example for production:
        // fileUrl = `https://yourdomain.com/${filePath}`;
      }

      // ✅ Fetch the file as binary data
      const response = await fetch(fileUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Unable to download file. File not found on server.");
      }

      // ✅ Convert to blob (binary data)
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // ✅ Clean and decode file name
      let downloadFileName = decodeURIComponent(
        fileName?.trim() || fileUrl.split("/").pop() || "downloaded_file",
      );

      // ✅ Add extension if missing
      const contentType = blob.type;
      if (!/\.[a-zA-Z0-9]+$/.test(downloadFileName)) {
        if (contentType.includes("jpeg")) downloadFileName += ".jpg";
        else if (contentType.includes("png")) downloadFileName += ".png";
        else if (contentType.includes("pdf")) downloadFileName += ".pdf";
        else downloadFileName += ".file";
      }

      // ✅ Create temporary link to trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", downloadFileName);
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Error downloading file");
    }
  };

  const handleAlldownloadVisitorDocument = async (visitorId, documentIds) => {
    setIsLoading(true);
    if (documentIds.length === 0) {
      toast.error("Please select at least one document to download");
      return;
    }

    try {
      const ids = documentIds.join(",");
      const res = await dispatch(downloadVisitorDocument(visitorId, ids));

      if (res?.status === 200) {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"] || "application/zip",
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        const contentDisposition = res.headers["content-disposition"];
        let fileName = "documents.zip";
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        }
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Documents downloaded successfully");
        setSelectedIds([]);
        setSelectedRows({});
        setSelectAllByType({});
      } else {
        toast.error(res?.data?.message || "Error downloading documents");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error downloading documents",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllDocumentsDownload = async (visitorId) => {
    setIsLoading(true);
    try {
      const allDocIds = [];

      countryDocuments?.data?.[0]?.documents?.forEach((doc) => {
        doc.documentList?.forEach((document) => {
          const uploadedDocs = oneStudentData?.uploadedDocumentDetails?.filter(
            (uploaded) => uploaded?.documentName === document?._id,
          );
          uploadedDocs?.forEach((uploadedDoc) => {
            if (uploadedDoc.status !== "Reupload") {
              allDocIds?.push(uploadedDoc?._id);
            }
          });
        });
      });

      oneStudentData?.uploadedDocumentDetails?.forEach((doc) => {
        const isCategorized = countryDocuments?.data?.[0]?.documents?.some(
          (catDoc) =>
            catDoc.documentList?.some((d) => d?._id === doc?.documentName),
        );
        if (
          (doc.customDocumentName || !isCategorized) &&
          doc.status !== "Reupload"
        ) {
          allDocIds?.push(doc?._id);
        }
      });

      if (allDocIds.length === 0) {
        toast.error("No documents available to download");
        return;
      }

      const ids = allDocIds.join(",");
      const res = await dispatch(downloadVisitorDocument(visitorId, ids));

      if (res?.status === 200) {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"] || "application/zip",
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        const contentDisposition = res.headers["content-disposition"];
        let fileName = "all_documents.zip";
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        }
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("All documents downloaded successfully");
      } else {
        toast.error(res?.data?.message || "Error downloading all documents");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error downloading all documents",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtherDocUpload = async (e, index, documentId, docName) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setIsLoading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("uploadedDocument", file);
      uploadFormData.append("documentId", documentId);
      uploadFormData.append("customDocumentName", docName);

      const res = await dispatch(updateVisitorApplication(uploadFormData, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
        } else {
          toast.success("File uploaded successfully");
          await fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error uploading document");
      }
      setReuploadDocIndex(index);
    } catch (error) {
      toast.error("Error preparing file for reupload");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (documentId) => {
    try {
      setIsLoading(true);
      const payload = {
        documentId,
        documentUpdate: {
          status: selectedStatus.value,
          remarks,
        },
      };
      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Status updated successfully");
        setShowModal(false);
        setSelectedStatus(null);
        setRemarks("");
        setSelectedDocId(null);
        await fetchOneVisitorDetails();
      } else {
        toast.error(res?.data?.message || "Error updating status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisitorStatusChange = async (selectedOption) => {
    setSelectedVisitorStatus(selectedOption);
    try {
      const payload = {
        mainStatus: selectedOption.value,
      };
      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Visitor status updated successfully");
        await fetchOneVisitorDetails();
      } else {
        toast.error(res?.data?.message || "Error updating visitor status");
        setSelectedVisitorStatus(null);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating visitor status",
      );
      setSelectedVisitorStatus(null);
    }
  };

  const handleMainTabStatusChange = async (opt) => {
    setSelectedApplicationStatus(opt);
    let payload = {};
    if (activeTab === "personal") {
      payload.personalDetailStatus = opt.value;
    } else if (activeTab === "document") {
      payload.documentDetailStatus = opt.value;
    }

    try {
      const res = await dispatch(updateVisitorApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Application status updated successfully");
        await fetchOneVisitorDetails();
      } else {
        toast.error(res?.data?.message || "Error updating status");
      }
    } catch (error) {
      console.error("Failed to update application status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "#28a745";
      case "unverified":
        return "#ffc107";
      case "Reupload":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const docTypeOptions = [
    ...(countryDocuments?.data?.[0]?.documents
      ?.map((doc) => ({
        value: doc.type?._id,
        label: doc.type?.name || `UnnamedType_${doc.type?._id}`,
      }))
      ?.sort((a, b) => a.label.localeCompare(b.label)) || []),
    { value: "others", label: "Others" },
  ];

  const documentNames =
    selectedDocType?.value && selectedDocType.value !== "others"
      ? [
          ...(countryDocuments?.data?.[0]?.documents
            ?.find((doc) => doc.type?._id === selectedDocType.value)
            ?.documentList?.map((doc) => ({
              value: doc.document._id,
              label: doc.document.name || "Unnamed Document",
            }))
            ?.sort((a, b) => a.label.localeCompare(b.label)) || []),
          { value: "others", label: "Others" },
        ]
      : [{ value: "others", label: "Others" }];

  const handleDocTypeChange = (selectedOption) => {
    setSelectedDocType(selectedOption);
    setSelectedDocumentName(null);
    setCustomDocName("");
  };

  const handleDocNameChange = (selectedOption) => {
    setSelectedDocumentName(selectedOption);
    setCustomDocName("");
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
      border: base.isFocused ? "2px solid #5D54BE" : "2px solid #a5b4fc",
      borderRadius: "12px",
      color: "black",
      minWidth: "140px !important",
    }),
    placeholder: (base) => ({
      ...base,
      color: "black",
      fontSize: "13px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1f2937",
      fontSize: "14px",
      fontWeight: "500",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#5D54BE" : "#a5b4fc",
      "&:hover": {
        color: "#5D54BE",
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#a5b4fc",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#5D54BE"
        : state.isFocused
          ? "#e0e7ff"
          : "white",
      color: state.isSelected ? "#ffffff" : "#1f2937",
      padding: "10px 15px",
      fontSize: "14px",
      fontWeight: "500",
    }),
  };

  const isUserAllocated = formData?.userAllocationDetails?.some(
    (allocation) => {
      return allocation.user?._id === currentUserId;
    },
  );
  const showApplicationStatusSelect =
    activeTab === "document" && (userRole === "Super Admin" || isUserAllocated);
  return (
    <>
      <div>
        <div className="form-main-heading w-100 p-2 position-sticky top-0 z-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3>Visitor Details</h3>
            <Button
              variant="link"
              onClick={() =>
                navigate("/student/visitorapplication", {
                  state: location.state,
                })
              }
              className="text-light"
            >
              <AiOutlineClose size={20} />
            </Button>
          </div>
        </div>

        <Card
          className="custom-card transcation-crypto mb-0"
          style={{
            minHeight: "94vh",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
          }}
        >
          <Card.Header className="border-bottom-0 d-flex justify-content-between">
            <div className="card-title">Visitor Information</div>
          </Card.Header>

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
          <div className="mx-4">
            <VisitorInfo
              visitor={visitor}
              setShowVisitorInfoModal={setShowVisitorInfoModal}
              visitorStatusOptions={visitorStatusOptions}
              selectedVisitorStatus={selectedVisitorStatus}
              handleVisitorStatusChange={handleVisitorStatusChange}
              userRole={userRole}
              userType={userType}
              showVisitorInfoModal={showVisitorInfoModal}
              visitorInfoFormik={visitorInfoFormik}
              countries={countries}
            />

            {/* <ProgressSteps id={id} /> */}

            {/* Tabs */}
            <VisitorTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedPersonalSection={selectedPersonalSection}
              selectedDocType={selectedDocType}
              selectedVisaSection={selectedVisaSection}
              selectedAccountantSection={selectedAccountantSection}
              documentTypes={countryDocuments?.data?.[0]?.documents || []}
              onDocumentTypeSelect={handleDocumentTypeSelect}
              onPersonalSectionSelect={handlePersonalSectionSelect}
              onVisaSectionSelect={handleVisaSectionSelect}
              onAccountantSelect={handleAccountantSelect}
              submittedTabs={oneStudentData?.submittedTabs || []}
              userRole={userRole}
              userType={userType}
              pendingDocCount={pendingDocCount}
              applicationstatusoptions={applicationstatusoptions}
              selectedApplicationStatus={selectedApplicationStatus}
              handleMainTabStatusChange={handleMainTabStatusChange}
              customStyles={customStyles}
              showApplicationStatusSelect={showApplicationStatusSelect}
              sendPendingDocumentMain={sendPendingDocumentMain}
              selectedDocumentNames={selectedDocumentNames}
              selectedDocsIds={selectedDocsIds}
              formData={formData}
              handleFollowUpToggle={handleFollowUpToggle}
            />

            <Modal show={showFollowUpModal} onHide={handleModalClose} centered>
              <Modal.Header className="form-main-heading">
                <Modal.Title>
                  Follow Up -{" "}
                  <span className=" text-capitalize">
                    {activeTabForModal?.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleModalClose}
                />
              </Modal.Header>
              <Modal.Body>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formik = getFormikForTab();
                    if (formik) formik.handleSubmit(e);
                    handleModalClose();
                  }}
                >
                  <div className="p-3">
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group controlId="followUpDate">
                          <Form.Label>Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              className="form-control custom-select-height"
                              name="nextFollowUpDate"
                              placeholder="dd/mm/yyyy"
                              value={
                                getFormikForTab()?.values.nextFollowUpDate
                                  ? formatDate(
                                      parseDate(
                                        getFormikForTab()?.values
                                          .nextFollowUpDate,
                                      ),
                                    )
                                  : ""
                              }
                              readOnly
                              onClick={(e) => {
                                e.preventDefault();
                                if (activeTabForModal === "personal")
                                  setPersonalDetailsCalendar(true);
                                else if (activeTabForModal === "document")
                                  setDocumentCalendar(true);
                                else if (
                                  activeTabForModal === "visaApplication"
                                )
                                  setVisaApplicationCalendar(true);
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                                paddingRight: "40px",
                              }}
                            />
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
                            {((personalDetailsCalendar &&
                              activeTabForModal === "personal") ||
                              (documentCalendar &&
                                activeTabForModal === "document") ||
                              (visaApplicationCalendar &&
                                activeTabForModal === "visaApplication")) && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: 0,
                                  zIndex: 10000,
                                  background: "#fff",
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                  borderRadius: "8px",
                                  marginTop: "4px",
                                  width: 300,
                                }}
                              >
                                <Calendar
                                  className="form-control border-0"
                                  onChange={(selectedDate) =>
                                    handleDateChange(
                                      selectedDate,
                                      getFormikForTab(),
                                    )
                                  }
                                  value={
                                    parseDate(
                                      getFormikForTab()?.values
                                        .nextFollowUpDate,
                                    ) || null
                                  }
                                  locale="en-GB"
                                  onClickOutside={() => {
                                    if (activeTabForModal === "personal")
                                      setPersonalDetailsCalendar(false);
                                    else if (activeTabForModal === "document")
                                      setDocumentCalendar(false);
                                    else if (
                                      activeTabForModal === "visaApplication"
                                    )
                                      setVisaApplicationCalendar(false);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group controlId="followUpStatus">
                          <Form.Label>Status</Form.Label>
                          <Select
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "8px",
                                borderColor: "#ced4da",
                                boxShadow: "none",
                                "&:hover": { borderColor: "#adb5bd" },
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "#888",
                                fontSize: "14px",
                              }),
                            }}
                            classNamePrefix="custom-select"
                            options={[
                              { value: "Pending", label: "Pending" },
                              { value: "Processing", label: "Processing" },
                              { value: "Closed", label: "Closed" },
                            ]}
                            value={
                              getFormikForTab()?.values.status
                                ? {
                                    value: getFormikForTab()?.values.status,
                                    label: getFormikForTab()?.values.status,
                                  }
                                : null
                            }
                            onChange={(option) => {
                              getFormikForTab()?.setFieldValue(
                                "status",
                                option ? option.value : "",
                              );
                            }}
                            placeholder="Select Status"
                            isClearable
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group controlId="followUpRemark">
                          <Form.Label>Remark</Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control filter-height"
                            placeholder="Enter remark"
                            name="remarks"
                            value={getFormikForTab()?.values.remarks || ""}
                            onChange={getFormikForTab()?.handleChange}
                            onBlur={getFormikForTab()?.handleBlur}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-primary"
                  onClick={handleModalClose}
                  className="custom-select-height"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    getFormikForTab()?.handleSubmit();
                    handleModalClose();
                  }}
                  className="custom-select-height"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            {activeTab === "personal" && (
              <>
                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "education") && (
                  <EducationSection
                    formData={formData}
                    edit={edit}
                    setEdit={setEdit}
                    setShowEducationModal={setShowEducationModal}
                    handleDocumentUploadEducation={
                      handleDocumentUploadEducation
                    }
                    countryDocuments={countryDocuments}
                    oneStudentData={oneStudentData}
                    showEducationModal={showEducationModal}
                    docTypeOptions={docTypeOptions}
                    handleDocTypeChange={handleDocTypeChange}
                    selectedDocType={selectedDocType}
                    setSelectedDocType={setSelectedDocType}
                    documentNames={documentNames}
                    handleDocNameChange={handleDocNameChange}
                    selectedDocumentName={selectedDocumentName}
                    setSelectedFile={setSelectedFile}
                    customDocName={customDocName}
                    setCustomDocName={setCustomDocName}
                    setSelectedDocumentName={setSelectedDocumentName}
                    id={id}
                    selectedFile={selectedFile}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    setFormData={setFormData}
                    mode="visitor"
                  />
                )}
                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "languageExam") && (
                  <LanguageEntranceExam
                    formData={formData}
                    edit={edit}
                    setEdit={setEdit}
                    setShowLanguageModal={setShowLanguageModal}
                    languageExamColumns={languageExamColumns}
                    handleDocumentUploadEducation={
                      handleDocumentUploadEducation
                    }
                    countryDocuments={countryDocuments}
                    oneStudentData={oneStudentData}
                    showLanguageModal={showLanguageModal}
                    docTypeOptions={docTypeOptions}
                    handleDocTypeChange={handleDocTypeChange}
                    selectedDocType={selectedDocType}
                    documentNames={documentNames}
                    handleDocNameChange={handleDocNameChange}
                    selectedDocumentName={selectedDocumentName}
                    setSelectedDocType={setSelectedDocType}
                    setSelectedFile={setSelectedFile}
                    setCustomDocName={setCustomDocName}
                    customDocName={customDocName}
                    setSelectedDocumentName={setSelectedDocumentName}
                    id={id}
                    selectedFile={selectedFile}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    setFormData={setFormData}
                    mode="visitor"
                  />
                )}
                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "aptitudeExam") && (
                  <AptitudeExamSection
                    formData={formData}
                    aptitudeExamFormik={aptitudeExamFormik}
                    edit={edit}
                    setEdit={setEdit}
                    setShowAptitudeModal={setShowAptitudeModal}
                    handleDeleteAptitudeExam={handleDeleteAptitudeExam}
                    aptitudeExamColumns={aptitudeExamColumns}
                    showAptitudeModal={showAptitudeModal}
                    docTypeOptions={docTypeOptions}
                    handleDocTypeChange={handleDocTypeChange}
                    selectedDocType={selectedDocType}
                    documentNames={documentNames}
                    handleDocNameChange={handleDocNameChange}
                    selectedDocumentName={selectedDocumentName}
                    setSelectedFile={setSelectedFile}
                    customDocName={customDocName}
                    setSelectedDocType={setSelectedDocType}
                    setSelectedDocumentName={setSelectedDocumentName}
                    setCustomDocName={setCustomDocName}
                    id={id}
                    selectedFile={selectedFile}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    setFormData={setFormData}
                    mode="visitor"
                  />
                )}
                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "workExperience") && (
                  <WorkExperience
                    formData={formData}
                    workExperienceFormik={workExperienceFormik}
                    edit={edit}
                    setEdit={setEdit}
                    setShowWorkModal={setShowWorkModal}
                    handleDeleteWorkExperience={handleDeleteWorkExperience}
                    workExperienceColumns={workExperienceColumns}
                    showWorkModal={showWorkModal}
                    docTypeOptions={docTypeOptions}
                    handleDocTypeChange={handleDocTypeChange}
                    selectedDocType={selectedDocType}
                    documentNames={documentNames}
                    handleDocNameChange={handleDocNameChange}
                    selectedDocumentName={selectedDocumentName}
                    setSelectedDocType={setSelectedDocType}
                    setSelectedFile={setSelectedFile}
                    setSelectedDocumentName={setSelectedDocumentName}
                    setCustomDocName={setCustomDocName}
                    customDocName={customDocName}
                    id={id}
                    selectedFile={selectedFile}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    setFormData={setFormData}
                    mode="visitor"
                  />
                )}

                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "categoryDetails") && (
                  <CategoryDetails
                    formData={formData}
                    setFormData={setFormData}
                    edit={edit}
                    setEdit={setEdit}
                    countries={countries}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                  />
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header className="form-main-heading">
                    <Modal.Title>Update Status</Modal.Title>
                    <AiOutlineClose
                      size={20}
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => setShowModal(false)}
                    />
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="statusSelect">
                        <Form.Label>Status</Form.Label>
                        <Select
                          options={statusOptions}
                          value={selectedStatus}
                          onChange={(opt) => setSelectedStatus(opt)}
                          placeholder="Select Status"
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
                      </Form.Group>

                      <Form.Group controlId="remarksInput" className="mt-3">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Enter remarks"
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>

                  <Modal.Footer>
                    <Button
                      variant="link"
                      className="btn border-primary text-primary text-decoration-none"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedDocId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleStatusChange(selectedDocId)}
                    >
                      Save
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal show={!!previewFile} onHide={closePreviewModal} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>File Preview</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {previewFile && (
                      <>
                        {previewFile.name?.toLowerCase().endsWith(".pdf") ? (
                          <embed
                            src={previewFile.url}
                            type="application/pdf"
                            width="100%"
                            height="480px"
                            style={{
                              border: "none",
                            }}
                          />
                        ) : (
                          <img
                            src={previewFile.url}
                            title="Image Preview"
                            style={{
                              width: "100%",
                              maxWidth: "480px",
                              maxHeight: "480px",
                              objectFit: "contain",
                              border: "none",
                            }}
                            alt="File Preview"
                          />
                        )}
                      </>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={closePreviewModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}

            {activeTab === "document" && (
              <>
                {(selectedDocType !== "documentFollowUp" &&
                  selectedDocType !== "all" &&
                  selectedDocType !== "other" &&
                  selectedDocType !== "rgdocument" &&
                  selectedDocType !== "visadocuments") ||
                selectedDocType === "all" ||
                selectedDocType === "other" ||
                selectedDocType === "rgdocument" ||
                selectedDocType === "visadocuments" ? (
                  <DocumentSection
                    id={id}
                    selectedIds={selectedIds}
                    selectedDocType={selectedDocType}
                    countryDocuments={countryDocuments}
                    oneStudentData={oneStudentData}
                    selectedDocsIds={selectedDocsIds}
                    selectedDocId={selectedDocId}
                    setSelectedDocId={setSelectedDocId}
                    showOtherDocModal={showOtherDocModal}
                    reuploadDocIndex={reuploadDocIndex}
                    handleOtherDocSubmit={handleOtherDocSubmit}
                    otherDocName={otherDocName}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    selectedStatus={selectedStatus}
                    statusOptions={statusOptions}
                    remarks={remarks}
                    setRemarks={setRemarks}
                    selectAllByType={selectAllByType}
                    selectedRows={selectedRows}
                    handleSelectAllChange={handleSelectAllChange}
                    handleDocumentUpload={handleDocumentUpload}
                    getStatusColor={getStatusColor}
                    activeTab={activeTab}
                    showApplicationStatusSelect={showApplicationStatusSelect}
                    handleSingleDocumentDownload={handleSingleDocumentDownload}
                    setSelectedStatus={setSelectedStatus}
                    handleStatusChange={handleStatusChange}
                    setSelectedItem={setSelectedItem}
                    setShowDeleteModal={setShowDeleteModal}
                    handleCheckboxChangeId={handleCheckboxChangeId}
                    setOtherDocName={setOtherDocName}
                    setReuploadDocIndex={setReuploadDocIndex}
                    setShowOtherDocModal={setShowOtherDocModal}
                    setOtherDocFile={setOtherDocFile}
                    handleAlldownloadVisitorDocument={
                      handleAlldownloadVisitorDocument
                    }
                    handleCheckboxChange={handleCheckboxChange}
                    handleOtherDocUpload={handleOtherDocUpload}
                    handleAllDocumentsDownload={handleAllDocumentsDownload}
                  />
                ) : null}
              </>
            )}

            {activeTab === "visaApplication" && (
              <>
                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "visaStageInitiation") && (
                  <div className="my-5 p-4 bg-light rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>Visa Stage Initiation</h5>
                      <span
                        style={{
                          color: "green",
                          fontSize: "16px",
                          letterSpacing: "1px",
                        }}
                      >
                        <strong>
                          {formData?.visaApplicationDetails?.status}
                        </strong>
                      </span>
                    </div>
                  </div>
                )}
                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "visaAllocation") && (
                  <div>
                    <VisaUserAllocationSection
                      visaUserAllocation={visaUserAllocation}
                      formData={formData}
                      edit={edit}
                      setEdit={setEdit}
                      showVisaAllocationModal={showVisaAllocationModal}
                      getAllRollList={getAllRollList}
                      allUser={allUser}
                      setShowVisaAllocationModal={setShowVisaAllocationModal}
                      setAllUser={setAllUser}
                      fetchAllUser={fetchAllUser}
                      id={id}
                      mode="visitor"
                      fetchOneVisitorDetails={fetchOneVisitorDetails}
                      setFormData={setFormData}
                    />
                  </div>
                )}
                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "vfsAppointmentDate") && (
                  <>
                    <VFSAppointment
                      id={id}
                      formatDate={formatDate}
                      parseDate={parseDate}
                      formData={formData}
                      toISODate={toISODate}
                      fetchOneVisitorDetails={fetchOneVisitorDetails}
                      mode="visitor"
                      userRole={userRole}
                    />
                  </>
                )}
                {(selectedVisaSection === "all" ||
                  selectedVisaSection ===
                    "visaApplicationOnlineSubmission") && (
                  <VisaApplicationOnlineSub
                    visaApplicationFilePaths={visaApplicationFilePaths}
                    visaApplicationSubmissionFormik={
                      visaApplicationSubmissionFormik
                    }
                    isLoading={isLoading}
                    handleFileChange={handleFileChange}
                    userRole={userRole}
                    formData={formData}
                    selectedDocsIds={selectedDocsIds}
                    DownloadIcon={DownloadIcon}
                    getStatusColor={getStatusColor}
                    setSelectedItem={setSelectedItem}
                    setShowDeleteModal={setShowDeleteModal}
                    setSelectedStatus={setSelectedStatus}
                    statusOptions={statusOptions}
                    setRemarks={setRemarks}
                    setSelectedDocId={setSelectedDocId}
                    setShowModal={setShowModal}
                    handleOtherDocUpload={handleOtherDocUpload}
                    handleSingleDocumentDownload={handleSingleDocumentDownload}
                    id={id}
                    handleCheckboxChangeId={handleCheckboxChangeId}
                    sendPendingDocumentMain={sendPendingDocumentMain}
                    selectedDocumentNames={selectedDocumentNames}
                    showModal={showModal}
                    selectedStatus={selectedStatus}
                    remarks={remarks}
                    handleStatusChange={handleStatusChange}
                    selectedDocId={selectedDocId}
                    mode="visitor"
                  />
                )}
                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "fileHandover") && (
                  <div className="my-5 p-4 bg-light rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>File Handover</h5>
                    </div>

                    <div className="bg-white mt-3 p-3">
                      <Form onSubmit={fileHandoverFormik.handleSubmit}>
                        <Row className="d-flex">
                          <Col md={4} className="mb-4">
                            <Form.Group>
                              <Form.Label>File Handover Date</Form.Label>
                              <div style={{ position: "relative" }}>
                                <Form.Control
                                  type="text"
                                  name="visaFileHandover.date"
                                  className="custom-select-height"
                                  placeholder="dd/mm/yyyy"
                                  value={
                                    fileHandoverFormik.values.visaFileHandover
                                      ?.date
                                      ? formatDate(
                                          parseDate(
                                            fileHandoverFormik.values
                                              .visaFileHandover?.date,
                                          ),
                                        )
                                      : ""
                                  }
                                  readOnly
                                  ref={fileHandoverDateInputRef}
                                  onClick={() => {
                                    if (
                                      fileHandoverFormik.values.visaFileHandover
                                        ?.date
                                    ) {
                                      setFileHandoverDateValue(
                                        parseDate(
                                          fileHandoverFormik.values
                                            .visaFileHandover?.date,
                                        ),
                                      );
                                    }
                                    setShowFileHandoverDateCalendar(
                                      (show) => !show,
                                    );
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "#fff",
                                  }}
                                />
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
                                {showFileHandoverDateCalendar && (
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
                                        setFileHandoverDateValue(selectedDate);
                                        fileHandoverFormik.setFieldValue(
                                          "visaFileHandover.date",
                                          formatDate(selectedDate),
                                        );
                                        setShowFileHandoverDateCalendar(false);
                                      }}
                                      value={fileHandoverDateValue}
                                      locale="en-GB"
                                    />
                                  </div>
                                )}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="primary"
                            type="submit"
                            className="custom-select-height"
                            disabled={isLoading}
                          >
                            {isLoading ? "Submitting..." : "Submit"}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                )}

                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "dVisaApply") && (
                  <DVisaApply
                    dVisaDocsFilePaths={dVisaDocsFilePaths}
                    dVisaApplyFormik={dVisaApplyFormik}
                    isLoading={isLoading}
                    handleFileChange={handleFileChange}
                    userRole={userRole}
                    formData={formData}
                    selectedDocsIds={selectedDocsIds}
                    getStatusColor={getStatusColor}
                    handleSingleDocumentDownload={handleSingleDocumentDownload}
                    id={id}
                    setSelectedStatus={setSelectedStatus}
                    statusOptions={statusOptions}
                    setRemarks={setRemarks}
                    setSelectedDocId={setSelectedDocId}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    selectedStatus={selectedStatus}
                    remarks={remarks}
                    handleStatusChange={handleStatusChange}
                    selectedDocId={selectedDocId}
                    setSelectedItem={setSelectedItem}
                    setShowDeleteModal={setShowDeleteModal}
                    toast={toast}
                    handleCheckboxChangeId={handleCheckboxChangeId}
                    sendPendingDocumentMain={sendPendingDocumentMain}
                    selectedDocumentNames={selectedDocumentNames}
                    handleOtherDocUpload={handleOtherDocUpload}
                    handleVisaFlowDocumentUpload={handleVisaFlowDocumentUpload}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    mode="visitor"
                  />
                )}

                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "biometricsVFSAppointment") && (
                  <BiometricsSection
                    selectedVisaSection={selectedVisaSection}
                    biometricsPaths={biometricsPaths}
                    isLoading={isLoading}
                    vfsAppointmentFilePaths={vfsAppointmentFilePaths}
                    biometricsFormik={biometricsFormik}
                    handleFileChange={handleFileChange}
                    userRole={userRole}
                    formData={formData}
                    selectedDocsIds={selectedDocsIds}
                    getStatusColor={getStatusColor}
                    handleSingleDocumentDownload={handleSingleDocumentDownload}
                    id={id}
                    setSelectedStatus={setSelectedStatus}
                    statusOptions={statusOptions}
                    setRemarks={setRemarks}
                    remarks={remarks}
                    showModal={showModal}
                    selectedStatus={selectedStatus}
                    setSelectedDocId={setSelectedDocId}
                    handleStatusChange={handleStatusChange}
                    selectedDocId={selectedDocId}
                    setShowModal={setShowModal}
                    handleOtherDocUpload={handleOtherDocUpload}
                    setSelectedItem={setSelectedItem}
                    setShowDeleteModal={setShowDeleteModal}
                    handleCheckboxChangeId={handleCheckboxChangeId}
                    toast={toast}
                    sendPendingDocumentMain={sendPendingDocumentMain}
                    selectedDocumentNames={selectedDocumentNames}
                  />
                )}

                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "visaFeePayment") && (
                  <VisaFeePayment
                    selectedVisaSection={selectedVisaSection}
                    visaFeePaymentFilePaths={visaFeePaymentFilePaths}
                    visaFeePaymentFormik={visaFeePaymentFormik}
                    visaFeePaymentStatusOptions={visaFeePaymentStatusOptions}
                    isLoading={isLoading}
                    handleFileChange={handleFileChange}
                    userRole={userRole}
                    formData={formData}
                    selectedDocsIds={selectedDocsIds}
                    getStatusColor={getStatusColor}
                    handleSingleDocumentDownload={handleSingleDocumentDownload}
                    id={id}
                    setSelectedStatus={setSelectedStatus}
                    statusOptions={statusOptions}
                    setRemarks={setRemarks}
                    remarks={remarks}
                    showModal={showModal}
                    selectedStatus={selectedStatus}
                    selectedDocId={selectedDocId}
                    handleStatusChange={handleStatusChange}
                    setSelectedDocId={setSelectedDocId}
                    setShowModal={setShowModal}
                    handleOtherDocUpload={handleOtherDocUpload}
                    setSelectedItem={setSelectedItem}
                    setShowDeleteModal={setShowDeleteModal}
                    handleCheckboxChangeId={handleCheckboxChangeId}
                    sendPendingDocumentMain={sendPendingDocumentMain}
                    selectedDocumentNames={selectedDocumentNames}
                    handleVisaFlowDocumentUpload={handleVisaFlowDocumentUpload}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    mode="visitor"
                  />
                )}

                {(selectedVisaSection === "all" ||
                  selectedVisaSection ===
                    "supplementaryAdditionalRequirement") && (
                  <SupplementaryAdditionalRequirement
                    selectedVisaSection={selectedVisaSection}
                    remarksFormik={remarksFormik}
                    isLoading={isLoading}
                    supplementaryAdditionalFilePaths={
                      supplementaryAdditionalFilePaths
                    }
                    handleFileChange={handleFileChange}
                    userRole={userRole}
                    formData={formData}
                    selectedDocsIds={selectedDocsIds}
                    getStatusColor={getStatusColor}
                    handleSingleDocumentDownload={handleSingleDocumentDownload}
                    id={id}
                    setSelectedStatus={setSelectedStatus}
                    statusOptions={statusOptions}
                    setRemarks={setRemarks}
                    setSelectedDocId={setSelectedDocId}
                    setShowModal={setShowModal}
                    handleOtherDocUpload={handleOtherDocUpload}
                    setSelectedItem={setSelectedItem}
                    remarks={remarks}
                    showModal={showModal}
                    selectedStatus={selectedStatus}
                    selectedDocId={selectedDocId}
                    handleStatusChange={handleStatusChange}
                    setShowDeleteModal={setShowDeleteModal}
                    handleCheckboxChangeId={handleCheckboxChangeId}
                    sendPendingDocumentMain={sendPendingDocumentMain}
                    selectedDocumentNames={selectedDocumentNames}
                    mode="visitor"
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    handleVisaFlowDocumentUpload={handleVisaFlowDocumentUpload}
                  />
                )}

                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "visaOutcomeTracking") && (
                  <VisaOutcomeTracking
                    selectedVisaSection={selectedVisaSection}
                    visaOutcomeFilePaths={visaOutcomeFilePaths}
                    visaOutcomeFormik={visaOutcomeFormik}
                    visaOutcomeTrackingStatusOptions={
                      visaOutcomeTrackingStatusOptions
                    }
                    isLoading={isLoading}
                    handleFileChange={handleFileChange}
                    userRole={userRole}
                    formData={formData}
                    selectedDocsIds={selectedDocsIds}
                    getStatusColor={getStatusColor}
                    handleSingleDocumentDownload={handleSingleDocumentDownload}
                    id={id}
                    setSelectedStatus={setSelectedStatus}
                    statusOptions={statusOptions}
                    setRemarks={setRemarks}
                    remarks={remarks}
                    showModal={showModal}
                    selectedStatus={selectedStatus}
                    selectedDocId={selectedDocId}
                    handleStatusChange={handleStatusChange}
                    setSelectedDocId={setSelectedDocId}
                    setShowModal={setShowModal}
                    handleOtherDocUpload={handleOtherDocUpload}
                    setSelectedItem={setSelectedItem}
                    setShowDeleteModal={setShowDeleteModal}
                    handleCheckboxChangeId={handleCheckboxChangeId}
                    sendPendingDocumentMain={sendPendingDocumentMain}
                    selectedDocumentNames={selectedDocumentNames}
                  />
                )}

                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "rpDecision") && (
                  <RpDecision
                    selectedVisaSection={selectedVisaSection}
                    rpDecisionFilePaths={rpDecisionFilePaths}
                    rpIssueDateInputRef={rpIssueDateInputRef}
                    showRPIssueDateCalendar={showRPIssueDateCalendar}
                    rpEndDateInputRef={rpEndDateInputRef}
                    showRPEndDateCalendar={showRPEndDateCalendar}
                    setShowRPIssueDateCalendar={setShowRPIssueDateCalendar}
                    rpIssueDateValue={rpIssueDateValue}
                    setRPIssueDateValue={setRPIssueDateValue}
                    formatDate={formatDate}
                    parseDate={parseDate}
                    setShowRPEndDateCalendar={setShowRPEndDateCalendar}
                    rpEndDateValue={rpEndDateValue}
                    setRPEndDateValue={setRPEndDateValue}
                    isLoading={isLoading}
                    handleFileChange={handleFileChange}
                    userRole={userRole}
                    formData={formData}
                    selectedDocsIds={selectedDocsIds}
                    getStatusColor={getStatusColor}
                    handleSingleDocumentDownload={handleSingleDocumentDownload}
                    id={id}
                    setSelectedStatus={setSelectedStatus}
                    statusOptions={statusOptions}
                    setRemarks={setRemarks}
                    remarks={remarks}
                    showModal={showModal}
                    selectedStatus={selectedStatus}
                    selectedDocId={selectedDocId}
                    handleStatusChange={handleStatusChange}
                    setSelectedDocId={setSelectedDocId}
                    setShowModal={setShowModal}
                    handleOtherDocUpload={handleOtherDocUpload}
                    setSelectedItem={setSelectedItem}
                    setShowDeleteModal={setShowDeleteModal}
                    handleCheckboxChangeId={handleCheckboxChangeId}
                    sendPendingDocumentMain={sendPendingDocumentMain}
                    selectedDocumentNames={selectedDocumentNames}
                    handleVisaFlowDocumentUpload={handleVisaFlowDocumentUpload}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    mode="visitor"
                  />
                )}

                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "reapplicationAppeal") && (
                  <ReapplicationAppeal
                    formData={formData}
                    fetchOneVisitorDetails={fetchOneVisitorDetails}
                    mode="visitor"
                    id={id}
                  />
                )}

                {(selectedVisaSection === "all" ||
                  selectedVisaSection === "visadocuments") && (
                  <div className="mb-4 my-5 p-4 bg-light rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-primary mb-0">Visa Documents</h6>
                      <div>
                        {selectedIds[selectedVisaSection]?.length > 0 && (
                          <Button
                            variant="primary"
                            className="custom-select-height me-2"
                            onClick={() =>
                              handleAlldownloadVisitorDocument(
                                id,
                                selectedIds[selectedVisaSection],
                              )
                            }
                          >
                            <DownloadIcon />
                            Download Document
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          className="custom-select-height"
                          onClick={() => {
                            if (selectedDocsIds?.length > 0) {
                              sendPendingDocumentMain(
                                id,
                                selectedDocumentNames,
                              );
                            } else {
                              toast.error(
                                "Please select at least one document to send via mail.",
                              );
                            }
                          }}
                        >
                          Send Mail
                        </Button>
                      </div>
                    </div>
                    <div className="table-responsive rounded">
                      <Table bordered hover>
                        <thead className="thead-light">
                          <tr>
                            {selectedVisaSection !== "all" && (
                              <th>
                                <Form.Check
                                  type="checkbox"
                                  checked={
                                    selectAllByType["visadocuments"] || false
                                  }
                                  onChange={() =>
                                    handleSelectAllChange(-1, "visadocuments")
                                  }
                                  className="custom-checkbox"
                                />
                              </th>
                            )}
                            {userRole !== "B2B Admin" &&
                              userRole !== "B2B Member" && (
                                <th>Document Pendency</th>
                              )}
                            <th>Sr No</th>
                            <th>Document Name</th>
                            <th>Upload File</th>
                            <th>Download</th>
                            <th>Status</th>
                            <th>Added By</th>
                            <th>Added On</th>
                            <th>Remarks</th>
                            <th className="sticky-col-right-last">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData?.uploadedDocumentDetails?.length > 0 ? (
                            formData.uploadedDocumentDetails
                              ?.filter((doc) => {
                                const allowedDocuments = [
                                  "Visa Fee Payment",
                                  "Appointment Letter",
                                  "Biometrics Receipt",
                                  "PIC Decision",
                                  "D Visa Document",
                                  "Supplementary Additional",
                                  "Visa Application Submission",
                                  "Visa Outcome Proof",
                                ];
                                const selectedCourseId =
                                  formData?.visaApplicationDetails?._id;
                                return (
                                  doc.customDocumentName &&
                                  allowedDocuments.includes(
                                    doc.customDocumentName,
                                  ) &&
                                  doc.ref_module === selectedCourseId
                                );
                              })
                              ?.map((doc, index) => {
                                const docName =
                                  doc.customDocumentName ||
                                  doc.documentName ||
                                  "Unnamed Document";
                                return (
                                  <tr key={doc._id}>
                                    {selectedVisaSection !== "all" && (
                                      <td>
                                        <Form.Check
                                          type="checkbox"
                                          checked={
                                            selectedRows[
                                              `visadocuments--1-${index}`
                                            ] || false
                                          }
                                          onChange={() =>
                                            handleCheckboxChange(
                                              -1,
                                              index,
                                              "visadocuments",
                                              doc._id,
                                              `visadocuments--1-${index}`,
                                            )
                                          }
                                          disabled={doc.status === "Reupload"}
                                          className="custom-checkbox"
                                        />
                                      </td>
                                    )}
                                    {userRole !== "B2B Admin" &&
                                      userRole !== "B2B Member" && (
                                        <td>
                                          <div className="form-check form-switch custom-toggle-button me-0">
                                            <input
                                              className="form-check-input three-dots-icon"
                                              type="checkbox"
                                              id={`toggle-${doc._id}-${index}`}
                                              checked={selectedDocsIds?.includes(
                                                `${doc._id}-${index}`,
                                              )}
                                              onChange={() =>
                                                handleCheckboxChangeId(
                                                  `${doc._id}-${index}`,
                                                  docName,
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      )}
                                    <td>{index + 1}</td>
                                    <td>{docName}</td>
                                    <td>
                                      {doc.status !== "Reupload" ? (
                                        <span className="text-success me-2">
                                          {doc.filePath?.split("/")?.pop() ||
                                            "No File"}
                                        </span>
                                      ) : (
                                        <Form.Control
                                          type="file"
                                          accept="image/*,application/pdf"
                                          onChange={(e) =>
                                            handleOtherDocUpload(
                                              e,
                                              index,
                                              doc._id,
                                              docName,
                                            )
                                          }
                                          className="custom-select-height"
                                        />
                                      )}
                                    </td>
                                    <td>
                                      {doc.status !== "Reupload" ? (
                                        <button
                                          className="btn btn-sm fw-normal rounded-4"
                                          style={{
                                            cursor: "pointer",
                                            color: "#fff",
                                            backgroundColor: "#007bff",
                                            height: "32px",
                                            width: "100px",
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            // const fileName =
                                            //   doc.filePath?.split("/")?.pop() ||
                                            //   "document";
                                            // handleSingleDocumentDownload(
                                            //   id,
                                            //   doc._id,
                                            //   fileName
                                            // );
                                            const filePath = doc?.filePath;
                                            const fileName = filePath
                                              ?.split("/")
                                              ?.pop();

                                            handleSingleDocumentDownload(
                                              filePath,
                                              fileName,
                                            );
                                          }}
                                        >
                                          <DownloadIcon />
                                          Download
                                        </button>
                                      ) : (
                                        <span>-</span>
                                      )}
                                    </td>
                                    <td>
                                      {doc ? (
                                        <button
                                          className="btn btn-sm fw-normal d-flex align-items-center justify-content-center rounded-4"
                                          style={{
                                            cursor: "pointer",
                                            color: "#fff",
                                            backgroundColor: getStatusColor(
                                              doc.status || "unverified",
                                            ),
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "5px 10px",
                                            height: "32px",
                                            width: "100px",
                                            fontSize: "14px",
                                          }}
                                          onClick={() => {
                                            setSelectedStatus(
                                              statusOptions?.find(
                                                (opt) =>
                                                  opt.value ===
                                                  (doc.status || "unverified"),
                                              ) ||
                                                statusOptions?.find(
                                                  (opt) =>
                                                    opt.value === "unverified",
                                                ),
                                            );
                                            setRemarks(doc.remarks || "");
                                            setSelectedDocId(doc._id);
                                            setShowModal(true);
                                          }}
                                        >
                                          {(doc.status === "verified" ||
                                            doc.status === "Verified") && (
                                            <CheckCircleIcon
                                              className="me-1"
                                              style={{ fontSize: "16px" }}
                                            />
                                          )}
                                          {(!doc.status ||
                                            doc.status === "unverified" ||
                                            doc.status === "Unverified") && (
                                            <CancelIcon
                                              className="me-1"
                                              style={{ fontSize: "16px" }}
                                            />
                                          )}
                                          {(doc.status === "reupload" ||
                                            doc.status === "Reupload") && (
                                            <UploadIcon
                                              className="me-1"
                                              style={{ fontSize: "16px" }}
                                            />
                                          )}
                                          {doc.status
                                            ? doc.status
                                                .charAt(0)
                                                .toUpperCase() +
                                              doc.status.slice(1)
                                            : "Unverified"}
                                        </button>
                                      ) : (
                                        <span>-</span>
                                      )}
                                    </td>
                                    <td>{doc.createdByName || "-"}</td>
                                    <td>
                                      {doc.createdAt
                                        ? new Date(
                                            doc.createdAt,
                                          ).toLocaleDateString("en-GB")
                                        : "-"}
                                    </td>
                                    <td>{doc.remarks || "-"}</td>
                                    <td className="sticky-col-right-last">
                                      <Button
                                        variant="link"
                                        className="text-danger"
                                        style={{ fontSize: "18px" }}
                                        onClick={() => {
                                          setSelectedItem(doc._id);
                                          setShowDeleteModal(true);
                                        }}
                                        title="Delete"
                                      >
                                        <FaTrashAlt />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <tr>
                              <td
                                colSpan="10"
                                className="text-muted text-center"
                              >
                                No Visa documents available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "accountant" && (
              <>
                {(selectedAccountantSection === "all" ||
                  selectedAccountantSection === "accountant") && (
                  // <div className="my-5 p-4 bg-light rounded shadow-sm">
                  //   <DataTable
                  //     columns={AccountantColumns}
                  //     data={accountantData}
                  //     totalData={totalData}
                  //     currentPage={1}
                  //     itemsPerPage={10}
                  //     actionView={false}
                  //     rowHeight={false}
                  //   />
                  // </div>
                  <ApplicationAccountant
                    accountantData={accountantData}
                    oneStudentData={oneStudentData}
                    fetchAccountant={fetchAccountant}
                    totalData={totalData}
                    mainPlanKey="visitor"
                  />
                )}

                {/* {(selectedAccountantSection === "all" ||
                  selectedAccountantSection === "categoryDetails") && (
                <div className="my-5 p-4 bg-light rounded shadow-sm">
                  <h1>categoryDetails</h1>
                </div>
                )} */}
              </>
            )}

            <div className="d-flex justify-content-center align-items-center my-5 gap-3">
              {userRole !== "B2B Admin" &&
                userRole !== "B2B Member" &&
                userRole !== "Branch" &&
                userType !== "Branch User" && (
                  <Select
                    options={applicationstatusoptions}
                    value={selectedApplicationStatus}
                    onChange={handleMainTabStatusChange}
                    placeholder="Select Status"
                    classNamePrefix="custom-select"
                    styles={customStyles}
                  />
                )}
              {activeTab === "document" &&
                !(
                  userRole === "B2B Admin" ||
                  userRole === "B2B Member" ||
                  userRole === "Branch" ||
                  userType === "Branch User"
                ) && (
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={() => {
                      sendPendingDocumentMain(id, selectedDocumentNames);
                    }}
                  >
                    Send Mail
                  </Button>
                )}
              {userRole !== "Super Admin" && (
                <div className="text-center">
                  <Button
                    variant="primary"
                    className="custom-submit-button px-5"
                    type="submit"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const payload = {
                          isSubmit: !oneStudentData?.isSubmit
                            ? true
                            : oneStudentData.isSubmit,
                          submittedTabs: activeTab,
                        };
                        await dispatch(updateVisitorApplication(payload, id));

                        await fetchOneVisitorDetails();
                        toast.success("Details saved successfully!");
                      } catch (error) {
                        toast.error(
                          error?.response?.data?.message ||
                            "Error updating visitor details",
                        );
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={
                      userRole !== "Super Admin" &&
                      (oneStudentData?.submittedTabs?.includes(activeTab) ||
                        (activeTab !== "personal" &&
                          (!oneStudentData?.submittedTabs ||
                            oneStudentData.submittedTabs.length === 0)) ||
                        (activeTab === "document" &&
                          !oneStudentData?.submittedTabs?.includes(
                            "personal",
                          )) ||
                        (activeTab === "visaApplication" &&
                          !oneStudentData?.submittedTabs?.includes("document")))
                    }
                  >
                    <FaCheck fontSize={15} style={{ marginRight: "5px" }} />
                    {oneStudentData?.submittedTabs?.includes(activeTab)
                      ? "Saved"
                      : "Submit"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleRemoveDocument(selectedItem);
          setShowDeleteModal(false);
        }}
      />
    </>
  );
};

export default VisitorDetails;
