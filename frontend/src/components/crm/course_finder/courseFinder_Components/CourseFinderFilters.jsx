import { Form, Row } from "react-bootstrap";

const CourseFinderFilters = () => {
  return (
    <>
      {/* {canRead && ( */}
      <div
        className="small-device-adjust p-3 mb-4 bg-light rounded"
        style={{ border: "1px solid #5D54BE", overflow: "visible" }}
      >
        {/* Combined input and buttons in a single flex row */}
        <Row className="align-items-end g-2 px-2 mb-2">
          {/* <Col> */}
          <div className="filter-section gap-2">
            <Form.Group
              controlId="studyArea"
              style={{ flex: 1, position: "relative" }}
            >
              <Form.Control
                type="text"
                placeholder="What would you like to study?"
                name="studyArea"
                className="w-100 rounded-5 search-input-light text-capitalize"
                autoComplete="off"
                style={{
                  height: "45px",
                  borderColor: "#b5bcc4",
                  padding: "10px",
                  minWidth: "230px",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#007BFF";
                  handleInputFocus();
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#b5bcc4";
                  handleInputBlur();
                }}
                value={searchText}
                onChange={handleStudyAreaInputChange}
                ref={inputRef}
              />
              {isSuggestionsVisible && suggestions.length > 0 && (
                <div
                  className="suggestions-container"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "0.5px solid #b5bcc4",
                    borderRadius: "10px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    marginTop: "5px",
                  }}
                >
                  {suggestions.map((word, index) => (
                    <div
                      key={`${word}-${index}`}
                      className="suggestion-item"
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        // borderBottom: "1px solid #f0f0f0",
                      }}
                      onMouseDown={() => handleSuggestionClick(word)}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#DEEBFF")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#fff")
                      }
                    >
                      {word}
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>
            <div className="d-flex flex-wrap justify-content-end gap-2">
              <Button
                variant="primary"
                className="rounded-5 d-flex justify-content-center align-items-center gap-2 px-5"
                style={{ height: "45px", fontSize: "16px" }}
                onClick={() => {
                  setShowFilterModal(false);
                  const hasValidFilters = handleCourseSearch();
                  if (hasValidFilters) {
                    setShowSlider(true);
                  }
                  setTimeout(() => {
                    setShowButton(true);
                  }, 300);
                }}
              >
                <FaSearch fontSize={14} />
                <span>Search</span>
              </Button>
              <Button
                variant="link"
                className="border-primary text-primary text-decoration-none rounded-5 d-flex justify-content-center align-items-center gap-2 px-5"
                style={{ height: "45px", fontSize: "16px" }}
                onClick={() => {
                  resetFilters();
                  setShowSlider(false);
                }}
              >
                <FaUndo fontSize={14} />
                Reset
              </Button>
            </div>
          </div>
          {/* </Col> */}
        </Row>

        <Row className="align-items-end g-2 px-2">
          <Col xs={12} sm={3} md={3}>
            <Form.Label
              className="course_finder_filter mb-1"
              style={{ fontWeight: 500 }}
            >
              Country
            </Form.Label>
            <Select
              id="country-select"
              options={countries
                ?.sort((a, b) => a.name.localeCompare(b.name))
                ?.map((country) => ({
                  value: country.isoCode,
                  label: country.name,
                }))}
              onChange={handleCountryChange}
              isMulti
              value={selectedCountry}
              placeholder="Select Country"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "45px",
                  padding: "0 10px",
                  borderRadius: "12px",
                  borderColor: "#b5bcc4",
                  fontSize: "15px",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#000",
                  fontSize: "15px",
                }),
                multiValue: (base) => ({
                  ...base,
                  fontSize: "16px",
                  margin: "4px 2px",
                }),
                valueContainer: (base) => ({
                  ...base,
                  flexWrap: "wrap",
                  padding: "2px",
                }),
                menu: (base) => ({
                  ...base,
                  fontSize: "16px",
                  marginTop: "2px",
                  width: "100%",
                  position: "absolute",
                  zIndex: 9999,
                }),
                menuList: (base) => ({
                  ...base,
                  maxHeight: "200px",
                  overflowY: "auto",
                }),
              }}
            />
          </Col>
          <Col xs={12} sm={3} md={3}>
            <Form.Label className="course_finder_filter">State</Form.Label>
            <Select
              id="state-select"
              options={states
                ?.sort((a, b) => a.name.localeCompare(b.name))
                ?.map((state) => ({
                  value: state.isoCode,
                  label: state.name,
                }))}
              // onChange={(selectedOptions) => {
              //   setSelectedState(selectedOptions || []);
              //   fetchAllInstituteByCountry(
              //     selectedCountry?.map((c) => c.label),
              //     selectedOptions?.map((s) => s.label) || []
              //   );
              //   setLoadedRecords(12);
              // }}
              onChange={handleStateChange}
              isMulti
              value={selectedState}
              classNamePrefix="custom-select"
              placeholder="Select State"
              isClearable
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
              styles={{
                control: (base) => ({
                  ...base,
                  height: 50,
                  minHeight: 50,
                  padding: "0 10px",
                }),
                valueContainer: (base) => ({
                  ...base,
                  minHeight: 48,
                  paddingTop: 6,
                  paddingBottom: 6,
                  paddingLeft: 8,
                  paddingRight: 8,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 12,
                  padding: "2px 8px",
                  margin: "2px 4px",
                  fontSize: 14,
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: "#333",
                  fontWeight: 500,
                  padding: 0,
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: "#888",
                  ":hover": {
                    backgroundColor: "#e0e0e0",
                    color: "#222",
                  },
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
            />
          </Col>
          <Col xs={12} sm={3} md={3}>
            <Form.Label
              className="course_finder_filter mb-1"
              style={{ fontWeight: 500 }}
            >
              Institute
            </Form.Label>
            <Select
              id="institute-select"
              options={Array.from(
                new Map(
                  instituteDataByCountry
                    ?.sort((a, b) =>
                      a.instituteName.localeCompare(b.instituteName),
                    )
                    ?.map((institute) => [institute.instituteName, institute]), // use name as key
                ).values(),
              ).map((institute) => ({
                value: institute._id,
                label: institute.instituteName,
              }))}
              onChange={(selectedOptions) => {
                setSelectedInstitute(selectedOptions || []);
                setCampus([]); // Clear campus selection when institute changes
                if (selectedOptions && selectedOptions.length > 0) {
                  // Fetch campuses for all selected institutes
                  const instituteNames = selectedOptions.map(
                    (option) => option.label,
                  );
                  fetchAllCampusByInstitute(instituteNames, "");
                } else {
                  setCampusDataByInstitute([]);
                }
                // setLoadedRecords(12);
                setCurrentPage(1);
              }}
              // onChange={handleInstituteChange}
              isMulti
              value={selectedInstitute}
              isClearable
              classNamePrefix="custom-select"
              placeholder="Select Institute"
              styles={{
                control: (base) => ({
                  ...base,
                  height: "45px",
                  minHeight: "45px",
                  padding: "0 0 0 5px",
                  borderRadius: "25px",
                  borderColor: "#b5bcc4",
                  fontSize: "15px",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#000000",
                }),
              }}
            />
          </Col>
          <Col xs={12} sm={3} md={3}>
            <Form.Label
              className="course_finder_filter mb-1"
              style={{ fontWeight: 500 }}
            >
              Campus
            </Form.Label>
            <Select
              id="campus-select"
              options={campusDataByInstitute
                ?.sort((a, b) => a.campus.localeCompare(b.campus))
                ?.map((campus) => ({
                  value: campus._id,
                  label: campus.campus,
                }))}
              onChange={(selectedOptions) => {
                const campusIds = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : [];
                setCampus(campusIds);
                // setLoadedRecords(12);
                setCurrentPage(1);
              }}
              // onChange={handleCampusChange}
              isMulti
              value={campusDataByInstitute
                ?.map((c) => ({
                  value: c._id,
                  label: c.campus,
                }))
                .filter((c) => campus.includes(c.value))}
              placeholder="Select Campus"
              isClearable
              classNamePrefix="custom-select"
              styles={{
                control: (base) => ({
                  ...base,
                  height: "45px",
                  minHeight: "45px",
                  padding: "0 0 0 5px",
                  borderRadius: "25px",
                  borderColor: "#b5bcc4",
                  fontSize: "15px",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#000000",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 10000,
                }),
              }}
            />
          </Col>
        </Row>

        {showButton && (
          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="primary"
              className="rounded-5"
              style={{
                width: "200px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
              onClick={() => {
                setShowFilterModal(true);
                setShowButton(false);
              }}
            >
              Advance Search
              <FaChevronDown size={20} style={{ marginLeft: "12px" }} />
            </Button>
          </div>
        )}
        {showFilterModal && (
          <hr style={{ margin: "16px 0", borderTop: "1px solid #5D54BE" }} />
        )}
        <div
          className={`transition-container ${showFilterModal ? "show" : ""} ${
            isDropdownOpen ? "drop" : ""
          }`}
        >
          {/* Row 1 */}
          <Row
            className="g-2 px-2 mt-1 w-100 rounded"
            style={{ transition: "min-height 0.2s" }}
          >
            <Col md={3}>
              <Form.Label className="course_finder_filter">
                Program Level
              </Form.Label>
              <Select
                isMulti
                options={studyLevelData
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  ?.map((level) => ({ value: level._id, label: level.name }))}
                value={studyLevelData
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  ?.map((level) => ({ value: level._id, label: level.name }))
                  .filter((opt) => selectedProgramLevel.includes(opt.value))}
                onChange={(selectedOptions) => {
                  setSelectedProgramLevel(
                    selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  );
                }}
                classNamePrefix="custom-select"
                placeholder="Select Program Level"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">
                Study Area
              </Form.Label>
              <Select
                id="study-area-select"
                options={studyAreaOption?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                isMulti
                onChange={(selectedOptions) => {
                  const values = selectedOptions
                    ? selectedOptions.map((opt) => opt.value)
                    : [];
                  setSelectedStudyArea(values);
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                value={selectedStudyArea.map((area) => ({
                  value: area,
                  label: area,
                }))}
                classNamePrefix="custom-select"
                placeholder="Select Study Area"
                isClearable
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">
                Discipline Area
              </Form.Label>
              <Select
                id="descilline-area-select"
                options={disciplineAreaOptions}
                isMulti
                onChange={(selectedOptions) => {
                  setSelectedDisciplineArea(
                    selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  );
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                value={disciplineAreaOptions.filter((opt) =>
                  selectedDisciplineArea.includes(opt.value),
                )}
                classNamePrefix="custom-select"
                placeholder="Select Discipline Area"
                isClearable
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">
                Requirements
              </Form.Label>
              <Select
                isMulti
                options={requirementsData?.map((req) => ({
                  value: req._id,
                  label: req.name,
                }))}
                value={requirementsData
                  ?.map((req) => ({ value: req._id, label: req.name }))
                  .filter((opt) => filterRequirements.includes(opt.value))}
                onChange={(selectedOptions) => {
                  setFilterRequirements(
                    selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  );
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                classNamePrefix="custom-select"
                placeholder="Select Requirements"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
          </Row>
          {/* Row 2 */}
          <Row
            className="g-2 px-2 mt-1 w-100 rounded"
            style={{ transition: "min-height 0.2s" }}
          >
            <Col md={3}>
              <Form.Label className="course_finder_filter">Year</Form.Label>
              <Select
                id="year-select"
                className="custom-select-height"
                options={yearOptions}
                onChange={handleYearChange}
                isMulti
                value={
                  selectedYear && selectedYear.length > 0
                    ? selectedYear.map((year) => ({
                        value: year,
                        label: year.toString(),
                      }))
                    : []
                }
                classNamePrefix="custom-select"
                placeholder="Select Year"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Months</Form.Label>
              <Select
                id="months-select"
                className="custom-select-height"
                options={month}
                isMulti
                onChange={handleCheckboxChange}
                value={selectedMonths}
                classNamePrefix="custom-select"
                placeholder="Select Months"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Duration</Form.Label>
              <Select
                id="duration-select"
                options={durationData}
                isMulti
                onChange={handleDurationChange}
                value={selectedDuration}
                classNamePrefix="custom-select"
                placeholder="Select Duration"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Backlog</Form.Label>
              <Form.Control
                type="text"
                value={backlog}
                onChange={(e) => {
                  setBacklog(e.target.value);
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                name="backlog"
                placeholder="Search Backlog"
                className="w-100 rounded-5 search-input-light"
                style={{ height: 50, minHeight: 50, padding: "0 10px" }}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="course_finder_filter">
                Score Out Of
              </Form.Label>
              <Select
                id="duration-select"
                options={scoreOutOfOptions}
                onChange={(selected) => {
                  setScoreOutOf(selected?.value);
                }}
                value={scoreOutOfOptions.filter(
                  (score) => score.value === scoreOutOf,
                )}
                classNamePrefix="custom-select"
                placeholder="Select Duration"
                menuPortalTarget={
                  typeof window !== "undefined" ? document.body : null
                }
                menuPosition="fixed"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="course_finder_filter">Score</Form.Label>
              <Form.Control
                type="text"
                value={score}
                onChange={(e) => {
                  setScore(e.target.value);
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                name="score"
                placeholder="Search Score"
                className="w-100 rounded-5 search-input-light"
                style={{ height: 50, minHeight: 50, padding: "0 10px" }}
              />
            </Col>
            {/* <Col md={3}>
                <Form.Label className="course_finder_filter">ESL/ELP Available</Form.Label>
                <Select
                  id="esl-elp-select"
                  options={options}
                  onChange={(selectedOption) => {
                    setEslElpAvailable(
                      selectedOption ? selectedOption.value : ""
                    );
                  }}
                  value={
                    options.find((opt) => opt.value === eslElpAvailable) ||
                    null
                  }
                  classNamePrefix="custom-select"
                  placeholder="Select available ESL/ELP"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                  }}
                />
              </Col> */}
          </Row>
          {/* Row 3 */}
          <Row
            className="g-2 px-2 mt-1 w-100 rounded"
            style={{ transition: "min-height 0.2s" }}
          ></Row>
          <div className="d-flex justify-content-center">
            <Button
              variant="link"
              className="text-primary"
              onClick={() => {
                setShowFilterModal(false);
                setTimeout(() => {
                  setShowButton(true);
                }, 300);
              }}
            >
              <FaChevronUp
                size={24}
                className={`${isDropdownOpen ? "chevron" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
};
export default CourseFinderFilters;
