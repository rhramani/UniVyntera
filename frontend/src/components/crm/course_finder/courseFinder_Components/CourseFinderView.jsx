import {
  Card,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineArrowLeft } from "react-icons/ai";
// import { useEffect, useState } from "react";
import getSymbolFromCurrency from "currency-symbol-map";
import { REACT_APP_API_URL } from "../../../../baseUrl";
// import ALLImages from "../../../../common/Imagedata";
// import { getAllCurrencyRate } from "../../../../redux/actions/Master/CurrencyRate.action";
// import { useDispatch } from "react-redux";

const CourseFinderView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedItem = state?.data;
  // const dispatch = useDispatch();
  // const [currencyRate, setCurrencyRate] = useState([]);
  if (!selectedItem) {
    return (
      <div className="text-center mt-4">
        <h4>No Course Data Available</h4>
        <p>Please select a course to view its details.</p>
      </div>
    );
  }

  const profilePath = selectedItem?.university?.profile
    ? selectedItem.university.profile.replace(/\\/g, "/")
    : null;
  const imageUrl = profilePath
    ? `${REACT_APP_API_URL}/${profilePath}`
    : "https://via.placeholder.com/200x100?text=University+Logo";

  // const fetchCurrencyRate = async () => {
  //   try {
  //     const res = await dispatch(getAllCurrencyRate());
  //     if (res?.status === 200) {
  //       setCurrencyRate(res?.data?.message || []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching student statuses:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCurrencyRate();
  // }, []);

  // const getINRValue = (amount, currencyCode) => {
  //   if (!currencyRate || !currencyRate.length) return null;
  //   const rateObj = currencyRate.find(
  //     (rate) => rate.currencyCode === currencyCode
  //   );
  //   if (rateObj && rateObj.INRvalue) {
  //     const inrValue =
  //       parseFloat(amount.replace(/,/g, "")) * parseFloat(rateObj.INRvalue);
  //     return `INR Value: ₹${inrValue.toLocaleString("en-IN")}`;
  //   }
  //   return "Conversion rate not found!";
  // };

  return (
    <>
      <div
        className="form-main-heading w-100 p-3 position-sticky top-0 z-3"
        style={{
          background: "linear-gradient(90deg, #6B5CE7 0%, #7B68EE 100%)",
          color: "white",
          borderRadius: "0 0 16px 16px",
          boxShadow: "0 4px 12px rgba(107, 92, 231, 0.3)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="link"
              onClick={() =>
                navigate("/coursefinder", { state: { filters: state?.filters } })
              }
              className="text-light p-0"
              style={{
                fontSize: "24px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AiOutlineArrowLeft size={24} />
            </Button>
            <h3 className="mb-0">Course Details</h3>
          </div>
          <Button
            variant="link"
            onClick={() =>
              navigate("/coursefinder", { state: { filters: state?.filters } })
            }
            className="text-light p-0"
            style={{
              fontSize: "24px",
            }}
          >
            <AiOutlineClose size={24} />
          </Button>
        </div>
      </div>
      <Row className="mt-4 courseFinder-row px-3">
        <Col lg={4} md={12} className="mb-4">
          <Card
            className="custom-card h-100"
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              borderRadius: "16px",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
            }}
          >
            <Card.Body className="p-4">
              <div className="text-center">
                <div className="d-flex justify-content-center mb-4">
                  <div
                    className="university-logo-container"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "4px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f8fafc",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="University Logo"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
                <h4
                  className="fw-bold mb-4"
                  style={{
                    color: "#1e293b",
                    fontSize: "22px",
                    lineHeight: 1.3,
                  }}
                >
                  {selectedItem?.university?.instituteName || "NA"}
                </h4>
                
                <div className="d-flex flex-column gap-3 mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <p className="mb-1 text-muted small">State</p>
                    <p className="mb-0 fw-semibold">
                      {selectedItem?.university?.state || "NA"}
                    </p>
                  </div>
                  
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <p className="mb-1 text-muted small">Country</p>
                    <p className="mb-0 fw-semibold">
                      {selectedItem?.university?.country || "NA"}
                    </p>
                  </div>
                </div>
                
                <div
                  className="p-3 mb-4 text-light rounded d-flex align-items-center justify-content-between"
                  style={{
                    background: "linear-gradient(135deg, #6B5CE7 0%, #7B68EE 100%)",
                    minHeight: "60px",
                  }}
                >
                  <p className="mb-0 fw-semibold">Study Level:</p>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip>
                        {selectedItem?.studyLevel
                          ?.map((lvl) => lvl.name)
                          .join(", ") || "NA"}
                      </Tooltip>
                    }
                  >
                    <div
                      className="mb-0 text-center"
                      style={{
                        maxWidth: "60%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                      }}
                    >
                      {selectedItem?.studyLevel?.length > 2
                        ? `${selectedItem.studyLevel
                            .slice(0, 2)
                            .map((lvl) => lvl.name)
                            .join(", ")} +${selectedItem.studyLevel.length - 2
                          } more`
                        : selectedItem?.studyLevel
                            ?.map((lvl) => lvl.name)
                            .join(", ") || "NA"}
                    </div>
                  </OverlayTrigger>
                </div>
                
                {selectedItem?.websiteUrl && (
                  <div className="mt-3">
                    <a
                      href={selectedItem?.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-100"
                      style={{
                        background: "linear-gradient(135deg, #6B5CE7 0%, #7B68EE 100%)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 20px",
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.02)";
                        e.target.style.boxShadow = "0 4px 12px rgba(107, 92, 231, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      Visit University Website
                    </a>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8} md={12}>
          <div className="bg-white p-4 rounded-lg" style={{
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
          }}>
            <h4 
              className="mb-4 pb-3 border-bottom" 
              style={{
                color: "#1e293b",
                fontSize: "24px",
                fontWeight: "600",
              }}
            >
              {selectedItem?.programName || "NA"}
            </h4>

            <Card 
              className="mb-4"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div 
                className="p-3"
                style={{
                  background: "linear-gradient(135deg, #6B5CE7 0%, #7B68EE 100%)",
                  color: "white",
                }}
              >
                <strong style={{fontSize: "18px"}}>Program Details</strong>
              </div>
              <Card.Body className="p-4">
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Campus</Col>
                  <Col md={8}>{selectedItem?.university?.campus?.campus || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Concentration</Col>
                  <Col md={8}>{selectedItem?.concentration || "NA"}</Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Intakes</Col>
                  <Col md={8}>
                    <div className="d-flex flex-column gap-2">
                      <div
                        style={{
                          backgroundColor: "#D1FAE5",
                          padding: "12px",
                          borderRadius: "8px",
                          color: "#047857",
                          border: "1px solid #A7F3D0",
                        }}
                      >
                        <strong>Active: </strong>
                        {selectedItem?.intakes && selectedItem.intakes.length > 0
                          ? selectedItem.intakes
                              .filter((intake) => intake.status === "Active")
                              .map((intake) => intake.month)
                              .join(", ")
                          : "None"}
                      </div>
                      <div
                        style={{
                          backgroundColor: "#FECACA",
                          padding: "12px",
                          borderRadius: "8px",
                          color: "#B91C1C",
                          border: "1px solid #FCA5A5",
                        }}
                      >
                        <strong>Inactive: </strong>
                        {selectedItem?.intakes && selectedItem.intakes.length > 0
                          ? selectedItem.intakes
                              .filter((intake) => intake.status === "Inactive")
                              .map((intake) => intake.month)
                              .join(", ")
                          : "None"}
                      </div>
                    </div>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Intake Years</Col>
                  <Col md={8}>{selectedItem?.intakeYear?.join(", ") || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Duration</Col>
                  <Col md={8}>{selectedItem?.duration || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Entry Requirements</Col>
                  <Col md={8}>{selectedItem?.entryRequirements || "NA"}</Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Application Start Dates</Col>
                  <Col md={8}>
                    {Array.isArray(selectedItem?.applicationStartDate) &&
                      selectedItem.applicationStartDate.length > 0
                      ? selectedItem.applicationStartDate.join(", ")
                      : "NA"}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Application End Dates</Col>
                  <Col md={8}>
                    {Array.isArray(selectedItem?.applicationEndDate) &&
                      selectedItem.applicationEndDate.length > 0
                      ? selectedItem.applicationEndDate.join(", ")
                      : "NA"}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Application Fee</Col>
                  <Col md={8}>
                    <div className="p-2 rounded" style={{background: "#f1f5f9"}}>
                      {selectedItem.applicationFee &&
                        selectedItem.currencyCode ? (
                        <>
                          {getSymbolFromCurrency(selectedItem.currencyCode) ||
                            selectedItem.currencyCode}
                          &nbsp;
                          {new Intl.NumberFormat().format(
                            Number(
                              String(selectedItem.applicationFee).replace(
                                /,/g,
                                ""
                              )
                            )
                          )}
                        </>
                      ) : selectedItem.applicationFee ? (
                        new Intl.NumberFormat().format(
                          Number(
                            String(selectedItem.applicationFee).replace(/,/g, "")
                          )
                        )
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Yearly Tuition Fee</Col>
                  <Col md={8}>
                    <div className="p-2 rounded" style={{background: "#f1f5f9"}}>
                      {selectedItem.yearlyTuitionFee &&
                        selectedItem.currencyCode ? (
                        <>
                          {getSymbolFromCurrency(selectedItem.currencyCode) ||
                            selectedItem.currencyCode}
                          &nbsp;
                          {new Intl.NumberFormat().format(
                            Number(
                              String(selectedItem.yearlyTuitionFee)?.replace(
                                /,/g,
                                ""
                              )
                            )
                          )}
                        </>
                      ) : selectedItem.yearlyTuitionFee ? (
                        new Intl.NumberFormat().format(
                          Number(
                            String(selectedItem.yearlyTuitionFee)?.replace(
                              /,/g,
                              ""
                            )
                          )
                        )
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Website URL</Col>
                  <Col md={8}>
                    {selectedItem?.websiteUrl ? (
                      <a
                        href={selectedItem.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary fw-semibold"
                        style={{textDecoration: "underline"}}
                      >
                        {selectedItem.websiteUrl}
                      </a>
                    ) : (
                      <span>NA</span>
                    )}
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Study Area</Col>
                  <Col md={8}>{selectedItem?.studyArea || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Discipline Area</Col>
                  <Col md={8}>
                    {selectedItem?.disciplineArea?.length > 0
                      ? Array.isArray(selectedItem.disciplineArea)
                        ? selectedItem.disciplineArea.join(", ")
                        : selectedItem.disciplineArea
                      : "N/A"}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Career Details</Col>
                  <Col md={8}>
                    {selectedItem?.career && selectedItem.career.length > 0
                      ? Array.isArray(selectedItem.career)
                        ? selectedItem.career.join(", ")
                        : selectedItem.career
                      : "N/A"}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card 
              className="mb-4"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div 
                className="p-3"
                style={{
                  background: "linear-gradient(135deg, #6B5CE7 0%, #7B68EE 100%)",
                  color: "white",
                }}
              >
                <strong style={{fontSize: "18px"}}>Requirements</strong>
              </div>
              <Card.Body className="p-4">
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Exam</Col>
                  <Col md={8}>
                    {selectedItem?.requirements
                      .map((req) => req.name)
                      .join(", ") || "NA"}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Criteria</Col>
                  <Col md={8}>{selectedItem?.criteria || "NA"}</Col>
                </Row>
              </Card.Body>
            </Card>

            <Card 
              className="mb-4"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div 
                className="p-3"
                style={{
                  background: "linear-gradient(135deg, #6B5CE7 0%, #7B68EE 100%)",
                  color: "white",
                }}
              >
                <strong style={{fontSize: "18px"}}>Additional Info</strong>
              </div>
              <Card.Body className="p-4">
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Scholarship Available</Col>
                  <Col md={8}>{selectedItem?.scholarshipAvailable || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Scholarship Details</Col>
                  <Col md={8}>{selectedItem?.scholarshipDetails || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">ESL/ELP Available</Col>
                  <Col md={8}>{selectedItem?.eslElpAvailable || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">ESL/ELP Details</Col>
                  <Col md={8}>{selectedItem?.eslElpDetails || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Application Mode</Col>
                  <Col md={8}>{selectedItem?.applicationMode || "NA"}</Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">English Exam Waiver</Col>
                  <Col md={8}>
                    {selectedItem?.englishProficiencyExamWaiver || "NA"}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card 
              className="mb-4"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div 
                className="p-3"
                style={{
                  background: "linear-gradient(135deg, #6B5CE7 0%, #7B68EE 100%)",
                  color: "white",
                }}
              >
                <strong style={{fontSize: "18px"}}>Remarks & Admin</strong>
              </div>
              <Card.Body className="p-4">
                <Row className="mb-3">
                  <Col md={4} className="fw-semibold text-muted">Remarks</Col>
                  <Col md={8}>{selectedItem?.remarks || "NA"}</Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Col>

        {/* <Col lg={8} md={12}>
          <Card className="custom-card">
            <Card.Body>
              <h4 className="mb-3">{selectedItem?.programName || "NA"}</h4>

              <div className="details-section mb-4">
                <h6 className="section-title bg-light p-2 rounded">
                  Program Details
                </h6>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Concentration</span>
                      <span className="detail-value">
                        {selectedItem?.concentration || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Intakes</span>
                      <span className="detail-value">
                        {selectedItem?.intakes?.join(", ") || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Intake Years</span>
                      <span className="detail-value">
                        {selectedItem?.intakeYear?.join(", ") || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Duration</span>
                      <span className="detail-value">
                        {selectedItem?.duration || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Study Level</span>
                      <span className="detail-value">
                        {selectedItem?.studyLevel
                          ?.map((lvl) => lvl.name)
                          .join(", ") || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">
                        Application Start Dates
                      </span>
                      <span className="detail-value">
                        {selectedItem?.applicationStartDate?.join(", ") || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">
                        Application End Dates
                      </span>
                      <span className="detail-value">
                        {selectedItem?.applicationEndDate?.join(", ") || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Application Fee</span>
                      <span className="detail-value">
                        {selectedItem?.applicationFee || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Yearly Tuition Fee</span>
                      <span className="detail-value">
                        {selectedItem?.yearlyTuitionFee || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Program URL</span>
                      <a
                        href={selectedItem?.websiteUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-value text-primary"
                      >
                        {selectedItem?.websiteUrl || "NA"}
                      </a>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="details-section mb-4">
                <h6 className="section-title bg-light p-2 rounded">
                  Requirements
                </h6>
                <Row className="g-3">
                  {selectedItem?.requirements?.length > 0 ? (
                    selectedItem.requirements.map((req, index) => (
                      <Col md={6} key={index}>
                        <div className="detail-item">
                          <span className="detail-label">{req.name}</span>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <Col md={12}>
                      <span className="detail-value">NA</span>
                    </Col>
                  )}
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Criteria</span>
                      <span className="detail-value">
                        {selectedItem?.criteria || "NA"}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="details-section mb-4">
                <h6 className="section-title bg-light p-2 rounded">
                  Additional Info
                </h6>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">
                        Scholarship Available
                      </span>
                      <span className="detail-value">
                        {selectedItem?.scholarshipAvailable || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Scholarship Details</span>
                      <span className="detail-value">
                        {selectedItem?.scholarshipDetails || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">ESL/ELP Available</span>
                      <span className="detail-value">
                        {selectedItem?.eslElpAvailable || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">ESL/ELP Details</span>
                      <span className="detail-value">
                        {selectedItem?.eslElpDetails || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">Application Mode</span>
                      <span className="detail-value">
                        {selectedItem?.applicationMode || "NA"}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-label">English Exam Waiver</span>
                      <span className="detail-value">
                        {selectedItem?.englishProficiencyExamWaiver || "NA"}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="details-section mb-4">
                <h6 className="section-title bg-light p-2 rounded">
                  Remarks & Admin
                </h6>
                <Row className="g-3">
                  <Col md={12}>
                    <div className="detail-item">
                      <span className="detail-label">Remarks</span>
                      <span className="detail-value">
                        {selectedItem?.remarks || "NA"}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
    </>
  );
};

export default CourseFinderView;
