import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import Select from "react-select";

const CourseFinderForm = ({
  showModal,
  closeModal,
  formik,
  isLoading,
  instituteData,
  selectedUniversities,
  setSelectedUniversities,
  studyLevelData,
  setSelectedStudyLevel,
  selectedStudyLevel,
  requirementsData,
  selectedRequirements,
  setSelectedRequirements,
  tagsData,
  selectedTags,
  setSelectedTags,
  intakeYearList,
  selectedIntakeYear,
  setSelectedIntakeYear,
  selectedIntake,
  setSelectedIntake,
  intakeList,
  checkboxStatus,
  setCheckboxStatus,
  currencyCodeData,
  handleEslElpChange,
  showInput,
  scoreOutOfOptions
}) => {
  return (
    <>
      <Modal show={showModal} onHide={closeModal} size="xl" centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {formik.values.id ? "Update Course" : "Add Course"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={closeModal}
          />
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
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
          <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="university">
                  <Form.Label>University</Form.Label>
                  <Select
                    id="university-select"
                    options={instituteData
                      ?.sort((a, b) => a.name?.localeCompare(b.name))
                      ?.map((institute) => ({
                        value: institute._id,
                        label: institute.name,
                      }))}
                    isMulti={!formik.values.id}
                    onChange={(selectedOption) => {
                      let selected = [];
                      if (formik.values.id) {
                        selected = selectedOption
                          ? [
                              {
                                _id: selectedOption.value,
                                name: selectedOption.label,
                              },
                            ]
                          : [];
                      } else {
                        selected = selectedOption
                          ? selectedOption.map((option) => ({
                              _id: option.value,
                              name: option.label,
                            }))
                          : [];
                      }
                      setSelectedUniversities(selected);
                      formik.setFieldValue(
                        "university",
                        selected.map((item) => item._id)
                      );
                    }}
                    value={
                      formik.values.id
                        ? selectedUniversities.length > 0
                          ? {
                              value: selectedUniversities[0]._id,
                              label: selectedUniversities[0].name,
                            }
                          : null
                        : selectedUniversities.map((uni) => ({
                            value: uni._id,
                            label: uni.name,
                          }))
                    }
                    classNamePrefix="custom-select"
                    placeholder="Select University"
                    isClearable
                  />
                  {formik?.touched?.university && formik.errors.university && (
                    <div className="text-danger">
                      {formik.errors.university}
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Program Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="programName"
                    className="custom-select-height"
                    placeholder="Enter Program Name"
                    value={formik.values.programName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik?.touched?.programName &&
                    formik.errors.programName && (
                      <div className="text-danger">
                        {formik.errors.programName}
                      </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Application Starting Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="applicationStartDate"
                    className="custom-select-height"
                    placeholder="Select Application Starting Date"
                    value={formik.values.applicationStartDate}
                    onChange={(e) =>
                      formik.setFieldValue("applicationStartDate", [
                        e.target.value,
                      ])
                    }
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Application Ending Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="applicationEndDate"
                    className="custom-select-height"
                    placeholder="Select Application Ending Date"
                    value={formik.values.applicationEndDate}
                    onChange={(e) =>
                      formik.setFieldValue("applicationEndDate", [
                        e.target.value,
                      ])
                    }
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Career Details</Form.Label>
                  <Form.Control
                    name="career"
                    className="custom-select-height"
                    placeholder="Enter career prospects / outcomes"
                    value={formik.values.career}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.career && formik.errors.career && (
                    <div className="text-danger">{formik.errors.career}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    className="custom-select-height"
                    placeholder="Enter Duration"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Concentration</Form.Label>
                  <Form.Control
                    type="text"
                    name="concentration"
                    className="custom-select-height"
                    placeholder="Enter Concentration"
                    value={formik.values.concentration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Study Area</Form.Label>
                  <Form.Control
                    type="text"
                    name="studyArea"
                    className="custom-select-height"
                    placeholder="Enter Study Area"
                    value={formik.values.studyArea}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik?.touched?.studyArea && formik.errors.studyArea && (
                    <div className="text-danger">{formik.errors.studyArea}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Discipline Area</Form.Label>
                  <Form.Control
                    type="text"
                    name="disciplineArea"
                    className="custom-select-height"
                    placeholder="Enter Discipline Area (comma-separated values)"
                    value={formik.values.disciplineArea}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik?.touched?.disciplineArea &&
                    formik.errors.disciplineArea && (
                      <div className="text-danger">
                        {formik.errors.disciplineArea}
                      </div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Score</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="score"
                    placeholder="Enter Score"
                    value={formik.values.score}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.score && formik.errors.score && (
                    <div className="text-danger">{formik.errors.score}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Score Out Of</Form.Label>
                  <Select
                    options={scoreOutOfOptions}
                    name="scoreOutOf"
                    placeholder="Select Score Out Of"
                     classNamePrefix="custom-select"
                    value={scoreOutOfOptions.find(
                      (opt) => opt.value === formik.values.scoreOutOf
                    )}
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "scoreOutOf",
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
                    
                    isClearable
                  />
                  {formik.touched.scoreOutOf && formik.errors.scoreOutOf && (
                    <div className="text-danger">
                      {formik.errors.scoreOutOf}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="studyLevel">
                  <Form.Label>Study Level</Form.Label>
                  <Select
                    id="study-level-select"
                    options={studyLevelData?.map((level) => ({
                      value: level._id,
                      label: level.name,
                    }))}
                    isMulti
                    onChange={(selectedOptions) => {
                      const selected = selectedOptions
                        ? selectedOptions.map((option) => ({
                            _id: option.value,
                            name: option.label,
                          }))
                        : [];
                      setSelectedStudyLevel(selected);
                      formik.setFieldValue(
                        "studyLevel",
                        selected.map((item) => item._id)
                      );
                    }}
                    value={selectedStudyLevel.map((level) => ({
                      value: level._id,
                      label: level.name,
                    }))}
                    placeholder="Select study level"
                    isClearable
                    noOptionsMessage={() => "No study levels available"}
                    classNamePrefix="custom-select"
                  />
                  {formik?.touched?.studyLevel && formik.errors.studyLevel && (
                    <div className="text-danger">
                      {formik.errors.studyLevel}
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="requirements">
                  <Form.Label>Requirements</Form.Label>
                  <Select
                    id="requirements-select"
                    options={requirementsData?.map((requirement) => ({
                      value: requirement._id,
                      label: requirement.name,
                    }))}
                    isMulti
                    onChange={(selectedOptions) => {
                      const selected = selectedOptions
                        ? selectedOptions.map((option) => ({
                            _id: option.value,
                            name: option.label,
                          }))
                        : [];
                      setSelectedRequirements(selected);
                      formik.setFieldValue(
                        "requirements",
                        selected.map((item) => item._id)
                      );
                    }}
                    value={selectedRequirements.map((req) => ({
                      value: req._id,
                      label: req.name,
                    }))}
                    placeholder="Select Requirements"
                    isClearable
                    noOptionsMessage={() => "No requirements available"}
                    classNamePrefix="custom-select"
                  />
                  {formik?.touched?.requirements &&
                    formik.errors.requirements && (
                      <div className="text-danger">
                        {formik.errors.requirements}
                      </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Entry Requirement</Form.Label>
                  <Form.Control
                    type="text"
                    name="entryRequirements"
                    className="custom-select-height"
                    placeholder="Enter Entry Requirement"
                    value={formik.values.entryRequirements}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="tags">
                  <Form.Label>Tags</Form.Label>
                  <Select
                    id="tags-select"
                    options={
                      Array.isArray(tagsData) && tagsData.length > 0
                        ? tagsData
                            .sort((a, b) => a.name?.localeCompare(b.name))
                            .map((tag) => ({
                              value: tag._id,
                              label: tag.name,
                            }))
                        : []
                    }
                    isMulti
                    onChange={(selectedOptions) => {
                      const selected = selectedOptions
                        ? selectedOptions.map((option) => ({
                            _id: option.value,
                            name: option.label,
                          }))
                        : [];
                      setSelectedTags(selected);
                      formik.setFieldValue(
                        "tags",
                        selected.map((item) => item._id)
                      );
                    }}
                    value={selectedTags.map((tag) => ({
                      value: tag._id,
                      label: tag.name,
                    }))}
                    placeholder="Select Tags"
                    isClearable
                    noOptionsMessage={() => "No tags available"}
                    classNamePrefix="custom-select"
                  />
                  {formik?.touched?.tags && formik.errors.tags && (
                    <div className="text-danger">{formik.errors.tags}</div>
                  )}
                </Form.Group>
              </Col>

              {/* Right Column */}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="intakeYear">
                  <Form.Label>Intake year</Form.Label>
                  <Select
                    id="intake-year-select"
                    options={intakeYearList.map((year) => ({
                      value: year,
                      label: year.toString(),
                    }))}
                    isMulti
                    onChange={(selectedOptions) => {
                      const selectedYears = selectedOptions
                        ? selectedOptions.map((option) => option.value)
                        : [];
                      setSelectedIntakeYear(selectedYears);
                      formik.setFieldValue("intakeYear", selectedYears);
                    }}
                    value={selectedIntakeYear.map((year) => ({
                      value: year,
                      label: year.toString(),
                    }))}
                    placeholder="Select Intake year"
                    classNamePrefix="custom-select"
                    isClearable
                  />
                  {formik?.touched?.intakeYear && formik.errors.intakeYear && (
                    <div className="text-danger">
                      {formik.errors.intakeYear}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="intake">
                  <Form.Label>Intake</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle
                      className={`month-dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center border ${
                        !selectedIntake.length ? "text-muted" : ""
                      }`}
                      style={{
                        height: "38px",
                        fontSize: "13px",
                        padding: "8px 12px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          flexGrow: 1,
                          overflowX: "auto",
                          overflowY: "hidden",
                          whiteSpace: "nowrap",
                          marginRight: "8px",
                        }}
                        className="d-flex align-items-center gap-2"
                      >
                        {selectedIntake.length > 0 ? (
                          selectedIntake.map((intake, index) => (
                            <span
                              key={`${intake}-${index}`}
                              className="text-black rounded-4 px-2 py-1"
                              style={{
                                fontSize: "12px",
                                backgroundColor: "#E9ECEF",
                                flexShrink: 0,
                              }}
                            >
                              {intake} (
                              {checkboxStatus[intake] ? "Active" : "Inactive"})
                            </span>
                          ))
                        ) : (
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Select Intake
                          </span>
                        )}
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="month-dropdown-menu w-100"
                      style={{
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {intakeList.map((intake, index) => (
                        <div
                          key={`${intake}-${index}`}
                          className="d-flex align-items-center px-2 py-1"
                          style={{
                            transition: "background-color 0.2s",
                          }}
                        >
                          <Form.Check
                            name="intake"
                            type="checkbox"
                            id={`checkbox-${intake}`}
                            checked={checkboxStatus[intake] || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setCheckboxStatus((prev) => ({
                                ...prev,
                                [intake]: checked,
                              }));
                              const updatedIntakes = intakeList.map((i) => ({
                                month: i,
                                status:
                                  checkboxStatus[i] || false
                                    ? "Active"
                                    : "Inactive",
                              }));
                              formik.setFieldValue(
                                "intakes",
                                updatedIntakes.filter((item) =>
                                  selectedIntake.includes(item.month)
                                )
                              );
                            }}
                            className="me-2"
                            style={{ flexShrink: 0 }}
                          />
                          <span
                            style={{
                              fontSize: "14px",
                              color: selectedIntake.includes(intake)
                                ? "#007bff"
                                : "#333",
                              flexGrow: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              cursor: "pointer",
                              fontWeight: selectedIntake.includes(intake)
                                ? "bold"
                                : "normal",
                            }}
                            onClick={() => {
                              let updated = [];
                              if (selectedIntake.includes(intake)) {
                                updated = selectedIntake.filter(
                                  (item) => item !== intake
                                );
                              } else {
                                updated = [...selectedIntake, intake];
                              }
                              setSelectedIntake(updated);
                              const updatedIntakes = intakeList.map((i) => ({
                                month: i,
                                status:
                                  checkboxStatus[i] || false
                                    ? "Active"
                                    : "Inactive",
                              }));
                              formik.setFieldValue(
                                "intakes",
                                updatedIntakes.filter((item) =>
                                  updated.includes(item.month)
                                )
                              );
                            }}
                          >
                            {intake}
                          </span>
                        </div>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {formik?.touched?.intakes && formik.errors.intakes && (
                    <div className="text-danger">{formik.errors.intakes}</div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Select
                     classNamePrefix="custom-select"
                    name="currencyCode"
                    options={currencyCodeData?.map((code) => ({
                      value: code.code,
                      label: code.code,
                    }))}
                    value={currencyCodeData
                      ?.map((code) => ({
                        value: code.code,
                        label: code.code,
                      }))
                      .find(
                        (option) => option.value === formik.values.currencyCode
                      )}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "currencyCode",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    placeholder="Select Currency"
                    isClearable
                  />

                  {formik?.touched?.currencyCode &&
                    formik.errors.currencyCode && (
                      <div className="text-danger">
                        {formik.errors.currencyCode}
                      </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Application Fee</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFee"
                    className="custom-select-height"
                    placeholder="Enter Application Fee"
                    value={formik.values.applicationFee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik?.touched?.applicationFee &&
                    formik.errors.applicationFee && (
                      <div className="text-danger">
                        {formik.errors.applicationFee}
                      </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Yearly Tuition Fees</Form.Label>
                  <Form.Control
                    type="text"
                    name="yearlyTuitionFee"
                    className="custom-select-height"
                    placeholder="Enter Yearly Tuition Fees"
                    value={formik.values.yearlyTuitionFee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik?.touched?.yearlyTuitionFee &&
                    formik.errors.yearlyTuitionFee && (
                      <div className="text-danger">
                        {formik.errors.yearlyTuitionFee}
                      </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="scholarshipAvailable">
                  <Form.Label>Scholarship Available</Form.Label>
                  <Select
                    id="scholarship-available-select"
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                    onChange={(selectedOption) => {
                      const value = selectedOption ? selectedOption.value : "";
                      formik.setFieldValue("scholarshipAvailable", value);
                    }}
                    value={
                      formik.values.scholarshipAvailable
                        ? {
                            value: formik.values.scholarshipAvailable,
                            label: formik.values.scholarshipAvailable,
                          }
                        : null
                    }
                    placeholder="Select Option"
                    isClearable
                    noOptionsMessage={() => "No options available"}
                    classNamePrefix="custom-select"
                  />
                  {formik?.touched?.scholarshipAvailable &&
                    formik.errors.scholarshipAvailable && (
                      <div className="text-danger">
                        {formik.errors.scholarshipAvailable}
                      </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Scholarship Detail</Form.Label>
                  <Form.Control
                    type="text"
                    name="scholarshipDetails"
                    className="custom-select-height"
                    placeholder="Enter Scholarship Detail"
                    value={formik.values.scholarshipDetails}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Website URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="websiteUrl"
                    className="custom-select-height"
                    placeholder="Enter Website URL"
                    value={formik.values.websiteUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    name="remarks"
                    className="custom-select-height"
                    placeholder="Enter Remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="applicationMode">
                  <Form.Label>Application Mode</Form.Label>
                  <Select
                    id="application-mode-select"
                    options={[
                      { value: "Online", label: "Online" },
                      { value: "Offline", label: "Offline" },
                    ]}
                    onChange={(selectedOption) => {
                      const value = selectedOption ? selectedOption.value : "";
                      formik.setFieldValue("applicationMode", value);
                    }}
                    value={
                      formik.values.applicationMode
                        ? {
                            value: formik.values.applicationMode,
                            label: formik.values.applicationMode,
                          }
                        : null
                    }
                    placeholder="Select Option"
                    isClearable
                    noOptionsMessage={() => "No options available"}
                    classNamePrefix="custom-select"
                  />
                  {formik?.touched?.applicationMode &&
                    formik.errors.applicationMode && (
                      <div className="text-danger">
                        {formik.errors.applicationMode}
                      </div>
                    )}
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="englishProficiencyExamWaiver"
                >
                  <Form.Label>English Proficiency Exam Waiver</Form.Label>
                  <Select
                    id="english-proficiency-exam-waiver-select"
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                    onChange={(selectedOption) => {
                      const value = selectedOption ? selectedOption.value : "";
                      formik.setFieldValue(
                        "englishProficiencyExamWaiver",
                        value
                      );
                    }}
                    value={
                      formik.values.englishProficiencyExamWaiver
                        ? {
                            value: formik.values.englishProficiencyExamWaiver,
                            label: formik.values.englishProficiencyExamWaiver,
                          }
                        : null
                    }
                    placeholder="Select Option"
                    isClearable
                    noOptionsMessage={() => "No options available"}
                    classNamePrefix="custom-select"
                  />
                  {formik?.touched?.englishProficiencyExamWaiver &&
                    formik.errors.englishProficiencyExamWaiver && (
                      <div className="text-danger">
                        {formik.errors.englishProficiencyExamWaiver}
                      </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Criteria</Form.Label>
                  <Form.Control
                    type="text"
                    name="criteria"
                    className="custom-select-height"
                    placeholder="Enter Criteria Detail"
                    value={formik.values.criteria}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="eslElpAvailable">
                    ESL/ELP Available
                  </Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Yes"
                    id="eslElpAvailable"
                    name="eslElpAvailable"
                    checked={formik.values.eslElpAvailable === "Yes"}
                    onChange={handleEslElpChange}
                  />
                  <Form.Control
                    type="text"
                    name="eslElpDetails"
                    value={formik.values.eslElpDetails}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="custom-select-height"
                    placeholder="Enter Details (if applicable)"
                    style={{ marginTop: "10px" }}
                    disabled={!showInput}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Select
                    id="status-select"
                    options={[
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                    ]}
                    onChange={(selectedOption) => {
                      const value = selectedOption ? selectedOption.value : "";
                      formik.setFieldValue("status", value);
                    }}
                    value={
                      formik.values.status
                        ? {
                            value: formik.values.status,
                            label: formik.values.status,
                          }
                        : null
                    }
                    placeholder="Select Status"
                    isClearable
                    noOptionsMessage={() => "No options available"}
                    classNamePrefix="custom-select"
                  />
                  {formik?.touched?.status && formik.errors.status && (
                    <div className="text-danger">{formik.errors.status}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="link"
              className="custom-select-height btn border-primary text-primary text-decoration-none"
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              variant="primary"
              className="custom-select-height"
              type="submit"
            >
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CourseFinderForm;
