import {
  Button,
  Form,
  Modal,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import { AiOutlineClose } from "react-icons/ai";
import usePermissions from "../../commonComponents/usePermissions";
import { FaTrashAlt } from "react-icons/fa";
import { decryptData } from "../../../utils/encryptionUtils";
import Select from "react-select";
import { toast } from "react-toastify";
import { normalizeFilePath } from "../../../utils/normalizeFilePath";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useRef, useState } from "react";
import { formatDate, toISODate } from "../../../utils/leadsUtils";
import { useDispatch } from "react-redux";
import { updateStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";

const DocumentSection = ({
  id,
  selectedIds,
  selectedDocType,
  countryDocuments,
  oneStudentData,
  selectedDocsIds,
  selectedDocId,
  setSelectedDocId,
  showOtherDocModal,
  reuploadDocIndex,
  handleOtherDocSubmit,
  otherDocName,
  showModal,
  setShowModal,
  selectedStatus,
  statusOptions,
  remarks,
  setRemarks,
  selectAllByType,
  selectedRows,
  handleSelectAllChange,
  handleDocumentUpload,
  getStatusColor,
  activeTab,
  showApplicationStatusSelect,
  handleSingleDocumentDownload,
  setSelectedStatus,
  handleStatusChange,
  setSelectedItem,
  setShowDeleteModal,
  handleCheckboxChangeId,
  setOtherDocName,
  setReuploadDocIndex,
  setShowOtherDocModal,
  setOtherDocFile,
  handleAllDownloadDocument,
  handleCheckboxChange,
  handleOtherDocUpload,
  handleAllDocumentsDownload,
  fetchOneStudentDetails,
}) => {
  const dispatch = useDispatch();
  const [openDeadlineDoc, setOpenDeadlineDoc] = useState(null);
  const calendarRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role") || "");
  const isStudentUploadAllowed =
    userRole === "Student" || userRole === "LeadStudent"
      ? oneStudentData?.docUploadByStudent === true
      : true;

  const docPermissions = usePermissions("Student Applications", "Document");
  const OtherDocTypePermissions = usePermissions(
    "Student Applications",
    "Document",
    "Other Documents",
  );
  const rgDocTypePermission = usePermissions(
    "Student Applications",
    "Document",
    "ZOKEP Documents",
  );
  const visaDocTypePermission = usePermissions(
    "Student Applications",
    "Document",
    "Visa Documents",
  );
  const { canCreate, canRead, canUpdate, canDelete, canShow, canDownload } =
    docPermissions;

  if (selectedDocType !== "all" && userRole !== "Super Admin" && !canShow) {
    return null;
  }

  const renderTooltip = (name) => (
    <Tooltip id="document-tooltip">{name}</Tooltip>
  );
  const handleDeadlineUpdate = async (documentName, documentType, date) => {
    try {
      const payload = {};

      const existingDoc = oneStudentData?.uploadedDocumentDetails?.find(
        (uploaded) =>
          uploaded.documentName === documentName &&
          uploaded.documentType === documentType,
      );

      if (existingDoc) {
        payload.documentId = existingDoc._id;
        payload.documentUpdate = {
          deadline: toISODate(date),
        };
      } else {
        payload.uploadedDocumentDetails = [
          {
            documentName,
            documentType,
            deadline: toISODate(date),
            status: "unverified",
          },
        ];
      }

      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        toast.success("Deadline updated successfully");
        setOpenDeadlineDoc(null);
        await fetchOneStudentDetails();
      }
    } catch (error) {
      toast.error("Failed to update deadline");
    }
  };

  const handleDeadlineRemove = async (documentName, documentType) => {
    try {
      const existingDoc = oneStudentData?.uploadedDocumentDetails?.find(
        (uploaded) =>
          uploaded.documentName === documentName &&
          uploaded.documentType === documentType,
      );

      if (!existingDoc) return;

      const payload = {
        documentId: existingDoc._id,
        documentUpdate: {
          deadline: null, // ✅ REMOVE DEADLINE
        },
      };

      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        toast.success("Deadline removed successfully");
        setOpenDeadlineDoc(null);
        await fetchOneStudentDetails();
      }
    } catch (error) {
      toast.error("Failed to remove deadline");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openDeadlineDoc &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target)
      ) {
        setOpenDeadlineDoc(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDeadlineDoc]);

  return (
    <>
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5 style={{ lineHeight: "40px" }}>Document List</h5>
          <div>
            {selectedIds[selectedDocType]?.length > 0 && (
              <Button
                variant="primary"
                className="custom-select-height me-2"
                onClick={() =>
                  handleAllDownloadDocument(id, selectedIds[selectedDocType])
                }
              >
                <DownloadIcon />
                Download Document
              </Button>
            )}
            {/* For All Documents (normal docs + RG) */}
            {selectedDocType === "all" &&
              oneStudentData?.uploadedDocumentDetails?.some(
                (doc) => !!doc?.filePath && doc?.documentName, // only system-assigned docs
              ) && (
                <Button
                  variant="primary"
                  className="custom-select-height"
                  onClick={() => handleAllDocumentsDownload(id)}
                >
                  <DownloadIcon />
                  All Documents Download
                </Button>
              )}

            {/* For AllZOKEP Documents (Visa + Other) */}
            {selectedDocType === "allrg" &&
              oneStudentData?.uploadedDocumentDetails?.some(
                (doc) => !!doc?.filePath && doc?.customDocumentName, // only custom docs
              ) && (
                <Button
                  variant="primary"
                  className="custom-select-height"
                  onClick={() => handleAllDocumentsDownload(id)}
                >
                  <DownloadIcon />
                  All Documents Download
                </Button>
              )}
          </div>
        </div>
        {countryDocuments?.data?.[0]?.documents?.length > 0 ? (
          <>
            {countryDocuments.data[0].documents?.map((doc, docIndex) => {
              const typeKey = doc.type?.name || `UnnamedType_${docIndex}`;
              if (selectedDocType !== "all" && selectedDocType !== typeKey)
                return null;

              const typePermissions = usePermissions(
                "Student Applications",
                "Document",
                typeKey,
              );

              if (!(userRole === "Super Admin" || typePermissions.canShow))
                return null;

              return (
                <div key={docIndex} className="mb-4">
                  <h6 className="mb-3 text-primary">
                    {doc.type?.name || "Unnamed Document Type"}
                  </h6>
                  <div
                    className="table-responsive modern-table-wrapper"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <Table
                      className="table table-hover modern-table table-nowrap"
                      style={{ width: "100%", overflowX: "auto" }}
                    >
                      <thead className="thead-light">
                        <tr>
                          {selectedDocType !== "all" && (
                            <>
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
                            </>
                          )}
                          {userRole !== "B2B Admin" &&
                            userRole !== "B2B Member" &&
                            userRole !== "Student" &&
                            userRole !== "LeadStudent" && (
                              <th>Document Pendency</th>
                            )}
                          <th>Deadline</th>
                          <th>Sr No</th>
                          <th className="fixed-width-doc-name">
                            Document Name
                          </th>
                          <th>Upload File</th>
                          {canDownload && <th>Download</th>}
                          <th>Status</th>
                          <th>Added By</th>
                          <th>Added On</th>
                          <th>Updated By</th>
                          <th>Updated On</th>
                          <th>Remarks</th>
                          {isStudentUploadAllowed && (
                            <th className="sticky-col-right-last">Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {doc.documentList?.length > 0 ? (
                          doc?.documentList
                            ?.filter((document) => document?.document?.name)
                            ?.map((document, index) => {
                              const uploadedDocs =
                                oneStudentData?.uploadedDocumentDetails?.filter(
                                  (uploaded) =>
                                    uploaded?.documentName ===
                                    document?.document?._id,
                                );
                              if (!uploadedDocs || uploadedDocs?.length === 0) {
                                return (
                                  <tr key={`${docIndex}-${index}`}>
                                    {selectedDocType !== "all" && (
                                      <td>
                                        <Form.Check
                                          type="checkbox"
                                          checked={
                                            selectedRows[
                                              `${docIndex}-${index}`
                                            ] || false
                                          }
                                          onChange={() =>
                                            handleCheckboxChange(
                                              docIndex,
                                              index,
                                              typeKey,
                                              null,
                                              `${docIndex}-${index}`,
                                            )
                                          }
                                          disabled={true}
                                          className="custom-checkbox"
                                        />
                                      </td>
                                    )}
                                    {userRole !== "B2B Admin" &&
                                      userRole !== "B2B Member" &&
                                      userRole !== "Student" &&
                                      userRole !== "LeadStudent" && (
                                        <td>
                                          <div className="form-check form-switch custom-toggle-button me-0">
                                            <input
                                              className="form-check-input three-dots-icon"
                                              type="checkbox"
                                              id={`toggle-${docIndex}-${index}`}
                                              checked={selectedDocsIds?.includes(
                                                `${docIndex}-${index}`,
                                              )}
                                              onChange={() =>
                                                handleCheckboxChangeId(
                                                  `${docIndex}-${index}`,
                                                  document?.document?.name,
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      )}
                                    <td style={{ minWidth: "160px" }}>
                                      <span
                                        className={
                                          canUpdate || canCreate
                                            ? "text-primary"
                                            : "text-muted"
                                        }
                                        style={{
                                          cursor:
                                            canUpdate || canCreate
                                              ? "pointer"
                                              : "not-allowed",
                                          pointerEvents:
                                            canUpdate || canCreate
                                              ? "auto"
                                              : "none",
                                        }}
                                        onClick={(e) => {
                                          if (!(canUpdate || canCreate)) return;

                                          e.stopPropagation();

                                          const rect =
                                            e.target.getBoundingClientRect();

                                          setOpenDeadlineDoc({
                                            id: document._id,
                                            documentType:
                                              document?.document?.type?._id,
                                            documentName:
                                              document?.document?._id,
                                            date: document.deadline
                                              ? new Date(document.deadline)
                                              : null,
                                            position: {
                                              top: rect.bottom + window.scrollY,
                                              left: rect.left + window.scrollX,
                                            },
                                          });
                                        }}
                                      >
                                        {document.deadline
                                          ? formatDate(
                                              new Date(document.deadline),
                                            )
                                          : "Set Deadline"}
                                      </span>
                                    </td>
                                    <td>{index + 1}</td>
                                    <td className="fixed-width-doc-name">
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip(
                                          document?.document?.name ||
                                            "Unnamed Document",
                                        )}
                                      >
                                        <span style={{ cursor: "pointer" }}>
                                          {document?.document?.name ||
                                            "Unnamed Document"}
                                          {document.required === true ? (
                                            <span
                                              style={{
                                                color: "red",
                                                fontSize: "18px",
                                                marginLeft: "2px",
                                              }}
                                            >
                                              *
                                            </span>
                                          ) : null}
                                        </span>
                                      </OverlayTrigger>
                                      {/* {document?.document?.name ||
                                      "Unnamed Document"}
                                    {document.required === true ? (
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "18px",
                                          marginLeft: "2px",
                                        }}
                                      >
                                        *
                                      </span>
                                    ) : null} */}
                                    </td>
                                    <td>
                                      <Form.Group
                                        controlId={`upload-${docIndex}-${index}`}
                                        className="mb-0"
                                      >
                                        {/* {(canCreate || canUpdate) && ( */}
                                        <Form.Control
                                          type="file"
                                          accept="image/*,application/pdf"
                                          multiple
                                          onChange={(e) =>
                                            handleDocumentUpload(
                                              e,
                                              docIndex,
                                              index,
                                              document?.document?.name,
                                            )
                                          }
                                          className="custom-select-height"
                                          style={{
                                            width: "250px",
                                          }}
                                          disabled={!isStudentUploadAllowed}
                                        />
                                        {/* )} */}
                                      </Form.Group>
                                    </td>
                                    <td>
                                      <span>-</span>
                                    </td>
                                    <td>
                                      <span>-</span>
                                    </td>
                                    <td>-</td>
                                    <td>-</td>
                                    {canDownload && <td>-</td>}
                                    <td>-</td>
                                    <td>-</td>
                                    {isStudentUploadAllowed && (
                                      <td className="sticky-col-right-last">
                                        <span>-</span>
                                      </td>
                                    )}
                                  </tr>
                                );
                              }

                              return uploadedDocs?.map(
                                (uploadedDoc, uploadIndex) => (
                                  <tr
                                    key={`${docIndex}-${index}-${uploadIndex}`}
                                  >
                                    {selectedDocType !== "all" && (
                                      <td>
                                        <Form.Check
                                          type="checkbox"
                                          checked={
                                            selectedRows[
                                              `${docIndex}-${index}-${uploadIndex}`
                                            ] || false
                                          }
                                          onChange={() =>
                                            handleCheckboxChange(
                                              docIndex,
                                              index,
                                              typeKey,
                                              uploadedDoc?._id,
                                              `${docIndex}-${index}-${uploadIndex}`,
                                            )
                                          }
                                          className="custom-checkbox"
                                        />
                                      </td>
                                    )}
                                    {userRole !== "B2B Admin" &&
                                      userRole !== "B2B Member" &&
                                      userRole !== "Student" &&
                                      userRole !== "LeadStudent" && (
                                        <td>
                                          <div className="form-check form-switch custom-toggle-button me-0">
                                            <input
                                              className="form-check-input three-dots-icon"
                                              type="checkbox"
                                              id={`toggle-${docIndex}-${index}-${uploadIndex}`}
                                              checked={selectedDocsIds?.includes(
                                                uploadedDoc?._id,
                                              )}
                                              onChange={() =>
                                                handleCheckboxChangeId(
                                                  uploadedDoc?._id,
                                                  document?.document?.name,
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                      )}
                                    <td style={{ minWidth: "160px" }}>
                                      <span
                                        className={
                                          canUpdate || canCreate
                                            ? "text-primary"
                                            : "text-muted"
                                        }
                                        style={{
                                          cursor:
                                            canUpdate || canCreate
                                              ? "pointer"
                                              : "not-allowed",
                                          pointerEvents:
                                            canUpdate || canCreate
                                              ? "auto"
                                              : "none",
                                        }}
                                        onClick={(e) => {
                                          if (!(canUpdate || canCreate)) return;

                                          e.stopPropagation();

                                          const rect =
                                            e.target.getBoundingClientRect();

                                          setOpenDeadlineDoc({
                                            documentName:
                                              document?.document?._id, // ✅ ORIGINAL document id
                                            documentType: doc?.type?._id, // ✅ document type id
                                            date: uploadedDoc.deadline
                                              ? new Date(uploadedDoc.deadline)
                                              : null,
                                            position: {
                                              top: rect.bottom + window.scrollY,
                                              left: rect.left + window.scrollX,
                                            },
                                          });
                                        }}
                                      >
                                        {uploadedDoc.deadline
                                          ? formatDate(
                                              new Date(uploadedDoc.deadline),
                                            )
                                          : "Set Deadline"}
                                      </span>
                                    </td>
                                    <td>
                                      {uploadedDocs?.length === 1
                                        ? index + 1
                                        : `${index + 1}.${uploadIndex + 1}`}
                                    </td>
                                    <td>
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip(
                                          document.document?.name ||
                                            "Unnamed Document",
                                        )}
                                      >
                                        <span style={{ cursor: "pointer" }}>
                                          {document.document?.name ||
                                            "Unnamed Document"}
                                        </span>
                                      </OverlayTrigger>
                                    </td>
                                    <td>
                                      {uploadedDoc &&
                                      uploadedDoc?.filePath &&
                                      uploadedDoc?.status !== "Reupload" ? (
                                        <div className="d-flex align-items-center">
                                          <span className="text-success me-2">
                                            {normalizeFilePath(
                                              uploadedDoc.filePath,
                                            )
                                              ?.split("/")
                                              ?.pop()}
                                          </span>
                                        </div>
                                      ) : (
                                        <Form.Group
                                          controlId={`upload-${docIndex}-${index}-${uploadIndex}`}
                                          className="mb-0"
                                        >
                                          {/* {(canCreate || canUpdate) && ( */}
                                          <Form.Control
                                            type="file"
                                            accept="image/*,application/pdf"
                                            multiple
                                            onChange={(e) =>
                                              handleDocumentUpload(
                                                e,
                                                docIndex,
                                                index,
                                                document?.document?.name,
                                              )
                                            }
                                            className="custom-select-height"
                                            style={{
                                              width: "250px",
                                            }}
                                            disabled={!isStudentUploadAllowed}
                                          />
                                          {/* )} */}
                                        </Form.Group>
                                      )}
                                    </td>
                                    {/* <td>
                                    {uploadedDoc && uploadedDoc.status !== "Reupload" ? (
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
                                          const fileName = uploadedDoc?.filePath || "document";
                                          handleSingleDocumentDownload(uploadedDoc, fileName);
                                        }}
                                      >
                                        <DownloadIcon />
                                        Download
                                      </button>
                                    ) : (
                                      <span>-</span>
                                    )}
                                  </td> */}
                                    {canDownload && (
                                      <td>
                                        {uploadedDoc &&
                                        uploadedDoc?.filePath &&
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
                                              // const fileName = uploadedDoc?.filePath
                                              //   ?.split("/")
                                              //   ?.pop();
                                              // handleSingleDocumentDownload(
                                              //   id,
                                              //   uploadedDoc?._id,
                                              //   fileName
                                              // );
                                              const filePath =
                                                uploadedDoc?.filePath;
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
                                    )}
                                    <td>
                                      {uploadedDoc ? (
                                        <button
                                          className="btn btn-sm fw-normal d-flex align-items-center justify-content-center rounded-4"
                                          style={{
                                            cursor: "pointer",
                                            color: "#fff",
                                            backgroundColor: getStatusColor(
                                              uploadedDoc.status,
                                            ),
                                            border: "none",
                                            padding: "5px 10px",
                                            height: "32px",
                                            width: "100px",
                                            fontSize: "14px",
                                          }}
                                          disabled={
                                            !isStudentUploadAllowed &&
                                            ((activeTab === "document" &&
                                              !showApplicationStatusSelect) ||
                                              activeTab !== "document")
                                          }
                                          onClick={() => {
                                            setSelectedStatus(
                                              statusOptions.find(
                                                (opt) =>
                                                  opt.value ===
                                                  uploadedDoc?.status,
                                              ) ||
                                                statusOptions.find(
                                                  (opt) =>
                                                    opt.value === "unverified",
                                                ),
                                            );
                                            setRemarks(
                                              uploadedDoc.remarks || "",
                                            );
                                            setSelectedDocId(uploadedDoc?._id);
                                            setShowModal(true);
                                          }}
                                        >
                                          {(uploadedDoc.status === "verified" ||
                                            uploadedDoc.status ===
                                              "Verified") && (
                                            <CheckCircleIcon
                                              className="me-1"
                                              style={{
                                                fontSize: "16px",
                                              }}
                                            />
                                          )}
                                          {(uploadedDoc.status ===
                                            "unverified" ||
                                            uploadedDoc.status ===
                                              "Unverified") && (
                                            <CancelIcon
                                              className="me-1"
                                              style={{
                                                fontSize: "16px",
                                              }}
                                            />
                                          )}
                                          {(uploadedDoc.status === "reupload" ||
                                            uploadedDoc.status ===
                                              "Reupload") && (
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
                                      {uploadedDoc
                                        ? uploadedDoc.createdByName
                                        : "-"}
                                    </td>
                                    <td>
                                      {uploadedDoc
                                        ? new Date(
                                            uploadedDoc.createdAt,
                                          ).toLocaleDateString("en-GB")
                                        : "-"}
                                    </td>
                                    <td>
                                      {uploadedDoc
                                        ? uploadedDoc.createdByName
                                        : "-"}
                                    </td>
                                    <td>
                                      {uploadedDoc
                                        ? new Date(
                                            uploadedDoc.createdAt,
                                          ).toLocaleDateString("en-GB")
                                        : "-"}
                                    </td>
                                    <td>{uploadedDoc?.remarks || "-"}</td>
                                    {isStudentUploadAllowed && (
                                      <td className="sticky-col-right-last">
                                        {uploadedDoc ? (
                                          <div className="d-flex justify-content-center gap-2">
                                            {/* {canDelete && ( */}
                                            <Button
                                              variant="link"
                                              className="text-danger"
                                              style={{
                                                fontSize: "18px",
                                              }}
                                              onClick={() => {
                                                setSelectedItem(
                                                  uploadedDoc?._id,
                                                );
                                                setShowDeleteModal(true);
                                              }}
                                              title="Delete"
                                            >
                                              <FaTrashAlt />
                                            </Button>
                                            {/* )} */}
                                          </div>
                                        ) : (
                                          <span>-</span>
                                        )}
                                      </td>
                                    )}
                                  </tr>
                                ),
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan="13" className="text-muted text-center">
                              No documents available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {openDeadlineDoc && (
                      <div
                        ref={calendarRef}
                        style={{
                          position: "absolute",
                          top: openDeadlineDoc.position.top,
                          left: openDeadlineDoc.position.left,
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          padding: "8px",
                          borderRadius: "8px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Calendar
                          value={openDeadlineDoc.date}
                          onChange={(date) =>
                            handleDeadlineUpdate(
                              openDeadlineDoc.documentName,
                              openDeadlineDoc.documentType,
                              date,
                            )
                          }
                        />{" "}
                        {openDeadlineDoc.date && (canUpdate || canCreate) && (
                          <div className="text-end mt-2">
                            <Button
                              size="sm"
                              variant="danger"
                              className="custom-select-height"
                              onClick={() =>
                                handleDeadlineRemove(
                                  openDeadlineDoc.documentName,
                                  openDeadlineDoc.documentType,
                                )
                              }
                            >
                              ❌ Remove Deadline
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {selectedDocType !== "other" &&
              selectedDocType !== "rgdocument" &&
              selectedDocType !== "visadocuments" && (
                <p className="text-muted">No document types available</p>
              )}
          </>
        )}

        {/* Other Documents */}

        {/* Other Documents */}
        {(selectedDocType === "all" || selectedDocType === "other") && (
          <>
            {!(
              userRole === "Super Admin" || OtherDocTypePermissions.canShow
            ) ? null : (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-primary mb-0">Other Documents</h6>
                  {isStudentUploadAllowed && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={() => {
                        setOtherDocName("");
                        setReuploadDocIndex(null);
                        setShowOtherDocModal(true);
                      }}
                    >
                      Add Other Document
                    </Button>
                  )}
                </div>
                <div
                  className="table-responsive modern-table-wrapper"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <Table
                    className="table table-hover modern-table table-nowrap"
                    style={{ width: "100%", overflowX: "auto" }}
                  >
                    <thead className="thead-light">
                      <tr>
                        {selectedDocType !== "all" && (
                          <th>
                            <Form.Check
                              type="checkbox"
                              checked={selectAllByType["other"] || false}
                              onChange={() =>
                                handleSelectAllChange(-1, "other")
                              }
                              className="custom-checkbox"
                            />
                          </th>
                        )}
                        {userRole !== "B2B Admin" &&
                          userRole !== "B2B Member" &&
                          userRole !== "Student" &&
                          userRole !== "LeadStudent" && (
                            <th>Document Pendency</th>
                          )}
                        <th>Sr No</th>
                        <th className="fixed-width-doc-name">Document Name</th>
                        <th>Upload File</th>
                        <th>Download</th>
                        <th>Status</th>
                        <th>Added By</th>
                        <th>Added On</th>
                        <th>Remarks</th>
                        {isStudentUploadAllowed && (
                          <th className="sticky-col-right-last">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {oneStudentData?.uploadedDocumentDetails?.length > 0 ? (
                        oneStudentData.uploadedDocumentDetails
                          ?.filter((doc) => {
                            const excludedDocuments = [
                              "Application Submission Form",
                              "Fee Payment Proof",
                              "Deposit Payment Proof",
                              "Conditional Offer Letter",
                              "Unconditional Offer Letter",
                              "Compulsory Agreement Document",
                              "Commission payment Proof",
                              "Visa Fee Payment",
                              "Appointment Letter",
                              "Biometrics Receipt",
                              "PIC Decision",
                              "D Visa Document",
                              "Supplementary Additional",
                              "Visa Application Submission",
                              "Visa Outcome Proof",
                              "Balance Certificate",
                              "Admission Letter",
                              "Blocked Account Confirmation",
                              "Remittance Copy",
                              "Offer / Admission Letter",
                              "Health Insurance Certificate",
                              "Visa Application Form Copy",
                              "Appointment Booking Confirmation",
                              "Visa Fee Payment Receipt",
                              "Acknowledgement Slip",
                              "Submitted Documents Checklist",
                              "Visa Copy / Grant Document",
                              "Residence Permit Document",
                              "Travel Flight Ticket",
                              "Tuition Fee Receipt",
                              "Campus France Approval Letter",
                              "Tuition Fee Payment Receipt",
                              "Proof of Funds",
                              "Medical Insurance Certificate",
                              "France Visas Application Form",
                              "Receipt Visa Fee Payment",
                              "Biometrics Slip",
                              "Visa Decision & Issuance Copy",
                              "OFII Document",
                              "Conditional Offer Letters",
                              "Application Form Lock Document",
                              "BVL Document",
                              "Medical Report Certificate",
                              "GIC Certificate & TT Copy",
                              "Visa Fee Receipt",
                              "Submission Confirmation Document",
                              "Biometric Appointment Confirmation Document",
                              "PPR Document",
                              "Visa Document",
                              "POE Letter Document",
                              "Visa Copy",
                              "Application Balance Certificate",
                              "I-20 Document",
                              "DS-160 Confirmation",
                              "DS-160 Confirmation Page",
                              "Payment Receipt",
                              "Appointment Confirmation",
                              "SEVIS Fee Receipt",
                              "Visa Decision Copy",
                              "OSHC Certificate",
                              "Application Form Copy",
                              "Biometrics Acknowledgement",
                              "Pre-Departure Checklist",
                              "Offer Letter",
                              "COE Document",
                              "Medical Report",
                              "Tuition Fee Receipts",
                              "Visa Fee",
                              "Visa Grant Letter",
                              "Flight Ticket",
                              "Fee Receipt",
                              "Maintenance Funds Proof",
                              "Fund Proof",
                              "CAS Letter",
                              "TB Certificate",
                              "Application Form PDF",
                              "IHS Receipt",
                              "Embassy Visa Fee Receipt",
                              "VFS Visa Fee Receipt",
                              "Biometric Appointment Confirmation",
                              "Biometric Slip",
                            ];
                            return (
                              (doc.customDocumentName ||
                                !countryDocuments?.data?.[0]?.documents?.some(
                                  (catDoc) =>
                                    catDoc.documentList?.some(
                                      (d) =>
                                        d?.document?._id === doc.documentName,
                                    ),
                                )) &&
                              !excludedDocuments.includes(
                                doc.customDocumentName,
                              )
                            );
                          })
                          ?.map((doc, index) => {
                            const docName =
                              doc.customDocumentName ||
                              doc.documentName ||
                              "Unnamed Document";
                            return (
                              <tr key={doc._id}>
                                {selectedDocType !== "all" && (
                                  <td>
                                    <Form.Check
                                      type="checkbox"
                                      checked={
                                        selectedRows[`other--1-${index}`] ||
                                        false
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(
                                          -1,
                                          index,
                                          "other",
                                          doc._id,
                                          `other--1-${index}`,
                                        )
                                      }
                                      disabled={doc.status === "Reupload"}
                                      className="custom-checkbox"
                                    />
                                  </td>
                                )}
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
                                <td className="fixed-width-doc-name">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={renderTooltip(docName)}
                                  >
                                    <span>{docName}</span>
                                  </OverlayTrigger>
                                </td>
                                <td>
                                  {doc.status !== "Reupload" ? (
                                    <span className="text-success me-2">
                                      {normalizeFilePath(doc.filePath)
                                        ?.toString()
                                        .split("/")
                                        .pop() || "No File"}
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
                                      disabled={!isStudentUploadAllowed}
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
                                        //     ?.toString()
                                        //     .split("/")
                                        //     .pop() || "document";
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
                                        (!isStudentUploadAllowed &&
                                          activeTab === "document" &&
                                          !showApplicationStatusSelect) ||
                                        activeTab !== "document"
                                      }
                                      onClick={() => {
                                        setSelectedStatus(
                                          statusOptions.find(
                                            (opt) =>
                                              opt.value ===
                                              (doc.status || "unverified"),
                                          ) ||
                                            statusOptions.find(
                                              (opt) =>
                                                opt.value === "unverified",
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
                                    ? new Date(
                                        doc.createdAt,
                                      ).toLocaleDateString("en-GB")
                                    : "-"}
                                </td>
                                <td>{doc.remarks || "-"}</td>
                                {isStudentUploadAllowed && (
                                  <td className="sticky-col-right-last">
                                    {/* {canDelete && ( */}
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
                                    {/* )} */}
                                  </td>
                                )}
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-muted text-center">
                            No other documents available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ZOKEP Documents */}
        {(selectedDocType === "allrg" || selectedDocType === "rgdocument") && (
          <>
            {!(
              userRole === "Super Admin" || rgDocTypePermission.canShow
            ) ? null : (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-primary mb-0">US Documents</h6>
                </div>
                <div
                  className="table-responsive modern-table-wrapper"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <Table
                    className="table table-hover modern-table table-nowrap"
                    style={{ width: "100%", overflowX: "auto" }}
                  >
                    <thead className="thead-light">
                      <tr>
                        {selectedDocType !== "allrg" && (
                          <th>
                            <Form.Check
                              type="checkbox"
                              checked={selectAllByType["rgdocument"] || false}
                              onChange={() =>
                                handleSelectAllChange(-1, "rgdocument")
                              }
                              className="custom-checkbox"
                            />
                          </th>
                        )}
                        {userRole !== "B2B Admin" &&
                          userRole !== "B2B Member" &&
                          userRole !== "Student" &&
                          userRole !== "LeadStudent" && (
                            <th>Document Pendency</th>
                          )}
                        <th>Sr No</th>
                        <th className="fixed-width-doc-name">Document Name</th>
                        <th>Upload File</th>
                        <th>Download</th>
                        <th>Status</th>
                        <th>Added By</th>
                        <th>Added On</th>
                        <th>Remarks</th>
                        {isStudentUploadAllowed && (
                          <th className="sticky-col-right-last">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {oneStudentData?.uploadedDocumentDetails?.length > 0 ? (
                        oneStudentData.uploadedDocumentDetails
                          ?.filter((doc) => {
                            const allowedDocuments = [
                              "Application Submission Form",
                              "Fee Payment Proof",
                              "Deposit Payment Proof",
                              "Conditional Offer Letter",
                              "Unconditional Offer Letter",
                              "Compulsory Agreement Document",
                              "Commission payment Proof",
                            ];
                            return (
                              doc.customDocumentName &&
                              allowedDocuments.includes(doc.customDocumentName)
                            );
                          })
                          ?.map((doc, index) => {
                            const docName =
                              doc.customDocumentName ||
                              doc.documentName ||
                              "Unnamed Document";
                            return (
                              <tr key={doc._id}>
                                {selectedDocType !== "allrg" && (
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
                                          `rgdocument--1-${index}`,
                                        )
                                      }
                                      disabled={doc.status === "Reupload"}
                                      className="custom-checkbox"
                                    />
                                  </td>
                                )}
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
                                <td className="fixed-width-doc-name">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={renderTooltip(docName)}
                                  >
                                    <span>{docName}</span>
                                  </OverlayTrigger>
                                </td>
                                {/* <td className="fixed-width-doc-name">{docName}</td> */}
                                <td>
                                  {doc.status !== "Reupload" ? (
                                    <span className="text-success me-2">
                                      {normalizeFilePath(doc.filePath)
                                        ?.split("/")
                                        ?.pop() || "No File"}
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
                                      disabled={!isStudentUploadAllowed}
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
                                        (!isStudentUploadAllowed &&
                                          activeTab === "document" &&
                                          !showApplicationStatusSelect) ||
                                        activeTab !== "document"
                                      }
                                      onClick={() => {
                                        setSelectedStatus(
                                          statusOptions.find(
                                            (opt) =>
                                              opt.value ===
                                              (doc.status || "unverified"),
                                          ) ||
                                            statusOptions.find(
                                              (opt) =>
                                                opt.value === "unverified",
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
                                    ? new Date(
                                        doc.createdAt,
                                      ).toLocaleDateString("en-GB")
                                    : "-"}
                                </td>
                                <td>{doc.remarks || "-"}</td>
                                {isStudentUploadAllowed && (
                                  <td className="sticky-col-right-last">
                                    {/* {canDelete && ( */}
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
                                    {/* )} */}
                                  </td>
                                )}
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-muted text-center">
                            No US documents available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Visa Documents */}
        {(selectedDocType === "allrg" ||
          selectedDocType === "visadocuments") && (
          <>
            {!(
              userRole === "Super Admin" || visaDocTypePermission.canShow
            ) ? null : (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-primary mb-0">Visa Documents</h6>
                </div>
                <div
                  className="table-responsive modern-table-wrapper"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <Table
                    className="table table-hover modern-table table-nowrap"
                    style={{ width: "100%", overflowX: "auto" }}
                  >
                    <thead className="thead-light">
                      <tr>
                        {selectedDocType !== "allrg" && (
                          <th>
                            <Form.Check
                              type="checkbox"
                              checked={
                                selectAllByType["visadocuments"] || false
                              }
                              onChange={() =>
                                handleSelectAllChange(-1, "visadocuments")
                              }
                              className="custom-checkbox"
                            />
                          </th>
                        )}
                        {userRole !== "B2B Admin" &&
                          userRole !== "B2B Member" &&
                          userRole !== "Student" &&
                          userRole !== "LeadStudent" && (
                            <th>Document Pendency</th>
                          )}
                        <th>Sr No</th>
                        <th className="fixed-width-doc-name">Document Name</th>
                        <th>Upload File</th>
                        <th>Download</th>
                        <th>Status</th>
                        <th>Added By</th>
                        <th>Added On</th>
                        <th>Remarks</th>
                        {isStudentUploadAllowed && (
                          <th className="sticky-col-right-last">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {oneStudentData?.uploadedDocumentDetails?.length > 0 ? (
                        oneStudentData.uploadedDocumentDetails
                          ?.filter((doc) => {
                            const allowedDocuments = [
                              "Visa Fee Payment",
                              "Appointment Letter",
                              "Biometrics Receipt",
                              "PIC Decision",
                              "D Visa Document",
                              "Supplementary Additional",
                              "Visa Application Submission",
                              "Visa Outcome Proof",
                              "Balance Certificate",
                              "Admission Letter",
                              "Blocked Account Confirmation",
                              "Remittance Copy",
                              "Offer / Admission Letter",
                              "Health Insurance Certificate",
                              "Visa Application Form Copy",
                              "Appointment Booking Confirmation",
                              "Visa Fee Payment Receipt",
                              "Acknowledgement Slip",
                              "Submitted Documents Checklist",
                              "Visa Copy / Grant Document",
                              "Residence Permit Document",
                              "Travel Flight Ticket",
                              "Tuition Fee Receipt",
                              "Campus France Approval Letter",
                              "Tuition Fee Payment Receipt",
                              "Proof of Funds",
                              "Medical Insurance Certificate",
                              "France Visas Application Form",
                              "Receipt Visa Fee Payment",
                              "Biometrics Slip",
                              "Visa Decision & Issuance Copy",
                              "OFII Document",
                              "Conditional Offer Letters",
                              "Application Form Lock Document",
                              "BVL Document",
                              "Medical Report Certificate",
                              "GIC Certificate & TT Copy",
                              "Visa Fee Receipt",
                              "Submission Confirmation Document",
                              "Biometric Appointment Confirmation Document",
                              "PPR Document",
                              "Visa Document",
                              "POE Letter Document",
                              "Visa Copy",
                              "Application Balance Certificate",
                              "I-20 Document",
                              "DS-160 Confirmation",
                              "DS-160 Confirmation Page",
                              "Payment Receipt",
                              "Appointment Confirmation",
                              "SEVIS Fee Receipt",
                              "Visa Decision Copy",
                              "OSHC Certificate",
                              "Application Form Copy",
                              "Biometrics Acknowledgement",
                              "Pre-Departure Checklist",
                              "Offer Letter",
                              "COE Document",
                              "Medical Report",
                              "Tuition Fee Receipts",
                              "Visa Fee",
                              "Visa Grant Letter",
                              "Flight Ticket",
                              "Fee Receipt",
                              "Maintenance Funds Proof",
                              "Fund Proof",
                              "CAS Letter",
                              "TB Certificate",
                              "Application Form PDF",
                              "IHS Receipt",
                              "Embassy Visa Fee Receipt",
                              "VFS Visa Fee Receipt",
                              "Biometric Appointment Confirmation",
                              "Biometric Slip",
                            ];
                            return (
                              doc.customDocumentName &&
                              allowedDocuments.includes(doc.customDocumentName)
                            );
                          })
                          ?.map((doc, index) => {
                            const docName =
                              doc.customDocumentName ||
                              doc.documentName ||
                              "Unnamed Document";
                            return (
                              <tr key={doc._id}>
                                {selectedDocType !== "allrg" && (
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
                                          `visadocuments--1-${index}`,
                                        )
                                      }
                                      disabled={doc.status === "Reupload"}
                                      className="custom-checkbox"
                                    />
                                  </td>
                                )}
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
                                <td className="fixed-width-doc-name">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={renderTooltip(docName)}
                                  >
                                    <span>{docName}</span>
                                  </OverlayTrigger>
                                </td>
                                <td>
                                  {doc.status !== "Reupload" ? (
                                    <span className="text-success me-2">
                                      {normalizeFilePath(doc.filePath)
                                        ?.split("/")
                                        ?.pop() || "No File"}
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
                                      disabled={!isStudentUploadAllowed}
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
                                        (!isStudentUploadAllowed &&
                                          activeTab === "document" &&
                                          !showApplicationStatusSelect) ||
                                        activeTab !== "document"
                                      }
                                      onClick={() => {
                                        setSelectedStatus(
                                          statusOptions.find(
                                            (opt) =>
                                              opt.value ===
                                              (doc.status || "unverified"),
                                          ) ||
                                            statusOptions.find(
                                              (opt) =>
                                                opt.value === "unverified",
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
                                    ? new Date(
                                        doc.createdAt,
                                      ).toLocaleDateString("en-GB")
                                    : "-"}
                                </td>
                                <td>{doc.remarks || "-"}</td>
                                {isStudentUploadAllowed && (
                                  <td className="sticky-col-right-last">
                                    {/* {canDelete && ( */}
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
                                    {/* )} */}
                                  </td>
                                )}
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-muted text-center">
                            No Visa documents available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal for Other Document */}
        <Modal
          show={showOtherDocModal}
          onHide={() => setShowOtherDocModal(false)}
        >
          <Modal.Header className="form-main-heading">
            <Modal.Title>
              {reuploadDocIndex !== null
                ? "Reupload Document"
                : "Add Other Document"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => setShowOtherDocModal(false)}
            />
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
                        "application/msword", // .doc
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                        "application/vnd.ms-excel", // .xls
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                      ];

                      const maxSize = 5 * 1024 * 1024; // 5MB

                      for (let file of files) {
                        if (!allowedTypes.includes(file.type)) {
                          toast.error(
                            `❌ ${file.name} is not a supported file type`,
                          );
                          return;
                        }

                        if (file.size > maxSize) {
                          toast.error(`❌ ${file.name} must be less than 5MB`);
                          return;
                        }
                      }

                      // Store valid files
                      setOtherDocFile(Array.from(files));
                    } else {
                      setOtherDocFile(null);
                    }
                  }}
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
          <Modal.Header className="form-main-heading">
            <Modal.Title>Update Document Status</Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => setShowModal(false)}
            />
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
    </>
  );
};

export default DocumentSection;
