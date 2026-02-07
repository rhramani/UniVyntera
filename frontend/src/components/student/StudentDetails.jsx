import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import DownloadIcon from "@mui/icons-material/Download";
import { FaCheck } from "react-icons/fa";
import { decryptData, encryptData } from "../../utils/encryptionUtils";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import {
  deleteStudentApplication,
  downloadDocument,
  getAccountant,
  getCountryWiseDocuments,
  getOneStudentApplication,
  pendingDocList,
  pendingDocMail,
  updateStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import { getAllProgressbar } from "../../redux/actions/Master/Progressbar.action";
import { getOneApplicationStatus } from "../../redux/actions/Student/ApplicationStatus.action";
import { getAllStudentStatus } from "../../redux/actions/Student/StudentStatus.action";

import StudentInfo from "./studentDetails/StudentInfo";
import Tabs from "./studentDetails/Tabs";
import EducationSection from "./studentDetails/EducationSection";
import LanguageEntranceExam from "./studentDetails/LanguageEntranceExam";
import AptitudeExamSection from "./studentDetails/AptitudeExamSection";
import WorkExperience from "./studentDetails/WorkExperience";
import Remarks from "./studentDetails/Remarks";
import EmergencyDetails from "./studentDetails/EmergencyDetails";
import InterestedCourseSection from "./studentDetails/InterestedCourseSection";
import UserAllocationSection from "./studentDetails/UserAllocationSection";
import DocumentSection from "./studentDetails/DocumentSection";
import VisaUserAllocationSection from "./studentDetails/visaApplication/VisaUserAllocationSection";
import DVisaApply from "./studentDetails/visaApplication/DVisaApply";
import BiometricsSection from "./studentDetails/visaApplication/BiometricsSection";
import VisaFeePayment from "./studentDetails/visaApplication/VisaFeePayment";
import SupplementaryAdditionalRequirement from "./studentDetails/visaApplication/SupplementaryAdditionalRequirement";
import VisaOutcomeTracking from "./studentDetails/visaApplication/VisaOutcomeTracking";
import RpDecision from "./studentDetails/visaApplication/RpDecision";
import ReapplicationAppeal from "./studentDetails/visaApplication/ReapplicationAppeal";
import VisaApplicationOnlineSub from "./studentDetails/VisaApplicationOnlineSub";

import LoadMoreButton from "../commonComponents/LoadMoreButton";

import UsaApplication from "./studentDetails/visaApplication/usaVisaFlow/UsaApplication";
import UsaReceived from "./studentDetails/visaApplication/usaVisaFlow/UsaReceived";
import UsaRegistration from "./studentDetails/visaApplication/usaVisaFlow/UsaRegistration";
import UsaConfirmation from "./studentDetails/visaApplication/usaVisaFlow/UsaConfirmation";
import UsaVisaFeePayment from "./studentDetails/visaApplication/usaVisaFlow/UsaVisaFeePayment";
import ApplicationAccountant from "./ApplicationAccountant";
import UsaAppointmentBooking from "./studentDetails/visaApplication/usaVisaFlow/UsaAppointmentBooking";
import UsaSEVISFeePayment from "./studentDetails/visaApplication/usaVisaFlow/UsaSEVISFeePayment";
import UsaFundsShow from "./studentDetails/visaApplication/usaVisaFlow/UsaFundsShow";
import UsaVisaDecisionIssuance from "./studentDetails/visaApplication/usaVisaFlow/UsaVisaDecisionIssuance";
import UkConfirmationofAcceptanceforStudies from "./studentDetails/visaApplication/ukVisaFlow/UkConfirmationofAcceptanceforStudies";
import UkTuitionFeeMaintenanceFunds from "./studentDetails/visaApplication/ukVisaFlow/UkTuitionFeeMaintenanceFunds";
import UkTBTest from "./studentDetails/visaApplication/ukVisaFlow/UkTBTest";
import UkVisaApplicationForm from "./studentDetails/visaApplication/ukVisaFlow/UkVisaApplicationForm";
import UkIHSEmbassyVFSVisaFeePayment from "./studentDetails/visaApplication/ukVisaFlow/UkIHSEmbassyVFSVisaFeePayment";
import UkBiometricAppointment from "./studentDetails/visaApplication/ukVisaFlow/UkBiometricAppointment";
import UkBiometricCompleted from "./studentDetails/visaApplication/ukVisaFlow/UkBiometricCompleted";
import UkVisaDecisionPassportCollection from "./studentDetails/visaApplication/ukVisaFlow/UkVisaDecisionPassportCollection";
import AusOfferLetter from "./studentDetails/visaApplication/ausVisaFlow/AusOfferLetter";
import AusConfirmationofEnrolment from "./studentDetails/visaApplication/ausVisaFlow/AusConfirmationofEnrolment";
import AusMedicalExamination from "./studentDetails/visaApplication/ausVisaFlow/AusMedicalExamination";
import AusTuitionFeePayment from "./studentDetails/visaApplication/ausVisaFlow/AusTuitionFeePayment";
import AusOverseasStudentHealthCover from "./studentDetails/visaApplication/ausVisaFlow/AusOverseasStudentHealthCover";
import AusImmiAccountCreation from "./studentDetails/visaApplication/ausVisaFlow/AusImmiAccountCreation";
import AusVisaApplication from "./studentDetails/visaApplication/ausVisaFlow/AusVisaApplication";
import AusVisaFeePayment from "./studentDetails/visaApplication/ausVisaFlow/AusVisaFeePayment";
import AusBiometrics from "./studentDetails/visaApplication/ausVisaFlow/AusBiometrics";
import AusVisaOutcome from "./studentDetails/visaApplication/ausVisaFlow/AusVisaOutcome";
import AusTravelEntryPreparation from "./studentDetails/visaApplication/ausVisaFlow/AusTravelEntryPreparation";
import GerAdmissionLetter from "./studentDetails/visaApplication/gerVisaFlow/GerAdmissionLetter";
import GerBlockedAccount from "./studentDetails/visaApplication/gerVisaFlow/GerBlockedAccount";
import GerHealthInsurance from "./studentDetails/visaApplication/gerVisaFlow/GerHealthInsurance";
import GerVisaApplicationForm from "./studentDetails/visaApplication/gerVisaFlow/GerVisaApplicationForm";
import GerAppointmentBooking from "./studentDetails/visaApplication/gerVisaFlow/GerAppointmentBooking";
import GerVisaFeePayment from "./studentDetails/visaApplication/gerVisaFlow/GerVisaFeePayment";
import GerBiometricsInterview from "./studentDetails/visaApplication/gerVisaFlow/GerBiometricsInterview";
import GerVisaDecisionIssuance from "./studentDetails/visaApplication/gerVisaFlow/GerVisaDecisionIssuance";
import GerTravelResidencePermit from "./studentDetails/visaApplication/gerVisaFlow/GerTravelResidencePermit";
import FranceOfferAdmissionLetter from "./studentDetails/visaApplication/franceVisaFlow/FranceOfferAdmissionLetter";
import FranceCampusFranceRegistration from "./studentDetails/visaApplication/franceVisaFlow/FranceCampusFranceRegistration";
import FranceTuitionFeePayment from "./studentDetails/visaApplication/franceVisaFlow/FranceTuitionFeePayment";
import FranceProofofFundsBlockedAccount from "./studentDetails/visaApplication/franceVisaFlow/FranceProofofFundsBlockedAccount";
import FranceMedicalInsurance from "./studentDetails/visaApplication/franceVisaFlow/FranceMedicalInsurance";
import FranceFranceVisasOnlineForm from "./studentDetails/visaApplication/franceVisaFlow/FranceFranceVisasOnlineForm";
import FranceVisaFeePayment from "./studentDetails/visaApplication/franceVisaFlow/FranceVisaFeePayment";
import FranceAppointmentBooking from "./studentDetails/visaApplication/franceVisaFlow/FranceAppointmentBooking";
import FranceBiometricsDocumentSubmission from "./studentDetails/visaApplication/franceVisaFlow/FranceBiometricsDocumentSubmission";
import FranceVisaDecisionIssuance from "./studentDetails/visaApplication/franceVisaFlow/FranceVisaDecisionIssuance";
import FrancePostArrivalFormalities from "./studentDetails/visaApplication/franceVisaFlow/FrancePostArrivalFormalities";
import CanadaConditionalOfferLetter from "./studentDetails/visaApplication/canadaVisaFlow/CanadaConditionalOfferLetter";
import CanadaMedicalProcess from "./studentDetails/visaApplication/canadaVisaFlow/CanadaMedicalProcess";
import CanadaTuitionFeePayment from "./studentDetails/visaApplication/canadaVisaFlow/CanadaTuitionFeePayment";
import CanadaGICBankAccountCreation from "./studentDetails/visaApplication/canadaVisaFlow/CanadaGICBankAccountCreation";
import CanadaIRCCAccount from "./studentDetails/visaApplication/canadaVisaFlow/CanadaIRCCAccount";
import CanadaApplicationFormLock from "./studentDetails/visaApplication/canadaVisaFlow/CanadaApplicationFormLock";
import CanadaVisaFeePayment from "./studentDetails/visaApplication/canadaVisaFlow/CanadaVisaFeePayment";
import CanadaVisaSubmissionConfirmation from "./studentDetails/visaApplication/canadaVisaFlow/CanadaVisaSubmissionConfirmation";
import CanadaBiometricRequest from "./studentDetails/visaApplication/canadaVisaFlow/CanadaBiometricRequest";
import CanadaBvlPpr from "./studentDetails/visaApplication/canadaVisaFlow/CanadaBvlPpr";
import CanadaVisaDecisionIssuance from "./studentDetails/visaApplication/canadaVisaFlow/CanadaVisaDecisionIssuance";
import CanadaPortofEntryLetter from "./studentDetails/visaApplication/canadaVisaFlow/CanadaPortofEntryLetter";
import CanadaStudyCoOpWorkPermits from "./studentDetails/visaApplication/canadaVisaFlow/CanadaStudyCoOpWorkPermits";
import SingaporeSolarApplicationSubmission from "./studentDetails/visaApplication/singaporeVisaFlow/SingaporeSolarApplicationSubmission";
import VFSAppointment from "./studentDetails/visaApplication/VFSAppointment";
import FollowUpModal from "./studentDetails/FollowUpModal";
import DocumentHandler from "./studentDetails/visaApplication/DocumentHandler";
import FileHandover from "./studentDetails/FileHandover";
import EducationLoan from "./studentDetails/EducationLoan";
import StudentVisaByUs from "./studentDetails/StudentVisaByUs";
import StudentVisaOutCome from "./studentDetails/StudentVisaOutCome";
import { BASEURL, REACT_APP_API_URL } from "../../baseUrl";
import { getAllBranch } from "../../redux/actions/Branch.action";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

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

const visaOutcomeTrackingStatusOptions = [
  { value: "Under Process", label: "Under Process" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Passport Requested", label: "Passport Requested" },
];

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userRole"));
  const currentUserId = decryptData(localStorage.getItem("userId"));
  const branchId = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));

  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "personal",
  );
  const [selectedPersonalSection, setSelectedPersonalSection] = useState("");
  const [selectedCounsellingSection, setSelectedCounsellingSection] =
    useState("");
  const [selectedVisaSection, setSelectedVisaSection] = useState("");
  const [oneStudentData, setOneStudentData] = useState(null);
  const [countryDocuments, setCountryDocuments] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAllByType, setSelectAllByType] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);
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

  const [primaryPreferredCountry, setPrimaryPreferredCountry] = useState("");

  const [branchList, setBranchList] = useState([]);

  // Country-wise Visa Flow configuration
  const defaultVisaFlow = [
    "visaStageInitiation",
    "visaAllocation",
    "vfsAppointmentDate",
    "visaApplicationOnlineSubmission",
    "fileHandover",
    "dVisaApply",
    "biometricsVFSAppointment",
    "visaFeePayment",
    "supplementaryAdditionalRequirement",
    "visaOutcomeTracking",
    "rpDecision",
    "reapplicationAppeal",
    "visadocuments",
  ];

  const countryVisaFlows = {
    "United States": [
      "visaAllocation",
      "usaApplication",
      "usaReceived",
      "usaRegistration",
      "usaConfirmation",
      "usaVisaFeePayment",
      "usaAppointmentBooking",
      "usaSevisFeePayment",
      "usaFundsShow",
      "usaVisaDecisionIssuance",
    ],
    Canada: [
      "visaAllocation",
      "CanadaConditionalOfferLetter",
      "CanadaMedicalProcess",
      "CanadaTuitionFeePayment",
      "CanadaGICBankAccountCreation",
      "CanadaIRCCAccount",
      "CanadaApplicationFormLock",
      "CanadaVisaFeePayment",
      "CanadaVisaSubmissionConfirmation",
      "CanadaBiometricRequest",
      "CanadaBvlPpr",
      "CanadaVisaDecisionIssuance",
      "CanadaPortofEntryLetter",
      "CanadaStudyCoOpWorkPermits",
    ],
    "United Kingdom": [
      "visaAllocation",
      "ukConfirmationofAcceptanceforStudies",
      "ukTuitionFeeMaintenanceFunds",
      "ukTBTest",
      "ukVisaApplicationForm",
      "ukIHSEmbassyVFSVisaFeePayment",
      "ukBiometricAppointment",
      "ukBiometricCompleted",
      "ukVisaDecisionPassportCollection",
    ],
    Australia: [
      "visaAllocation",
      "ausOfferLetter",
      "ausConfirmationofEnrolment",
      "ausMedicalExamination",
      "ausTuitionFeePayment",
      "ausOverseasStudentHealthCover",
      "ausImmiAccountCreation",
      "ausVisaApplication",
      "ausVisaFeePayment",
      "ausBiometrics",
      "ausVisaOutcome",
      "ausTravelEntryPreparation",
    ],
    Germany: [
      "visaAllocation",
      "gerAdmissionLetter",
      "gerBlockedAccount",
      "gerHealthInsurance",
      "gerVisaApplicationForm",
      "gerAppointmentBooking",
      "gerVisaFeePayment",
      "gerBiometricsInterview",
      "gerVisaDecisionIssuance",
      "gerTravelResidencePermit",
    ],
    France: [
      "visaAllocation",
      "franceOfferAdmissionLetter",
      "franceCampusFranceRegistration",
      "franceTuitionFeePayment",
      "franceProofofFundsBlockedAccount",
      "franceMedicalInsurance",
      "franceFranceVisasOnlineForm",
      "franceVisaFeePayment",
      "franceAppointmentBooking",
      "franceBiometricsDocumentSubmission",
      "franceVisaDecisionIssuance",
      "francePostArrivalFormalities",
    ],
    Singapore: [
      // "singaporeSolarApplicationSubmission",
      // "singaporeICAReviewProcessing",
      // "singaporeInPrincipleApprovalIssued",
      // "singaporePreDeparturePreparation",
      // "singaporeArrivalInSingapore",
      // "singaporeMedicalExamination",
      // "singaporeICAAppointmentBooking",
      // "singaporeStudentPassIssued",
      // "singaporeCourseCommencement",
      // "singaporePartTimeWorkEligibility",
      // "singaporeStudentPassRenewalCompletion",
      "visaStageInitiation",
      "visaAllocation",
      "vfsAppointmentDate",
      "visaApplicationOnlineSubmission",
      "fileHandover",
      "biometricsVFSAppointment",
      "visaFeePayment",
      "supplementaryAdditionalRequirement",
      "visaOutcomeTracking",
      "reapplicationAppeal",
      "visadocuments",
    ],
  };

  useEffect(() => {
    if (oneStudentData?.purposeDetails?.preferredCountry?.length > 0) {
      setPrimaryPreferredCountry(
        oneStudentData.purposeDetails.preferredCountry[0],
      );
    }
  }, [oneStudentData]);

  const allowedVisaFlow =
    countryVisaFlows[primaryPreferredCountry] || defaultVisaFlow;

  const isSectionEnabled = (sectionKey) => allowedVisaFlow.includes(sectionKey);

  useEffect(() => {
    if (activeTab === "visaApplication") {
      if (selectedVisaSection && selectedVisaSection !== "all") {
        if (!isSectionEnabled(selectedVisaSection)) {
          setSelectedVisaSection(allowedVisaFlow[0] || "visaStageInitiation");
        }
      } else if (!selectedVisaSection) {
        setSelectedVisaSection(allowedVisaFlow[0] || "visaStageInitiation");
      }
    }
  }, [activeTab, selectedVisaSection, allowedVisaFlow]);

  const [applicationstatus, setApplicationstatus] = useState([]);
  const [selectedApplicationStatus, setSelectedApplicationStatus] =
    useState(null);
  const [followUpStates, setFollowUpStates] = useState({
    personal: false,
    document: false,
    courseSelection: false,
    visaApplication: false,
  });
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [activeTabForModal, setActiveTabForModal] = useState(null);
  const [studentStatuses, setStudentStatuses] = useState([]);
  const [selectedStudentStatus, setSelectedStudentStatus] = useState(null);
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
      Object.keys(location.state).some((key) =>
        [
          "selectedBranch",
          "mainStatus",
          "search",
          "currentPage",
          "itemsPerPage",
          "showAll",
          "selectedCountry",
          "followUpDate",
          "selectedB2BAdmin",
        ].includes(key),
      )
    ) {
      // Filter state is present, preserve it for when we navigate back to StudentApplication
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

  const studentStatusOptions = studentStatuses?.map((item) => ({
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
    if (activeTab === "courseSelection" && !selectedCounsellingSection) {
      setSelectedCounsellingSection("interestedCourse");
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

  const handleCounsellingSectionSelect = (sectionKey) => {
    setSelectedCounsellingSection(sectionKey);
  };

  const handleVisaSectionSelect = (sectionKey) => {
    setSelectedVisaSection(sectionKey);
  };

  const handleFollowUpToggle = (tab) => {
    setActiveTabForModal(tab);
    setFollowUpStates((prev) => ({ ...prev, [tab]: !prev[tab] }));
    setShowFollowUpModal(true);
  };

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan());
      const plans = res?.data?.data?.data || [];

      const admissionPlan = plans.find(
        (plan) => plan.name.toLowerCase() === "student admission",
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
          updateStudentApplication(uploadFormData, id),
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
          const newDocumentEntries = newDocs.map((doc) => ({
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
          await fetchOneStudentDetails();
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
    personalDetailsRemarks: false,
    personalDetailsRemarksIndex: 0,
    emergencyDetails: false,
    emergencyDetailsIndex: 0,
    aptitudeExamDetails: false,
    aptitudeExamIndex: 0,
    interestedCourseDetails: false,
    interestedCourseIndex: 0,
    userAllocationDetails: false,
    userAllocationIndex: 0,
    visaAllocationDetails: false,
    visaVisaAllocationIndex: 0,
    visaApplicationDetails: false,
    visaApplicationDetailsIndex: 0,
  });

  const [formData, setFormData] = useState({
    educationDetails: [],
    entranceExamDetails: [],
    workExperience: [],
    personalDetailsRemarks: [],
    emergencyDetails: [],
    aptitudeExamDetails: [],
    interestedCourseDetails: [],
    userAllocationDetails: [],
    visaAllocationDetails: [],
    uploadedDocumentDetails: [],
    visaApplicationDetails: {},
    loanRequired: false,
    visaByRG: false,
    docUploadByStudent: false,
    loanAmount: "",
    loanProvider: "",
  });

  const [isDocUploadByStudent, setIsDocUploadByStudent] = useState(
    formData?.docUploadByStudent ?? false,
  );
  useEffect(() => {
    if (formData?.docUploadByStudent !== undefined) {
      setIsDocUploadByStudent(formData.docUploadByStudent);
    }
  }, [formData]);

  useEffect(() => {
    if (userRole === "Branch") {
      dispatch(getAllRoleList(branchId, false)).then((res) => {
        setGetAllRoleList(res?.data);
      });
    } else if (userType === "Branch User") {
      dispatch(getAllRoleList(branchUserId, false)).then((res) => {
        setGetAllRoleList(res?.data);
      });
    } else {
      dispatch(getAllRoleList("", true)).then((res) => {
        setGetAllRoleList(res?.data);
      });
    }
  }, []);

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 100, ""));
      setBranchList(res?.data?.data?.data || []);
    } catch (err) {
      setBranchList([]);
    }
  };
  useEffect(() => {
    if (userRole !== "Branch" && userType !== "Branch User") {
      fetchAllBranches();
    }
  }, []);

  const getBranchIdFromRole = (roleId) => {
    const selectedRole = getAllRollList?.data?.find(
      (role) => role._id === roleId,
    );

    return selectedRole?.branchId?._id || "";
  };

  const fetchAllUser = async (roleName, roleId) => {
    try {
      let branchIdToSend = "";

      if (userRole === "Branch") {
        branchIdToSend = branchId;
      } else if (userType === "Branch User") {
        branchIdToSend = branchUserId;
      } else {
        branchIdToSend = getBranchIdFromRole(roleId);
      }

      const res = await dispatch(
        adminGetAll(1, 100, "", roleName, branchIdToSend, false),
      );

      setAllUser(res?.data?.data?.data || []);
    } catch (error) {
      console.log("Error fetching users:", error);
      setAllUser([]);
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

  const fetchApplicatonStatus = async () => {
    try {
      const res = await dispatch(getOneApplicationStatus(activeTab));
      await setApplicationstatus(res?.data?.data || []);
      await fetchOneStudentDetails();
    } catch (error) {
      console.log("Error fetching application status:", error);
      setApplicationstatus([]);
    }
  };

  useEffect(() => {
    fetchApplicatonStatus();
    fetchStudentStatuses();
  }, [activeTab]);

  const fetchOneStudentDetails = async () => {
    setIsLoading(true);

    try {
      const res = await dispatch(getOneStudentApplication(id));
      const studentData = res?.data?.data;
      setOneStudentData(studentData);

      if (studentData?.mainStatus?._id) {
        setSelectedStudentStatus({
          value: studentData.mainStatus._id,
          label: studentData.mainStatus.name,
        });
      }

      let statusId;
      if (activeTab === "personal") {
        statusId = studentData?.personalDetailStatus?._id;
      } else if (activeTab === "document") {
        statusId = studentData?.documentDetailStatus?._id;
      } else if (activeTab === "courseSelection") {
        statusId = studentData?.counsellingDetailStatus?._id;
      }
      const selectedStatus = applicationstatus.find(
        (status) => status._id === statusId,
      );
      setSelectedApplicationStatus(
        selectedStatus
          ? { value: selectedStatus._id, label: selectedStatus.name }
          : null,
      );
      setStudent(studentData);
      const educationDetailsWithFiles = (
        studentData?.educationDetails || []
      ).map((edu) => {
        const matchingDoc = studentData?.uploadedDocumentDetails?.find(
          (doc) => doc?.ref_module === edu?._id,
        );
        return {
          ...edu,
          fileUrl: matchingDoc ? `${matchingDoc.filePath}` : null,
          filePath: matchingDoc ? matchingDoc.filePath : null,
        };
      });
      const entranceExamDetailsWithFiles = (
        studentData?.entranceExamDetails || []
      ).map((edu) => {
        const matchingDoc = studentData?.uploadedDocumentDetails?.find(
          (doc) => doc?.ref_module === edu?._id,
        );
        return {
          ...edu,
          fileUrl: matchingDoc ? `${matchingDoc.filePath}` : null,
          filePath: matchingDoc ? matchingDoc.filePath : null,
        };
      });
      const aptitudeExamDetailsWithFiles = (
        studentData?.aptitudeExamDetails || []
      ).map((edu) => {
        const matchingDoc = studentData?.uploadedDocumentDetails?.find(
          (doc) => doc?.ref_module === edu?._id,
        );
        return {
          ...edu,
          fileUrl: matchingDoc ? `${matchingDoc.filePath}` : null,
          filePath: matchingDoc ? matchingDoc.filePath : null,
        };
      });
      const workExperienceWithFiles = (studentData?.workExperience || []).map(
        (edu) => {
          const matchingDoc = studentData?.uploadedDocumentDetails?.find(
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
        interestedCourseDetails: studentData?.interestedCourseDetails || [],
        userAllocationDetails: studentData?.userAllocationDetails || [],
        visaAllocationDetails: studentData?.visaAllocationDetails || [],
        visaApplicationDetails: studentData?.visaApplicationDetails || [],
        uploadedDocumentDetails: studentData?.uploadedDocumentDetails || [],
        loanRequired: studentData?.loanRequired ?? false,
        visaByRG: studentData?.visaByRG ?? false,
        docUploadByStudent: studentData?.docUploadByStudent ?? false,
        loanAmount: studentData?.loanAmount || "",
        loanProvider: studentData?.loanProvider || "",
        personalDetailsRemarks: studentData?.personalDetailsRemarks || [],
        emergencyDetails: studentData?.emergencyDetails || [],
      });
      const customDocs = studentData?.uploadedDocumentDetails
        ?.filter((doc) => doc.customDocumentName)
        .map((doc) => ({
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
      if (studentData?.uploadedDocumentDetails) {
        setOneStudentData((prev) => ({
          ...prev,
          uploadedDocumentDetails: studentData.uploadedDocumentDetails.map(
            (doc) => ({
              ...doc,
              fileUrl: `${REACT_APP_API_URL}/${doc.filePath}`,
            }),
          ),
        }));
      }
      const preferredCountry =
        studentData?.purposeDetails?.preferredCountry[0] || "";
      if (preferredCountry) {
        await fetchProgressSteps(preferredCountry);
      }
    } catch (error) {
      console.log("Error fetching student details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountryWiseDocuments = async (preferredCountry) => {
    try {
      const res = await dispatch(getCountryWiseDocuments(preferredCountry));

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
    fetchOneStudentDetails();
  }, [id, applicationstatus]);

  const fetchProgressSteps = async (country) => {
    try {
      const res = await dispatch(getAllProgressbar(1, 100, "", country));
      if (res?.status === 200 && res.data?.data?.data?.[0]?.steps) {
        const rawSteps = res.data.data.data[0].steps;
        const steps = rawSteps.map((step) => ({
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
    const preferredCountryArray =
      oneStudentData?.purposeDetails?.preferredCountry || [];
    if (preferredCountryArray.length > 0) {
      fetchCountryWiseDocuments(preferredCountryArray);
    }
  }, [oneStudentData?.purposeDetails?.preferredCountry]);

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

      const res = await dispatch(updateStudentApplication(formData, id));
      await dispatch(fetchOneStudentDetails(id));
      if (res.payload?.success) {
        toast.success("Document uploaded successfully!");

        await dispatch(fetchOneStudentDetails(id));
      } else {
        throw new Error("API response unsuccessful");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

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
    if (files.some((file) => file.size > maxSizeInBytes)) {
      toast.error("One or more files exceed the 5MB size limit.");
      return { success: false };
    }

    setIsLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("customDocumentName", docName);
      files.forEach((file) => {
        uploadFormData.append("uploadedDocument", file);
      });
      uploadFormData.append(
        "ref_module",
        formData?.visaApplicationDetails?._id,
      );

      const res = await dispatch(updateStudentApplication(uploadFormData, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          console.error("API response error:", res.data.data.message);
          toast.error(res.data.data.message);
          return { success: false };
        }

        const newDocs = res.data.data.uploadedDocumentDetails || [];
        const documentDetails = newDocs.map((doc) => ({
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
        if (resetForm) resetForm(); // Only call resetForm if it's a function
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

        await fetchOneStudentDetails();
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

      // Allowed types
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

      // Validate all files
      for (let file of files) {
        if (!allowedTypes.includes(file.type)) {
          toast.error(`File ${file.name} is not an allowed file type`);
          return;
        }
        if (file.size > maxSizeInBytes) {
          toast.error(`File ${file.name} must be less than 5MB`);
          return;
        }
      }

      // Set in Formik
      formikInstance.setFieldValue(fieldName, files);

      // Handle visa flow document uploads
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

      // Uncomment as needed:
      // if (fieldName === "applicationSubmission") {
      //   await handleVisaFlowDocumentUpload(
      //     "Visa Application Submission",
      //     files,
      //     formikInstance.resetForm,
      //     formikInstance
      //   );
      // }

      // if (fieldName === "supplementaryAdditional") {
      //   await handleVisaFlowDocumentUpload(
      //     "Supplementary Additional",
      //     files,
      //     formikInstance.resetForm,
      //     formikInstance
      //   );
      // }
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

      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status !== 200) {
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating visa outcome",
        );
        return;
      }

      toast.success("Visa outcome updated successfully");
      await fetchOneStudentDetails();
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

      const res = await dispatch(updateStudentApplication(payload, id));
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
      await fetchOneStudentDetails();
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

      const res = await dispatch(updateStudentApplication(paylaod, id));
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
      fetchOneStudentDetails();
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

  const getFilePathsForCourse = (courseId, documents, documentType) => {
    return documents
      ?.filter(
        (doc) =>
          doc.ref_module === courseId &&
          documentType.includes(doc.customDocumentName),
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
      visaOutcomeFormik.setValues({
        visaOutcomeStatus:
          formData?.visaApplicationDetails?.visaOutcomeStatus || "",
      });

      visaApplicationSubmissionFormik.setValues({
        visaOnlineSubmission: {
          date:
            formData?.visaApplicationDetails?.visaOnlineSubmission?.date || "",
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

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchPendingDocCountList = async (id) => {
    try {
      const res = await dispatch(pendingDocList(id));
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
      dispatch(pendingDocMail(id, selectedDocumentNames))
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

  const studentInfoFormik = useFormik({
    initialValues: {
      name: oneStudentData?.name || "",
      email: oneStudentData?.email || "",
      contact: oneStudentData?.contact || "",
      DOB: oneStudentData?.DOB || "",
      country: oneStudentData?.country || "",
      city: oneStudentData?.city || "",
      purposeDetails: {
        preferredCountry:
          oneStudentData?.purposeDetails?.preferredCountry || [],
      },
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
      purposeDetails: Yup.object({
        preferredCountry: Yup.array().of(Yup.string()),
      }),
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
        const res = await dispatch(updateStudentApplication(payload, id));
        if (res?.status === 200) {
          toast.success("Student information updated successfully");
          resetForm();
          setShowStudentInfoModal(false);
          fetchOneStudentDetails();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Error updating student information",
        );
      }
    },
  });

  if (!student || !oneStudentData) {
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

  const dateFormat = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
      const res = await dispatch(updateStudentApplication(uploadFormData, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
        } else {
          toast.success("Documents uploaded successfully");
          await fetchOneStudentDetails();
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
      const res = await dispatch(deleteStudentApplication({ documentId }, id));
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
        await fetchOneStudentDetails();
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
              !excludedDocuments.includes(doc.customDocumentName)
            );
          }) || [];

        allCheckedForType = otherDocs.every((doc, idx) => {
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
              allowedDocuments.includes(doc.customDocumentName)
            );
          }) || [];
        allCheckedForType = rgDocs.every((doc, idx) => {
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
              allowedDocuments.includes(doc.customDocumentName)
            );
          }) || [];
        allCheckedForType = visaDocs.every((doc, idx) => {
          if (!doc?._id || doc.status === "Reupload") return true;
          return newSelected[`visadocuments--1-${idx}`];
        });
      } else {
        const typeDocuments =
          countryDocuments?.data?.[0]?.documents?.[docIndex]?.documentList ||
          [];
        allCheckedForType = typeDocuments.every((document, idx) => {
          const uploadedDocs =
            oneStudentData?.uploadedDocumentDetails?.filter(
              (uploaded) => uploaded.documentName === document?.document?._id,
            ) || [];
          if (!uploadedDocs || uploadedDocs.length === 0) return true;
          return uploadedDocs.every((doc, uploadIdx) => {
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
            !excludedDocuments.includes(doc.customDocumentName)
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
            allowedDocuments.includes(doc.customDocumentName)
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
            allowedDocuments.includes(doc.customDocumentName)
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
  //   applicationId,
  //   documentId,
  //   fileName
  // ) => {
  //   setIsLoading(true);

  //   try {
  //     const res = await dispatch(downloadDocument(applicationId, documentId));

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

  const handleAllDownloadDocument = async (applicationId, documentIds) => {
    setIsLoading(true);
    if (documentIds.length === 0) {
      toast.error("Please select at least one document to download");
      return;
    }

    try {
      const ids = documentIds.join(",");
      const res = await dispatch(downloadDocument(applicationId, ids));

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

  const handleAllDocumentsDownload = async (applicationId) => {
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
      const res = await dispatch(downloadDocument(applicationId, ids));

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

      const res = await dispatch(updateStudentApplication(uploadFormData, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
        } else {
          toast.success("File uploaded successfully");
          await fetchOneStudentDetails();
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

  const handleDocUploadChange = async (checked) => {
    setIsDocUploadByStudent(checked);
    try {
      const payload = {
        docUploadByStudent: checked,
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Successfully applied view permission");
        await fetchOneStudentDetails();
      }
    } catch (error) {
      console.error("Failed to update docUploadByStudent:", error);
      setIsDocUploadByStudent((prev) => !prev);
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
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Status updated successfully");
        setShowModal(false);
        setSelectedStatus(null);
        setRemarks("");
        setSelectedDocId(null);
        await fetchOneStudentDetails();
      } else {
        toast.error(res?.data?.message || "Error updating status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentStatusChange = async (selectedOption) => {
    setSelectedStudentStatus(selectedOption);
    try {
      const payload = {
        mainStatus: selectedOption.value,
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Student status updated successfully");
        await fetchOneStudentDetails();
      } else {
        toast.error(res?.data?.message || "Error updating student status");
        setSelectedStudentStatus(null);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating student status",
      );
      setSelectedStudentStatus(null);
    }
  };

  const handleMainTabStatusChange = async (opt) => {
    setSelectedApplicationStatus(opt);
    let payload = {};
    if (activeTab === "personal") {
      payload.personalDetailStatus = opt.value;
    } else if (activeTab === "document") {
      payload.documentDetailStatus = opt.value;
    } else if (activeTab === "courseSelection") {
      payload.counsellingDetailStatus = opt.value;
    }

    try {
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Application status updated successfully");
        await fetchOneStudentDetails();
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
      background:
        "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
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

  const isUserAllocated = formData.userAllocationDetails.some((allocation) => {
    return allocation.user?._id === currentUserId;
  });
  const showApplicationStatusSelect =
    activeTab === "document" && (userRole === "Super Admin" || isUserAllocated);
  return (
    <>
      <div>
        <div className="form-main-heading w-100 p-2 position-sticky top-0 z-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3 align-items-center">
              <h3 className="fw-bold text-white mb-0">Student Details</h3>

              <h5 className="mb-0 text-white ">
                <span
                  className="badge bg-white text-primary rounded-pill px-3 py-2 shadow-sm"
                  style={{ fontSize: "0.8rem" }}
                >
                  {student?.name} ({student?.studentId})
                </span>
                <span className=""> </span>
              </h5>
            </div>

            <Button
              variant="link"
              onClick={() =>
                navigate("/student/studentApplication", {
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
            {/* <div className="card-title">Student Information</div> */}
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
            <StudentInfo
              student={student}
              setShowStudentInfoModal={setShowStudentInfoModal}
              studentStatusOptions={studentStatusOptions}
              selectedStudentStatus={selectedStudentStatus}
              handleStudentStatusChange={handleStudentStatusChange}
              userRole={userRole}
              userType={userType}
              showStudentInfoModal={showStudentInfoModal}
              studentInfoFormik={studentInfoFormik}
              countries={countries}
              oneStudentData={oneStudentData}
              fetchOneStudentDetails={fetchOneStudentDetails}
              customStyles={customStyles}
            />

            {/* <ProgressSteps id={id} /> */}

            {/* Tabs */}
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedPersonalSection={selectedPersonalSection}
              selectedDocType={selectedDocType}
              selectedCounsellingSection={selectedCounsellingSection}
              selectedVisaSection={selectedVisaSection}
              documentTypes={countryDocuments?.data?.[0]?.documents || []}
              onDocumentTypeSelect={handleDocumentTypeSelect}
              onPersonalSectionSelect={handlePersonalSectionSelect}
              onCounsellingSectionSelect={handleCounsellingSectionSelect}
              onVisaSectionSelect={handleVisaSectionSelect}
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
              primaryPreferredCountry={primaryPreferredCountry}
              id={id}
            />
            {activeTab === "document" &&
              userRole !== "Student" &&
              userRole !== "LeadStudent" && (
                <>
                  <div className="my-5 p-4 bg-light rounded shadow-sm">
                    <Form>
                      <Form.Group>
                        <div className="d-flex gap-3 align-items-center">
                          <strong>Document View?</strong>
                          <Form.Check
                            type="radio"
                            label="Yes"
                            id="docUploadByStudentYes"
                            name="docUploadByStudent"
                            checked={isDocUploadByStudent === true}
                            onChange={() => handleDocUploadChange(true)}
                            className="custom-radio-border"
                          />
                          <Form.Check
                            type="radio"
                            label="No"
                            id="docUploadByStudentNo"
                            name="docUploadByStudent"
                            checked={isDocUploadByStudent === false}
                            onChange={() => handleDocUploadChange(false)}
                            className="custom-radio-border"
                          />
                        </div>
                      </Form.Group>
                    </Form>
                  </div>
                </>
              )}

            <FollowUpModal
              show={showFollowUpModal}
              formatDate={formatDate}
              parseDate={parseDate}
              oneStudentData={oneStudentData}
              setShowFollowUpModal={setShowFollowUpModal}
              fetchOneStudentDetails={fetchOneStudentDetails}
              id={id}
              toISODate={toISODate}
              activeTab={activeTabForModal}
            />

            {activeTab === "personal" && (
              <>
                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "education") && (
                  <EducationSection
                    formData={formData}
                    edit={edit}
                    setEdit={setEdit}
                    handleDocumentUploadEducation={
                      handleDocumentUploadEducation
                    }
                    countryDocuments={countryDocuments}
                    oneStudentData={oneStudentData}
                    docTypeOptions={docTypeOptions}
                    handleDocTypeChange={handleDocTypeChange}
                    selectedDocType={selectedDocType}
                    setSelectedDocType={setSelectedDocType}
                    documentNames={documentNames}
                    handleDocNameChange={handleDocNameChange}
                    selectedDocumentName={selectedDocumentName}
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                    customDocName={customDocName}
                    setCustomDocName={setCustomDocName}
                    setSelectedDocumentName={setSelectedDocumentName}
                    setFormData={setFormData}
                    fetchOneStudentDetails={fetchOneStudentDetails}
                    id={id}
                    mode="student"
                    userRole={userRole}
                  />
                )}
                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "languageExam") && (
                  <LanguageEntranceExam
                    formData={formData}
                    edit={edit}
                    setEdit={setEdit}
                    handleDocumentUploadEducation={
                      handleDocumentUploadEducation
                    }
                    countryDocuments={countryDocuments}
                    oneStudentData={oneStudentData}
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
                    setFormData={setFormData}
                    fetchOneStudentDetails={fetchOneStudentDetails}
                    id={id}
                    selectedFile={selectedFile}
                    mode="student"
                    userRole={userRole}
                  />
                )}
                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "aptitudeExam") && (
                  <AptitudeExamSection
                    formData={formData}
                    edit={edit}
                    setEdit={setEdit}
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
                    setFormData={setFormData}
                    fetchOneStudentDetails={fetchOneStudentDetails}
                    id={id}
                    selectedFile={selectedFile}
                    mode="student"
                    userRole={userRole}
                  />
                )}
                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "workExperience") && (
                  <WorkExperience
                    formData={formData}
                    edit={edit}
                    setEdit={setEdit}
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
                    setFormData={setFormData}
                    fetchOneStudentDetails={fetchOneStudentDetails}
                    id={id}
                    selectedFile={selectedFile}
                    mode="student"
                    userRole={userRole}
                  />
                )}

                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "remarks") && (
                  <Remarks
                    formData={formData}
                    edit={edit}
                    setEdit={setEdit}
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
                    setFormData={setFormData}
                    fetchOneStudentDetails={fetchOneStudentDetails}
                    id={id}
                    selectedFile={selectedFile}
                    mode="student"
                    userRole={userRole}
                  />
                )}

                {(selectedPersonalSection === "all" ||
                  selectedPersonalSection === "emergencyDetails") && (
                  <EmergencyDetails
                    formData={formData}
                    edit={edit}
                    setEdit={setEdit}
                    setFormData={setFormData}
                    fetchOneStudentDetails={fetchOneStudentDetails}
                    id={id}
                    mode="student"
                    userRole={userRole}
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
                    x
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
                    handleAllDownloadDocument={handleAllDownloadDocument}
                    handleCheckboxChange={handleCheckboxChange}
                    handleOtherDocUpload={handleOtherDocUpload}
                    handleAllDocumentsDownload={handleAllDocumentsDownload}
                    fetchOneStudentDetails={fetchOneStudentDetails}
                  />
                ) : null}
              </>
            )}

            {activeTab === "courseSelection" && (
              <>
                {(selectedCounsellingSection === "all" ||
                  selectedCounsellingSection === "interestedCourse") && (
                  <div className="my-5 p-4 bg-light rounded shadow-sm">
                    <InterestedCourseSection
                      formData={formData}
                      edit={edit}
                      setEdit={setEdit}
                      id={id}
                      oneStudentData={oneStudentData}
                      filterState={location.state}
                      setFormData={setFormData}
                      fetchOneStudentDetails={fetchOneStudentDetails}
                    />
                  </div>
                )}

                {(selectedCounsellingSection === "all" ||
                  selectedCounsellingSection ===
                    "educationLoanInformation") && (
                  <EducationLoan
                    fetchOneStudentDetails={fetchOneStudentDetails}
                    formData={formData}
                    userRole={userRole}
                    edit={edit}
                    id={id}
                  />
                )}

                {userRole !== "B2B Admin" &&
                  userRole !== "B2B Member" &&
                  (selectedCounsellingSection === "all" ||
                    selectedCounsellingSection === "userAllocation") && (
                    <div className="my-5 p-4 bg-light rounded shadow-sm">
                      <UserAllocationSection
                        formData={formData}
                        edit={edit}
                        setEdit={setEdit}
                        getAllRollList={getAllRollList}
                        allUser={allUser}
                        setAllUser={setAllUser}
                        fetchAllUser={fetchAllUser}
                        setFormData={setFormData}
                        fetchOneStudentDetails={fetchOneStudentDetails}
                        id={id}
                        userRole={userRole}
                      />
                    </div>
                  )}

                {(selectedCounsellingSection === "all" ||
                  selectedCounsellingSection === "studentVisaByRG") && (
                  <StudentVisaByUs
                    formData={formData}
                    edit={edit}
                    fetchOneStudentDetails={fetchOneStudentDetails}
                    id={id}
                    userRole={userRole}
                  />
                )}

                {userRole !== "B2B Admin" &&
                  userRole !== "B2B Member" &&
                  userRole !== "Branch" &&
                  userType !== "Branch User" &&
                  (selectedCounsellingSection === "all" ||
                    selectedCounsellingSection === "visaUserAllocation") &&
                  formData.visaByRG === true && (
                    <>
                      <div className="d-flex align-items-center gap-3 my-5 p-3 bg-light rounded shadow-sm">
                        <Form.Check
                          type="checkbox"
                          id="enableInterviewScheduling"
                          checked={showUserAllocationSection}
                          onChange={(e) =>
                            setShowUserAllocationSection(e.target.checked)
                          }
                          label=""
                          className="custom-checkbox"
                          aria-label="Enable Visa Allocation"
                          disabled={
                            userRole === "Student" || userRole === "LeadStudent"
                          }
                        />
                        <Form.Label
                          htmlFor="enableInterviewScheduling"
                          className="mb-0"
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "#333",
                            cursor: "pointer",
                          }}
                          disabled={
                            userRole === "Student" || userRole === "LeadStudent"
                          }
                        >
                          Enable Visa Allocation
                        </Form.Label>
                      </div>
                      <VisaUserAllocationSection
                        visaUserAllocation={visaUserAllocation}
                        formData={formData}
                        edit={edit}
                        setEdit={setEdit}
                        getAllRollList={getAllRollList}
                        allUser={allUser}
                        setAllUser={setAllUser}
                        fetchAllUser={fetchAllUser}
                        setFormData={setFormData}
                        fetchOneStudentDetails={fetchOneStudentDetails}
                        id={id}
                        mode="student"
                        userRole={userRole}
                      />
                    </>
                  )}

                {(selectedCounsellingSection === "all" ||
                  selectedCounsellingSection === "studentVisaByRG") &&
                  formData?.visaByRG === false && (
                    <StudentVisaOutCome
                      visaOutcomeFilePaths={visaOutcomeFilePaths}
                      userRole={userRole}
                      visaOutcomeTrackingStatusOptions={
                        visaOutcomeTrackingStatusOptions
                      }
                      visaOutcomeFormik={visaOutcomeFormik}
                      isLoading={isLoading}
                      formData={formData}
                      id={id}
                      selectedDocsIds={selectedDocsIds}
                      handleCheckboxChangeId={handleCheckboxChangeId}
                      selectedDocumentNames={selectedDocumentNames}
                      sendPendingDocumentMain={sendPendingDocumentMain}
                      fetchOneStudentDetails={fetchOneStudentDetails}
                    />
                  )}
              </>
            )}

            {activeTab === "visaApplication" && (
              <>
                {isSectionEnabled("visaStageInitiation") &&
                  (selectedVisaSection === "all" ||
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
                {isSectionEnabled("visaAllocation") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "visaAllocation") && (
                    <div>
                      <VisaUserAllocationSection
                        visaUserAllocation={visaUserAllocation}
                        formData={formData}
                        edit={edit}
                        setEdit={setEdit}
                        getAllRollList={getAllRollList}
                        allUser={allUser}
                        setAllUser={setAllUser}
                        fetchAllUser={fetchAllUser}
                        setFormData={setFormData}
                        fetchOneStudentDetails={fetchOneStudentDetails}
                        id={id}
                        mode="student"
                        userRole={userRole}
                      />
                    </div>
                  )}
                {isSectionEnabled("vfsAppointmentDate") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "vfsAppointmentDate") && (
                    <>
                      <VFSAppointment
                        id={id}
                        formatDate={formatDate}
                        parseDate={parseDate}
                        formData={formData}
                        toISODate={toISODate}
                        fetchOneStudentDetails={fetchOneStudentDetails}
                        mode="student"
                        userRole={userRole}
                      />
                    </>
                  )}
                {isSectionEnabled("visaApplicationOnlineSubmission") &&
                  (selectedVisaSection === "all" ||
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
                      showModal={showModal}
                      remarks={remarks}
                      selectedStatus={selectedStatus}
                      handleStatusChange={handleStatusChange}
                      selectedDocId={selectedDocId}
                      setShowModal={setShowModal}
                      handleOtherDocUpload={handleOtherDocUpload}
                      handleSingleDocumentDownload={
                        handleSingleDocumentDownload
                      }
                      id={id}
                      handleCheckboxChangeId={handleCheckboxChangeId}
                      sendPendingDocumentMain={sendPendingDocumentMain}
                      selectedDocumentNames={selectedDocumentNames}
                      mode="student"
                    />
                  )}
                {isSectionEnabled("fileHandover") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "fileHandover") && (
                    <FileHandover
                      formData={formData}
                      formatDate={formatDate}
                      parseDate={parseDate}
                      fetchOneStudentDetails={fetchOneStudentDetails}
                      id={id}
                      userRole={userRole}
                    />
                  )}
                {isSectionEnabled("dVisaApply") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "dVisaApply") && (
                    <DVisaApply
                      dVisaDocsFilePaths={dVisaDocsFilePaths}
                      isLoading={isLoading}
                      handleFileChange={handleFileChange}
                      userRole={userRole}
                      formData={formData}
                      selectedDocsIds={selectedDocsIds}
                      getStatusColor={getStatusColor}
                      handleSingleDocumentDownload={
                        handleSingleDocumentDownload
                      }
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
                      handleVisaFlowDocumentUpload={
                        handleVisaFlowDocumentUpload
                      }
                      fetchOneStudentDetails={fetchOneStudentDetails}
                      mode="student"
                    />
                  )}
                {isSectionEnabled("biometricsVFSAppointment") &&
                  (selectedVisaSection === "all" ||
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
                      handleSingleDocumentDownload={
                        handleSingleDocumentDownload
                      }
                      id={id}
                      setSelectedStatus={setSelectedStatus}
                      statusOptions={statusOptions}
                      setRemarks={setRemarks}
                      remarks={remarks}
                      showModal={showModal}
                      selectedStatus={selectedStatus}
                      handleStatusChange={handleStatusChange}
                      setSelectedDocId={setSelectedDocId}
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
                {isSectionEnabled("visaFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "visaFeePayment") && (
                    <VisaFeePayment
                      selectedVisaSection={selectedVisaSection}
                      visaFeePaymentFilePaths={visaFeePaymentFilePaths}
                      handleFileChange={handleFileChange}
                      userRole={userRole}
                      formData={formData}
                      selectedDocsIds={selectedDocsIds}
                      getStatusColor={getStatusColor}
                      handleSingleDocumentDownload={
                        handleSingleDocumentDownload
                      }
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
                      handleVisaFlowDocumentUpload={
                        handleVisaFlowDocumentUpload
                      }
                      fetchOneStudentDetails={fetchOneStudentDetails}
                      mode="student"
                    />
                  )}
                {isSectionEnabled("supplementaryAdditionalRequirement") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "supplementaryAdditionalRequirement") && (
                    <SupplementaryAdditionalRequirement
                      selectedVisaSection={selectedVisaSection}
                      supplementaryAdditionalFilePaths={
                        supplementaryAdditionalFilePaths
                      }
                      handleFileChange={handleFileChange}
                      userRole={userRole}
                      formData={formData}
                      selectedDocsIds={selectedDocsIds}
                      getStatusColor={getStatusColor}
                      handleSingleDocumentDownload={
                        handleSingleDocumentDownload
                      }
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
                      SupplementaryAdditionalRequirement={
                        SupplementaryAdditionalRequirement
                      }
                      handleVisaFlowDocumentUpload={
                        handleVisaFlowDocumentUpload
                      }
                      fetchOneStudentDetails={fetchOneStudentDetails}
                      mode="student"
                    />
                  )}
                {isSectionEnabled("visaOutcomeTracking") &&
                  (selectedVisaSection === "all" ||
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
                      handleSingleDocumentDownload={
                        handleSingleDocumentDownload
                      }
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
                      mode="student"
                    />
                  )}
                {isSectionEnabled("rpDecision") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "rpDecision") && (
                    <RpDecision
                      selectedVisaSection={selectedVisaSection}
                      rpDecisionFilePaths={rpDecisionFilePaths}
                      formatDate={formatDate}
                      parseDate={parseDate}
                      handleFileChange={handleFileChange}
                      userRole={userRole}
                      formData={formData}
                      selectedDocsIds={selectedDocsIds}
                      getStatusColor={getStatusColor}
                      handleSingleDocumentDownload={
                        handleSingleDocumentDownload
                      }
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
                      handleVisaFlowDocumentUpload={
                        handleVisaFlowDocumentUpload
                      }
                      fetchOneStudentDetails={fetchOneStudentDetails}
                      mode="student"
                    />
                  )}
                {isSectionEnabled("reapplicationAppeal") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "reapplicationAppeal") && (
                    <ReapplicationAppeal
                      formData={formData}
                      fetchOneStudentDetails={fetchOneStudentDetails}
                      id={id}
                      mode="student"
                      userRole={userRole}
                    />
                  )}
                {isSectionEnabled("visadocuments") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "visadocuments") && (
                    <div className="mb-4 my-5 p-4 bg-light rounded shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-primary mb-0">Visa Documents</h6>
                      </div>
                      <DocumentHandler
                        applicationData={formData}
                        documentTypes={[
                          "Visa Fee Payment",
                          "Appointment Letter",
                          "Biometrics Receipt",
                          "PIC Decision",
                          "D Visa Document",
                          "Supplementary Additional",
                          "Visa Application Submission",
                          "Visa Outcome Proof",
                        ]}
                        id={id}
                        dispatch={dispatch}
                        updateStudentApplication={updateStudentApplication}
                        deleteStudentApplication={deleteStudentApplication}
                        downloadDocument={downloadDocument}
                        userRole={userRole}
                        selectedDocsIds={selectedDocsIds}
                        handleCheckboxChangeId={handleCheckboxChangeId}
                        selectedDocumentNames={selectedDocumentNames}
                        sendPendingDocumentMain={sendPendingDocumentMain}
                        fetchData={fetchOneStudentDetails}
                      />
                    </div>
                  )}
                {/* ======================== USA Visa Flow ======================== */}
                {isSectionEnabled("usaApplication") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaApplication") && (
                    <UsaApplication id={id} />
                  )}
                {isSectionEnabled("usaReceived") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaReceived") && (
                    <UsaReceived id={id} />
                  )}
                {isSectionEnabled("usaSevisFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaSevisFeePayment") && (
                    <UsaSEVISFeePayment id={id} />
                  )}
                {isSectionEnabled("usaRegistration") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaRegistration") && (
                    <UsaRegistration id={id} />
                  )}
                {isSectionEnabled("usaConfirmation") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaConfirmation") && (
                    <UsaConfirmation id={id} />
                  )}
                {isSectionEnabled("usaVisaFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaVisaFeePayment") && (
                    <UsaVisaFeePayment id={id} />
                  )}
                {isSectionEnabled("usaAppointmentBooking") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaAppointmentBooking") && (
                    <UsaAppointmentBooking id={id} />
                  )}
                {isSectionEnabled("usaFundsShow") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaFundsShow") && (
                    <UsaFundsShow id={id} />
                  )}
                {isSectionEnabled("usaVisaDecisionIssuance") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "usaVisaDecisionIssuance") && (
                    <UsaVisaDecisionIssuance id={id} />
                  )}
                {/* ======================== UK Visa Flow ======================== */}
                {isSectionEnabled("ukConfirmationofAcceptanceforStudies") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "ukConfirmationofAcceptanceforStudies") && (
                    <UkConfirmationofAcceptanceforStudies id={id} />
                  )}
                {isSectionEnabled("ukTuitionFeeMaintenanceFunds") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ukTuitionFeeMaintenanceFunds") && (
                    <UkTuitionFeeMaintenanceFunds id={id} />
                  )}
                {isSectionEnabled("ukTBTest") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ukTBTest") && <UkTBTest id={id} />}
                {isSectionEnabled("ukVisaApplicationForm") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ukVisaApplicationForm") && (
                    <UkVisaApplicationForm id={id} />
                  )}
                {isSectionEnabled("ukIHSEmbassyVFSVisaFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "ukIHSEmbassyVFSVisaFeePayment") && (
                    <UkIHSEmbassyVFSVisaFeePayment id={id} />
                  )}
                {isSectionEnabled("ukBiometricAppointment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ukBiometricAppointment") && (
                    <UkBiometricAppointment id={id} />
                  )}
                {isSectionEnabled("ukBiometricCompleted") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ukBiometricCompleted") && (
                    <UkBiometricCompleted id={id} />
                  )}
                {isSectionEnabled("ukVisaDecisionPassportCollection") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "ukVisaDecisionPassportCollection") && (
                    <UkVisaDecisionPassportCollection id={id} />
                  )}
                {/* ======================== Australia Visa Flow ======================== */}
                {isSectionEnabled("ausOfferLetter") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausOfferLetter") && (
                    <AusOfferLetter id={id} />
                  )}
                {isSectionEnabled("ausConfirmationofEnrolment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausConfirmationofEnrolment") && (
                    <AusConfirmationofEnrolment id={id} />
                  )}
                {isSectionEnabled("ausMedicalExamination") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausMedicalExamination") && (
                    <AusMedicalExamination id={id} />
                  )}
                {isSectionEnabled("ausTuitionFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausTuitionFeePayment") && (
                    <AusTuitionFeePayment id={id} />
                  )}
                {isSectionEnabled("ausOverseasStudentHealthCover") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "ausOverseasStudentHealthCover") && (
                    <AusOverseasStudentHealthCover id={id} />
                  )}
                {isSectionEnabled("ausImmiAccountCreation") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausImmiAccountCreation") && (
                    <AusImmiAccountCreation id={id} />
                  )}
                {isSectionEnabled("ausVisaApplication") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausVisaApplication") && (
                    <AusVisaApplication id={id} />
                  )}
                {isSectionEnabled("ausVisaFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausVisaFeePayment") && (
                    <AusVisaFeePayment id={id} />
                  )}
                {isSectionEnabled("ausBiometrics") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausBiometrics") && (
                    <AusBiometrics id={id} />
                  )}
                {isSectionEnabled("ausVisaOutcome") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausVisaOutcome") && (
                    <AusVisaOutcome id={id} />
                  )}
                {isSectionEnabled("ausTravelEntryPreparation") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "ausTravelEntryPreparation") && (
                    <AusTravelEntryPreparation id={id} />
                  )}
                {/* ======================== Germany Visa Flow ======================== */}
                {isSectionEnabled("gerAdmissionLetter") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerAdmissionLetter") && (
                    <GerAdmissionLetter id={id} />
                  )}
                {isSectionEnabled("gerBlockedAccount") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerBlockedAccount") && (
                    <GerBlockedAccount id={id} />
                  )}
                {isSectionEnabled("gerHealthInsurance") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerHealthInsurance") && (
                    <GerHealthInsurance id={id} />
                  )}
                {isSectionEnabled("gerVisaApplicationForm") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerVisaApplicationForm") && (
                    <GerVisaApplicationForm id={id} />
                  )}
                {isSectionEnabled("gerAppointmentBooking") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerAppointmentBooking") && (
                    <GerAppointmentBooking id={id} />
                  )}
                {isSectionEnabled("gerVisaFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerVisaFeePayment") && (
                    <GerVisaFeePayment id={id} />
                  )}
                {isSectionEnabled("gerBiometricsInterview") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerBiometricsInterview") && (
                    <GerBiometricsInterview id={id} />
                  )}
                {isSectionEnabled("gerVisaDecisionIssuance") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerVisaDecisionIssuance") && (
                    <GerVisaDecisionIssuance id={id} />
                  )}
                {isSectionEnabled("gerTravelResidencePermit") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "gerTravelResidencePermit") && (
                    <GerTravelResidencePermit id={id} />
                  )}
                {/* ======================== France Visa Flow ======================== */}
                {isSectionEnabled("franceOfferAdmissionLetter") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "franceOfferAdmissionLetter") && (
                    <FranceOfferAdmissionLetter id={id} />
                  )}
                {isSectionEnabled("franceCampusFranceRegistration") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "franceCampusFranceRegistration") && (
                    <FranceCampusFranceRegistration id={id} />
                  )}
                {isSectionEnabled("franceTuitionFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "franceTuitionFeePayment") && (
                    <FranceTuitionFeePayment id={id} />
                  )}
                {isSectionEnabled("franceProofofFundsBlockedAccount") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "franceProofofFundsBlockedAccount") && (
                    <FranceProofofFundsBlockedAccount id={id} />
                  )}
                {isSectionEnabled("franceMedicalInsurance") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "franceMedicalInsurance") && (
                    <FranceMedicalInsurance id={id} />
                  )}
                {isSectionEnabled("franceFranceVisasOnlineForm") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "franceFranceVisasOnlineForm") && (
                    <FranceFranceVisasOnlineForm id={id} />
                  )}
                {isSectionEnabled("franceVisaFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "franceVisaFeePayment") && (
                    <FranceVisaFeePayment id={id} />
                  )}
                {isSectionEnabled("franceAppointmentBooking") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "franceAppointmentBooking") && (
                    <FranceAppointmentBooking id={id} />
                  )}
                {isSectionEnabled("franceBiometricsDocumentSubmission") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "franceBiometricsDocumentSubmission") && (
                    <FranceBiometricsDocumentSubmission id={id} />
                  )}
                {isSectionEnabled("franceVisaDecisionIssuance") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "franceVisaDecisionIssuance") && (
                    <FranceVisaDecisionIssuance id={id} />
                  )}
                {isSectionEnabled("francePostArrivalFormalities") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "francePostArrivalFormalities") && (
                    <FrancePostArrivalFormalities id={id} />
                  )}
                {/* ======================== Canada Visa Flow ======================== */}
                {isSectionEnabled("CanadaConditionalOfferLetter") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaConditionalOfferLetter") && (
                    <CanadaConditionalOfferLetter id={id} />
                  )}
                {isSectionEnabled("CanadaMedicalProcess") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaMedicalProcess") && (
                    <CanadaMedicalProcess id={id} />
                  )}
                {isSectionEnabled("CanadaTuitionFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaTuitionFeePayment") && (
                    <CanadaTuitionFeePayment id={id} />
                  )}
                {isSectionEnabled("CanadaGICBankAccountCreation") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaGICBankAccountCreation") && (
                    <CanadaGICBankAccountCreation id={id} />
                  )}
                {isSectionEnabled("CanadaIRCCAccount") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaIRCCAccount") && (
                    <CanadaIRCCAccount id={id} />
                  )}
                {isSectionEnabled("CanadaApplicationFormLock") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaApplicationFormLock") && (
                    <CanadaApplicationFormLock id={id} />
                  )}
                {isSectionEnabled("CanadaVisaFeePayment") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaVisaFeePayment") && (
                    <CanadaVisaFeePayment id={id} />
                  )}
                {isSectionEnabled("CanadaVisaSubmissionConfirmation") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "CanadaVisaSubmissionConfirmation") && (
                    <CanadaVisaSubmissionConfirmation id={id} />
                  )}
                {isSectionEnabled("CanadaBiometricRequest") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaBiometricRequest") && (
                    <CanadaBiometricRequest id={id} />
                  )}
                {isSectionEnabled("CanadaBvlPpr") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaBvlPpr") && (
                    <CanadaBvlPpr id={id} />
                  )}
                {isSectionEnabled("CanadaVisaDecisionIssuance") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaVisaDecisionIssuance") && (
                    <CanadaVisaDecisionIssuance id={id} />
                  )}
                {isSectionEnabled("CanadaPortofEntryLetter") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaPortofEntryLetter") && (
                    <CanadaPortofEntryLetter id={id} />
                  )}
                {isSectionEnabled("CanadaStudyCoOpWorkPermits") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection === "CanadaStudyCoOpWorkPermits") && (
                    <CanadaStudyCoOpWorkPermits id={id} />
                  )}
                {/* ======================== Singapore Visa Flow ======================== */}
                {isSectionEnabled("singaporeSolarApplicationSubmission") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeSolarApplicationSubmission") && (
                    <SingaporeSolarApplicationSubmission id={id} />
                  )}
                {/* {isSectionEnabled("singaporeICAReviewProcessing") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeICAReviewProcessing") && (
                    <SingaporeICAReviewProcessing id={id} />
                  )}
                {isSectionEnabled("singaporeInPrincipleApprovalIssued") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeInPrincipleApprovalIssued") && (
                    <SingaporeInPrincipleApprovalIssued id={id} />
                  )}
                {isSectionEnabled("singaporePreDeparturePreparation") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporePreDeparturePreparation") && (
                    <SingaporePreDeparturePreparation id={id} />
                  )}
                {isSectionEnabled("singaporeArrivalInSingapore") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeArrivalInSingapore") && (
                    <SingaporeArrivalInSingapore id={id} />
                  )}
                {isSectionEnabled("singaporeMedicalExamination") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeMedicalExamination") && (
                    <SingaporeMedicalExamination id={id} />
                  )}
                {isSectionEnabled("singaporeICAAppointmentBooking") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeICAAppointmentBooking") && (
                    <SingaporeICAAppointmentBooking id={id} />
                  )}
                {isSectionEnabled("singaporeStudentPassIssued") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeStudentPassIssued") && (
                    <SingaporeStudentPassIssued id={id} />
                  )}
                {isSectionEnabled("singaporeCourseCommencement") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeCourseCommencement") && (
                    <SingaporeCourseCommencement id={id} />
                  )}
                {isSectionEnabled("singaporePartTimeWorkEligibility") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporePartTimeWorkEligibility") && (
                    <SingaporePartTimeWorkEligibility id={id} />
                  )}
                {isSectionEnabled("singaporeStudentPassRenewalCompletion") &&
                  (selectedVisaSection === "all" ||
                    selectedVisaSection ===
                      "singaporeStudentPassRenewalCompletion") && (
                    <SingaporeStudentPassRenewalCompletion id={id} />
                  )} */}
              </>
            )}

            {activeTab === "accountant" && (
              <>
                <ApplicationAccountant
                  accountantData={accountantData}
                  oneStudentData={oneStudentData}
                  fetchAccountant={fetchAccountant}
                  totalData={totalData}
                  mainPlanKey="student admission"
                />
              </>
            )}

            <div className="d-flex justify-content-center align-items-center my-5 gap-3">
              {userRole !== "B2B Admin" &&
                userRole !== "B2B Member" &&
                userRole !== "Branch" &&
                userType !== "Branch User" &&
                userRole !== "Student" &&
                userRole !== "LeadStudent" && (
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
                  userType === "Branch User" ||
                  userRole === "Student" ||
                  userRole === "LeadStudent"
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
              {userRole !== "Super Admin" &&
                userRole !== "Student" &&
                userRole !== "LeadStudent" && (
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
                          await dispatch(updateStudentApplication(payload, id));

                          await fetchOneStudentDetails();
                          toast.success("Details saved successfully!");
                        } catch (error) {
                          toast.error(
                            error?.response?.data?.message ||
                              "Error updating student details",
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
                          (activeTab === "courseSelection" &&
                            !oneStudentData?.submittedTabs?.includes(
                              "document",
                            )) ||
                          (activeTab === "visaApplication" &&
                            !oneStudentData?.submittedTabs?.includes(
                              "courseSelection",
                            )))
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

export default StudentDetails;
