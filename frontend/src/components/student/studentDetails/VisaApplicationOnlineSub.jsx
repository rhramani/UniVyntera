import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FaTrashAlt } from "react-icons/fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { toast } from "react-toastify";
import usePermissions from "../../commonComponents/usePermissions";

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

const VisaApplicationOnlineSub = ({
  visaApplicationFilePaths,
  visaApplicationSubmissionFormik,
  isLoading,
  handleFileChange,
  userRole,
  formData,
  selectedDocsIds,
  DownloadIcon,
  getStatusColor,
  setSelectedItem,
  setShowDeleteModal,
  setSelectedStatus,
  statusOptions,
  setRemarks,
  setSelectedDocId,
  showModal,
  setShowModal,
  handleOtherDocUpload,
  handleSingleDocumentDownload,
  id,
  handleCheckboxChangeId,
  sendPendingDocumentMain,
  selectedDocumentNames,
  selectedStatus,
  remarks,
  handleStatusChange,
  selectedDocId,
}) => {
  const { canCreate, canUpdate } = usePermissions(
    "Student Applications",
    "Visa Application",
  );
  // Calendar state variables
  const [showSubmissionDateCalendar, setShowSubmissionDateCalendar] =
    useState(false);
  const [submissionDateValue, setSubmissionDateValue] = useState(null);
  const submissionDateInputRef = useRef(null);

  return (
    <>
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Visa Application Online Submission</h5>
          {/* <div className="d-flex justify-content-end align-items-center gap-3">
            {visaApplicationFilePaths?.length > 0 && (
              <div>
                {visaApplicationFilePaths?.map((doc, index) => (
                  <Button
                    key={index}
                    variant="primary"
                    className="custom-select-height"
                    onClick={() =>
                      window.open(doc.filePath, "_blank", "noopener,noreferrer")
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
            )}
          </div> */}
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={visaApplicationSubmissionFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Visa Application Submission Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="visaOnlineSubmission.date"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        visaApplicationSubmissionFormik.values
                          .visaOnlineSubmission?.date
                          ? formatDate(
                              parseDate(
                                visaApplicationSubmissionFormik.values
                                  .visaOnlineSubmission?.date,
                              ),
                            )
                          : ""
                      }
                      readOnly
                      ref={submissionDateInputRef}
                      onClick={() => {
                        if (
                          visaApplicationSubmissionFormik.values
                            .visaOnlineSubmission?.date
                        ) {
                          setSubmissionDateValue(
                            parseDate(
                              visaApplicationSubmissionFormik.values
                                .visaOnlineSubmission?.date,
                            ),
                          );
                        }
                        setShowSubmissionDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent"
                            ? "not-allowed"
                            : "pointer",
                        backgroundColor: "#fff",
                      }}
                      disabled={
                        userRole === "Student" || userRole === "LeadStudent"
                      }
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
                    {showSubmissionDateCalendar && (
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
                            setSubmissionDateValue(selectedDate);
                            visaApplicationSubmissionFormik.setFieldValue(
                              "visaOnlineSubmission.date",
                              formatDate(selectedDate),
                            );
                            setShowSubmissionDateCalendar(false);
                          }}
                          value={submissionDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Application Submission</Form.Label>
                  <Form.Control
                    type="file"
                    name="applicationSubmission"
                    multiple
                    className="custom-select-height"
                    onChange={(e) =>
                      handleFileChange(e, visaApplicationSubmissionFormik)
                    }
                    onBlur={() =>
                      visaApplicationSubmissionFormik.setFieldTouched(
                        "applicationSubmission",
                        true,
                      )
                    }
                    disabled={
                      // visaApplicationFilePaths?.length > 0 ||
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end me-3">
              {userRole !== "Student" &&
                userRole !== "LeadStudent" &&
                (canCreate || canUpdate) && (
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
        {visaApplicationFilePaths?.length > 0 && (
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
                      userRole !== "LeadStudent" && <th>For Mail Send</th>}
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
                          "Visa Application Submission",
                        ];
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

export default VisaApplicationOnlineSub;
