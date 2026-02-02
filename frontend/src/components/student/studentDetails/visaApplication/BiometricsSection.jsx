import { Button, Col, Form, Table, Modal } from "react-bootstrap";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import usePermissions from "../../../commonComponents/usePermissions";

const BiometricsSection = ({
  selectedVisaSection,
  biometricsPaths,
  isLoading,
  vfsAppointmentFilePaths,
  biometricsFormik,
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
  toast,
  sendPendingDocumentMain,
  selectedDocumentNames,
  selectedStatus,
  remarks,
  showModal,
  handleStatusChange,
  selectedDocId,
}) => {
  const { canCreate, canUpdate } = usePermissions(
    "Student Applications",
    "Visa Application"
  );
  console.log("canCreate, canUpdate", canCreate, canUpdate);
  return (
    <>
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Biometrics</h5>

          {/* {biometricsPaths?.length > 0 && (
                    <div>
                    {biometricsPaths?.map((doc, index) => (
                        <Button
                        key={index}
                        variant="primary"
                        className="custom-select-height"
                        onClick={() =>
                            window.open(
                            doc.filePath,
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
                )}
                {vfsAppointmentFilePaths?.length > 0 && (
                    <div>
                    {vfsAppointmentFilePaths?.map((doc, index) => (
                        <Button
                        key={index}
                        variant="primary"
                        className="custom-select-height"
                        onClick={() =>
                            window.open(
                            doc.filePath,
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
        <div className="bg-white mt-3 p-3">
          <Form className="d-flex align-items-end gap-3">
            <Col md={6}>
              <Form.Label>Upload Biometrics Receipt</Form.Label>
              <Form.Control
                type="file"
                name="biometricsReceipt"
                className="custom-select-height"
                onChange={(e) => handleFileChange(e, biometricsFormik)}
                onBlur={() =>
                  biometricsFormik.setFieldTouched("biometricsReceipt", true)
                }
                disabled={
                  biometricsPaths?.length > 0 ||
                  isLoading ||
                  userRole === "Student" || userRole === "LeadStudent" ||
    (!canCreate && !canUpdate)
                }
              />
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Appointment Letter</Form.Label>
                <Form.Control
                  type="file"
                  name="appointmentLetter"
                  className="custom-select-height"
                  onChange={(e) => handleFileChange(e, biometricsFormik)}
                  onBlur={() =>
                    biometricsFormik.setFieldTouched("appointmentLetter", true)
                  }
                  disabled={
                    vfsAppointmentFilePaths?.length > 0 ||
                    userRole === "Student" || userRole === "LeadStudent" ||
    (!canCreate && !canUpdate)
                  }
                />
              </Form.Group>
            </Col>
          </Form>
        </div>
        {(biometricsPaths?.length > 0 ||
          vfsAppointmentFilePaths?.length > 0) && (
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
                  {formData?.uploadedDocumentDetails?.length > 0 ? (
                    formData.uploadedDocumentDetails
                      ?.filter((doc) => {
                        const allowedDocuments = [
                          "Biometrics Receipt",
                          "Appointment Letter",
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
                                    const fileName = filePath
                                      ?.split("/")
                                      ?.pop();
                                    handleSingleDocumentDownload(
                                      filePath,
                                      fileName
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
                            {userRole !== "Student" &&  userRole !== "LeadStudent" && (
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

export default BiometricsSection;
