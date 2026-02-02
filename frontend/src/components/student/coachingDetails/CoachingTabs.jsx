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
    "Personal Details"
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
    <Row>
      <Col className="d-flex justify-content-between align-items-center">
        <div
          className="w-100 d-flex flex-column position-relative"
          style={{
            padding: "15px 20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="d-flex align-items-center position-relative gap-2">
            {showLeftArrow && (
              <div
                onClick={scrollLeft}
                style={{ cursor: "pointer", padding: "0 10px" }}
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
                scrollbarWidth: "none",
              }}
            >
              <style>
                {`
                    .scroll-container::-webkit-scrollbar {
                      display: none;
                    }
                  `}
              </style>
              {personalSections.map((section) => (
                <span
                  key={section.key}
                  onClick={() => onPersonalSectionSelect(section.key)}
                  style={{
                    fontSize: "16px",
                    fontWeight:
                      selectedPersonalSection === section.key ? "600" : "400",
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
                    cursor: "pointer",
                    padding: "8px 15px",
                    display: "inline-block",
                  }}
                >
                  {section.label}
                </span>
              ))}
            </div>

            {showRightArrow && (
              <div
                onClick={scrollRight}
                style={{ cursor: "pointer", padding: "0 10px" }}
              >
                <ArrowForwardIosIcon
                  style={{ fontSize: "20px", color: "#053880" }}
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
