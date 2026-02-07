import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../../commonComponents/DataTable";
import usePermissions from "../../commonComponents/usePermissions";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useState } from "react";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import {
  deleteStudentApplication,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  deleteVisitorApplication,
  updateVisitorApplication,
} from "../../../redux/actions/Visitor/VisitorApplication.action";
import { BASEURL } from "../../../baseUrl";

const workExperienceValidationSchema = Yup.object({
  company: Yup.string(),
  companyAddress: Yup.string(),
  designation: Yup.string(),
  jobType: Yup.string(),
});

const WorkExperience = ({
  formData,
  edit,
  setEdit,
  docTypeOptions,
  handleDocTypeChange,
  selectedDocType,
  documentNames,
  handleDocNameChange,
  selectedDocumentName,
  setSelectedDocType,
  setSelectedFile,
  setSelectedDocumentName,
  setCustomDocName,
  customDocName,
  setFormData,
  fetchOneStudentDetails,
  id,
  selectedFile,
  mode,
  fetchOneVisitorDetails,
  userRole,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Student Applications",
    "Personal Details",
  );

  const workExperienceFormik = useFormik({
    initialValues: {
      workExperience: [
        {
          company: "",
          companyAddress: "",
          designation: "",
          jobType: "",
        },
      ],
    },
    validationSchema: Yup.object({
      workExperience: Yup.array().of(workExperienceValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.workExperience) {
        handleEditWorkExperience(values);
      } else {
        handleWorkExperienceSubmit(values);
      }
    },
  });
  const handleWorkExperienceSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newWork = values.workExperience[currentIndex];

    if (
      !newWork ||
      Object.values(newWork).every(
        (val) => !val || val.toString().trim() === "",
      )
    ) {
      toast.error("Please fill at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const tempId = "temp123";

      const workExperienceDetails = {
        tempId: tempId,
        company: newWork.company,
        companyAddress: newWork.companyAddress,
        designation: newWork.designation,
        jobType: newWork.jobType,
      };

      let payload;
      if (selectedDocType?.value === "others") {
        payload = {
          workExperience: [workExperienceDetails],
          customDocumentName: customDocName || "Others",
          workTempId: tempId,
          status: "unverified",
        };
      } else {
        payload = {
          workExperience: [workExperienceDetails],
          documentType: selectedDocType?.value || "",
          documentName:
            selectedDocumentName?.value === "others"
              ? customDocName || "Others"
              : selectedDocumentName?.value || "",
          status: "unverified",
          workTempId: tempId,
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

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Work experience added successfully");
        setFormData((prev) => ({
          ...prev,
          workExperience: [
            ...prev.workExperience,
            res.data.data.workExperience[0],
          ],
        }));
        setShowWorkModal(false);
        workExperienceFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error adding work experience");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error adding work experience",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWorkExperience = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.workExperienceIndex;
    const updatedEntry = values.workExperience[0];
    const workId = formData.workExperience[updatedIndex]?._id;

    try {
      const payload = {
        workExperienceId: workId,
        workExperienceUpdate: updatedEntry,
      };
      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id),
      );

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Work experience updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.workExperience];
          updatedData[updatedIndex] =
            res.data.data.workExperience[updatedIndex];
          return { ...prev, workExperience: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          workExperience: false,
          workExperienceIndex: 0,
        }));
        setShowWorkModal(false);
        workExperienceFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error updating work experience");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error updating work experience",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkExperience = async (indexToDelete) => {
    const workExperienceId = formData.workExperience[indexToDelete]?._id;

    if (!workExperienceId) {
      toast.error("Invalid work experience detail. Cannot delete.");
      return;
    }

    const payload = {
      workExperienceId,
    };

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
        toast.success("Work experience deleted successfully");
        setFormData((prev) => ({
          ...prev,
          workExperience: prev.workExperience.filter(
            (_, i) => i !== indexToDelete,
          ),
        }));
        if (edit.workExperience && edit.workExperienceIndex === indexToDelete) {
          setEdit((prev) => ({
            ...prev,
            workExperience: false,
            workExperienceIndex: 0,
          }));
        }
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error deleting work experience");
      }
    } catch (error) {
      console.error("Error deleting work experience:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting work experience",
      );
    }
  };

  const workExperienceColumns = [
    { label: "Company", render: (item) => item?.company || "-" },
    { label: "Company Address", render: (item) => item?.companyAddress || "-" },
    { label: "Designation", render: (item) => item?.designation || "-" },
    { label: "Job Type", render: (item) => item?.jobType || "-" },
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
              window.open(
                `${BASEURL}/${item.fileUrl}`,
                "_blank",
                "noopener,noreferrer",
              )
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
          <h5>Work Experience</h5>
          {userRole !== "Student" &&
            userRole !== "LeadStudent" &&
            canCreate && (
              <Button
                variant="primary"
                className="custom-select-height"
                onClick={() => {
                  workExperienceFormik.resetForm();
                  setEdit((prev) => ({
                    ...prev,
                    workExperience: false,
                    workExperienceIndex: 0,
                  }));
                  setShowWorkModal(true);
                }}
              >
                Add New
              </Button>
            )}
        </div>
        <Modal
          show={showWorkModal}
          onHide={() => {
            setShowWorkModal(false);
            workExperienceFormik.resetForm();
            setEdit((prev) => ({
              ...prev,
              workExperience: false,
              workExperienceIndex: 0,
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
              {edit.workExperience
                ? "Update Work Experience"
                : "Add Work Experience"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => {
                setShowWorkModal(false);
                workExperienceFormik.resetForm();
                setEdit((prev) => ({
                  ...prev,
                  workExperience: false,
                  workExperienceIndex: 0,
                }));
                setSelectedDocType(null);
                setSelectedDocumentName("");
                setCustomDocName("");
                setSelectedFile(null);
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={workExperienceFormik.handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name={`workExperience[0].company`}
                    placeholder="Enter Company"
                    value={
                      workExperienceFormik.values.workExperience[0]?.company ||
                      ""
                    }
                    onChange={workExperienceFormik.handleChange}
                    onBlur={workExperienceFormik.handleBlur}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Company Address</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name={`workExperience[0].companyAddress`}
                    placeholder="Enter Company Address"
                    value={
                      workExperienceFormik.values.workExperience[0]
                        ?.companyAddress || ""
                    }
                    onChange={workExperienceFormik.handleChange}
                    onBlur={workExperienceFormik.handleBlur}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name={`workExperience[0].designation`}
                    placeholder="Enter Designation"
                    value={
                      workExperienceFormik.values.workExperience[0]
                        ?.designation || ""
                    }
                    onChange={workExperienceFormik.handleChange}
                    onBlur={workExperienceFormik.handleBlur}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Job Type</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name={`workExperience[0].jobType`}
                    placeholder="Enter Job Type"
                    value={
                      workExperienceFormik.values.workExperience[0]?.jobType ||
                      ""
                    }
                    onChange={workExperienceFormik.handleChange}
                    onBlur={workExperienceFormik.handleBlur}
                  />
                </Col>
                {!edit.workExperience && (
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
                          value={customDocName}
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
                  {edit.workExperience ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <DataTable
          columns={workExperienceColumns}
          data={canRead ? formData.workExperience || [] : []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          onEdit={(item) => {
            const values = {
              workExperience: [
                {
                  company: item.company || "",
                  companyAddress: item.companyAddress || "",
                  designation: item.designation || "",
                  jobType: item.jobType || "",
                },
              ],
            };
            workExperienceFormik.setValues(values);
            setEdit((prev) => ({
              ...prev,
              workExperience: true,
              workExperienceIndex: formData.workExperience.indexOf(item),
            }));
            setShowWorkModal(true);
          }}
          onDelete={(item) => {
            const index = formData.workExperience.indexOf(item);
            handleDeleteWorkExperience(index);
          }}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
        />
      </div>
    </>
  );
};
export default WorkExperience;
