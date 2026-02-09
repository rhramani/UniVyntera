import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Select from "react-select";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { updateStudentApplication } from "../../../../redux/actions/Student/StudentApplication.action";
import { updateVisitorApplication } from "../../../../redux/actions/Visitor/VisitorApplication.action";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import { BASEURL } from "../../../../baseUrl";
import usePermissions from "../../../commonComponents/usePermissions";

const VisaFeePayment = ({
  selectedVisaSection,
  visaFeePaymentFilePaths,
  handleFileChange,
  userRole,
  formData,
  selectedDocsIds,
  getStatusColor,
  handleSingleDocumentDownload,
  id,
  setSelectedStatus,
  statusOptions,
  setRemarks,
  setSelectedDocId,
  setShowModal,
  handleOtherDocUpload,
  setSelectedItem,
  setShowDeleteModal,
  handleCheckboxChangeId,
  sendPendingDocumentMain,
  selectedDocumentNames,
  selectedStatus,
  remarks,
  showModal,
  selectedDocId,
  handleStatusChange,
  handleVisaFlowDocumentUpload,
  fetchOneStudentDetails,
  fetchOneVisitorDetails,
  mode,
}) => {
  const { canCreate, canUpdate } = usePermissions(
    "Student Applications",
    "Visa Application",
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const visaFeePaymentStatusOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Failed", label: "Failed" },
  ];

  const visaFeePaymentFormik = useFormik({
    initialValues: {
      file: null,
      paymentDetails: formData?.visaApplicationDetails?.paymentDetails || "",
      status: formData?.visaApplicationDetails?.feeStatus || "",
    },
    onSubmit: (values, { resetForm }) => {
      handleVisaFeePaymentSubmit(values, resetForm, visaFeePaymentFormik);
    },
  });
  const handleVisaFeePaymentSubmit = async (
    values,
    resetForm,
    formikInstance,
  ) => {
    const isFileUploaded = !!values.file;
    const isPaymentInfoProvided = values.paymentDetails || values.status;

    if (!isFileUploaded && !isPaymentInfoProvided) {
      toast.error("Please upload a payment proof or provide payment details.");
      return;
    }

    setIsLoading(true);
    try {
      let uploadSuccess = true;
      let documentDetails = null;

      if (isFileUploaded) {
        const uploadResult = await handleVisaFlowDocumentUpload(
          "Visa Fee Payment",
          values.file,
          resetForm,
          formikInstance,
        );
        uploadSuccess = uploadResult.success;
        documentDetails = uploadResult.documentDetails;
        if (!uploadSuccess) {
          return;
        }
      }

      let paymentSuccess = true;
      if (isPaymentInfoProvided) {
        const payload = {
          visaApplicationDetails: {
            paymentDetails: values.paymentDetails,
            feeStatus: values.status,
          },
        };

        const res = await dispatch(
          mode === "student"
            ? updateStudentApplication(payload, id)
            : updateVisitorApplication(payload, id),
        );
        if (res?.status !== 200) {
          toast.error(res?.data?.message || "Error updating payment details");
          paymentSuccess = false;
        }
      }

      if (uploadSuccess && paymentSuccess) {
        toast.success("Visa fee payment details updated successfully");
        resetForm({
          values: {
            file: null,
            paymentDetails:
              formData?.visaApplicationDetails?.paymentDetails || "",
            status: formData?.visaApplicationDetails?.feeStatus || "",
          },
        });
        if (mode === "student") {
          await fetchOneStudentDetails();
        } else if (mode === "visitor") {
          await fetchOneVisitorDetails();
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    visaFeePaymentFormik.setValues({
      file: null,
      paymentDetails: formData.visaApplicationDetails.paymentDetails || "",
      status: formData.visaApplicationDetails.feeStatus || "",
    });
  }, [formData]);
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
        <div className="d-flex justify-content-between align-items-center">
          <h5>Visa Fee Payment</h5>
          <div className="d-flex justify-content-end align-items-center gap-3">
            {/* {visaFeePaymentFilePaths?.length > 0 && (
              <div>
                {visaFeePaymentFilePaths?.map((doc, index) => (
                  <Button
                    key={index}
                    variant="primary"
                    className="custom-select-height"
                    onClick={() =>
                      window.open(
                        `${BASEURL}${doc.filePath}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
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

        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={visaFeePaymentFormik.handleSubmit}>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Label>Upload Payment Proof</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  className="custom-select-height"
                  onChange={(e) => handleFileChange(e, visaFeePaymentFormik)}
                  onBlur={() =>
                    visaFeePaymentFormik.setFieldTouched("file", true)
                  }
                  disabled={
                    visaFeePaymentFilePaths?.length > 0 ||
                    userRole === "Student" ||
                    userRole === "LeadStudent"
                  }
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Payment Link or Instruction</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Payment link or instruction"
                  className="custom-select-height"
                  name="paymentDetails"
                  value={visaFeePaymentFormik.values.paymentDetails}
                  onChange={visaFeePaymentFormik.handleChange}
                  onBlur={visaFeePaymentFormik.handleBlur}
                  style={{
                    cursor:
                      userRole === "Student" || userRole === "LeadStudent"
                        ? "not-allowed"
                        : "",
                  }}
                  disabled={
                    userRole === "Student" || userRole === "LeadStudent"
                  }
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>CRM Tracks</Form.Label>
                <Select
                  options={visaFeePaymentStatusOptions}
                  value={
                    visaFeePaymentFormik.values.status
                      ? visaFeePaymentStatusOptions.find(
                          (option) =>
                            option.value === visaFeePaymentFormik.values.status,
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    visaFeePaymentFormik.setFieldValue(
                      "status",
                      selectedOption ? selectedOption.value : "",
                    )
                  }
                  onBlur={() => visaFeePaymentFormik.handleBlur("status")}
                  placeholder="Select Status"
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
                  isClearable
                  isDisabled={
                    userRole === "Student" || userRole === "LeadStudent"
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              )}
          </Form>
        </div>
        {visaFeePaymentFilePaths?.length > 0 && (
          <div className="mb-4 my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-primary mb-0"></h6>
              {userRole !== "Student" && userRole !== "LeadStudent" && (
                <div>
                  {/* {selectedIds[selectedSection]?.length > 0 && (
                            <Button
                            variant="primary"
                            className="custom-select-height me-2"
                            onClick={() =>
                                handleAllDownloadDocument(
                                id,
                                selectedIds[selectedSection]
                                )
                            }
                            >
                            <DownloadIcon />
                            Download Document
                            </Button>
                        )} */}
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
                  >
                    Send Mail
                  </Button>
                </div>
              )}
            </div>
            <div className="table-responsive rounded">
              <Table bordered hover>
                <thead className="thead-light">
                  <tr>
                    {/* {selectedSection !== "all" && (
                                <th>
                                <Form.Check
                                    type="checkbox"
                                    checked={
                                    selectAllByType["rgdocument"] || false
                                    }
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
                        const allowedDocuments = ["Visa Fee Payment"];
                        const selectedCourseId =
                          formData?.visaApplicationDetails?._id;
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
                                                `visadocuments--1-${index}`
                                            ] || false
                                            }
                                            onChange={() =>
                                            handleCheckboxChange(
                                                -1,
                                                index,
                                                "visadocuments",
                                                doc._id,
                                                `visadocuments--1-${index}`
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
                                    //   doc.filePath?.split("/")?.pop() ||
                                    //   "document";
                                    // handleSingleDocumentDownload(
                                    //   id,
                                    //   doc._id,
                                    //   fileName
                                    // );
                                    const filePath = doc?.filePath;
                                    const fileName = filePath
                                      ?.split("/")
                                      ?.pop();
                                    handleSingleDocumentDownload(
                                      filePath,
                                      fileName,
                                    );
                                  }}
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
                                  disabled={
                                    userRole === "Student" ||
                                    userRole === "LeadStudent"
                                  }
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
                                    setShowModal(true);
                                  }}
                                >
                                  {(doc.status === "verified" ||
                                    doc.status === "Verified") && (
                                    <CheckCircleIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
                                    />
                                  )}
                                  {(!doc.status ||
                                    doc.status === "unverified" ||
                                    doc.status === "Unverified") && (
                                    <CancelIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
                                    />
                                  )}
                                  {(doc.status === "reupload" ||
                                    doc.status === "Reupload") && (
                                    <UploadIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
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
                        No US documents available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header className="form-main-heading">
          <Modal.Title>Update Status</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => setShowModal(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="statusSelect">
              <Form.Label>Status</Form.Label>
              <Select
                options={statusOptions}
                value={selectedStatus}
                onChange={(opt) => setSelectedStatus(opt)}
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
              />
            </Form.Group>

            <Form.Group controlId="remarksInput" className="mt-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                className="custom-select-height"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks"
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-primary"
            className="custom-select-height"
            onClick={() => {
              setShowModal(false);
              setSelectedDocId(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="custom-select-height"
            onClick={() => handleStatusChange(selectedDocId)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VisaFeePayment;
