import { useState } from "react";
import { updateStudentApplication } from "../../../../../redux/actions/Student/StudentApplication.action";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import Select from "react-select";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FaTrashAlt } from "react-icons/fa";

const OfferLetterProcess = ({
  editState,
  formData,
  id,
  isRestrictedRole,
  userRole,
  setLocalCourses,
  setFormData,
  setIsLoading,
  localCourses,
  handleDocumentUpload,
  setOtherDocName,
  setOtherDocFile,
  fetchStudentData,
  getFilePathsForCourse,
  canCreate,
  canUpdate,
  dispatch,
  isLoading,
  selectedIds,
  selectedSection,
  selectedDocsIds,
  getStatusColor,
  canDelete,
  setSelectedItem,
  setShowDeleteModal,
  handleCheckboxChangeId,
  handleSingleDocumentDownload,
  setSelectedStatus,
  setRemarks,
  setSelectedDocId,
  setShowStatusModal,
  statusOptions,
  sendPendingDocumentMain,
}) => {
  const [offerLetterProcessFilePaths, setOfferLetterProcessFilePaths] =
    useState([]);

  const offerLetterOptions = [
    { value: "Conditional", label: "Conditional Offer Letter" },
    { value: "Unconditional", label: "Unconditional Offer Letter" },
    { value: "Reject", label: "Rejection Letter" },
  ];

  const scholarshipOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const offerLetterFormik = useFormik({
    initialValues: {
      scholarshipAmount: "",
      offerLetterReceived: false,
      scholarshipAvailable: false,
      offerLetterType: "",
      uploadOfferLetter: [],
      offerLetterRemarks: "",
    },
    onSubmit: async (values, { resetForm }) => {
      await handleOfferLetterSubmit(values, resetForm);
    },
  });

  const handleOfferLetterSubmit = async (values, resetForm) => {
    const updatedIndex = editState.interestedCourseIndex;
    const courseId = formData.interestedCourseDetails[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID. Cannot update offer letter.");
      return;
    }

    setIsLoading(true);
    try {
      let documentDetails = null;

      // Upload offer letter files if selected
      if (values.uploadOfferLetter && values.uploadOfferLetter.length > 0) {
        const selectedLabel =
          offerLetterOptions.find((opt) => opt.value === values.offerLetterType)
            ?.label || "Conditional Offer Letter";

        documentDetails = await handleDocumentUpload(
          selectedLabel,
          values.uploadOfferLetter, // Multiple files for uploadOfferLetter
          offerLetterFormik,
        );
        if (!documentDetails) {
          setIsLoading(false);
          return; // Stop if document upload fails
        }
      }

      const interestedCourseUpdate = {
        offerLetterReceived: values.offerLetterReceived || false,
        scholarshipAvailable: values.scholarshipAvailable || false,
        scholarshipAmount:
          values.scholarshipAvailable && values.scholarshipAmount
            ? values.scholarshipAmount
            : "",
        offerLetterType: values.offerLetterType || null,
        offerLetterRemarks: values.offerLetterRemarks || "",
      };

      if (
        Object.keys(interestedCourseUpdate).length === 0 &&
        !documentDetails
      ) {
        toast.warn("No changes to submit.");
        setIsLoading(false);
        return;
      }

      const payload = {
        interestedCourseId: courseId,
        interestedCourseUpdate,
      };

      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          setIsLoading(false);
          return;
        }

        toast.success("Offer letter process updated successfully");

        const updatedCourse = {
          ...localCourses[0],
          offerLetterReceived:
            interestedCourseUpdate.offerLetterReceived ||
            localCourses[0].offerLetterReceived ||
            false,
          scholarshipAmount:
            interestedCourseUpdate.scholarshipAmount ||
            localCourses[0].scholarshipAmount ||
            "",
          offerLetterType:
            interestedCourseUpdate.offerLetterType ||
            localCourses[0].offerLetterType ||
            "",
          scholarshipAvailable:
            interestedCourseUpdate.scholarshipAvailable ||
            localCourses[0].scholarshipAvailable ||
            false,
          document: documentDetails
            ? documentDetails // Store all documents for offer letters
            : localCourses[0].document,
          offerLetterRemarks: documentDetails
            ? documentDetails
            : localCourses[0].offerLetterRemarks || "",
        };

        setLocalCourses([updatedCourse]);

        setFormData({
          ...formData,
          interestedCourseDetails: formData.interestedCourseDetails.map(
            (item, index) => (index === updatedIndex ? updatedCourse : item),
          ),
        });

        resetForm();
        setOtherDocName("");
        setOtherDocFile(null);
        const uploadOfferLetterInput = document.querySelector(
          'input[name="uploadOfferLetter"]',
        );
        if (uploadOfferLetterInput) {
          uploadOfferLetterInput.value = "";
        }
        await fetchStudentData();
      } else {
        toast.error(
          res?.data?.message || "Error updating offer letter process",
        );
      }
    } catch (error) {
      console.error("Error updating offer letter process:", error);
      toast.error(
        error?.response?.data?.message || "Error updating offer letter process",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    offerLetterFormik.setValues({
      scholarshipAmount: localCourses[0]?.scholarshipAmount || "",
      offerLetterType: localCourses[0]?.offerLetterType || "",
      offerLetterReceived: localCourses[0]?.offerLetterReceived || false,
      scholarshipAvailable: localCourses[0]?.scholarshipAvailable || false,
      offerLetterRemarks: localCourses[0]?.offerLetterRemarks || "",
    });
  }, [localCourses]);

  useEffect(() => {
    const courseId = localCourses?.[0]?._id;
    if (courseId) {
      // Offer letter process
      const offerLetterProcessPaths = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        [
          "Conditional Offer Letter",
          "Unconditional Offer Letter",
          "Rejection Letter",
        ],
      );

      setOfferLetterProcessFilePaths(offerLetterProcessPaths);
    }
  }, [localCourses, formData]);

  useEffect(() => {
    if (localCourses[0]) {
      // Offer Letter Process
      offerLetterFormik.setFieldValue(
        "scholarshipAmount",
        localCourses[0]?.scholarshipAmount || "",
      );
      offerLetterFormik.setFieldValue(
        "offerLetterReceived",
        localCourses[0]?.offerLetterReceived || false,
      );
      offerLetterFormik.setFieldValue(
        "scholarshipAvailable",
        localCourses[0]?.scholarshipAvailable || false,
      );
      offerLetterFormik.setFieldValue(
        "offerLetterType",
        localCourses[0]?.offerLetterType || "",
      );
      offerLetterFormik.setFieldValue(
        "offerLetterRemarks",
        localCourses[0]?.offerLetterRemarks || "",
      );
    }
  }, [localCourses]);
  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">Offer Letter Process</h5>
        <div className="d-flex gap-3 align-items-center">
          {offerLetterProcessFilePaths?.length > 0 && (
            <span
              style={{
                color: "green",
                fontSize: "16px",
                letterSpacing: "1px",
              }}
            >
              <strong>Offer Letter Uploaded</strong>
            </span>
          )}
          {/* {offerLetterProcessFilePaths?.length > 0 && (
                        <div className="d-flex gap-2">
                          {offerLetterProcessFilePaths?.map((doc, index) => (
                            <Button
                              key={index}
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
      <div className="bg-white mt-3 p-3 rounded">
        <Form onSubmit={offerLetterFormik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Type of Offer Letter</Form.Label>
              <Select
                name="offerLetterType"
                options={offerLetterOptions}
                value={offerLetterOptions.find(
                  (option) =>
                    option.value === offerLetterFormik.values.offerLetterType,
                )}
                onChange={(selectedOption) => {
                  const value = selectedOption ? selectedOption.value : "";
                  setOtherDocName(selectedOption?.label || "");
                  offerLetterFormik.setFieldValue("offerLetterType", value);
                }}
                onBlur={() => offerLetterFormik.handleBlur("offerLetterType")}
                placeholder="Select Offer Letter Type"
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
                isDisabled={
                  isRestrictedRole ||
                  userRole === "Student" ||
                  userRole === "LeadStudent"
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Upload Offer Letter (Multiple Files)</Form.Label>

              <Form.Control
                type="file"
                name="uploadOfferLetter"
                className="custom-select-height"
                accept="
          image/*,
          application/pdf,
          application/msword,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document,
          application/vnd.ms-excel,
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        "
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files);

                  if (files.length > 0) {
                    const validFiles = [];

                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      "application/vnd.ms-excel",
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    ];

                    for (const file of files) {
                      if (!allowedTypes.includes(file.type)) {
                        toast.error(
                          `File ${file.name} is not a valid file type`,
                        );
                        continue;
                      }

                      if (file.size > 5 * 1024 * 1024) {
                        toast.error(`File ${file.name} must be less than 5MB`);
                        continue;
                      }

                      validFiles.push(file);
                    }

                    if (validFiles.length > 0) {
                      offerLetterFormik.setFieldValue(
                        "uploadOfferLetter",
                        validFiles,
                      );
                      offerLetterFormik.setFieldValue(
                        "offerLetterReceived",
                        true,
                      );
                    } else {
                      offerLetterFormik.setFieldValue("uploadOfferLetter", []);
                      offerLetterFormik.setFieldValue(
                        "offerLetterReceived",
                        false,
                      );
                    }
                  } else {
                    offerLetterFormik.setFieldValue("uploadOfferLetter", []);
                    offerLetterFormik.setFieldValue(
                      "offerLetterReceived",
                      false,
                    );
                  }
                }}
                disabled={
                  userRole === "Student" ||
                  userRole === "LeadStudent" ||
                  isRestrictedRole
                }
                onBlur={() => offerLetterFormik.handleBlur("uploadOfferLetter")}
              />
            </Col>

            {offerLetterFormik.values.offerLetterType !== "Reject" && (
              <Col md={6} className="mb-3">
                <Form.Label>Scholarship Available</Form.Label>
                <Select
                  name="scholarshipAvailable"
                  options={scholarshipOptions}
                  value={scholarshipOptions.find(
                    (option) =>
                      option.value ===
                      offerLetterFormik.values.scholarshipAvailable,
                  )}
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : false;
                    offerLetterFormik.setFieldValue(
                      "scholarshipAvailable",
                      value,
                    );
                    if (!value) {
                      offerLetterFormik.setFieldValue("scholarshipAmount", "");
                    }
                  }}
                  onBlur={() =>
                    offerLetterFormik.handleBlur("scholarshipAvailable")
                  }
                  placeholder="Select Scholarship Availability"
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
                  isDisabled={
                    isRestrictedRole ||
                    userRole === "Student" ||
                    userRole === "LeadStudent"
                  }
                />
              </Col>
            )}
            {offerLetterFormik.values.scholarshipAvailable === true &&
              offerLetterFormik.values.offerLetterType !== "Reject" && (
                <Col md={6} className="mb-3">
                  <Form.Label>Scholarship Amount (₹/$)</Form.Label>
                  <Form.Control
                    type="text"
                    name="scholarshipAmount"
                    value={offerLetterFormik.values.scholarshipAmount || ""}
                    onChange={offerLetterFormik.handleChange}
                    onBlur={offerLetterFormik.handleBlur}
                    placeholder="Enter Scholarship Amount"
                    className="custom-select-height"
                    disabled={
                      isRestrictedRole ||
                      userRole === "Student" ||
                      userRole === "LeadStudent"
                    }
                  />
                </Col>
              )}
            <Col md={6} className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                name="offerLetterRemarks"
                value={offerLetterFormik.values.offerLetterRemarks || ""}
                onChange={offerLetterFormik.handleChange}
                onBlur={offerLetterFormik.handleBlur}
                placeholder="Enter Remarks"
                className="custom-select-height"
                disabled={
                  isRestrictedRole ||
                  userRole === "Student" ||
                  userRole === "LeadStudent"
                }
              />
            </Col>
          </Row>
          {userRole !== "Student" &&
            userRole !== "LeadStudent" &&
            (canCreate || canUpdate) && (
              <div className="d-flex justify-content-end me-3">
                <Button
                  variant="primary"
                  type="submit"
                  className="custom-select-height"
                  disabled={isLoading || isRestrictedRole}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            )}
        </Form>
      </div>
      {offerLetterProcessFilePaths?.length > 0 && (
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
                      const allowedDocuments = [
                        "Conditional Offer Letter",
                        "Unconditional Offer Letter",
                        "Rejection Letter",
                      ];
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
                                disabled={isRestrictedRole}
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
                                {canDelete && (
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
                                )}
                              </td>
                            )}
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-muted text-center">
                      No ZOKEP documents available
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
export default OfferLetterProcess;
