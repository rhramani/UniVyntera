import { Button, Form, Modal, Table } from "react-bootstrap";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UploadIcon from "@mui/icons-material/Upload";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  downloadDocument,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import { useDispatch } from "react-redux";

const getStatusColor = (status) => {
  switch (status) {
    case "verified":
      return "#28a745";
    case "unverified":
      return "#ffc107";
    case "Reupload":
      return "#dc3545";
    default:
      return "#6c757d";
  }
};

const Document = ({
  id,
  selectedIds,
  countryDocuments,
  canCreate,
  canDelete,
  selectAllByType,
  otherDocuments,
  showOtherDocModal,
  reuploadDocIndex,
  handleOtherDocSubmit,
  otherDocName,
  showModal,
  selectedStatus,
  statusOptions,
  remarks,
  setOtherDocName,
  setReuploadDocIndex,
  setShowOtherDocModal,
  setOtherDocFile,
  selectedRows,
  //   handleSingleDocumentDownload,
  setSelectedStatus,
  setRemarks,
  setSelectedDocId,
  setShowModal,
  handleStatusChange,
  selectedDocId,
  //   handleOtherDocUpload,
  fetchOneStudentDetails,
  handleRemoveDocument,
  handleSelectAllChange,
  handleCheckboxChange,
  handleAllDownloadDocument,
  oneStudentData,
  handleDocumentUpload
}) => {
  const dispatch = useDispatch();

  const handleSingleDocumentDownload = async (applicationId, documentId) => {
    try {
      const res = await dispatch(downloadDocument(applicationId, documentId));

      if (res?.status === 200) {
        const contentType =
          res.headers["content-type"] || "application/octet-stream";
        const blob = new Blob([res.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        let fileName = "document";
        const contentDisposition = res.headers["content-disposition"];
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        } else {
          if (contentType.includes("image/jpeg")) {
            fileName = "downloaded_image.jpg";
          } else if (contentType.includes("image/png")) {
            fileName = "downloaded_image.png";
          } else if (contentType.includes("image/gif")) {
            fileName = "downloaded_image.gif";
          } else {
            fileName = "downloaded_image.unknown";
          }
        }

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Image downloaded successfully");
      } else {
        toast.error(res?.data?.message || "Error downloading image");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "No valid documents found");
    }
  };

  const handleOtherDocUpload = async (e, index, documentId) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("uploadedDocument", file);
      uploadFormData.append("documentId", documentId);

      const res = await dispatch(updateStudentApplication(uploadFormData, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
        } else {
          toast.success("File uploaded successfully");
          await fetchOneStudentDetails();
        }
      } else {
        toast.error(res?.data?.message || "Error uploading document");
      }
      setReuploadDocIndex(index);
    } catch (error) {
      toast.error("Error preparing file for reupload");
    }
  };

  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h5 style={{ lineHeight: "40px" }}>Document List</h5>
        <div>
          {selectedIds.length > 0 && (
            <Button
              variant="primary"
              className="custom-select-height me-2"
              onClick={() => handleAllDownloadDocument(id, selectedIds)}
            >
              <DownloadIcon />
              Download Document
            </Button>
          )}
        </div>
      </div>

      {countryDocuments?.data?.[0]?.documents?.length > 0 ? (
        countryDocuments.data[0].documents.map((doc, docIndex) => {
          const typeKey = doc.type?.name || `UnnamedType_${docIndex}`;
          return (
            <div key={docIndex} className="mb-4">
              <h6 className="mb-3 text-primary">
                {doc.type?.name || "Unnamed Document Type"}
              </h6>
              <div className="table-responsive">
                <Table bordered hover>
                  <thead className="thead-light">
                    <tr>
                      <th>
                        <Form.Check
                          type="checkbox"
                          checked={selectAllByType[typeKey] || false}
                          onChange={() =>
                            handleSelectAllChange(docIndex, typeKey)
                          }
                          className="custom-checkbox"
                        />
                      </th>
                      <th>Sr No</th>
                      <th>Document Name</th>
                      <th>Upload File</th>
                      <th>Download</th>
                      <th>Status</th>
                      <th>Added By</th>
                      <th>Added On</th>
                      <th>Remarks</th>
                      <th className="sticky-col-right-last">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.documentList?.length > 0 ? (
                      doc.documentList.map((document, index) => {
                        const uploadedDoc =
                          oneStudentData?.uploadedDocumentDetails?.find(
                            (uploaded) => uploaded.documentName === document._id
                          );
                        const uploadedDocIndex =
                          oneStudentData?.uploadedDocumentDetails?.findIndex(
                            (uploaded) => uploaded.documentName === document._id
                          );
                        return (
                          <tr key={index}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={
                                  selectedRows[`${docIndex}-${index}`] || false
                                }
                                onChange={() =>
                                  handleCheckboxChange(docIndex, index, typeKey)
                                }
                                disabled={!uploadedDoc}
                                className="custom-checkbox"
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{document.name || "Unnamed Document"}</td>
                            <td>
                              {uploadedDoc &&
                              uploadedDoc.status !== "Reupload" ? (
                                <div className="d-flex align-items-center">
                                  <span className="text-success me-2">
                                    {uploadedDoc.filePath?.split("\\")?.pop()}
                                  </span>
                                </div>
                              ) : (
                                <Form.Group
                                  controlId={`upload-${docIndex}-${index}`}
                                  className="mb-0"
                                >
                                  {(canCreate || canUpdate) && (
                                    <Form.Control
                                      type="file"
                                      accept="image/*,application/pdf"
                                      onChange={(e) =>
                                        handleDocumentUpload(e, docIndex, index)
                                      }
                                      className="custom-select-height"
                                      style={{
                                        width: "250px",
                                      }}
                                    />
                                  )}
                                </Form.Group>
                              )}
                            </td>
                            <td>
                              {uploadedDoc &&
                              uploadedDoc.status !== "Reupload" ? (
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
                                    handleSingleDocumentDownload(
                                      id,
                                      uploadedDoc._id
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
                              {uploadedDoc ? (
                                <button
                                  className="btn btn-sm fw-normal d-flex align-items-center justify-content-center rounded-4"
                                  style={{
                                    cursor: "pointer",
                                    color: "#fff",
                                    backgroundColor: getStatusColor(
                                      uploadedDoc.status
                                    ),
                                    border: "none",
                                    padding: "5px 10px",
                                    height: "32px",
                                    width: "100px",
                                    fontSize: "14px",
                                  }}
                                  onClick={() => {
                                    setSelectedStatus(
                                      statusOptions.find(
                                        (opt) =>
                                          opt.value === uploadedDoc.status
                                      ) ||
                                        statusOptions.find(
                                          (opt) => opt.value === "unverified"
                                        )
                                    );
                                    setRemarks(uploadedDoc.remarks || "");
                                    setSelectedDocId(uploadedDoc._id);
                                    setShowModal(true);
                                  }}
                                >
                                  {(uploadedDoc.status === "verified" ||
                                    uploadedDoc.status === "Verified") && (
                                    <CheckCircleIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
                                    />
                                  )}
                                  {(uploadedDoc.status === "unverified" ||
                                    uploadedDoc.status === "Unverified") && (
                                    <CancelIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
                                    />
                                  )}
                                  {(uploadedDoc.status === "reupload" ||
                                    uploadedDoc.status === "Reupload") && (
                                    <UploadIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
                                    />
                                  )}
                                  {uploadedDoc?.status
                                    ? uploadedDoc.status
                                        .charAt(0)
                                        .toUpperCase() +
                                      uploadedDoc.status.slice(1)
                                    : "Unverified"}
                                </button>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td>
                              {uploadedDoc ? uploadedDoc.createdByName : "-"}
                            </td>
                            <td>
                              {uploadedDoc
                                ? new Date(
                                    uploadedDoc.createdAt
                                  ).toLocaleDateString("en-GB")
                                : "-"}
                            </td>
                            <td>{uploadedDoc?.remarks || "-"}</td>
                            <td className="sticky-col-right-last">
                              {uploadedDoc ? (
                                <div className="d-flex justify-content-center gap-2">
                                  {canDelete && (
                                    <Button
                                      variant="link"
                                      className="text-danger"
                                      style={{
                                        fontSize: "18px",
                                      }}
                                      onClick={() =>
                                        handleRemoveDocument(uploadedDocIndex)
                                      }
                                      title="Delete"
                                    >
                                      <FaTrashAlt />
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-muted text-center">
                          No documents available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-muted">No document types available</p>
      )}

      {/* Other Documents Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-primary mb-0">Other Documents</h6>
          {canCreate && (
            <Button
              variant="primary"
              className="custom-select-height"
              onClick={() => {
                setOtherDocName("");
                setReuploadDocIndex(null);
                setShowOtherDocModal(true);
              }}
            >
              Other Document
            </Button>
          )}
        </div>
        <div className="table-responsive">
          <Table bordered hover>
            <thead className="thead-light">
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={selectAllByType["other"] || false}
                    onChange={() => handleSelectAllChange(-1, "other")}
                    className="custom-checkbox"
                  />
                </th>
                <th>Sr No</th>
                <th>Document Name</th>
                <th>Upload File</th>
                <th>Download</th>
                <th>Status</th>
                <th>Added By</th>
                <th>Added On</th>
                <th>Remarks</th>
                <th className="sticky-col-right-last">Action</th>
              </tr>
            </thead>
            <tbody>
              {otherDocuments.length > 0 ? (
                otherDocuments.map((doc, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedRows[`-1-${index}`] || false}
                        onChange={() =>
                          handleCheckboxChange(-1, index, "other")
                        }
                        disabled={doc.status === "Reupload"}
                        className="custom-checkbox"
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{doc.customDocumentName}</td>
                    <td>
                      {doc.status !== "Reupload" ? (
                        <span className="text-success me-2">
                          {doc.filePath?.split("\\")?.pop()}
                        </span>
                      ) : (
                        <Form.Control
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) =>
                            handleOtherDocUpload(e, index, doc._id)
                          }
                          className="custom-select-height"
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
                            handleSingleDocumentDownload(id, doc._id);
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
                            backgroundColor: getStatusColor(doc.status),
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
                                (opt) => opt.value === doc.status
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
                              style={{ fontSize: "16px" }}
                            />
                          )}
                          {(doc.status === "unverified" ||
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
                          {doc?.status
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
                        ? new Date(doc.createdAt).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td>{doc.remarks || "-"}</td>
                    <td className="sticky-col-right-last">
                      {canDelete && (
                        <Button
                          variant="link"
                          className="text-danger"
                          style={{ fontSize: "18px" }}
                          onClick={() => handleRemoveDocument(index)}
                          title="Delete"
                        >
                          <FaTrashAlt />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-muted text-center">
                    No other documents available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal for Other Document */}
      <Modal
        show={showOtherDocModal}
        onHide={() => setShowOtherDocModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {reuploadDocIndex !== null
              ? "Reupload Document"
              : "Add Other Document"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOtherDocSubmit}>
            <Form.Group className="mb-3" controlId="otherDocName">
              <Form.Label>Document Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter document name"
                className="custom-select-height"
                value={otherDocName}
                onChange={(e) => setOtherDocName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="otherDocFile">
              <Form.Label>Upload Document</Form.Label>
              <Form.Control
                type="file"
                className="custom-select-height"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && !file.type.match("image/*|application/pdf")) {
                    toast.error("Only images and PDFs are allowed");
                    return;
                  }
                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.error("File size must be less than 5MB");
                    return;
                  }
                  setOtherDocFile(file);
                }}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Document Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="statusSelect">
              <Form.Label>Status</Form.Label>
              {/* <Form.Select
                value={selectedStatus?.value || ""}
                onChange={(e) =>
                  setSelectedStatus(
                    statusOptions.find((opt) => opt.value === e.target.value)
                  )
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select> */}
              <Select
              classNamePrefix="custom-select"
              value={selectedStatus}
              onChange={(option) => setSelectedStatus(option)}
              options={statusOptions}
              placeholder="Select status..."
              isClearable 
              isSearchable 
            />
            </Form.Group>
            <Form.Group className="mb-3" controlId="remarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="rounded-4"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="custom-select-height"
                onClick={() => handleStatusChange(selectedDocId)}
              >
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Document;
