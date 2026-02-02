import { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import { decryptData } from "../../../../utils/encryptionUtils";
import { BASEURL } from "../../../../baseUrl";

const DocumentHandler = ({
  applicationData,
  documentTypes,
  id,
  dispatch,
  updateStudentApplication,
  deleteStudentApplication,
  downloadDocument,
  userRole,
  selectedDocsIds,
  handleCheckboxChangeId,
  selectedDocumentNames,
  sendPendingDocumentMain,
  fetchData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: "verified", label: "Verified" },
    { value: "unverified", label: "Unverified" },
    { value: "Reupload", label: "Reupload" },
  ];

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

  const handleTableFileUpload = async (event, docId, docName) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("uploadedDocument", file);
        formData.append("customDocumentName", docName);
        formData.append(
          "ref_module",
          applicationData?.visaApplicationDetails?._id
        );
        formData.append("documentId", docId);

        await dispatch(updateStudentApplication(formData, id));
        await fetchData();
        toast.success("Document reuploaded successfully!");
      } catch (error) {
        console.error("Failed to reupload document:", error);
        toast.error("Failed to reupload document. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusChange = async (documentId) => {
    try {
      setIsLoading(true);
      const payload = {
        documentId,
        documentUpdate: {
          status: selectedStatus.value,
          remarks,
        },
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        await fetchData();
        toast.success("Status updated successfully");
        setShowModal(false);
        setSelectedStatus(null);
        setRemarks("");
        setSelectedDocId(null);
      } else {
        toast.error(res?.data?.message || "Error updating status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSingleDocumentDownload = async (documentId, fileName) => {
  //   try {
  //     setIsLoading(true);
  //     const res = await dispatch(downloadDocument(id, documentId));
  //     if (res?.status === 200) {
  //       const contentType =
  //         res.headers["content-type"] || "application/octet-stream";
  //       const blob = new Blob([res.data], { type: contentType });
  //       const url = window.URL.createObjectURL(blob);

  //       const link = document.createElement("a");
  //       link.href = url;

  //       let downloadFileName = fileName || "document";
  //       const contentDisposition = res.headers["content-disposition"];
  //       if (!fileName && contentDisposition) {
  //         const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
  //         if (fileNameMatch && fileNameMatch[1]) {
  //           downloadFileName = fileNameMatch[1];
  //         }
  //       } else if (!fileName) {
  //         if (contentType.includes("image/jpeg")) {
  //           downloadFileName = "downloaded_image.jpg";
  //         } else if (contentType.includes("image/png")) {
  //           downloadFileName = "downloaded_image.png";
  //         } else if (contentType.includes("image/gif")) {
  //           downloadFileName = "downloaded_image.gif";
  //         } else {
  //           downloadFileName = "downloaded_image.unknown";
  //         }
  //       }

  //       link.setAttribute("download", downloadFileName);
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(url);

  //       toast.success(`Downloaded ${fileName}`);
  //     } else {
  //       toast.error(res?.data?.message || "Error downloading document");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to download document.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSingleDocumentDownload = async (filePath, fileName) => {
    try {
      if (!filePath) {
        toast.error("File path not found");
        return;
      }

      // ✅ Ensure the file URL is absolute (important!)
      let fileUrl = filePath;
      if (!fileUrl.startsWith("http") && !fileUrl.startsWith("https")) {
        fileUrl = `${BASEURL}/${filePath}`;
      }

      // ✅ Fetch the file as binary data
      const response = await fetch(fileUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Unable to download file. File not found on server.");
      }

      // ✅ Convert to blob (binary data)
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // ✅ Clean and decode file name
      let downloadFileName = decodeURIComponent(
        fileName?.trim() || fileUrl.split("/").pop() || "downloaded_file"
      );

      // ✅ Add extension if missing
      const contentType = blob.type;
      if (!/\.[a-zA-Z0-9]+$/.test(downloadFileName)) {
        if (contentType.includes("jpeg")) downloadFileName += ".jpg";
        else if (contentType.includes("png")) downloadFileName += ".png";
        else if (contentType.includes("pdf")) downloadFileName += ".pdf";
        else downloadFileName += ".file";
      }

      // ✅ Create temporary link to trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", downloadFileName);
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Error downloading file");
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      setIsLoading(true);
      const docItemId = { documentId: docId };
      await dispatch(deleteStudentApplication(docItemId, id));
      await fetchData();
      toast.success("Document deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete document.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there are any documents matching documentTypes
  const hasRelevantDocuments = applicationData?.uploadedDocumentDetails?.some(
    (doc) => documentTypes.includes(doc.customDocumentName)
  );

  // If no relevant documents, return null to hide the component
  if (!hasRelevantDocuments) {
    return null;
  }

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
            disabled={isLoading}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title className="fw-semibold">Confirm Deletion</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => setShowDeleteModal(false)}
          />
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="text-danger text-primary fs-1 mb-3">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <p className="mb-1 fw-semibold">
            Are you sure you want to delete this item?
          </p>
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button
            variant="light"
            className="btn-cancel-delete px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn-delete-confirm"
            onClick={() => {
              handleDeleteDocument(selectedItem);
              setShowDeleteModal(false);
            }}
          >
            <i className="bi bi-trash-fill me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="mb-4 my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-primary mb-0">Uploaded Documents</h6>
          <div>
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
              >
                Send Mail
              </Button>
            )}
          </div>
        </div>
        <div className="table-responsive">
          <Table bordered hover>
            <thead className="thead-light">
              <tr>
                {userRole !== "B2B Admin" &&
                  userRole !== "B2B Member" &&
                  userRole !== "Student" && userRole !== "LeadStudent" && <th>For Mail Send</th>}
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
              {applicationData?.uploadedDocumentDetails?.length > 0 ? (
                applicationData.uploadedDocumentDetails
                  .filter((doc) =>
                    documentTypes.includes(doc.customDocumentName)
                  )
                  .map((doc, index) => (
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
                                    doc.customDocumentName || "Unnamed Document"
                                  )
                                }
                              />
                            </div>
                          </td>
                        )}
                      <td>{index + 1}</td>
                      <td>{doc.customDocumentName || "Unnamed Document"}</td>
                      <td>
                        {doc.status !== "Reupload" ? (
                          <span className="text-success me-2">
                            {doc.filePath?.split("/")?.pop() || "No File"}
                          </span>
                        ) : (
                          <Form.Control
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleTableFileUpload(
                                e,
                                doc._id,
                                doc.customDocumentName
                              )
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
                              const filePath = doc?.filePath;
                              const fileName = filePath?.split("/")?.pop();
                              handleSingleDocumentDownload(filePath, fileName);
                            }}
                          >
                            Download
                          </button>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td>
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
                                  opt.value === (doc.status || "unverified")
                              ) ||
                                statusOptions.find(
                                  (opt) => opt.value === "unverified"
                                )
                            );
                            setRemarks(doc.remarks || "");
                            setSelectedDocId(doc._id);
                            setShowModal(true);
                          }}
                          disabled={userRole === "Student" || userRole === "LeadStudent"}
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
                      </td>
                      <td>{doc.createdByName || "-"}</td>
                      <td>
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString("en-GB")
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
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      userRole !== "B2B Admin" && userRole !== "B2B Member"
                        ? 10
                        : 9
                    }
                    className="text-muted text-center"
                  >
                    No documents available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default DocumentHandler;
