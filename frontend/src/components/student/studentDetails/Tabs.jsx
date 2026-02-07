import { Nav, Row, Col, Button } from "react-bootstrap";
import { useRef, useState, useLayoutEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Select from "react-select";
import { useParams } from "react-router-dom";
import usePermissions from "../../commonComponents/usePermissions";

const Tabs = ({
  activeTab,
  setActiveTab,
  documentTypes = [],
  onDocumentTypeSelect,
  onPersonalSectionSelect,
  onCounsellingSectionSelect,
  onVisaSectionSelect,
  selectedPersonalSection,
  selectedDocType,
  selectedCounsellingSection,
  selectedVisaSection,
  submittedTabs = [],
  userRole = "",
  userType = "",
  pendingDocCount,
  applicationstatusoptions,
  selectedApplicationStatus,
  handleMainTabStatusChange,
  customStyles,
  showApplicationStatusSelect,
  sendPendingDocumentMain,
  selectedDocumentNames,
  selectedDocsIds,
  formData,
  handleFollowUpToggle,
  primaryPreferredCountry,
}) => {
  const { id } = useParams();
  const personalPermissions = usePermissions(
    "Student Applications",
    "Personal Details",
  );
  const documentPermissions = usePermissions(
    "Student Applications",
    "Document",
  );
  const courseSelectionPermissions = usePermissions(
    "Student Applications",
    "Course Selection",
  );
  const visaApplicationPermissions = usePermissions(
    "Student Applications",
    "Visa Application",
  );
  const accountantPermissions = usePermissions(
    "Student Applications",
    "Accountant",
  );
  const remarksPermissions = usePermissions("Student Applications", "Remarks");

  const TAB_FLOW = [
    "personal",
    "document",
    "courseSelection",
    "visaApplication",
    "accountant",
  ];

  const personalSections = [
    { key: "all", label: "All" },
    { key: "education", label: "Education" },
    { key: "languageExam", label: "Language Entrance Exam" },
    { key: "aptitudeExam", label: "Aptitude Exam" },
    { key: "workExperience", label: "Work Experience" },
    { key: "remarks", label: "Remarks" },
    { key: "emergencyDetails", label: "Emergency Details" },
  ];

  const counsellingSections = [
    { key: "all", label: "All" },
    { key: "interestedCourse", label: "Interested Course" },
    { key: "educationLoanInformation", label: "Education Loan Information" },
    ...(userRole !== "B2B Admin"
      ? [{ key: "userAllocation", label: "User Allocation" }]
      : []),
    { key: "studentVisaByRG", label: "Student Visa By US" },
    ...(!(
      userRole === "B2B Admin" ||
      userRole === "B2B Member" ||
      userRole === "Branch" ||
      userType === "Branch User"
    ) && formData?.visaByRG
      ? [{ key: "visaUserAllocation", label: "Visa User Allocation" }]
      : []),
  ];

  const [selectedDocCategory, setSelectedDocCategory] = useState("student");
  const getDefaultSubOption = (categoryKey) => {
    return categoryKey === "rgdocument" ? "allrg" : "all";
  };

  const documentTypeOptions = [
    {
      key: "student",
      label: "Student",
      canShow:
        userRole === "Super Admin" ||
        userRole === "Student" ||
        userRole === "LeadStudent"
          ? true
          : documentPermissions.canShow,
      subOptions: [
        { key: "all", label: "All", canShow: true },
        ...documentTypes
          .filter(
            (docType) =>
              !["Visa Documents", "RG Documents"].includes(docType?.type?.name),
          )
          .map((docType, index) => {
            const docTypeName = docType?.type?.name || `UnnamedType_${index}`;
            const docPermissions = usePermissions(
              "Student Applications",
              "Document",
              docTypeName,
            );
            return {
              key: docTypeName,
              label: docType?.type?.name || "Unnamed Document Type",
              canShow:
                userRole === "Super Admin" ||
                userRole === "Student" ||
                userRole === "LeadStudent"
                  ? true
                  : docPermissions.canShow,
            };
          })
          .filter((docType) => docType.canShow),
        {
          key: "other",
          label: "Other Documents",
          canShow:
            userRole === "Super Admin" ||
            userRole === "Student" ||
            userRole === "LeadStudent"
              ? true
              : usePermissions(
                  "Student Applications",
                  "Document",
                  "Other Documents",
                ).canShow,
        },
      ].filter((docType) => docType.canShow),
    },
    {
      key: "rgdocument",
      label: "External Document",
      canShow:
        userRole === "Super Admin" ||
        userRole === "Student" ||
        userRole === "LeadStudent"
          ? true
          : documentPermissions.canShow,
      subOptions: [
        { key: "allrg", label: "All", canShow: true },
        {
          key: "rgdocument",
          label: "US Documents",
          canShow:
            userRole === "Super Admin" ||
            userRole === "Student" ||
            userRole === "LeadStudent"
              ? true
              : usePermissions(
                  "Student Applications",
                  "Document",
                  "RG Documents",
                ).canShow,
        },
        {
          key: "visadocuments",
          label: "Visa Documents",
          canShow:
            userRole === "Super Admin" ||
            userRole === "Student" ||
            userRole === "LeadStudent"
              ? true
              : usePermissions(
                  "Student Applications",
                  "Document",
                  "Visa Documents",
                ).canShow,
        },
      ].filter((docType) => docType.canShow),
    },
  ].filter((category) => category.canShow);

  const visaApplicationSections = [
    { key: "all", label: "All" },
    { key: "visaStageInitiation", label: "Visa Stage Initiation" },
    { key: "visaAllocation", label: "Visa Allocation" },
    { key: "vfsAppointmentDate", label: "VFS Appointment" },
    {
      key: "visaApplicationOnlineSubmission",
      label: "Visa Application Online Submission",
    },
    { key: "fileHandover", label: "File Handover" },
    { key: "dVisaApply", label: "D Visa Apply" },
    { key: "biometricsVFSAppointment", label: "Biometrics" },
    { key: "visaFeePayment", label: "Visa Fee Payment" },
    {
      key: "supplementaryAdditionalRequirement",
      label: "Supplementary Additional Requirement",
    },
    { key: "visaOutcomeTracking", label: "Visa Outcome Tracking" },
    { key: "rpDecision", label: "RP Decision" },
    { key: "reapplicationAppeal", label: "Reapplication or Appeal" },
    // { key: "visaFileSubmission", label: "Visa File Submission" },
    { key: "visadocuments", label: "Visa Documents" },

    // USA Visa flow
    { key: "usaApplication", label: "I-20 Application" },
    { key: "usaReceived", label: "I-20 Received" },
    { key: "usaRegistration", label: "DS-160 Registration" },
    { key: "usaConfirmation", label: "DS-160 Confirmation" },
    { key: "usaVisaFeePayment", label: "Visa Fee Payment" },
    { key: "usaAppointmentBooking", label: "Appointment Booking" },
    { key: "usaSevisFeePayment", label: "SEVIS Fee Payment" },
    { key: "usaFundsShow", label: "Funds Show" },
    { key: "usaVisaDecisionIssuance", label: "Visa Decision & Issuance" },
    {
      key: "ukConfirmationofAcceptanceforStudies",
      label: "CAS (Confirmation of Acceptance for Studies)",
    },
    {
      key: "ukTuitionFeeMaintenanceFunds",
      label: "Tuition Fee & Maintenance Funds",
    },
    { key: "ukTBTest", label: "TB Test (if applicable)" },
    {
      key: "ukVisaApplicationForm",
      label: "Visa Application Form (UKVI Portal)",
    },
    {
      key: "ukIHSEmbassyVFSVisaFeePayment",
      label: "IHS & Embassy + VFS Visa Fee Payment",
    },
    {
      key: "ukBiometricAppointment",
      label: "Biometric Appointment (VFS/OFFICIAL)",
    },
    { key: "ukBiometricCompleted", label: "Biometric Completed" },
    {
      key: "ukVisaDecisionPassportCollection",
      label: "Visa Decision & Passport Collection",
    },
    { key: "ausOfferLetter", label: "Offer Letter" },
    {
      key: "ausConfirmationofEnrolment",
      label: "COE (Confirmation of Enrolment)",
    },
    { key: "ausMedicalExamination", label: "Medical Examination" },
    { key: "ausTuitionFeePayment", label: "Tuition Fee Payment" },
    {
      key: "ausOverseasStudentHealthCover",
      label: "Overseas Student Health Cover (OSHC)",
    },
    { key: "ausImmiAccountCreation", label: "ImmiAccount Creation" },
    { key: "ausVisaApplication", label: "Visa Application (Subclass 500)" },
    { key: "ausVisaFeePayment", label: " Visa Fee Payment" },
    { key: "ausBiometrics", label: "Biometrics (if requested)" },
    { key: "ausVisaOutcome", label: "Visa Outcome" },
    { key: "ausTravelEntryPreparation", label: "Travel & Entry Preparation" },
    { key: "gerAdmissionLetter", label: "Admission Letter" },
    { key: "gerBlockedAccount", label: "Blocked Account (Banking Process)" },
    { key: "gerHealthInsurance", label: "Health Insurance" },
    { key: "gerVisaApplicationForm", label: "Visa Application Form" },
    {
      key: "gerAppointmentBooking",
      label: "Appointment Booking (Embassy/Consulate)",
    },
    { key: "gerVisaFeePayment", label: "Visa Fee Payment" },
    { key: "gerBiometricsInterview", label: "Biometrics & Interview" },
    { key: "gerVisaDecisionIssuance", label: "Visa Decision & Issuance" },
    { key: "gerTravelResidencePermit", label: "Travel & Residence Permit" },
    { key: "franceOfferAdmissionLetter", label: "Offer / Admission Letter" },
    {
      key: "franceCampusFranceRegistration",
      label: "Campus France Registration",
    },
    { key: "franceTuitionFeePayment", label: "Tuition Fee Payment" },
    {
      key: "franceProofofFundsBlockedAccount",
      label: "Proof of Funds / Blocked Account",
    },
    { key: "franceMedicalInsurance", label: "Medical Insurance" },
    { key: "franceFranceVisasOnlineForm", label: "France-Visas Online Form" },
    { key: "franceVisaFeePayment", label: "Visa Fee Payment" },
    {
      key: "franceAppointmentBooking",
      label: "Appointment Booking (VFS / Embassy)",
    },
    {
      key: "franceBiometricsDocumentSubmission",
      label: "Biometrics & Document Submission",
    },
    { key: "franceVisaDecisionIssuance", label: "Visa Decision & Issuance" },
    { key: "francePostArrivalFormalities", label: "Post-Arrival Formalities" },

    // Canada Visa flow
    { key: "CanadaConditionalOfferLetter", label: "Conditional Offer Letter" },
    { key: "CanadaMedicalProcess", label: "Medical Process" },
    { key: "CanadaTuitionFeePayment", label: "Tuition Fee Payment" },
    {
      key: "CanadaGICBankAccountCreation",
      label: "GIC (Bank Account Creation)",
    },
    { key: "CanadaIRCCAccount", label: "IRCC / GCKey Account" },
    { key: "CanadaApplicationFormLock", label: "Application Form Lock" },
    { key: "CanadaVisaFeePayment", label: "Visa Fee Payment" },
    {
      key: "CanadaVisaSubmissionConfirmation",
      label: "Visa Submission Confirmation",
    },
    { key: "CanadaBiometricRequest", label: "Biometric Request" },
    { key: "CanadaBvlPpr", label: "BVL & PPR" },
    { key: "CanadaVisaDecisionIssuance", label: "Visa Decision & Issuance" },
    { key: "CanadaPortofEntryLetter", label: "Port of Entry (POE) Letter" },
    { key: "CanadaStudyCoOpWorkPermits", label: "Study / Co-op Work Permits" },

    // Singapore Visa flow
    {
      key: "singaporeSolarApplicationSubmission",
      label: "SOLAR Application Submission",
    },
    { key: "singaporeICAReviewProcessing", label: "ICA Review & Processing" },
    {
      key: "singaporeInPrincipleApprovalIssued",
      label: "IPA (In-Principle Approval) Issued",
    },
    {
      key: "singaporePreDeparturePreparation",
      label: "Pre-Departure Preparation",
    },
    { key: "singaporeArrivalInSingapore", label: "Arrival in Singapore" },
    { key: "singaporeMedicalExamination", label: "Medical Examination" },
    { key: "singaporeICAAppointmentBooking", label: "ICA Appointment Booking" },
    { key: "singaporeStudentPassIssued", label: "Student Pass Issued" },
    { key: "singaporeCourseCommencement", label: "Course Commencement" },
    {
      key: "singaporePartTimeWorkEligibility",
      label: "Part-Time Work Eligibility",
    },
    {
      key: "singaporeStudentPassRenewalCompletion",
      label: "Student Pass Renewal / Completion",
    },
  ];

  // Country-wise Visa Flow configuration (must mirror StudentDetails.jsx)
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
      "usaApplication",
      "usaReceived",
      "usaRegistration",
      "usaConfirmation",
      "usaVisaFeePayment",
      "usaAppointmentBooking",
      "usaSevisFeePayment",
      "usaFundsShow",
      "usaVisaDecisionIssuance",
      // "visaStageInitiation",
      // "visaAllocation",
      // "vfsAppointmentDate",
      // "visaApplicationOnlineSubmission",
      // "fileHandover",
      // "biometricsVFSAppointment",
      // "visaFeePayment",
      // "supplementaryAdditionalRequirement",
      // "visaOutcomeTracking",
      // "reapplicationAppeal",
      // "visadocuments",
    ],
    Canada: [
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
      // "visaStageInitiation",
      // "visaAllocation",
      // "vfsAppointmentDate",
      // "visaApplicationOnlineSubmission",
      // "fileHandover",
      // "biometricsVFSAppointment",
      // "visaFeePayment",
      // "supplementaryAdditionalRequirement",
      // "visaOutcomeTracking",
      // "reapplicationAppeal",
      // "visadocuments",
    ],
    "United Kingdom": [
      "ukConfirmationofAcceptanceforStudies",
      "ukTuitionFeeMaintenanceFunds",
      "ukTBTest",
      "ukVisaApplicationForm",
      "ukIHSEmbassyVFSVisaFeePayment",
      "ukBiometricAppointment",
      "ukBiometricCompleted",
      "ukVisaDecisionPassportCollection",
      // "visaStageInitiation",
      // "visaAllocation",
      // "vfsAppointmentDate",
      // "visaApplicationOnlineSubmission",
      // "fileHandover",
      // "biometricsVFSAppointment",
      // "visaFeePayment",
      // "supplementaryAdditionalRequirement",
      // "visaOutcomeTracking",
      // "reapplicationAppeal",
      // "visadocuments",
    ],
    Australia: [
      // "visaStageInitiation",
      // "visaAllocation",
      // "vfsAppointmentDate",
      // "visaApplicationOnlineSubmission",
      // "fileHandover",
      // "biometricsVFSAppointment",
      // "visaFeePayment",
      // "supplementaryAdditionalRequirement",
      // "visaOutcomeTracking",
      // "reapplicationAppeal",
      // "visadocuments",
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
      "gerAdmissionLetter",
      "gerBlockedAccount",
      "gerHealthInsurance",
      "gerVisaApplicationForm",
      "gerAppointmentBooking",
      "gerVisaFeePayment",
      "gerBiometricsInterview",
      "gerVisaDecisionIssuance",
      "gerTravelResidencePermit",
      // "visaStageInitiation",
      // "visaAllocation",
      // "vfsAppointmentDate",
      // "visaApplicationOnlineSubmission",
      // "fileHandover",
      // "biometricsVFSAppointment",
      // "visaFeePayment",
      // "supplementaryAdditionalRequirement",
      // "visaOutcomeTracking",
      // "reapplicationAppeal",
      // "visadocuments",
    ],
    France: [
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
      // "visaStageInitiation",
      // "visaAllocation",
      // "vfsAppointmentDate",
      // "visaApplicationOnlineSubmission",
      // "fileHandover",
      // "biometricsVFSAppointment",
      // "visaFeePayment",
      // "supplementaryAdditionalRequirement",
      // "visaOutcomeTracking",
      // "reapplicationAppeal",
      // "visadocuments",
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

  // const primaryPreferredCountry =
  //   formData?.purposeDetails?.preferredCountry?.[0] || "";'

  const allowedVisaFlow =
    countryVisaFlows[primaryPreferredCountry] || defaultVisaFlow;

  const filteredVisaApplicationSections = [
    visaApplicationSections[0],
    ...visaApplicationSections
      .slice(1)
      .filter((section) => allowedVisaFlow.includes(section.key))
      .sort(
        (a, b) =>
          allowedVisaFlow.indexOf(a.key) - allowedVisaFlow.indexOf(b.key),
      ),
  ];

  const mainTabs = [
    {
      key: "personal",
      label: "Personal Details",
      canShow:
        userRole === "Super Admin" ||
        userRole === "Student" ||
        userRole === "LeadStudent"
          ? true
          : personalPermissions.canShow,
    },
    {
      key: "document",
      label: "Document",
      canShow:
        userRole === "Super Admin" ||
        userRole === "Student" ||
        userRole === "LeadStudent"
          ? true
          : documentPermissions.canShow,
    },
    {
      key: "courseSelection",
      label: "Course Selection",
      canShow:
        userRole === "Super Admin" ||
        userRole === "Student" ||
        userRole === "LeadStudent"
          ? true
          : courseSelectionPermissions.canShow,
    },
    ...(formData?.visaByRG
      ? [
          {
            key: "visaApplication",
            label: "Visa Application",
            canShow:
              userRole === "Super Admin" ||
              userRole === "Student" ||
              userRole === "LeadStudent"
                ? true
                : visaApplicationPermissions.canShow,
          },
        ]
      : []),
    // {
    //   key: "visaApplication",
    //   label: "Visa Application",
    //   canShow:
    //     userRole === "Super Admin" ? true : visaApplicationPermissions.canShow,
    // },
    {
      key: "accountant",
      label: "Accountant",
      canShow:
        userRole === "Super Admin" ||
        userRole === "Student" ||
        userRole === "LeadStudent"
          ? true
          : accountantPermissions.canShow,
    },
  ].filter((tab) => tab.canShow);

  // const isTabAccessible = (tabKey) => {
  //   if (userRole === "Super Admin" || userRole === "Student") {
  //     return true;
  //   }

  //   if (submittedTabs.length === 0) {
  //     return tabKey === mainTabs[0]?.key;
  //   }

  //   const lastSubmittedIndex = Math.max(
  //     ...submittedTabs.map((tab) => mainTabs.findIndex((t) => t.key === tab))
  //   );

  //   const currentTabIndex = mainTabs.findIndex((tab) => tab.key === tabKey);
  //   return (
  //     submittedTabs.includes(tabKey) ||
  //     currentTabIndex === lastSubmittedIndex + 1
  //   );
  // };
  const isTabAccessible = (tabKey) => {
    if (
      userRole === "Super Admin" ||
      userRole === "Student" ||
      userRole === "LeadStudent"
    ) {
      return true;
    }

    // Already submitted → always accessible
    if (submittedTabs.includes(tabKey)) return true;

    // Find current tab index
    const currentIndex = TAB_FLOW.indexOf(tabKey);
    if (currentIndex === -1) return false;

    // First tab always accessible
    if (currentIndex === 0) return true;

    // All previous tabs must be submitted
    const requiredPreviousTabs = TAB_FLOW.slice(0, currentIndex);

    return requiredPreviousTabs.every((tab) => submittedTabs.includes(tab));
  };

  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === "personal") onPersonalSectionSelect("all");
    if (tabKey === "document") {
      setSelectedDocCategory("student");
      onDocumentTypeSelect(getDefaultSubOption("student"));
    }
    if (tabKey === "courseSelection") onCounsellingSectionSelect("all");
    if (tabKey === "visaApplication") onVisaSectionSelect("all");
  };

  const handleSubTabClick = (tabKey, subTabKey, callback) => {
    setActiveTab(tabKey);
    callback(subTabKey);
  };

  const handleDocCategoryClick = (categoryKey) => {
    setSelectedDocCategory(categoryKey);
    onDocumentTypeSelect(getDefaultSubOption(categoryKey));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      checkScroll();
    }, 0);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [activeTab, documentTypes, selectedDocCategory]);

  return (
    <div className="mb-5">
      <Row className="mb-4">
        <Col>
          <div
            className="d-flex"
            style={{
              background: "linear-gradient(135deg, #f0f4ff 0%, #e8e9eb 100%)",
              borderRadius: "15px 15px 0 0",
              padding: "10px",
              paddingBottom: "30px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
              borderBottom: "4px solid #053880",
            }}
          >
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={handleTabClick}
              className="w-100"
            >
              {mainTabs.map((tab) => (
                <Nav.Item key={tab.key} className="flex-grow-1">
                  <Nav.Link
                    eventKey={tab.key}
                    disabled={
                      tab.key === "accountant"
                        ? false
                        : !isTabAccessible(tab.key)
                    }
                    style={{
                      borderRadius: "30px",
                      margin: "0 5px",
                      padding: "12px 25px",
                      fontWeight: activeTab === tab.key ? "600" : "500",
                      fontSize: "18px",
                      color:
                        activeTab === tab.key
                          ? "#fff"
                          : isTabAccessible(tab.key) || tab.key === "accountant"
                            ? "#333"
                            : "#aaa",
                      backgroundColor:
                        activeTab === tab.key
                          ? "#053880"
                          : isTabAccessible(tab.key) || tab.key === "accountant"
                            ? "#fff"
                            : "#f5f5f5",
                      border: "none",
                      transition: "all 0.3s ease",
                      boxShadow:
                        activeTab === tab.key
                          ? "0 3px 8px rgba(113, 105, 207, 0.3)"
                          : "none",
                      position: "relative",
                      textAlign: "center",
                      cursor:
                        isTabAccessible(tab.key) || tab.key === "accountant"
                          ? "pointer"
                          : "not-allowed",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        isTabAccessible(tab.key) ||
                        tab.key === "accountant"
                      ) {
                        e.target.style.backgroundColor =
                          activeTab === tab.key ? "#1f4da0" : "#e8e9eb";
                        e.target.style.boxShadow =
                          "0 3px 8px rgba(113, 105, 207, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        isTabAccessible(tab.key) ||
                        tab.key === "accountant"
                      ) {
                        e.target.style.backgroundColor =
                          activeTab === tab.key ? "#053880" : "#fff";
                        e.target.style.boxShadow =
                          activeTab === tab.key
                            ? "0 3px 8px rgba(113, 105, 207, 0.3)"
                            : "none";
                      }
                    }}
                  >
                    {tab.label}
                    {/* {activeTab === tab.key && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-16px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "0",
                          height: "0",
                          borderLeft: "8px solid transparent",
                          borderRight: "8px solid transparent",
                          borderTop: "8px solid #053880",
                        }}
                      />
                    )} */}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>
        </Col>
      </Row>

      {(activeTab === "personal" ||
        activeTab === "document" ||
        activeTab === "courseSelection" ||
        activeTab === "visaApplication") && (
        <Row>
          <Col className="d-flex justify-content-between align-items-center">
            <div
              className="w-75 d-flex flex-column position-relative"
              style={{
                padding: "15px 20px",
                backgroundColor: "#fff",
                borderRadius: "0 0 10px 10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                marginTop: "-10px",
              }}
            >
              {activeTab === "document" && (
                <div className="d-flex mb-3">
                  {documentTypeOptions.map((category) => (
                    <span
                      key={category.key}
                      onClick={() => handleDocCategoryClick(category.key)}
                      style={{
                        fontSize: "16px",
                        fontWeight:
                          selectedDocCategory === category.key ? "600" : "400",
                        color:
                          selectedDocCategory === category.key
                            ? "#053880"
                            : "#000000",
                        textDecoration: "underline",
                        textDecorationColor:
                          selectedDocCategory === category.key
                            ? "#053880"
                            : "#d0d0d0",
                        textDecorationThickness: "2px",
                        textUnderlineOffset: "4px",
                        cursor: isTabAccessible("document")
                          ? "pointer"
                          : "not-allowed",
                        transition: "all 0.3s ease",
                        padding: "8px 15px",
                        marginRight: "15px",
                        display: "inline-block",
                        pointerEvents: isTabAccessible("document")
                          ? "auto"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (isTabAccessible("document")) {
                          e.target.style.color =
                            selectedDocCategory === category.key
                              ? "#1f4da0"
                              : "#053880";
                          e.target.style.textDecorationColor =
                            selectedDocCategory === category.key
                              ? "#1f4da0"
                              : "#053880";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isTabAccessible("document")) {
                          e.target.style.color =
                            selectedDocCategory === category.key
                              ? "#053880"
                              : "#000000";
                          e.target.style.textDecorationColor =
                            selectedDocCategory === category.key
                              ? "#053880"
                              : "#d0d0d0";
                        }
                      }}
                    >
                      {category.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="d-flex align-items-center position-relative gap-2">
                {showLeftArrow && (
                  <div
                    onClick={scrollLeft}
                    style={{
                      cursor: "pointer",
                      padding: "0 10px",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.3s ease",
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.querySelector("svg").style.color =
                        "#1f4da0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.querySelector("svg").style.color =
                        "#053880";
                    }}
                  >
                    <ArrowBackIosNewIcon
                      style={{
                        fontSize: "20px",
                        color: "#053880",
                      }}
                    />
                  </div>
                )}

                <div
                  ref={scrollContainerRef}
                  className="d-flex scroll-container"
                  style={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    flex: 1,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style>
                    {`
                      .scroll-container::-webkit-scrollbar {
                        display: none;
                      }
                    `}
                  </style>
                  {activeTab === "personal" &&
                    personalSections.map((section) => (
                      <span
                        key={section.key}
                        onClick={() =>
                          handleSubTabClick(
                            "personal",
                            section.key,
                            onPersonalSectionSelect,
                          )
                        }
                        style={{
                          fontSize: "16px",
                          fontWeight:
                            selectedPersonalSection === section.key
                              ? "600"
                              : "400",
                          color:
                            selectedPersonalSection === section.key
                              ? "#053880"
                              : "#000000",
                          textDecoration: "underline",
                          textDecorationColor:
                            selectedPersonalSection === section.key
                              ? "#053880"
                              : "#d0d0d0",
                          textDecorationThickness: "2px",
                          textUnderlineOffset: "4px",
                          cursor: isTabAccessible("personal")
                            ? "pointer"
                            : "not-allowed",
                          transition: "all 0.3s ease",
                          position: "relative",
                          padding: "8px 15px",
                          display: "inline-block",
                          pointerEvents: isTabAccessible("personal")
                            ? "auto"
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (isTabAccessible("personal")) {
                            e.target.style.color =
                              selectedPersonalSection === section.key
                                ? "#1f4da0"
                                : "#053880";
                            e.target.style.textDecorationColor =
                              selectedPersonalSection === section.key
                                ? "#1f4da0"
                                : "#053880";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isTabAccessible("personal")) {
                            e.target.style.color =
                              selectedPersonalSection === section.key
                                ? "#053880"
                                : "#000000";
                            e.target.style.textDecorationColor =
                              selectedPersonalSection === section.key
                                ? "#053880"
                                : "#d0d0d0";
                          }
                        }}
                      >
                        {section.label}
                        {/* {selectedPersonalSection === section.key && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "6px",
                            height: "6px",
                            backgroundColor: "#053880",
                            borderRadius: "50%",
                          }}
                        />
                      )} */}
                      </span>
                    ))}

                  {activeTab === "document" &&
                    documentTypeOptions
                      ?.find((category) => category.key === selectedDocCategory)
                      .subOptions?.map((docType) => {
                        const count =
                          pendingDocCount?.typeWiseCounts?.[docType.label] || 0;
                        return (
                          <div
                            key={docType.key}
                            style={{
                              position: "relative",
                              display: "inline-block",
                              margin: "0 10px",
                            }}
                          >
                            {count > 0 && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: "2px",
                                  right: "-1px",
                                  backgroundColor: "#FF4D4F",
                                  color: "#FFFFFF",
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  zIndex: 1,
                                }}
                              >
                                {count}
                              </span>
                            )}
                            <span
                              onClick={() =>
                                handleSubTabClick(
                                  "document",
                                  docType.key,
                                  onDocumentTypeSelect,
                                )
                              }
                              style={{
                                fontSize: "16px",
                                fontWeight:
                                  selectedDocType === docType.key
                                    ? "600"
                                    : "400",
                                color:
                                  selectedDocType === docType.key
                                    ? "#053880"
                                    : "#000000",
                                textDecoration: "underline",
                                textDecorationColor:
                                  selectedDocType === docType.key
                                    ? "#053880"
                                    : "#d0d0d0",
                                textDecorationThickness: "2px",
                                textUnderlineOffset: "4px",
                                cursor: isTabAccessible("document")
                                  ? "pointer"
                                  : "not-allowed",
                                transition: "all 0.3s ease",
                                padding: "8px 15px",
                                display: "inline-block",
                                pointerEvents: isTabAccessible("document")
                                  ? "auto"
                                  : "none",
                              }}
                              onMouseEnter={(e) => {
                                if (isTabAccessible("document")) {
                                  e.target.style.color =
                                    selectedDocType === docType.key
                                      ? "#1f4da0"
                                      : "#053880";
                                  e.target.style.textDecorationColor =
                                    selectedDocType === docType.key
                                      ? "#1f4da0"
                                      : "#053880";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (isTabAccessible("document")) {
                                  e.target.style.color =
                                    selectedDocType === docType.key
                                      ? "#053880"
                                      : "#000000";
                                  e.target.style.textDecorationColor =
                                    selectedDocType === docType.key
                                      ? "#053880"
                                      : "#d0d0d0";
                                }
                              }}
                            >
                              {docType.label}
                            </span>
                          </div>
                        );
                      })}

                  {activeTab === "courseSelection" &&
                    counsellingSections.map((section) => (
                      <span
                        key={section.key}
                        onClick={() =>
                          handleSubTabClick(
                            "courseSelection",
                            section.key,
                            onCounsellingSectionSelect,
                          )
                        }
                        style={{
                          fontSize: "16px",
                          fontWeight:
                            selectedCounsellingSection === section.key
                              ? "600"
                              : "400",
                          color:
                            selectedCounsellingSection === section.key
                              ? "#053880"
                              : "#000000",
                          textDecoration: "underline",
                          textDecorationColor:
                            selectedCounsellingSection === section.key
                              ? "#053880"
                              : "#d0d0d0",
                          textDecorationThickness: "2px",
                          textUnderlineOffset: "4px",
                          cursor: isTabAccessible("courseSelection")
                            ? "pointer"
                            : "not-allowed",
                          transition: "all 0.3s ease",
                          position: "relative",
                          padding: "8px 15px",
                          display: "inline-block",
                          pointerEvents: isTabAccessible("courseSelection")
                            ? "auto"
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (isTabAccessible("courseSelection")) {
                            e.target.style.color =
                              selectedCounsellingSection === section.key
                                ? "#1f4da0"
                                : "#053880";
                            e.target.style.textDecorationColor =
                              selectedCounsellingSection === section.key
                                ? "#1f4da0"
                                : "#053880";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isTabAccessible("courseSelection")) {
                            e.target.style.color =
                              selectedCounsellingSection === section.key
                                ? "#053880"
                                : "#000000";
                            e.target.style.textDecorationColor =
                              selectedCounsellingSection === section.key
                                ? "#053880"
                                : "#d0d0d0";
                          }
                        }}
                      >
                        {section.label}
                        {/* {selectedCounsellingSection === section.key && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "6px",
                            height: "6px",
                            backgroundColor: "#053880",
                            borderRadius: "50%",
                          }}
                        />
                      )} */}
                      </span>
                    ))}

                  {activeTab === "visaApplication" &&
                    filteredVisaApplicationSections.map((section) => (
                      <span
                        key={section.key}
                        onClick={() =>
                          handleSubTabClick(
                            "visaApplication",
                            section.key,
                            onVisaSectionSelect,
                          )
                        }
                        style={{
                          fontSize: "16px",
                          fontWeight:
                            selectedVisaSection === section.key ? "600" : "400",
                          color:
                            selectedVisaSection === section.key
                              ? "#053880"
                              : "#000000",
                          textDecoration: "underline",
                          textDecorationColor:
                            selectedVisaSection === section.key
                              ? "#053880"
                              : "#d0d0d0",
                          textDecorationThickness: "2px",
                          textUnderlineOffset: "4px",
                          cursor: isTabAccessible("visaApplication")
                            ? "pointer"
                            : "not-allowed",
                          transition: "all 0.3s ease",
                          position: "relative",
                          padding: "8px 15px",
                          display: "inline-block",
                          pointerEvents: isTabAccessible("visaApplication")
                            ? "auto"
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (isTabAccessible("visaApplication")) {
                            e.target.style.color =
                              selectedVisaSection === section.key
                                ? "#1f4da0"
                                : "#053880";
                            e.target.style.textDecorationColor =
                              selectedVisaSection === section.key
                                ? "#1f4da0"
                                : "#053880";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isTabAccessible("visaApplication")) {
                            e.target.style.color =
                              selectedVisaSection === section.key
                                ? "#053880"
                                : "#000000";
                            e.target.style.textDecorationColor =
                              selectedVisaSection === section.key
                                ? "#053880"
                                : "#d0d0d0";
                          }
                        }}
                      >
                        {section.label}
                        {/* {selectedVisaSection === section.key && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "6px",
                            height: "6px",
                            backgroundColor: "#053880",
                            borderRadius: "50%",
                          }}
                        />
                      )} */}
                      </span>
                    ))}
                </div>

                {showRightArrow && (
                  <div
                    onClick={scrollRight}
                    style={{
                      cursor: "pointer",
                      padding: "0 10px",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.3s ease",
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.querySelector("svg").style.color =
                        "#1f4da0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.querySelector("svg").style.color =
                        "#053880";
                    }}
                  >
                    <ArrowForwardIosIcon
                      style={{
                        fontSize: "20px",
                        color: "#053880",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              {userRole !== "B2B Admin" &&
                userRole !== "B2B Member" &&
                userRole !== "Branch" &&
                userType !== "Branch User" &&
                userRole !== "Student" &&
                userRole !== "LeadStudent" && (
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={() => handleFollowUpToggle(activeTab)}
                    >
                      Follow-up
                    </Button>
                    <Select
                      options={applicationstatusoptions}
                      value={selectedApplicationStatus}
                      onChange={handleMainTabStatusChange}
                      placeholder="Select Status"
                      classNamePrefix="custom-select"
                      styles={customStyles}
                      // styles={{
                      //   control: (base) => ({
                      //     ...base,
                      //     borderRadius: "30px",
                      //     color: "black",
                      //   }),
                      //   placeholder: (base) => ({
                      //     ...base,
                      //     color: "black",
                      //     fontSize: "13px",
                      //   }),
                      // }}
                    />
                    {activeTab === "document" && (
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
                  </div>
                )}
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Tabs;
