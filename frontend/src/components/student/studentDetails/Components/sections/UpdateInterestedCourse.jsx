import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";

const UpdateInterestedCourse = ({
  showModal,
  setShowModal,
  interestedCourseFormik,
  instituteOptions,
  campusData,
  allcourseData,
  setEditState,
  setOtherDocName,
  setOtherDocFile,
  interestedCourseStatus,
  oneStudentData,
  fetchAllCampusByInstitute,
  fetchAllCourse,
  programLevelData,
}) => {
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          interestedCourseFormik.resetForm();
          setEditState((prev) => ({
            ...prev,
            interestedCourseDetails: false,
            interestedCourseIndex: 0,
          }));
          setOtherDocName("");
          setOtherDocFile(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Update Interested Course</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowModal(false);
              interestedCourseFormik.resetForm();
              setEditState((prev) => ({
                ...prev,
                interestedCourseDetails: false,
                interestedCourseIndex: 0,
              }));
              setOtherDocName("");
              setOtherDocFile(null);
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={interestedCourseFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Institute</Form.Label>
                <Select
                  name="interestedCourseDetails[0].institute"
                  className="custom-select-height"
                  options={instituteOptions}
                  value={
                    interestedCourseFormik.values.interestedCourseDetails[0]
                      .institute
                      ? instituteOptions?.find(
                          (option) =>
                            option.value ===
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].institute
                        )
                      : null
                  }
                  onChange={(selectedOption) => {
                    const instituteId = selectedOption
                      ? selectedOption.value
                      : "";
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].institute",
                      instituteId
                    );
                    const preferredCountry =
                      oneStudentData?.purposeDetails?.preferredCountry?.[0] ||
                      "";
                    fetchAllCampusByInstitute(
                      selectedOption ? selectedOption.label : "",
                      preferredCountry
                    );
                    // Fetch courses for the selected institute
                    if (
                      instituteId &&
                      oneStudentData?.purposeDetails?.preferredCountry?.[0]
                    ) {
                      fetchAllCourse(
                        oneStudentData?.purposeDetails?.preferredCountry[0],
                        instituteId
                      );
                    }
                    setTimeout(() => {
                      interestedCourseFormik.setFieldTouched(
                        "interestedCourseDetails[0].institute",
                        true
                      );
                      interestedCourseFormik.validateField(
                        "interestedCourseDetails[0].institute"
                      );
                    }, 0);
                  }}
                  onBlur={() => {
                    interestedCourseFormik.setFieldTouched(
                      "interestedCourseDetails[0].institute",
                      true
                    );
                    interestedCourseFormik.validateField(
                      "interestedCourseDetails[0].institute"
                    );
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "30px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                  placeholder="Select Institute"
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.institute &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.institute && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .institute
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Campus</Form.Label>
                <Select
                  name="interestedCourseDetails[0].campus"
                  className="custom-select-height"
                  options={Array.from(
                    new Map(
                      campusData?.map((campus) => [campus.campus, campus])
                    ).values()
                  )
                    ?.sort((a, b) => a.campus.localeCompare(b.campus))
                    ?.map((campus) => ({
                      label: campus.campus,
                      value: campus._id,
                    }))}
                  value={
                    interestedCourseFormik.values.interestedCourseDetails[0]
                      .campus
                      ? campusData
                          ?.map((campus) => ({
                            label: campus.campus,
                            value: campus._id,
                          }))
                          ?.find(
                            (option) =>
                              option.value ===
                              interestedCourseFormik.values
                                .interestedCourseDetails[0].campus
                          )
                      : null
                  }
                  onChange={(selectedOption) => {
                    const campusId = selectedOption ? selectedOption.value : "";
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].campus",
                      campusId
                    );
                    const preferredCountry =
                      oneStudentData?.purposeDetails?.preferredCountry?.[0] ||
                      "";
                    if (campusId && preferredCountry) {
                      fetchAllCourse(preferredCountry, campusId);
                    }
                    setTimeout(() => {
                      interestedCourseFormik.setFieldTouched(
                        "interestedCourseDetails[0].campus",
                        true
                      );
                      interestedCourseFormik.validateField(
                        "interestedCourseDetails[0].campus"
                      );
                    }, 0);
                  }}
                  onBlur={() => {
                    interestedCourseFormik.setFieldTouched(
                      "interestedCourseDetails[0].campus",
                      true
                    );
                    interestedCourseFormik.validateField(
                      "interestedCourseDetails[0].campus"
                    );
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "30px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                  placeholder="Select Campus"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.campus &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.campus && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .campus
                      }
                    </div>
                  )}
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Program Level *</Form.Label>
                <Select
                  name="interestedCourseDetails[0].programLevel"
                  className="custom-select-height"
                  options={programLevelData
                    .sort((a, b) => a.name?.localeCompare(b.name))
                    .map((programLevel) => ({
                      label: programLevel.name,
                      value: programLevel._id,
                    }))}
                  value={programLevelData
                    .map((programLevel) => ({ label: programLevel.name, value: programLevel._id }))
                    .find(
                      (opt) =>
                        opt.value ===
                        interestedCourseFormik.values.interestedCourseDetails[0]
                          .programLevel
                    )}
                  onChange={(sel) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].programLevel",
                      sel ? sel.value : ""
                    );
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].course",
                      ""
                    );
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "30px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                  placeholder="Select Program Level"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.programLevel &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.programLevel && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .programLevel
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Course</Form.Label>
                <Select
                  name="interestedCourseDetails[0].course"
                  className="custom-select-height"
                  options={allcourseData
                    ?.sort((a, b) => a.programName.localeCompare(b.programName))
                    ?.map((course) => ({
                      label: course.programName,
                      value: course._id,
                    }))}
                  value={
                    interestedCourseFormik.values.interestedCourseDetails?.[0]
                      ?.course
                      ? {
                          value:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].course,
                          label:
                            allcourseData.find(
                              (course) =>
                                course._id ===
                                interestedCourseFormik.values
                                  .interestedCourseDetails[0].course
                            )?.programName || "Course not found",
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].course",
                      selectedOption ? selectedOption.value : ""
                    );
                    setTimeout(() => {
                      interestedCourseFormik.setFieldTouched(
                        "interestedCourseDetails[0].course",
                        true
                      );
                      interestedCourseFormik.validateField(
                        "interestedCourseDetails[0].course"
                      );
                    }, 0);
                  }}
                  onBlur={() => {
                    interestedCourseFormik.setFieldTouched(
                      "interestedCourseDetails[0].course",
                      true
                    );
                    interestedCourseFormik.validateField(
                      "interestedCourseDetails[0].course"
                    );
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "30px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                  placeholder="Select Course"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.course &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.course && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .course
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Intake Month</Form.Label>
                <Select
                  name="interestedCourseDetails[0].intakeMonth"
                  className="custom-select-height"
                  options={
                    allcourseData
                      .find(
                        (course) =>
                          course._id ===
                          interestedCourseFormik.values
                            .interestedCourseDetails?.[0]?.course
                      )
                      ?.intakeMonths?.map((month) => ({
                        value: month,
                        label: month,
                      })) || []
                  }
                  value={
                    interestedCourseFormik.values.interestedCourseDetails?.[0]
                      ?.intakeMonth
                      ? {
                          value:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].intakeMonth,
                          label:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].intakeMonth,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].intakeMonth",
                      selectedOption ? selectedOption.value : ""
                    );
                    setTimeout(() => {
                      interestedCourseFormik.setFieldTouched(
                        "interestedCourseDetails[0].intakeMonth",
                        true
                      );
                      interestedCourseFormik.validateField(
                        "interestedCourseDetails[0].intakeMonth"
                      );
                    }, 0);
                  }}
                  onBlur={() => {
                    interestedCourseFormik.setFieldTouched(
                      "interestedCourseDetails[0].intakeMonth",
                      true
                    );
                    interestedCourseFormik.validateField(
                      "interestedCourseDetails[0].intakeMonth"
                    );
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "30px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                  placeholder="Select Intake Month"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.intakeMonth &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.intakeMonth && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .intakeMonth
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Intake Year</Form.Label>
                <Select
                  name="interestedCourseDetails[0].intakeYear"
                  className="custom-select-height"
                  options={
                    allcourseData
                      .find(
                        (course) =>
                          course._id ===
                          interestedCourseFormik.values
                            .interestedCourseDetails?.[0]?.course
                      )
                      ?.intakeYears?.map((year) => ({
                        value: year,
                        label: year,
                      })) || []
                  }
                  value={
                    interestedCourseFormik.values.interestedCourseDetails?.[0]
                      ?.intakeYear
                      ? {
                          value:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].intakeYear,
                          label:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].intakeYear,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].intakeYear",
                      selectedOption ? selectedOption.value : ""
                    );
                    setTimeout(() => {
                      interestedCourseFormik.setFieldTouched(
                        "interestedCourseDetails[0].intakeYear",
                        true
                      );
                      interestedCourseFormik.validateField(
                        "interestedCourseDetails[0].intakeYear"
                      );
                    }, 0);
                  }}
                  onBlur={() => {
                    interestedCourseFormik.setFieldTouched(
                      "interestedCourseDetails[0].intakeYear",
                      true
                    );
                    interestedCourseFormik.validateField(
                      "interestedCourseDetails[0].intakeYear"
                    );
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "30px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                  placeholder="Select Intake Year"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.intakeYear &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.intakeYear && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .intakeYear
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Status</Form.Label>
                <Select
                  name="interestedCourseDetails[0].status"
                  options={interestedCourseStatus?.map((item) => ({
                    value: item.name,
                    label: item.name,
                  }))}
                  className="custom-select-height"
                  value={
                    interestedCourseFormik.values.interestedCourseDetails?.[0]
                      ?.status
                      ? {
                          value:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].status,
                          label:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].status,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].status",
                      selectedOption ? selectedOption.value : ""
                    );
                    setTimeout(() => {
                      interestedCourseFormik.setFieldTouched(
                        "interestedCourseDetails[0].status",
                        true
                      );
                      interestedCourseFormik.validateField(
                        "interestedCourseDetails[0].status"
                      );
                    }, 0);
                  }}
                  onBlur={() => {
                    interestedCourseFormik.setFieldTouched(
                      "interestedCourseDetails[0].status",
                      true
                    );
                    interestedCourseFormik.validateField(
                      "interestedCourseDetails[0].status"
                    );
                  }}
                  placeholder="Select Status"
                  isClearable
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "30px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  type="text"
                  name="interestedCourseDetails[0].remarks"
                  className="custom-select-height"
                  placeholder="Enter Remarks"
                  value={
                    interestedCourseFormik.values.interestedCourseDetails?.[0]
                      ?.remarks || ""
                  }
                  onChange={interestedCourseFormik.handleChange}
                  onBlur={interestedCourseFormik.handleBlur}
                />
              </Col>
            </Row>
            <div className="text-end mt-3">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
              >
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default UpdateInterestedCourse;
