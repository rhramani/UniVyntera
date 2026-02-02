import { Button, Col, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";
import { useFormik } from "formik";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";
import { FaTrashAlt } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { updateStudentApplication } from "../../../../../redux/actions/Student/StudentApplication.action";

const DepositPaymentSection = ({
  feeStatusOptions,
  canCreate,
  localCourses,
  formData,
  isRestrictedRole,
  userRole,
  editState,
  id,
  getFilePathsForCourse,
  setFormData,
  setOtherDocName,
  setOtherDocFile,
  fetchStudentData,
  currencyCodeData,
  otherDocFile,
  otherDocName,
  handleDocumentUpload,
  setLocalCourses,
  selectedIds,
  selectedSection,
  selectedDocsIds,
  getStatusColor,
  canDelete,
  handleSingleDocumentDownload,
  handleCheckboxChangeId,
  sendPendingDocumentMain,
  setSelectedStatus,
  statusOptions,
  setRemarks,
  setSelectedDocId,
  setShowStatusModal,
  setSelectedItem,
  setShowDeleteModal,
  setIsLoading,
  isLoading
}) => {
  const dispatch = useDispatch();
  const [depositPaymentFilePaths, setDepositPaymentFilePaths] = useState([]);
  const depositPaymentFormik = useFormik({
    initialValues: {
      paymentType: "",
      feeAmount: "",
      feeStatus: "",
      currencyCode: "",
      paymentDocument: null,
      remarks: "",
    },
    onSubmit: async (values, { resetForm }) => {
      await handleDepositPaymentSubmit(values, resetForm);
    },
  });

  // Handle form submission
  const handleDepositPaymentSubmit = async (values, resetForm) => {
    const updatedIndex = editState.interestedCourseIndex;
    const courseId = formData.interestedCourseDetails[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID. Cannot update deposit payment.");
      return;
    }

    if (
      values.feeStatus === "Paid" &&
      (!otherDocFile || otherDocFile.length === 0)
    ) {
      toast.error(
        "Please upload at least one payment document for this fee status."
      );
      return;
    }

    setIsLoading(true);
    try {
      let documentDetails = null;

      if (
        otherDocFile &&
        otherDocFile.length > 0 &&
        otherDocName === "Deposit Payment Proof"
      ) {
        documentDetails = await handleDocumentUpload(
          otherDocName,
          otherDocFile,
          depositPaymentFormik
        );
        if (!documentDetails) {
          setIsLoading(false);
          return;
        }
      }

      const interestedCourseUpdate = {
        depositPayment: {
          paymentType: values.paymentType,
          feeAmount: values.feeAmount,
          feeStatus: values.feeStatus,
          currencyCode: values.currencyCode,
          remarks: values.remarks,
        },
      };

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

        toast.success("Deposit payment updated successfully");

        const updatedCourse = {
          ...localCourses[0],
          depositPayment: {
            ...localCourses[0].depositPayment,
            paymentType: values.paymentType,
            feeAmount: values.feeAmount,
            feeStatus: values.feeStatus,
            currencyCode: values.currencyCode,
            remarks: values.remarks,
          },
          paymentDocument: documentDetails
            ? [...(localCourses[0].paymentDocument || []), ...documentDetails]
            : localCourses[0].paymentDocument,
        };

        setLocalCourses([updatedCourse]);

        setFormData({
          ...formData,
          interestedCourseDetails: formData.interestedCourseDetails.map(
            (item, index) => (index === updatedIndex ? updatedCourse : item)
          ),
        });

        resetForm();
        setOtherDocName("");
        setOtherDocFile(null);
        const paymentDocumentInput = document.querySelector(
          'input[name="paymentDocument"]'
        );
        if (paymentDocumentInput) {
          paymentDocumentInput.value = "";
        }
        depositPaymentFormik.setFieldValue("paymentDocument", null);
        await fetchStudentData();
      } else {
        toast.error(res?.data?.message || "Error updating deposit payment");
      }
    } catch (error) {
      console.error("Error updating deposit payment:", error);
      toast.error(
        error?.response?.data?.message || "Error updating deposit payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localCourses[0]) {
      // Deposit Payment
      depositPaymentFormik.setFieldValue(
        "paymentType",
        localCourses[0]?.depositPayment?.paymentType || ""
      );
      depositPaymentFormik.setFieldValue(
        "feeAmount",
        localCourses[0]?.depositPayment?.feeAmount || ""
      );
      depositPaymentFormik.setFieldValue(
        "feeStatus",
        localCourses[0]?.depositPayment?.feeStatus || ""
      );
      depositPaymentFormik.setFieldValue(
        "currencyCode",
        localCourses[0]?.depositPayment?.currencyCode || ""
      );
      depositPaymentFormik.setFieldValue(
        "remarks",
        localCourses[0]?.depositPayment?.remarks || ""
      );
    }
  }, [localCourses]);
  useEffect(() => {
    const courseId = localCourses?.[0]?._id;
    if (courseId) {
      const depositPaymentPaths = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Deposit Payment Proof"]
      );
      setDepositPaymentFilePaths(depositPaymentPaths);
    }
  }, [localCourses, formData]);

  useEffect(() => {
    depositPaymentFormik.setValues({
      paymentType: localCourses[0]?.depositPayment?.paymentType || "",
      feeAmount: localCourses[0]?.depositPayment?.feeAmount || "",
      feeStatus: localCourses[0]?.depositPayment?.feeStatus || "",
      currencyCode: localCourses[0]?.depositPayment?.currencyCode || "",
      remarks: localCourses[0]?.depositPayment?.remarks || "",
      paymentDocument: null,
    });
  }, [localCourses]);

  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">Deposit Payment</h5>
        <div className="d-flex gap-3 align-items-center">
          {depositPaymentFilePaths?.length > 0 && (
            <span
              style={{
                color: "green",
                fontSize: "16px",
                letterSpacing: "1px",
              }}
            >
              <strong>Payment Document Uploaded</strong>
            </span>
          )}
          {/* {depositPaymentFilePaths?.length > 0 && (
                    <div className="d-flex gap-2">
                      {depositPaymentFilePaths?.map((doc, index) => (
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
        <Form onSubmit={depositPaymentFormik.handleSubmit}>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label>Deposit Payment Method</Form.Label>
              <div className="d-flex mt-3 gap-3">
                <Form.Check
                  inline
                  label="Online"
                  name="paymentType"
                  type="radio"
                  value="Online"
                  checked={
                    depositPaymentFormik.values.paymentType === "Online" ||
                    "online"
                  }
                  onChange={(e) => {
                    depositPaymentFormik.handleChange(e.target.value);
                  }}
                  onBlur={depositPaymentFormik.handleBlur}
                  disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                />
              </div>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Label>Fee Status</Form.Label>
              <Select
                name="feeStatus"
                options={feeStatusOptions}
                value={feeStatusOptions.find(
                  (option) =>
                    option.value === depositPaymentFormik.values.feeStatus
                )}
                onChange={(selectedOption) => {
                  const value = selectedOption ? selectedOption.value : "";
                  depositPaymentFormik.setFieldValue("feeStatus", value);
                  if (value === "Pending") {
                    depositPaymentFormik.setFieldValue("paymentDocument", null);
                    setOtherDocFile(null);
                    setOtherDocName("");
                  }
                }}
                onBlur={() => depositPaymentFormik.handleBlur("feeStatus")}
                placeholder="Select Fee Status"
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
                isDisabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
              />
            </Col>
            {depositPaymentFormik.values.feeStatus === "paid" && (
              <>
                <Col md={3} className="mb-3">
                  <Form.Label>Currency Code</Form.Label>
                  <Select
                    className="custom-select-height"
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
                        (option) =>
                          option.value ===
                          depositPaymentFormik.values.currencyCode
                      )}
                    onChange={(selectedOption) =>
                      depositPaymentFormik.setFieldValue(
                        "currencyCode",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    placeholder="Select Currency"
                    isClearable
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: "30px",
                        color: "black",
                        minWidth: "160px",
                        border: state.isFocused ? "1px" : base.border,
                        borderColor: state.isFocused
                          ? "#3B3665"
                          : base.borderColor,
                        boxShadow: state.isFocused
                          ? "0 0 0 1px #6C63FF"
                          : base.boxShadow,
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                    isDisabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Label>Fee Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="feeAmount"
                    value={depositPaymentFormik.values.feeAmount || ""}
                    onChange={depositPaymentFormik.handleChange}
                    onBlur={depositPaymentFormik.handleBlur}
                    placeholder="Enter Fee Amount"
                    className="custom-select-height"
                    disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                  />
                </Col>
              </>
            )}
            <Col md={3} className="mb-3">
              <Form.Label>Upload Payment Document</Form.Label>

              <Form.Control
                type="file"
                name="paymentDocument"
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
                onChange={(e) => {
                  const files = e.target.files;

                  if (files && files.length > 0) {
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

                    const validFiles = Array.from(files).filter((file) => {
                      if (!allowedTypes.includes(file.type)) {
                        toast.error(`❌ ${file.name} is not a valid file type`);
                        return false;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error(`❌ ${file.name} must be less than 5MB`);
                        return false;
                      }
                      return true;
                    });

                    if (validFiles.length > 0) {
                      setOtherDocFile(validFiles);
                      depositPaymentFormik.setFieldValue(
                        "paymentDocument",
                        validFiles
                      );
                      setOtherDocName("Deposit Payment Proof");
                    } else {
                      setOtherDocFile(null);
                      depositPaymentFormik.setFieldValue(
                        "paymentDocument",
                        null
                      );
                      setOtherDocName("");
                    }
                  } else {
                    setOtherDocFile(null);
                    depositPaymentFormik.setFieldValue("paymentDocument", null);
                    setOtherDocName("");
                  }
                }}
                onBlur={() =>
                  depositPaymentFormik.handleBlur("paymentDocument")
                }
                disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
              />

              {depositPaymentFormik.errors.paymentDocument &&
                depositPaymentFormik.touched.paymentDocument && (
                  <div
                    className="text-danger"
                    style={{ fontSize: "12px", marginTop: "5px" }}
                  >
                    {depositPaymentFormik.errors.paymentDocument}
                  </div>
                )}
            </Col>
            <Col md={8} className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="remarks"
                value={depositPaymentFormik.values.remarks || ""}
                onChange={depositPaymentFormik.handleChange}
                onBlur={depositPaymentFormik.handleBlur}
                placeholder="Enter Remarks"
                // className="custom-select-height"
                disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
              />
            </Col>
          </Row>
          {userRole !== "Student" && userRole !== "LeadStudent" && (canCreate || canUpdate) && (
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
      {depositPaymentFilePaths?.length > 0 && (
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
                        "Please select at least one document to send via mail."
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
                  {userRole !== "B2B Admin" &&
                    userRole !== "B2B Member" &&
                    userRole !== "Student" && userRole !== "LeadStudent" && <th>Document Pendency</th>}
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
                      const allowedDocuments = ["Deposit Payment Proof"];
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
                          {userRole !== "B2B Admin" &&
                            userRole !== "B2B Member" &&
                            userRole !== "Student" && userRole !== "LeadStudent" && (
                              <td>
                                <div className="form-check form-switch custom-toggle-button me-0">
                                  <input
                                    className="form-check-input three-dots-icon"
                                    type="checkbox"
                                    id={`toggle-${doc._id}-${index}`}
                                    checked={selectedDocsIds?.includes(
                                      `${doc._id}-${index}`
                                    )}
                                    onChange={() =>
                                      handleCheckboxChangeId(
                                        `${doc._id}-${index}`,
                                        docName
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
                                    docName
                                  )
                                }
                                className="custom-select-height"
                                disabled={userRole === "Student" || userRole === "LeadStudent"}
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
                                    fileName
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
                                    doc.status || "unverified"
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
                                        (doc.status || "unverified")
                                    ) ||
                                      statusOptions.find(
                                        (opt) => opt.value === "unverified"
                                      )
                                  );
                                  setRemarks(doc.remarks || "");
                                  setSelectedDocId(doc._id);
                                  setShowStatusModal(true);
                                }}
                                disabled={
                                  isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"
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
                                  "en-GB"
                                )
                              : "-"}
                          </td>
                          <td>{doc.remarks || "-"}</td>
                          {userRole !== "Student" && userRole !== "LeadStudent" && (
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
                      No deposit payment documents available
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
export default DepositPaymentSection;
