import { useFormik } from "formik";
import { updateStudentApplication } from "../../../../../redux/actions/Student/StudentApplication.action";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Row, Col, Table } from "react-bootstrap";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FaTrashAlt } from "react-icons/fa";
import DownloadIcon from "@mui/icons-material/Download";
import Select from "react-select";

const ApplicationSubmission = ({
  userRole,
  interestedCourseFormik,
  isRestrictedRole,
  localCourses,
  id,
  fetchStudentData,
  editState,
  formData,
  setIsLoading,
  handleDocumentUpload,
  dispatch,
  setLocalCourses,
  setFormData,
  handleAllDownloadDocument,
  handleSingleDocumentDownload,
  getFilePathsForCourse,
  selectedIds,
  selectedSection,
  selectedDocumentNames,
  selectedDocsIds,
  handleCheckboxChangeId,
  setSelectedStatus,
  handleOtherDocUpload,
  getStatusColor,
  setSelectedItem,
  setShowDeleteModal,
  setRemarks,
  setSelectedDocId,
  setShowStatusModal,
  statusOptions,
  handleUpdateApplicationStatus,
  sendPendingDocumentMain,
}) => {
  const [proofUploadStatus, setProofUploadStatus] = useState("");
  const [applicationSubmissionFilePaths, setApplicationSubmissionFilePaths] =
    useState([]);
  const documentStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Uploaded", label: "Uploaded" },
  ];
  const applicationSubmissionFormik = useFormik({
    initialValues: {
      proofDocument: null,
      applicationSubmissionRemarks:
        localCourses?.[0]?.applicationSubmissionRemarks || "",
    },
    onSubmit: async (values, { resetForm }) => {
      await handleApplicationSubmission(values, resetForm);
    },
  });
  const handleApplicationSubmission = async (values, resetForm) => {
    const updatedIndex = editState.interestedCourseIndex;
    const courseId = formData.interestedCourseDetails?.[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID");
      return;
    }

    // 🔑 At least one should be present
    if (!values.proofDocument && !values.applicationSubmissionRemarks?.trim()) {
      toast.error("Please upload document or enter remarks");
      return;
    }

    setIsLoading(true);
    try {
      let documentUploaded = false;

      // ✅ 1️⃣ Upload document ONLY if exists
      if (values.proofDocument) {
        const documentDetails = await handleDocumentUpload(
          "Application Submission Form",
          [values.proofDocument],
          applicationSubmissionFormik,
        );

        if (!documentDetails) {
          setIsLoading(false);
          return;
        }

        documentUploaded = true;
      }

      // ✅ 2️⃣ Prepare update payload (remarks optional)
      const interestedCourseUpdate = {
        ...(documentUploaded && {
          applicationSubmissionForm: "Uploaded",
        }),
        ...(values.applicationSubmissionRemarks && {
          applicationSubmissionRemarks: values.applicationSubmissionRemarks,
        }),
      };

      // ✅ 3️⃣ API CALL (ALWAYS)
      const payload = {
        interestedCourseId: courseId,
        interestedCourseUpdate,
      };

      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        toast.success("Application submission updated successfully");

        const updatedCourse = {
          ...localCourses[0],
          ...interestedCourseUpdate,
        };

        setLocalCourses([updatedCourse]);

        setFormData((prev) => ({
          ...prev,
          interestedCourseDetails: prev.interestedCourseDetails.map(
            (item, idx) => (idx === updatedIndex ? updatedCourse : item),
          ),
        }));

        resetForm();
        await fetchStudentData();
      } else {
        toast.error(
          res?.data?.message || "Error updating application submission",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (localCourses[0]) {
      const currentDocumentStatus =
        localCourses[0]?.applicationSubmissionForm || "Pending";
      // Application Submission Form
      const documentOption =
        documentStatusOptions?.find(
          (opt) => opt.value === currentDocumentStatus,
        ) || documentStatusOptions[0];
      setProofUploadStatus(documentOption);
      interestedCourseFormik.setFieldValue(
        "applicationSubmissionForm",
        documentOption.value,
      );
      applicationSubmissionFormik.setFieldValue(
        "applicationSubmissionRemarks",
        localCourses[0]?.applicationSubmissionRemarks || "",
      );
    }
  }, [localCourses]);
  useEffect(() => {
    const courseId = localCourses?.[0]?._id;
    if (courseId) {
      const appSubmissionPaths = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Application Submission Form"],
      );
      setApplicationSubmissionFilePaths(appSubmissionPaths);

      if (appSubmissionPaths?.length > 0) {
        setProofUploadStatus({ value: "Uploaded", label: "Uploaded" });
        interestedCourseFormik.setFieldValue(
          "applicationSubmissionForm",
          "Uploaded",
        );
      }
    }
  }, [localCourses, formData]);
  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <div className="d-flex justify-content-between">
        <h5>Application Submission</h5>
        <div className="d-flex justify-content-end gap-3">
          {applicationSubmissionFilePaths?.length > 0 && (
            <span
              style={{
                color: "green",
                fontSize: "16px",
                letterSpacing: "1px",
              }}
            >
              <strong>Proof Document Uploaded</strong>
            </span>
          )}
          {userRole !== "Student" && userRole !== "LeadStudent" && (
            <Select
              options={documentStatusOptions}
              value={proofUploadStatus}
              onChange={(selectedOption) => {
                const option = selectedOption || documentStatusOptions[0];
                setProofUploadStatus(option);
                interestedCourseFormik.setFieldValue(
                  "applicationSubmissionForm",
                  option.value,
                );
                handleUpdateApplicationStatus(
                  "applicationSubmissionForm",
                  option.value,
                );
              }}
              placeholder="Select Status"
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
              isDisabled={isRestrictedRole}
            />
          )}
        </div>
      </div>
      <div>
        <div className="bg-white mt-3 p-3 gap-2 rounded">
          <Form onSubmit={applicationSubmissionFormik.handleSubmit}>
            <Row>
              {/* Upload Proof Document */}
              <Col md={6} className="mb-3">
                <Form.Label>Upload Proof Document</Form.Label>
                <Form.Control
                  type="file"
                  name="proofDocument"
                  className="custom-select-height"
                  accept="
          image/*,
          application/pdf,
          application/msword,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document,
          application/vnd.ms-excel,
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        "
                  onChange={(e) =>
                    applicationSubmissionFormik.setFieldValue(
                      "proofDocument",
                      e.currentTarget.files[0],
                    )
                  }
                />
              </Col>

              {/* Remarks */}
              <Col md={6} className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  type="text"
                  name="applicationSubmissionRemarks"
                  value={
                    applicationSubmissionFormik.values
                      .applicationSubmissionRemarks
                  }
                  onChange={applicationSubmissionFormik.handleChange}
                  placeholder="Enter remarks"
                  className="custom-select-height"
                  disabled={
                    isRestrictedRole ||
                    userRole === "Student" ||
                    userRole === "LeadStudent"
                  }
                />
              </Col>
            </Row>

            {userRole !== "Student" && userRole !== "LeadStudent" && (
              <div className="d-flex justify-content-end me-3">
                <Button
                  variant="primary"
                  type="submit"
                  className="custom-select-height"
                  disabled={isRestrictedRole}
                >
                  Submit
                </Button>
              </div>
            )}
          </Form>
          {/* <Button
                        variant="primary"
                        className="custom-select-height"
                        style={{ width: "100px" }}
                        onClick={handleDocumentUpload}
                        disabled={applicationSubmissionFilePaths?.length > 0}
                      >
                        {isLoading ? (
                          "Uploading..."
                        ) : (
                          <>
                            <FaUpload size={14} className="mb-1 me-1" /> Upload
                          </>
                        )}
                      </Button> */}
          {/* {applicationSubmissionFilePaths?.length > 0 && (
                        <div className="mt-3">
                          {applicationSubmissionFilePaths?.map((doc, index) => (
                            <Button
                              variant="primary"
                              className="custom-select-height"
                              onClick={() => {
                                window.open(
                                  `${BASEURL}/${doc.filePath}`,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }}
                              disabled={isRestrictedRole}
                            >
                              <VisibilityIcon
                                className="me-1"
                                style={{ fontSize: "16px" }}
                              />
                              View
                            </Button>
                          ))}
                        </div>
                      )} */}
        </div>
      </div>
      {applicationSubmissionFilePaths?.length > 0 && (
        <div className="mb-4 my-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-primary mb-0"></h6>
            <div>
              {selectedIds[selectedSection]?.length > 0 && (
                <Button
                  variant="primary"
                  className="custom-select-height me-2"
                  onClick={() =>
                    handleAllDownloadDocument(id, selectedIds[selectedSection])
                  }
                  disabled={isRestrictedRole}
                >
                  <DownloadIcon />
                  Download Document
                </Button>
              )}
              {userRole !== "Student" && userRole !== "LeadStudent" && (
                <Button
                  variant="primary"
                  className="custom-select-height"
                  onClick={() => {
                    if (selectedDocsIds?.length > 0) {
                      sendPendingDocumentMain(id, selectedDocumentNames);
                    } else {
                      toast.error(
                        "Please select at least one document to send via mail.",
                      );
                    }
                  }}
                  disabled={isRestrictedRole}
                >
                  Send Mail
                </Button>
              )}
            </div>
          </div>
          <div className="table-responsive rounded">
            <Table bordered hover>
              <thead className="thead-light">
                <tr>
                  {/* {selectedSection !== "all" && (
                                <th>
                                  <Form.Check
                                    type="checkbox"
                                    checked={selectAllByType["rgdocument"] || false}
                                    onChange={() =>
                                      handleSelectAllChange(-1, "rgdocument")
                                    }
                                    className="custom-checkbox"
                                  />
                                </th>
                              )} */}
                  {userRole !== "B2B Admin" &&
                    userRole !== "B2B Member" &&
                    userRole !== "Student" &&
                    userRole !== "LeadStudent" && <th>Document Pendency</th>}
                  <th>Sr No</th>
                  <th>Document Name</th>
                  <th>Upload File</th>
                  <th>Download</th>
                  <th>Status</th>
                  <th>Added By</th>
                  <th>Added On</th>
                  <th>Remarks</th>
                  {userRole !== "Student" && userRole !== "LeadStudent" && (
                    <th className="sticky-col-right-last">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {formData?.uploadedDocumentDetails?.length > 0 ? (
                  formData.uploadedDocumentDetails
                    ?.filter((doc) => {
                      const allowedDocuments = ["Application Submission Form"];
                      const selectedCourseId =
                        formData?.interestedCourseDetails?.[
                          editState.interestedCourseIndex
                        ]?._id;
                      return (
                        doc.customDocumentName &&
                        allowedDocuments.includes(doc.customDocumentName) &&
                        doc.ref_module === selectedCourseId
                      );
                    })
                    ?.map((doc, index) => {
                      const docName =
                        doc.customDocumentName ||
                        doc.documentName ||
                        "Unnamed Document";
                      return (
                        <tr key={doc._id}>
                          {/* {selectedSection !== "all" && (
                                        <td>
                                          <Form.Check
                                            type="checkbox"
                                            checked={
                                              selectedRows[
                                                `rgdocument--1-${index}`
                                              ] || false
                                            }
                                            onChange={() =>
                                              handleCheckboxChange(
                                                -1,
                                                index,
                                                "rgdocument",
                                                doc._id,
                                                `rgdocument--1-${index}`
                                              )
                                            }
                                            disabled={doc.status === "Reupload"}
                                            className="custom-checkbox"
                                          />
                                        </td>
                                      )} */}
                          {userRole !== "B2B Admin" &&
                            userRole !== "B2B Member" &&
                            userRole !== "Student" &&
                            userRole !== "LeadStudent" && (
                              <td>
                                <div className="form-check form-switch custom-toggle-button me-0">
                                  <input
                                    className="form-check-input three-dots-icon"
                                    type="checkbox"
                                    id={`toggle-${doc._id}-${index}`}
                                    checked={selectedDocsIds?.includes(
                                      `${doc._id}-${index}`,
                                    )}
                                    onChange={() =>
                                      handleCheckboxChangeId(
                                        `${doc._id}-${index}`,
                                        docName,
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            )}
                          <td>{index + 1}</td>
                          <td>{docName}</td>
                          <td>
                            {doc.status !== "Reupload" ? (
                              <span className="text-success me-2">
                                {doc.filePath?.split("/")?.pop() || "No File"}
                              </span>
                            ) : (
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) =>
                                  handleOtherDocUpload(
                                    e,
                                    index,
                                    doc._id,
                                    docName,
                                  )
                                }
                                className="custom-select-height"
                                disabled={
                                  userRole === "Student" ||
                                  userRole === "LeadStudent"
                                }
                              />
                            )}
                          </td>
                          <td>
                            {doc.status !== "Reupload" ? (
                              <button
                                className="btn btn-sm fw-normal rounded-4"
                                style={{
                                  cursor: "pointer",
                                  color: "#fff",
                                  backgroundColor: "#007bff",
                                  height: "32px",
                                  width: "100px",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // const fileName =
                                  //   doc.filePath
                                  //     ?.split("/")
                                  //     ?.pop() || "document";
                                  // handleSingleDocumentDownload(
                                  //   id,
                                  //   doc._id,
                                  //   fileName
                                  // );
                                  const filePath = doc?.filePath;
                                  const fileName = filePath?.split("/")?.pop();

                                  handleSingleDocumentDownload(
                                    filePath,
                                    fileName,
                                  );
                                }}
                                // disabled={isRestrictedRoleForDownload}
                              >
                                <DownloadIcon />
                                Download
                              </button>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td>
                            {doc ? (
                              <button
                                className="btn btn-sm fw-normal d-flex align-items-center justify-content-center rounded-4"
                                style={{
                                  cursor: "pointer",
                                  color: "#fff",
                                  backgroundColor: getStatusColor(
                                    doc.status || "unverified",
                                  ),
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "5px 10px",
                                  height: "32px",
                                  width: "100px",
                                  fontSize: "14px",
                                }}
                                onClick={() => {
                                  setSelectedStatus(
                                    statusOptions.find(
                                      (opt) =>
                                        opt.value ===
                                        (doc.status || "unverified"),
                                    ) ||
                                      statusOptions.find(
                                        (opt) => opt.value === "unverified",
                                      ),
                                  );
                                  setRemarks(doc.remarks || "");
                                  setSelectedDocId(doc._id);
                                  setShowStatusModal(true);
                                }}
                                disabled={
                                  isRestrictedRole ||
                                  userRole === "Student" ||
                                  userRole === "LeadStudent"
                                }
                              >
                                {(doc.status === "verified" ||
                                  doc.status === "Verified") && (
                                  <CheckCircleIcon
                                    className="me-1"
                                    style={{ fontSize: "16px" }}
                                  />
                                )}
                                {(!doc.status ||
                                  doc.status === "unverified" ||
                                  doc.status === "Unverified") && (
                                  <CancelIcon
                                    className="me-1"
                                    style={{ fontSize: "16px" }}
                                  />
                                )}
                                {(doc.status === "reupload" ||
                                  doc.status === "Reupload") && (
                                  <UploadIcon
                                    className="me-1"
                                    style={{ fontSize: "16px" }}
                                  />
                                )}
                                {doc.status
                                  ? doc.status.charAt(0).toUpperCase() +
                                    doc.status.slice(1)
                                  : "Unverified"}
                              </button>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td>{doc.createdByName || "-"}</td>
                          <td>
                            {doc.createdAt
                              ? new Date(doc.createdAt).toLocaleDateString(
                                  "en-GB",
                                )
                              : "-"}
                          </td>
                          <td>{doc.remarks || "-"}</td>
                          {userRole !== "Student" &&
                            userRole !== "LeadStudent" && (
                              <td className="sticky-col-right-last">
                                <Button
                                  variant="link"
                                  className="text-danger"
                                  style={{ fontSize: "18px" }}
                                  onClick={() => {
                                    setSelectedItem(doc._id);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Delete"
                                  disabled={isRestrictedRole}
                                >
                                  <FaTrashAlt />
                                </Button>
                              </td>
                            )}
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-muted text-center">
                      No RG documents available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
export default ApplicationSubmission;
