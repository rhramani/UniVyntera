import { useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import Select from "react-dropdown-select";
import { toast } from "react-toastify";
import { decryptData } from "../../utils/encryptionUtils";

const DataTable = ({
  columns,
  data,
  totalData,
  showNoColumn = true,
  currentPage,
  itemsPerPage,
  onEdit,
  onDelete,
  onDownload,
  onUpload,
  renderActions,
  rowKey = "_id",
  canEdit = true,
  canDelete = true,
  canUpdate = true,
  canRead = true,
  showEditButton = true,
  showDeleteButton = true,
  showDownloadButton = false,
  actionView = true,
  rowHeight = true,
  section,
  countryDocuments,
  oneStudentData,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState("");
  const [customDocType, setCustomDocType] = useState("");
  const [customDocName, setCustomDocName] = useState("");

  const location = useLocation();
  const userRole = decryptData(localStorage.getItem("role"));

  const docTypeOptions = [
    ...(countryDocuments?.data?.[0]?.documents?.map((doc) => ({
      value: doc.type?._id,
      label: doc.type?.name || `UnnamedType_${doc.type?._id}`,
    })) || []),
    { value: "others", label: "Others" },
  ];

  const documentNames =
    selectedDocType?.value && selectedDocType.value !== "others"
      ? [
          ...(countryDocuments?.data?.[0]?.documents
            ?.find((doc) => doc.type?._id === selectedDocType.value)
            ?.documentList?.map((doc) => ({
              value: doc._id,
              label: doc.name || "Unnamed Document",
            })) || []),
          { value: "others", label: "Others" },
        ]
      : [{ value: "others", label: "Others" }];

  const handleDocTypeChange = (selectedOption) => {
    const selectedValue = selectedOption[0] || null;
    setSelectedDocType(selectedValue);
    setSelectedDocumentName("");
    setCustomDocType("");
    setCustomDocName("");
  };

  const handleDocNameChange = (selectedOption) => {
    const selectedValue = selectedOption[0]?.value || "";
    setSelectedDocumentName(selectedValue);
    setCustomDocName("");
  };

  const handleCloseUploadModal = () => {
    setShowDeleteModal(false);
    setShowUploadModal(false);
    setSelectedItem(null);
    setSelectedFile(null);
    setSelectedDocType(null);
    setSelectedDocumentName("");
    setCustomDocType("");
    setCustomDocName("");
  };

  const isStudentDetailsPage = location.pathname.match(
    /^\/student-details\/[a-zA-Z0-9]+$/
  );

  const isTutorialDetailsPage = location.pathname === "/setting/tutorial";

  const showUploadIcon =
    isStudentDetailsPage &&
    (section === "Education Details" || section === "Language Entrance Exam");

  const defaultRenderActions = (item) => (
    <div className="d-flex justify-content-center">
      {canEdit && showEditButton && canUpdate && userRole !== "Student" && userRole !== "LeadStudent" && (
        <span className="icon-border edit-icon" onClick={() => onEdit(item)}>
          <EditIcon />
        </span>
      )}
      {canDelete && showDeleteButton && userRole !== "Student" && userRole !== "LeadStudent" && (
        <span
          className="icon-border delete-icon ms-2"
          onClick={() => {
            setSelectedItem(item);
            setShowDeleteModal(true);
          }}
        >
          <DeleteIcon />
        </span>
      )}
      {showDownloadButton && userRole !== "Student" && userRole !== "LeadStudent" && (
        <span
          className="icon-border download-icon ms-2"
          onClick={() => onDownload(item)}
        >
          <DownloadIcon />
        </span>
      )}
      {/* {showUploadIcon && (
        <span
          className="icon-border upload-icon ms-2"
          onClick={() => {
            setSelectedItem(item);
            setShowUploadModal(true);
          }}
        >
          <UploadFileIcon />
        </span>
      )} */}
    </div>
  );

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDocType || !selectedDocumentName || !selectedFile) {
      toast.error("Please select document type, name, and upload a file.");
      return;
    }
    if (selectedDocType.value === "others" && !customDocType) {
      toast.error("Please enter a custom document type.");
      return;
    }
    if (selectedDocumentName === "others" && !customDocName) {
      toast.error("Please enter a custom document name.");
      return;
    }

    const isDuplicate = oneStudentData?.uploadedDocumentDetails?.some(
      (doc) =>
        doc.documentType ===
          (selectedDocType.value === "others"
            ? customDocType
            : selectedDocType.value) &&
        doc.documentName ===
          (selectedDocumentName === "others"
            ? customDocName
            : selectedDocumentName)
    );

    if (isDuplicate) {
      toast.error("A document with this type and name already exists.");
      return;
    }

    const payload = {
      ...(section === "Education Details"
        ? { educationDetailId: selectedItem?._id || "" }
        : { entranceExamId: selectedItem?._id || "" }),
      documentType:
        selectedDocType.value === "others"
          ? customDocType
          : selectedDocType.value,
      documentName:
        selectedDocumentName === "others"
          ? customDocName
          : selectedDocumentName,
      uploadedDocument: selectedFile,
    };

    try {
      await onUpload(payload);
      toast.success("Document uploaded successfully!");
      handleCloseUploadModal();
    } catch (error) {
      toast.error("Failed to upload document.");
    }
  };

  return (
    <>
      <div className="table-responsive">
        <Table className="text-nowrap border" style={{ tableLayout: "auto" }}>
          <thead>
            <tr>
              {showNoColumn && (
                <th scope="col" className="No-column">
                  No
                </th>
              )}
              {columns?.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`dynamic-width ${
                    col.label === "Age" ? "center-align" : ""
                  } ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
              {(canEdit || canDelete || renderActions || canUpdate) &&
                actionView &&
                userRole !== "Student" && userRole !== "LeadStudent" && (
                  <th
                    scope="col"
                    className="sticky-col-right-last dynamic-width"
                  >
                    Actions
                  </th>
                )}
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.filter(Boolean).map((item, index) => (
                // <tr key={item[rowKey] || index} className="custom-table-row">
                <tr key={index} className={rowHeight ? "custom-table-row" : ""}>
                  {showNoColumn && (
                    <td className="No-column fw-semibold">
                      {currentPage && itemsPerPage
                        ? index + 1 + (currentPage - 1) * itemsPerPage
                        : index + 1}
                    </td>
                  )}

                  {columns?.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`dynamic-width-data ${
                        col.isLongText ? "long-text" : ""
                      } ${col.label === "Age" ? "center-align" : ""} ${
                        col.className || ""
                      }`}
                    >
                      {col.render ? col.render(item) : item[col.key] || "-"}
                    </td>
                  ))}

                  {(canEdit || canDelete || renderActions || canUpdate) &&
                    actionView &&
                    userRole !== "Student" && userRole !== "LeadStudent" && (
                      <td className="sticky-col-right-last dynamic-width-data">
                        {renderActions
                          ? renderActions(item, index)
                          : defaultRenderActions(item)}
                      </td>
                    )}
                </tr>
              ))
            ) : (
              <tr className="no-data-row">
                <td
                  colSpan={
                    columns.length +
                    (canEdit || canDelete || canUpdate || renderActions ? 2 : 1)
                  }
                >
                  <div className="no-data-text">
                    {!canRead
                      ? "You do not have permission to view this Data"
                      : "No data available"}
                  </div>
                </td>
              </tr>
            )}
          </tbody>

          {totalData && (
            <tfoot>
              <tr className="fw-bold bg-light">
                <td
                  colSpan={
                    actionView && userRole !== "Student" && userRole !== "LeadStudent"
                      ? columns.length - 1
                      : columns.length - 2
                  }
                >
                  <b>Totals</b>
                </td>
                <td>Cash: {totalData?.totalCash}</td>
                <td>Bank: {totalData?.totalBank}</td>
                <td>Grand Total: {totalData?.grandTotal}</td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
      <Modal show={showDeleteModal} onHide={handleCloseUploadModal} centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title className="fw-semibold">Confirm Deletion</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleCloseUploadModal}
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
            onClick={handleCloseUploadModal}
          >
            Cancel
          </Button>
          <Button
            className="btn-delete-confirm"
            onClick={() => {
              onDelete(selectedItem);
              setShowDeleteModal(false);
            }}
          >
            <i className="bi bi-trash-fill me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUploadModal} onHide={handleCloseUploadModal} centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title className="fw-semibold">Upload File</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleCloseUploadModal}
          />
        </Modal.Header>
        <Modal.Body className="py-4">
          <Form onSubmit={handleUploadSubmit}>
            <Form.Group className="mb-3" controlId="documentType">
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
                    borderRadius: "30px",
                    color: "black",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "black",
                    fontSize: "13px",
                  }),
                }}
                value={selectedDocType ? [selectedDocType] : []}
              />
              {selectedDocType?.value === "others" && (
                <Form.Control
                  type="text"
                  placeholder="Enter custom document type"
                  value={customDocType}
                  onChange={(e) => setCustomDocType(e.target.value)}
                  className="mt-2"
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="documentName">
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
                    borderRadius: "30px",
                    color: "black",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "black",
                    fontSize: "13px",
                  }),
                }}
                value={
                  selectedDocumentName && selectedDocumentName !== "others"
                    ? documentNames.find(
                        (option) => option.value === selectedDocumentName
                      )
                      ? [
                          documentNames.find(
                            (option) => option.value === selectedDocumentName
                          ),
                        ]
                      : []
                    : selectedDocumentName === "others"
                    ? [{ value: "others", label: "Others" }]
                    : []
                }
              />
              {selectedDocumentName === "others" && (
                <Form.Control
                  type="text"
                  placeholder="Enter custom document name"
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                  className="mt-2"
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="fileUpload">
              <Form.Label>Upload Document</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="custom-select-height"
              />
            </Form.Group>
            <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
              <Button
                variant="light"
                className="btn-cancel-delete px-4"
                onClick={handleCloseUploadModal}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-upload-confirm">
                <i className="bi bi-upload me-2"></i>Upload
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DataTable;
