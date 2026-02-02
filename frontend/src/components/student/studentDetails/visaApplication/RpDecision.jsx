import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FaTrashAlt } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { updateStudentApplication } from "../../../../redux/actions/Student/StudentApplication.action";
import { updateVisitorApplication } from "../../../../redux/actions/Visitor/VisitorApplication.action";
import { useRef, useState } from "react";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import { useDispatch } from "react-redux";
import { BASEURL } from "../../../../baseUrl";
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

const RpDecision = ({
  rpDecisionFilePaths,
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
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const rpIssueDateInputRef = useRef(null);
  const [showRPIssueDateCalendar, setShowRPIssueDateCalendar] = useState(false);
  const [rpIssueDateValue, setRPIssueDateValue] = useState(null);
  const [showRPEndDateCalendar, setShowRPEndDateCalendar] = useState(false);
  const [rpEndDateValue, setRPEndDateValue] = useState(null);
  const rpEndDateInputRef = useRef(null);

  const handleRPDecisionSubmit = async (values, { resetForm }) => {
    const isDateProvided =
      values.RP_decisionDate.issueDate ||
      values.RP_decisionDate.endDate ||
      values.RP_decisionDate.remarks;
    const isFileUploaded = !!values.picUpload;

    if (!isDateProvided && !isFileUploaded) {
      toast.error("Please provide at least one date or upload a PIC document.");
      return;
    }

    setIsLoading(true);
    try {
      let uploadSuccess = true;
      let documentDetails = null;

      if (isFileUploaded) {
        const uploadResult = await handleVisaFlowDocumentUpload(
          "PIC Decision",
          values.picUpload,
          resetForm,
          rpDecisionFormik
        );
        uploadSuccess = uploadResult.success;
        documentDetails = uploadResult.documentDetails;
        if (!uploadSuccess) {
          console.error("Document upload failed:", uploadResult.error);
          return;
        }
      }

      let dateSuccess = true;
      if (isDateProvided) {
        if (
          !values.RP_decisionDate.issueDate ||
          !values.RP_decisionDate.endDate
        ) {
          toast.error("Please provide both Issue Date and End Date.");
          return;
        }
        const payload = {
          visaApplicationDetails: {
            RP_decisionDate: {
              issueDate: values.RP_decisionDate.issueDate,
              endDate: values.RP_decisionDate.endDate,
              remarks: values.RP_decisionDate.remarks,
            },
          },
        };

        const res = await dispatch(
          mode === "student"
            ? updateStudentApplication(payload, id)
            : updateVisitorApplication(payload, id)
        );
        if (res?.status !== 200) {
          console.error("API response error:", res?.data);
          toast.error(res?.data?.message || "Error updating RP decision dates");
          dateSuccess = false;
        }
      }

      if (uploadSuccess && dateSuccess) {
        toast.success("RP Decision details updated successfully");
        resetForm({
          values: {
            RP_decisionDate: {
              issueDate:
                formData?.visaApplicationDetails?.RP_decisionDate?.issueDate ||
                "",
              endDate:
                formData?.visaApplicationDetails?.RP_decisionDate?.endDate ||
                "",
              remarks:
                formData?.visaApplicationDetails?.RP_decisionDate?.remarks ||
                "",
            },
            picUpload: null,
          },
        });
        if (mode === "student") {
          await fetchOneStudentDetails();
        } else if (mode === "visitor") {
          await fetchOneVisitorDetails();
        }
      }
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process RP Decision request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const rpDecisionFormik = useFormik({
    initialValues: {
      RP_decisionDate: {
        issueDate:
          formData?.visaApplicationDetails?.RP_decisionDate?.issueDate || "",
        endDate:
          formData?.visaApplicationDetails?.RP_decisionDate?.endDate || "",
        remarks:
          formData?.visaApplicationDetails?.RP_decisionDate?.remarks || "",
      },
      picUpload: null,
    },
    onSubmit: handleRPDecisionSubmit,
    enableReinitialize: true,
  });

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
          <h5>RP Decision</h5>
          <div className="d-flex justify-content-end align-items-center gap-3">
            {/* {rpDecisionFilePaths?.length > 0 && (
              <div>
                {rpDecisionFilePaths?.map((doc, index) => (
                  <Button
                    key={index}
                    variant="primary"
                    className="custom-select-height"
                    onClick={() =>
                      window.open(`${BASEURL}${doc.filePath}`, "_blank", "noopener,noreferrer")
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
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={rpDecisionFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="rpIssueDate">
                  <Form.Label>RP Issue Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="RP_decisionDate.issueDate"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        rpDecisionFormik.values.RP_decisionDate.issueDate
                          ? formatDate(
                              parseDate(
                                rpDecisionFormik.values.RP_decisionDate
                                  .issueDate
                              )
                            )
                          : ""
                      }
                      readOnly
                      ref={rpIssueDateInputRef}
                      onClick={() => {
                        if (rpDecisionFormik.values.RP_decisionDate.issueDate) {
                          setRPIssueDateValue(
                            parseDate(
                              rpDecisionFormik.values.RP_decisionDate.issueDate
                            )
                          );
                        }
                        setShowRPIssueDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                        backgroundColor: "#fff",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
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
                    {showRPIssueDateCalendar && (
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
                          width: 300,
                          minWidth: 300,
                          maxWidth: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            setRPIssueDateValue(selectedDate);
                            rpDecisionFormik.setFieldValue(
                              "RP_decisionDate.issueDate",
                              formatDate(selectedDate)
                            );
                            setShowRPIssueDateCalendar(false);
                          }}
                          value={rpIssueDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="rpEndDate">
                  <Form.Label>RP End Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="RP_decisionDate.endDate"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        rpDecisionFormik.values.RP_decisionDate.endDate
                          ? formatDate(
                              parseDate(
                                rpDecisionFormik.values.RP_decisionDate.endDate
                              )
                            )
                          : ""
                      }
                      readOnly
                      ref={rpEndDateInputRef}
                      onClick={() => {
                        if (rpDecisionFormik.values.RP_decisionDate.endDate) {
                          setRPEndDateValue(
                            parseDate(
                              rpDecisionFormik.values.RP_decisionDate.endDate
                            )
                          );
                        }
                        setShowRPEndDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                        backgroundColor: "#fff",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
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
                    {showRPEndDateCalendar && (
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
                          width: 300,
                          minWidth: 300,
                          maxWidth: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            setRPEndDateValue(selectedDate);
                            rpDecisionFormik.setFieldValue(
                              "RP_decisionDate.endDate",
                              formatDate(selectedDate)
                            );
                            setShowRPEndDateCalendar(false);
                          }}
                          value={rpEndDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group className="mb-4" controlId="remarks">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="RP_decisionDate.remarks"
                    value={rpDecisionFormik.values.RP_decisionDate.remarks}
                    onChange={rpDecisionFormik.handleChange}
                    onBlur={rpDecisionFormik.handleBlur}
                    className="rounded-4"
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>PIC Upload</Form.Label>
                  <Form.Control
                    type="file"
                    name="picUpload"
                    className="custom-select-height"
                    onChange={(e) => handleFileChange(e, rpDecisionFormik)}
                    onBlur={() =>
                      rpDecisionFormik.setFieldTouched("picUpload", true)
                    }
                    disabled={
                      rpDecisionFilePaths?.length > 0 || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-between me-3">
              <div>
                {formData?.visaApplicationDetails?.RP_decisionDate
                  ?.createdByName && (
                  <div>
                    <strong>Created By : </strong>
                    <span>
                      {
                        formData?.visaApplicationDetails?.RP_decisionDate
                          ?.createdByName
                      }
                    </span>
                  </div>
                )}
              </div>
              {userRole !== "Student" && userRole !== "LeadStudent" && (
                <Button
                  variant="primary"
                  type="submit"
                  className="custom-select-height"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </Form>
        </div>
        {rpDecisionFilePaths?.length > 0 && (
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
                          "Please select at least one document to send via mail."
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
                        const allowedDocuments = ["PIC Decision"];
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
                                    //   doc.filePath?.split("/")?.pop() ||
                                    //   "document";
                                    // handleSingleDocumentDownload(
                                    //   id,
                                    //   doc._id,
                                    //   fileName
                                    // );
                                    const filePath = doc?.filePath;
                                          const fileName = filePath?.split("/")?.pop();
                                          handleSingleDocumentDownload(filePath, fileName);
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
                                      doc.status || "unverified"
                                    ),
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "5px 10px",
                                    height: "32px",
                                    width: "100px",
                                    fontSize: "14px",
                                  }}
                                  disabled={userRole === "Student" || userRole === "LeadStudent"}
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
                                    "en-GB"
                                  )
                                : "-"}
                            </td>
                            <td>{doc.remarks || "-"}</td>
                            {userRole !== "Student" && userRole !== "LeadStudent" && (
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

export default RpDecision;
