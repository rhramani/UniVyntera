import { Row, Col } from "react-bootstrap";
import { useRef, useState, useLayoutEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import usePermissions from "../../commonComponents/usePermissions";

const CoachingTabs = ({
  selectedPersonalSection,
  onPersonalSectionSelect,
  userRole = "",
}) => {
  const personalPermissions = usePermissions(
    "Student Applications",
    "Personal Details",
  );

  const personalSections = [
    { key: "all", label: "All" },
    { key: "remark", label: "Remark Details" },
    { key: "mockTest", label: "Mock Test Details" },
    { key: "masterSession", label: "Master Session Details" },
    { key: "targetAchieved", label: "Exam Score Achieved Details" },
    { key: "subjectGrade", label: "Subject Grade Details" },
    { key: "accountant", label: "Accountant Details" },
  ];

  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
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
    const timer = setTimeout(() => checkScroll(), 0);

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
  }, [selectedPersonalSection]);

  return (
    <Row className="mb-4">
      <Col>
        <div
          className="w-100 d-flex flex-column position-relative shadow-sm"
          style={{
            padding: "10px",
            backgroundColor: "#fff",
            borderRadius: "15px",
            border: "1px solid #f0f0f0",
          }}
        >
          <div className="d-flex align-items-center position-relative">
            {showLeftArrow && (
              <div
                onClick={scrollLeft}
                className="d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  position: "absolute",
                  left: "5px",
                  zIndex: 10,
                  border: "1px solid #eee",
                }}
              >
                <ArrowBackIosNewIcon
                  style={{ fontSize: "14px", color: "#053880" }}
                />
              </div>
            )}

            <div
              ref={scrollContainerRef}
              className="d-flex scroll-container py-1 px-2"
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                flex: 1,
                scrollbarWidth: "none",
                gap: "10px",
              }}
            >
              <style>
                {`
                    .scroll-container::-webkit-scrollbar {
                      display: none;
                    }
                    .tab-item {
                      transition: all 0.2s ease;
                      border: 1px solid transparent;
                    }
                    .tab-item:hover:not(.active) {
                      background-color: #f8f9fa !important;
                      color: #053880 !important;
                    }
                  `}
              </style>
              {personalSections.map((section) => (
                <div
                  key={section.key}
                  onClick={() => onPersonalSectionSelect(section.key)}
                  className={`tab-item px-4 py-2 rounded-pill cursor-pointer ${
                    selectedPersonalSection === section.key
                      ? "active shadow-sm"
                      : ""
                  }`}
                  style={{
                    fontSize: "14px",
                    fontWeight:
                      selectedPersonalSection === section.key ? "700" : "500",
                    backgroundColor:
                      selectedPersonalSection === section.key
                        ? "#053880"
                        : "transparent",
                    color:
                      selectedPersonalSection === section.key
                        ? "#ffffff"
                        : "#6c757d",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  {section.label}
                </div>
              ))}
            </div>

            {showRightArrow && (
              <div
                onClick={scrollRight}
                className="d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  position: "absolute",
                  right: "5px",
                  zIndex: 10,
                  border: "1px solid #eee",
                }}
              >
                <ArrowForwardIosIcon
                  style={{ fontSize: "14px", color: "#053880" }}
                />
              </div>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CoachingTabs;
