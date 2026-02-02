import {
  Card,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
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
      <div className="form-main-heading w-100 p-2 position-sticky top-0 z-3">
        <div className="d-flex justify-content-between align-items-center">
          <h3>Course Details</h3>
          <Button
            variant="link"
            onClick={() =>
              navigate("/coursefinder", { state: { filters: state?.filters } })
            }
            className="text-light"
          >
            <AiOutlineClose size={20} />
          </Button>
        </div>
      </div>
      <Row className="mt-3 courseFinder-row">
        <Col lg={4} md={12} className="mb-4">
          <Card className="custom-card">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="d-flex align-items-center mb-5">
                  <img
                    src={imageUrl}
                    alt="University Logo"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
                <h4 className="fw-bold course_institute mb-4 text-gray-6">
                  {selectedItem?.university?.instituteName || "NA"}
                </h4>
                <div className="course_institute text-gray-6">
                  <p>State</p>
                  <p className="mb-1">
                    {selectedItem?.university?.state || "NA"}
                  </p>
                </div>
                <div className="course_institute text-gray-6">
                  <p>Country</p>
                  <p className="mb-1">
                    {selectedItem?.university?.country || "NA"}
                  </p>
                </div>
                <div
                  className="view_course_institute p-2 mx-4 text-light rounded d-flex align-items-center justify-content-between"
                  style={{ backgroundColor: "#053880", minHeight: "60px" }}
                >
                  <p className="mb-0">
                    <strong>Study Level:</strong>
                  </p>
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
                <div className="mt-3">
                  <a
                    href={selectedItem?.websiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-underline"
                  >
                    {selectedItem?.websiteUrl}
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8} md={12} className="text-gray-6">
          <h5 className="mt-1 mb-3">Program Details</h5>
          <div className="bg-white p-4 rounded">
            <h4 className="mb-3">{selectedItem?.programName || "NA"}</h4>

            <Card className="mb-3 text-gray-6">
              <div className="courseFinder_header_bg p-2">
                <strong>Program Details</strong>
              </div>
              <Card.Body>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Campus</strong>
                  </Col>
                  <Col>{selectedItem?.university?.campus?.campus || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Concentration</strong>
                  </Col>
                  <Col>{selectedItem?.concentration || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Intakes</strong>
                  </Col>
                  <Col>
                    <div
                      style={{
                        backgroundColor: "#D1FAE5",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        color: "#047857",
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
                        padding: "10px",
                        borderRadius: "5px",
                        color: "#B91C1C",
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
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Intake Years</strong>
                  </Col>
                  <Col>{selectedItem?.intakeYear?.join(", ") || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Duration</strong>
                  </Col>
                  <Col>{selectedItem?.duration || "NA"}</Col>
                </Row>
                {/* <Row className="mb-2">
                  <Col md={3}>
                    <strong>Study Level</strong>
                  </Col>
                  <Col>
                    {" "}
                    {selectedItem?.studyLevel
                      ?.map((lvl) => lvl.name)
                      .join(", ") || "NA"}
                  </Col>
                </Row> */}
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Entry Requirements</strong>
                  </Col>
                  <Col>{selectedItem?.entryRequirements || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Application Start Dates</strong>
                  </Col>
                  <Col>
                    {Array.isArray(selectedItem?.applicationStartDate) &&
                      selectedItem.applicationStartDate.length > 0
                      ? selectedItem.applicationStartDate.join(", ")
                      : "NA"}
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Application End Dates</strong>
                  </Col>
                  <Col>
                    {Array.isArray(selectedItem?.applicationEndDate) &&
                      selectedItem.applicationEndDate.length > 0
                      ? selectedItem.applicationEndDate.join(", ")
                      : "NA"}
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Application Fee</strong>
                  </Col>
                  <Col>
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
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Yearly Tuition Fee</strong>
                  </Col>
                  <Col>
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
                  </Col>
                </Row>
                {/* <Row className="mb-2">
                  <Col md={3}>
                    <strong>Yearly Tuition Fee</strong>
                  </Col>
                  <Col>
                    <span
                      className="span-2"
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      {selectedItem.yearlyTuitionFee &&
                      selectedItem.currencyCode ? (
                        <>
                          {getSymbolFromCurrency(selectedItem.currencyCode) ||
                            selectedItem.currencyCode}
                          &nbsp;
                          {new Intl.NumberFormat().format(
                            Number(
                              String(selectedItem.yearlyTuitionFee).replace(
                                /,/g,
                                ""
                              )
                            )
                          )}
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                {getINRValue(
                                  selectedItem.yearlyTuitionFee,
                                  selectedItem.currencyCode
                                )}
                              </Tooltip>
                            }
                          >
                            <span
                              style={{
                                position: "absolute",
                                top: "-10px",
                                right: "-5px",
                                cursor: "pointer",
                              }}
                            >
                              <img
                                src={ALLImages("course1")}
                                height="15px"
                                width="15px"
                                style={{ marginBottom: "15px" }}
                                alt=""
                              />
                            </span>
                          </OverlayTrigger>
                        </>
                      ) : selectedItem.yearlyTuitionFee ? (
                        <>
                          {new Intl.NumberFormat().format(
                            Number(
                              String(selectedItem.yearlyTuitionFee).replace(
                                /,/g,
                                ""
                              )
                            )
                          )}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </Col>
                </Row> */}
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Website URL</strong>
                  </Col>
                  <Col>
                    <strong>
                      {selectedItem?.websiteUrl ? (
                        <a
                          href={selectedItem.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          {selectedItem.websiteUrl}
                        </a>
                      ) : (
                        <span>NA</span>
                      )}
                    </strong>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Study Area</strong>
                  </Col>
                  <Col>{selectedItem?.studyArea || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Discipline Area</strong>
                  </Col>
                  <Col>
                    {selectedItem?.disciplineArea?.length > 0
                      ? Array.isArray(selectedItem.disciplineArea)
                        ? selectedItem.disciplineArea.join(", ")
                        : selectedItem.disciplineArea
                      : "N/A"}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Career Details</strong>
                  </Col>
                  <Col>
                    {selectedItem?.career && selectedItem.career.length > 0
                      ? Array.isArray(selectedItem.career)
                        ? selectedItem.career.join(", ")
                        : selectedItem.career
                      : "N/A"}
                  </Col>
                </Row>

              </Card.Body>
            </Card>

            <Card className="mb-3 text-gray-6">
              <div className="courseFinder_header_bg p-2">
                <strong>Requirements</strong>
              </div>
              <Card.Body>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Exam</strong>
                  </Col>
                  <Col>
                    {selectedItem?.requirements
                      .map((req) => req.name)
                      .join(", ") || "NA"}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Criteria</strong>
                  </Col>
                  <Col>{selectedItem?.criteria || "NA"}</Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-3 text-gray-6">
              <div className="courseFinder_header_bg p-2">
                <strong>Additional Info</strong>
              </div>
              <Card.Body>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Scholarship Available</strong>
                  </Col>
                  <Col>{selectedItem?.scholarshipAvailable || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Scholarship Details</strong>
                  </Col>
                  <Col>{selectedItem?.scholarshipDetails || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>SchESL/ELP Available</strong>
                  </Col>
                  <Col>{selectedItem?.eslElpAvailable || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>ESL/ELP Details</strong>
                  </Col>
                  <Col>{selectedItem?.eslElpDetails || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Application Mode</strong>
                  </Col>
                  <Col>{selectedItem?.applicationMode || "NA"}</Col>
                </Row>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>English Exam Waiver</strong>
                  </Col>
                  <Col>
                    {selectedItem?.englishProficiencyExamWaiver || "NA"}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="mb-3 text-gray-6">
              <div className="courseFinder_header_bg p-2">
                <strong>Remarks & Admin</strong>
              </div>
              <Card.Body>
                <Row className="mb-2">
                  <Col md={3}>
                    <strong>Remarks</strong>
                  </Col>
                  <Col>{selectedItem?.remarks || "NA"}</Col>
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
