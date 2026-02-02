import { useState, useRef } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../../commonComponents/DataTable";
import usePermissions from "../../commonComponents/usePermissions";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  deleteStudentApplication,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import {
  deleteVisitorApplication,
  updateVisitorApplication,
} from "../../../redux/actions/Visitor/VisitorApplication.action";
import { BASEURL } from "../../../baseUrl";

const aptitudeExamValidationSchema = Yup.object({
  testName: Yup.string(),
  testDate: Yup.string(),
  expireDate: Yup.string(),
  verbalReasoningScore: Yup.string(),
  quantitiveReasoningScore: Yup.string(),
  analyticalWritingScore: Yup.string(),
  overallScore: Yup.string(),
});

const AptitudeExamSection = ({
  formData,
  edit,
  setEdit,
  docTypeOptions,
  handleDocTypeChange,
  selectedDocType,
  documentNames,
  handleDocNameChange,
  selectedDocumentName,
  setSelectedFile,
  customDocName,
  setSelectedDocType,
  setSelectedDocumentName,
  setCustomDocName,
  setFormData,
  fetchOneStudentDetails,
  id,
  selectedFile,
  mode,
  fetchOneVisitorDetails,
  userRole
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showAptitudeModal, setShowAptitudeModal] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Student Applications",
        "Personal Details"
  );
  const [showTestDateCalendar, setShowTestDateCalendar] = useState(false);
  const [testDateValue, setTestDateValue] = useState(null);
  const testDateInputRef = useRef(null);
  const [showExpireDateCalendar, setShowExpireDateCalendar] = useState(false);
  const [expireDateValue, setExpireDateValue] = useState(null);
  const expireDateInputRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return null;
  };
  const aptitudeExamFormik = useFormik({
    initialValues: {
      aptitudeExamDetails: [
        {
          testName: "",
          testDate: "",
          expireDate: "",
          verbalReasoningScore: "",
          quantitiveReasoningScore: "",
          analyticalWritingScore: "",
          overallScore: "",
        },
      ],
    },
    validationSchema: Yup.object({
      aptitudeExamDetails: Yup.array().of(aptitudeExamValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.aptitudeExamDetails) {
        handleEditAptitudeExam(values);
      } else {
        handleAptitudeExamSubmit(values);
      }
    },
  });
  const handleAptitudeExamSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newAptitude = values.aptitudeExamDetails[currentIndex];

    if (
      !newAptitude ||
      Object.values(newAptitude).every(
        (val) => !val || val.toString().trim() === ""
      )
    ) {
      toast.error("Please fill at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const tempId = "temp123";

      const aptitudeExamDetail = {
        tempId: tempId,
        testName: newAptitude.testName,
        testDate: newAptitude.testDate,
        expireDate: newAptitude.expireDate,
        verbalReasoningScore: newAptitude.verbalReasoningScore,
        quantitiveReasoningScore: newAptitude.quantitiveReasoningScore,
        analyticalWritingScore: newAptitude.analyticalWritingScore,
        overallScore: newAptitude.overallScore,
      };

      let payload;
      if (selectedDocType?.value === "others") {
        payload = {
          aptitudeExamDetails: [aptitudeExamDetail],
          customDocumentName:
            customDocName ||
            aptitudeExamFormik.values.aptitudeExamDetails[0].testName ||
            "Others",
          aptitudeExamTempId: tempId,
          status: "unverified",
        };
      } else {
        payload = {
          aptitudeExamDetails: [aptitudeExamDetail],
          documentType: selectedDocType?.value || "",
          documentName:
            selectedDocumentName?.value === "others"
              ? customDocName ||
                (Array.isArray(
                  aptitudeExamFormik?.values?.aptitudeExamDetails
                ) && aptitudeExamFormik.values.aptitudeExamDetails.length > 0
                  ? aptitudeExamFormik.values.aptitudeExamDetails[0].testName ||
                    "Others"
                  : "Others")
              : selectedDocumentName?.value || "",
          status: "unverified",
          aptitudeExamTempId: tempId,
        };
      }

      const formData = new FormData();
      if (selectedFile) {
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (selectedFile.size > maxSizeInBytes) {
          toast.error("File size must be less than 5MB");
          setIsLoading(false);
          return;
        }
        formData.append("uploadedDocument", selectedFile);
      }

      formData.append("updateData", JSON.stringify(payload));

      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(formData, id)
          : updateVisitorApplication(formData, id)
      );

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Aptitude exam added successfully");
        setFormData((prev) => ({
          ...prev,
          aptitudeExamDetails: [
            ...prev.aptitudeExamDetails,
            res.data.data.aptitudeExamDetails[0],
          ],
        }));

        setShowAptitudeModal(false);
        aptitudeExamFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error adding aptitude exam");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Error adding aptitude exam"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAptitudeExam = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.aptitudeExamIndex;
    const updatedEntry = values.aptitudeExamDetails[0];
    const examId = formData.aptitudeExamDetails[updatedIndex]?._id;

    try {
      const payload = {
        aptitudeExamId: examId,
        aptitudeExamUpdate: updatedEntry,
      };
      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id)
      );

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Aptitude exam updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.aptitudeExamDetails];
          updatedData[updatedIndex] =
            res.data.data.aptitudeExamDetails[updatedIndex];
          return { ...prev, aptitudeExamDetails: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          aptitudeExamDetails: false,
          aptitudeExamIndex: 0,
        }));
        setShowAptitudeModal(false);
        aptitudeExamFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error updating aptitude exam");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating aptitude exam"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAptitudeExam = async (indexToDelete) => {
    const aptitudeExamId = formData.aptitudeExamDetails[indexToDelete]?._id;

    if (!aptitudeExamId) {
      toast.error("Invalid aptitude exam detail. Cannot delete.");
      return;
    }

    const payload = {
      aptitudeExamId,
    };

    try {
      const res = await dispatch(
        mode === "student"
          ? deleteStudentApplication(payload, id)
          : deleteVisitorApplication(payload, id)
      );
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Aptitude exam deleted successfully");
        setFormData((prev) => ({
          ...prev,
          aptitudeExamDetails: prev.aptitudeExamDetails.filter(
            (_, i) => i !== indexToDelete
          ),
        }));
        if (
          edit.aptitudeExamDetails &&
          edit.aptitudeExamIndex === indexToDelete
        ) {
          setEdit((prev) => ({
            ...prev,
            aptitudeExamDetails: false,
            aptitudeExamIndex: 0,
          }));
        }
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error deleting aptitude exam");
      }
    } catch (error) {
      console.error("Error deleting aptitude exam:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting aptitude exam"
      );
    }
  };
  const aptitudeExamColumns = [
    { label: "Test Name", render: (item) => item.testName || "-" },
    {
      label: "Test Date",
      render: (item) =>
        item?.testDate ? formatDate(parseDate(item?.testDate)) : "-",
    },
    {
      label: "Expire Date",
      render: (item) =>
        item?.expireDate ? formatDate(parseDate(item?.expireDate)) : "-",
    },
    {
      label: "Verbal Reasoning Score",
      render: (item) => item.verbalReasoningScore || "-",
    },
    {
      label: "Quantitive Reasoning Score",
      render: (item) => item.quantitiveReasoningScore || "-",
    },
    {
      label: "Analytical Writing Score",
      render: (item) => item.analyticalWritingScore || "-",
    },
    { label: "Overall Score", render: (item) => item.overallScore || "-" },
    {
      label: "Uploaded Document",
      render: (item) =>
        item?.fileUrl ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() =>
              window.open(`${BASEURL}/${item.fileUrl}`, "_blank", "noopener,noreferrer")
            }
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
    { label: "Created by", render: (item) => item?.createdByName || "-" },
    { label: "Updated by", render: (item) => item?.updatedByName || "-" },
  ];

  return (
    <>
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
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Aptitude Exam</h5>
          {userRole !== "Student" && userRole !== "LeadStudent" &&  canCreate && (
          <Button
            variant="primary"
            className="custom-select-height"
            onClick={() => {
              aptitudeExamFormik.resetForm();
              setEdit((prev) => ({
                ...prev,
                aptitudeExamDetails: false,
                aptitudeExamIndex: 0,
              }));
              setShowAptitudeModal(true);
            }}
          >
            Add New
          </Button>
           )} 
        </div>
        <Modal
          show={showAptitudeModal}
          onHide={() => {
            setShowAptitudeModal(false);
            aptitudeExamFormik.resetForm();
            setEdit((prev) => ({
              ...prev,
              aptitudeExamDetails: false,
              aptitudeExamIndex: 0,
            }));
            setSelectedDocType(null);
            setSelectedDocumentName("");
            setCustomDocName("");
            setSelectedFile(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header className="form-main-heading">
            <Modal.Title>
              {edit.aptitudeExamDetails
                ? "Update Aptitude Exam"
                : "Add Aptitude Exam"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => {
                setShowAptitudeModal(false);
                aptitudeExamFormik.resetForm();
                setEdit((prev) => ({
                  ...prev,
                  aptitudeExamDetails: false,
                  aptitudeExamIndex: 0,
                }));
                setSelectedDocType(null);
                setSelectedDocumentName("");
                setCustomDocName("");
                setSelectedFile(null);
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={aptitudeExamFormik.handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Test Name</Form.Label>
                  <Form.Control
                    type="text"
                    name={`aptitudeExamDetails[0].testName`}
                    className="custom-select-height"
                    placeholder="Enter Test Name"
                    value={
                      aptitudeExamFormik.values.aptitudeExamDetails[0]?.testName
                    }
                    onChange={aptitudeExamFormik.handleChange}
                    onBlur={aptitudeExamFormik.handleBlur}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Test Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name={`aptitudeExamDetails[0].testDate`}
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        aptitudeExamFormik.values.aptitudeExamDetails[0]
                          ?.testDate
                          ? formatDate(
                              parseDate(
                                aptitudeExamFormik.values.aptitudeExamDetails[0]
                                  ?.testDate
                              )
                            )
                          : ""
                      }
                      readOnly
                      ref={testDateInputRef}
                      onClick={() => {
                        if (
                          aptitudeExamFormik.values.aptitudeExamDetails[0]
                            ?.testDate
                        ) {
                          setTestDateValue(
                            parseDate(
                              aptitudeExamFormik.values.aptitudeExamDetails[0]
                                ?.testDate
                            )
                          );
                        }
                        setShowTestDateCalendar((show) => !show);
                      }}
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
                    />
                    <MdCalendarToday
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#888",
                        pointerEvents: "none",
                      }}
                      size={20}
                    />
                    {showTestDateCalendar && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: testDateInputRef.current
                            ? testDateInputRef.current.offsetWidth
                            : "auto",
                          minWidth: 180,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            setTestDateValue(selectedDate);
                            aptitudeExamFormik.setFieldValue(
                              "aptitudeExamDetails[0].testDate",
                              formatDate(selectedDate)
                            );
                            setShowTestDateCalendar(false);
                          }}
                          value={testDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Expire Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name={`aptitudeExamDetails[0].expireDate`}
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        aptitudeExamFormik.values.aptitudeExamDetails[0]
                          ?.expireDate
                          ? formatDate(
                              parseDate(
                                aptitudeExamFormik.values.aptitudeExamDetails[0]
                                  ?.expireDate
                              )
                            )
                          : ""
                      }
                      readOnly
                      ref={expireDateInputRef}
                      onClick={() => {
                        if (
                          aptitudeExamFormik.values.aptitudeExamDetails[0]
                            ?.expireDate
                        ) {
                          setExpireDateValue(
                            parseDate(
                              aptitudeExamFormik.values.aptitudeExamDetails[0]
                                ?.expireDate
                            )
                          );
                        }
                        setShowExpireDateCalendar((show) => !show);
                      }}
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
                    />
                    <MdCalendarToday
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#888",
                        pointerEvents: "none",
                      }}
                      size={20}
                    />
                    {showExpireDateCalendar && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: expireDateInputRef.current
                            ? expireDateInputRef.current.offsetWidth
                            : "auto",
                          minWidth: 180,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            setExpireDateValue(selectedDate);
                            aptitudeExamFormik.setFieldValue(
                              "aptitudeExamDetails[0].expireDate",
                              formatDate(selectedDate)
                            );
                            setShowExpireDateCalendar(false);
                          }}
                          value={expireDateValue}
                          locale="en-GB"
                          minDate={new Date()}
                        />
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Verbal Reasoning Score</Form.Label>
                  <Form.Control
                    type="text"
                    name={`aptitudeExamDetails[0].verbalReasoningScore`}
                    className="custom-select-height"
                    placeholder="Enter Score"
                    value={
                      aptitudeExamFormik.values.aptitudeExamDetails[0]
                        ?.verbalReasoningScore
                    }
                    onChange={aptitudeExamFormik.handleChange}
                    onBlur={aptitudeExamFormik.handleBlur}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Quantitative Reasoning Score</Form.Label>
                  <Form.Control
                    type="text"
                    name={`aptitudeExamDetails[0].quantitiveReasoningScore`}
                    className="custom-select-height"
                    placeholder="Enter Score"
                    value={
                      aptitudeExamFormik.values.aptitudeExamDetails[0]
                        ?.quantitiveReasoningScore
                    }
                    onChange={aptitudeExamFormik.handleChange}
                    onBlur={aptitudeExamFormik.handleBlur}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Analytical Writing Score</Form.Label>
                  <Form.Control
                    type="text"
                    name={`aptitudeExamDetails[0].analyticalWritingScore`}
                    className="custom-select-height"
                    placeholder="Enter Score"
                    value={
                      aptitudeExamFormik.values.aptitudeExamDetails[0]
                        ?.analyticalWritingScore
                    }
                    onChange={aptitudeExamFormik.handleChange}
                    onBlur={aptitudeExamFormik.handleBlur}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Overall Score</Form.Label>
                  <Form.Control
                    type="text"
                    name={`aptitudeExamDetails[0].overallScore`}
                    className="custom-select-height"
                    placeholder="Enter Overall Score"
                    value={
                      aptitudeExamFormik.values.aptitudeExamDetails[0]
                        ?.overallScore
                    }
                    onChange={aptitudeExamFormik.handleChange}
                    onBlur={aptitudeExamFormik.handleBlur}
                  />
                </Col>
                {!edit.aptitudeExamDetails && (
                  <>
                    <Col md={6} className="mb-3">
                      <Form.Label>Document Type</Form.Label>
                      <Select
                        options={docTypeOptions}
                        onChange={handleDocTypeChange}
                        placeholder="Select Document Type"
                        isClearable
                        className="custom-select-height"
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
                        value={selectedDocType}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Document Name</Form.Label>
                      <Select
                        options={documentNames}
                        onChange={handleDocNameChange}
                        placeholder="Select Document Name"
                        isClearable
                        isDisabled={!selectedDocType}
                        className="custom-select-height"
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
                        value={selectedDocumentName}
                      />
                      {(selectedDocType?.value === "others" ||
                        selectedDocumentName?.value === "others") && (
                        <Form.Control
                          type="text"
                          placeholder="Enter custom document name"
                          value={
                            customDocName ||
                            `${
                              aptitudeExamFormik.values.aptitudeExamDetails[0]
                                .testName || ""
                            }`.trim()
                          }
                          onChange={(e) => setCustomDocName(e.target.value)}
                          className="custom-select-height mt-2"
                        />
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      {" "}
                      <Form.Label>Upload Document</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="custom-select-height"
                      />{" "}
                    </Col>
                  </>
                )}
              </Row>

              <div className="text-end mt-3">
                <Button
                  variant="primary"
                  className="custom-select-height"
                  type="submit"
                >
                  {/* Add Aptitude Exam */}
                  {edit.aptitudeExamDetails ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <DataTable
          columns={aptitudeExamColumns}
          data={canRead ? formData.aptitudeExamDetails || [] : []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          onEdit={(item) => {
            const values = {
              aptitudeExamDetails: [
                {
                  testName: item.testName || "",
                  testDate: item.testDate || "",
                  expireDate: item.expireDate || "",
                  verbalReasoningScore: item.verbalReasoningScore || "",
                  quantitiveReasoningScore: item.quantitiveReasoningScore || "",
                  analyticalWritingScore: item.analyticalWritingScore || "",
                  overallScore: item.overallScore || "",
                },
              ],
            };
            aptitudeExamFormik.setValues(values);
            setEdit((prev) => ({
              ...prev,
              aptitudeExamDetails: true,
              aptitudeExamIndex: formData.aptitudeExamDetails.indexOf(item),
            }));
            setShowAptitudeModal(true);
          }}
          onDelete={(item) => {
            const index = formData.aptitudeExamDetails.indexOf(item);
            handleDeleteAptitudeExam(index);
          }}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
        />
      </div>
    </>
  );
};

export default AptitudeExamSection;
