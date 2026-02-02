import { Row, Col, Button } from "react-bootstrap";
import { useRef, useState, useLayoutEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Select from "react-select";
import { useParams } from "react-router-dom";
import usePermissions from "../../commonComponents/usePermissions";

const DashboardTabs = ({
  activeTab,
  setActiveTab,
  submittedTabs = [],
  userRole = "",
  userType = "",
  applicationstatusoptions,
  selectedApplicationStatus,
  handleMainTabStatusChange,
  customStyles,
  sendPendingDocumentMain,
  selectedDocumentNames,
  formData,
}) => {
  const { id } = useParams();
  const personalPermissions = usePermissions(
    "Student Applications",
    "Personal Details"
  );
  const documentPermissions = usePermissions(
    "Student Applications",
    "Document"
  );
  const courseSelectionPermissions = usePermissions(
    "Student Applications",
    "Course Selection"
  );
  const visaApplicationPermissions = usePermissions(
    "Student Applications",
    "Visa Application"
  );

  const mainTabs = [
    {
      key: "applicationPipeline",
      label: "Application Pipeline",
      canShow: userRole === "Super Admin" ? true : personalPermissions.canShow,
    },
    // {
    //   key: "counselorPerformance",
    //   label: "Counselor Performance",
    //   canShow: userRole === "Super Admin" ? true : documentPermissions.canShow,
    // },
    // {
    //   key: "financialOverview",
    //   label: "Financial Overview",
    //   canShow:
    //     userRole === "Super Admin" ? true : courseSelectionPermissions.canShow,
    // },
    // {
    //   key: "studentFunnel",
    //   label: "Student Funnel",
    //   canShow:
    //     userRole === "Super Admin" ? true : courseSelectionPermissions.canShow,
    // },
    // {
    //   key: "ieltsSummary",
    //   label: "IELTS Summary",
    //   canShow:
    //     userRole === "Super Admin" ? true : courseSelectionPermissions.canShow,
    // },
  ].filter((tab) => tab.canShow);

  const isTabAccessible = (tabKey) => {
    if (userRole === "Super Admin") {
      return true;
    }
    if (submittedTabs.length === 0) {
      return tabKey === mainTabs[0]?.key;
    }
    const lastSubmittedIndex = Math.max(
      ...submittedTabs.map((tab) => mainTabs.findIndex((t) => t.key === tab))
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
  }, [activeTab]);

  return (
    <div className="mt-4 mb-3">
      <Row>
        <Col className="d-flex justify-content-between align-items-center">
          <div
            className="w-100 d-flex flex-column position-relative"
            // style={{
            //   padding: "15px 20px",
            //   backgroundColor: "#fff",
            //   borderRadius: "10px",
            //   boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
            // }}
          >
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
                    style={{ fontSize: "20px", color: "#053880" }}
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
                {mainTabs.map((tab) => (
                  <span
                    key={tab.key}
                    onClick={() =>
                      isTabAccessible(tab.key) && handleTabClick(tab.key)
                    }
                    style={{
                      fontSize: "16px",
                      fontWeight: activeTab === tab.key ? "600" : "400",
                      color: activeTab === tab.key ? "#053880" : "#000000",
                      textDecoration: "underline",
                      textDecorationColor:
                        activeTab === tab.key ? "#053880" : "#d0d0d0",
                      textDecorationThickness: "2px",
                      textUnderlineOffset: "4px",
                      cursor: isTabAccessible(tab.key)
                        ? "pointer"
                        : "not-allowed",
                      transition: "all 0.3s ease",
                      padding: "8px 15px",
                      display: "inline-block",
                      pointerEvents: isTabAccessible(tab.key) ? "auto" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (isTabAccessible(tab.key)) {
                        e.target.style.color =
                          activeTab === tab.key ? "#1f4da0" : "#053880";
                        e.target.style.textDecorationColor =
                          activeTab === tab.key ? "#1f4da0" : "#053880";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isTabAccessible(tab.key)) {
                        e.target.style.color =
                          activeTab === tab.key ? "#053880" : "#000000";
                        e.target.style.textDecorationColor =
                          activeTab === tab.key ? "#053880" : "#d0d0d0";
                      }
                    }}
                  >
                    {tab.label}
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
                    style={{ fontSize: "20px", color: "#053880" }}
                  />
                </div>
              )}
            </div>
          </div>
          {/* <div>
            {userRole !== "B2B Admin" && userRole !== "B2B Member" && userRole !== "Branch" && userType !== "Branch User" && (
              <div className="d-flex justify-content-end gap-2">
                <Select
                  options={applicationstatusoptions}
                  value={selectedApplicationStatus}
                  onChange={handleMainTabStatusChange}
                  placeholder="Select Status"
                  classNamePrefix="custom-select"
                  styles={customStyles}
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
          </div> */}
        </Col>
      </Row>
    </div>
  );
};

export default DashboardTabs;
