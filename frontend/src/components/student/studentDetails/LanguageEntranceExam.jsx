import { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../../commonComponents/DataTable";
import usePermissions from "../../commonComponents/usePermissions";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { MdCalendarToday } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  deleteStudentApplication,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  deleteVisitorApplication,
  updateVisitorApplication,
} from "../../../redux/actions/Visitor/VisitorApplication.action";
import { BASEURL } from "../../../baseUrl";

const entranceExamValidationSchema = Yup.object({
  testName: Yup.string(),
  testDate: Yup.string(),
  expireDate: Yup.string(),
  readScore: Yup.string(),
  writeScore: Yup.string(),
  speakScore: Yup.string(),
  listenScore: Yup.string(),
  OverallScore: Yup.string(),
});

const LanguageEntranceExam = ({
  formData,
  edit,
  setEdit,
  handleDocumentUploadEducation,
  countryDocuments,
  oneStudentData,
  docTypeOptions,
  handleDocTypeChange,
  selectedDocType,
  documentNames,
  handleDocNameChange,
  selectedDocumentName,
  setSelectedDocType,
  setSelectedFile,
  setCustomDocName,
  customDocName,
  setSelectedDocumentName,
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
  const [showLanguageModal, setShowLanguageModal] = useState(false);
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
  const entranceExamFormik = useFormik({
    initialValues: {
      entranceExamDetails: [
        {
          testName: "",
          testDate: "",
          expireDate: "",
          readScore: "",
          writeScore: "",
          speakScore: "",
          listenScore: "",
          OverallScore: "",
        },
      ],
    },
    validationSchema: Yup.object({
      entranceExamDetails: Yup.array().of(entranceExamValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.entranceExam) {
        handleEditEntranceExam(values);
      } else {
        handleEntranceExamSubmit(values);
      }
    },
  });
  const handleEntranceExamSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newExam = values.entranceExamDetails[currentIndex];

    if (
      !newExam ||
      Object.values(newExam).every(
        (val) => !val || val.toString().trim() === ""
      )
    ) {
      toast.error("Please fill at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const tempId = "temp123";

      const entranceExamDetail = {
        tempId: tempId,
        testName: newExam.testName || "",
        testDate: newExam.testDate,
        expireDate: newExam.expireDate,
        readScore: newExam.readScore || "",
        listenScore: newExam.listenScore || "",
        writeScore: newExam.writeScore || "",
        OverallScore: newExam.OverallScore || "",
        speakScore: newExam.speakScore || "",
      };

      let payload;
      if (selectedDocType?.value === "others") {
        payload = {
          entranceExamDetails: [entranceExamDetail],
          customDocumentName:
            customDocName ||
            entranceExamFormik.values.entranceExamDetails[0].testName ||
            "Others",
          entranceExamTempId: tempId,
          status: "unverified",
        };
      } else {
        payload = {
          entranceExamDetails: [entranceExamDetail],
          documentType: selectedDocType?.value || "",
          documentName:
            selectedDocumentName?.value === "others"
              ? customDocName ||
                (Array.isArray(
                  entranceExamFormik?.values?.entranceExamDetails
                ) && entranceExamFormik.values.entranceExamDetails.length > 0
                  ? entranceExamFormik.values.entranceExamDetails[0].testName ||
                    "Others"
                  : "Others")
              : selectedDocumentName?.value || "",
          status: "unverified",
          entranceExamTempId: tempId,
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
        toast.success("Entrance exam added successfully");
        setFormData((prev) => ({
          ...prev,
          entranceExamDetails: [
            ...prev.entranceExamDetails,
            res.data.data.entranceExamDetails[0],
          ],
        }));
        
        setShowLanguageModal(false);
        entranceExamFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error adding entrance exam");
      }
    } catch (error) {
      console.error("Error adding entrance exam:", error);
      toast.error(
        error?.response?.data?.message || "Error adding entrance exam"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEntranceExam = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.entranceExamIndex;
    const updatedEntry = values.entranceExamDetails[0];
    const examId = formData.entranceExamDetails[updatedIndex]?._id;

    try {
      const payload = {
        entranceExamId: examId,
        entranceExamUpdate: updatedEntry,
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
        toast.success("Entrance exam updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.entranceExamDetails];
          updatedData[updatedIndex] =
            res.data.data.entranceExamDetails[updatedIndex];
          return { ...prev, entranceExamDetails: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          entranceExam: false,
          entranceExamIndex: 0,
        }));
        setShowLanguageModal(false);
        entranceExamFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error updating entrance exam");
      }
    } catch (error) {
      console.error("Error updating entrance exam:", error);
      toast.error(
        error?.response?.data?.message || "Error updating entrance exam"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntranceExam = async (indexToDelete) => {
    const entranceExamId = formData.entranceExamDetails[indexToDelete]?._id;

    if (!entranceExamId) {
      toast.error("Invalid entrance exam detail. Cannot delete.");
      return;
    }

    const payload = {
      entranceExamId,
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
        toast.success("Entrance exam deleted successfully");
        setFormData((prev) => ({
          ...prev,
          entranceExamDetails: prev.entranceExamDetails.filter(
            (_, i) => i !== indexToDelete
          ),
        }));
        if (edit.entranceExam && edit.entranceExamIndex === indexToDelete) {
          setEdit((prev) => ({
            ...prev,
            entranceExam: false,
            entranceExamIndex: 0,
          }));
        }
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error deleting entrance exam");
      }
    } catch (error) {
      console.error("Error deleting entrance exam:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting entrance exam"
      );
    }
  };
  const languageExamColumns = [
    { label: "Test Name", render: (item) => item?.testName || "-" },
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
    { label: "Read Score", render: (item) => item?.readScore || "-" },
    { label: "Write Score", render: (item) => item?.writeScore || "-" },
    { label: "Speak Score", render: (item) => item?.speakScore || "-" },
    { label: "Listen Score", render: (item) => item?.listenScore || "-" },
    { label: "Overall Score", render: (item) => item?.OverallScore || "-" },
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
          <h5>Language Entrance Exam</h5>
          {userRole !== "Student" && userRole !== "LeadStudent" &&  canCreate && (
          <Button
            variant="primary"
            className="custom-select-height"
            onClick={() => {
              entranceExamFormik.resetForm();
              setEdit((prev) => ({
                ...prev,
                entranceExam: false,
                entranceExamIndex: 0,
              }));
              setShowLanguageModal(true);
            }}
          >
            Add New
          </Button>
           )} 
        </div>
        <Modal
          show={showLanguageModal}
          onHide={() => {
            setShowLanguageModal(false);
            entranceExamFormik.resetForm();
            setEdit((prev) => ({
              ...prev,
              entranceExam: false,
              entranceExamIndex: 0,
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
              {edit.entranceExam ? "Update Language Exam" : "Add Language Exam"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => {
                setShowLanguageModal(false);
                entranceExamFormik.resetForm();
                setEdit((prev) => ({
                  ...prev,
                  entranceExam: false,
                  entranceExamIndex: 0,
                }));
                setSelectedDocType(null);
                setSelectedDocumentName("");
                setCustomDocName("");
                setSelectedFile(null);
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={entranceExamFormik.handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Test Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="entranceExamDetails[0].testName"
                    className="custom-select-height"
                    placeholder="Enter Test Name"
                    value={
                      entranceExamFormik.values.entranceExamDetails[0].testName
                    }
                    onChange={entranceExamFormik.handleChange}
                    onBlur={entranceExamFormik.handleBlur}
                  />
                  {entranceExamFormik.touched.entranceExamDetails?.[0]
                    ?.testName &&
                    entranceExamFormik.errors.entranceExamDetails?.[0]
                      ?.testName && (
                      <div className="text-danger">
                        {
                          entranceExamFormik.errors.entranceExamDetails[0]
                            .testName
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Test Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="entranceExamDetails[0].testDate"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        entranceExamFormik.values.entranceExamDetails[0]
                          .testDate
                          ? formatDate(
                              parseDate(
                                entranceExamFormik.values.entranceExamDetails[0]
                                  .testDate
                              )
                            )
                          : ""
                      }
                      readOnly
                      ref={testDateInputRef}
                      onClick={() => {
                        if (
                          entranceExamFormik.values.entranceExamDetails[0]
                            .testDate
                        ) {
                          setTestDateValue(
                            parseDate(
                              entranceExamFormik.values.entranceExamDetails[0]
                                .testDate
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
                            entranceExamFormik.setFieldValue(
                              "entranceExamDetails[0].testDate",
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
                  {entranceExamFormik.touched.entranceExamDetails?.[0]
                    ?.testDate &&
                    entranceExamFormik.errors.entranceExamDetails?.[0]
                      ?.testDate && (
                      <div className="text-danger">
                        {
                          entranceExamFormik.errors.entranceExamDetails[0]
                            .testDate
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Expire Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="entranceExamDetails[0].expireDate"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        entranceExamFormik.values.entranceExamDetails[0]
                          .expireDate
                          ? formatDate(
                              parseDate(
                                entranceExamFormik.values.entranceExamDetails[0]
                                  .expireDate
                              )
                            )
                          : ""
                      }
                      readOnly
                      ref={expireDateInputRef}
                      onClick={() => {
                        if (
                          entranceExamFormik.values.entranceExamDetails[0]
                            .expireDate
                        ) {
                          setExpireDateValue(
                            parseDate(
                              entranceExamFormik.values.entranceExamDetails[0]
                                .expireDate
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
                            entranceExamFormik.setFieldValue(
                              "entranceExamDetails[0].expireDate",
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
                  {entranceExamFormik.touched.entranceExamDetails?.[0]
                    ?.expireDate &&
                    entranceExamFormik.errors.entranceExamDetails?.[0]
                      ?.expireDate && (
                      <div className="text-danger">
                        {
                          entranceExamFormik.errors.entranceExamDetails[0]
                            .expireDate
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Overall Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="entranceExamDetails[0].OverallScore"
                    className="custom-select-height"
                    placeholder="Enter Overall Score"
                    value={
                      entranceExamFormik.values.entranceExamDetails[0]
                        .OverallScore
                    }
                    onChange={entranceExamFormik.handleChange}
                    onBlur={entranceExamFormik.handleBlur}
                  />
                  {entranceExamFormik.touched.entranceExamDetails?.[0]
                    ?.OverallScore &&
                    entranceExamFormik.errors.entranceExamDetails?.[0]
                      ?.OverallScore && (
                      <div className="text-danger">
                        {
                          entranceExamFormik.errors.entranceExamDetails[0]
                            .OverallScore
                        }
                      </div>
                    )}
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>Reading Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="entranceExamDetails[0].readScore"
                    className="custom-select-height"
                    placeholder="Enter Read Score"
                    value={
                      entranceExamFormik.values.entranceExamDetails[0].readScore
                    }
                    onChange={entranceExamFormik.handleChange}
                    onBlur={entranceExamFormik.handleBlur}
                  />
                  {entranceExamFormik.touched.entranceExamDetails?.[0]
                    ?.readScore &&
                    entranceExamFormik.errors.entranceExamDetails?.[0]
                      ?.readScore && (
                      <div className="text-danger">
                        {
                          entranceExamFormik.errors.entranceExamDetails[0]
                            .readScore
                        }
                      </div>
                    )}
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>Writing Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="entranceExamDetails[0].writeScore"
                    className="custom-select-height"
                    placeholder="Enter Write Score"
                    value={
                      entranceExamFormik.values.entranceExamDetails[0]
                        .writeScore
                    }
                    onChange={entranceExamFormik.handleChange}
                    onBlur={entranceExamFormik.handleBlur}
                  />
                  {entranceExamFormik.touched.entranceExamDetails?.[0]
                    ?.writeScore &&
                    entranceExamFormik.errors.entranceExamDetails?.[0]
                      ?.writeScore && (
                      <div className="text-danger">
                        {
                          entranceExamFormik.errors.entranceExamDetails[0]
                            .writeScore
                        }
                      </div>
                    )}
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>Speaking Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="entranceExamDetails[0].speakScore"
                    className="custom-select-height"
                    placeholder="Enter Speak Score"
                    value={
                      entranceExamFormik.values.entranceExamDetails[0]
                        .speakScore
                    }
                    onChange={entranceExamFormik.handleChange}
                    onBlur={entranceExamFormik.handleBlur}
                  />
                  {entranceExamFormik.touched.entranceExamDetails?.[0]
                    ?.speakScore &&
                    entranceExamFormik.errors.entranceExamDetails?.[0]
                      ?.speakScore && (
                      <div className="text-danger">
                        {
                          entranceExamFormik.errors.entranceExamDetails[0]
                            .speakScore
                        }
                      </div>
                    )}
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>Listening Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="entranceExamDetails[0].listenScore"
                    className="custom-select-height"
                    placeholder="Enter Listen Score"
                    value={
                      entranceExamFormik.values.entranceExamDetails[0]
                        .listenScore
                    }
                    onChange={entranceExamFormik.handleChange}
                    onBlur={entranceExamFormik.handleBlur}
                  />
                  {entranceExamFormik.touched.entranceExamDetails?.[0]
                    ?.listenScore &&
                    entranceExamFormik.errors.entranceExamDetails?.[0]
                      ?.listenScore && (
                      <div className="text-danger">
                        {
                          entranceExamFormik.errors.entranceExamDetails[0]
                            .listenScore
                        }
                      </div>
                    )}
                </Col>
                {!edit.entranceExam && (
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
                              entranceExamFormik.values.entranceExamDetails[0]
                                .testName || ""
                            }`
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
                  {edit.entranceExam ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <DataTable
          columns={languageExamColumns}
          data={canRead ? formData.entranceExamDetails || [] : []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          onEdit={(item) => {
            const values = {
              entranceExamDetails: [
                {
                  testName: item.testName || "",
                  testDate: item.testDate || "",
                  expireDate: item.expireDate || "",
                  readScore: item.readScore || "",
                  writeScore: item.writeScore || "",
                  speakScore: item.speakScore || "",
                  listenScore: item.listenScore || "",
                  OverallScore: item.OverallScore || "",
                },
              ],
            };
            entranceExamFormik.setValues(values);
            setEdit((prev) => ({
              ...prev,
              entranceExam: true,
              entranceExamIndex: formData.entranceExamDetails.indexOf(item),
            }));
            setShowLanguageModal(true);
          }}
          onDelete={(item) => {
            const index = formData.entranceExamDetails.indexOf(item);
            handleDeleteEntranceExam(index);
          }}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
          section="Language Entrance Exam"
          onUpload={handleDocumentUploadEducation}
          countryDocuments={countryDocuments}
          oneStudentData={oneStudentData}
        />
      </div>
    </>
  );
};

export default LanguageEntranceExam;
