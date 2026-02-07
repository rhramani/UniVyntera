import { Button, Form, Table } from "react-bootstrap";
import Select from "react-select";
import DownloadIcon from "@mui/icons-material/Download";
import { toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FaTrashAlt } from "react-icons/fa";

const TypeOfApplication = ({
  selectedOption,
  setSelectedOption,
  options,
  interestedCourseFormik,
  handleUpdateApplicationStatus,
  isRestrictedRole,
  isLoading,
  canCreate,
  canUpdate,
  formData,
  sendPendingDocumentMain,
  id,
  handleAllDownloadDocument,
  tailormadeFilePaths,
  handleFileChange,
  handleOtherDocUpload,
  selectedIds,
  selectedDocumentNames,
  selectedDocsIds,
  userRole,
  editState,
  handleCheckboxChangeId,
  handleSingleDocumentDownload,
  getStatusColor,
  setSelectedStatus,
  setRemarks,
  setSelectedDocId,
  setShowStatusModal,
  setSelectedItem,
  setShowDeleteModal,
  selectedSection,
  canDelete,
  statusOptions,
}) => {
  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Type of Application</h5>
        <div className="d-flex justify-content-end gap-3 align-items-center">
          {tailormadeFilePaths?.length > 0 && (
            <span
              style={{
                color: "green",
                fontSize: "16px",
                letterSpacing: "1px",
              }}
            >
              <strong>Agreement Document Uploaded</strong>
            </span>
          )}
          <Select
            options={options}
            value={selectedOption}
            onChange={(option) => {
              setSelectedOption(option);
              interestedCourseFormik.setFieldValue(
                "typeOfApplication",
                option ? option.value : "",
              );
              if (option) {
                handleUpdateApplicationStatus(
                  "typeOfApplication",
                  option.value,
                );
              }
            }}
            placeholder="Select Type"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "12px",
                color: "black",
                width: "150px",
              }),
              placeholder: (base) => ({
                ...base,
                color: "black",
                fontSize: "13px",
              }),
            }}
            isDisabled={isRestrictedRole || (!canCreate && !canUpdate)}
          />
        </div>
      </div>
      {selectedOption?.value === "Tailormade" && (
        <div>
          <div className="d-flex align-items-end bg-white mt-3 p-3 gap-2 rounded">
            <Form>
              <Form.Label>Upload Agreement Document</Form.Label>
              <Form.Control
                type="file"
                name="interestedCourseDetails[0].document"
                className="custom-select-height"
                onChange={(e) => handleFileChange(e, interestedCourseFormik)}
                onBlur={() =>
                  interestedCourseFormik.setFieldTouched(
                    "interestedCourseDetails[0].document",
                    true,
                  )
                }
                disabled={
                  tailormadeFilePaths?.length > 0 ||
                  isLoading ||
                  isRestrictedRole ||
                  (!canCreate && !canUpdate)
                }
              />
            </Form>
            {/* <Button
                            variant="primary"
                            className="custom-select-height"
                            style={{ width: "100px" }}
                            onClick={handleDocumentUpload}
                            disabled={tailormadeFilePaths?.length > 0}
                          >
                            {isLoading ? (
                              "Uploading..."
                            ) : (
                              <>
                                <FaUpload size={14} className="mb-1 me-1" /> Upload
                              </>
                            )}
                          </Button> */}
            {/* {tailormadeFilePaths?.length > 0 && (
                            <div>
                              {tailormadeFilePaths?.map((doc, index) => (
                                <Button
                                  key={index}
                                  variant="primary"
                                  className="custom-select-height"
                                  onClick={() =>
                                    window.open(
                                      `${BASEURL}/${doc.filePath}`,
                                      "_blank",
                                      "noopener,noreferrer"
                                    )
                                  }
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
      )}
      {selectedOption?.value === "Tailormade" &&
        tailormadeFilePaths?.length > 0 && (
          <div className="mb-4 my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-primary mb-0"></h6>
              <div>
                {selectedIds[selectedSection]?.length > 0 && (
                  <Button
                    variant="primary"
                    className="custom-select-height me-2"
                    onClick={() =>
                      handleAllDownloadDocument(
                        id,
                        selectedIds[selectedSection],
                      )
                    }
                    disabled={isRestrictedRole}
                  >
                    <DownloadIcon />
                    Download Document
                  </Button>
                )}
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
                    {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
                      <th>Document Pendency</th>
                    )}
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
                  {formData?.uploadedDocumentDetails?.length > 0 ? (
                    formData.uploadedDocumentDetails
                      ?.filter((doc) => {
                        const allowedDocuments = [
                          "Compulsory Agreement Document",
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
                              userRole !== "B2B Member" && (
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
                                    const fileName = filePath
                                      ?.split("/")
                                      ?.pop();

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
                                  disabled={isRestrictedRole}
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

export default TypeOfApplication;
