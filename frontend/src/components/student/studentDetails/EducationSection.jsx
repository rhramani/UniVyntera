import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../../commonComponents/DataTable";
import usePermissions from "../../commonComponents/usePermissions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { toast } from "react-toastify";
import {
  deleteStudentApplication,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import { useDispatch } from "react-redux";
import {
  deleteVisitorApplication,
  updateVisitorApplication,
} from "../../../redux/actions/Visitor/VisitorApplication.action";
import { BASEURL } from "../../../baseUrl";

const educationValidationSchema = Yup.object({
  degree: Yup.string().required("Degree is required"),
  stream: Yup.string().required("Stream is required"),

  score: Yup.number()
    .typeError("Score must be a number")
    .positive("Score must be greater than 0")
    .test(
      "max-score",
      "Score cannot be greater than Score Out Of",
      function (value) {
        const { scoreOutOf } = this.parent;
        if (!value || !scoreOutOf) return true;
        return Number(value) <= Number(scoreOutOf);
      },
    )
    .required("Score is required"),
  scoreOutOf: Yup.string().required("Score Out of is required"),
  passingYear: Yup.string().required("Passing Year is required"),
  boardOrUniversity: Yup.string().required("Board or University is required"),
});

const EducationSection = ({
  formData,
  edit,
  setEdit,
  handleDocumentUploadEducation,
  countryDocuments,
  oneStudentData,
  docTypeOptions,
  handleDocTypeChange,
  selectedDocType,
  setSelectedDocType,
  documentNames,
  handleDocNameChange,
  selectedDocumentName,
  setSelectedFile,
  customDocName,
  setCustomDocName,
  setSelectedDocumentName,
  selectedFile,
  setFormData,
  fetchOneStudentDetails,
  fetchOneVisitorDetails,
  id,
  mode,
  userRole,
}) => {
  const dispatch = useDispatch();
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Student Applications",
    "Personal Details",
  );

  const educationColumns = [
    {
      label: "Degree",
      render: (item) => (item ? item.degree || "-" : "-"),
    },
    {
      label: "Stream",
      render: (item) => (item ? item.stream || "-" : "-"),
    },
    {
      label: "Score",
      render: (item) => (item ? item.score || "-" : "-"),
    },
    {
      label: "Score Out of",
      render: (item) => (item ? item.scoreOutOf || "-" : "-"),
    },
    {
      label: "Passing Year",
      render: (item) => (item ? item.passingYear || "-" : "-"),
    },
    {
      label: "Board/University",
      render: (item) => (item ? item.boardOrUniversity || "-" : "-"),
    },
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
            onClick={() => {
              window.open(
                `${BASEURL}/${item.fileUrl}`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
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

  const scoreOutOfOptions = [
    { value: "100", label: "Out of 100" },
    { value: "10", label: "Out of 10" },
    { value: "7", label: "Out of 7" },
    { value: "5", label: "Out of 5" },
    { value: "4", label: "Out of 4" },
  ];
  const educationFormik = useFormik({
    initialValues: {
      educationDetails: [
        {
          degree: "",
          stream: "",
          score: "",
          scoreOutOf: "",
          passingYear: "",
          boardOrUniversity: "",
        },
      ],
    },
    validationSchema: Yup.object({
      educationDetails: Yup.array().of(educationValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.educationDetails) {
        handleEditEducation(values);
      } else {
        handleEducationSubmit(values);
      }
    },
  });
  const handleEducationSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newEducation = values.educationDetails[currentIndex];

    if (
      !newEducation ||
      Object.values(newEducation).every(
        (val) => !val || val.toString().trim() === "",
      )
    ) {
      toast.error("Please fill at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    if (
      !selectedDocType ||
      (!selectedDocumentName && !customDocName) ||
      !selectedFile
    ) {
      toast.error(
        "All fields are required: Document Type, Document Name, and Document Upload",
      );
      setIsLoading(false);
      return;
    }

    try {
      const tempId = "temp123";

      const educationDetail = {
        tempId: tempId,
        degree: newEducation.degree,
        stream: newEducation.stream,
        score: newEducation.score,
        scoreOutOf: newEducation.scoreOutOf,
        passingYear: newEducation.passingYear,
        boardOrUniversity: newEducation.boardOrUniversity,
      };

      let payload;
      if (selectedDocType?.value === "others") {
        payload = {
          educationDetails: [educationDetail],
          customDocumentName:
            customDocName ||
            `${educationFormik.values.educationDetails[0].degree || ""} - ${
              educationFormik.values.educationDetails[0].stream || ""
            }` ||
            "Others",
          educationDetailTempId: tempId,
          status: "unverified",
        };
      } else {
        payload = {
          educationDetails: [educationDetail],
          documentType: selectedDocType?.value || "",
          documentName:
            selectedDocumentName?.value === "others"
              ? customDocName ||
                (Array.isArray(educationFormik?.values?.educationDetails) &&
                educationFormik.values.educationDetails.length > 0
                  ? `${
                      educationFormik.values.educationDetails[0].degree || ""
                    } - ${
                      educationFormik.values.educationDetails[0].stream || ""
                    }`.trim() || "Others"
                  : "Others")
              : selectedDocumentName?.value || "",
          status: "unverified",
          educationDetailTempId: tempId,
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
          : updateVisitorApplication(formData, id),
      );
      console.log("Response from adding education:", res);
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Education details added successfully");
        setFormData((prev) => ({
          ...prev,
          educationDetails: [
            ...prev.educationDetails,
            res.data?.data?.educationDetails?.[0],
          ],
        }));
        setShowEducationModal(false);
        educationFormik.resetForm();
        setSelectedDocType(null);
        setSelectedDocumentName(null);
        setCustomDocName("");
        setSelectedFile(null);
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error adding education details",
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditEducation = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.educationDetailsIndex;
    const updatedEntry = values.educationDetails[0];
    const educationId = formData.educationDetails[updatedIndex]?._id;
    try {
      const payload = {
        educationDetailId: educationId,
        educationDetailUpdate: updatedEntry,
      };
      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id),
      );
      console.log("Response from editing education:", res);
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Education details updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.educationDetails];
          updatedData[updatedIndex] =
            res.data.data.educationDetails[updatedIndex];
          return { ...prev, educationDetails: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          educationDetails: false,
          educationDetailsIndex: 0,
        }));
        setShowEducationModal(false);
        educationFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error updating education details");
      }
    } catch (error) {
      console.error("Error updating education detail:", error);
      toast.error(
        error?.response?.data?.message || "Error updating education details",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEducation = async (indexToDelete) => {
    const educationDetailId = formData.educationDetails[indexToDelete]?._id;

    if (!educationDetailId) {
      toast.error("Invalid education detail. Cannot delete.");
      return;
    }

    const payload = { educationDetailId };

    try {
      const res = await dispatch(
        mode === "student"
          ? deleteStudentApplication(payload, id)
          : deleteVisitorApplication(payload, id),
      );

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Education details deleted successfully");
        setFormData((prev) => ({
          ...prev,
          educationDetails: prev.educationDetails.filter(
            (_, i) => i !== indexToDelete,
          ),
        }));
        if (
          edit.educationDetails &&
          edit.educationDetailsIndex === indexToDelete
        ) {
          setEdit((prev) => ({
            ...prev,
            educationDetails: false,
            educationDetailsIndex: 0,
          }));
        }
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error deleting education details");
      }
    } catch (error) {
      console.error("Error deleting education detail:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting education details",
      );
    }
  };

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
          <h5>Education Details</h5>
          {userRole !== "Student" &&
            userRole !== "LeadStudent" &&
            canCreate && (
              <Button
                variant="primary"
                className="custom-select-height"
                onClick={() => {
                  educationFormik.resetForm();
                  setEdit((prev) => ({
                    ...prev,
                    educationDetails: false,
                    educationDetailsIndex: 0,
                  }));
                  setShowEducationModal(true);
                }}
              >
                Add New
              </Button>
            )}
        </div>
        <Modal
          show={showEducationModal}
          onHide={() => {
            setShowEducationModal(false);
            educationFormik.resetForm();
            setEdit((prev) => ({
              ...prev,
              educationDetails: false,
              educationDetailsIndex: 0,
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
              {edit.educationDetails
                ? "Update Education Detail"
                : "Add Education Detail"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => {
                setShowEducationModal(false);
                educationFormik.resetForm();
                setEdit((prev) => ({
                  ...prev,
                  educationDetails: false,
                  educationDetailsIndex: 0,
                }));
                setSelectedDocType(null);
                setSelectedDocumentName("");
                setCustomDocName("");
                setSelectedFile(null);
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={educationFormik.handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Degree</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="educationDetails[0].degree"
                    placeholder="Enter Degree"
                    value={educationFormik.values.educationDetails[0].degree}
                    onChange={educationFormik.handleChange}
                    onBlur={educationFormik.handleBlur}
                  />
                  {educationFormik.touched.educationDetails?.[0]?.degree &&
                    educationFormik.errors.educationDetails?.[0]?.degree && (
                      <div className="text-danger">
                        {educationFormik.errors.educationDetails[0].degree}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Stream</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="educationDetails[0].stream"
                    placeholder="Enter Stream"
                    value={educationFormik.values.educationDetails[0].stream}
                    onChange={educationFormik.handleChange}
                    onBlur={educationFormik.handleBlur}
                  />
                  {educationFormik.touched.educationDetails?.[0]?.stream &&
                    educationFormik.errors.educationDetails?.[0]?.stream && (
                      <div className="text-danger">
                        {educationFormik.errors.educationDetails[0].stream}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Score Out Of</Form.Label>
                  <Select
                    options={scoreOutOfOptions}
                    name="educationDetails[0].scoreOutOf"
                    placeholder="Select Score Out Of"
                    className="custom-select-height"
                    value={scoreOutOfOptions.find(
                      (opt) =>
                        opt.value ===
                        educationFormik.values.educationDetails[0].scoreOutOf,
                    )}
                    onChange={(selectedOption) => {
                      educationFormik.setFieldValue(
                        "educationDetails[0].scoreOutOf",
                        selectedOption ? selectedOption.value : "",
                      );
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                    isClearable
                  />
                  {educationFormik.touched.educationDetails?.[0]?.scoreOutOf &&
                    educationFormik.errors.educationDetails?.[0]
                      ?.scoreOutOf && (
                      <div className="text-danger">
                        {educationFormik.errors.educationDetails[0].scoreOutOf}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Score</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="educationDetails[0].score"
                    placeholder="Enter Score"
                    value={educationFormik.values.educationDetails[0].score}
                    onChange={educationFormik.handleChange}
                    onBlur={educationFormik.handleBlur}
                  />
                  {educationFormik.touched.educationDetails?.[0]?.score &&
                    educationFormik.errors.educationDetails?.[0]?.score && (
                      <div className="text-danger">
                        {educationFormik.errors.educationDetails[0].score}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Passing Year</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="educationDetails[0].passingYear"
                    placeholder="Enter Passing Year"
                    value={
                      educationFormik.values.educationDetails[0].passingYear
                    }
                    onChange={educationFormik.handleChange}
                    onBlur={educationFormik.handleBlur}
                  />
                  {educationFormik.touched.educationDetails?.[0]?.passingYear &&
                    educationFormik.errors.educationDetails?.[0]
                      ?.passingYear && (
                      <div className="text-danger">
                        {educationFormik.errors.educationDetails[0].passingYear}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Board/University</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="educationDetails[0].boardOrUniversity"
                    placeholder="Enter Board/University"
                    value={
                      educationFormik.values.educationDetails[0]
                        .boardOrUniversity
                    }
                    onChange={educationFormik.handleChange}
                    onBlur={educationFormik.handleBlur}
                  />
                  {educationFormik.touched.educationDetails?.[0]
                    ?.boardOrUniversity &&
                    educationFormik.errors.educationDetails?.[0]
                      ?.boardOrUniversity && (
                      <div className="text-danger">
                        {
                          educationFormik.errors.educationDetails[0]
                            .boardOrUniversity
                        }
                      </div>
                    )}
                </Col>
                {!edit.educationDetails && (
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
                            borderRadius: "12px",
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
                            borderRadius: "12px",
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
                              educationFormik.values.educationDetails[0]
                                .degree || ""
                            } - ${
                              educationFormik.values.educationDetails[0]
                                .stream || ""
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
                  {edit.educationDetails ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <DataTable
          columns={educationColumns}
          data={canRead ? formData.educationDetails || [] : []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          onEdit={(item, index) => {
            const values = {
              educationDetails: [
                {
                  degree: item.degree || "",
                  stream: item.stream || "",
                  score: item.score || "",
                  scoreOutOf: item.scoreOutOf || "",
                  passingYear: item.passingYear || "",
                  boardOrUniversity: item.boardOrUniversity || "",
                },
              ],
            };
            educationFormik.setValues(values);
            setEdit((prev) => ({
              ...prev,
              educationDetails: true,
              educationDetailsIndex: formData.educationDetails.indexOf(item),
            }));
            setShowEducationModal(true);
          }}
          onDelete={(item) => {
            const index = formData.educationDetails.indexOf(item);
            handleDeleteEducation(index);
          }}
          onUpload={handleDocumentUploadEducation}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
          section="Education Details"
          countryDocuments={countryDocuments}
          oneStudentData={oneStudentData}
        />
      </div>
    </>
  );
};

export default EducationSection;
