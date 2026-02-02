import { Button, Form, Table } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // For Verified
import CancelIcon from "@mui/icons-material/Cancel"; // For Unverified
import UploadIcon from "@mui/icons-material/Upload";
import usePermissions from "../../commonComponents/usePermissions";


const OtherDocumentTable = ({
    id,
    statusOptions,
    selectAllByType,
    otherDocuments,
    selectedRows,
    getStatusColor,
    setOtherDocName,
    setReuploadDocIndex,
    setShowOtherDocModal,
    setSelectedStatus,
    setRemarks,
    setSelectedDocId,
    setShowModal,
    handleSelectAllChange,
    handleCheckboxChange,
    handleOtherDocUpload,
    handleSingleDocumentDownload,
    handleRemoveDocument,
}) => {
    const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
        "Student Applications"
      );
  return (
    <>
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
                            // handleSingleDocumentDownload(id, doc._id);
                            const filePath = uploadedDoc?.filePath;
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
    </>
  );
};

export default OtherDocumentTable;