import { Nav, Row, Col, Button } from "react-bootstrap";
import { useRef, useState, useLayoutEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Select from "react-select";
import { useParams } from "react-router-dom";
import usePermissions from "../../commonComponents/usePermissions";

const VisitorTabs = ({
  activeTab,
  setActiveTab,
  documentTypes = [],
  onDocumentTypeSelect,
  onPersonalSectionSelect,
  onVisaSectionSelect,
  onAccountantSelect,
  selectedPersonalSection,
  selectedDocType,
  selectedAccountantSection,
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
}) => {
  const { id } = useParams();
  const personalPermissions = usePermissions(
    "Visitor Applications",
    "Personal Details",
  );
  const documentPermissions = usePermissions(
    "Visitor Applications",
    "Document",
  );
  const visaApplicationPermissions = usePermissions(
    "Visitor Applications",
    "Visa Application",
  );
  const accountantPermissions = usePermissions(
    "Visitor Applications",
    "Accountant",
  );

  const personalSections = [
    { key: "all", label: "All" },
    { key: "education", label: "Education" },
    { key: "languageExam", label: "Language Entrance Exam" },
    { key: "aptitudeExam", label: "Aptitude Exam" },
    { key: "workExperience", label: "Work Experience" },
    { key: "categoryDetails", label: "Category" },
  ];

  const [selectedDocCategory, setSelectedDocCategory] = useState("visitor");
  const getDefaultSubOption = (categoryKey) => {
    return categoryKey === "rgdocument" ? "allrg" : "all";
  };

  const documentTypeOptions = [
    {
      key: "visitor",
      label: "visitor",
      canShow: userRole === "Super Admin" ? true : documentPermissions.canShow,
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
              "Visitor Applications",
              "Document",
              docTypeName,
            );
            return {
              key: docTypeName,
              label: docType?.type?.name || "Unnamed Document Type",
              canShow:
                userRole === "Super Admin" ? true : docPermissions.canShow,
            };
          })
          .filter((docType) => docType.canShow),
        {
          key: "other",
          label: "Other Documents",
          canShow:
            userRole === "Super Admin"
              ? true
              : usePermissions(
                  "Visitor Applications",
                  "Document",
                  "Other Documents",
                ).canShow,
        },
      ].filter((docType) => docType.canShow),
    },
    {
      key: "rgdocument",
      label: "External Document",
      canShow: userRole === "Super Admin" ? true : documentPermissions.canShow,
      subOptions: [
        { key: "allrg", label: "All", canShow: true },
        {
          key: "rgdocument",
          label: "US Documents",
          canShow:
            userRole === "Super Admin"
              ? true
              : usePermissions(
                  "Visitor Applications",
                  "Document",
                  "RG Documents",
                ).canShow,
        },
        {
          key: "visadocuments",
          label: "Visa Documents",
          canShow:
            userRole === "Super Admin"
              ? true
              : usePermissions(
                  "Visitor Applications",
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
  ];

  const accountantSections = [
    { key: "all", label: "All" },
    { key: "accountant", label: "Accountant" },
  ];

  const mainTabs = [
    {
      key: "personal",
      label: "Personal Details",
      canShow: userRole === "Super Admin" ? true : personalPermissions.canShow,
    },
    {
      key: "document",
      label: "Document",
      canShow: userRole === "Super Admin" ? true : documentPermissions.canShow,
    },
    ...(formData?.visaByRG
      ? [
          {
            key: "visaApplication",
            label: "Visa Application",
            canShow:
              userRole === "Super Admin"
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
        userRole === "Super Admin" ? true : accountantPermissions.canShow,
    },
  ].filter((tab) => tab.canShow);

  const isTabAccessible = (tabKey) => {
    if (userRole === "Super Admin") {
      return true;
    }

    if (submittedTabs.length === 0) {
      return tabKey === mainTabs[0]?.key;
    }

    const lastSubmittedIndex = Math.max(
      ...submittedTabs.map((tab) => mainTabs.findIndex((t) => t.key === tab)),
    );

    const currentTabIndex = mainTabs.findIndex((tab) => tab.key === tabKey);
    return (
      submittedTabs.includes(tabKey) ||
      currentTabIndex === lastSubmittedIndex + 1
    );
  };

  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === "personal") onPersonalSectionSelect("all");
    if (tabKey === "document") {
      setSelectedDocCategory("visitor");
      onDocumentTypeSelect(getDefaultSubOption("visitor"));
    }
    if (tabKey === "visaApplication") onVisaSectionSelect("all");
    if (tabKey === "accountant") onAccountantSelect("all");
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
              borderBottom: "4px solid #5D54BE",
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
                      borderRadius: "12px",
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
                          ? "#5D54BE"
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
                          activeTab === tab.key ? "#5D54BE" : "#fff";
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
                          borderTop: "8px solid #5D54BE",
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
        activeTab === "visaApplication" ||
        activeTab === "accountant") && (
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
                            ? "#5D54BE"
                            : "#000000",
                        textDecoration: "underline",
                        textDecorationColor:
                          selectedDocCategory === category.key
                            ? "#5D54BE"
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
                              : "#5D54BE";
                          e.target.style.textDecorationColor =
                            selectedDocCategory === category.key
                              ? "#1f4da0"
                              : "#5D54BE";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isTabAccessible("document")) {
                          e.target.style.color =
                            selectedDocCategory === category.key
                              ? "#5D54BE"
                              : "#000000";
                          e.target.style.textDecorationColor =
                            selectedDocCategory === category.key
                              ? "#5D54BE"
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
                        "#5D54BE";
                    }}
                  >
                    <ArrowBackIosNewIcon
                      style={{
                        fontSize: "20px",
                        color: "#5D54BE",
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
                              ? "#5D54BE"
                              : "#000000",
                          textDecoration: "underline",
                          textDecorationColor:
                            selectedPersonalSection === section.key
                              ? "#5D54BE"
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
                                : "#5D54BE";
                            e.target.style.textDecorationColor =
                              selectedPersonalSection === section.key
                                ? "#1f4da0"
                                : "#5D54BE";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isTabAccessible("personal")) {
                            e.target.style.color =
                              selectedPersonalSection === section.key
                                ? "#5D54BE"
                                : "#000000";
                            e.target.style.textDecorationColor =
                              selectedPersonalSection === section.key
                                ? "#5D54BE"
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
                            backgroundColor: "#5D54BE",
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
                                    ? "#5D54BE"
                                    : "#000000",
                                textDecoration: "underline",
                                textDecorationColor:
                                  selectedDocType === docType.key
                                    ? "#5D54BE"
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
                                      : "#5D54BE";
                                  e.target.style.textDecorationColor =
                                    selectedDocType === docType.key
                                      ? "#1f4da0"
                                      : "#5D54BE";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (isTabAccessible("document")) {
                                  e.target.style.color =
                                    selectedDocType === docType.key
                                      ? "#5D54BE"
                                      : "#000000";
                                  e.target.style.textDecorationColor =
                                    selectedDocType === docType.key
                                      ? "#5D54BE"
                                      : "#d0d0d0";
                                }
                              }}
                            >
                              {docType.label}
                            </span>
                          </div>
                        );
                      })}

                  {activeTab === "visaApplication" &&
                    visaApplicationSections.map((section) => (
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
                              ? "#5D54BE"
                              : "#000000",
                          textDecoration: "underline",
                          textDecorationColor:
                            selectedVisaSection === section.key
                              ? "#5D54BE"
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
                                : "#5D54BE";
                            e.target.style.textDecorationColor =
                              selectedVisaSection === section.key
                                ? "#1f4da0"
                                : "#5D54BE";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isTabAccessible("visaApplication")) {
                            e.target.style.color =
                              selectedVisaSection === section.key
                                ? "#5D54BE"
                                : "#000000";
                            e.target.style.textDecorationColor =
                              selectedVisaSection === section.key
                                ? "#5D54BE"
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
                            backgroundColor: "#5D54BE",
                            borderRadius: "50%",
                          }}
                        />
                      )} */}
                      </span>
                    ))}
                  {activeTab === "accountant" &&
                    accountantSections.map((section) => (
                      <span
                        key={section.key}
                        onClick={() =>
                          handleSubTabClick(
                            "accountant",
                            section.key,
                            onAccountantSelect,
                          )
                        }
                        style={{
                          fontSize: "16px",
                          fontWeight:
                            selectedAccountantSection === section.key
                              ? "600"
                              : "400",
                          color:
                            selectedAccountantSection === section.key
                              ? "#5D54BE"
                              : "#000000",
                          textDecoration: "underline",
                          textDecorationColor:
                            selectedAccountantSection === section.key
                              ? "#5D54BE"
                              : "#d0d0d0",
                          textDecorationThickness: "2px",
                          textUnderlineOffset: "4px",
                          cursor: isTabAccessible("accountant")
                            ? "pointer"
                            : "not-allowed",
                          transition: "all 0.3s ease",
                          position: "relative",
                          padding: "8px 15px",
                          display: "inline-block",
                          pointerEvents: isTabAccessible("accountant")
                            ? "auto"
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (isTabAccessible("accountant")) {
                            e.target.style.color =
                              selectedAccountantSection === section.key
                                ? "#1f4da0"
                                : "#5D54BE";
                            e.target.style.textDecorationColor =
                              selectedAccountantSection === section.key
                                ? "#1f4da0"
                                : "#5D54BE";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (isTabAccessible("accountant")) {
                            e.target.style.color =
                              selectedAccountantSection === section.key
                                ? "#5D54BE"
                                : "#000000";
                            e.target.style.textDecorationColor =
                              selectedAccountantSection === section.key
                                ? "#5D54BE"
                                : "#d0d0d0";
                          }
                        }}
                      >
                        {section.label}
                        {/* {selectedAccountantSection === section.key && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "6px",
                            height: "6px",
                            backgroundColor: "#5D54BE",
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
                        "#5D54BE";
                    }}
                  >
                    <ArrowForwardIosIcon
                      style={{
                        fontSize: "20px",
                        color: "#5D54BE",
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
                userType !== "Branch User" && (
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
                      //     borderRadius: "12px",
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

export default VisitorTabs;
